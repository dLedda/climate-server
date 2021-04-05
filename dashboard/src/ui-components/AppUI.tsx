import TimezoneWidget from "./TimezoneWidget";
import DisplayModeWidget from "./DisplayModeWidget";
import TimerWidget from "./TimerWidget";
import ClimateChartWidget from "./ClimateChartWidget";
import {GridSize} from "./GridWidget";
import MessageOverlay from "./MessageOverlay";
import UIComponent from "./UIComponent";
import SelectDisplayModeWidget from "./SelectDisplayModeWidget";
import LegendWidget from "./LegendWidget";
import HelpModal from "./HelpModal";
import * as JSX from "../JSXFactory";
import {AppStore} from "../StateStore";
import HelpButtonImg from "../../assets/help-button.png";

class AppUI extends UIComponent {
    private timezoneWidget: TimezoneWidget;
    private selectModeWidget: SelectDisplayModeWidget;
    private displayModeSettingsWidget: DisplayModeWidget;
    private timerWidget: TimerWidget;
    private legendWidget: LegendWidget;
    private chartWidget: ClimateChartWidget;
    private element: HTMLDivElement = document.createElement("div");
    private grid: HTMLDivElement = document.createElement("div");
    private messageOverlay: MessageOverlay = new MessageOverlay();
    private helpModal: HelpModal = new HelpModal();

    constructor() {
        super();
        this.setupGrid({width: 5, height: 10});
        this.element.append(
            <img
                alt={"Help"}
                src={HelpButtonImg}
                className={"help-button button"}
                onclick={() => AppStore().showHelp()}/>,
            <h1>Ledda's Room Climate</h1>,
            this.grid,
            this.messageOverlay.current(),
            this.helpModal.current(),
        );
        this.element.className = "center";
    }

    private setupGrid(size: GridSize) {
        this.setupWidgets();
        this.grid.append(
            this.chartWidget.current(),
            this.legendWidget.current(),
            this.displayModeSettingsWidget.current(),
            this.selectModeWidget.current(),
            this.timerWidget.current(),
            this.timezoneWidget.current(),
        );
        this.grid.className = "main-content-grid";
        this.grid.style.gridTemplateRows = `repeat(${size.height}, 1fr)`;
        this.grid.style.gridTemplateColumns = `repeat(${size.width}, 1fr)`;
    }

    private setupWidgets() {
        this.displayModeSettingsWidget = new DisplayModeWidget({
            row: "auto", col: 5, width: 1, height: 3,
        });
        this.selectModeWidget = new SelectDisplayModeWidget({
            row: "auto", col: 5, width: 1, height: 2,
        });
        this.timezoneWidget = new TimezoneWidget({
            row: "auto", col: 5, width: 1, height: 1,
        });
        this.timerWidget = new TimerWidget({
            row: "auto", col: 5, width: 1, height: 2,
        });
        this.legendWidget = new LegendWidget({
            row: "auto", col: 5, width: 1, height: 2,
        });
        this.chartWidget = new ClimateChartWidget({
            row: 1, col: 1, width: 4, height: 10,
        });
    }

    bootstrap(rootNode: string) {
        document.getElementById(rootNode).append(this.element);
    }

    current(): HTMLElement {
        return this.element;
    }
}

export default AppUI;