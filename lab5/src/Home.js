import {useState} from 'react'
import App from './App';
import AppRouter from './AppRouter'
import Open from './Open'
import { useEffect } from 'react';
import { ThemeContext, themes } from './context/themeContext';
import ToggleSwitch from './ToggleSwitch';

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
            <div style={{backgroundColor: theme.background, color: theme.foreground}}>
                <button onClick={() => handleShowMain()} style={{backgroundColor: theme.background, color: theme.foreground}}>
                    Home Page
                </button>
                <button onClick={() => handleShowProd()} style={{backgroundColor: theme.background, color: theme.foreground}}>
                    Products
                </button>
                <ToggleSwitch onToggle={toggleTheme} />
                
                {showMain ? <Open/> : <AppRouter/>}
            </div>
        </ThemeContext.Provider>
    )
}
export default Home