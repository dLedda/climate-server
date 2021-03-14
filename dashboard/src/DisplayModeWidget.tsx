import GridWidget, {GridProps} from "./GridWidget";
import {AppStore, DisplayMode, getAppState} from "./StateStore";
import * as JSX from "./JSXFactory";
import UIComponent from "./UIComponent";

class DisplayModeWidget extends UIComponent {
    private skeleton: GridWidget;
    private minsCounterRef: number;
    private windowStartTimeRef: number;
    private windowStopTimeRef: number;
    private windowedDisplayRef: number;
    private minsDisplayRef: number;
    private mainDisplay: HTMLElement;
    private minsInputRef: number;

    constructor(gridProps: GridProps) {
        super();
        this.mainDisplay = this.MainDisplay({ctx: this});
        this.skeleton = new GridWidget({
            ...gridProps,
            title: "Displaying:",
            body: this.mainDisplay,
        });
        AppStore().subscribe("minutesDisplayed", () => this.updateDisplay());
        AppStore().subscribe("displayMode", () => this.updateDisplay());
        AppStore().subscribe("displayWindow", () => this.updateDisplay());
    }

    private WindowStartTime({ ctx }: {ctx: DisplayModeWidget}) {
        ctx.windowStartTimeRef = ctx.makeRef(<div
            className={"display-mode-widget-date"}>
            {new Date(getAppState().displayWindow.start).toLocaleString()}
        </div>);
        return ctx.fromRef(ctx.windowStartTimeRef);
    }

    private WindowStopTime({ctx}: {ctx: DisplayModeWidget}) {
        ctx.windowStopTimeRef = ctx.makeRef(<div
            className={"display-mode-widget-date"}>
            {new Date(getAppState().displayWindow.stop).toLocaleString()}
        </div>);
        return ctx.fromRef(ctx.windowStopTimeRef);
    }

    private MinutesCounter({ctx, onclick}: {ctx: DisplayModeWidget, onclick: () => any}) {
        ctx.minsInputRef = ctx.makeRef(
            <input
                value={getAppState().minutesDisplayed.toString()}
                onblur={(e: FocusEvent) => ctx.onMinutesCounterInputBlur(e)}/>);
        ctx.minsCounterRef = ctx.makeRef(
            <div className={"min-count"} onclick={onclick}>
                {getAppState().minutesDisplayed.toString()}
            </div>);
        return ctx.fromRef(ctx.minsCounterRef);
    }

    private onMinutesCounterInputBlur(e: FocusEvent) {
        const input = Number((e.target as HTMLInputElement).value);
        if (!isNaN(input)) {
            if (input >= 1) {
                AppStore().setMinutesDisplayed(input);
            }
        } else {
            (e.target as HTMLInputElement).value = getAppState().minutesDisplayed.toString();
        }
        this.fromRef(this.minsInputRef).replaceWith(this.fromRef(this.minsCounterRef));
    }

    private MinutesDisplay({ctx}: {ctx: DisplayModeWidget}) {
        return (<div className={"display-mode-widget-mins"}>
            <div>Last</div>
            <ctx.MinusButton onclick={() => {
                const mins = AppStore().getState().minutesDisplayed;
                AppStore().setMinutesDisplayed(mins - 1);
            }}/>
            <ctx.MinutesCounter ctx={ctx} onclick={() => ctx.onMinutesCounterClick()}/>
            <ctx.PlusButton onclick={() => {
                const mins = AppStore().getState().minutesDisplayed;
                AppStore().setMinutesDisplayed(mins + 1);
            }}/>
            <div>minutes</div>
        </div>);
    }

    private onMinutesCounterClick() {
        const input = this.fromRef(this.minsInputRef) as HTMLInputElement;
        this.fromRef(this.minsCounterRef).replaceWith(input);
        input.focus();
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
    }

    private MinusButton(props: {onclick: () => any}) {
        return <div
            className={"minus-button"}
            onclick={props.onclick}
        />;
    }

    private PlusButton(props: {onclick: () => any}) {
        return <div
            className={"plus-button"}
            onclick={props.onclick}
        />;
    }

    private WindowedDisplay({ctx}: {ctx: DisplayModeWidget}) {
        return (<div>
            <div>From</div>
            <ctx.MinusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start - 60000, stop: displayWindow.stop});
            }}/>
            <ctx.WindowStartTime ctx={ctx}/>
            <ctx.PlusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start + 60000, stop: displayWindow.stop});
            }}/>
            <div>to</div>
            <ctx.MinusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start, stop: displayWindow.stop - 60000});
            }}/>
            <ctx.WindowStopTime ctx={ctx}/>
            <ctx.PlusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start, stop: displayWindow.stop + 60000});
            }}/>
        </div>);
    }

    private MainDisplay({ ctx }: { ctx: DisplayModeWidget }) {
        const windowMode = getAppState().displayMode === "window";
        ctx.windowedDisplayRef = ctx.makeRef(<ctx.WindowedDisplay ctx={ctx}/>);
        ctx.minsDisplayRef = ctx.makeRef(<ctx.MinutesDisplay ctx={ctx}/>);
        return <div className={"display-mode-widget"}>
            {windowMode
                ? ctx.fromRef(ctx.windowedDisplayRef)
                : ctx.fromRef(ctx.minsDisplayRef)}
        </div> as HTMLElement;
    }

    private onSelectMode(mode: DisplayMode) {
        AppStore().setDisplayMode(mode);
    }

    private updateDisplay() {
        if (getAppState().displayMode === "window") {
            this.mainDisplay.children.item(0).replaceWith(this.fromRef(this.windowedDisplayRef));
            this.fromRef(this.windowStartTimeRef).innerText = new Date(getAppState().displayWindow.start).toLocaleString();
            this.fromRef(this.windowStopTimeRef).innerText = new Date(getAppState().displayWindow.stop).toLocaleString();
        } else {
            this.mainDisplay.children.item(0).replaceWith(this.fromRef(this.minsDisplayRef));
            this.fromRef(this.minsCounterRef).innerText = getAppState().minutesDisplayed.toString();
            (this.fromRef(this.minsInputRef) as HTMLInputElement).value = getAppState().minutesDisplayed.toString();
        }
    }

    current() {
        return this.skeleton.current();
    }
}

export default DisplayModeWidget;