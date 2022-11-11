import React, {useEffect, useRef} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import CanvasState from "../store/CanvasState";
import toolState from "../store/ToolState";
import Brush from "../tools/Brush";
import {useParams} from "react-router-dom";
import Eraser from "../tools/Eraser";
import axios from "axios";


const Canvas = observer(() => {
    const params = useParams()
    const canvasRef = useRef()

    useEffect(() => {
        CanvasState.setCanvas(canvasRef.current)
        axios.get(`http://185.20.225.161:1000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                const canvasContext = canvasRef.current.getContext('2d')
                img.src = response.data
                img.onload = () => {
                    canvasContext.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
                    canvasContext.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    useEffect(() => {
        const socket = new WebSocket('ws://185.20.225.161:1000/')
        CanvasState.socket = socket
        CanvasState.id = params.id
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))
        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: params.id,
                method: "connection"
            }))
        }
        socket.onmessage = (event) => {
            let message = JSON.parse(event.data)
            switch (message.method) {
                case "connection":
                    console.log(`User connected to session ${message.id}`)
                    break
                case "draw":
                    drawHandler(message)
                    break
                case "undoList":
                    CanvasState.undoList = message.data
                    break
                case "undo":
                    console.log("undo")
                    CanvasState.undo()
                    break
                case "redo":
                    CanvasState.redo()
                    break
            }
        }
    }, [])

    const drawHandler = (message) => {
        const figure = message.figure
        const canvasContext = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(canvasContext, figure.x, figure.y, figure.color, figure.width)
                break
            case "eraser":
                Eraser.draw(canvasContext, figure.x, figure.y, figure.width)
                break
            case "finish":
                canvasContext.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        CanvasState.pushToUndo(canvasRef.current.toDataURL())
        CanvasState.socket.send(JSON.stringify({
            id: params.id,
            method: "undoList",
            data: CanvasState.undoList
        }))
    }

    return (
        <div className="canvas">
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={window.innerWidth * 0.8} height={window.innerHeight * 0.7}/>
        </div>
    );
});

export default Canvas;