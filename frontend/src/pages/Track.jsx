import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Search, Package, Clock, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";
import TrackingInput from "../components/TrackingInput";
import TrackingResult from "../components/TrackingResult";
const API_URL = import.meta.env.VITE_API_URL || "https://trackmate-production-c735.up.railway.app";

const STATUS_COLORS = {
  delivered:    { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  text: "#4ADE80" },
  in_transit:   { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)",  text: "#60A5FA" },
  out_for_delivery: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", text: "#FBBF24" },
  pending:      { bg: "rgba(255,107,53,0.1)",  border: "rgba(255,107,53,0.25)",  text: "#FF6B35" },
  default:      { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.5)" },
};

function getStatusStyle(status = "") {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  return STATUS_COLORS[key] || STATUS_COLORS.default;
}

function RecentCard({ shipment, onClick, onRemove }) {
  const style = getStatusStyle(shipment.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onClick(shipment.tracking_id)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(232,68,10,0.35)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {/* Icon */}
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: style.bg, border: `0.5px solid ${style.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Package size={16} color={style.text} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0, fontFamily: "monospace", letterSpacing: "0.04em" }}>
          {shipment.tracking_id}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
          {shipment.courier && (
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{shipment.courier}</span>
          )}
          <span style={{
            fontSize: "10px", fontWeight: 600,
            color: style.text,
            background: style.bg,
            border: `0.5px solid ${style.border}`,
            borderRadius: "6px", padding: "2px 7px",
            textTransform: "capitalize",
          }}>
            {(shipment.status || "unknown").replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <ChevronRight size={14} color="rgba(255,255,255,0.2)" />

      {/* Remove button */}
      <button
        onClick={e => { e.stopPropagation(); onRemove(shipment.tracking_id); }}
        style={{
          position: "absolute", top: "8px", right: "8px",
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.2)", padding: "2px",
          display: "flex", alignItems: "center",
          opacity: 0, transition: "opacity 0.15s",
        }}
        className="remove-btn"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

export default function Track() {
  const { trackingId } = useParams();
  const navigate       = useNavigate();
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [history, setHistory]   = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trackmate_shipments") || "[]");
    setHistory(saved);
  }, []);

  const handleTrack = async (id) => {
    if (!id?.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    navigate(`/track/${id}`, { replace: true });

    try {
      const { data } = await axios.get(`${API_URL}/api/track/${id}`);
      setResult(data);
      const saved = JSON.parse(localStorage.getItem("trackmate_shipments") || "[]");
      const exists = saved.findIndex(s => s.tracking_id === data.tracking_id);
      if (exists >= 0) saved[exists] = data;
      else saved.unshift(data);
      const updated = saved.slice(0, 20);
      localStorage.setItem("trackmate_shipments", JSON.stringify(updated));
      setHistory(updated);
      toast.success(`Found! Package is ${data.status.replace(/_/g, " ")}.`);
    } catch (err) {
      const msg = err.response?.data?.detail || "Tracking info not found. Check the ID and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const removeHistory = (id) => {
    const updated = history.filter(s => s.tracking_id !== id);
    setHistory(updated);
    localStorage.setItem("trackmate_shipments", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("trackmate_shipments");
  };

  useEffect(() => {
    if (trackingId) handleTrack(trackingId);
  }, []);

  const showEmpty = !loading && !error && !result;

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#fff", position: "relative" }}>

      {/* Ambient glows */}
      <div style={{
        position: "fixed", top: "-100px", right: "-80px",
        width: "450px", height: "450px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,68,10,0.1) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-80px", left: "-60px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "20px", padding: "6px 14px", marginBottom: "16px",
          }}>
            <Search size={12} color="#FF6B35" />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Real-time courier lookup</span>
          </div>

          <h1 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.15 }}>
            Track Your <span style={{ color: "#FF6B35" }}>Shipment</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Enter your tracking ID or consignment number below
          </p>
        </motion.div>

        {/* Search box */}
        <TrackingInput onTrack={handleTrack} initialValue={trackingId || ""} />


        {/* States */}
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0", gap: "20px" }}
            >
              <div style={{ position: "relative", width: "64px", height: "64px" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  border: "3px solid rgba(232,68,10,0.15)",
                  position: "absolute",
                }} />
                <Loader2
                  size={38}
                  color="#FF6B35"
                  style={{ position: "absolute", inset: 0, margin: "auto", animation: "spin 1s linear infinite" }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Searching across couriers...</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>This usually takes a second</p>
              </div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: "14px",
                background: "rgba(239,68,68,0.08)",
                border: "0.5px solid rgba(239,68,68,0.25)",
                borderRadius: "16px", padding: "18px 20px",
                marginBottom: "32px",
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(239,68,68,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <AlertCircle size={18} color="#F87171" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#F87171", margin: "0 0 4px" }}>Tracking failed</p>
                <p style={{ fontSize: "13px", color: "rgba(239,68,68,0.7)", margin: 0 }}>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {result && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <TrackingResult result={result} />
            </motion.div>
          )}

          {/* Empty state — show recent searches */}
          {showEmpty && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {history.length > 0 ? (
                <div>
                  {/* Recent header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Clock size={14} color="#FF6B35" />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Recent Searches</span>
                    </div>
                    <button
                      onClick={clearHistory}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "11px", color: "rgba(255,255,255,0.25)",
                        padding: "4px 8px", borderRadius: "6px",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => e.target.style.color = "#F87171"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
                    >
                      Clear all
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {history.slice(0, 6).map((s, i) => (
                      <motion.div
                        key={s.tracking_id}
                        transition={{ delay: i * 0.05 }}
                        style={{ position: "relative" }}
                        onMouseEnter={e => { const btn = e.currentTarget.querySelector(".remove-btn"); if (btn) btn.style.opacity = 1; }}
                        onMouseLeave={e => { const btn = e.currentTarget.querySelector(".remove-btn"); if (btn) btn.style.opacity = 0; }}
                      >
                        <RecentCard
                          shipment={s}
                          onClick={handleTrack}
                          onRemove={removeHistory}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* No history yet */
                <div style={{ textAlign: "center", padding: "64px 0" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "18px",
                    background: "rgba(232,68,10,0.08)", border: "0.5px solid rgba(232,68,10,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <Package size={28} color="#FF6B35" />
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>
                    No recent searches
                  </p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                    Enter a tracking ID above to get started
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}