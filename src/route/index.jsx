import { createHashRouter } from "react-router-dom";
import App from "../App.jsx"
import Login from "../pages/Login";
import AdminPage from "../pages/AdminPage";
import Home from "../pages/Home";
import ProductDetailPage from "../pages/ProductDetailPage";
import UserProductPage from "../pages/UserProductPage";
import Carts from "../pages/Carts"

const routes = [
    {
        path:'/',
        element:<App/>,
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:'products',
                element:<UserProductPage/>
            },
            {
                path:'products/:id',
                element:<ProductDetailPage/>
            },
            {
                path:'carts',
                element:<Carts/>
            },
        ]
    },
    {
        path:'/admin',
        element:<AdminPage/>
    },
    {
        path:'/login',
        element:<Login />
    }
]

const router = createHashRouter(routes)

export default router;