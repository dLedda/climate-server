/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AppUI.ts":
/*!**********************!*\
  !*** ./src/AppUI.ts ***!
  \**********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _TimezoneWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TimezoneWidget */ \"./src/TimezoneWidget.tsx\");\n/* harmony import */ var _DisplayModeWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DisplayModeWidget */ \"./src/DisplayModeWidget.tsx\");\n/* harmony import */ var _TimerWidget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TimerWidget */ \"./src/TimerWidget.tsx\");\n/* harmony import */ var _ClimateChartWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ClimateChartWidget */ \"./src/ClimateChartWidget.ts\");\n/* harmony import */ var _MessageOverlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MessageOverlay */ \"./src/MessageOverlay.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n/* harmony import */ var _SelectDisplayModeWidget__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SelectDisplayModeWidget */ \"./src/SelectDisplayModeWidget.tsx\");\n;\n\n\n\n\n\n\nclass AppUI extends _UIComponent__WEBPACK_IMPORTED_MODULE_5__.default {\n    constructor() {\n        super();\n        this.element = document.createElement(\"div\");\n        this.grid = document.createElement(\"div\");\n        this.messageOverlay = new _MessageOverlay__WEBPACK_IMPORTED_MODULE_4__.default();\n        this.setupGrid({ width: 5, height: 10 });\n        this.element.append(Object.assign(document.createElement(\"h1\"), { innerText: \"Ledda's Room Climate\" }), this.grid, this.messageOverlay.current());\n        this.element.className = \"center\";\n    }\n    setupGrid(size) {\n        this.setupWidgets();\n        this.grid.append(this.chartWidget.current(), this.displayModeSettingsWidget.current(), this.selectModeWidget.current(), this.timerWidget.current(), this.timezoneWidget.current());\n        this.grid.className = \"main-content-grid\";\n        this.grid.style.gridTemplateRows = `repeat(${size.height}, 1fr)`;\n        this.grid.style.gridTemplateColumns = `repeat(${size.width}, 1fr)`;\n    }\n    setupWidgets() {\n        this.displayModeSettingsWidget = new _DisplayModeWidget__WEBPACK_IMPORTED_MODULE_1__.default({\n            row: \"auto\", col: 5, width: 1, height: 3,\n        });\n        this.selectModeWidget = new _SelectDisplayModeWidget__WEBPACK_IMPORTED_MODULE_6__.default({\n            row: \"auto\", col: 5, width: 1, height: 2,\n        });\n        this.timezoneWidget = new _TimezoneWidget__WEBPACK_IMPORTED_MODULE_0__.default({\n            row: \"auto\", col: 5, width: 1, height: 2,\n        });\n        this.timerWidget = new _TimerWidget__WEBPACK_IMPORTED_MODULE_2__.default({\n            row: \"auto\", col: 5, width: 1, height: 3,\n        });\n        this.chartWidget = new _ClimateChartWidget__WEBPACK_IMPORTED_MODULE_3__.default({\n            row: 1, col: 1, width: 4, height: 10,\n        });\n    }\n    bootstrap(rootNode) {\n        document.getElementById(rootNode).append(this.element);\n        this.chartWidget.updateDimensions();\n    }\n    current() {\n        return this.element;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AppUI);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/AppUI.ts?");

/***/ }),

/***/ "./src/ClimateChart.ts":
/*!*****************************!*\
  !*** ./src/ClimateChart.ts ***!
  \*****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ ClimateChart\n/* harmony export */ });\nclass ClimateChart {\n    constructor(context) {\n        this.timeseries = [];\n        this.lastMousePos = { x: 0, y: 0 };\n        this.indexRange = { start: 0, stop: 0 };\n        this.valRange = { high: -Infinity, low: Infinity };\n        this.formatTimestamp = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString();\n        this.width = 0;\n        this.height = 0;\n        this.ctx = context;\n        this.ctx.fillStyle = \"rgb(255,255,255)\";\n        this.width = this.ctx.canvas.width;\n        this.height = this.ctx.canvas.height;\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.fill();\n        this.ctx.translate(0.5, 0.5);\n        this.ctx.canvas.onmousemove = (e) => this.handleMouseMove(e);\n    }\n    addTimeseries(timeseries) {\n        this.timeseries.push(timeseries);\n    }\n    setRange(range) {\n        this.indexRange.start = range.start;\n        this.indexRange.stop = range.stop;\n    }\n    handleMouseMove(event) {\n        const { left: canvasX, top: canvasY } = this.ctx.canvas.getBoundingClientRect();\n        const x = event.clientX - canvasX;\n        const y = event.clientY - canvasY;\n        this.lastMousePos.x = x;\n        this.lastMousePos.y = y;\n        this.render();\n    }\n    render() {\n        this.width = this.ctx.canvas.width;\n        this.height = this.ctx.canvas.height;\n        this.ctx.fillStyle = \"rgb(255,255,255)\";\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.fill();\n        this.setDisplayRange();\n        this.renderScale();\n        for (const timeseries of this.timeseries) {\n            this.renderTimeseries(timeseries);\n        }\n        this.renderTooltips();\n    }\n    renderScale() {\n        this.ctx.strokeStyle = \"rgb(230,230,230)\";\n        this.ctx.fillStyle = \"black\";\n        this.ctx.beginPath();\n        const bottom = this.getY(this.valRange.low);\n        this.ctx.moveTo(40, bottom);\n        this.ctx.lineTo(this.width, bottom);\n        this.ctx.fillText(this.valRange.low.toString(), 0, bottom + 4);\n        const top = this.getY(this.valRange.high);\n        this.ctx.moveTo(40, top);\n        this.ctx.lineTo(this.width, top);\n        this.ctx.fillText(this.valRange.high.toString(), 0, top + 4);\n        const ticks = 20;\n        const tickHeight = this.height / ticks;\n        for (let i = 1; i < ticks; i++) {\n            const pos = Math.floor(tickHeight * i);\n            this.ctx.moveTo(40, pos);\n            this.ctx.lineTo(this.width, pos);\n            this.ctx.fillText(this.getValue(pos).toFixed(2), 0, pos + 4);\n        }\n        this.ctx.stroke();\n    }\n    setDisplayRange() {\n        for (const timeseries of this.timeseries) {\n            const extrema = timeseries.getExtrema();\n            if (extrema.maxVal > this.valRange.high) {\n                this.valRange.high = extrema.maxVal;\n            }\n            if (extrema.minVal < this.valRange.low) {\n                this.valRange.low = extrema.minVal;\n            }\n        }\n    }\n    renderTooltips() {\n        let bestDist = 20;\n        let bestTimeseries = this.timeseries[0];\n        let bestIndex = 0;\n        let bestVal = 0;\n        for (const timeseries of this.timeseries) {\n            const cache = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop);\n            for (let i = 0; i < cache.length; i += 2) {\n                const x = this.getX(cache[i + 1]);\n                const y = this.getY(cache[i]);\n                const dist = Math.sqrt((y - this.lastMousePos.y) ** 2 + (x - this.lastMousePos.x) ** 2);\n                if (dist < bestDist) {\n                    bestDist = dist;\n                    bestTimeseries = timeseries;\n                    bestIndex = cache[i + 1];\n                    bestVal = cache[i];\n                }\n            }\n        }\n        if (bestDist < 20) {\n            this.renderTooltip(`${bestTimeseries.getName()} - (${bestVal.toFixed(2)}, ${this.formatTimestamp(bestIndex)})`, this.getX(bestIndex), this.getY(bestVal));\n        }\n    }\n    setTimestampFormatter(formatter) {\n        this.formatTimestamp = formatter;\n    }\n    getX(index) {\n        return (index - this.indexRange.start) / (this.indexRange.stop - this.indexRange.start) * this.width;\n    }\n    getY(value) {\n        return this.height - (value - this.valRange.low) / (this.valRange.high - this.valRange.low) * this.height;\n    }\n    getIndex(x) {\n        return (x / this.width) * this.indexRange.stop;\n    }\n    getValue(y) {\n        return ((this.height - y) / this.height) * this.valRange.high;\n    }\n    renderTimeseries(timeseries) {\n        const timeseriesPoints = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop);\n        this.ctx.strokeStyle = timeseries.getColour();\n        let y = this.getY(timeseriesPoints[0]);\n        let x = this.getX(timeseriesPoints[1]);\n        this.ctx.moveTo(Math.floor(x), Math.floor(y));\n        this.ctx.beginPath();\n        this.ctx.lineTo(Math.floor(x), Math.floor(y));\n        this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);\n        for (let i = 2; i < timeseriesPoints.length; i += 2) {\n            y = this.getY(timeseriesPoints[i]);\n            x = this.getX(timeseriesPoints[i + 1]);\n            this.ctx.lineTo(Math.floor(x), Math.floor(y));\n            this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);\n        }\n        this.ctx.stroke();\n    }\n    renderTooltip(text, x, y) {\n        this.ctx.strokeStyle = \"rgb(255,0,0)\";\n        this.ctx.beginPath();\n        this.ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);\n        this.ctx.stroke();\n        const measurements = this.ctx.measureText(text);\n        const textHeight = measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent;\n        const height = textHeight + 10;\n        const width = measurements.width + 10;\n        if (x + width > this.width) {\n            x -= width;\n        }\n        if (y + height > this.height) {\n            y -= height;\n        }\n        this.ctx.fillStyle = \"rgb(255,255,255)\";\n        this.ctx.strokeStyle = \"rgb(0,0,0)\";\n        this.ctx.fillRect(x, y, width, height);\n        this.ctx.strokeRect(x, y, width, height);\n        this.ctx.fillStyle = \"rgb(0,0,0)\";\n        this.ctx.fillText(text, x + 5, y + textHeight + 5);\n    }\n}\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/ClimateChart.ts?");

/***/ }),

/***/ "./src/ClimateChartWidget.ts":
/*!***********************************!*\
  !*** ./src/ClimateChartWidget.ts ***!
  \***********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _GridWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GridWidget */ \"./src/GridWidget.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n/* harmony import */ var _ClimateChart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ClimateChart */ \"./src/ClimateChart.ts\");\n;\n\n\n\nclass ClimateChartWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_2__.default {\n    constructor(gridProps) {\n        super();\n        this.chart = null;\n        this.displayMode = \"pastMins\";\n        this.canvasElement = document.createElement(\"canvas\");\n        this.initialised = false;\n        this.canvasElement.className = \"chart-canvas\";\n        this.skeleton = new _GridWidget__WEBPACK_IMPORTED_MODULE_1__.default({\n            ...gridProps,\n            body: this.canvasElement,\n        });\n        const now = new Date().getTime() / 1000;\n        this.latestSnapshotInChartTime = now - (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().minutesDisplayed * 60;\n        this.setupListeners();\n    }\n    updateDimensions() {\n        const skelStyle = getComputedStyle(this.skeleton.current());\n        this.canvasElement.height = this.skeleton.current().clientHeight\n            - Number(skelStyle.paddingTop.slice(0, -2))\n            - Number(skelStyle.paddingBottom.slice(0, -2));\n        this.canvasElement.width = this.skeleton.current().clientWidth\n            - Number(skelStyle.paddingLeft.slice(0, -2))\n            - Number(skelStyle.paddingRight.slice(0, -2));\n    }\n    setupListeners() {\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"displayMode\", () => this.updateDisplayMode());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"minutesDisplayed\", () => this.rerender());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"displayWindow\", () => this.rerender());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().on(\"timeseriesUpdated\", () => this.rerender());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().on(\"newTimeseries\", (timeseries) => this.chart.addTimeseries(timeseries));\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"documentReady\", () => this.initChart());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"utcOffset\", () => this.updateTimezone());\n    }\n    updateTimezone() {\n        const offset = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().utcOffset * 60 * 60 * 1000;\n        this.chart.setTimestampFormatter((timestamp) => new Date(timestamp * 1000 + offset).toLocaleTimeString());\n    }\n    async initChart() {\n        try {\n            (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().addLoad();\n            const ctx = this.canvasElement.getContext(\"2d\", { alpha: false });\n            this.chart = new _ClimateChart__WEBPACK_IMPORTED_MODULE_3__.default(ctx);\n            for (const timeseries of (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().timeseries) {\n                this.chart.addTimeseries(timeseries);\n            }\n            await this.rerender();\n            this.initialised = true;\n        }\n        catch (e) {\n            (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().fatalError(e);\n        }\n        finally {\n            (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().finishLoad();\n        }\n    }\n    async updateDisplayMode() {\n        this.displayMode = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().displayMode;\n        await this.rerender();\n    }\n    async rerender() {\n        if (!this.initialised) {\n            return;\n        }\n        let start;\n        let stop;\n        if (this.displayMode === \"window\") {\n            start = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().displayWindow.start;\n            stop = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().displayWindow.stop;\n        }\n        else if (this.displayMode === \"pastMins\") {\n            const mins = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().minutesDisplayed;\n            start = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().lastUpdateTime - mins * 60;\n            stop = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().lastUpdateTime;\n        }\n        this.chart.setRange({ start, stop });\n        this.chart.render();\n    }\n    current() {\n        return this.skeleton.current();\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClimateChartWidget);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/ClimateChartWidget.ts?");

/***/ }),

/***/ "./src/DisplayModeWidget.tsx":
/*!***********************************!*\
  !*** ./src/DisplayModeWidget.tsx ***!
  \***********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _GridWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GridWidget */ \"./src/GridWidget.ts\");\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _JSXFactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JSXFactory */ \"./src/JSXFactory.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n;\n\n\n\nclass DisplayModeWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_3__.default {\n    constructor(gridProps) {\n        super();\n        this.mainDisplay = this.MainDisplay({ ctx: this });\n        this.skeleton = new _GridWidget__WEBPACK_IMPORTED_MODULE_0__.default({\n            ...gridProps,\n            title: \"Displaying:\",\n            body: this.mainDisplay,\n        });\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().subscribeStoreVal(\"minutesDisplayed\", () => this.updateDisplay());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().subscribeStoreVal(\"displayMode\", () => this.updateDisplay());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().subscribeStoreVal(\"displayWindow\", () => this.updateDisplay());\n    }\n    WindowStartTime({ ctx }) {\n        ctx.windowStartTimeRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"display-mode-widget-date\" }, new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayWindow.start).toLocaleString()));\n        return ctx.fromRef(ctx.windowStartTimeRef);\n    }\n    WindowStopTime({ ctx }) {\n        ctx.windowStopTimeRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"display-mode-widget-date\" }, new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayWindow.stop).toLocaleString()));\n        return ctx.fromRef(ctx.windowStopTimeRef);\n    }\n    MinutesCounter({ ctx, onclick }) {\n        ctx.minsInputRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"input\", { value: (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().minutesDisplayed.toString(), onblur: (e) => ctx.onMinutesCounterInputBlur(e) }));\n        ctx.minsCounterRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"min-count\", onclick: onclick }, (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().minutesDisplayed.toString()));\n        return ctx.fromRef(ctx.minsCounterRef);\n    }\n    onMinutesCounterInputBlur(e) {\n        const input = Number(e.target.value);\n        if (!isNaN(input)) {\n            if (input >= 1) {\n                (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setMinutesDisplayed(input);\n            }\n        }\n        else {\n            e.target.value = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().minutesDisplayed.toString();\n        }\n        this.fromRef(this.minsInputRef).replaceWith(this.fromRef(this.minsCounterRef));\n    }\n    MinutesDisplay({ ctx }) {\n        return (_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"display-mode-widget-mins\" },\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", null, \"Last\"),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.MinusButton, { onclick: () => {\n                    const mins = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().minutesDisplayed;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setMinutesDisplayed(mins - 1);\n                } }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.MinutesCounter, { ctx: ctx, onclick: () => ctx.onMinutesCounterClick() }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.PlusButton, { onclick: () => {\n                    const mins = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().minutesDisplayed;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setMinutesDisplayed(mins + 1);\n                } }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", null, \"minutes\")));\n    }\n    onMinutesCounterClick() {\n        const input = this.fromRef(this.minsInputRef);\n        this.fromRef(this.minsCounterRef).replaceWith(input);\n        input.focus();\n        input.selectionStart = 0;\n        input.selectionEnd = input.value.length;\n    }\n    MinusButton(props) {\n        return _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"minus-button\", onclick: props.onclick });\n    }\n    PlusButton(props) {\n        return _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"plus-button\", onclick: props.onclick });\n    }\n    WindowedDisplay({ ctx }) {\n        return (_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", null,\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", null, \"From\"),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.MinusButton, { onclick: () => {\n                    const displayWindow = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().displayWindow;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDisplayWindow({ start: displayWindow.start - 60, stop: displayWindow.stop });\n                } }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.WindowStartTime, { ctx: ctx }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.PlusButton, { onclick: () => {\n                    const displayWindow = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().displayWindow;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDisplayWindow({ start: displayWindow.start + 60, stop: displayWindow.stop });\n                } }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", null, \"to\"),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.MinusButton, { onclick: () => {\n                    const displayWindow = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().displayWindow;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDisplayWindow({ start: displayWindow.start, stop: displayWindow.stop - 60 });\n                } }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.WindowStopTime, { ctx: ctx }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.PlusButton, { onclick: () => {\n                    const displayWindow = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().displayWindow;\n                    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDisplayWindow({ start: displayWindow.start, stop: displayWindow.stop + 60 });\n                } })));\n    }\n    MainDisplay({ ctx }) {\n        const windowMode = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayMode === \"window\";\n        ctx.windowedDisplayRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.WindowedDisplay, { ctx: ctx }));\n        ctx.minsDisplayRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(ctx.MinutesDisplay, { ctx: ctx }));\n        return _JSXFactory__WEBPACK_IMPORTED_MODULE_2__.createElement(\"div\", { className: \"display-mode-widget\" }, windowMode\n            ? ctx.fromRef(ctx.windowedDisplayRef)\n            : ctx.fromRef(ctx.minsDisplayRef));\n    }\n    onSelectMode(mode) {\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDisplayMode(mode);\n    }\n    updateDisplay() {\n        if ((0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayMode === \"window\") {\n            this.mainDisplay.children.item(0).replaceWith(this.fromRef(this.windowedDisplayRef));\n            this.fromRef(this.windowStartTimeRef).innerText = new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayWindow.start * 1000).toLocaleString();\n            this.fromRef(this.windowStopTimeRef).innerText = new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().displayWindow.stop * 1000).toLocaleString();\n        }\n        else {\n            this.mainDisplay.children.item(0).replaceWith(this.fromRef(this.minsDisplayRef));\n            this.fromRef(this.minsCounterRef).innerText = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().minutesDisplayed.toString();\n            this.fromRef(this.minsInputRef).value = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().minutesDisplayed.toString();\n        }\n    }\n    current() {\n        return this.skeleton.current();\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DisplayModeWidget);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/DisplayModeWidget.tsx?");

/***/ }),

/***/ "./src/GridWidget.ts":
/*!***************************!*\
  !*** ./src/GridWidget.ts ***!
  \***************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n;\nclass GridWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_0__.default {\n    constructor(props) {\n        super();\n        this.container = document.createElement(\"div\");\n        this.title = document.createElement(\"h2\");\n        this.body = document.createElement(\"div\");\n        this.container.className = `widget${props.className ? ` ${props.className}` : \"\"}`;\n        this.title.className = \"widget-title\";\n        this.body.className = \"widget-body\";\n        this.setTitle(props.title);\n        this.setPosition({ row: props.row, col: props.col });\n        this.setSize({ width: props.width, height: props.height });\n        if (props.title) {\n            this.container.append(this.title);\n        }\n        if (props.body) {\n            this.body.append(props.body);\n        }\n        this.container.append(this.body);\n    }\n    setPosition(pos) {\n        this.container.style.gridRowStart = `${pos.row}`;\n        this.container.style.gridColumnStart = `${pos.col}`;\n    }\n    setSize(size) {\n        this.container.style.gridRowEnd = `span ${size.height}`;\n        this.container.style.gridColumnEnd = `span ${size.width}`;\n    }\n    setTitle(newTitle) {\n        this.title.innerText = newTitle;\n    }\n    replaceBody(newEl) {\n        this.body.replaceWith(newEl);\n    }\n    current() {\n        return this.container;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GridWidget);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/GridWidget.ts?");

/***/ }),

/***/ "./src/JSXFactory.ts":
/*!***************************!*\
  !*** ./src/JSXFactory.ts ***!
  \***************************/
/*! namespace exports */
/*! export createElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createElement\": () => /* binding */ createElement\n/* harmony export */ });\nfunction createElement(tagName, attributes, ...children) {\n    if (typeof tagName === \"function\") {\n        if (children.length >= 1) {\n            return tagName({ ...attributes }, children);\n        }\n        else {\n            return tagName({ ...attributes });\n        }\n    }\n    else {\n        return standardElement(tagName, attributes, ...children);\n    }\n}\nfunction standardElement(tagName, attributes, ...children) {\n    const element = document.createElement(tagName);\n    for (const key in attributes) {\n        const attributeValue = attributes[key];\n        if (key.startsWith(\"on\") && typeof attributeValue === \"function\") {\n            element.addEventListener(key.substring(2), attributeValue);\n        }\n        else if (typeof attributeValue === \"boolean\" && attributeValue === true) {\n            element.setAttribute(key, \"\");\n        }\n        else if (typeof attributeValue === \"string\") {\n            if (key === \"className\") {\n                element.setAttribute(\"class\", attributes[key]);\n            }\n            else {\n                element.setAttribute(key, attributeValue);\n            }\n        }\n    }\n    element.append(...createChildren(children));\n    return element;\n}\nfunction createChildren(children) {\n    const childrenNodes = [];\n    for (const child of children) {\n        if (typeof child === \"undefined\" || child === null || typeof child === \"boolean\") {\n            continue;\n        }\n        if (Array.isArray(child)) {\n            childrenNodes.push(...createChildren(child));\n        }\n        else if (typeof child === \"string\") {\n            childrenNodes.push(document.createTextNode(String(child)));\n        }\n        else if (child instanceof Node) {\n            childrenNodes.push(child);\n        }\n    }\n    return childrenNodes;\n}\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/JSXFactory.ts?");

/***/ }),

/***/ "./src/MessageOverlay.ts":
/*!*******************************!*\
  !*** ./src/MessageOverlay.ts ***!
  \*******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n;\n\nclass MessageOverlay extends _UIComponent__WEBPACK_IMPORTED_MODULE_1__.default {\n    constructor() {\n        super();\n        this.showingError = false;\n        this.build();\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"overlayText\", () => this.update());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"isLoading\", () => this.update());\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"fatalError\", () => this.showError());\n        this.update();\n    }\n    build() {\n        this.element = document.createElement(\"div\");\n        this.element.classList.add(\"overlay\", \"center\");\n        this.textElement = document.createElement(\"span\");\n        this.textElement.innerText = \"\";\n        this.element.appendChild(this.textElement);\n    }\n    show() {\n        this.element.classList.remove(\"hidden\");\n    }\n    hide() {\n        this.element.classList.add(\"hidden\");\n    }\n    showError() {\n        const err = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().fatalError;\n        this.showingError = true;\n        this.element.innerText = `${err.name}: ${err.message}!`;\n        this.show();\n    }\n    update() {\n        if (!this.showingError) {\n            let text;\n            if ((0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().isLoading) {\n                text = \"Loading...\";\n            }\n            else if ((0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().overlayText) {\n                text = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().overlayText;\n            }\n            if (text) {\n                this.textElement.innerText = text;\n                this.show();\n            }\n            else {\n                this.hide();\n            }\n        }\n    }\n    current() {\n        return this.element;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MessageOverlay);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/MessageOverlay.ts?");

/***/ }),

/***/ "./src/SelectDisplayModeWidget.tsx":
/*!*****************************************!*\
  !*** ./src/SelectDisplayModeWidget.tsx ***!
  \*****************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ SelectDisplayModeWidget\n/* harmony export */ });\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n/* harmony import */ var _JSXFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSXFactory */ \"./src/JSXFactory.ts\");\n/* harmony import */ var _GridWidget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GridWidget */ \"./src/GridWidget.ts\");\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n;\n\n\n\nclass SelectDisplayModeWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_0__.default {\n    constructor(gridProps) {\n        super();\n        this.mainBody = this.MainBody({ ctx: this });\n        this.gridWidgetSkeleton = new _GridWidget__WEBPACK_IMPORTED_MODULE_2__.default({\n            ...gridProps,\n            title: \"Display Mode:\",\n            body: this.mainBody,\n        });\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_3__.AppStore)().subscribeStoreVal(\"displayMode\", () => this.update());\n    }\n    selectMode(mode) {\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_3__.AppStore)().setDisplayMode(mode);\n    }\n    update() {\n        const windowedMode = (0,_StateStore__WEBPACK_IMPORTED_MODULE_3__.getAppState)().displayMode === \"window\";\n        this.fromRef(this.windowInputRef).checked = windowedMode;\n        this.fromRef(this.minSpanInputRef).checked = !windowedMode;\n    }\n    MainBody({ ctx }) {\n        const isInWindowMode = (0,_StateStore__WEBPACK_IMPORTED_MODULE_3__.getAppState)().displayMode === \"window\";\n        ctx.windowInputRef = this.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"input\", { type: \"radio\", id: \"window\", name: \"display-mode\", checked: isInWindowMode, onclick: () => ctx.selectMode(\"window\") }));\n        ctx.minSpanInputRef = this.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"input\", { type: \"radio\", id: \"min-span\", name: \"display-mode\", checked: !isInWindowMode, onclick: () => ctx.selectMode(\"pastMins\") }));\n        return (_JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"div\", null,\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"div\", null,\n                this.fromRef(ctx.windowInputRef),\n                _JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"label\", { htmlFor: \"window\" }, \"Time Window\")),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"div\", null,\n                this.fromRef(ctx.minSpanInputRef),\n                _JSXFactory__WEBPACK_IMPORTED_MODULE_1__.createElement(\"label\", { htmlFor: \"minSpan\" }, \"Rolling Minute Span\"))));\n    }\n    current() {\n        return this.gridWidgetSkeleton.current();\n    }\n}\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/SelectDisplayModeWidget.tsx?");

/***/ }),

/***/ "./src/StateStore.ts":
/*!***************************!*\
  !*** ./src/StateStore.ts ***!
  \***************************/
/*! namespace exports */
/*! export AppStateError [provided] [no usage info] [missing usage info prevents renaming] */
/*! export AppStore [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getAppState [provided] [no usage info] [missing usage info prevents renaming] */
/*! export initStore [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AppStateError\": () => /* binding */ AppStateError,\n/* harmony export */   \"initStore\": () => /* binding */ initStore,\n/* harmony export */   \"AppStore\": () => /* binding */ AppStore,\n/* harmony export */   \"getAppState\": () => /* binding */ getAppState\n/* harmony export */ });\nclass AppStateError extends Error {\n    constructor(message) {\n        super(message);\n        this.name = \"AppStateError\";\n    }\n}\nclass AppStateStore {\n    constructor(initialState) {\n        this.loaders = 0;\n        this.state = initialState;\n        const subscriptions = {};\n        for (const key in this.state) {\n            subscriptions[key] = [];\n        }\n        this.eventCallbacks = { newTimeseries: [], timeseriesUpdated: [] };\n        this.subscriptions = subscriptions;\n        this.init();\n        setInterval(() => this.getNewTimeseriesData(), this.state.updateIntervalSeconds * 1000);\n    }\n    async init() {\n        await this.updateTimeseriesFromSettings();\n        await this.getNewTimeseriesData();\n    }\n    addTimeseries(timeseries) {\n        if (this.state.timeseries.indexOf(timeseries) >= 0) {\n            throw new AppStateError(\"Timeseries has already been added!\");\n        }\n        this.state.timeseries.push(timeseries);\n        this.notifyStoreVal(\"timeseries\");\n        this.eventCallbacks[\"newTimeseries\"].forEach(cb => cb(timeseries));\n        this.updateTimeseriesFromSettings();\n    }\n    notifyStoreVal(subscribedValue, newValue, oldValue) {\n        for (const subscriptionCallback of this.subscriptions[subscribedValue]) {\n            new Promise(() => subscriptionCallback(newValue, oldValue));\n        }\n    }\n    async updateTimeseriesFromSettings() {\n        let start;\n        let stop;\n        if (this.state.displayMode === \"window\") {\n            start = this.state.displayWindow.start;\n            stop = this.state.displayWindow.stop;\n        }\n        else {\n            start = this.state.lastUpdateTime - this.state.minutesDisplayed * 60;\n            stop = this.state.lastUpdateTime;\n        }\n        this.addLoad();\n        for (const timeseries of this.state.timeseries) {\n            await timeseries.updateFromWindow(start, stop);\n        }\n        this.finishLoad();\n        for (const timeseries of this.state.timeseries) {\n            this.notifyStoreVal(\"timeseries\");\n            this.eventCallbacks[\"timeseriesUpdated\"].forEach(cb => cb(timeseries));\n        }\n    }\n    async getNewTimeseriesData() {\n        this.addLoad();\n        for (const timeseries of this.state.timeseries) {\n            await timeseries.getLatest();\n        }\n        this.finishLoad();\n        for (const timeseries of this.state.timeseries) {\n            this.notifyStoreVal(\"timeseries\");\n            this.eventCallbacks[\"timeseriesUpdated\"].forEach(cb => cb(timeseries));\n        }\n        this.setLastUpdateTime(new Date().getTime() / 1000);\n    }\n    getState() {\n        return this.state;\n    }\n    subscribeStoreVal(dataName, callback) {\n        this.subscriptions[dataName].push(callback);\n    }\n    on(event, callback) {\n        this.eventCallbacks[event].push(callback);\n    }\n    setDisplayMode(mode) {\n        this.state.displayMode = mode;\n        this.notifyStoreVal(\"displayMode\");\n    }\n    setDisplayWindow(newWin) {\n        if (newWin.start < newWin.stop) {\n            this.state.displayWindow = { ...newWin };\n            this.notifyStoreVal(\"displayWindow\");\n            this.updateTimeseriesFromSettings();\n        }\n        else {\n            throw new AppStateError(`Invalid display window from ${newWin.start} to ${newWin.stop}`);\n        }\n    }\n    setMinutesDisplayed(mins) {\n        if (mins > 0) {\n            this.state.minutesDisplayed = Math.ceil(mins);\n            this.notifyStoreVal(\"minutesDisplayed\");\n            this.updateTimeseriesFromSettings();\n        }\n        else {\n            throw new AppStateError(`Invalid minutes passed: ${mins}`);\n        }\n    }\n    setUtcOffset(newOffset) {\n        if (Math.floor(newOffset) === newOffset && newOffset <= 14 && newOffset >= -12) {\n            this.state.utcOffset = newOffset;\n        }\n        else {\n            console.warn(`Invalid UTC offset: ${newOffset}`);\n            if (newOffset > 14) {\n                this.state.utcOffset = 14;\n            }\n            else if (newOffset < -12) {\n                this.state.utcOffset = -12;\n            }\n            else {\n                this.state.utcOffset = Math.floor(newOffset);\n            }\n        }\n        this.notifyStoreVal(\"utcOffset\");\n    }\n    setLastUpdateTime(newTime) {\n        if (this.state.lastUpdateTime <= newTime) {\n            this.state.lastUpdateTime = newTime;\n            this.notifyStoreVal(\"lastUpdateTime\");\n        }\n        else {\n            throw new AppStateError(`Bad new update time was before last update time. Old: ${this.state.lastUpdateTime}, New: ${newTime}`);\n        }\n    }\n    setOverlayText(text) {\n        this.state.overlayText = text;\n        this.notifyStoreVal(\"overlayText\");\n    }\n    addLoad() {\n        this.loaders += 1;\n        this.state.isLoading = this.loaders > 0;\n        this.notifyStoreVal(\"isLoading\");\n    }\n    finishLoad() {\n        this.loaders -= 1;\n        this.state.isLoading = this.loaders > 0;\n        this.notifyStoreVal(\"isLoading\");\n    }\n    fatalError(err) {\n        if (!this.state.fatalError) {\n            this.state.fatalError = err;\n            this.notifyStoreVal(\"fatalError\");\n        }\n    }\n    setDocumentReady(isReady) {\n        this.state.documentReady = isReady;\n        this.notifyStoreVal(\"documentReady\");\n    }\n}\nlet store;\nasync function initStore(initialState) {\n    store = new AppStateStore(initialState);\n    return store;\n}\nfunction AppStore() {\n    if (store) {\n        return store;\n    }\n    else {\n        throw new AppStateError(\"Store not yet initialised!\");\n    }\n}\nfunction getAppState() {\n    if (store) {\n        return store.getState();\n    }\n    else {\n        throw new AppStateError(\"Store not yet initialised!\");\n    }\n}\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/StateStore.ts?");

/***/ }),

/***/ "./src/TimerWidget.tsx":
/*!*****************************!*\
  !*** ./src/TimerWidget.tsx ***!
  \*****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _GridWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GridWidget */ \"./src/GridWidget.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n/* harmony import */ var _JSXFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./JSXFactory */ \"./src/JSXFactory.ts\");\n;\n\n\n\nclass TimerWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_2__.default {\n    constructor(gridProps) {\n        super();\n        this.display = _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(this.MainDisplay, { ctx: this });\n        this.skeleton = new _GridWidget__WEBPACK_IMPORTED_MODULE_1__.default({\n            ...gridProps,\n            className: \"timer-widget\",\n            title: \"Next update in:\",\n            body: this.display,\n        });\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.AppStore)().subscribeStoreVal(\"lastUpdateTime\", () => this.resetTimer());\n        setInterval(() => this.refreshTimer(), 10);\n        this.resetTimer();\n    }\n    resetTimer() {\n        this.nextUpdateTime = (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().lastUpdateTime + (0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().updateIntervalSeconds;\n        this.fromRef(this.lastUpdateRef).innerText = new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().lastUpdateTime).toLocaleString();\n        this.refreshTimer();\n    }\n    MainDisplay({ ctx }) {\n        ctx.timerRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", { className: \"countdown\" }));\n        ctx.lastUpdateRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"span\", { className: \"last-update\" }, new Date((0,_StateStore__WEBPACK_IMPORTED_MODULE_0__.getAppState)().lastUpdateTime).toLocaleString()));\n        return (_JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", null,\n            ctx.fromRef(ctx.timerRef),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", null,\n                _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", { className: \"last-update\" }, \"Last update was at:\"),\n                _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", null, ctx.fromRef(ctx.lastUpdateRef)))));\n    }\n    refreshTimer() {\n        const now = new Date().getTime() / 1000;\n        if (now <= this.nextUpdateTime) {\n            this.fromRef(this.timerRef).innerText = `${(this.nextUpdateTime - now).toFixed(2)}s`;\n        }\n        else {\n            this.fromRef(this.timerRef).innerText = \"0.00s\";\n        }\n    }\n    current() {\n        return this.skeleton.current();\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TimerWidget);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/TimerWidget.tsx?");

/***/ }),

/***/ "./src/Timeseries.ts":
/*!***************************!*\
  !*** ./src/Timeseries.ts ***!
  \***************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nclass Timeseries {\n    constructor(name, loader) {\n        this.fetching = false;\n        this.extrema = {\n            minVal: Infinity,\n            maxVal: -Infinity,\n            minIndex: Infinity,\n            maxIndex: -Infinity,\n        };\n        this.cache = new Int32Array();\n        this.loader = loader;\n        this.name = name;\n        this.colour = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;\n    }\n    getExtrema() {\n        return Object.assign(this.extrema);\n    }\n    getName() {\n        return this.name;\n    }\n    getCache() {\n        return this.cache;\n    }\n    getColour() {\n        return this.colour;\n    }\n    cachedBetween(start, stop) {\n        if (this.cache.length <= 0) {\n            return new Int32Array();\n        }\n        else {\n            return this.cache.slice(this.findIndexInCache(start), this.findIndexInCache(stop));\n        }\n    }\n    append(value, index) {\n        if (this.cache.length < this.currentEndPointer + 2) {\n            const newCache = new Int32Array(this.cache.length * 2);\n            newCache.set(this.cache, 0);\n            newCache.set([value, index], this.currentEndPointer);\n            this.cache = newCache;\n        }\n    }\n    async updateFromWindow(start, stop) {\n        if (!this.fetching) {\n            try {\n                if (this.cache.length === 0) {\n                    this.fetching = true;\n                    await this.fullFetch(start, stop);\n                }\n                else if (this.cache[1] > start) {\n                    this.fetching = true;\n                    await this.fetchPrior(start);\n                }\n                else if (this.cache[this.currentEndPointer - 1] < stop) {\n                    this.fetching = true;\n                    await this.fetchAnterior(stop);\n                }\n            }\n            catch (e) {\n                throw new Error(`Error fetching timeseries data: ${e}`);\n            }\n        }\n        this.fetching = false;\n    }\n    async getLatest() {\n        this.fetching = true;\n        try {\n            await this.fetchAnterior(this.cache[this.currentEndPointer - 1]);\n        }\n        catch (e) {\n            throw new Error(`Error fetching timeseries data: ${e}`);\n        }\n        this.fetching = false;\n    }\n    async fullFetch(start, stop) {\n        try {\n            this.cache = await this.loader(start, stop);\n            this.currentEndPointer = this.cache.length;\n            this.updateExtremaFrom(this.cache);\n        }\n        catch (e) {\n            throw new Error(`Error fully fetching data: ${e}`);\n        }\n    }\n    async fetchAnterior(after) {\n        try {\n            const doubleTimespan = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);\n            const result = await this.loader(after, after + doubleTimespan);\n            const newCache = new Int32Array(this.cache.length + result.length);\n            newCache.set(this.cache, 0);\n            newCache.set(result, this.currentEndPointer);\n            this.cache = newCache;\n            this.currentEndPointer += result.length;\n            this.updateExtremaFrom(result);\n        }\n        catch (e) {\n            throw new Error(`Error fetching anterior data: ${e}`);\n        }\n    }\n    async fetchPrior(before) {\n        try {\n            const doubleTimespan = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);\n            const result = await this.loader(before - doubleTimespan, before);\n            const newCache = new Int32Array(this.cache.length + result.length);\n            newCache.set(result, 0);\n            newCache.set(this.cache, result.length);\n            this.cache = newCache;\n            this.currentEndPointer += result.length;\n            this.updateExtremaFrom(result);\n        }\n        catch (e) {\n            throw new Error(`Error fetching anterior data: ${e}`);\n        }\n    }\n    updateExtremaFrom(data) {\n        for (let i = 0; i < data.length; i += 2) {\n            if (data[i] < this.extrema.minVal) {\n                this.extrema.minVal = data[i];\n            }\n            if (data[i] > this.extrema.maxVal) {\n                this.extrema.maxVal = data[i];\n            }\n        }\n        for (let i = 1; i < this.cache.length; i += 2) {\n            if (data[i] < this.extrema.minIndex) {\n                this.extrema.minIndex = data[i];\n            }\n            if (data[i] > this.extrema.maxIndex) {\n                this.extrema.maxIndex = data[i];\n            }\n        }\n    }\n    findIndexInCache(soughtIndex) {\n        for (let i = 1; i < this.cache.length; i += 2) {\n            if (soughtIndex < this.cache[i]) {\n                return i - 1;\n            }\n        }\n        return this.cache.length - 2;\n    }\n    findIndexInCacheBinary(soughtIndex, listStart = 0, listStop = (this.currentEndPointer / 2)) {\n        if (listStop - listStart === 1) {\n            return listStart;\n        }\n        else {\n            const middle = Math.floor((listStop + listStart) / 2);\n            const val = this.cache[middle * 2 + 1];\n            if (val > soughtIndex) {\n                return this.findIndexInCacheBinary(soughtIndex, listStart, middle);\n            }\n            else if (val < soughtIndex) {\n                return this.findIndexInCacheBinary(soughtIndex, middle, listStop);\n            }\n            else {\n                return middle;\n            }\n        }\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Timeseries);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/Timeseries.ts?");

/***/ }),

/***/ "./src/TimezoneWidget.tsx":
/*!********************************!*\
  !*** ./src/TimezoneWidget.tsx ***!
  \********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _GridWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GridWidget */ \"./src/GridWidget.ts\");\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _UIComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIComponent */ \"./src/UIComponent.ts\");\n/* harmony import */ var _JSXFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./JSXFactory */ \"./src/JSXFactory.ts\");\n;\n\n\n\nclass TimezoneWidget extends _UIComponent__WEBPACK_IMPORTED_MODULE_2__.default {\n    constructor(gridProps) {\n        super();\n        this.display = document.createElement(\"span\");\n        this.display = _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(this.MainBody, { ctx: this });\n        this.skeleton = new _GridWidget__WEBPACK_IMPORTED_MODULE_0__.default({\n            ...gridProps,\n            title: \"Displayed Timezone:\",\n            body: this.display,\n        });\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().subscribeStoreVal(\"utcOffset\", () => this.updateDisplay());\n        this.updateDisplay();\n    }\n    updateDisplay() {\n        const offset = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().getState().utcOffset;\n        this.fromRef(this.timezoneDisplayRef).innerText = `${offset > 0 ? \"+\" : \"−\"} ${Math.abs(offset)}`;\n        this.fromRef(this.timezoneInputRef).value = `${offset > 0 ? \"\" : \"-\"}${Math.abs(offset)}`;\n    }\n    MainBody({ ctx }) {\n        return _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"div\", { className: \"timezone-widget\", onclick: () => ctx.onTimezoneClick() },\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"span\", null, \"UTC \"),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(ctx.TimezoneDisplay, { ctx: ctx }),\n            _JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"span\", null, \":00\"));\n    }\n    TimezoneDisplay({ ctx }) {\n        ctx.timezoneDisplayRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"span\", null));\n        ctx.timezoneInputRef = ctx.makeRef(_JSXFactory__WEBPACK_IMPORTED_MODULE_3__.createElement(\"input\", { type: \"text\", onblur: () => ctx.onTimezoneInputBlur() }));\n        return ctx.fromRef(ctx.timezoneDisplayRef);\n    }\n    onTimezoneInputBlur() {\n        const input = this.fromRef(this.timezoneInputRef);\n        const display = this.fromRef(this.timezoneDisplayRef);\n        (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setUtcOffset(Number(input.value));\n        input.replaceWith(display);\n        this.updateDisplay();\n    }\n    onTimezoneClick() {\n        const input = this.fromRef(this.timezoneInputRef);\n        this.fromRef(this.timezoneDisplayRef).replaceWith(input);\n        input.focus();\n        input.selectionStart = 0;\n        input.selectionEnd = input.value.length;\n    }\n    current() {\n        return this.skeleton.current();\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TimezoneWidget);\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/TimezoneWidget.tsx?");

/***/ }),

/***/ "./src/UIComponent.ts":
/*!****************************!*\
  !*** ./src/UIComponent.ts ***!
  \****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ UIComponent\n/* harmony export */ });\nclass UIComponent {\n    constructor() {\n        this.id = UIComponent.componentCount;\n        UIComponent.componentCount++;\n    }\n    makeRef(el) {\n        UIComponent.reffedComponents.push(el);\n        return UIComponent.reffedComponentCount++;\n    }\n    fromRef(ref) {\n        return UIComponent.reffedComponents[ref] ?? null;\n    }\n}\nUIComponent.componentCount = 0;\nUIComponent.reffedComponentCount = 0;\nUIComponent.reffedComponents = [];\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/UIComponent.ts?");

/***/ }),

/***/ "./src/errors.ts":
/*!***********************!*\
  !*** ./src/errors.ts ***!
  \***********************/
/*! namespace exports */
/*! export ClayPIDashboardError [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ClayPIDashboardError\": () => /* binding */ ClayPIDashboardError\n/* harmony export */ });\nclass ClayPIDashboardError extends Error {\n    constructor(message, displayMessage) {\n        super(message);\n        this.name = \"ClayPIError\";\n        this.displayMessage = displayMessage ?? message;\n    }\n}\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/errors.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! namespace exports */
/*! export config [provided] [no usage info] [missing usage info prevents renaming] -> ./src/config.json .default */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"config\": () => /* reexport default export from named module */ _config_json__WEBPACK_IMPORTED_MODULE_0__\n/* harmony export */ });\n/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.json */ \"./src/config.json\");\n/* harmony import */ var _StateStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StateStore */ \"./src/StateStore.ts\");\n/* harmony import */ var _AppUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppUI */ \"./src/AppUI.ts\");\n/* harmony import */ var _Timeseries__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Timeseries */ \"./src/Timeseries.ts\");\n/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errors */ \"./src/errors.ts\");\n;\n\n\n\n\n\nfunction getDisplayedMinutes() {\n    let minutesDisplayed = _config_json__WEBPACK_IMPORTED_MODULE_0__.defaultMinuteSpan;\n    const argsStart = window.location.search.search(/\\?minute-span=/);\n    if (argsStart !== -1) {\n        const parsedMins = Number(window.location.search.substring(13));\n        if (!isNaN(parsedMins) && parsedMins > 0) {\n            minutesDisplayed = parsedMins;\n        }\n    }\n    return minutesDisplayed;\n}\nfunction getUtcOffset() {\n    return -(new Date().getTimezoneOffset() / 60);\n}\nasync function init() {\n    const now = new Date().getTime() / 1000;\n    await (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.initStore)({\n        overlayText: \"\",\n        lastUpdateTime: now,\n        minutesDisplayed: getDisplayedMinutes(),\n        utcOffset: getUtcOffset(),\n        dataEndpointBase: _config_json__WEBPACK_IMPORTED_MODULE_0__.dataEndpoint,\n        isLoading: false,\n        updateIntervalSeconds: _config_json__WEBPACK_IMPORTED_MODULE_0__.reloadIntervalSec,\n        displayMode: \"pastMins\",\n        fatalError: null,\n        displayWindow: { start: now - getDisplayedMinutes() * 60, stop: now },\n        documentReady: false,\n        timeseries: [],\n    });\n    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().addTimeseries(new _Timeseries__WEBPACK_IMPORTED_MODULE_3__.default(\"temp\", (start, stop) => loadClimateTimeseriesData(\"temp\", start, stop)));\n    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().addTimeseries(new _Timeseries__WEBPACK_IMPORTED_MODULE_3__.default(\"humidity\", (start, stop) => loadClimateTimeseriesData(\"humidity\", start, stop)));\n    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().addTimeseries(new _Timeseries__WEBPACK_IMPORTED_MODULE_3__.default(\"co2\", (start, stop) => loadClimateTimeseriesData(\"co2\", start, stop)));\n    const ui = new _AppUI__WEBPACK_IMPORTED_MODULE_2__.default();\n    ui.bootstrap(\"root\");\n}\nasync function loadClimateTimeseriesData(dataType, start, stop) {\n    const endpoint = `${(0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.getAppState)().dataEndpointBase}/timeseries/${dataType}${start && `?from=${start * 1000}`}${stop && `&to=${stop * 1000}`}`;\n    try {\n        const response = await fetch(endpoint, { headers: {\n                \"Content-Type\": \"application/octet-stream\",\n            } });\n        const reader = await response.body.getReader();\n        let receivedLength = 0;\n        const chunks = [];\n        let finishedReading = false;\n        while (!finishedReading) {\n            const chunk = await reader.read();\n            finishedReading = chunk.done;\n            if (!finishedReading) {\n                const chunkBuffer = new Int32Array(chunk.value.buffer);\n                chunks.push(chunkBuffer);\n                receivedLength += chunkBuffer.length;\n            }\n        }\n        const data = new Int32Array(receivedLength);\n        let position = 0;\n        for (const chunk of chunks) {\n            data.set(chunk, position);\n            position += chunk.length;\n        }\n        return data;\n    }\n    catch (e) {\n        const message = \"Error fetching timerseries data from the server\";\n        throw new _errors__WEBPACK_IMPORTED_MODULE_4__.ClayPIDashboardError(`${message}: ${e}`, message);\n    }\n}\ndocument.onreadystatechange = async () => {\n    await init();\n    (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)().setDocumentReady(true);\n    // @ts-ignore\n    window.store = (0,_StateStore__WEBPACK_IMPORTED_MODULE_1__.AppStore)();\n    document.onreadystatechange = null;\n};\n\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/main.ts?");

/***/ }),

/***/ "./src/config.json":
/*!*************************!*\
  !*** ./src/config.json ***!
  \*************************/
/*! default exports */
/*! export dataEndpoint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [not provided] [no usage info] [missing usage info prevents renaming] */
/*! export defaultMinuteSpan [provided] [no usage info] [missing usage info prevents renaming] */
/*! export development [provided] [no usage info] [missing usage info prevents renaming] */
/*! export reloadIntervalSec [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = JSON.parse(\"{\\\"development\\\":true,\\\"defaultMinuteSpan\\\":60,\\\"reloadIntervalSec\\\":30,\\\"dataEndpoint\\\":\\\"/climate/api\\\"}\");\n\n//# sourceURL=webpack://climate-ranger-frontend/./src/config.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 		module = execOptions.module;
/******/ 		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => "" + __webpack_require__.h() + ".hot-update.json";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "1ff921cdf096eb2653ee"
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "climate-ranger-frontend:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => fn(event));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: currentChildModule !== moduleId,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 					else hot._acceptedDependencies[dep] = callback || function () {};
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				registeredStatusHandlers[i].call(null, newStatus);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			setStatus("check");
/******/ 			return __webpack_require__.hmrM().then(function (update) {
/******/ 				if (!update) {
/******/ 					setStatus(applyInvalidatedModules() ? "ready" : "idle");
/******/ 					return null;
/******/ 				}
/******/ 		
/******/ 				setStatus("prepare");
/******/ 		
/******/ 				var updatedModules = [];
/******/ 				blockingPromises = [];
/******/ 				currentUpdateApplyHandlers = [];
/******/ 		
/******/ 				return Promise.all(
/******/ 					Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 						promises,
/******/ 						key
/******/ 					) {
/******/ 						__webpack_require__.hmrC[key](
/******/ 							update.c,
/******/ 							update.r,
/******/ 							update.m,
/******/ 							promises,
/******/ 							currentUpdateApplyHandlers,
/******/ 							updatedModules
/******/ 						);
/******/ 						return promises;
/******/ 					},
/******/ 					[])
/******/ 				).then(function () {
/******/ 					return waitForBlockingPromises(function () {
/******/ 						if (applyOnUpdate) {
/******/ 							return internalApply(applyOnUpdate);
/******/ 						} else {
/******/ 							setStatus("ready");
/******/ 		
/******/ 							return updatedModules;
/******/ 						}
/******/ 					});
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				setStatus("abort");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			// handle errors in accept handlers and self accepted module load
/******/ 			if (error) {
/******/ 				setStatus("fail");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw error;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			if (queuedInvalidatedModules) {
/******/ 				return internalApply(options).then(function (list) {
/******/ 					outdatedModules.forEach(function (moduleId) {
/******/ 						if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 					});
/******/ 					return list;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			setStatus("idle");
/******/ 			return Promise.resolve(outdatedModules);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdateclimate_ranger_frontend"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				if (
/******/ 					__webpack_require__.c[outdatedModuleId] &&
/******/ 					__webpack_require__.c[outdatedModuleId].hot._selfAccepted &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!__webpack_require__.c[outdatedModuleId].hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: __webpack_require__.c[outdatedModuleId].hot._requireSelf,
/******/ 						errorHandler: __webpack_require__.c[outdatedModuleId].hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (options.onErrored) {
/******/ 											options.onErrored({
/******/ 												type: "accept-errored",
/******/ 												moduleId: outdatedModuleId,
/******/ 												dependencyId: dependenciesForCallbacks[k],
/******/ 												error: err
/******/ 											});
/******/ 										}
/******/ 										if (!options.ignoreErrored) {
/******/ 											reportError(err);
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err);
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 									}
/******/ 									reportError(err);
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no deferred startup
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/main.ts");
/******/ })()
;