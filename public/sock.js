const socket = io('http://localhost:8000');
const d = new Date();
const str = `${d}`
window.onload = function example() {
    const temp_name = str;
    socket.emit('new-user-joined', temp_name);
}
socket.on('user-joined', temp_name => {
    if (temp_name != str)
        window.location.reload();
})