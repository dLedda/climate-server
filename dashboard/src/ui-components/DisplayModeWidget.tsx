import GridWidget, {GridProps} from "./GridWidget";
import {AppStore, DisplayMode, getAppState} from "../StateStore";
import * as JSX from "../JSXFactory";
import UIComponent from "./UIComponent";

class DisplayModeWidget extends UIComponent {
    private skeleton: GridWidget;
    private minsCounterRef: number;
    private windowStartTimeRef: number;
    private windowStartTimeInputRef: number;
    private windowStopTimeRef: number;
    private windowStopTimeInputRef: number;
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
        AppStore().subscribeStoreVal("minutesDisplayed", () => this.updateDisplay());
        AppStore().subscribeStoreVal("displayMode", () => this.updateDisplay());
        AppStore().subscribeStoreVal("displayWindow", () => this.updateDisplay());
        AppStore().subscribeStoreVal("utcOffset", () => this.updateDisplay());
        this.updateDisplay();
    }

    private WindowStartTime({ ctx }: {ctx: DisplayModeWidget}) {
        ctx.windowStartTimeInputRef = ctx.makeRef(<input
            type={"datetime-local"}
            onblur={() => ctx.onWindowStartInputBlur()}
        />);
        ctx.windowStartTimeRef = ctx.makeRef(<div
            className={"display-mode-widget-date"}
            onwheel={(e: WheelEvent) => ctx.onStartTimeInputScroll(e)}
            onclick={() => ctx.onWindowStartDisplayClick()}>
            {new Date(getAppState().displayWindow.start + getAppState().utcOffset * 60 * 60 * 1000).toLocaleString()}
        </div>);
        return ctx.fromRef(ctx.windowStartTimeRef);
    }

    private WindowStopTime({ctx}: {ctx: DisplayModeWidget}) {
        ctx.windowStopTimeInputRef = ctx.makeRef(<input
            value={new Date()}
            type={"datetime-local"}
            onblur={() => ctx.onWindowStopInputBlur()}
        />);
        ctx.windowStopTimeRef = ctx.makeRef(<div
            className={"display-mode-widget-date"}
            onwheel={(e: WheelEvent) => ctx.onStopTimeInputScroll(e)}
            onclick={() => ctx.onWindowStopDisplayClick()}>
            {new Date(getAppState().displayWindow.stop + getAppState().utcOffset * 60 * 60 * 1000).toLocaleString()}
        </div>);
        return ctx.fromRef(ctx.windowStopTimeRef);
    }

    private MinutesCounter({ctx, onclick}: {ctx: DisplayModeWidget, onclick: () => any}) {
        ctx.minsInputRef = ctx.makeRef(
            <input
                value={getAppState().minutesDisplayed.toString()}
                onblur={(e: FocusEvent) => ctx.onMinutesCounterInputBlur(e)}/>);
        ctx.minsCounterRef = ctx.makeRef(
            <div className={"min-count"} onclick={onclick} onwheel={(e: WheelEvent) => ctx.onMinutesCounterInputScroll(e)}>
                {getAppState().minutesDisplayed.toString()}
            </div>);
        return ctx.fromRef(ctx.minsCounterRef);
    }

    private onMinutesCounterInputScroll(e: WheelEvent) {
        AppStore().setMinutesDisplayed(getAppState().minutesDisplayed + e.deltaY);
    }

    private onStopTimeInputScroll(e: WheelEvent) {
        const oldWin = getAppState().displayWindow;
        AppStore().setDisplayWindow({start: oldWin.start, stop: oldWin.stop - e.deltaY * 60});
    }

    private onStartTimeInputScroll(e: WheelEvent) {
        const oldWin = getAppState().displayWindow;
        AppStore().setDisplayWindow({start: oldWin.start - e.deltaY * 60, stop: oldWin.stop});
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

    private onWindowStopDisplayClick() {
        const stopTimeDisplay = this.fromRef(this.windowStopTimeRef);
        (stopTimeDisplay as HTMLInputElement).valueAsDate = new Date(getAppState().displayWindow.stop);
        const stopTimeInputDisplay = this.fromRef(this.windowStopTimeInputRef) as HTMLInputElement;
        stopTimeDisplay.replaceWith(stopTimeInputDisplay);
        const date = new Date(getAppState().displayWindow.stop * 1000 + getAppState().utcOffset * 60 * 60 * 1000);
        stopTimeInputDisplay.value = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
        stopTimeInputDisplay.focus();
    }

    private onWindowStopInputBlur() {
        const stopTimeInput = this.fromRef(this.windowStopTimeInputRef);
        const val = new Date((stopTimeInput as HTMLInputElement).value).getTime() / 1000;
        if (!isNaN(val)) {
            AppStore().setDisplayWindow({
                start: getAppState().displayWindow.start,
                stop: val
            });
        }
        stopTimeInput.replaceWith(this.fromRef(this.windowStopTimeRef));
    }

    private onWindowStartDisplayClick() {
        const startTimeDisplay = this.fromRef(this.windowStartTimeRef);
        (startTimeDisplay as HTMLInputElement).valueAsDate = new Date(getAppState().displayWindow.start);
        const startTimeInputDisplay = this.fromRef(this.windowStartTimeInputRef) as HTMLInputElement;
        startTimeDisplay.replaceWith(startTimeInputDisplay);
        const date = new Date(getAppState().displayWindow.start * 1000 + getAppState().utcOffset * 60 * 60 * 1000);
        startTimeInputDisplay.value = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
        startTimeInputDisplay.focus();

    }

    private onWindowStartInputBlur() {
        const startTimeInput = this.fromRef(this.windowStartTimeInputRef);
        const val = new Date((startTimeInput as HTMLInputElement).value).getTime() / 1000;
        if (!isNaN(val)) {
            AppStore().setDisplayWindow({
                start: val,
                stop: getAppState().displayWindow.stop,
            });
        }
        startTimeInput.replaceWith(this.fromRef(this.windowStartTimeRef));
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
                AppStore().setDisplayWindow({start: displayWindow.start - 60, stop: displayWindow.stop});
            }}/>
            <ctx.WindowStartTime ctx={ctx}/>
            <ctx.PlusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start + 60, stop: displayWindow.stop});
            }}/>
            <div>to</div>
            <ctx.MinusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start, stop: displayWindow.stop - 60});
            }}/>
            <ctx.WindowStopTime ctx={ctx}/>
            <ctx.PlusButton onclick={() => {
                const displayWindow = AppStore().getState().displayWindow;
                AppStore().setDisplayWindow({start: displayWindow.start, stop: displayWindow.stop + 60});
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
            const offset = getAppState().utcOffset * 60 * 60;
            const startDate = new Date((getAppState().displayWindow.start + offset) * 1000);
            const stopDate = new Date((getAppState().displayWindow.stop + offset) * 1000);
            this.fromRef(this.windowStartTimeRef).innerText = startDate.toLocaleString();
            this.fromRef(this.windowStopTimeRef).innerText = stopDate.toLocaleString();
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