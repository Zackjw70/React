import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App'
import Show from './Show'

function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/Show' element={<Show />}>
                    <Route path=":idNum" element={<Show />} />
                </Route>
            </Routes>
            
        </BrowserRouter>
    )
}export default AppRouter;