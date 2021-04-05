import {AppStore, getAppState} from "../StateStore";
import UIComponent from "./UIComponent";
import * as JSX from "../JSXFactory";
import MovePic from "../../assets/move-example.gif";
import ZoomPic from "../../assets/zoom-example.gif";
import ScrollPic from "../../assets/scroll-date-example.gif";

class HelpModal extends UIComponent {
    private element: HTMLElement;
    private visible = false;

    constructor() {
        super();
        this.build();
        AppStore().subscribeStoreVal("showingHelp", () => this.update());
        this.update();
    }

    private build() {
        this.element = (
            <div className={"center"}>
                <div
                    className={"overlay center"}
                    onclick={() => this.hide()}/>
                <div className={"help-box"}>
                    <div
                        className={"x-button button"}
                        onclick={() => this.hide()}/>
                    <h1>Quick Help</h1>
                    <div className={"image-advice"}>
                        <img alt={"Animated example of scrolling over display timestamps"} src={ScrollPic}/>
                        <div>
                            Clicking the plus and minus buttons will adjust the time spans and minute spans by one minute.
                            Try scrolling over the numbers or clicking on them for direct editing as well!
                        </div>
                    </div>
                    <div className={"image-advice"}>
                        <img alt={"Animated example of dragging back and forth on the chart"} src={MovePic}/>
                        <div>
                            Dragging over the chart will switch to time window mode and allow you to pan back and forth.
                        </div>
                    </div>
                    <div className={"image-advice"}>
                        <img alt={"Animated example of zooming in and out on the chart"} src={ZoomPic}/>
                        <div>
                            Try scrolling whilst hovering over the chart to zoom in and out.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private show() {
        this.visible = true;
        this.element.classList.remove("hidden");
        AppStore().showHelp();
    }

    private hide() {
        this.visible = false;
        this.element.classList.add("hidden");
        AppStore().hideHelp();
    }

    update() {
        this.visible = getAppState().showingHelp;
        if (this.visible) {
            this.element.classList.remove("hidden");
        } else {
            this.element.classList.add("hidden");
        }
    }

    current() {
        return this.element;
    }
}

export default HelpModal;