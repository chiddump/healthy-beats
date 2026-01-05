import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [product, setProduct] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const addProduct = () => {
    alert(`Product "${product}" added successfully ✅`);
    setProduct("");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <input
        placeholder="Product name"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <br /><br />

      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default Admin;
