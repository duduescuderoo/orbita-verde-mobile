import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightColors, darkColors, AppColors, getSombra } from '@/constants/theme'

interface ThemeContextData {
  isDark: boolean
  colors: AppColors
  sombra: object
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextData>({
  isDark: false,
  colors: lightColors,
  sombra: getSombra(false),
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem('@tema').then(v => {
      if (v === 'dark') setIsDark(true)
    })
  }, [])

  const toggleTheme = async () => {
    const novo = !isDark
    setIsDark(novo)
    await AsyncStorage.setItem('@tema', novo ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{
      isDark,
      colors: isDark ? darkColors : lightColors,
      sombra: getSombra(isDark),
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
