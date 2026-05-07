import { Link, useLocation } from "react-router-dom";
import { Bell, Package, X, Mail, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL || "https://trackmate-production-c735.up.railway.app";

export default function Navbar() {
  const loc = useLocation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isActive = (path) =>
    loc.pathname === path || (path === "/track" && loc.pathname.startsWith("/track"));

  const handleSubscribeGlobal = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/alerts/subscribe-global`,  { email });
      toast.success("Subscribed! You'll get alerts for all your tracked shipments.");
      setEmail("");
      setAlertOpen(false);
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <img
              src="/logo.png"
              alt="TrackMate"
              style={{ height: "36px", width: "36px", objectFit: "contain" }}
              onError={e => { e.target.style.display = "none"; }}
            />
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#FF6B35", letterSpacing: "-0.02em" }}>
              TrackMate
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[{ label: "Home", path: "/" }, { label: "Track", path: "/track" }].map(({ label, path }) => (
  <Link
    key={path}
    to={path}
    style={{
      fontSize: "14px",
      fontWeight: 500,
      textDecoration: "none",
      color: isActive(path) ? "#fff" : "rgba(255,255,255,0.4)",
      borderBottom: isActive(path) ? "1.5px solid #FF6B35" : "1.5px solid transparent",
      paddingBottom: "2px",
      transition: "color 0.2s",
    }}
  >
    {label}
  </Link>
))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!loc.pathname.startsWith("/track") && (
  <button
    onClick={() => setAlertOpen(true)}
    style={{
      position: "relative",
      background: "rgba(255,255,255,0.05)",
      border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: "50%",
      width: "38px", height: "38px",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "rgba(255,255,255,0.5)",
      transition: "background 0.2s, color 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,68,10,0.12)"; e.currentTarget.style.color = "#FF6B35"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
  >
    <Bell size={17} />
    <span style={{
      position: "absolute", top: "8px", right: "8px",
      width: "7px", height: "7px",
      background: "#FF6B35", borderRadius: "50%",
      border: "1.5px solid #0D0D0D",
    }} />
  </button>
)}

            <Link to="/shipments" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: "#E8440A",
                  color: "#fff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                <Package size={14} />
                My Shipments
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Alert Modal */}
      <AnimatePresence>
        {alertOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, backdropFilter: "blur(4px)" }}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              style={{
                position: "fixed", top: "76px", right: "16px",
                zIndex: 1000, width: "100%", maxWidth: "360px",
              }}
            >
              <div style={{
                background: "#161616",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              }}>
                {/* Header */}
                <div style={{
                  background: "linear-gradient(135deg, #E8440A, #FF6B2B)",
                  padding: "20px 20px 16px",
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{
                        width: "28px", height: "28px",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Bell size={14} color="#fff" />
                      </div>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0 }}>Email Alerts</h3>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", margin: 0 }}>
                      Get notified when your package status changes.
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertOpen(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "2px" }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
                    Your Email Address
                  </label>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", padding: "10px 14px",
                    marginBottom: "14px",
                  }}>
                    <Mail size={14} color="rgba(255,255,255,0.3)" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribeGlobal()}
                      placeholder="yourname@gmail.com"
                      autoFocus
                      style={{
                        background: "none", border: "none", outline: "none",
                        fontSize: "13px", color: "#fff",
                        flex: 1,
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubscribeGlobal}
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: "#E8440A",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Subscribing...
                      </>
                    ) : (
                      <><Send size={13} /> Subscribe to Alerts</>
                    )}
                  </motion.button>

                  <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "12px" }}>
                    No spam. Only package status updates.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}