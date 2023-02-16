import Tool from "./Tool";
import ToolState from "../store/ToolState";
import axios from "axios";
import CanvasState from "../store/CanvasState";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen () {
        this.canvas.addEventListener("touchstart", this.touchStartHandler.bind(this), false)
        this.canvas.addEventListener("touchend", this.touchEndHandler.bind(this), false)
        this.canvas.addEventListener("touchmove", this.touchMoveHandler.bind(this), false)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    touchStartHandler (e) {
        this.touchStarted = true
        e.preventDefault()
    }

    mouseDownHandler (e) {
        this.mouseDown = true
    }

    touchEndHandler (e) {
        this.touchStarted = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "finish",
            }
        }))
        axios.post(`http://185.20.225.161:1000/image?id=${CanvasState.id}`, {img: this.canvas.toDataURL()})
            .then(response => console.log(response.data))
    }

    mouseUpHandler (e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "finish",
            }
        }))
        axios.post(`http://185.20.225.161:1000/image?id=${CanvasState.id}`, {img: this.canvas.toDataURL()})
            .then(response => console.log(response.data))
    }

    touchMoveHandler (e) {
        e.preventDefault()
        if (this.touchStarted){
            // this.dr(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "brush",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: ToolState.lineColor,
                    width: ToolState.lineWidth
                }
            }))
        }
    }

    mouseMoveHandler (e) {
        if (this.mouseDown){
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "brush",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: ToolState.lineColor,
                    width: ToolState.lineWidth
                }
            }))
        }
    }

    static draw (canvasContext, x, y, color, width) {
        canvasContext.strokeStyle = color
        canvasContext.lineWidth = width
        canvasContext.lineTo(x,y)
        canvasContext.stroke()
    }

    // dr (x, y) {
    //     this.canvasContext.strokeStyle = toolState.lineColor
    //     this.canvasContext.lineWidth = toolState.lineWidth
    //     this.canvasContext.lineTo(x,y)
    //     this.canvasContext.stroke()
    // }
}