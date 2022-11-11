import {makeAutoObservable} from "mobx";
import axios from "axios";

class CanvasState {
    constructor() {
        this.undoList = []
        this.redoList = []
        this.canvas = null
        this.socket = null
        this.id = null
        makeAutoObservable(this)
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    undo() {
        let canvasContext = this.canvas.getContext('2d')
        if (this.undoList.length > 0) {
            let dataImg = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataImg
            img.onload = () => {
                canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height)
                canvasContext.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
            axios.post(`http://185.20.225.161:1000/image?id=${this.id}`, {img: dataImg})
                .then(response => console.log(response.data))
        } else {
            canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height)
            axios.post(`http://185.20.225.161:1000/image?id=${this.id}`, {img: this.canvas.toDataURL()})
                .then(response => console.log(response.data))
        }
    }

    redo() {
        let canvasContext = this.canvas.getContext('2d')
        if (this.redoList.length > 0) {
            let dataImg = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataImg
            img.onload = () => {
                canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height)
                canvasContext.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
            axios.post(`http://185.20.225.161:1000/image?id=${this.id}`, {img: dataImg})
                .then(response => console.log(response.data))
        }
    }

}

export default new CanvasState()