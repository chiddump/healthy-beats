import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ CART COUNT (FIXED)
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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

    const updatedCart = [...cart];
    const product = {
      id: "mixed-seeds",
      name: "Mixed Seeds",
      price: 199,
      qty: 1,
      image: "/products/mixed-seeds.jpg",
    };

    const existing = updatedCart.find((p) => p.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      updatedCart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload(); // refresh count
  };

  const buyNow = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">Healthy Beats 🌿</h2>

        <div className="nav-right">
          {/* CART */}
          <div className="cart-icon" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          {/* AUTH */}
          {!token && <Link to="/login">Login</Link>}
          {token && <button className="logout-btn" onClick={logout}>Logout</button>}
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

        <div className="product-card">
          <img src="/products/mixed-seeds.jpg" alt="Mixed Seeds" />
          <h3>Mixed Seeds</h3>
          <p className="price">₹199</p>

          <div className="action-buttons">
            <button className="cart-btn" onClick={addToCart}>Add to Cart</button>
            <button className="buy-btn" onClick={buyNow}>Buy Now</button>
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
