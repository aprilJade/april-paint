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
    get size() { return this.m_top; };
}