import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
    name:'toast',
    initialState:[
    ],
    reducers:{
        createToastMessage(state,action){
            const id = new Date().getTime()
            state.push(
                {
                id,
                status:action.payload.success,
                message:action.payload.message}
            )
        },
        removeToastMessage(state,action){
            const id = action.payload

            const index = state.findIndex((item)=>item.id === id)
            if(index !== -1){
                state.splice(index,1)
            }
        }
    }
})

export const {createToastMessage,removeToastMessage} = toastSlice.actions

export default toastSlice.reducer;