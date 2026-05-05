import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Package2 } from "lucide-react";

export default function TrackingInput({ onTrack, initialValue = "" }) {
  const [id, setId] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) return;
    if (onTrack) onTrack(trimmed);
    else navigate(`/track/${trimmed}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "6px 6px 6px 16px",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
        onFocusCapture={e => {
          e.currentTarget.style.borderColor = "rgba(232,68,10,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,68,10,0.08)";
        }}
        onBlurCapture={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Package2 size={18} color="#FF6B35" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Enter tracking ID or consignment number..."
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#fff",
            padding: "8px 0",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          style={{
            background: "#E8440A",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Search size={14} />
          Track Now
        </motion.button>
      </div>
    </form>
  );
}