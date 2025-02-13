import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_API;
const API_PATH = import.meta.env.VITE_BASE_PATH;


function UserProductPage() {
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState([]);
    const [screenLoading,setScreenLoading] = useState(false);
    const [isLoading,setIsLoading] = useState([]);
    //建立hook form
    const {register,
        handleSubmit,
        formState:{ errors },
        reset
    } = useForm(
                {
            defaultValues:{
                email:'',
                name:'',
                tel:'',
                address:'',
                message:''
            }
        }
    )
    const onSubmit = (data) =>{
        if(cart.carts.length < 1){
            return alert("您的購物車並沒有資料")
        }
        const {message,...user} = data;

        const userInfo = {
            data:{
                user,
                message
            }
        };
        checkOut(userInfo)
        reset()
    }
    const checkOut = async (userInfo)=>{
        setScreenLoading(true)
        try{
            await axios.post(`${BASE_URL}/api/${API_PATH}/order`,userInfo)
            alert('結帳成功')
            getCartList()
        }catch(err){
            alert("結帳失敗:",err.response.data.message)
        }finally{
            setScreenLoading(false)
        }
    }
    //取得購物車清單
    const [cart,setCart] = useState({});
    const getCartList = async ()=>{
        try{
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`)
            setCart(res.data.data)
        }catch(err){
            alert(err.response);
        }
    }
    const removeCarts = async()=>{
        setScreenLoading(true)
        try {
            await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`)
            alert('已為您清空購物車')
            getCartList()
        } catch (error) {
            alert(error.response.data.message)
        }finally{
            setScreenLoading(false)
        }
    }
    useEffect(() => {
        setScreenLoading(true)
        const getProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products`);
            setProducts(res.data.products);
        } catch (error) {
            alert("取得產品失敗");
            console.log(error.response);
        }finally{
            setScreenLoading(false)
        }
        };
        getProducts();
        getCartList()
    }, []);

    const openModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.show();
    };

    const closeModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
    };

    const handleSeeMore = (product) => {
        setTempProduct(product);
        openModal();
    };

    const [qtySelect, setQtySelect] = useState(1);

    const addToCart = async (product_id,qty=1)=>{
        const data = {
            product_id,
            'qty':Number(qty)
        }
        setIsLoading((preState)=>{
            return [...preState,product_id]
        })
        try{
            const res = await axios.post(`${BASE_URL}/api/${API_PATH}/cart`,{data})
        }catch(err){
            alert(err.response);
        }finally{
            setIsLoading((preState)=>preState.filter((item) => item !== product_id))
        }
    }
    const changeCartQty = async (product_id,qty=1)=>{
        const data = {
            product_id,
            'qty':Number(qty)
        }
        setScreenLoading(true)
        try{
            await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${product_id}`,{data})
            getCartList()
        }catch(err){
            console.log(err.response);
        }finally{
            setScreenLoading(false)
        }
    }
    const removeCart = async (product_id)=>{
        setScreenLoading(true)
        try{
            await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${product_id}`)
            alert('已刪除此品項')
            getCartList()
        }catch(err){
            console.log(err.response);
        }finally{
            setScreenLoading(false)
        }
    }
    return (<>
    {/*讀取狀態*/}
    {screenLoading?<div className="position-fixed d-flex align-items-center justify-content-center" 
        style={{top:0,left:0,right:0,bottom:0,
            backgroundColor:'rgba(255,255,255,0.3)',
            zIndex:'1000',
        }}
    >
    <ReactLoading  type={'bars'} color={'gray'} height={"40px"} width={"40px"}/>
    </div>:""}
    {/*讀取狀態*/}
    <div className="container">
        <div className="mt-4">
            <table className="table align-middle">
            <thead>
                <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr key={product.id}>
                    <td style={{ width: "200px" }}>
                    <div className="overflow-hidden" 
                    style={{height:200}}
                    >
                    <img
                        className="h-100 w-100 object-fit-cover"
                        src={product.imageUrl}
                        alt={product.title}
                    />
                    </div>
                    </td>
                    <td>{product.title}</td>
                    <td>
                    <del className="h6">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.origin_price}元</div>
                    </td>
                    <td>
                    <div className="btn-group btn-group-sm">
                        <Link
                        to= {`${product.id}`}
                        className="btn btn-outline-secondary"
                        >
                        查看更多
                        </Link>
                        <button  type="button" onClick={()=>addToCart(product.id)} className="btn btn-outline-danger d-flex" disabled={isLoading?.includes(product.id)}>
                        加到購物車
                        {isLoading?.includes(product.id)&&
                        <span className="ms-2">
                            <ReactLoading type={"spin"} color={"red"} height={'20px'} width={'20px'} />
                        </span>
                        }
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
    </>);
}

export default UserProductPage;
