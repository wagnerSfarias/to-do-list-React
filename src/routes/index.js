import { Routes, Route} from 'react-router-dom'

import Home from '../pages/Home';
import Register from '../pages/Register';
import Admin from '../pages/Admin';
import Privete from './Privete';

function RoutesApp(){
  return(
    <Routes>
      <Route path='/' element={ <Home/> } />
      <Route path='/register' element={ <Register/> } />
      <Route path='/admin' element={ <Privete> <Admin/> </Privete>  } />
    </Routes>
  )
}

export default RoutesApp;