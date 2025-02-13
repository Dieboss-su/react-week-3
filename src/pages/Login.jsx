import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect, } from 'react';
import { Modal } from 'bootstrap';


const API_BASE = import.meta.env.VITE_BASE_API;
const API_PATH = import.meta.env.VITE_BASE_PATH; 


function Login (){
  const [isAuth, setisAuth] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
});

useEffect(() => {
  const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  "$1"
  );
  axios.defaults.headers.common.Authorization = token;
  checkAdmin();
}, []);

const checkAdmin = async () => {
  try {
  await axios.post(`${API_BASE}/api/user/check`);
  alert("確認為管理者帳戶,幫您跳轉至後台管理頁面")
  navigate('/admin')
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
  alert('登入成功,為您跳轉到後台管理者頁面')
  navigate('/admin')
  } catch (error) {
  alert("登入失敗: " + error.response?.data.message);
  }
  };

    return(
        <>
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
        </>
    )
}

export default Login;