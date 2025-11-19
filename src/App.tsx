import { Route, Routes } from 'react-router'
import './App.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClients'

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/photo/:id" element={<div>Photo details</div>} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
