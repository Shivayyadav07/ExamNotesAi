import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import History from './pages/History'
import PaymentSuccess from './pages/PaymentSuccess'
import Paymentfailed from './pages/Paymentfailed'
export const serverUrl = "http://localhost:8000"
 

function App() {
  
  const dispatch = useDispatch()

  useEffect(()=>{
    getCurrentUser(dispatch)
  },
[dispatch])

const {userData} = useSelector((state)=>state.user)
console.log(userData);

  return (
    <>
      <Routes>
          <Route path='/' element={ userData ? <Home /> : <Navigate to="/auth" replace/>} />
          <Route path='/auth' element={ userData ? <Navigate to="/" replace/> : <Auth />} />

          <Route path='/history' element={ userData ? <History /> : <Navigate to="/auth" replace/>} />
          <Route path='/notes' element={ userData ? <Notes /> : <Navigate to="/auth" replace/>} />
          <Route path='/pricing' element={ userData ? <Pricing /> : <Navigate to="/auth" replace/>} />
          <Route path='payment-success' element={<PaymentSuccess /> } />
          <Route path='payment-failed' element={<Paymentfailed /> } />


          
      </Routes>
    </>
  )
}

export default App
