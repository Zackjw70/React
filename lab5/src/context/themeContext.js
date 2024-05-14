import { createContext } from 'react'

export const themes = {
  light: {
    foreground: '#242526',
    background: '#fff',
    
  },
  dark: {
    foreground: '#fff',
    background: '#242526',

  },
};

// Let our context know what properties to expect
export const ThemeContext = createContext({
  theme: {},
});