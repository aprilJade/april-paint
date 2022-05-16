class CStack
{
    private data: string[];
    private m_top: number;

    constructor()
    {
        this.data = [];
        this.m_top = 0;
    }

    public pop(): string | null
    {
        if (this.m_top > 0)
            return this.data[this.m_top--];
        return null;
    }

    public push(data: string): void
    {
        this.data[++this.m_top] = data;
    }

    public top(): string | null
    {
        return this.data[this.m_top];
    }

    public flush(): void
    {
        this.data = [];
    }

    get size() { return this.m_top; };
}

class CPos 
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
    line,
    rectangle
}

const canvas = <HTMLCanvasElement>document.getElementById("april_canvas");
const context = <CanvasRenderingContext2D>canvas.getContext("2d");

let b_painting: boolean = false;
let b_filling: boolean = false;
let b_drawLine: boolean = false;
let b_drawRect: boolean = false;

canvas.width = 800;
canvas.height = 800;
context.lineWidth = 2.5;
context.strokeStyle = "#000000";
let startPos: CPos = new CPos(0, 0);
let drawingMode: e_drawingMode;
const img = new Image();
drawingMode = e_drawingMode.normal;
const undoStack = new CStack();
const redoStack = new CStack();

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

    if (b_drawLine)
    {
        context.drawImage(img, 0, 0);
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }

    if (b_drawRect)
    {
        context.drawImage(img, 0, 0);
        context.strokeRect(startPos.x , startPos.y,
            event.offsetX - startPos.x, event.offsetY - startPos.y);
    }
}

function OnMouseDown(event: MouseEvent): void
{
    undoStack.push(canvas.toDataURL());
    redoStack.flush();
    switch (drawingMode)
    {
        case e_drawingMode.fill:
            b_filling = true;
            break;
        case e_drawingMode.line:
            b_drawLine = true;
            img.src = canvas.toDataURL();
            startPos.setPos(event.offsetX, event.offsetY);
            break;
        case e_drawingMode.rectangle:
            b_drawRect = true;
            img.src = canvas.toDataURL();
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

    if (b_drawRect)
    {
        context.beginPath();
        context.strokeRect(startPos.x , startPos.y,
            event.offsetX - startPos.x, event.offsetY - startPos.y);
        b_drawRect = false;
    }

    if (b_painting)
        b_painting = false;
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

function Undo():void
{
    let buf: string | null;
    buf = undoStack.pop();
    if (buf !== null)
    {
        redoStack.push(canvas.toDataURL());
        img.src = buf;
        img.onload = () => context.drawImage(img, 0, 0);
    }
}

function Redo():void
{
    let buf: string | null;
    buf = redoStack.pop();
    if (buf !== null)
    {
        undoStack.push(canvas.toDataURL());
        img.src = buf;
        img.onload = () => context.drawImage(img, 0, 0);
    }
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

document.getElementById("rect_button")?.addEventListener("click",
    () => (drawingMode = e_drawingMode.rectangle)
);

document.getElementById("save_button")?.addEventListener("click", OnClickSaveImage);
document.getElementById("erase_button")?.addEventListener("click", EraseCanvas);
document.getElementById("line_width_control")?.addEventListener("input", OnChangeInput);
document.getElementById("undo_button")?.addEventListener("click", Undo);
document.getElementById("redo_button")?.addEventListener("click", Redo);

window.onkeydown = (event: KeyboardEvent) => 
{
    if (event.ctrlKey)
    {
        if (event.key === "z")
            Undo();
        else if (event.key === "Z")
            Redo();
    }
}