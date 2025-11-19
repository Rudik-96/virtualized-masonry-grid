import { Route, Routes } from 'react-router'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<div>Home page</div>} />
      <Route path="/photo/:id" element={<div>Photo details</div>} />
    </Routes>
  )
}

export default App
