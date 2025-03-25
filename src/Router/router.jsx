import React from 'react'
import { Routes } from 'react-router-dom'
import Home from '../pages/home/home'
const router = () => {
  return (
    
    <Routes>
      <Route path="/" exact component={Home} />
     
    </Routes>
  )
}

export default router
