import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const addToCart = () => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
      id: "mixed-seeds",
      name: "Mixed Seeds",
      price: 199,
      qty: 1,
      image: "/products/mixed-seeds.jpg",
    };

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart ✅");
  };

  const buyNow = () => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        product: {
          id: "mixed-seeds",
          name: "Mixed Seeds",
          price: 199,
          qty: 1,
          image: "/products/mixed-seeds.jpg",
        },
      },
    });
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
  <h2 className="logo">Healthy Beats 🌿</h2>

  <div className="nav-links">
    {/* CART ICON WITH COUNT */}
    <div className="cart-icon" onClick={() => navigate("/cart")}>
      🛒
      <span className="cart-count">
        {JSON.parse(localStorage.getItem("cart"))?.length || 0}
      </span>
    </div>

    {/* AUTH LINKS */}
    {!token && (
      <>
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Signup</Link>
      </>
    )}

    {token && role === "admin" && (
      <>
        <Link to="/admin/dashboard" className="nav-btn">
          Admin
        </Link>
        <button className="nav-btn" onClick={logout}>
          Logout
        </button>
      </>
    )}

    {token && role === "user" && (
      <button className="nav-btn" onClick={logout}>
        Logout
      </button>
    )}
  </div>
</nav>


      {/* HERO */}
      <section className="hero">
        <h1>Eat Clean. Live Strong.</h1>
        <p>Premium healthy food crafted for your lifestyle</p>
      </section>

      {/* PRODUCTS */}
      <section className="products">
        <h2>Our Products</h2>

        <div className="product-grid">
          <div className="product-card">
            <img src="/products/mixed-seeds.jpg" alt="Mixed Seeds" />
            <h3>Mixed Seeds</h3>
            <p className="price">₹199</p>

            <div className="action-buttons">
              <button className="cart-btn" onClick={addToCart}>
                Add to Cart
              </button>
              <button className="buy-btn" onClick={buyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 Healthy Beats • All Rights Reserved
      </footer>
    </div>
  );
}

export default Home;
