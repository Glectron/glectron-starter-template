const wnd = document.querySelector("#window");
const titlebar = document.querySelector("#titlebar");

let offsetX, offsetY, beforeRect, topOff, leftOff, rightOff, bottomOff;
let dragWnd = false, resizeWnd = false;

addEventListener("popup", () => {
    centerWnd();
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
    dragWnd = resizeWnd = false;
});

const minHeight = 0;
const minWidth = 0;

addEventListener("globalmousemove", (e) => {
    if (dragWnd) {
        wnd.style.left = e.detail.x - offsetX + "px";
        wnd.style.top = e.detail.y - offsetY + "px";
    } else if (resizeWnd) {
        const dirs = wnd.style.cursor.split("-")[0];
        if (dirs.indexOf("n") != -1) {
            let nTop = e.detail.y - topOff;
            if (beforeRect.bottom - nTop > minHeight) {
                wnd.style.top = nTop + "px";
                wnd.style.height = beforeRect.bottom - nTop + "px";
            }
        }
        if (dirs.indexOf("w") != -1) {
            let nLeft = e.detail.x - leftOff;
            if (beforeRect.right - nLeft > minWidth) {
                wnd.style.left = nLeft + "px";
                wnd.style.width = beforeRect.right - nLeft + "px";
            }
        }
        if (dirs.indexOf("s") != -1) {
            let nHeight = e.detail.y + bottomOff - beforeRect.top;
            if (nHeight > minHeight) {
                wnd.style.height = nHeight + "px";
            }
        }
        if (dirs.indexOf("e") != -1) {
            let nWidth = e.detail.x + rightOff - beforeRect.left;
            if (nWidth > minWidth) {
                wnd.style.width = nWidth + "px";
            }
        }
    }
});

titlebar.addEventListener("mousedown", (e) => {
    if (wnd.style.cursor.indexOf("resize") != -1 || resizeWnd) return;
    if (e.target.classList.contains("no-drag") || e.target.closest(".no-drag")) {
        return;
    }
    dragWnd = true;
    let rect = titlebar.getBoundingClientRect();
    let x = e.screenX;
    let y = e.screenY;
    offsetX = x - rect.x;
    offsetY = y - rect.y;
    glectron.mouseCapture(true);
    glectron.globalMouseMove(true);
});

const resizeDist = 3;

wnd.addEventListener("mousemove", (e) => {
    if (dragWnd || resizeWnd) return;
    let rect = wnd.getBoundingClientRect();
    let x = e.screenX;
    let y = e.screenY;
    let toLeft = x - rect.x;
    let toTop = y - rect.y;
    let toRight = rect.right - x;
    let toBottom = rect.bottom - y;
    if (toTop <= resizeDist) {
        if (toLeft <= resizeDist) {
            wnd.style.cursor = "nw-resize";
        } else if (toRight <= resizeDist) {
            wnd.style.cursor = "ne-resize";
        } else {
            wnd.style.cursor = "n-resize";
        }
    } else if (toLeft <= resizeDist) {
        if (toBottom <= resizeDist) {
            wnd.style.cursor = "sw-resize";
        } else {
            wnd.style.cursor = "w-resize";
        }
    } else if (toBottom <= resizeDist) {
        if (toRight <= resizeDist) {
            wnd.style.cursor = "se-resize";
        } else {
            wnd.style.cursor = "s-resize";
        }
    } else if (toRight <= resizeDist) {
        wnd.style.cursor = "e-resize";
    } else {
        wnd.style.cursor = "";
    }
});

wnd.addEventListener("mousedown", (e) => {
    if (dragWnd) return;
    if (wnd.style.cursor.indexOf("resize") == -1) return;
    resizeWnd = true;
    let rect = wnd.getBoundingClientRect();
    let x = e.screenX;
    let y = e.screenY;
    leftOff = x - rect.x;
    topOff = y - rect.y;
    rightOff = rect.right - x;
    bottomOff = rect.bottom - y;
    beforeRect = rect;
    glectron.globalMouseMove(true);
    glectron.mouseCapture(true);
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
    wnd.style.visibility = "";
}