import {useState} from 'react'
import App from './App'
import AppRouter from './AppRouter'
import Open from './Open'

function Home() {
    const [showMain, setMain] = useState(true)
    const [showProd, setProd] = useState(false)

    const handleShowMain = () =>{
        setMain(true);
        setProd(false);
    }
    const handleShowProd = () =>{
        setProd(true);
        setMain(false);
    }

    return (
        <div>
            <button onClick={() => handleShowMain()}>
                Home Page
            </button>
            <button onClick={() => handleShowProd()}>
                Products
            </button>
            {showMain ? <Open/> : <AppRouter/>}
        </div>
    )
}
export default Home