
// 모든 프로그램을 관리하는 최상위 컴포넌트

import React, { createContext, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./Client.css"

import Gamepad from "./SideLogic/Gamepad";
import Main from "./Main/Main"
import Select from "./Select/Select";
import User from "./Route/User";
import AddUser from "./Route/AddUser";

export const SystemContext = createContext({

    State : "",
    setState : () => {},

    Display : "",
    setDisplay : () => {},

    Icon : null,
    setIcon : () => {},

    Axe : null,
    setAxe : () => {},

    Button : null,
    setButton : () => {},

    Timer : null,
    setTimer : () => {}

})

const ClientSystem = () => {

    const [ State , setState] = useState(null)
    const [ Display , setDisplay ] = useState("mainscreen")
    const [ Icon , setIcon ] = useState(null)
    const [ Axe , setAxe ] = useState(null)
    const [ Button , setButton ] = useState(null)
    const [ Timer, setTimer ] = useState(null)

    return (

        <div>
            <Router>
            <SystemContext.Provider value={{State, setState, Display, setDisplay, Icon, setIcon, Axe, setAxe, Button, setButton, Timer, setTimer}}>
                <Gamepad />
                <Routes>
                    <Route path="/" element={Display === "mainscreen" ? <Main/> : <Select/>} />
                    <Route path="/adduser" element={<AddUser/>} />
                    <Route path="/user" element={<User/>} />
                </Routes>
            </SystemContext.Provider>
            </Router>
        </div>
    )
}

export default ClientSystem