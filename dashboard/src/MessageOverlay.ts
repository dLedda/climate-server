import {AppStore, getAppState} from "./StateStore";
import UIComponent from "./UIComponent";

class MessageOverlay extends UIComponent {
    private element: HTMLDivElement;
    private textElement: HTMLSpanElement;
    private showingError = false;

    constructor() {
        super();
        this.build();
        AppStore().subscribeStoreVal("overlayText", () => this.update());
        AppStore().subscribeStoreVal("isLoading", () => this.update());
        AppStore().subscribeStoreVal("fatalError", () => this.showError());
        this.update();
    }

    private build() {
        this.element = document.createElement("div");
        this.element.classList.add("overlay", "center");
        this.textElement = document.createElement("span");
        this.textElement.innerText = "";
        this.element.appendChild(this.textElement);
    }

    private show() {
        this.element.classList.remove("hidden");
    }

    private hide() {
        this.element.classList.add("hidden");
    }

    private showError() {
        const err = getAppState().fatalError;
        this.showingError = true;
        this.element.innerText = `${err.name}: ${err.message}!`;
        this.show();
    }

    update() {
        if (!this.showingError) {
            let text: string;
            if (getAppState().isLoading) {
                text = "Loading...";
            } else if (getAppState().overlayText) {
                text = getAppState().overlayText;
            }
            if (text) {
                this.textElement.innerText = text;
                this.show();
            } else {
                this.hide();
            }
        }
    }

    current() {
        return this.element;
    }
}

export default MessageOverlay;