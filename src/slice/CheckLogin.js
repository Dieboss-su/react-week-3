import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_API

export const CheckoutLoginSlice = createSlice({
    name:'checkout',
    initialState:[],
    reducers:{
        checkoutLogin(state,action){

        }
    }
})


export const createAsyncCheckout = createAsyncThunk(
    'checkout/createAsyncCheckout',
    async ({navigate,currentPage},params)=>{
        try {
            await axios.post(`${API_BASE}/api/user/check`);
                if(currentPage ==="login"){
                    alert("確認為管理者帳戶,幫您跳轉至後台管理頁面")
                    navigate('/admin')
                }
            } catch (err) {
                console.log(err);
                if(Page === 'admin'){
                    alert('您不是管理者,幫您跳轉回登入頁面');
                    navigate('/login')
                }else{
                    alert('尚未有登入資料,請重新登入');
                }
            }
    }
)

export const {checkoutLogin} = CheckoutLoginSlice.actions

export default CheckoutLoginSlice.reducer