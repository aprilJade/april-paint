const canvas = <HTMLCanvasElement>document.getElementById("april_canvas");
const context = <CanvasRenderingContext2D>canvas.getContext("2d");

let b_painting: boolean = false;
let b_filling: boolean = false;

canvas.width = 700;
canvas.height = 700;
context.lineWidth = 2.5;
context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#000000";

function OnMouseMove(event: MouseEvent): void 
{
    if (b_filling)
        return;

    if (!b_painting) 
    {
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    } 
    else 
    {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }
}

function StartPainting(): void 
{
    b_painting = true;
}

function StopPainting(): void 
{
    b_painting = false;
}

function OnClickColor(e: MouseEvent): void {
    if (e.target instanceof HTMLElement)
        context.strokeStyle = e.target.style.backgroundColor;
}

function StartFilling(): void 
{
    b_filling = true;
}

function StopFilling(): void
{
    b_filling = false;
}

function OnClickCanvas(): void
{
    if (b_filling) 
    {
        context.closePath();
        context.beginPath();
        context.fillStyle = context.strokeStyle;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function OnClickSaveImage(): void 
{
    const a = <HTMLAnchorElement>document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    a.download = "paintJSExport";
    a.click();
}

function OnChangeInput(e: Event): void 
{
    if (e.target instanceof HTMLInputElement)
        context.lineWidth = e.target.valueAsNumber;
}

document.querySelectorAll<HTMLElement>(".color").forEach(color =>
    color.addEventListener("click", OnClickColor, false)
);

canvas.addEventListener("mousemove", OnMouseMove, false);
canvas.addEventListener("mousedown", StartPainting, false);
canvas.addEventListener("mouseup", StopPainting, false);
canvas.addEventListener("mouseleave", StopPainting, false);
canvas.addEventListener("click", OnClickCanvas, false);

document.getElementById("fill_button")?.addEventListener("click", StartFilling, false);
document.getElementById("paint_button")?.addEventListener("click", StopFilling, false);
document.getElementById("save_button")?.addEventListener("click", OnClickSaveImage, false);
document.getElementById("line_width_control_input")?.addEventListener("input", OnChangeInput, false);