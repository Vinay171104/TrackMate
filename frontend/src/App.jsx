import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Track from "./pages/Track";
import MyShipments from "./pages/MyShipments";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFF8F5] font-body">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "Inter, sans-serif", borderRadius: "12px", fontSize: "14px" },
            success: { iconTheme: { primary: "#E8440A", secondary: "#fff" } }
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/:trackingId" element={<Track />} />
          <Route path="/shipments" element={<MyShipments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}