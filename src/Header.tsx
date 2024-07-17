import { useState, useEffect } from 'react'
import logoDark from './assets/code Black s.svg'
import logoLight from './assets/code white S.svg'
import styles from './Header.module.css'

interface HeaderProps {
    title?: string
}

const Header: React.FC<HeaderProps> = ({}) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const prefersDarkScheme = window.matchMedia(
            '(prefers-color-scheme: dark)'
        )
        setIsDarkMode(prefersDarkScheme.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setIsDarkMode(event.matches)
        }

        prefersDarkScheme.addEventListener('change', handleChange)

        return () => {
            prefersDarkScheme.removeEventListener('change', handleChange)
        }
    }, [])

    const logo = isDarkMode ? logoLight : logoDark

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="Logo" className={styles.logo} />
            </div>
            <p
                className={
                    isDarkMode ? styles.taglineDark : styles.taglineLight
                }
            >
                where [c] stands for more than just crypto
            </p>
        </div>
    )
}

export default Header
