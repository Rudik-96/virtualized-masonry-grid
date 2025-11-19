import { Route, Routes } from 'react-router'
import './App.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClients'
import { useEffect } from 'react'
import { httpClient } from './api/httpClient'

function App() {
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await httpClient<any>("/curated?page=1&per_page=1");
      console.log(data);
    };
    fetchData();
  }, [])

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
