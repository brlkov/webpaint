import React, {useState} from 'react';
import ToolState from "../store/ToolState";
import {useNavigate} from "react-router-dom";
import CanvasState from "../store/CanvasState";

const Settingsbar = () => {

    const navigate = useNavigate()
    const [sessionID, setSessionID] = useState()

    return (
        <div className="settingsbar">
            <label htmlFor="line-color">Color</label>
            <input
                onChange={e => {
                    ToolState.setLineColor(e.target.value);
                    ToolState.changeLineColor(e.target.value);
                }}
                id="line-color"
                type="color"
            />
            <label htmlFor="line-width">Width</label>
            <input
                onChange={e => {
                    ToolState.setLineWidth(e.target.value);
                    ToolState.changeLineWidth(e.target.value);
                }}
                id="line-width"
                type="number"
                defaultValue={1}
                min={1}
                max={50}
            />
            <label htmlFor="redirect">Redirect to session:</label>
            <input
                onChange={event => setSessionID(event.target.value)}
                id="redirect"
                type="text"
            />
            <button onClick={() => {
                if (sessionID) {
                    navigate('/' + sessionID)
                    document.location.reload()
                    CanvasState.id = sessionID
                }
            }}>Go</button>
        </div>
    );
};

export default Settingsbar;