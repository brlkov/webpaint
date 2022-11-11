import Brush from "./Brush";
import ToolState from "../store/ToolState";

export default class Eraser extends Brush {
    mouseMoveHandler (e) {
        if (this.mouseDown){
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "eraser",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    width: ToolState.lineWidth
                }
            }))
        }
    }

    static draw(canvasContext, x, y, width) {
        canvasContext.lineWidth = width
        canvasContext.strokeStyle = "white"
        canvasContext.lineTo(x, y)
        canvasContext.stroke()
    }
}