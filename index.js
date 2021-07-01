const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Vendor = require('./models/vendor');
const Room = require('./models/room');
const Convo = require('./models/convo');
const path = require('path');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const { isLoggedIN } = require('./middleware');
//connecting to mongodb instance running on 27017 of localhost
mongoose.connect('mongodb://localhost:27017/Vendor', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, useFindAndModify: false })
    .then(() => {
        console.log("DataBase Connected");
    })
    .catch(err => {
        console.log("DataBase Not Connected");
    })


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const sessionConfig = {
    secret: 'tempsecret',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        //it prevents user scripts for getting cookie
        expires: Date.now() + 1000 * 60 * 60,
        maxAge: 1000 * 60 * 60
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
//use localstrategy and use method user.authenticate as authentication method of user model
passport.use(new LocalStrategy(User.authenticate()));
//user is added in the session
passport.serializeUser(User.serializeUser());
//how we get user from the cookies
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})
app.get('/register', (req, res) => {
    res.render('users/register');
})
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    res.redirect('/vendors');
})
app.get('/vendors', async (req, res) => {
    const vendors = await Vendor.find({});
    res.render('vendors/index', { vendors });
})
app.get('/login', (req, res) => {
    res.render('users/login');
})
//following function compare hashed version of pass from req.body.user with hashed pass in db
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/vendors');
})
app.get('/vendors/new', isLoggedIN, (req, res) => {

    res.render('vendors/new');
})
app.post('/vendors', async (req, res) => {
    const vendor = new Vendor(req.body.vendor);
    vendor.username = req.user.username;
    await vendor.save();
    res.redirect('/vendors');
})
app.get('/vendors/:vname/clients/:uname', async (req, res) => {
    const droom = await Room.findOne({ vendorname: req.params.vname, username: req.params.uname }).populate("convos")
    res.render('vendors/room', { arg: droom });
})
app.get('/vendors/:vname/clients', async (req, res) => {
    const rooms = await Room.find({ vendorname: req.params.vname }).populate("convos");
    if (rooms.length) {
        res.render('vendors/client', { rooms });
    }
    else {
        res.send("No room");
    }
})
//initially i created room only then i set its association with comments next i will be showing comments with user name
//find returned a array i rectified it by find one also can be done by destructuring
app.get('/vendors/:vname', isLoggedIN, async (req, res) => {
    if (req.params.vname == req.user.username) {
        res.redirect(`/vendors/${req.params.vname}/clients`);
    }
    else {
        const froom = await Room.findOne({ vendorname: req.params.vname, username: req.user.username }).populate("convos");
        if (froom) {
            res.render('vendors/room', { arg: froom });
        }
        else {
            console.log("new");
            const room = new Room({ title: req.params.vname, vendorname: req.params.vname, username: req.user.username })
            //i forgot to save then i checked db
            await room.save();
            res.render('vendors/room', { arg: room });
        }
    }

})
app.post('/vendors/:vname/:uname/convos', async (req, res) => {
    const room = await Room.findOne({ vendorname: req.params.vname, username: req.params.uname });
    const convo = new Convo(req.body.convo);
    convo.username = req.user.username;
    await room.convos.push(convo);
    await convo.save();
    await room.save();
    if (req.params.vname == req.user.username) {
        res.redirect(`/vendors/${req.params.vname}/clients/${req.params.uname}`);
    }
    else {
        res.redirect(`/vendors/${room.vendorname}`);
    }
})
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/vendors');
})
app.listen(3000, () => {
    //app.listen set port which will listen to our request
})