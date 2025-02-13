import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar (){
    return(<>
        <nav className="navbar navbar-expand-lg  bg-secondary">
            <div className="container-fluid">
                <span className="navbar-brand" href="#">美式餐廳</span>
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
                        }} to='/'> Home</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink className={({isActive}) =>{
                            return (
                                `nav-link ${isActive? 'text-light':''}`
                            )
                        }} to='/products'> 使用者產品頁面</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink className={({isActive}) =>{
                            return (
                                `nav-link ${isActive? 'text-light':''}`
                            )
                        }} to='/carts'> 購物車</NavLink>
                    </li>
                    <li className="nav-item ">
                        <NavLink className={({isActive}) =>{
                            return (
                                `nav-link ${isActive? 'text-light':''}`
                            )
                        }} to='/login'> 管理者登入</NavLink>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    </>)
}

export default Navbar;