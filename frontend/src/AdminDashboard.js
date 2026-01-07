import axios from "axios";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setData(res.data))
    .catch(() => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {data && <p>Total Users: {data.usersCount}</p>}
    </div>
  );
}

export default AdminDashboard;
