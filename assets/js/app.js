const CANVAS = document.getElementById('canvas');

let IMGUR_URL = '';
let IMAGE_BG = null;
let WIDTH = 0;
let HEIGHT = 0;
let WORDS = [];

function initData() {

    $.getJSON("/assets/data.json", function (data) {
        WORDS = data;
        WORDS.sort(function() { return 0.5 - Math.random() });

        document.fonts.ready.then(function () {
            initCanvas();
        });

        document.fonts.onloadingdone = function (fontFaceSetEvent) {
            initCanvas();
        };
    });
}

function resizeCanvasToDisplaySize(canvas) {
   // look up the size the canvas is being displayed
   WIDTH = canvas.clientWidth;
   HEIGHT = canvas.clientHeight;

   // If it's resolution does not match change it
   if (canvas.width !== WIDTH || canvas.height !== HEIGHT) {
     canvas.width = WIDTH;
     canvas.height = HEIGHT;
     return true;
   }

   return false;
}

function getFontSize() {
    // return (WIDTH * 94 / 100 / 10);
    return (WIDTH * 50 / 100 / 10);
}

function drawText() {
    let ctx = CANVAS.getContext('2d');
    let fontSize = getFontSize();
    ctx.font = fontSize + 'px "Noto Sans TC"';
    ctx.fillStyle = '#eee';
    let lineHeight = fontSize * 1.3;
    let lines = WORDS[0].split('\n');
    if (!Array.isArray(lines)) {
        lines = [WORDS[0]];
    }

    let baseY = (HEIGHT - lineHeight * lines.length ) / 2 + lineHeight / 1.3;

    for (let i = 0; i<lines.length; i++) {
        measureText = ctx.measureText(lines[i]);
        ctx.fillText(lines[i],
            (WIDTH - measureText.width) / 2,
            baseY + i * lineHeight
        );
    }
}

function drawBG() {
    let ctx = CANVAS.getContext('2d');

    ctx.drawImage(IMAGE_BG, 0, 0, WIDTH, HEIGHT);
    StackBlur.canvasRGB(CANVAS, 0, 0, WIDTH, HEIGHT, 4);

    var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0,'rgba(0, 0, 0, 0.2)');
    grd.addColorStop(1,'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function initCanvas() {
    let ctx = CANVAS.getContext('2d');
    resizeCanvasToDisplaySize(ctx.canvas);
    if (IMAGE_BG) {
        drawBG();
        drawText();
        return;
    }

    IMAGE_BG = new Image();
    IMAGE_BG.onload = function() {
        drawBG();
        drawText();
        $('#overlay').hide();
    };
    IMAGE_BG.crossOrigin = 'Anonymous';
    // IMAGE_BG.src = 'https://source.unsplash.com/' + WIDTH + 'x' + HEIGHT;
    IMAGE_BG.src = 'https://source.unsplash.com/' + WIDTH + 'x' + HEIGHT + '/?random';
}

$(document).ready(function() {
    initData();
    $(window).resize(function() {
        let ctx = CANVAS.getContext('2d');
        resizeCanvasToDisplaySize(ctx.canvas);
        drawBG();
        drawText();
    });

    if (location.href.indexOf('notion') > -1) {
        $('.footer').hide();
    }
});