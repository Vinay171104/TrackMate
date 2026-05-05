import { useState, useEffect } from "react";
import { Package, MapPin, ChevronRight, Trash2, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES = {
  in_transit:       { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)",  text: "#60A5FA",  label: "In Transit" },
  delivered:        { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  text: "#4ADE80",  label: "Delivered" },
  out_for_delivery: { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  text: "#FBBF24",  label: "Out for Delivery" },
  picked_up:        { bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.25)", text: "#C084FC",  label: "Picked Up" },
  pending:          { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.4)", label: "Pending" },
};

function getStatus(status = "") {
  return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.pending;
}

export default function MyShipments() {
  const [shipments, setShipments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setShipments(JSON.parse(localStorage.getItem("trackmate_shipments") || "[]"));
  }, []);

  const remove = (e, tracking_id) => {
    e.stopPropagation();
    const updated = shipments.filter(s => s.tracking_id !== tracking_id);
    setShipments(updated);
    localStorage.setItem("trackmate_shipments", JSON.stringify(updated));
  };

  const clearAll = () => {
    setShipments([]);
    localStorage.removeItem("trackmate_shipments");
  };

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

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>

        {shipments.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <div style={{
                width: "80px", height: "80px", borderRadius: "22px",
                background: "rgba(232,68,10,0.08)",
                border: "0.5px solid rgba(232,68,10,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <Box size={36} color="#FF6B35" />
              </div>
            </motion.div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
              No shipments yet
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0 0 28px" }}>
              Track a package and it will automatically appear here.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/track")}
              style={{
                background: "#E8440A", color: "#fff",
                border: "none", padding: "12px 28px",
                borderRadius: "12px", fontWeight: 700,
                fontSize: "14px", cursor: "pointer",
              }}
            >
              Track a Package
            </motion.button>
          </div>

        ) : (
          <>
            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}
            >
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px", padding: "5px 12px", marginBottom: "10px",
                }}>
                  <Package size={12} color="#FF6B35" />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Saved shipments</span>
                </div>
                <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  My <span style={{ color: "#FF6B35" }}>Shipments</span>
                </h1>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  fontSize: "12px", fontWeight: 600,
                  color: "#FF6B35",
                  background: "rgba(232,68,10,0.1)",
                  border: "0.5px solid rgba(232,68,10,0.2)",
                  borderRadius: "20px", padding: "5px 14px",
                }}>
                  {shipments.length} tracked
                </span>
                <button
                  onClick={clearAll}
                  style={{
                    background: "none", border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "6px 12px",
                    fontSize: "11px", color: "rgba(255,255,255,0.25)",
                    cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#F87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  Clear all
                </button>
              </div>
            </motion.div>

            {/* ── Shipment list ── */}
            <AnimatePresence>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {shipments.map((s, i) => {
                  const st = getStatus(s.status);
                  return (
                    <motion.div
                      key={s.tracking_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => navigate(`/track/${s.tracking_id}`)}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "16px 18px",
                        display: "flex", alignItems: "center", gap: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        position: "relative",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(232,68,10,0.35)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        const del = e.currentTarget.querySelector(".del-btn");
                        if (del) del.style.opacity = 1;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        const del = e.currentTarget.querySelector(".del-btn");
                        if (del) del.style.opacity = 0;
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "12px",
                        background: st.bg, border: `0.5px solid ${st.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Package size={18} color={st.text} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "14px", fontWeight: 700, color: "#fff",
                          margin: "0 0 5px", fontFamily: "monospace",
                          letterSpacing: "0.04em", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {s.tracking_id}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          {s.courier && (
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                              {s.courier}
                            </span>
                          )}
                          {s.current_location && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                              <MapPin size={9} />{s.current_location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span style={{
                        fontSize: "11px", fontWeight: 700,
                        color: st.text,
                        background: st.bg,
                        border: `0.5px solid ${st.border}`,
                        borderRadius: "8px",
                        padding: "4px 10px",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}>
                        {(s.status || "pending").replace(/_/g, " ")}
                      </span>

                      {/* Delete button */}
                      <button
                        className="del-btn"
                        onClick={e => remove(e, s.tracking_id)}
                        style={{
                          opacity: 0,
                          background: "rgba(248,113,113,0.08)",
                          border: "0.5px solid rgba(248,113,113,0.2)",
                          borderRadius: "8px",
                          padding: "6px",
                          cursor: "pointer",
                          color: "#F87171",
                          display: "flex", alignItems: "center",
                          transition: "opacity 0.15s, background 0.15s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.16)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                      >
                        <Trash2 size={14} />
                      </button>

                      <ChevronRight size={15} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}