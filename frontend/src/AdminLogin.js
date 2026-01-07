import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/admin/login", form);
    localStorage.setItem("adminToken", res.data.token);
    navigate("/admin/dashboard");
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password:e.target.value})} />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default AdminLogin;
