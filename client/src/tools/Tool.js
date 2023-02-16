export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.resetEvents()
    }

    resetEvents () {
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
        this.canvas.onmousemove = null
    }
}
