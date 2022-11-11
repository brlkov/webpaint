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
        // this.canvas.touchStart = this.touchStartHandler.bind(this)
        // this.canvas.touchEnd = this.touchEndHandler.bind(this)
        // this.canvas.touchMove = this.touchMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    // touchStartHandler (e) {
    //     this.touchStarted = true
    //     e.preventDefault()
    //     this.canvasContext.beginPath()
    //     this.canvasContext.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    // }

    mouseDownHandler (e) {
        this.mouseDown = true
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    // touchEndHandler (e) {
    //     this.touchStarted = false
    //     this.socket.send(JSON.stringify({
    //         method: "draw",
    //         id: this.id,
    //         figure: {
    //             type: "finish",
    //         }
    //     }))
    // }

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

    // touchMoveHandler (e) {
    //     e.preventDefault()
    //     if (this.touchStarted){
    //         this.socket.send(JSON.stringify({
    //             method: "draw",
    //             id: this.id,
    //             figure: {
    //                 type: "brush",
    //                 x: e.pageX - e.target.offsetLeft,
    //                 y: e.pageY - e.target.offsetTop,
    //                 color: ToolState.lineColor,
    //                 width: ToolState.lineWidth
    //             }
    //         }))
    //     }
    // }

    mouseMoveHandler (e) {
        if (this.mouseDown){
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
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
}