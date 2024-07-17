import { useState } from 'react'
import Header from './Header'
import FheDemo from './FheDemo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Header title="Entity Of Code - AO - FHE How it works demo" />
            <FheDemo />
           
            <p className="read-the-docs">
            © 2024, Made with ❤️ by ENTITY OF CODE
            </p>
        </>
    )
}

export default App
