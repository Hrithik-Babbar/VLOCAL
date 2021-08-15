const socket = io.connect();
let d = new Date();
let str = `${d}`
function example() {
    const temp_name = str;
    console.log("1st" + str);
    socket.emit('new-user-joined', temp_name);
}
socket.on('user-joined', temp_name => {
    console.log("2nd " + temp_name);
})