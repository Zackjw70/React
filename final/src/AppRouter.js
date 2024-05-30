import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App'
import Show from './Show'
import TeamComp from './TeamComp'
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppRouter(){
    return (
        <BrowserRouter>
        <ToastContainer/>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/Show' element={<Show />}>
                    <Route path=":idNum" element={<Show />} />
                </Route>
                <Route path ='/TeamComp' element={<TeamComp />}>
                </Route>
            </Routes>
        
            
        </BrowserRouter>
    )
}export default AppRouter;