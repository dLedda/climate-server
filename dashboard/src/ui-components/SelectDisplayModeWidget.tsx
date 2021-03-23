import UIComponent from "./UIComponent";
import * as JSX from "../JSXFactory";
import GridWidget, {GridProps} from "./GridWidget";
import {AppStore, DisplayMode, getAppState} from "../StateStore";

export default class SelectDisplayModeWidget extends UIComponent {
    private mainBody: HTMLElement;
    private gridWidgetSkeleton: GridWidget;
    private windowInputRef: number;
    private minSpanInputRef: number;
    constructor(gridProps: GridProps) {
        super();
        this.mainBody = this.MainBody({ctx: this});
        this.gridWidgetSkeleton = new GridWidget({
            ...gridProps,
            title: "Display Mode:",
            body: this.mainBody,
        });
        AppStore().subscribeStoreVal("displayMode", () => this.update());
    }

    private selectMode(mode: DisplayMode) {
        AppStore().setDisplayMode(mode);
    }

    private update() {
        const windowedMode = getAppState().displayMode === "window";
        (this.fromRef(this.windowInputRef) as HTMLInputElement).checked = windowedMode;
        (this.fromRef(this.minSpanInputRef) as HTMLInputElement).checked = !windowedMode;
    }

    private MainBody({ ctx }: { ctx: SelectDisplayModeWidget }) {
        const isInWindowMode = getAppState().displayMode === "window";
        ctx.windowInputRef = this.makeRef(<input
            type={"radio"}
            id={"window"}
            name={"display-mode"}
            checked={isInWindowMode}
            onclick={() => ctx.selectMode("window")}/>);
        ctx.minSpanInputRef = this.makeRef(<input
            type={"radio"}
            id={"min-span"}
            name={"display-mode"}
            checked={!isInWindowMode}
            onclick={() => ctx.selectMode("pastMins")}/>);
        return (<div>
            <div>
                {this.fromRef(ctx.windowInputRef)}
                <label htmlFor={"window"}>Time Window</label>
            </div>
            <div>
                {this.fromRef(ctx.minSpanInputRef)}
                <label htmlFor={"minSpan"}>Rolling Minute Span</label>
            </div>
        </div>);
    }

    current() {
        return this.gridWidgetSkeleton.current();
    }
}
