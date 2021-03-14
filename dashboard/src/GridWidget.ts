import UIComponent from "./UIComponent";

export interface GridPosition {
    row: number | "auto";
    col: number | "auto";
}

export interface GridSize {
    width: number | "auto";
    height: number | "auto";
}

export interface GridProps extends GridSize, GridPosition {}

interface GridWidgetProps extends GridProps {
    title?: string;
    body?: HTMLElement;
    className?: string;
}

class GridWidget extends UIComponent {
    private container: HTMLDivElement = document.createElement("div");
    private title: HTMLHeadingElement = document.createElement("h2");
    private body: HTMLElement = document.createElement("div");

    constructor(props: GridWidgetProps) {
        super();
        this.container.className = `widget${props.className ? ` ${props.className}` : ""}`;
        this.title.className = "widget-title";
        this.body.className = "widget-body";
        this.setTitle(props.title);
        this.setPosition({ row: props.row, col: props.col });
        this.setSize({ width: props.width, height: props.height });
        if (props.title) {
            this.container.append(this.title);
        }
        if (props.body) {
            this.body.append(props.body);
        }
        this.container.append(this.body);
    }

    setPosition(pos: GridPosition) {
        this.container.style.gridRowStart = `${pos.row}`;
        this.container.style.gridColumnStart = `${pos.col}`;
    }

    setSize(size: GridSize) {
        this.container.style.gridRowEnd = `span ${size.height}`;
        this.container.style.gridColumnEnd = `span ${size.width}`;
    }

    setTitle(newTitle: string) {
        this.title.innerText = newTitle;
    }

    replaceBody(newEl: HTMLElement) {
        this.body.replaceWith(newEl);
    }

    current() {
        return this.container;
    }
}

export default GridWidget;