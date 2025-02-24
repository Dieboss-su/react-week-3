import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { removeToastMessage } from "../slice/Toast";

export default function Toast() {
    const toastMessage = useSelector((state)=> state.toastSlice);
    const dispatch = useDispatch()
    const toastRef = useRef({})

    useEffect(()=>{
        toastMessage.forEach((item)=>{
            const toastElement = toastRef.current[item.id]
            
            if(toastElement){
                const toastInstance = new BsToast(toastElement)
                toastInstance.show()
            }
            setTimeout(()=>{
                dispatch(removeToastMessage(item.id))
            },2000)
        })
    },[toastMessage])
return (<>
        <div  className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
            {toastMessage?.map((item)=>{
                return(
                        <div
                        key={item.id}
                        ref={(el) => toastRef.current[item.id] = el}
                        className={`toast`}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                        >
                        <div className={`toast-header ${item.status?"bg-success":'bg-danger'} text-white`}>
                            <strong className="me-auto">{item.status?"成功":'失敗'}</strong>
                            <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={()=>dispatch(removeToastMessage(item.id))}
                            ></button>
                        </div>
                        <div className="toast-body">{item.message}</div>
                        </div>
                )
                
            })
        }
    </div>
</>
);
}
