const wnd = document.querySelector("#window");
var uiWnd;

addEventListener("glectronlibloaded", () => {
    uiWnd = new glectronui.Window(wnd);
    addEventListener("popup", () => {
        centerWnd();
        uiWnd.show();
    });
    addEventListener("unpopup", () => {
        uiWnd.hide();
    });
});

function centerWnd() {
    let w = window.innerWidth, h = window.innerHeight;
    let rect = wnd.getBoundingClientRect();
    let ww = rect.right - rect.x, wh = rect.bottom - rect.y;
    wnd.style.left = w / 2 - ww / 2 + "px";
    wnd.style.top = h / 2 - wh / 2 + "px";
}

function closeWnd() {
    glectron.unPopup();
}