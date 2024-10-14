import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './shared/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='flex'>
      <Sidebar /> 
        <div className="flex-grow  p-6 ">
        {/* Your main content goes here */}
        <h1 >Welcome to the App</h1>
      </div>
     </div>
    </>
  )
}

export default App
