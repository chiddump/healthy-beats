import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: "#2e7d32", color: "white", padding: "20px" }}>
        <h1>Healthy Beats 🌿</h1>
        <p>Eat clean. Live strong.</p>
      </div>

      {/* NAV */}
      <div style={{ padding: "10px" }}>
        {!token && <Link to="/login">Login</Link>}

        {token && role === "admin" && (
          <>
            {" | "}
            <Link to="/admin">Admin Dashboard</Link>
          </>
        )}

        {token && (
          <>
            {" | "}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

      {/* PRODUCTS */}
      <div style={{ padding: "20px" }}>
        <h2>Our Products</h2>

        <div
          style={{
            border: "1px solid #ccc",
            width: "220px",
            padding: "10px",
          }}
        >
          <img
            src="/products/mixed-seeds.jpg"
            alt="Seed Mix"
            width="200"
          />
          <h3>Seed Mix</h3>
          <p>₹199</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "40px", padding: "10px", background: "#eee" }}>
        © 2026 Healthy Beats
      </div>
    </div>
  );
}

export default Home;
