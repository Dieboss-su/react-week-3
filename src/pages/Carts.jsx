import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';
import { useNavigate } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_BASE_API;
const API_PATH = import.meta.env.VITE_BASE_PATH;


export default function Carts (){
    const navigate = useNavigate()
    const [screenLoading,setScreenLoading] = useState(false);
    const [cart,setCart] = useState({});
    const getCartList = async ()=>{
        try{
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`)
            setCart(res.data.data)
        }catch(err){
            alert(err.response);
        }
    }
    useEffect(()=>{
        getCartList()
    },[])
   
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
    // 表單處理
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
            alert('結帳成功,為您跳轉回產品頁')
            navigate('/products')
        }catch(err){
            alert("結帳失敗:",err.response.data.message)
        }finally{
            setScreenLoading(false)
        }
    }

    return(
        <>
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
            <div className="text-center">
                <button type="submit" className="btn btn-danger">
                送出訂單
                </button>
            </div>
            </form>
        </div>
        {/* 表單 */}

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
        </>
    )
}