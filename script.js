function add() {
    let screen = document.getElementById("screen");
    let a = screen.value;
    let b = a.charAt(a.length - 1);
    if (b == '+' || b == '-' || b == '*' || b == '/') {
        screen.value = a.substring(0, a.length - 1) + '+';
    } else {
        screen.value += '+';
    }
}
function sub() {
    let screen = document.getElementById("screen");
    let a = screen.value;
    let b = a.charAt(a.length - 1);
    if (b == '+' || b == '-' || b == '*' || b == '/') {
        screen.value = a.substring(0, a.length - 1) + '-';
    } else {
        screen.value += '-';
    }
}
function div() {
    let screen = document.getElementById("screen");
    let a = screen.value;
    let b = a.charAt(a.length - 1);
    if (b == '+' || b == '-' || b == '*' || b == '/') {
        screen.value = a.substring(0, a.length - 1) + '/';
    } else {
        screen.value += '/';
    }
}
function mul() {
    let screen = document.getElementById("screen");
    let a = screen.value;
    let b = a.charAt(a.length - 1);
    if (b == '+' || b == '-' || b == '*' || b == '/') {
        screen.value = a.substring(0, a.length - 1) + '*';
    } else {
        screen.value += '*';
    }
}
document.getElementById("backspace").onclick = function() {
    let screen = document.getElementById("screen");
    screen.value = screen.value.slice(0, -1);
};