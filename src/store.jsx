import { configureStore } from "@reduxjs/toolkit";
import  toastReducer  from "./slice/Toast";
import checkLoginReducer from "./slice/CheckLogin"

export const store = configureStore({
    reducer:{
        toastSlice:toastReducer,
        checkout:checkLoginReducer
    }
})