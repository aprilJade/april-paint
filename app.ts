const canvas = <HTMLCanvasElement>document.getElementById("js-paint");
const context = <CanvasRenderingContext2D>canvas.getContext("2d");
const strokeInput = <HTMLInputElement>document.getElementById("js-line");

let b_painting: boolean = false;
let b_filling: boolean = false;

// initialize canvas
canvas.width = 700;
canvas.height = 700;
context.lineWidth = 2.5;
context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#000000";

// mouse move event listener
const onMouseMove = (event: MouseEvent) => {
    if (b_filling)
        return;
    if (!b_painting) {
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    } else {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }
};

const startPainting = () => (b_painting = true);
const stopPainting = () => (b_painting = false);

const onRangeChange = (e: Event) => {
    const target = e.target;
    context.lineWidth = (<HTMLInputElement>e.target).valueAsNumber;
};

const onColorClick = (e: MouseEvent) => {
    const target = <HTMLDivElement>e.target;
    context.strokeStyle = target.style.backgroundColor;
};

const startFilling = () => (b_filling = true);
const stopFilling = () => (b_filling = false);

const onCanvasClick = () => {
    if (b_filling) {
        context.closePath();
        context.beginPath();
        context.fillStyle = context.strokeStyle;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
};

const saveImage = () => {
    const a = <HTMLAnchorElement>document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    a.download = "paintJSExport";
    a.click();
}

let lineStarted: boolean = false;
const startDrawLine = () => (lineStarted = true);
const stopDrawLine = () => (lineStarted = false);

document.querySelectorAll<HTMLElement>(".color").forEach(color =>
    color.addEventListener("click", onColorClick, false)
);

canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mousedown", startPainting, false);
canvas.addEventListener("mouseup", stopPainting, false);
canvas.addEventListener("mouseleave", stopPainting, false);
canvas.addEventListener("click", onCanvasClick, false);

document.getElementById("js-fill")?.addEventListener("click", startFilling, false);
document.getElementById("js-draw")?.addEventListener("click", stopFilling, false);
document.getElementById("js-save")?.addEventListener("click", saveImage, false);

strokeInput.addEventListener("input", onRangeChange, false);
document.getElementById("js-line")?.addEventListener("click", startDrawLine, false);
document.getElementById("js-line")?.addEventListener("click", stopDrawLine, false);