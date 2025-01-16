import { useState,useEffect,useRef } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
// import '.bootstrap/dist/js/bootstrap.bundle.min.js';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "dieboss"; 

const defaultModalState = {
  "title": "",
  "category": "",
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
function App() {
  const [formData, setFormData] = useState({
    username: "dieboss@gmail.com",
    password: "dieboss",
  });
  const [isAuth, setisAuth] = useState(false);
  const [productsData,setProductsData] = useState([]);
  const [modalMode,setModalMode] = useState(null);
  const [modalState,setModalState] = useState(defaultModalState);
  const productModalRef = useRef(null);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });
    checkAdmin();
  }, []);

  useEffect(() => {
    if(isAuth){
      getProducts()
    }
  },[isAuth,productsData])

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setisAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
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
  const getProducts = async (e) => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH }/admin/products`)
      setProductsData(...[response.data.products])
    }catch(err){
      console.log(err.data.message);
    }
  };
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      alert(response?.data?.message);
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  //modal相關
  const handleModalSubmit = async (e,id) => {
    e.preventDefault()
    switch (modalMode) {
      case "create" :
        try{
          const response  = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{data:modalState})
          alert(response?.data?.message);
        }catch(err){
          console.log(err.response?.data?.message)
        }
      break;
      case 'edit' :
        try{
          const response  = await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${id}`,{data:modalState})
          alert(response?.data?.message);
        }catch(err){
          console.log(err.response?.data?.message)
        }
      break;

      default:
        return;
    };
    productModalRef.current.hide();
    
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
  const closeModal = () => {
    productModalRef.current.hide()
  }
  const handleModalInputChange = (e) => {
    const {name,value,checked,type} = e.target;
    const isNumericField = ["origin_price", "price"].includes(name)
    setModalState({...modalState,[name]:type === 'checkbox' ? checked: isNumericField?Number(value):value}
    )
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
  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={() => {openModal('create')}}>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((item)=>{
                  return(
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>
                        {item.is_enabled?<span className="text-success">啟用</span>:<span>未啟用</span>}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{openModal('edit',item)}} >
                            編輯
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{deleteProduct(item.id)}}>
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                  >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        // aria-hidden="true"
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
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
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
                  </div>

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
                    <div className="mb-3 col-md-6">
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
                    <div className="mb-3 col-md-6">
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
                data-bs-dismiss="modal"
                onClick={closeModal}
                >
                取消
              </button>
              <button type="submit" className="btn btn-primary" onClick={(e)=>{handleModalSubmit(e,modalState.id)}}>確認</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



export default App
