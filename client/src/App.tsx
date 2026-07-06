import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserHomePage from './pages/UserHomePage'

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<UserHomePage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;