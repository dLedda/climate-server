import {AppStore, getAppState} from "../StateStore";
import GridWidget, {GridProps} from "./GridWidget";
import UIComponent from "./UIComponent";
import * as JSX from "../JSXFactory";

class TimerWidget extends UIComponent {
    private readonly display: HTMLElement;
    private skeleton: GridWidget;
    private nextUpdateTime: number;
    private timerRef: number;
    private lastUpdateRef: number;

    constructor(gridProps: GridProps) {
        super();
        this.display = <this.MainDisplay ctx={this}/>;
        this.skeleton = new GridWidget({
            ...gridProps,
            className: "timer-widget",
            title: "Next update in:",
            body: this.display,
        });
        AppStore().subscribeStoreVal("lastUpdateTime", () => this.resetTimer());
        AppStore().subscribeStoreVal("utcOffset", () => this.resetTimer());
        setInterval(() => this.refreshTimer(), 10);
        this.resetTimer();
    }

    private resetTimer() {
        this.nextUpdateTime = getAppState().lastUpdateTime + getAppState().updateIntervalSeconds;
        this.updateUpdateText();
        this.refreshTimer();
    }

    private updateUpdateText() {
        this.fromRef(this.lastUpdateRef).innerText = new Date(getAppState().lastUpdateTime * 1000 + getAppState().utcOffset * 60 * 60 * 1000).toLocaleString();
    }

    private MainDisplay({ ctx }: { ctx: TimerWidget }) {
        ctx.timerRef = ctx.makeRef(<div className={"countdown"}/>);
        ctx.lastUpdateRef = ctx.makeRef(
            <span className={"last-update"}>
                {new Date(getAppState().lastUpdateTime).toLocaleString()}
            </span>);
        return (<div>
            {ctx.fromRef(ctx.timerRef)}
            <div>
                <div className={"last-update"}>Last update was at:</div>
                <div>{ctx.fromRef(ctx.lastUpdateRef)}</div>
            </div>
        </div>);
    }

    private refreshTimer() {
        const now = new Date().getTime() / 1000;
        if (now <= this.nextUpdateTime) {
            this.fromRef(this.timerRef).innerText = `${(this.nextUpdateTime - now).toFixed(2)}s`;
        } else {
            this.fromRef(this.timerRef).innerText = "0.00s";
        }
    }

    current() {
        return this.skeleton.current();
    }
}

export default TimerWidget;