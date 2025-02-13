import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_API;
const API_PATH = import.meta.env.VITE_BASE_PATH;


export default function ProductDetailPage() {
    const [isLoading,setIsLoading] = useState([]);
    const [screenLoading,setScreenLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [qtySelect, setQtySelect] = useState(1);
    const {id} = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        setScreenLoading(true)
        const getProduct = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/product/${id}`);
            setProduct(res.data.product);
        } catch (error) {
            alert("取得產品失敗");
            console.log(error.response);
        }finally{
            setScreenLoading(false)
        }
        };
        getProduct();
    }, []);

    const addToCart = async (product_id,qty=1)=>{
        const data = {
            product_id,
            'qty':Number(qty)
        }
        setScreenLoading(true)
        try{
            const res = await axios.post(`${BASE_URL}/api/${API_PATH}/cart`,{data})
            alert("已加入購物車")
        }catch(err){
            alert(err.response);
        }finally{
            setScreenLoading(false)
        }
    }

    return(
        <>
                    <h2 className="fs-5">
                    產品名稱：
                    </h2>
                    <div className="d-flex justify-content-center">
                        <div className="overflow-hidden " style={{height:300,width:300}}>
                        <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-fit-cover"
                            />
                        </div>
                    </div>
                    <p>內容：{product.content}</p>
                    <p>描述：{product.description}</p>
                    <p>
                    價錢：{product.price}{" "}
                    <del>{product.origin_price}</del> 元
                    </p>
                    <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select
                        value={qtySelect}
                        id="qtySelect"
                        className="form-select"
                        onChange={(e) => setQtySelect(e.target.value)}
                    >
                        {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                        ))}
                    </select>
                    </div>
                <div className="d-flex justify-content-center my-3">
                    <button type="button" className="btn btn-primary d-flex" onClick={()=>addToCart(id,qtySelect)}>
                    加入購物車</button>
                    <button type="button" className="btn btn-outline-primary ms-2" onClick={()=>{navigate(-1)}}> 返回產品頁 </button>
                </div>
                {screenLoading?<div className="position-fixed d-flex align-items-center justify-content-center" 
                    style={{top:0,left:0,right:0,bottom:0,
                        backgroundColor:'rgba(255,255,255,0.3)',
                        zIndex:'1000',
                    }}>
                <ReactLoading  type={'bars'} color={'gray'} height={"40px"} width={"40px"}/>
                </div>:""}
        </>
    )
}