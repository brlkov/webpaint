import ToolState from "../store/ToolState";

export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.canvasContext = canvas.getContext('2d')
        this.canvasContext.strokeStyle = ToolState.lineColor
        this.canvasContext.lineWidth = ToolState.lineWidth
        this.resetEvents()
    }

    set lineColor (color) {
        this.canvasContext.strokeStyle = color
    }

    set lineWidth (width){
        this.canvasContext.lineWidth = width
    }

    resetEvents () {
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
        this.canvas.onmousemove = null
    }
}