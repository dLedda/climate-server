export default abstract class UIComponent {
    public readonly id: number;
    private static componentCount = 0;
    private static reffedComponentCount = 0;
    private static readonly reffedComponents: HTMLElement[] = [];

    protected constructor() {
        this.id = UIComponent.componentCount;
        UIComponent.componentCount++;
    }

    protected makeRef(el: HTMLElement | DocumentFragment): number {
        UIComponent.reffedComponents.push(el as HTMLElement);
        return UIComponent.reffedComponentCount++;
    }

    protected fromRef(ref: number): HTMLElement | null {
        return UIComponent.reffedComponents[ref] ?? null;
    }

    abstract current(): HTMLElement;
}