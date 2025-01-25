import axios from 'axios'
import { useState,} from 'react'

function ModalPage ({handleModalInputChange,productModalRef,handleModalSubmit,modalState,setModalState,modalMode,API_PATH,API_BASE}){
    const closeModal = () => {
        productModalRef.current.hide()
    }
    const handleImagesInput = (e,index) =>{
        const newImagesState = [...modalState.imagesUrl]
        newImagesState[index] = e.target.value
        setModalState({...modalState,
          imagesUrl:newImagesState
        })
    }
    const handleCreateImages = () => {
    const newImagesState = [...modalState.imagesUrl,""]
    setModalState({...modalState,
        imagesUrl:newImagesState
    })
    }
    const handleDeleteImages = () => {
    const newImagesState = [...modalState.imagesUrl];
    newImagesState.pop();
    setModalState({...modalState,
        imagesUrl:newImagesState
    })
    }
    const handleFileChange = async (e) => {
        if (e.target.files[0].size > 3*1024*1024){
            e.target.value = "";
            return alert('檔案不得超過3MB')
        }
        const formData = new FormData();
        formData.append ('fiel-to-upload',e.target.files[0]);
        try{
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`,formData);
            setModalState({...modalState,['imageUrl']:response.data.imageUrl})
            e.target.value = "";
        }catch(err){
            alert(err.response?.data?.message);
        }
    }

    return(
        <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalMode === "create" ?'新增產品': '編輯產品'}</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label htmlFor="imageFile" className="form-label">上傳圖片</label>
                    <input id="imageFile" type="file" className="form-control mb-5" accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label" >
                      輸入主圖片網址
                    </label>
                    <input
                      value={modalState.imageUrl}
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      onChange={handleModalInputChange}
                      name='imageUrl'
                      />
                  </div>
                  <img className="img-fluid" src={modalState.imageUrl} alt="" />
                  {modalState.imagesUrl?.map((imageUrl,index) => {
                    return (
                      <div className="mb-3" key={index+2}>
                        <label htmlFor={`imagesUrl${index+1}`} className="form-label" >
                        輸入副圖片{index+1}網址
                        </label>
                        <input
                        id={`imagesUrl${index+1}`}
                        value={modalState.imagesUrl[index]}
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        onChange={(e)=>{handleImagesInput(e,index)}}
                        />
                      <img  src={imageUrl} alt="" />
                      </div>
                    )
                  })}
                  <div>
                    {modalState?.imagesUrl?.length < 5 
                    && modalState?.imagesUrl[modalState.imagesUrl.length-1] !== "" 
                    &&<button className="btn btn-outline-primary btn-sm me-5 w-25" 
                    onClick={handleCreateImages}>
                      新增圖片
                    </button>}
                    {modalState?.imagesUrl?.length >1 
                    &&<button className="btn btn-outline-danger btn-sm w-25"
                    onClick={handleDeleteImages}>
                    刪除圖片
                  </button>
                    }
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                    value={modalState.title}
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      name='title'
                      onChange={handleModalInputChange}
                      />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">分類</label>
                      <input
                        value={modalState.category}
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        name='category'
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input
                        value={modalState.unit}
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        name='unit'
                        onChange={handleModalInputChange}
                        />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-4">
                      <label htmlFor="salesQuantity" className="form-label">銷售量</label>
                      <input
                        value={modalState.salesQuantity}
                        id="salesQuantity"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入數量"
                        name='salesQuantity'
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <div className="mb-3 col-md-4">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input
                        value={modalState.origin_price}
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        name='origin_price'
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <div className="mb-3 col-md-4">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input
                        value={modalState.price}
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        name='price'
                        onChange={handleModalInputChange}
                        />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea
                      value={modalState.description}
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      name='description'
                      onChange={handleModalInputChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea
                      value={modalState.content}
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name='content'
                      onChange={handleModalInputChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        checked={modalState.is_enabled}
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        name='is_enabled'
                        onChange={handleModalInputChange}
                        />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeModal}
                >
                取消
              </button>
              <button type="submit" className="btn btn-primary" onClick={(e)=>{handleModalSubmit(e,modalState.id)}}>確認</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ModalPage;