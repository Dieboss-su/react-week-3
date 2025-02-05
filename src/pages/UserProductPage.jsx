import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

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

    const productModalRef = useRef(null);
    useEffect(() => {
        new Modal(productModalRef.current, { backdrop: false });
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
            getCartList()
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
                        <button
                        onClick={() => handleSeeMore(product)}
                        type="button"
                        className="btn btn-outline-secondary"
                        >
                        查看更多
                        </button>
                        <button  type="button" onClick={()=>addToCart(product.id)} className="btn btn-outline-danger d-flex">
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
            {/* modal */}
            <div
            ref={productModalRef}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            className="modal fade"
            id="productModal"
            tabIndex="-1"
            >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title fs-5">
                    產品名稱：{tempProduct.title}
                    </h2>
                    <button
                    onClick={closeModal}
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                    />
                    <p>內容：{tempProduct.content}</p>
                    <p>描述：{tempProduct.description}</p>
                    <p>
                    價錢：{tempProduct.price}{" "}
                    <del>{tempProduct.origin_price}</del> 元
                    </p>
                    <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select
                        value={qtySelect}
                        onChange={(e) => setQtySelect(e.target.value)}
                        id="qtySelect"
                        className="form-select"
                    >
                        {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary d-flex" onClick={()=>addToCart(tempProduct.id,qtySelect)}>
                    加入購物車
                    {isLoading?.includes(tempProduct.id)&&
                        <span className="ms-2">
                            <ReactLoading type={"spin"} color={"white"} height={'20px'} width={'20px'} />
                        </span>
                        }
                    </button>
                </div>
                </div>
            </div>
            </div>
            {/* modal */}
            {/* 購物車 */}
            
            {cart.carts?.length > 0?<div className="text-end py-3">
            <button className="btn btn-outline-danger" type="button" onClick={removeCarts}>
                清空購物車
            </button>
            </div>:""}

            <table className="table align-middle">
            <thead>
                <tr>
                <th></th>
                <th>圖示</th>
                <th>品名</th>
                <th style={{ width: "150px" }}>數量/單位</th>
                <th className="text-end">單項總價</th>
                </tr>
            </thead>
            {cart.carts?.length === 0 ?
            <tbody>
                <tr>
                    <td colSpan="5">購物車沒有品項...</td>
                </tr>
            </tbody>
            :(<>
            <tbody>
                
                {cart.carts?.map((item)=>{
                    return(
                    <tr key={item.id}>
                        <td >
                            <button type="button" 
                            className="btn btn-outline-danger btn-sm"
                            onClick={()=>removeCart(item.id)}
                            >
                            x
                            </button>
                        </td>
                        <td className="d-flex justify-content-center">
                            <div className="overflow-hidden ms-2" style={{height:150,width:150}}>
                            <img className="object-fit-cover" src={item.product.imageUrl} alt={item.product.title} />
                            </div>
                        </td>
                        <td>{item.product.title}</td>
                        <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                            <button
                            type="button"
                            className={`btn btn-outline-dark btn-sm ${item.qty === 1?'bg-dark text-light':""}`}
                            disabled={item.qty === 1}
                            onClick={()=>changeCartQty(item.id,item.qty - 1)}
                            >
                            -
                            </button>
                            <span
                            className="btn border border-dark"
                            style={{ width: "50px", cursor: "auto" }}
                            >{item.qty}</span>
                            <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={()=>changeCartQty(item.id,item.qty + 1)}
                            >
                            +
                            </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                            {item.product.unit}
                        </span>
                        </div>
                    </td>
                    <td className="text-end">${item.total}元</td>
                </tr>)
                })}
                
                
            </tbody>
            <tfoot>
                <tr>
                <td colSpan="4" className="text-end">
                    總計：{cart.final_total}
                </td>
                <td className="text-end" style={{ width: "130px" }}></td>
                </tr>
            </tfoot>
            </>)
            }
            </table>
            {/* 購物車 */}
        </div>
        {/* 表單 */}
        <div className="my-5 row justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                Email
                </label>
                <input
                id="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                {...register('email',
                    {
                        required:'Email為必填',
                        pattern:{
                            value:/^\S+@\S+$/,
                            message:'Email格式不正確'
                        }
                    }
                )}
                />

                {errors.email&&<p className="text-danger my-2 ">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                收件人姓名
                </label>
                <input
                id="name"
                className="form-control"
                placeholder="請輸入姓名"
                {...register('name',
                    {required:"姓名為必填"}
                )}
                />
                {errors.name && <p className="text-danger my-2 ">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                收件人電話(手機號碼)
                </label>
                <input
                id="tel"
                type="text"
                className="form-control"
                placeholder="請輸入電話"
                {...register('tel',
                    {
                        required:"手機號碼為必填",
                        pattern: {
                            value: /^\d{10}$/,
                            message: '手機號碼格式不正確'
                        }
                    }
                )}
                />

                {errors.tel && <p className="text-danger my-2 ">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="address" className="form-label">
                收件人地址
                </label>
                <input
                id="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                {...register('address',
                    {required:"地址為必填"}
                )}
                />

                {errors.address && <p className="text-danger my-2 ">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="message" className="form-label">
                留言
                </label>
                <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
                {...register('message')}
                ></textarea>
            </div>
            <div className="text-end">
                <button type="submit" className="btn btn-danger">
                送出訂單
                </button>
            </div>
            </form>
        </div>
        {/* 表單 */}
    </div>
    </>);
}

export default UserProductPage;
