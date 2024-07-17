// src/components/Loader.tsx
import React from 'react'

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin">
                <p> We are processing FHE</p>
            </div>
        </div>
    )
}

export default Loader
