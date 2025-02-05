import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Login from './Login';
import ModalPage from '../component/ModalPage'
import Pagination from '../component/Pagination';
import ProductPage from './ProductPage';


const API_BASE = import.meta.env.VITE_BASE_API;

const API_PATH = import.meta.env.VITE_BASE_PATH; 

const defaultModalState = {
"title": "",
"category": "",
"salesQuantity":"",
"origin_price": "",
"price": "",
"unit": "",
"description": "",
"content": "",
"is_enabled": 0,
"imageUrl": "",
"imagesUrl": [
    ""
]
};


function AdminPage (){
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isAuth, setisAuth] = useState(false);
    const [productsData,setProductsData] = useState([]);
    const [pagination,setPagination] = useState(null)
    const productModalRef = useRef(null);
    
    useEffect(() => {
        const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
        );
        axios.defaults.headers.common.Authorization = token;
        productModalRef.current = new Modal('#productModal', {
        backdrop: 'static',
        keyboard: false
        });
        checkAdmin();
    }, []);
    
    useEffect(() => {
        if(isAuth){
        getProducts()
        }
    },[isAuth])
    
    const checkAdmin = async () => {
        try {
        await axios.post(`${API_BASE}/api/user/check`);
        setisAuth(true);
        } catch (err) {
        alert(err.response.data.message);
        }
    };
    
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [id]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(`${API_BASE}/admin/signin`, formData);
        const { token, expired } = response.data;
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        axios.defaults.headers.common.Authorization = token;
        setisAuth(true);
        } catch (error) {
        alert("登入失敗: " + error.response.data.message);
        }
    };
    const getProducts = async (page = 1) => {
        try{
        const response = await axios.get(`${API_BASE}/api/${API_PATH }/admin/products?page=${page}`)
        setProductsData(...[response.data?.products])
        setPagination({...response.data?.pagination})
        }catch(err){
        alert(err.data.message);
        }
    };
    const handlePage = (page)=>{
        getProducts(page)
    }
    const deleteProduct = async (id) => {
        try {
        const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
        alert(response?.data?.message);
        getProducts()
        } catch (error) {
        alert(error.response?.data?.message)
        }
    }
    //modal相關
    const [modalState,setModalState] = useState(defaultModalState);
    const [modalMode,setModalMode] = useState(null);
    const handleModalSubmit = async (e,id) => {
        e.preventDefault()
        switch (modalMode) {
        case "create" :
            try{
            const response  = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{data:modalState})
            alert(response?.data?.message);
            productModalRef.current.hide();
            getProducts()
            }catch(err){
            alert(err.response?.data?.message)
            }
        break;
        case 'edit' :
            try{
            const response  = await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${id}`,{data:modalState})
            alert(response?.data?.message);
            productModalRef.current.hide();
            getProducts()
            setModalState(defaultModalState)
            }catch(err){
            alert(err.response?.data?.message)
            }
        break;
    
        default:
            return;
        };
    
        
    }
    const openModal = (mode,product) => {
        setModalMode(mode)
        switch (mode) {
        case "create" :
        setModalState(defaultModalState);
        break;
        case 'edit' :
        setModalState(product);
        break;
    
        default:
            return;
        };
        productModalRef.current.show()
    }
    
    const handleModalInputChange = (e) => {
        const {name,value,checked,type} = e.target;
        const isNumericField = ["origin_price", "price"].includes(name)
        setModalState({...modalState,[name]:type === 'checkbox' ? checked?1:0: isNumericField?Number(value):value}
        )
    }
    
    return (<>
        {isAuth ? (
        <ProductPage
        productsData={productsData}
        openModal={openModal}
        deleteProduct={deleteProduct}
        />
        ) : <Login handleInputChange={handleInputChange} handleSubmit={handleSubmit}
        formData={formData} 
        />}
            {/*MOdal*/}
            <ModalPage handleModalInputChange={handleModalInputChange} productModalRef={productModalRef} handleModalSubmit={handleModalSubmit}
            modalState={modalState}
            setModalState={setModalState}
            modalMode={modalMode}
            API_BASE={API_BASE}
            API_PATH={API_PATH}
            />
        <Pagination
        pagination={pagination}
        handlePage={handlePage}
        />
    </>
    )
}

export default AdminPage;