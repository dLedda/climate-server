import GridWidget, {GridProps} from "./GridWidget";
import {AppStore} from "./StateStore";
import UIComponent from "./UIComponent";

class TimezoneWidget extends UIComponent {
    private skeleton: GridWidget;
    private display: HTMLSpanElement = document.createElement("span");

    constructor(gridProps: GridProps) {
        super();
        this.skeleton = new GridWidget({
            ...gridProps,
            title: "Displayed Timezone:",
            body: this.display,
        });
        AppStore().subscribe("utcOffset", () => this.updateDisplay());
        this.updateDisplay();
    }

    private updateDisplay() {
        const offset = AppStore().getState().utcOffset;
        this.display.innerText = `UTC ${offset > 1 ? "+" : "-"} ${Math.abs(offset)}:00`;
    }

    current() {
        return this.skeleton.current();
    }
}

export default TimezoneWidget;