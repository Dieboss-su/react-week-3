
import { Route,Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserProductPage from './pages/UserProductPage';
import Navbar from './component/Navbar';


function App() {
  
  return (
    <>
    <Navbar/>
    <div className="container">
      <Routes>
        <Route path='/' element={<AdminPage />}></Route>
        <Route path='/product' element={<UserProductPage/>}></Route>
      </Routes>
    </div>
      
    </>
  );
}



export default App
