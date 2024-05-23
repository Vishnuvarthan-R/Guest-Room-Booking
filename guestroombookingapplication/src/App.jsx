import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './home/Home';
import Signup from './signup/signup'
import Login from './login/login'
import HouseOwner from './houseowner/HouseOwner'
import Customer from './customer/Customer'
import About from './About/About';
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/'element={<Home />}> </Route>
          <Route path='/register'element={<Signup />}> </Route>
          <Route  path='/login' element={<Login />}> </Route>
          <Route  path='/houseowner' element={<HouseOwner />}> </Route>
          <Route  path='/CustomerLogin' element={<Customer />}> </Route>
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App