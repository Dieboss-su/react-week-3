
import { Outlet} from 'react-router-dom';
import Navbar from './component/Navbar';


function App() {
  
  return (
    <>
    <Navbar/>
    <div className="container">
      <Outlet />
    </div>
      
    </>
  );
}



export default App
