import React from 'react';
import "../styles/bar.scss"
import ToolState from "../store/ToolState";
import CanvasState from "../store/CanvasState";
import Brush from "../tools/Brush";
import Eraser from "../tools/Eraser";

const Toolbar = () => {

    const download = () => {
        const dataUrl = CanvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = CanvasState.id + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="toolbar">
            <button className="toolbar__btn brush" onClick={() => ToolState.setTool(new Brush(CanvasState.canvas, CanvasState.socket, CanvasState.id))}/>
            <button className="toolbar__btn eraser" onClick={() => ToolState.setTool(new Eraser(CanvasState.canvas, CanvasState.socket, CanvasState.id))}/>
            <button type="submit" className="toolbar__btn undo" onClick={() => {
                CanvasState.socket.send(JSON.stringify({method: "undo", id: CanvasState.id}))
            }}/>
            <button type="submit" className="toolbar__btn redo" onClick={() => {
                CanvasState.socket.send(JSON.stringify({method: "redo", id: CanvasState.id}))
            }}/>
            <button type="submit" className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default Toolbar;