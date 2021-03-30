import GridWidget, {GridProps} from "./GridWidget";
import {AppStore, getAppState} from "../StateStore";
import UIComponent from "./UIComponent";
import * as JSX from "../JSXFactory";
import Timeseries from "../Timeseries";

class LegendWidget extends UIComponent {
    private skeleton: GridWidget;
    private display: HTMLSpanElement = document.createElement("span");
    private bodyRef: number;

    constructor(gridProps: GridProps) {
        super();
        this.display = <this.MainBody ctx={this}/>;
        this.skeleton = new GridWidget({
            ...gridProps,
            title: "Legend:",
            className: "legend-widget",
            body: this.display,
        });
        AppStore().subscribeStoreVal("highlightedTimeseries", () => this.updateDisplay());
        this.updateDisplay();
    }

    private updateDisplay() {
        this.fromRef(this.bodyRef).replaceWith(<this.MainBody ctx={this}/>);
    }

    private MainBody({ctx}: {ctx: LegendWidget}) {
        ctx.bodyRef = ctx.makeRef(<div><ctx.TimeseriesList ctx={ctx}/></div>);
        return ctx.fromRef(ctx.bodyRef);
    }

    private TimeseriesList({ctx}: { ctx: LegendWidget }) {
        const highlightedTimeseries = getAppState().highlightedTimeseries;
        return <ul>
            { ...getAppState().rightTimeseries.map(timeseries =>
                <ctx.TimeseriesLegendEntry
                    timeseries={timeseries}
                    highlighted={timeseries.getName() === highlightedTimeseries}/>) }
            { ...getAppState().leftTimeseries.map(timeseries =>
                <ctx.TimeseriesLegendEntry
                    timeseries={timeseries}
                    highlighted={timeseries.getName() === highlightedTimeseries}/>) }
        </ul>;
    }

    private TimeseriesLegendEntry({timeseries, highlighted}: {timeseries: Timeseries, highlighted: boolean}) {
        const option = new Option();
        option.style.color = timeseries.getColour();
        return <li
            style={`color: ${option.style.color}`}
            className={highlighted ? "highlighted" : ""}
            onmouseover={() => AppStore().setHighlightedTimeseries(timeseries.getName())}
            onmouseout={() => AppStore().setHighlightedTimeseries(null)}>
            {timeseries.getName()}
        </li>;
    }

    current() {
        return this.skeleton.current();
    }
}

export default LegendWidget;