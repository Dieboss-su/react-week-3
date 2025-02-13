
import { NavLink } from "react-router-dom";

function AdminNavbar (){
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
                </ul>
                </div>
            </div>
        </nav>
    </>)
}

export default AdminNavbar;