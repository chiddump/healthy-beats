import { useState } from "react";

const API_BASE = "https://healthy-beats-production.up.railway.app";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const safeFetch = async (url, options, retry = true) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      if (retry) {
        // ⏳ backend waking up – retry once
        await new Promise((r) => setTimeout(r, 3000));
        return safeFetch(url, options, false);
      }
      throw err;
    }
  };

  const signup = async () => {
    setMessage("Connecting to server...");
    try {
      const res = await safeFetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        setMessage(res.data.error || "Signup failed");
        return;
      }

      setMessage("Signup successful ✅");
    } catch {
      setMessage("Backend is waking up. Try again.");
    }
  };

  const login = async () => {
    setMessage("Connecting to server...");
    try {
      const res = await safeFetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage(res.data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful ✅");
    } catch {
      setMessage("Backend is waking up. Try again.");
    }
  };

  const getProfile = async () => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await safeFetch(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setMessage(res.data.error || "Unauthorized");
        return;
      }

      setProfile(res.data.user);
      setMessage("Profile loaded ✅");
    } catch {
      setMessage("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setMessage("Logged out ✅");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Healthy Beats</h2>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <br /><br />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={signup}>Signup</button>
      <button onClick={login} style={{ marginLeft: 10 }}>Login</button>

      <hr />

      <button onClick={getProfile}>Get Profile</button>
      <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>

      {message && <p>{message}</p>}

      {profile && (
        <div>
          <h4>Profile</h4>
          <p>ID: {profile.id}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
