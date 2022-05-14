class IPos 
{
    private m_x: number;
    private m_y: number;
    constructor(x:number, y: number)
    {
        this.m_x = x;
        this.m_y = y;
    }
    public get x(): number { return this.m_x; };
    public get y(): number { return this.m_y; };
    public setPos(x:number, y:number) 
    {
        this.m_x = x;
        this.m_y = y;
    }
}


enum e_drawingMode
{
    fill,
    normal,
    line
}

const canvas = <HTMLCanvasElement>document.getElementById("april_canvas");
const context = <CanvasRenderingContext2D>canvas.getContext("2d");

let b_painting: boolean = false;
let b_filling: boolean = false;
let b_drawLine: boolean = false;

canvas.width = 800;
canvas.height = 800;
context.lineWidth = 2.5;
context.strokeStyle = "#000000";
let startPos: IPos = new IPos(0, 0);
let drawingMode: e_drawingMode;

drawingMode = e_drawingMode.normal;

function EraseCanvas(): void
{
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

EraseCanvas();

function OnMouseMove(event: MouseEvent): void 
{
    if (b_painting) 
    {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    } 
    else 
    {
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    }
}

function OnMouseDown(event: MouseEvent): void
{
    switch (drawingMode)
    {
        case e_drawingMode.fill:
            b_filling = true;
            break;
        case e_drawingMode.line:
            b_drawLine = true;
            startPos.setPos(event.offsetX, event.offsetY);
            break;
        case e_drawingMode.normal:
            b_painting = true;
            break;
        default:
            break;
    }
}

function OnMouseUp(event: MouseEvent): void
{
    if (b_drawLine)
    {
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        b_drawLine = false;
    }
    if (b_painting)
    {
        b_painting = false;
    }
}

function OnMouseLeave(): void
{
    b_painting = false;
    b_drawLine = false;
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
    canvas.addEventListener("mousedown", OnMouseDown);
    canvas.addEventListener("mouseup", OnMouseUp);
    canvas.addEventListener("click", OnClickCanvas);
    canvas.addEventListener("mouseleave", OnMouseLeave);
}

document.getElementById("fill_button")?.addEventListener("click",
    () => (drawingMode = e_drawingMode.fill)
);

document.getElementById("paint_button")?.addEventListener("click",
    () => (drawingMode = e_drawingMode.normal)
);

document.getElementById("line_button")?.addEventListener("click",
    () => (drawingMode = e_drawingMode.line)
);

document.getElementById("save_button")?.addEventListener("click", OnClickSaveImage);
document.getElementById("erase_button")?.addEventListener("click", EraseCanvas);
document.getElementById("line_width_control")?.addEventListener("input", OnChangeInput);