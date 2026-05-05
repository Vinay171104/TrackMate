import { motion } from "framer-motion";
import { Shield, MapPin, Bell, History, Zap, Package } from "lucide-react";
import TrackingInput from "../components/TrackingInput";

const STATS = [
  { num: "10+", label: "Couriers supported" },
  { num: "20k+",   label: "Packages tracked" },
  { num: "99.9%", label: "Uptime" },
];

const FEATURES = [
  { icon: Zap,     title: "Real-time Tracking",  desc: "Live shipment updates",       color: "#FF6B35" },
  { icon: MapPin,  title: "Live Map Tracking",   desc: "See your package move",       color: "#60A5FA" },
  { icon: Bell,    title: "Email & SMS Alerts",  desc: "Never miss an update",        color: "#C084FC" },
  { icon: History, title: "Tracking History",    desc: "All shipments in one place",  color: "#4ADE80" },
];

const COURIERS = [
  { name: "DTDC",          logo: "/couriers/dtdc.png",        bg: "#1E2A4A" },
  { name: "Blue Dart",     logo: "/couriers/bluedart.png",    bg: "#0F2D1F" },
  { name: "India Post",    logo: "/couriers/indiapost.png",   bg: "#2D1515" },
  { name: "Shiprocket",    logo: "/couriers/shiprocket.png",  bg: "#1E1535" },
  { name: "Delhivery",     logo: "/couriers/delhivery.png",   bg: "#2D1F0A" },
  { name: "Ekart",         logo: "/couriers/ekart.png",       bg: "#0A1F2D" },
  { name: "XpressBees",    logo: "/couriers/xpressbees.png",  bg: "#1a1a1a" },
  { name: "Shadowfax",     logo: "/couriers/shadowfax.png",   bg: "#2D1515" },
  { name: "Ecom Express",  logo: "/couriers/ecomexpress.png", bg: "#2D0F1E" },
  { name: "Trackon",       logo: "/couriers/trackon.png",     bg: "#2D1F0A" },
  { name: "Shree Maruti",  logo: "/couriers/shreemaruti.png", bg: "#15152D" },
  { name: "Gati KWE",      logo: "/couriers/gatikwe.png",     bg: "#0A2D2D" },
];

function CourierCard({ courier, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.06, y: -4 }}
      style={{
        width: "130px",
        background: "#111111",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,68,10,0.4)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
    >
      {/* Logo area */}
      <div
        style={{
          background: courier.bg,
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <img
          src={courier.logo}
          alt={courier.name}
          style={{ maxHeight: "44px", maxWidth: "100px", objectFit: "contain" }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <span style="font-size:11px;font-weight:700;color:#FF6B35;text-align:center;padding:0 8px">
                ${courier.name}
              </span>`;
          }}
        />
      </div>
      {/* Name */}
      <div style={{ padding: "8px 10px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: 0 }}>
          {courier.name}
        </p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        color: "#fff",
      }}
    >
      {/* Ambient glow top-right */}
      <div
        style={{
          position: "fixed",
          top: "-120px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,68,10,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Ambient glow bottom-left */}
      <div
        style={{
          position: "fixed",
          bottom: "-100px",
          left: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "6px 14px",
            marginBottom: "24px",
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
            Live tracking across various couriers
          </span>
        </motion.div>

        {/* Hero grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
            marginBottom: "56px",
          }}
          className="hero-grid"
        >
          {/* Left — headline + search */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "14px" }}
            >
              Track Any Package<br />
              <span style={{ color: "#FF6B35" }}>Instantly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "28px" }}
            >
              One dashboard for all your shipments.<br />
              Real-time updates.
            </motion.p>

            {/* Search */}
            <div style={{ marginBottom: "24px" }}>
  <TrackingInput />
</div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[ "Secure & Reliable", "Free Tracking"].map(tag => (
                <span
                  key={tag}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    fontSize: "11px", color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px", padding: "4px 12px",
                  }}
                >
                  <Shield size={9} color="#FF6B35" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — stats + features */}
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "20px" }}>
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "16px 12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff" }}>{s.num}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Feature cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    cursor: "default",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <div
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: `${f.color}18`,
                      border: `0.5px solid ${f.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <f.icon size={15} color={f.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>{f.title}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Couriers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Supported Couriers
            </span>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            {COURIERS.map((courier, i) => (
              <CourierCard key={courier.name} courier={courier} index={i} />
            ))}
          </div>

          
        </motion.div>

      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}