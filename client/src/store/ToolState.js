import {makeAutoObservable} from "mobx";

class ToolState {
    constructor() {
        this.lineColor = 'black'
        this.lineWidth = 1
        this.tool = null
        makeAutoObservable(this)
    }

    setTool(tool) {
        this.tool = tool
    }

    setLineColor(color) {
        this.lineColor = color
    }

    setLineWidth(width) {
        this.lineWidth = width
    }

    changeLineColor(color) {
        this.tool.lineColor = color
    }

    changeLineWidth(width) {
        this.tool.lineWidth = width
    }

}

export default new ToolState()