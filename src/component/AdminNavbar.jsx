
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_PATH = import.meta.env.VITE_BASE_API

function AdminNavbar (){
    const navigate = useNavigate()
    const logout = async(e)=>{
        
        e.preventDefault()
        try {
            await axios.post(`${API_PATH}/logout`)
            alert('登出成功幫您跳轉到首頁')
            document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate('/')
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message)
        }
    }
    return(<>
        <nav className="navbar navbar-expand-lg  bg-secondary">
            <div className="container-fluid">
                <span className="navbar-brand" href="#">後台頁面管理</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                    <li className="nav-item ">
                        <NavLink className={({isActive}) =>{
                            return (
                                `nav-link ${isActive? 'text-light':''}`
                            )
                        }} to='/'> 回到前台首頁</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink className={({isActive}) =>{
                            return (
                                `nav-link ${isActive? 'text-light':''}`
                            )
                        }} to='/' onClick={(e)=>logout(e)}> 登出</NavLink>
                    </li>

                </ul>
                </div>
            </div>
        </nav>
    </>)
}

export default AdminNavbar;