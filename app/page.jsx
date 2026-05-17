"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#1A1C1E",
  bgCard: "#22252A",
  bgCardHover: "#272B31",
  border: "#2E3239",
  accent: "#5F7ADB",
  accentSoft: "#A2B2EE",
  accentGlow: "rgba(95,122,219,0.15)",
  text: "#F0F2F5",
  textMuted: "#8A95A3",
  textSoft: "#C5CCd6",
  success: "#3ECFA0",
  warning: "#F5A623",
  danger: "#E05C5C",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }

  .sora { font-family: 'Sora', sans-serif; }

  .glass {
    background: rgba(34,37,42,0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(95,122,219,0.12);
  }

  .glow-accent {
    box-shadow: 0 0 30px rgba(95,122,219,0.2), 0 0 60px rgba(95,122,219,0.08);
  }

  .btn-primary {
    background: linear-gradient(135deg, #5F7ADB, #7B92E8);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(95,122,219,0.4); }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
    padding: 11px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .btn-ghost:hover {
    border-color: ${COLORS.accent};
    color: ${COLORS.accentSoft};
    background: rgba(95,122,219,0.06);
  }

  .card {
    background: ${COLORS.bgCard};
    border: 1px solid ${COLORS.border};
    border-radius: 18px;
    transition: all 0.3s ease;
  }

  .card:hover {
    border-color: rgba(95,122,219,0.3);
    box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 20px rgba(95,122,219,0.08);
    transform: translateY(-3px);
  }

  .nav-link {
    color: ${COLORS.textMuted};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
    padding: 6px 0;
  }

  .nav-link:hover, .nav-link.active { color: ${COLORS.text}; }

  .tag {
    display: inline-block;
    background: rgba(95,122,219,0.12);
    color: ${COLORS.accentSoft};
    border: 1px solid rgba(95,122,219,0.2);
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .input-field {
    background: rgba(255,255,255,0.03);
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    color: ${COLORS.text};
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-field:focus {
    border-color: rgba(95,122,219,0.5);
    box-shadow: 0 0 0 3px rgba(95,122,219,0.1);
  }

  .input-field::placeholder { color: ${COLORS.textMuted}; }

  select.input-field option { background: #22252A; }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
  }

  .pulse-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: ${COLORS.success};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-fade-up { animation: fadeUp 0.6s ease forwards; }

  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, ${COLORS.accentSoft} 60%, ${COLORS.accent} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-divider {
    border: none;
    border-top: 1px solid ${COLORS.border};
    margin: 0;
  }

  .tab-btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: ${COLORS.textMuted};
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: rgba(95,122,219,0.15);
    color: ${COLORS.accentSoft};
  }

  .progress-bar {
    height: 4px;
    background: ${COLORS.border};
    border-radius: 100px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSoft});
    border-radius: 100px;
    transition: width 0.8s ease;
  }

  .star { color: ${COLORS.warning}; }

  .chat-bubble-user {
    background: linear-gradient(135deg, ${COLORS.accent}, #7B92E8);
    color: white;
    border-radius: 18px 18px 4px 18px;
    padding: 10px 14px;
    max-width: 75%;
    font-size: 14px;
    align-self: flex-end;
  }

  .chat-bubble-other {
    background: ${COLORS.bgCard};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.textSoft};
    border-radius: 18px 18px 18px 4px;
    padding: 10px 14px;
    max-width: 75%;
    font-size: 14px;
    align-self: flex-start;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    cursor: pointer;
    color: ${COLORS.textMuted};
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    text-decoration: none;
  }

  .sidebar-item:hover { background: rgba(255,255,255,0.04); color: ${COLORS.text}; }
  .sidebar-item.active { background: rgba(95,122,219,0.12); color: ${COLORS.accentSoft}; }

  .stat-card {
    background: ${COLORS.bgCard};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 20px;
  }

  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
`;

// ── ICONS (inline SVG) ────────────────────────────────────────────────────────

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    truck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
    box: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    moto: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5H3.2l.8-4 4-2 4-2 2 3"/><path d="M16 17.5h-4l-1-3 3-5 4 1 2 4"/></svg>,
    pickup: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v9H1z"/><path d="M16 6h4l3 4v4h-7V6z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  };
  return icons[name] || <span style={{ fontSize: size }}></span>;
};

// ── NAVBAR ────────────────────────────────────────────────────────────────────

const Navbar = ({ page, setPage, user, setUser }) => {
  const [mobile, setMobile] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(26,28,30,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 32 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #5F7ADB, #7B92E8)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="truck" size={16} color="white" />
          </div>
          <span className="sora" style={{ fontWeight: 700, fontSize: 17, color: COLORS.text }}>
            Mager<span style={{ color: COLORS.accent }}>Pindah</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 8, flex: 1 }}>
          {[["home","Beranda"], ["booking","Pesan Sekarang"], ["tracking","Tracking"], ["about","Tentang"]].map(([p, label]) => (
            <span key={p} className={`nav-link ${page === p ? "active" : ""}`}
              onClick={() => setPage(p)}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: page === p ? 600 : 400,
                color: page === p ? COLORS.text : COLORS.textMuted }}>
              {label}
            </span>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }}
                onClick={() => setPage(user.role === "admin" ? "admin" : user.role === "driver" ? "driver" : "profile")}>
                {user.role === "admin" ? "Dashboard" : user.role === "driver" ? "Driver Panel" : user.name.split(" ")[0]}
              </button>
              <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 14 }}
                onClick={() => setUser(null)}>
                <Icon name="logout" size={16} />
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 14 }} onClick={() => setPage("login")}>Masuk</button>
              <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 14 }} onClick={() => setPage("register")}>Daftar</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

const HomePage = ({ setPage }) => {
  const [priceData, setPriceData] = useState({ distance: 4.2, items: 12, helpers: 2, vehicle: "pickup" });
  const [price, setPrice] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("pickup");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const vehicles = [
    { id: "motor", icon: "moto", name: "Motor Box", capacity: "50 kg", items: "5-8 item", basePrice: 45000, tag: "HEMAT" },
    { id: "pickup", icon: "pickup", name: "Pickup Bak", capacity: "500 kg", items: "10-20 item", basePrice: 85000, tag: "POPULER" },
    { id: "box", icon: "truck", name: "Mobil Box", capacity: "1000 kg", items: "20-40 item", basePrice: 145000, tag: "FULL" },
  ];

  const services = [
    { icon: "moto", title: "Lite Move", desc: "Barang kecil: tas, kardus, galon, meja kecil. Cocok buat pindahan minimalis.", price: "Mulai Rp45rb", color: "#3ECFA0", items: ["Motor/Motor Box", "Kapasitas 50 kg", "Estimasi 30 menit"] },
    { icon: "pickup", title: "Regular Move", desc: "Kasur, meja, kursi, rak. Pindahan standar mahasiswa.", price: "Mulai Rp85rb", color: "#5F7ADB", items: ["Pickup Bak", "Kapasitas 500 kg", "Bisa tambah helper"] },
    { icon: "box", title: "Full Service", desc: "Helper bongkar, angkut, susun. Tinggal duduk, beres.", price: "Mulai Rp195rb", color: "#F5A623", items: ["Mobil Box + Helper", "Bongkar & Susun", "Cocok buat sibuk"] },
  ];

  const testimonials = [
    { name: "Rizki Amalia", role: "Mahasiswi UNPAD", text: "Pindahan dari kos Jatinangor ke Dipatiukur cuma 1 jam! Helper ramah banget, barang aman semua.", rating: 5, avatar: "RA" },
    { name: "Bima Prakoso", role: "Mahasiswa ITB", text: "Estimasi harganya akurat. Ga ada biaya tersembunyi. Tracking-nya smooth, bisa pantau dari HP.", rating: 5, avatar: "BP" },
    { name: "Sari Dewi", role: "Mahasiswi UPI", text: "Perempuan pindahan sendiri? Aman banget. Driver dan helper profesional, recommended!", rating: 5, avatar: "SD" },
  ];

  const stats = [
    { value: "12.400+", label: "Order Selesai" },
    { value: "4.9★", label: "Rating Rata-rata" },
    { value: "150+", label: "Driver Aktif" },
    { value: "23 Kota", label: "Jangkauan" },
  ];

  useEffect(() => {
    const basePrices = { motor: 45000, pickup: 85000, box: 145000 };
    const base = basePrices[priceData.vehicle] || 85000;
    const distCost = priceData.distance * 3500;
    const itemCost = priceData.items * 1500;
    const helperCost = priceData.helpers * 25000;
    setPrice(Math.round(base + distCost + itemCost + helperCost));
  }, [priceData]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="hero-blob" style={{ width: 500, height: 500, background: "rgba(95,122,219,0.08)", top: -100, right: -100 }} />
        <div className="hero-blob" style={{ width: 300, height: 300, background: "rgba(62,207,160,0.05)", bottom: 100, left: -50 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left */}
          <div className="animate-fade-up">
            <div className="tag" style={{ marginBottom: 20 }}>🚀 Platform Pindahan #1 untuk Mahasiswa</div>
            <h1 className="sora" style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, color: COLORS.text }}>
              Pindahan Kos<br />
              <span className="gradient-text">Sekarang Semudah</span><br />
              Pesan Ojek Online
            </h1>
            <p style={{ fontSize: 18, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Pesan kendaraan, helper angkut, sampai tracking barang langsung dari website. 
              Tinggal pesan, barang beres.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setPage("booking")}>
                Pesan Sekarang →
              </button>
              <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 28px" }}>
                Simulasi Harga
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="sora" style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="animate-float" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 460, height: 380, position: "relative" }}>
              {/* Main card */}
              <div className="glass" style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 320, borderRadius: 24, padding: 28,
              }} className="glow-accent">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #5F7ADB, #7B92E8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="truck" size={22} color="white" />
                  </div>
                  <div>
                    <div className="sora" style={{ fontWeight: 600, fontSize: 15 }}>Order #MPD-2847</div>
                    <div style={{ fontSize: 12, color: COLORS.success, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <span className="pulse-dot" />
                      Dalam Perjalanan
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 20 }}>
                  {["Dijemput", "Diangkut", "Di Jalan", "Hampir Tiba"].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 8 : 0 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: i <= 2 ? "linear-gradient(135deg, #5F7ADB, #7B92E8)" : COLORS.border,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {i <= 2 && <Icon name="check" size={11} color="white" />}
                      </div>
                      <div style={{ fontSize: 13, color: i <= 2 ? COLORS.text : COLORS.textMuted }}>{step}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: COLORS.border, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>Total Harga</span>
                  <span className="sora" style={{ fontWeight: 700, color: COLORS.accent }}>Rp125.000</span>
                </div>
              </div>

              {/* Floating mini cards */}
              <div style={{
                position: "absolute", top: 20, right: 0,
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                borderRadius: 14, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10, minWidth: 140
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(62,207,160,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="user" size={16} color={COLORS.success} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>Driver</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Budi S. ⭐ 4.9</div>
                </div>
              </div>

              <div style={{
                position: "absolute", bottom: 20, left: 0,
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                borderRadius: 14, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10
              }}>
                <Icon name="location" size={16} color={COLORS.accent} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>4.2 KM • 18 mnt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 14 }}>Layanan Kami</div>
          <h2 className="sora" style={{ fontSize: 40, fontWeight: 700, marginBottom: 14 }}>Pilih Sesuai Kebutuhanmu</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 17 }}>Dari barang kecil sampai pindahan besar, kami siap bantu.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {services.map((s, i) => (
            <div key={i} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "18px 18px 0 0" }} />
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name={s.icon} size={26} color={s.color} />
              </div>
              <h3 className="sora" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 18 }}>{s.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {s.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check" size={9} color={s.color} />
                    </div>
                    <span style={{ fontSize: 13, color: COLORS.textSoft }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="sora" style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.price}</span>
                <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }}>Pilih</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price Simulator */}
      <section style={{ background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ marginBottom: 14 }}>Simulasi Harga</div>
              <h2 className="sora" style={{ fontSize: 36, fontWeight: 700, marginBottom: 14 }}>Cek Estimasi Harga Dulu</h2>
              <p style={{ color: COLORS.textMuted, marginBottom: 36, lineHeight: 1.7 }}>
                Isi detail pindahanmu dan lihat estimasi harga secara real-time. Transparan, tidak ada biaya tersembunyi.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 6, fontWeight: 500 }}>Kendaraan</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["motor","pickup","box"].map(v => (
                      <button key={v} onClick={() => { setSelectedVehicle(v); setPriceData(p => ({...p, vehicle: v})); }}
                        style={{
                          flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500,
                          border: `1px solid ${selectedVehicle === v ? COLORS.accent : COLORS.border}`,
                          background: selectedVehicle === v ? "rgba(95,122,219,0.12)" : "transparent",
                          color: selectedVehicle === v ? COLORS.accentSoft : COLORS.textMuted,
                          transition: "all 0.2s"
                        }}>
                        {v === "motor" ? "Motor" : v === "pickup" ? "Pickup" : "Mobil Box"}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { label: "Jarak (KM)", key: "distance", min: 1, max: 30, step: 0.1, fmt: v => `${v} KM` },
                  { label: "Jumlah Barang", key: "items", min: 1, max: 50, step: 1, fmt: v => `${v} item` },
                  { label: "Helper", key: "helpers", min: 0, max: 4, step: 1, fmt: v => v === 0 ? "Tanpa helper" : `${v} orang` },
                ].map(({ label, key, min, max, step, fmt }) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>
                      <span style={{ fontSize: 13, color: COLORS.accentSoft, fontWeight: 600 }}>{fmt(priceData[key])}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={priceData[key]}
                      onChange={e => setPriceData(p => ({...p, [key]: parseFloat(e.target.value)}))}
                      style={{ width: "100%", accentColor: COLORS.accent, height: 4 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Output */}
            <div>
              <div className="glass glow-accent" style={{ borderRadius: 24, padding: 36 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 8 }}>Estimasi Total Harga</div>
                  <div className="sora" style={{ fontSize: 52, fontWeight: 800, color: COLORS.accent }}>
                    Rp{price.toLocaleString("id-ID")}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {[
                    ["🛣️ Jarak", `${priceData.distance} KM`, `Rp${(priceData.distance * 3500).toLocaleString("id-ID")}`],
                    ["📦 Barang", `${priceData.items} item`, `Rp${(priceData.items * 1500).toLocaleString("id-ID")}`],
                    ["👥 Helper", `${priceData.helpers} orang`, `Rp${(priceData.helpers * 25000).toLocaleString("id-ID")}`],
                  ].map(([label, val, cost], i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 14, color: COLORS.textMuted }}>{label} · {val}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSoft }}>{cost}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-primary" style={{ width: "100%", textAlign: "center", padding: "14px", fontSize: 16 }}>
                  Pesan dengan Harga Ini →
                </button>
                <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 10 }}>
                  * Harga final sesuai kondisi aktual
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Cards */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 14 }}>Armada Kami</div>
          <h2 className="sora" style={{ fontSize: 36, fontWeight: 700 }}>Pilih Kendaraan yang Tepat</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {vehicles.map((v, i) => (
            <div key={i} className="card" style={{ padding: 28, cursor: "pointer", position: "relative" }}
              onClick={() => setSelectedVehicle(v.id)}>
              {v.tag && (
                <div style={{
                  position: "absolute", top: 18, right: 18,
                  background: "rgba(95,122,219,0.15)", color: COLORS.accentSoft,
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                  letterSpacing: "0.08em"
                }}>{v.tag}</div>
              )}
              <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(95,122,219,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon name={v.icon} size={32} color={COLORS.accent} />
              </div>
              <h3 className="sora" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{v.name}</h3>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.border, padding: "4px 10px", borderRadius: 8 }}>{v.capacity}</span>
                <span style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.border, padding: "4px 10px", borderRadius: 8 }}>{v.items}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>Mulai dari</div>
                  <div className="sora" style={{ fontWeight: 700, color: COLORS.text }}>Rp{v.basePrice.toLocaleString("id-ID")}</div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, j) => <span key={j} className="star" style={{ fontSize: 13 }}>★</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 14 }}>Testimoni</div>
          <h2 className="sora" style={{ fontSize: 36, fontWeight: 700, marginBottom: 48 }}>Kata Mereka</h2>
          <div style={{ position: "relative", minHeight: 180 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                position: "absolute", width: "100%", transition: "all 0.5s ease",
                opacity: i === activeTestimonial ? 1 : 0,
                transform: `translateY(${i === activeTestimonial ? 0 : 20}px)`,
                pointerEvents: i === activeTestimonial ? "auto" : "none"
              }}>
                <div style={{ fontSize: 18, color: COLORS.textSoft, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                  "{t.text}"
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #5F7ADB, #7B92E8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{t.avatar}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>{t.role}</div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[...Array(t.rating)].map((_, j) => <span key={j} className="star">★</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 100, border: "none", cursor: "pointer", transition: "all 0.3s",
                  background: i === activeTestimonial ? COLORS.accent : COLORS.border }} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 14 }}>Cara Kerja</div>
          <h2 className="sora" style={{ fontSize: 36, fontWeight: 700 }}>Pindahan 4 Langkah Mudah</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { step: "01", icon: "location", title: "Isi Lokasi", desc: "Masukkan alamat asal dan tujuan pindahan kamu" },
            { step: "02", icon: "box", title: "Pilih Layanan", desc: "Pilih kendaraan dan tambahkan helper sesuai kebutuhan" },
            { step: "03", icon: "dollar", title: "Bayar Mudah", desc: "Transfer, QRIS, atau dompet digital. Cepat dan aman" },
            { step: "04", icon: "check", title: "Barang Beres", desc: "Driver jemput, tracking realtime, barang tiba selamat" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.border, fontFamily: "Sora, sans-serif", marginBottom: 12 }}>{s.step}</div>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(95,122,219,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name={s.icon} size={26} color={COLORS.accent} />
              </div>
              <h4 className="sora" style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: 1200, margin: "0 0 80px", padding: "0 24px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(95,122,219,0.15), rgba(95,122,219,0.05))",
          border: "1px solid rgba(95,122,219,0.2)",
          borderRadius: 24, padding: "56px", textAlign: "center"
        }}>
          <h2 className="sora" style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            Siap Pindahan Tanpa Ribet?
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: 17, marginBottom: 32 }}>
            Bergabung dengan 12.400+ mahasiswa yang sudah pindahan pakai MagerPindah
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: "15px 40px" }}>
            Pesan Sekarang — Gratis Daftar
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="truck" size={18} color={COLORS.accent} />
            <span className="sora" style={{ fontWeight: 700 }}>MagerPindah</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>© 2025 MagerPindah. Pindahan Kos Tanpa Ribet.</div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Bantuan"].map(l => (
              <span key={l} style={{ fontSize: 13, color: COLORS.textMuted, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

// ── AUTH PAGES ────────────────────────────────────────────────────────────────

const AuthPage = ({ mode, setPage, setUser }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const DEMO_USERS = [
    { email: "user@demo.com", password: "demo123", name: "Rizki Amalia", role: "user" },
    { email: "driver@demo.com", password: "demo123", name: "Budi Santoso", role: "driver" },
    { email: "admin@demo.com", password: "demo123", name: "Admin MagerPindah", role: "admin" },
  ];

  const handleSubmit = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      if (mode === "login") {
        const found = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
        if (found) { setUser(found); setPage(found.role === "admin" ? "admin" : found.role === "driver" ? "driver" : "profile"); }
        else setErr("Email atau password salah. Coba: user@demo.com / demo123");
      } else {
        if (!form.name || !form.email || !form.password) { setErr("Semua field wajib diisi"); setLoading(false); return; }
        setUser({ ...form, name: form.name }); setPage("profile");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(95,122,219,0.06) 0%, transparent 70%)" }} />
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 40, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #5F7ADB, #7B92E8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="truck" size={24} color="white" />
          </div>
          <h2 className="sora" style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
          </h2>
          <p style={{ fontSize: 14, color: COLORS.textMuted }}>MagerPindah — Pindahan Kos Tanpa Ribet</p>
        </div>

        {mode === "login" && (
          <div style={{ background: "rgba(95,122,219,0.08)", border: "1px solid rgba(95,122,219,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: COLORS.accentSoft }}>
            Demo: user@demo.com | driver@demo.com | admin@demo.com<br />Password: demo123
          </div>
        )}

        {err && <div style={{ background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: COLORS.danger }}>{err}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <input className="input-field" placeholder="Nama lengkap" value={form.name}
              onChange={e => setForm(p => ({...p, name: e.target.value}))} />
          )}
          <input className="input-field" type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          <input className="input-field" type="password" placeholder="Password" value={form.password}
            onChange={e => setForm(p => ({...p, password: e.target.value}))} />
          {mode === "register" && (
            <>
              <input className="input-field" type="tel" placeholder="Nomor WhatsApp" value={form.phone}
                onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
              <select className="input-field" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}>
                <option value="user">Pengguna (Mau Pindahan)</option>
                <option value="driver">Driver (Mau Jadi Mitra)</option>
              </select>
            </>
          )}
        </div>

        <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: "14px", opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? "Memproses..." : mode === "login" ? "Masuk Sekarang" : "Daftar Gratis"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: COLORS.textMuted }}>
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <span style={{ color: COLORS.accentSoft, cursor: "pointer", fontWeight: 600 }}
            onClick={() => setPage(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Daftar" : "Masuk"}
          </span>
        </p>
      </div>
    </div>
  );
};

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────

const BookingPage = ({ user, setPage }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    from: "", to: "", date: "", time: "", vehicle: "pickup", service: "regular", helpers: 0, notes: "", items: []
  });
  const [newItem, setNewItem] = useState("");
  const [price, setPrice] = useState(145000);
  const [booked, setBooked] = useState(false);

  const steps = ["Lokasi & Waktu", "Layanan & Barang", "Konfirmasi"];

  const addItem = () => {
    if (newItem.trim()) { setForm(p => ({...p, items: [...p.items, newItem.trim()]})); setNewItem(""); }
  };

  const handleBook = () => {
    setBooked(true);
  };

  if (booked) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(62,207,160,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={40} color={COLORS.success} />
        </div>
        <h2 className="sora" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Order Berhasil Dibuat!</h2>
        <p style={{ color: COLORS.textMuted, marginBottom: 8 }}>ID Order: <strong style={{ color: COLORS.accent }}>#MPD-{Math.floor(Math.random() * 9000) + 1000}</strong></p>
        <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Driver sedang mencari kendaraan terbaik untukmu. Kamu akan dapat notifikasi segera.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => setPage("tracking")}>Lacak Order</button>
          <button className="btn-ghost" onClick={() => { setBooked(false); setStep(1); }}>Buat Order Lagi</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
      <h1 className="sora" style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Buat Order Pindahan</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 36 }}>Isi detail pindahanmu dengan lengkap</p>

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => i < step - 1 && setStep(i + 1)}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i + 1 <= step ? "linear-gradient(135deg, #5F7ADB, #7B92E8)" : COLORS.border,
                fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>
                {i + 1 < step ? <Icon name="check" size={14} color="white" /> : <span style={{ color: i + 1 === step ? "white" : COLORS.textMuted }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 === step ? COLORS.text : COLORS.textMuted }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? COLORS.accent : COLORS.border, margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 32 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 className="sora" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Lokasi & Waktu</h3>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>📍 Alamat Asal (Kos Lama)</label>
              <input className="input-field" placeholder="Cth: Kos Melati, Jl. Cihampelas No. 12, Bandung"
                value={form.from} onChange={e => setForm(p => ({...p, from: e.target.value}))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>🏠 Alamat Tujuan (Kos Baru)</label>
              <input className="input-field" placeholder="Cth: Kos Cendana, Jl. Dipatiukur No. 5, Bandung"
                value={form.to} onChange={e => setForm(p => ({...p, to: e.target.value}))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>📅 Tanggal Pindahan</label>
                <input className="input-field" type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>🕐 Jam Pindahan</label>
                <input className="input-field" type="time" value={form.time} onChange={e => setForm(p => ({...p, time: e.target.value}))} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 className="sora" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Layanan & Barang</h3>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 10 }}>Jenis Layanan</label>
              <div style={{ display: "flex", gap: 12 }}>
                {[["lite","🛵 Lite Move","Barang kecil"],["regular","🚚 Regular Move","Standar"],["full","📦 Full Service","+ Helper"]].map(([v, label, sub]) => (
                  <div key={v} onClick={() => setForm(p => ({...p, service: v}))}
                    style={{ flex: 1, padding: "14px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                      border: `1px solid ${form.service === v ? COLORS.accent : COLORS.border}`,
                      background: form.service === v ? "rgba(95,122,219,0.1)" : "transparent" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{label.split(" ")[0]}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: form.service === v ? COLORS.accentSoft : COLORS.text }}>{label.split(" ").slice(1).join(" ")}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Kendaraan</label>
              <select className="input-field" value={form.vehicle} onChange={e => setForm(p => ({...p, vehicle: e.target.value}))}>
                <option value="motor">🛵 Motor Box (Kapasitas 50 kg)</option>
                <option value="pickup">🚚 Pickup Bak (Kapasitas 500 kg)</option>
                <option value="box">📦 Mobil Box (Kapasitas 1000 kg)</option>
              </select>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <label style={{ fontSize: 13, color: COLORS.textMuted }}>Jumlah Helper</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setForm(p => ({...p, helpers: Math.max(0, p.helpers - 1)}))}
                    style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.text, cursor: "pointer", fontSize: 18 }}>-</button>
                  <span className="sora" style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{form.helpers}</span>
                  <button onClick={() => setForm(p => ({...p, helpers: Math.min(4, p.helpers + 1)}))}
                    style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.text, cursor: "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>
              <p style={{ fontSize: 12, color: COLORS.textMuted }}>Rp25.000/orang • Max 4 orang</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Daftar Barang</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input className="input-field" placeholder="Cth: Kasur single, Lemari kecil..." value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addItem()} style={{ flex: 1 }} />
                <button className="btn-ghost" style={{ padding: "12px 16px", flexShrink: 0 }} onClick={addItem}>+ Tambah</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {form.items.map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.border, borderRadius: 8, padding: "5px 10px", fontSize: 13 }}>
                    {item}
                    <span onClick={() => setForm(p => ({...p, items: p.items.filter((_, j) => j !== i)}))}
                      style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 15 }}>×</span>
                  </span>
                ))}
                {form.items.length === 0 && <span style={{ fontSize: 13, color: COLORS.textMuted }}>Belum ada barang ditambahkan</span>}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Catatan Tambahan</label>
              <textarea className="input-field" placeholder="Misal: ada tangga, barang fragile, dll." rows={3}
                style={{ resize: "vertical" }} value={form.notes}
                onChange={e => setForm(p => ({...p, notes: e.target.value}))} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="sora" style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Konfirmasi Order</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
              {[
                ["📍 Dari", form.from || "Belum diisi"],
                ["🏠 Ke", form.to || "Belum diisi"],
                ["📅 Jadwal", form.date && form.time ? `${form.date} · ${form.time}` : "Belum dipilih"],
                ["🚚 Kendaraan", form.vehicle === "motor" ? "Motor Box" : form.vehicle === "pickup" ? "Pickup Bak" : "Mobil Box"],
                ["📦 Layanan", form.service === "lite" ? "Lite Move" : form.service === "regular" ? "Regular Move" : "Full Service"],
                ["👥 Helper", `${form.helpers} orang`],
                ["📋 Barang", form.items.length > 0 ? form.items.join(", ") : "Belum ada"],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.textSoft, maxWidth: "60%", textAlign: "right" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(95,122,219,0.08)", border: "1px solid rgba(95,122,219,0.2)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: COLORS.textMuted }}>Estimasi Total Harga</span>
                <span className="sora" style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent }}>Rp145.000</span>
              </div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>* Harga bisa berubah sesuai kondisi aktual + biaya tol</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 10 }}>Metode Pembayaran</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {["GoPay", "OVO", "Transfer Bank", "QRIS", "Dana", "Kartu Kredit"].map(m => (
                  <div key={m} style={{ padding: "10px", borderRadius: 10, border: `1px solid ${COLORS.border}`, textAlign: "center", cursor: "pointer", fontSize: 12, color: COLORS.textMuted }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          <button className="btn-ghost" style={{ visibility: step > 1 ? "visible" : "hidden" }}
            onClick={() => setStep(p => p - 1)}>← Kembali</button>
          {step < 3
            ? <button className="btn-primary" onClick={() => setStep(p => p + 1)}>Lanjut →</button>
            : <button className="btn-primary" style={{ padding: "12px 32px" }} onClick={handleBook}>✓ Buat Order</button>}
        </div>
      </div>
    </div>
  );
};

// ── TRACKING PAGE ─────────────────────────────────────────────────────────────

const TrackingPage = () => {
  const [trackId, setTrackId] = useState("MPD-2847");
  const [statusIdx, setStatusIdx] = useState(2);
  const [msgs, setMsgs] = useState([
    { sender: "driver", text: "Halo, saya Budi. Saya dalam perjalanan ke lokasi kamu.", time: "10:15" },
    { sender: "user", text: "Ok, saya di dalam ya. Kalau udah di depan hubungi dulu.", time: "10:16" },
    { sender: "driver", text: "Siap! ETA 10 menit lagi.", time: "10:17" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const statuses = [
    { label: "Order Dikonfirmasi", time: "09:45", icon: "check", done: true },
    { label: "Driver Menuju Lokasi", time: "10:05", icon: "location", done: true },
    { label: "Barang Diangkut", time: "10:30", icon: "box", done: true },
    { label: "Dalam Perjalanan", time: "11:00", icon: "truck", done: statusIdx >= 3 },
    { label: "Hampir Tiba", time: "—", icon: "zap", done: statusIdx >= 4 },
    { label: "Selesai", time: "—", icon: "check", done: statusIdx >= 5 },
  ];

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    setMsgs(p => [...p, { sender: "user", text: chatInput, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
    setTimeout(() => {
      setMsgs(p => [...p, { sender: "driver", text: "Oke siap!", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Lacak Order</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Pantau status pindahanmu secara real-time</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 32, maxWidth: 480 }}>
        <input className="input-field" placeholder="Masukkan ID Order (MPD-XXXX)" value={trackId}
          onChange={e => setTrackId(e.target.value)} style={{ flex: 1 }} />
        <button className="btn-primary" style={{ padding: "12px 20px" }}>Lacak</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Left: Timeline + Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Status header */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4 }}>Order #{trackId}</div>
                <div className="sora" style={{ fontSize: 18, fontWeight: 700 }}>Jatinangor → Dipatiukur</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="status-badge" style={{ background: "rgba(62,207,160,0.12)", color: COLORS.success }}>
                  <span className="pulse-dot" /> Aktif
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>ETA: ~18 menit</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(statusIdx / (statuses.length - 1)) * 100}%` }} />
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Status Perjalanan</h3>
            {statuses.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < statuses.length - 1 ? 0 : 0, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: s.done ? "linear-gradient(135deg, #5F7ADB, #7B92E8)" : COLORS.border,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1
                  }}>
                    {s.done && <Icon name="check" size={11} color="white" />}
                  </div>
                  {i < statuses.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 32, background: s.done ? COLORS.accent : COLORS.border, margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < statuses.length - 1 ? 20 : 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: s.done ? 600 : 400, color: s.done ? COLORS.text : COLORS.textMuted }}>{s.label}</span>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>{s.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}
                onClick={() => setStatusIdx(p => Math.max(0, p - 1))}>← Prev Status</button>
              <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}
                onClick={() => setStatusIdx(p => Math.min(statuses.length - 1, p + 1))}>Next Status →</button>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="card" style={{ padding: 0, overflow: "hidden", height: 200 }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e2430, #242936)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(95,122,219,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="map" size={28} color={COLORS.accent} />
              </div>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>Live Map Tracking</div>
              <div style={{ fontSize: 12, color: COLORS.border }}>Google Maps API akan tampil di sini</div>
            </div>
          </div>
        </div>

        {/* Right: Driver info + Chat */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Driver */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Info Driver</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #5F7ADB, #7B92E8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>B</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Budi Santoso</div>
                <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                  {[...Array(5)].map((_, i) => <span key={i} className="star" style={{ fontSize: 12 }}>★</span>)}
                  <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 4 }}>4.9 (142 trip)</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Kendaraan", "Pickup Bak L300"], ["Plat", "D 1234 BS"], ["No. HP", "+62 812-****-5678"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: COLORS.textMuted }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="card" style={{ padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Chat dengan Driver</h3>
            <div style={{ height: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div className={m.sender === "user" ? "chat-bubble-user" : "chat-bubble-other"}>{m.text}</div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>{m.time}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input-field" style={{ flex: 1, padding: "10px 14px" }} placeholder="Kirim pesan..."
                value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()} />
              <button className="btn-primary" style={{ padding: "10px 14px" }} onClick={sendMsg}>
                <Icon name="send" size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────

const AdminDashboard = ({ setPage }) => {
  const [tab, setTab] = useState("overview");

  const stats = [
    { label: "Total Order", value: "1,284", change: "+12%", color: COLORS.accent },
    { label: "Pendapatan", value: "Rp48.2jt", change: "+8.3%", color: COLORS.success },
    { label: "Driver Aktif", value: "23", change: "+3", color: COLORS.warning },
    { label: "Rating Avg", value: "4.87", change: "+0.02", color: COLORS.accentSoft },
  ];

  const orders = [
    { id: "MPD-2847", user: "Rizki Amalia", from: "Jatinangor", to: "Dipatiukur", status: "Aktif", price: "Rp145.000", driver: "Budi S." },
    { id: "MPD-2846", user: "Bima Prakoso", from: "Sekeloa", to: "Tubagus Ismail", status: "Selesai", price: "Rp95.000", driver: "Dedi W." },
    { id: "MPD-2845", user: "Sari Dewi", from: "Cisitu", to: "Geger Kalong", status: "Selesai", price: "Rp210.000", driver: "Andi P." },
    { id: "MPD-2844", user: "Dika Ramadhan", from: "Dago", to: "Antapani", status: "Dibatalkan", price: "Rp0", driver: "—" },
    { id: "MPD-2843", user: "Maya Putri", from: "Lembang", to: "Hegarmanah", status: "Selesai", price: "Rp185.000", driver: "Budi S." },
  ];

  const statusColor = s => s === "Aktif" ? COLORS.success : s === "Selesai" ? COLORS.accent : COLORS.danger;

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: COLORS.bgCard, borderRight: `1px solid ${COLORS.border}`, padding: "80px 16px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 8, paddingLeft: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>MENU</div>
        </div>
        {[
          ["overview", "grid", "Overview"],
          ["orders", "truck", "Semua Order"],
          ["drivers", "user", "Driver"],
          ["payments", "dollar", "Pembayaran"],
          ["reviews", "star", "Review"],
        ].map(([id, icon, label]) => (
          <div key={id} className={`sidebar-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            <Icon name={icon} size={17} />
            {label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "90px 32px 40px", overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="sora" style={{ fontSize: 24, fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4 }}>Selamat datang kembali, Admin</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>{s.label}</div>
              <div className="sora" style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: COLORS.success }}>{s.change} bulan ini</div>
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Order Per Minggu</h3>
            <div style={{ height: 160, display: "flex", alignItems: "flex-end", gap: 8 }}>
              {[42, 65, 48, 78, 92, 58, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: `linear-gradient(180deg, ${COLORS.accent}, rgba(95,122,219,0.3))`, borderRadius: "4px 4px 0 0", height: `${h * 1.5}px`, transition: "all 0.3s" }} />
                  <span style={{ fontSize: 10, color: COLORS.textMuted }}>{"SenSelRabKamJumSabMin".match(/.{1,3}/g)[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Distribusi Layanan</h3>
            {[["Lite Move", 28, COLORS.success], ["Regular Move", 52, COLORS.accent], ["Full Service", 20, COLORS.warning]].map(([label, pct, color]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: COLORS.textMuted }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders table */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Order Terbaru</h3>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "7px 14px" }}>Lihat Semua</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Order ID", "Pelanggan", "Rute", "Driver", "Status", "Total"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.accent, fontWeight: 600 }}>{o.id}</td>
                    <td style={{ padding: "12px 12px", fontSize: 13 }}>{o.user}</td>
                    <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textMuted }}>{o.from} → {o.to}</td>
                    <td style={{ padding: "12px 12px", fontSize: 13 }}>{o.driver}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: statusColor(o.status), background: `${statusColor(o.status)}18`, padding: "3px 10px", borderRadius: 100 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600 }}>{o.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── DRIVER DASHBOARD ──────────────────────────────────────────────────────────

const DriverDashboard = ({ user }) => {
  const [orders] = useState([
    { id: "MPD-2847", user: "Rizki Amalia", from: "Kos Jatinangor", to: "Kos Dipatiukur", distance: "4.2 KM", price: "Rp145.000", status: "Menunggu", items: 12 },
    { id: "MPD-2850", user: "Dian Pratama", from: "Kos Sekeloa", to: "Kos Tubagus Ismail", distance: "2.8 KM", price: "Rp95.000", status: "Menunggu", items: 8 },
  ]);

  return (
    <div style={{ minHeight: "100vh", padding: "90px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 className="sora" style={{ fontSize: 26, fontWeight: 700 }}>Driver Panel</h1>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>Halo, {user?.name || "Driver"} 👋</div>
        </div>
        <div className="status-badge" style={{ background: "rgba(62,207,160,0.12)", color: COLORS.success, fontSize: 13 }}>
          <span className="pulse-dot" /> Online
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[["Penghasilan Hari Ini", "Rp285.000", COLORS.success], ["Trip Selesai", "12 Trip", COLORS.accent], ["Rating Kamu", "4.9 ⭐", COLORS.warning]].map(([l, v, c]) => (
          <div key={l} className="stat-card">
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>{l}</div>
            <div className="sora" style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Order Masuk</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((o, i) => (
          <div key={i} className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>{o.id}</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{o.user}</div>
              </div>
              <div className="sora" style={{ fontSize: 20, fontWeight: 700, color: COLORS.success }}>{o.price}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[["📍 Dari", o.from], ["🏠 Ke", o.to], ["🛣️ Jarak", o.distance], ["📦 Barang", `${o.items} item`]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" style={{ flex: 1 }}>✓ Terima Order</button>
              <button className="btn-ghost" style={{ padding: "12px 20px" }}>Tolak</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── USER PROFILE ──────────────────────────────────────────────────────────────

const ProfilePage = ({ user, setPage }) => {
  const [tab, setTab] = useState("orders");
  const orders = [
    { id: "MPD-2847", date: "15 Jan 2025", from: "Jatinangor", to: "Dipatiukur", status: "Aktif", price: "Rp145.000" },
    { id: "MPD-2801", date: "10 Jan 2025", from: "Sekeloa", to: "Dago", status: "Selesai", price: "Rp95.000" },
    { id: "MPD-2755", date: "3 Jan 2025", from: "Lembang", to: "Hegarmanah", status: "Selesai", price: "Rp185.000" },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "90px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div className="card" style={{ padding: 28, marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #5F7ADB, #7B92E8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
          {(user?.name || "U")[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div className="sora" style={{ fontSize: 20, fontWeight: 700 }}>{user?.name || "Pengguna"}</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted }}>{user?.email || "user@email.com"}</div>
          <div style={{ fontSize: 12, color: COLORS.success, marginTop: 4 }}>✓ Akun Terverifikasi</div>
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }}>Edit Profil</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[["orders","Riwayat Order"], ["review","Review Saya"]].map(([t, l]) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o, i) => (
            <div key={i} className="card" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>{o.id} · {o.date}</div>
                <div style={{ fontWeight: 500 }}>{o.from} → {o.to}</div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span className="sora" style={{ fontWeight: 700, color: COLORS.text }}>{o.price}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: o.status === "Aktif" ? COLORS.success : COLORS.accent, background: `${o.status === "Aktif" ? COLORS.success : COLORS.accent}18`, padding: "4px 12px", borderRadius: 100 }}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "review" && (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <div className="sora" style={{ fontSize: 18, fontWeight: 600 }}>Belum Ada Review</div>
          <p style={{ color: COLORS.textMuted, marginTop: 8 }}>Selesaikan order untuk memberikan review.</p>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setPage("booking")}>Buat Order Sekarang</button>
        </div>
      )}
    </div>
  );
};

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  const handleSetPage = (p) => {
    window.scrollTo(0, 0);
    setPage(p);
  };

  return (
    <>
      <style>{styles}</style>
      <Navbar page={page} setPage={handleSetPage} user={user} setUser={setUser} />

      {page === "home" && <HomePage setPage={handleSetPage} />}
      {page === "login" && <AuthPage mode="login" setPage={handleSetPage} setUser={setUser} />}
      {page === "register" && <AuthPage mode="register" setPage={handleSetPage} setUser={setUser} />}
      {page === "booking" && <BookingPage user={user} setPage={handleSetPage} />}
      {page === "tracking" && <TrackingPage />}
      {page === "admin" && <AdminDashboard setPage={handleSetPage} />}
      {page === "driver" && <DriverDashboard user={user} />}
      {page === "profile" && <ProfilePage user={user} setPage={handleSetPage} />}
      {page === "about" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 600 }}>
            <div className="tag" style={{ marginBottom: 20 }}>Tentang Kami</div>
            <h1 className="sora" style={{ fontSize: 42, fontWeight: 700, marginBottom: 20 }}>
              Pindahan Kos<br /><span className="gradient-text">Tanpa Ribet.</span>
            </h1>
            <p style={{ fontSize: 17, color: COLORS.textMuted, lineHeight: 1.8 }}>
              MagerPindah adalah platform logistik khusus mahasiswa yang menggabungkan kemudahan aplikasi ride-hailing dengan kebutuhan nyata pindahan kos. Didirikan 2024, kami telah membantu 12.000+ mahasiswa pindahan dengan aman dan terjangkau.
            </p>
            <button className="btn-primary" style={{ marginTop: 36, padding: "14px 36px", fontSize: 16 }} onClick={() => handleSetPage("booking")}>
              Mulai Pindahan →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
