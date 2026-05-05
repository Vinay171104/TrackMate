import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Copy, CheckCheck } from "lucide-react";
import TrackingTimeline from "./TrackingTimeline";
import LiveMap from "./LiveMap";
import AlertsPanel from "./AlertsPanel";

const STATUS_STEPS  = ["picked_up", "in_transit", "out_for_delivery", "delivered"];
const STATUS_LABELS = ["Picked Up", "In Transit", "Out for Delivery", "Delivered"];

const BADGE = {
  in_transit:       "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  out_for_delivery: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  delivered:        "bg-green-500/20 text-green-400 border border-green-500/30",
  picked_up:        "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  pending:          "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const STEP_COLORS = {
  active:   "bg-brand-orange",
  inactive: "bg-white/10",
};

export default function TrackingResult({ result }) {
  const [copied, setCopied] = useState(false);
  const stepIdx = STATUS_STEPS.indexOf(result.status);

  const copy = () => {
    navigator.clipboard.writeText(result.tracking_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      {/* Header card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40 font-medium">Tracking ID:</span>
              <span className="font-bold text-white text-sm">{result.tracking_id}</span>
              <button onClick={copy} className="text-white/30 hover:text-brand-orange transition-colors">
                {copied
                  ? <CheckCheck size={13} className="text-green-400" />
                  : <Copy size={13} />
                }
              </button>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs font-semibold text-white/60">{result.courier}</span>
              {result.estimated_delivery && (
                <span className="flex items-center gap-1 text-xs text-brand-orange font-semibold">
                  <Clock size={11} /> Est. {result.estimated_delivery}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-white/40">
                <MapPin size={11} className="text-brand-orange" />
                {result.current_location}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${BADGE[result.status] || BADGE.pending}`}>
            {result.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Progress stepper */}
        <div className="flex items-end gap-1">
          {STATUS_LABELS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${i <= stepIdx ? STEP_COLORS.active : STEP_COLORS.inactive}`} />
              <span className={`text-[10px] text-center leading-tight font-medium ${i <= stepIdx ? "text-brand-orange" : "text-white/25"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-white/60 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Live Tracking
          </p>
          <LiveMap result={result} />
        </div>
        <div>
          <p className="text-xs font-bold text-white/60 mb-2">Tracking History</p>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 max-h-[320px] overflow-y-auto">
            <TrackingTimeline events={result.events} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AlertsPanel trackingId={result.tracking_id} />
    </motion.div>
  );
}