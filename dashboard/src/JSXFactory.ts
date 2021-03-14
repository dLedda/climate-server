export namespace JSX {
    export interface AttributeCollection {
        [name: string]: string | boolean | (() => any);
        className: string;
    }
    export type Element = HTMLElement;
    export interface ElementClass {
        render(): HTMLElement;
    }
    export interface IntrinsicElements {
        [key: string]: any;
    }
}

export type FunctionComponent<PropsType> = (props: PropsType, children?: any[]) => HTMLElement;

export function createElement(tagName: string | FunctionComponent<JSX.AttributeCollection>, attributes: JSX.AttributeCollection | null, ...children: any[]): HTMLElement {
    if (typeof tagName === "function") {
        if (children.length >= 1) {
            return tagName({...attributes}, children);
        }
        else {
            return tagName({...attributes});
        }
    }
    else {
        return standardElement(tagName, attributes, ...children);
    }
}

function standardElement(tagName: string, attributes: JSX.AttributeCollection | null, ...children: any[]) {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        const attributeValue = attributes[key];
        if (key.startsWith("on") && typeof attributeValue === "function") {
            element.addEventListener(key.substring(2), attributeValue);
        }
        else if (typeof attributeValue === "boolean" && attributeValue === true) {
            element.setAttribute(key, "");
        }
        else if (typeof attributeValue === "string") {
            if (key === "className") {
                element.setAttribute("class", attributes[key]);
            }
            else {
                element.setAttribute(key, attributeValue);
            }
        }
    }
    element.append(...createChildren(children));
    return element;
}

function createChildren(children: any[]): Node[] {
    const childrenNodes: Node[] = [];
    for (const child of children) {
        if (typeof child === "undefined" || child === null || typeof child === "boolean") {
            continue;
        }
        if (Array.isArray(child)) {
            childrenNodes.push(...createChildren(child));
        }
        else if (typeof child === "string") {
            childrenNodes.push(document.createTextNode(String(child)));
        }
        else if (child instanceof Node) {
            childrenNodes.push(child);
        }
    }
    return childrenNodes;
}
