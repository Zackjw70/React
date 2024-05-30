import {useState} from 'react'
import App from './App';
import AppRouter from './AppRouter'
import Open from './Open'
import { useEffect } from 'react';
import { ThemeContext, themes } from './context/themeContext';
import ToggleSwitch from './ToggleSwitch';
import './App.scss';
import TeamComp from './TeamComp';
import { Link } from 'react-router-dom';

function Home() {

    const [theme, setTheme] = useState(themes.light);
    const [showMain, setMain] = useState(true)
    const [showProd, setProd] = useState(false)

    useEffect(() => {
        document.body.style.background = theme.background;
      }, [theme]);

    const toggleTheme = () => {
        setTheme((prevValue) =>
          prevValue === themes.dark ? themes.light : themes.dark
        );
      };

    const handleShowMain = () =>{
        setMain(true);
        setProd(false);
    }
    const handleShowProd = () =>{
        setProd(true);
        setMain(false);
    }

    return (
        <ThemeContext.Provider value={{theme: theme}}>
            <div style={{backgroundColor: theme.background, color: theme.foreground}} className="nav-bar">
                <a href="#" className="nav-bar-links" onClick={() => handleShowMain()} style={{backgroundColor: theme.background, color: theme.foreground}}>
                    Home
                </a>
                <a href="#" className="nav-bar-links" onClick={() => handleShowProd()} style={{backgroundColor: theme.background, color: theme.foreground}}>
                    Agents
                </a>
                

                <ToggleSwitch onToggle={toggleTheme}/>
                
                
            </div>
            {showMain ? <Open/> : <AppRouter/> }
        </ThemeContext.Provider>
    )
}
export default Home