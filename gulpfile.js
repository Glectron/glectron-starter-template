const fs = require("fs");
const gulp = require("gulp");
const replace = require("gulp-replace");

function btoaUTF8(string, bomit) {
    return btoa((bomit ? "\xEF\xBB\xBF" : "") + string.replace(/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, function(nonAsciiChars) {
        const fromCharCode = String.fromCharCode;
        let point = nonAsciiChars.charCodeAt(0);
        if (point >= 0xD800 && point <= 0xDBFF) {
            var nextcode = nonAsciiChars.charCodeAt(1);
            if (nextcode !== nextcode) // NaN because string is 1 code point long
                return fromCharCode(0xef/*11101111*/, 0xbf/*10111111*/, 0xbd/*10111101*/);
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
                point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
                if (point > 0xffff)
                    return fromCharCode(
                        (0x1e/*0b11110*/<<3) | (point>>>18),
                        (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/),
                        (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
                        (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
                    );
            } else return fromCharCode(0xef, 0xbf, 0xbd);
        }

        if (point <= 0x007f) return nonAsciiChars;
        else if (point <= 0x07ff) {
            return fromCharCode((0x6<<5)|(point>>>6), (0x2<<6)|(point&0x3f));
        } else return fromCharCode(
            (0xe/*0b1110*/<<4) | (point>>>12),
            (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
            (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
        );
    }));
}

async function html() {
    const inliner = await import("glectron-inliner");
    return inliner.default("html/index.html").then((val) => {
        if (!fs.existsSync("dist")) fs.mkdirSync("dist");
        fs.writeFileSync("dist/app.html", val, "utf-8");
    });
}

function lua() {
    const html = fs.readFileSync("dist/app.html", {encoding: "utf-8"});

    return gulp.src("lua/**/*.lua", {base: "src/"})
        .pipe(replace("%HTML_SOURCE%", btoaUTF8(html)))
        .pipe(gulp.dest("dist/lua"));
}

const build = gulp.series(html, lua);

function watch() {
    gulp.watch("html", build);
    gulp.watch("lua", lua);
}

exports.watch = watch;
exports.default = build;