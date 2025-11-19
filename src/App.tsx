import { Route, Routes } from 'react-router'
import './App.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClients'
import { useEffect } from 'react'
import { httpClient } from './api/httpClient'
import { HomePage } from './feautures/photos/pages/HomePage'
import { PhotoDetailsPage } from './feautures/photos/pages/PhotoDetailsPage'

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
        <Route path="/" element={<HomePage />} />
        <Route path="/photo/:id" element={<PhotoDetailsPage />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
