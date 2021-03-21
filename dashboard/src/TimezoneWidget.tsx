import GridWidget, {GridProps} from "./GridWidget";
import {AppStore, getAppState} from "./StateStore";
import UIComponent from "./UIComponent";
import * as JSX from "./JSXFactory";

class TimezoneWidget extends UIComponent {
    private skeleton: GridWidget;
    private display: HTMLSpanElement = document.createElement("span");
    private timezoneInputRef: number;
    private timezoneDisplayRef: number;

    constructor(gridProps: GridProps) {
        super();
        this.display = <this.MainBody ctx={this}/>;
        this.skeleton = new GridWidget({
            ...gridProps,
            title: "Displayed Timezone:",
            body: this.display,
        });
        AppStore().subscribeStoreVal("utcOffset", () => this.updateDisplay());
        this.updateDisplay();
    }

    private updateDisplay() {
        const offset = AppStore().getState().utcOffset;
        this.fromRef(this.timezoneDisplayRef).innerText = `${offset > 0 ? "+" : "−"} ${Math.abs(offset)}`;
        (this.fromRef(this.timezoneInputRef) as HTMLInputElement).value = `${offset > 0 ? "" : "-"}${Math.abs(offset)}`;
    }

    private MainBody({ctx}: {ctx: TimezoneWidget}) {
        return <div
            className={"timezone-widget"}
            onclick={() => ctx.onTimezoneClick()}>
            <span>UTC </span>
            <ctx.TimezoneDisplay ctx={ctx} />
            <span>:00</span>
        </div>;
    }

    private TimezoneDisplay({ctx}: {ctx: TimezoneWidget}) {
        ctx.timezoneDisplayRef = ctx.makeRef(<span/>);
        ctx.timezoneInputRef = ctx.makeRef(<input
            type={"text"}
            onblur={() => ctx.onTimezoneInputBlur()}/>);
        return ctx.fromRef(ctx.timezoneDisplayRef);
    }

    private onTimezoneInputBlur() {
        const input = this.fromRef(this.timezoneInputRef) as HTMLInputElement;
        const display = this.fromRef(this.timezoneDisplayRef);
        AppStore().setUtcOffset(Number(input.value));
        input.replaceWith(display);
        this.updateDisplay();
    }

    private onTimezoneClick() {
        const input = this.fromRef(this.timezoneInputRef) as HTMLInputElement;
        this.fromRef(this.timezoneDisplayRef).replaceWith(input);
        input.focus();
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
    }

    current() {
        return this.skeleton.current();
    }
}

export default TimezoneWidget;