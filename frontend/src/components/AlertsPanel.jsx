import { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function AlertsPanel({ trackingId }) {
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email && !phone) {
      toast.error("Enter an email or phone number.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/alerts/subscribe`, {
        tracking_id: trackingId,
        email: email || null,
        phone: phone || null,
      });
      toast.success("Subscribed! You'll get alerts on every update.");
      setEmail(""); setPhone("");
    } catch {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-orange/20 flex items-center justify-center">
          <Bell size={15} className="text-brand-orange" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Get Alerts on Every Update</h3>
          <p className="text-xs text-white/40">
            Receive email & SMS notifications for every tracking update.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-40 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-brand-orange transition-colors">
          <Mail size={13} className="text-white/40 shrink-0" />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            className="bg-transparent outline-none text-xs flex-1 text-white placeholder-white/25"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-40 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-brand-orange transition-colors">
          <Smartphone size={13} className="text-white/40 shrink-0" />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            type="tel"
            placeholder="Enter Mobile Number"
            className="bg-transparent outline-none text-xs flex-1 text-white placeholder-white/25"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={subscribe}
          disabled={loading}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-brand-orangeLight transition-colors disabled:opacity-60"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </motion.button>
      </div>
    </div>
  );
}