const socket = io.connect();
const d = new Date();
const str = `${d}`
window.onload = function example() {
    const temp_name = str;
    socket.emit('new-user-joined', temp_name);
}
socket.on('user-joined', temp_name => {
    console.log('hi');
    if (temp_name != str)
        window.location.reload();
})