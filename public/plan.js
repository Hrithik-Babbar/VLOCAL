document.addEventListener('DOMContentLoaded', init, false);
function init() {
    const Res = document.querySelector('div');
    const val = document.querySelector('input');
    var bt = document.getElementById("bt");
    bt.addEventListener('click', function (event) {
        console.log("ddd");
        Res.innerHTML.append(val.value);
    });
};


function showPosition(position) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/nearby");
    var latitude = document.createElement("input");
    latitude.setAttribute("type", "text");
    latitude.setAttribute("name", "latitude");
    latitude.setAttribute("value", `${position.coords.latitude}`);
    var longitude = document.createElement("input");
    longitude.setAttribute("type", "text");
    longitude.setAttribute("name", "longitude");
    longitude.setAttribute("value", `${position.coords.longitude}`);
    form.appendChild(latitude);
    form.appendChild(longitude);
    document.body.appendChild(form);
    form.submit();
}