import { motion } from "framer-motion";
import { Package, Truck, Building2, CheckCircle2, MapPin, Box, ShoppingBag } from "lucide-react";

const ICON_MAP = {
  pickup:        ShoppingBag,
  truck:         Truck,
  hub:           Building2,
  delivered:     CheckCircle2,
  delivery_bike: MapPin,
  package:       Box,
};

const COLORS = {
  pickup:        { icon: "bg-blue-500/20 text-blue-400",    dot: "bg-blue-500",   text: "text-blue-400",   bg: "bg-blue-500/10 border border-blue-500/20" },
  truck:         { icon: "bg-orange-500/20 text-orange-400", dot: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10 border border-orange-500/20" },
  hub:           { icon: "bg-purple-500/20 text-purple-400", dot: "bg-purple-500", text: "text-purple-400", bg: "bg-purple-500/10 border border-purple-500/20" },
  delivered:     { icon: "bg-green-500/20 text-green-400",  dot: "bg-green-500",  text: "text-green-400",  bg: "bg-green-500/10 border border-green-500/20" },
  delivery_bike: { icon: "bg-yellow-500/20 text-yellow-400", dot: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10 border border-yellow-500/20" },
  package:       { icon: "bg-white/10 text-white/50",       dot: "bg-white/30",   text: "text-white/60",   bg: "bg-white/5 border border-white/10" },
};

export default function TrackingTimeline({ events }) {
  return (
    <div className="relative">
      {events.map((event, i) => {
        const Icon    = ICON_MAP[event.icon] || Box;
        const c       = COLORS[event.icon]   || COLORS.package;
        const isFirst = i === 0;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className={`flex gap-3 p-3 rounded-xl mb-1 transition-colors ${isFirst ? c.bg : "hover:bg-white/5"}`}
          >
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.icon}`}>
                <Icon size={14} />
              </div>
              {i < events.length - 1 && (
                <div className="w-px bg-white/10 flex-1 min-h-3 mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-2 min-w-0">
              <p className={`font-semibold text-xs leading-tight ${isFirst ? c.text : "text-white/80"}`}>
                {event.status}
              </p>
              {event.location && (
                <p className="text-xs text-white/40 mt-0.5 truncate">{event.location}</p>
              )}
              <p className="text-xs text-white/25 mt-0.5">{event.timestamp}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}