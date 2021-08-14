const socket = io.connect();
const d = new Date();
const str = `${d}`
window.onload = function example() {
    const temp_name = str;
    console.log("1st" + str);
    socket.emit('new-user-joined', temp_name);
}
socket.on('user-joined', temp_name => {
    if (temp_name != str) {
        console.log("2nd " + temp_name);
        window.location.reload();
    }
})