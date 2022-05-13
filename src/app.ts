const canvas = <HTMLCanvasElement>document.getElementById("april_canvas");
const context = <CanvasRenderingContext2D>canvas.getContext("2d");

let b_painting: boolean = false;
let b_filling: boolean = false;

canvas.width = 800;
canvas.height = 800;
context.lineWidth = 2.5;
context.strokeStyle = "#000000";

function EraseCanvas(): void
{
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

EraseCanvas();

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

function OnClickColor(e: MouseEvent): void {
    if (e.target instanceof HTMLElement)
        context.strokeStyle = e.target.style.backgroundColor;
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
    color.addEventListener("click", OnClickColor)
);

if (canvas instanceof HTMLCanvasElement)
{
    canvas.addEventListener("mousemove", OnMouseMove);
    canvas.addEventListener("mousedown", () => (b_painting = true));
    canvas.addEventListener("mouseup", () => (b_painting = false));
    canvas.addEventListener("mouseleave", () => (b_painting = false));
    canvas.addEventListener("click", OnClickCanvas);
}

document.getElementById("fill_button")?.addEventListener("click", () => (b_filling = true));
document.getElementById("paint_button")?.addEventListener("click", () => (b_filling = false));
document.getElementById("save_button")?.addEventListener("click", OnClickSaveImage);
document.getElementById("erase_button")?.addEventListener("click", EraseCanvas);

document.getElementById("line_width_control")?.addEventListener("input", OnChangeInput);