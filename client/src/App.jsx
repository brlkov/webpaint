import React from "react";
import "./styles/app.scss"
import Toolbar from "./components/Toolbar";
import Settingsbar from "./components/Settingsbar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";


const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:id" element={
                    <div className="app">
                        <Toolbar/>
                        <Settingsbar/>
                        <Canvas/>
                    </div>
                }/>
                <Route path="*" element={<Navigate replace to={`/${(+new Date).toString(24)}`}/>}/>
            </Routes>
        </BrowserRouter>

    );
}


export default App;
