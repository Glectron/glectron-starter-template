const wnd = document.querySelector("#window");
const titlebar = document.querySelector("#titlebar");

let offsetX, offsetY;

addEventListener("popup", () => {
    wnd.style.visibility = "visible";
});

addEventListener("glectronlibloaded", () => {
    glectron.onHitTest((_w, _h, x, y) => {
        const els = document.elementsFromPoint(x, y);
        if (els.find((val) => val == wnd)) {
            return true;
        }
    });
});

addEventListener("capturemouserelease", () => {
    glectron.globalMouseMove(false);
    glectron.mouseCapture(false);
});

addEventListener("globalmousemove", (e) => {
    wnd.style.left = e.detail.x - offsetX + "px";
    wnd.style.top = e.detail.y - offsetY + "px";
});

titlebar.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("no-drag")) {
        return;
    }
    let rect = titlebar.getBoundingClientRect();
    let x = e.screenX;
    let y = e.screenY;
    offsetX = x - rect.x;
    offsetY = y - rect.y;
    glectron.mouseCapture(true);
    glectron.globalMouseMove(true);
});

function closeWnd() {
    glectron.unPopup();
    wnd.style.visibility = "";
}