import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL CSS (injected once into <head>)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#1C1F23;--bg2:#22262B;--bg3:#272C33;--bd:#2E3540;
  --acc:#5F7ADB;--acc2:#A2B2EE;--acc-glow:rgba(95,122,219,.18);
  --tx:#F0F2F5;--tx2:#9BA5B2;--tx3:#C8D0DB;
  --ok:#3ECFA0;--warn:#F5A623;--err:#E05C5C;
  --r:14px;--r2:10px;--r3:18px;
}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--bd);border-radius:99px}
.sora{font-family:'Sora',sans-serif}
.wrap{width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
.section{padding:clamp(48px,8vw,96px) 0}
.h1{font-size:clamp(28px,5.5vw,60px);font-weight:800;line-height:1.12;letter-spacing:-.02em}
.h2{font-size:clamp(22px,3.5vw,42px);font-weight:700;line-height:1.18}
.h3{font-size:clamp(18px,2vw,26px);font-weight:700}
.body-lg{font-size:clamp(15px,1.5vw,18px);line-height:1.78;color:var(--tx2)}
.body-sm{font-size:13px;line-height:1.6;color:var(--tx2)}
.card{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r3);transition:border-color .25s,box-shadow .25s,transform .25s}
.card-hover:hover{border-color:rgba(95,122,219,.32);box-shadow:0 8px 40px rgba(0,0,0,.3),0 0 20px rgba(95,122,219,.08);transform:translateY(-3px)}
.card-p{padding:clamp(18px,2.5vw,30px)}
.glass{background:rgba(34,38,43,.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(95,122,219,.14)}
.glow{box-shadow:0 0 36px rgba(95,122,219,.22),0 0 72px rgba(95,122,219,.07)}
.grad{background:linear-gradient(135deg,#fff 0%,#A2B2EE 55%,#5F7ADB 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.btn-p,.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:var(--r);font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .22s;-webkit-tap-highlight-color:transparent;touch-action:manipulation;white-space:nowrap;border:none;font-size:clamp(14px,1.2vw,16px);padding:clamp(11px,1.2vw,14px) clamp(20px,2vw,30px)}
.btn-p{background:linear-gradient(135deg,#5F7ADB,#7B92E8);color:#fff;position:relative;overflow:hidden}
.btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .22s}
.btn-p:hover::after{opacity:1}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(95,122,219,.48)}
.btn-p:active{transform:scale(.97);opacity:.9}
.btn-g{background:transparent;color:var(--tx);border:1px solid var(--bd)}
.btn-g:hover{border-color:var(--acc);color:var(--acc2);background:rgba(95,122,219,.07)}
.btn-sm{padding:8px 16px;font-size:13px;border-radius:var(--r2)}
.inp{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--bd);border-radius:var(--r2);color:var(--tx);padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none}
.inp:focus{border-color:rgba(95,122,219,.55);box-shadow:0 0 0 3px rgba(95,122,219,.1)}
.inp::placeholder{color:var(--tx2)}
select.inp option{background:var(--bg2)}
textarea.inp{resize:vertical;min-height:80px}
.pill{display:inline-block;background:rgba(95,122,219,.13);color:var(--acc2);border:1px solid rgba(95,122,219,.22);padding:4px 14px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.badge-ok{background:rgba(62,207,160,.12);color:var(--ok);border:1px solid rgba(62,207,160,.2);padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700}
.badge-warn{background:rgba(245,166,35,.12);color:var(--warn);border:1px solid rgba(245,166,35,.2);padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700}
.badge-err{background:rgba(224,92,92,.12);color:var(--err);border:1px solid rgba(224,92,92,.2);padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700}
.dot{width:8px;height:8px;border-radius:50%;background:var(--ok);display:inline-block;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
.float{animation:float 4.5s ease-in-out infinite}
@keyframes fu{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fu .65s ease both}
.prog{height:5px;background:var(--bd);border-radius:99px;overflow:hidden}
.prog-f{height:100%;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:99px;transition:width .8s ease}
.bbl-u{background:linear-gradient(135deg,#5F7ADB,#7B92E8);color:#fff;border-radius:18px 18px 4px 18px;padding:10px 14px;max-width:78%;font-size:14px;align-self:flex-end}
.bbl-d{background:var(--bg2);border:1px solid var(--bd);color:var(--tx3);border-radius:18px 18px 18px 4px;padding:10px 14px;max-width:78%;font-size:14px;align-self:flex-start}
.sb-link{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:var(--r2);cursor:pointer;color:var(--tx2);font-size:14px;font-weight:500;transition:background .18s,color .18s;user-select:none}
.sb-link:hover{background:rgba(255,255,255,.04);color:var(--tx)}
.sb-link.active{background:rgba(95,122,219,.13);color:var(--acc2)}
#nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(28,31,35,.9);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--bd)}
#nav .inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;height:62px;gap:20px;padding:0 clamp(16px,4vw,48px)}
.nav-logo{display:flex;align-items:center;gap:9px;cursor:pointer;flex-shrink:0}
.logo-box{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#5F7ADB,#7B92E8);display:flex;align-items:center;justify-content:center}
.nav-links{display:flex;gap:2px;flex:1}
.nav-pill{padding:6px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;color:var(--tx2);transition:color .2s,background .2s}
.nav-pill:hover{color:var(--tx);background:rgba(255,255,255,.04)}
.nav-pill.active{color:var(--tx);font-weight:600;background:rgba(255,255,255,.05)}
.nav-auth{display:flex;align-items:center;gap:10px}
.hamburger{background:transparent;border:1px solid var(--bd);border-radius:9px;padding:7px 10px;cursor:pointer;color:var(--tx);display:none;align-items:center}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:300;backdrop-filter:blur(4px);display:none}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(80vw,290px);background:var(--bg2);z-index:400;padding:24px 18px;display:flex;flex-direction:column;gap:4px;box-shadow:-8px 0 40px rgba(0,0,0,.4);transform:translateX(100%);transition:transform .28s ease}
.drawer.open{transform:translateX(0)}
.overlay.show{display:block}
.stat{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:clamp(14px,2vw,22px)}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(12px,2vw,22px)}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,22px)}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(10px,1.5vw,18px)}
.blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;padding:8px 12px;font-size:11px;color:var(--tx2);border-bottom:1px solid var(--bd);font-weight:600;white-space:nowrap;letter-spacing:.04em;text-transform:uppercase}
.tbl td{padding:11px 12px;font-size:13px;border-bottom:1px solid var(--bd);white-space:nowrap}
.step-num{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:background .3s}
.step-line{flex:1;height:1px;margin:0 8px;transition:background .3s}
input[type=range]{width:100%;accent-color:var(--acc);height:4px;border-radius:99px}
.cta-wrap{background:linear-gradient(135deg,rgba(95,122,219,.14) 0%,rgba(95,122,219,.04) 100%);border:1px solid rgba(95,122,219,.22);border-radius:22px;text-align:center;padding:clamp(40px,6vw,72px) clamp(24px,5vw,80px);position:relative;overflow:hidden}
.cta-wrap::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:400px;height:200px;background:radial-gradient(ellipse,rgba(95,122,219,.12),transparent 70%);pointer-events:none}
.feat-card{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:clamp(16px,2vw,24px);text-align:center}
.tab-btn{padding:9px 18px;border-radius:var(--r2);border:none;background:transparent;color:var(--tx2);font-family:'DM Sans',sans-serif;font-weight:500;font-size:14px;cursor:pointer;transition:background .2s,color .2s;-webkit-tap-highlight-color:transparent}
.tab-btn.active{background:rgba(95,122,219,.15);color:var(--acc2)}
@media(max-width:1024px){
  .hamburger{display:flex}
  .nav-links,.nav-auth{display:none}
  .g4{grid-template-columns:repeat(2,1fr)}
  .g3{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:640px){
  .g2{grid-template-columns:1fr}
  .g3{grid-template-columns:1fr}
  .g4{grid-template-columns:repeat(2,1fr)}
  .hide-xs{display:none!important}
}
@media(min-width:1800px){
  .wrap{max-width:1600px}
  .h1{font-size:72px}
}
`;

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const ic = {
  truck: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  map: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
  box: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  chk: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  loc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  dollar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor"/></svg>',
  chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  moto: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5H3.2l.8-4 4-2 4-2 2 3"/><path d="M16 17.5h-4l-1-3 3-5 4 1 2 4"/></svg>',
  pickup: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v9H1z"/><path d="M16 6h4l3 4v4h-7V6z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  zap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
};

function iconSz(name, size = 20, color = 'currentColor') {
  return ic[name]?.replace('width="20"', `width="${size}"`).replace('height="20"', `height="${size}"`).replace('stroke="currentColor"', `stroke="${color}"`) || '';
}

/* ─────────────────────────────────────────────
   DEMO ACCOUNTS
───────────────────────────────────────────── */
const DEMO_USERS = [
  { email: 'customer@demo.com', pass: 'demo123', name: 'Rizki Amalia', role: 'customer', phone: '+62812-0001' },
  { email: 'driver@demo.com', pass: 'demo123', name: 'Budi Santoso', role: 'driver', phone: '+62812-0002' },
  { email: 'admin@demo.com', pass: 'demo123', name: 'Admin MagerPindah', role: 'admin', phone: '+62812-0003' },
];

const navItems = [
  { page: 'home', label: 'Beranda' },
  { page: 'booking', label: 'Pesan' },
  { page: 'tracking', label: 'Tracking' },
  { page: 'report', label: 'Laporan' },
  { page: 'about', label: 'Tentang' },
];

function calcPrice(s) {
  const base = { motor: 45000, pickup: 85000, box: 145000 };
  return Math.round((base[s.vehicle] || 85000) + s.distance * 3500 + s.items * 1500 + s.helpers * 25000);
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ page, user, navigate, toggleDrawer, logout }) {
  const dashPage = user ? (user.role === 'admin' ? 'admin' : user.role === 'driver' ? 'driver' : 'customer') : null;
  return (
    <nav id="nav">
      <div className="inner">
        <div className="nav-logo" onClick={() => navigate('home')}>
          <div className="logo-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <span className="sora" style={{fontWeight:700,fontSize:17}}>Mager<span style={{color:'var(--acc)'}}>Pindah</span></span>
        </div>
        <div className="nav-links">
          {navItems.map(n => (
            <span key={n.page} className={`nav-pill${page === n.page ? ' active' : ''}`} data-page={n.page} onClick={() => navigate(n.page)}>{n.label}</span>
          ))}
        </div>
        <div style={{flex:1}}></div>
        <div className="nav-auth">
          {user ? (
            <>
              <button className="btn-g btn-sm" onClick={() => navigate(dashPage)}>{user.name.split(' ')[0]}</button>
              <button className="btn-g btn-sm" onClick={logout} dangerouslySetInnerHTML={{__html: ic.logout}} />
            </>
          ) : (
            <>
              <button className="btn-g btn-sm" onClick={() => navigate('login')}>Masuk</button>
              <button className="btn-p btn-sm" onClick={() => navigate('register')}>Daftar</button>
            </>
          )}
        </div>
        <button className="hamburger" onClick={toggleDrawer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   DRAWER
───────────────────────────────────────────── */
function Drawer({ open, page, user, navigate, toggleDrawer, logout }) {
  const dashPage = user ? (user.role === 'admin' ? 'admin' : user.role === 'driver' ? 'driver' : 'customer') : null;
  return (
    <>
      <div className={`overlay${open ? ' show' : ''}`} onClick={toggleDrawer}></div>
      <div className={`drawer${open ? ' open' : ''}`}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <span className="sora" style={{fontWeight:700,fontSize:16}}>Mager<span style={{color:'var(--acc)'}}>Pindah</span></span>
          <button onClick={toggleDrawer} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--tx2)'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div>
          {navItems.map(n => (
            <div key={n.page} onClick={() => { navigate(n.page); toggleDrawer(); }} style={{padding:'12px 14px',borderRadius:10,cursor:'pointer',fontSize:15,fontWeight:500,background:page===n.page?'rgba(95,122,219,.12)':'transparent',color:page===n.page?'var(--acc2)':'var(--tx2)',marginBottom:2}}>{n.label}</div>
          ))}
        </div>
        <div style={{borderTop:'1px solid var(--bd)',marginTop:16,paddingTop:16,display:'flex',flexDirection:'column',gap:10}}>
          {user ? (
            <>
              <button className="btn-g" style={{width:'100%'}} onClick={() => { navigate(dashPage); toggleDrawer(); }}>Dashboard</button>
              <button className="btn-g" style={{width:'100%'}} onClick={() => { logout(); toggleDrawer(); }}>Keluar</button>
            </>
          ) : (
            <>
              <button className="btn-g" style={{width:'100%'}} onClick={() => { navigate('login'); toggleDrawer(); }}>Masuk</button>
              <button className="btn-p" style={{width:'100%'}} onClick={() => { navigate('register'); toggleDrawer(); }}>Daftar Gratis</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ priceSliders, setPriceSliders, activeTesti, setActiveTesti, navigate }) {
  const s = priceSliders;
  const price = calcPrice(s);
  const testimoni = [
    {name:'Rizki Amalia',role:'Mahasiswi UNPAD',text:'Pindahan Jatinangor ke Dipatiukur cuma 1 jam! Helper ramah, barang aman semua.',av:'RA'},
    {name:'Bima Prakoso',role:'Mahasiswa ITB',text:'Harga akurat, ga ada biaya tersembunyi. Tracking smooth banget di HP!',av:'BP'},
    {name:'Sari Dewi',role:'Mahasiswi UPI',text:'Perempuan pindahan sendiri? Aman banget. Driver & helper profesional. Recommended!',av:'SD'},
  ];
  const t = testimoni[activeTesti];
  const svc = [
    {icon:'moto',title:'🛵 Lite Move',desc:'Tas, kardus, galon, meja kecil — untuk pindahan minimalis.',price:'Rp45rb',color:'#3ECFA0',feats:['Motor/Motor Box','Kapasitas 50 kg','Cepat & Hemat']},
    {icon:'pickup',title:'🚚 Regular Move',desc:'Kasur, meja, kursi, rak — pindahan standar mahasiswa.',price:'Rp85rb',color:'#5F7ADB',feats:['Pickup Bak','Kapasitas 500 kg','+ Opsi Helper']},
    {icon:'truck',title:'📦 Full Service',desc:'Helper bongkar, angkut & susun. Tinggal duduk, beres!',price:'Rp195rb',color:'#F5A623',feats:['Mobil Box + Helper','Bongkar & Susun','Untuk yang Sibuk']},
  ];
  const vehicles = [
    {id:'motor',icon:'moto',name:'Motor Box',cap:'50 kg',items:'5–8 item',base:45000,tag:'HEMAT'},
    {id:'pickup',icon:'pickup',name:'Pickup Bak',cap:'500 kg',items:'10–20 item',base:85000,tag:'POPULER'},
    {id:'box',icon:'truck',name:'Mobil Box',cap:'1000 kg',items:'20–40 item',base:145000,tag:'FULL'},
  ];
  const stats = [{v:'12.400+',l:'Order Selesai'},{v:'4.9★',l:'Rating Rata-rata'},{v:'150+',l:'Driver Aktif'},{v:'23 Kota',l:'Jangkauan'}];
  const sliders = [
    {label:'Jarak (KM)',k:'distance',min:1,max:30,step:.1,fmt:v=>parseFloat(v).toFixed(1)+' KM'},
    {label:'Jumlah Barang',k:'items',min:1,max:50,step:1,fmt:v=>v+' item'},
    {label:'Helper',k:'helpers',min:0,max:4,step:1,fmt:v=>v==0?'Tanpa helper':v+' orang'},
  ];

  return (
    <>
      {/* HERO */}
      <section style={{position:'relative',minHeight:'clamp(520px,88vh,900px)',display:'flex',alignItems:'center',overflow:'hidden',padding:'clamp(40px,6vw,80px) 0'}}>
        <div className="blob" style={{width:'min(500px,80vw)',height:'min(500px,80vw)',background:'rgba(95,122,219,.07)',top:-80,right:-60}}></div>
        <div className="blob" style={{width:250,height:250,background:'rgba(62,207,160,.05)',bottom:80,left:-40}}></div>
        <div className="wrap" style={{width:'100%'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,480px),1fr))',gap:'clamp(40px,6vw,80px)',alignItems:'center'}}>
            <div className="fade-up">
              <div className="pill" style={{marginBottom:20}}>🚀 Platform Pindahan #1 Mahasiswa</div>
              <h1 className="h1 sora" style={{marginBottom:18,color:'var(--tx)'}}>
                Pindahan Kos<br/><span className="grad">Sekarang Semudah</span><br/>Pesan Ojek Online
              </h1>
              <p className="body-lg" style={{marginBottom:32,maxWidth:480}}>
                Pesan kendaraan, helper angkut, sampai tracking barang langsung dari website. Tinggal pesan, barang beres.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:40}}>
                <button className="btn-p" onClick={() => navigate('booking')}>Pesan Sekarang →</button>
                <button className="btn-g">Simulasi Harga</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,auto)',gap:'clamp(16px,3vw,32px)',width:'fit-content'}}>
                {stats.map(st => (
                  <div key={st.l}>
                    <div className="sora" style={{fontSize:'clamp(18px,2.5vw,24px)',fontWeight:800,color:'var(--tx)'}}>{st.v}</div>
                    <div style={{fontSize:12,color:'var(--tx2)',marginTop:2}}>{st.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero Card */}
            <div className="float" style={{display:'flex',justifyContent:'center'}}>
              <div style={{width:'min(100%,380px)',position:'relative'}}>
                <div className="glass glow" style={{borderRadius:22,padding:'clamp(18px,2.5vw,28px)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                    <div className="logo-box" dangerouslySetInnerHTML={{__html:iconSz('truck',22,'white')}}></div>
                    <div>
                      <div className="sora" style={{fontWeight:700,fontSize:15}}>Order #MPD-2847</div>
                      <div style={{fontSize:12,color:'var(--ok)',display:'flex',alignItems:'center',gap:5,marginTop:2}}><span className="dot"></span> Dalam Perjalanan</div>
                    </div>
                  </div>
                  {['Dikonfirmasi','Driver Menjemput','Barang Diangkut','Hampir Tiba'].map((step, i) => (
                    <div key={step} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<3?10:0}}>
                      <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,background:i<=2?'linear-gradient(135deg,#5F7ADB,#7B92E8)':'var(--bd)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:10}} dangerouslySetInnerHTML={{__html:i<=2?ic.chk:'&nbsp;'}}></div>
                      <span style={{fontSize:13,color:i<=2?'var(--tx)':'var(--tx2)'}}>{step}</span>
                    </div>
                  ))}
                  <div style={{marginTop:18,background:'var(--bd)',borderRadius:10,padding:'10px 14px',display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:12,color:'var(--tx2)'}}>Total Harga</span>
                    <span className="sora" style={{fontWeight:700,color:'var(--acc)'}}>Rp125.000</span>
                  </div>
                </div>
                <div style={{position:'absolute',top:-18,right:-10,background:'var(--bg2)',border:'1px solid var(--bd)',borderRadius:12,padding:'9px 13px',display:'flex',alignItems:'center',gap:9}}>
                  <div style={{width:30,height:30,borderRadius:8,background:'rgba(62,207,160,.15)',display:'flex',alignItems:'center',justifyContent:'center'}} dangerouslySetInnerHTML={{__html:iconSz('user',15,'#3ECFA0')}}></div>
                  <div><div style={{fontSize:10,color:'var(--tx2)'}}>Driver</div><div style={{fontSize:13,fontWeight:600}}>Budi S. ⭐ 4.9</div></div>
                </div>
                <div style={{position:'absolute',bottom:-14,left:-10,background:'var(--bg2)',border:'1px solid var(--bd)',borderRadius:12,padding:'9px 13px',display:'flex',alignItems:'center',gap:8}}>
                  <span dangerouslySetInnerHTML={{__html:iconSz('loc',15,'#5F7ADB')}}></span>
                  <span style={{fontSize:13,fontWeight:500}}>4.2 KM · 18 mnt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" style={{background:'var(--bg2)',borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:'clamp(32px,5vw,56px)'}}>
            <div className="pill" style={{marginBottom:14}}>Layanan Kami</div>
            <h2 className="h2 sora">Pilih Sesuai Kebutuhanmu</h2>
          </div>
          <div className="g3">
            {svc.map(sv => (
              <div key={sv.title} className="card card-hover card-p" style={{position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:sv.color,borderRadius:'18px 18px 0 0'}}></div>
                <div style={{width:50,height:50,borderRadius:14,background:sv.color+'1A',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,color:sv.color}} dangerouslySetInnerHTML={{__html:ic[sv.icon]||''}}></div>
                <h3 className="sora" style={{fontSize:18,fontWeight:700,marginBottom:8}}>{sv.title}</h3>
                <p style={{fontSize:14,color:'var(--tx2)',lineHeight:1.65,marginBottom:16}}>{sv.desc}</p>
                <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:20}}>
                  {sv.feats.map(f => (
                    <div key={f} style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:16,height:16,borderRadius:'50%',background:sv.color+'1A',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:sv.color}} dangerouslySetInnerHTML={{__html:ic.chk}}></div>
                      <span style={{fontSize:13,color:'var(--tx3)'}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span className="sora" style={{fontWeight:700,fontSize:15,color:sv.color}}>Mulai {sv.price}</span>
                  <button className="btn-g btn-sm">Pilih</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE SIMULATOR */}
      <section className="section">
        <div className="wrap">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,380px),1fr))',gap:'clamp(36px,5vw,72px)',alignItems:'center'}}>
            <div>
              <div className="pill" style={{marginBottom:14}}>Simulasi Harga</div>
              <h2 className="h2 sora" style={{marginBottom:14}}>Cek Estimasi Harga</h2>
              <p className="body-lg" style={{marginBottom:32}}>Transparan, tidak ada biaya tersembunyi. Isi detail dan lihat estimasi real-time.</p>
              <div style={{display:'flex',gap:8,marginBottom:20}}>
                {['motor','pickup','box'].map(v => (
                  <button key={v} onClick={() => setPriceSliders(prev=>({...prev,vehicle:v}))} style={{flex:1,padding:'10px 0',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:500,border:`1px solid ${s.vehicle===v?'var(--acc)':'var(--bd)'}`,background:s.vehicle===v?'rgba(95,122,219,.12)':'transparent',color:s.vehicle===v?'var(--acc2)':'var(--tx2)',fontFamily:'inherit',transition:'all .2s'}}>
                    {v==='motor'?'Motor':v==='pickup'?'Pickup':'Mobil Box'}
                  </button>
                ))}
              </div>
              {sliders.map(sl => (
                <div key={sl.k} style={{marginBottom:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <label style={{fontSize:13,color:'var(--tx2)',fontWeight:500}}>{sl.label}</label>
                    <span style={{fontSize:13,color:'var(--acc2)',fontWeight:600}}>{sl.fmt(s[sl.k])}</span>
                  </div>
                  <input type="range" min={sl.min} max={sl.max} step={sl.step} value={s[sl.k]}
                    onChange={e => setPriceSliders(prev=>({...prev,[sl.k]:parseFloat(e.target.value)}))} />
                </div>
              ))}
            </div>
            <div>
              <div className="glass glow" style={{borderRadius:22,padding:'clamp(22px,3vw,36px)'}}>
                <div style={{textAlign:'center',marginBottom:28}}>
                  <div style={{fontSize:13,color:'var(--tx2)',marginBottom:8}}>Estimasi Total Harga</div>
                  <div className="sora" style={{fontSize:'clamp(36px,5vw,52px)',fontWeight:800,color:'var(--acc)'}}>Rp{price.toLocaleString('id-ID')}</div>
                </div>
                {[
                  ['🛣️ Jarak',`${parseFloat(s.distance).toFixed(1)} KM`,`Rp${Math.round(s.distance*3500).toLocaleString('id-ID')}`],
                  ['📦 Barang',`${s.items} item`,`Rp${(s.items*1500).toLocaleString('id-ID')}`],
                  ['👥 Helper',`${s.helpers} orang`,`Rp${(s.helpers*25000).toLocaleString('id-ID')}`],
                ].map(([label,val,cost]) => (
                  <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--bd)'}}>
                    <span style={{fontSize:14,color:'var(--tx2)'}}>{label} · {val}</span>
                    <span style={{fontSize:14,fontWeight:600}}>{cost}</span>
                  </div>
                ))}
                <button className="btn-p" style={{width:'100%',marginTop:22,padding:14}} onClick={() => navigate('booking')}>Pesan dengan Harga Ini →</button>
                <p style={{fontSize:11,color:'var(--tx2)',textAlign:'center',marginTop:10}}>* Harga final sesuai kondisi aktual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VEHICLES */}
      <section className="section" style={{background:'var(--bg2)',borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:'clamp(32px,5vw,52px)'}}>
            <div className="pill" style={{marginBottom:14}}>Armada Kami</div>
            <h2 className="h2 sora">Pilih Kendaraan yang Tepat</h2>
          </div>
          <div className="g3">
            {vehicles.map(v => (
              <div key={v.id} className="card card-hover card-p" style={{cursor:'pointer',position:'relative'}}>
                {v.tag && <div style={{position:'absolute',top:16,right:16,background:'rgba(95,122,219,.15)',color:'var(--acc2)',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,letterSpacing:'.08em'}}>{v.tag}</div>}
                <div style={{width:56,height:56,borderRadius:14,background:'rgba(95,122,219,.1)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,color:'var(--acc)'}} dangerouslySetInnerHTML={{__html:ic[v.icon]||''}}></div>
                <h3 className="sora" style={{fontSize:18,fontWeight:700,marginBottom:8}}>{v.name}</h3>
                <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
                  {[v.cap,v.items].map(tag => (
                    <span key={tag} style={{fontSize:12,color:'var(--tx2)',background:'var(--bd)',padding:'4px 10px',borderRadius:8}}>{tag}</span>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><div style={{fontSize:11,color:'var(--tx2)'}}>Mulai dari</div><div className="sora" style={{fontWeight:700}}>Rp{v.base.toLocaleString('id-ID')}</div></div>
                  <div>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:'clamp(32px,5vw,52px)'}}>
            <div className="pill" style={{marginBottom:14}}>Cara Kerja</div>
            <h2 className="h2 sora">4 Langkah Mudah</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'clamp(16px,2.5vw,28px)'}}>
            {[
              {step:'01',icon:'loc',title:'Isi Lokasi',desc:'Masukkan alamat asal dan tujuan pindahan kamu'},
              {step:'02',icon:'box',title:'Pilih Layanan',desc:'Pilih kendaraan dan helper sesuai kebutuhan'},
              {step:'03',icon:'dollar',title:'Bayar Mudah',desc:'Transfer, QRIS, atau dompet digital'},
              {step:'04',icon:'chk',title:'Barang Beres',desc:'Driver jemput, tracking realtime, barang tiba'},
            ].map(h => (
              <div key={h.step} style={{textAlign:'center',padding:'clamp(12px,2vw,20px) 8px'}}>
                <div className="sora" style={{fontSize:'clamp(32px,5vw,48px)',fontWeight:800,color:'var(--bd)'}}>{h.step}</div>
                <div style={{width:48,height:48,borderRadius:14,background:'rgba(95,122,219,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'10px auto 14px',color:'var(--acc)'}} dangerouslySetInnerHTML={{__html:ic[h.icon]||''}}></div>
                <h4 className="sora" style={{fontSize:'clamp(14px,1.5vw,17px)',fontWeight:600,marginBottom:7}}>{h.title}</h4>
                <p style={{fontSize:13,color:'var(--tx2)',lineHeight:1.6}}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background:'var(--bg2)',borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)'}}>
        <div className="wrap">
          <div style={{maxWidth:720,margin:'0 auto',textAlign:'center'}}>
            <div className="pill" style={{marginBottom:14}}>Testimoni</div>
            <h2 className="h2 sora" style={{marginBottom:44}}>Kata Mereka</h2>
            <div style={{minHeight:180,position:'relative'}}>
              <p style={{fontSize:'clamp(15px,1.8vw,18px)',color:'var(--tx3)',lineHeight:1.78,fontStyle:'italic',marginBottom:24}}>"{t.text}"</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#5F7ADB,#7B92E8)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,flexShrink:0}}>{t.av}</div>
                <div style={{textAlign:'left'}}><div style={{fontWeight:600}}>{t.name}</div><div style={{fontSize:13,color:'var(--tx2)'}}>{t.role}</div></div>
                <div style={{color:'#F5A623'}}>★★★★★</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:36}}>
              {testimoni.map((_,i) => (
                <button key={i} onClick={() => setActiveTesti(i)} style={{width:i===activeTesti?24:8,height:8,borderRadius:99,border:'none',cursor:'pointer',transition:'all .3s',background:i===activeTesti?'var(--acc)':'var(--bd)'}}></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div style={{maxWidth:800,margin:'0 auto'}}>
            <div className="cta-wrap">
              <h2 className="h2 sora" style={{marginBottom:14,color:'var(--tx)'}}>Siap Pindahan Tanpa Ribet?</h2>
              <p className="body-lg" style={{marginBottom:30,maxWidth:520,marginLeft:'auto',marginRight:'auto'}}>
                Bergabung dengan 12.400+ mahasiswa yang sudah pindahan pakai MagerPindah
              </p>
              <div style={{display:'flex',justifyContent:'center'}}>
                <button className="btn-p" style={{fontSize:'clamp(14px,1.5vw,16px)',padding:'clamp(12px,1.5vw,15px) clamp(24px,3vw,44px)'}} onClick={() => navigate('register')}>
                  Pesan Sekarang — Gratis Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid var(--bd)',padding:'clamp(24px,3vw,40px) 0'}}>
        <div className="wrap">
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--acc)'}}>
              <span dangerouslySetInnerHTML={{__html:ic.truck}}></span>
              <span className="sora" style={{fontWeight:700,fontSize:15,color:'var(--tx)'}}>MagerPindah</span>
            </div>
            <p style={{fontSize:13,color:'var(--tx2)'}}>© 2025 MagerPindah — Pindahan Kos Tanpa Ribet.</p>
            <div style={{display:'flex',gap:18}}>
              {['Privacy','Terms','Bantuan'].map(l => (
                <span key={l} style={{fontSize:13,color:'var(--tx2)',cursor:'pointer'}}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────
   AUTH PAGE
───────────────────────────────────────────── */
function AuthPage({ mode, navigate, onLogin }) {
  const [err, setErr] = useState('');

  function handleAuth() {
    const email = document.getElementById('aEmail')?.value.trim();
    const pass = document.getElementById('aPass')?.value.trim();
    if (mode === 'login') {
      const found = DEMO_USERS.find(u => u.email === email && u.pass === pass);
      if (found) {
        onLogin(found);
        navigate(found.role === 'admin' ? 'admin' : found.role === 'driver' ? 'driver' : 'customer');
      } else {
        setErr('Email atau password salah.');
      }
    } else {
      const name = document.getElementById('aName')?.value.trim();
      const phone = document.getElementById('aPhone')?.value.trim();
      const role = document.getElementById('aRole')?.value || 'customer';
      if (!name || !email || !pass) { setErr('Semua field wajib diisi.'); return; }
      onLogin({ name, email, pass, phone, role });
      navigate(role === 'driver' ? 'driver' : 'customer');
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'clamp(24px,4vw,48px) clamp(16px,4vw,24px)'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 50%,rgba(95,122,219,.06),transparent 70%)',pointerEvents:'none'}}></div>
      <div className="card" style={{width:'100%',maxWidth:420,padding:'clamp(24px,4vw,40px)',position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div className="logo-box" style={{margin:'0 auto 16px'}} dangerouslySetInnerHTML={{__html:iconSz('truck',24,'white')}}></div>
          <h2 className="sora" style={{fontSize:22,fontWeight:700,marginBottom:5}}>{mode==='login'?'Masuk ke Akun':'Buat Akun Baru'}</h2>
          <p style={{fontSize:14,color:'var(--tx2)'}}>MagerPindah — Pindahan Kos Tanpa Ribet</p>
        </div>
        {mode==='login' && (
          <div style={{background:'rgba(95,122,219,.08)',border:'1px solid rgba(95,122,219,.2)',borderRadius:10,padding:'10px 14px',marginBottom:18,fontSize:12,color:'var(--acc2)',lineHeight:1.6}}>
            Demo → customer@demo.com | driver@demo.com | admin@demo.com<br/>Password: demo123
          </div>
        )}
        {err && <div style={{background:'rgba(224,92,92,.1)',border:'1px solid rgba(224,92,92,.2)',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13,color:'var(--err)'}}>{err}</div>}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {mode==='register' && <input className="inp" id="aName" placeholder="Nama lengkap"/>}
          <input className="inp" id="aEmail" type="email" placeholder="Email address"/>
          <input className="inp" id="aPass" type="password" placeholder="Password"/>
          {mode==='register' && (
            <>
              <input className="inp" id="aPhone" type="tel" placeholder="Nomor WhatsApp"/>
              <select className="inp" id="aRole">
                <option value="customer">Customer (Mau Pindahan)</option>
                <option value="driver">Driver (Mau Jadi Mitra)</option>
              </select>
            </>
          )}
        </div>
        <button className="btn-p" style={{width:'100%',marginTop:20,padding:14}} onClick={handleAuth}>
          {mode==='login'?'Masuk Sekarang':'Daftar Gratis'}
        </button>
        <p style={{textAlign:'center',marginTop:18,fontSize:14,color:'var(--tx2)'}}>
          {mode==='login'?'Belum punya akun?':'Sudah punya akun?'}
          {' '}<span style={{color:'var(--acc2)',cursor:'pointer',fontWeight:600}} onClick={() => navigate(mode==='login'?'register':'login')}>{mode==='login'?'Daftar':'Masuk'}</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOOKING PAGE
───────────────────────────────────────────── */
function BookingPage({ bookingStep, setBookingStep, bookingForm, setBookingForm, bookingDone, setBookingDone, navigate }) {
  const f = bookingForm;
  const step = bookingStep;
  const steps = ['Lokasi & Waktu', 'Layanan & Barang', 'Konfirmasi'];
  const [newItem, setNewItem] = useState('');

  function saveAndNext() {
    const from = document.getElementById('bf_from')?.value;
    const to = document.getElementById('bf_to')?.value;
    const date = document.getElementById('bf_date')?.value;
    const time = document.getElementById('bf_time')?.value;
    const notes = document.getElementById('bf_notes')?.value;
    setBookingForm(prev => ({
      ...prev,
      ...(from !== undefined ? {from} : {}),
      ...(to !== undefined ? {to} : {}),
      ...(date !== undefined ? {date} : {}),
      ...(time !== undefined ? {time} : {}),
      ...(notes !== undefined ? {notes} : {}),
    }));
  }

  function addItem() {
    if (newItem.trim()) {
      setBookingForm(prev => ({...prev, items: [...prev.items, newItem.trim()]}));
      setNewItem('');
    }
  }

  function removeItem(i) {
    setBookingForm(prev => ({...prev, items: prev.items.filter((_,idx)=>idx!==i)}));
  }

  if (bookingDone) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'clamp(24px,4vw,48px) 16px'}}>
        <div style={{textAlign:'center',maxWidth:440}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(62,207,160,.15)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',color:'var(--ok)'}} dangerouslySetInnerHTML={{__html:iconSz('chk',42,'#3ECFA0')}}></div>
          <h2 className="sora" style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:700,marginBottom:10}}>Order Berhasil!</h2>
          <p style={{color:'var(--tx2)',marginBottom:8}}>ID Order: <strong style={{color:'var(--acc)'}}>#{`MPD-${Math.floor(Math.random()*9000)+1000}`}</strong></p>
          <p style={{color:'var(--tx2)',marginBottom:32,lineHeight:1.7}}>Driver sedang konfirmasi. Kamu akan dapat notifikasi segera.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn-p" onClick={() => navigate('tracking')}>Lacak Order</button>
            <button className="btn-g" onClick={() => { setBookingDone(false); setBookingStep(1); }}>Buat Lagi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',padding:'clamp(24px,4vw,48px) 0',paddingTop:24}}>
      <div className="wrap" style={{maxWidth:760}}>
        <h1 className="sora" style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:700,marginBottom:6}}>Buat Order Pindahan</h1>
        <p style={{color:'var(--tx2)',marginBottom:32}}>Isi detail pindahanmu</p>

        {/* STEP INDICATOR */}
        <div style={{display:'flex',alignItems:'center',marginBottom:32,overflowX:'auto',paddingBottom:4}}>
          {steps.map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,cursor:i<step-1?'pointer':'default'}} onClick={() => i<step-1 && setBookingStep(i+1)}>
                <div className="step-num" style={{background:i+1<=step?'linear-gradient(135deg,#5F7ADB,#7B92E8)':'var(--bd)'}}>
                  {i+1<step ? <span dangerouslySetInnerHTML={{__html:ic.chk}}></span> : <span style={{color:i+1===step?'white':'var(--tx2)'}}>{i+1}</span>}
                </div>
                <span style={{fontSize:13,fontWeight:i+1===step?600:400,color:i+1===step?'var(--tx)':'var(--tx2)',whiteSpace:'nowrap'}}>{s}</span>
              </div>
              {i<steps.length-1 && <div className="step-line" style={{background:i+1<step?'var(--acc)':'var(--bd)'}}></div>}
            </div>
          ))}
        </div>

        <div className="card card-p">
          {step===1 && (
            <>
              <h3 className="sora" style={{fontSize:16,fontWeight:600,marginBottom:18}}>Lokasi & Waktu</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div><label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>📍 Alamat Asal (Kos Lama)</label>
                  <input className="inp" id="bf_from" placeholder="Cth: Kos Melati, Jl. Cihampelas No. 12" defaultValue={f.from}/></div>
                <div><label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>🏠 Alamat Tujuan (Kos Baru)</label>
                  <input className="inp" id="bf_to" placeholder="Cth: Kos Cendana, Jl. Dipatiukur No. 5" defaultValue={f.to}/></div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14}}>
                  <div><label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>📅 Tanggal</label><input className="inp" id="bf_date" type="date" defaultValue={f.date}/></div>
                  <div><label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>🕐 Jam</label><input className="inp" id="bf_time" type="time" defaultValue={f.time}/></div>
                </div>
              </div>
            </>
          )}

          {step===2 && (
            <>
              <h3 className="sora" style={{fontSize:16,fontWeight:600,marginBottom:18}}>Layanan & Barang</h3>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:10}}>Jenis Layanan</label>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:10}}>
                    {[['lite','🛵','Lite Move','Kecil'],['regular','🚚','Regular','Standar'],['full','📦','Full Service','+ Helper']].map(([v,em,label,sub]) => (
                      <div key={v} onClick={() => setBookingForm(prev=>({...prev,service:v}))} style={{padding:'clamp(10px,1.5vw,14px)',borderRadius:12,cursor:'pointer',textAlign:'center',border:`1px solid ${f.service===v?'var(--acc)':'var(--bd)'}`,background:f.service===v?'rgba(95,122,219,.1)':'transparent'}}>
                        <div style={{fontSize:22,marginBottom:5}}>{em}</div>
                        <div style={{fontSize:13,fontWeight:600,color:f.service===v?'var(--acc2)':'var(--tx)'}}>{label}</div>
                        <div style={{fontSize:11,color:'var(--tx2)'}}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>Kendaraan</label>
                  <select className="inp" value={f.vehicle} onChange={e => setBookingForm(prev=>({...prev,vehicle:e.target.value}))}>
                    <option value="motor">🛵 Motor Box (50 kg)</option>
                    <option value="pickup">🚚 Pickup Bak (500 kg)</option>
                    <option value="box">📦 Mobil Box (1000 kg)</option>
                  </select>
                </div>
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <label style={{fontSize:13,color:'var(--tx2)'}}>Jumlah Helper</label>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <button onClick={() => setBookingForm(prev=>({...prev,helpers:Math.max(0,prev.helpers-1)}))} style={{width:34,height:34,borderRadius:9,border:'1px solid var(--bd)',background:'transparent',color:'var(--tx)',cursor:'pointer',fontSize:18,fontFamily:'inherit'}}>-</button>
                      <span className="sora" style={{fontWeight:700,minWidth:22,textAlign:'center'}}>{f.helpers}</span>
                      <button onClick={() => setBookingForm(prev=>({...prev,helpers:Math.min(4,prev.helpers+1)}))} style={{width:34,height:34,borderRadius:9,border:'1px solid var(--bd)',background:'transparent',color:'var(--tx)',cursor:'pointer',fontSize:18,fontFamily:'inherit'}}>+</button>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:'var(--tx2)'}}>Rp25.000/orang · Maks 4 orang</p>
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:8}}>Daftar Barang</label>
                  <div style={{display:'flex',gap:8,marginBottom:10}}>
                    <input className="inp" style={{flex:1}} placeholder="Cth: Kasur single, Lemari kecil..." value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addItem()}/>
                    <button className="btn-g btn-sm" style={{flexShrink:0}} onClick={addItem}>+ Tambah</button>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {f.items.map((item,i) => (
                      <span key={i} style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--bd)',borderRadius:8,padding:'5px 10px',fontSize:13}}>
                        {item}
                        <span onClick={() => removeItem(i)} style={{cursor:'pointer',color:'var(--tx2)',fontSize:16,lineHeight:1}}>×</span>
                      </span>
                    ))}
                    {f.items.length===0 && <span style={{fontSize:13,color:'var(--tx2)'}}>Belum ada barang</span>}
                  </div>
                </div>
                <div><label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:7}}>Catatan Tambahan</label>
                  <textarea className="inp" id="bf_notes" placeholder="Misal: ada tangga, barang fragile, dll." defaultValue={f.notes}></textarea></div>
              </div>
            </>
          )}

          {step===3 && (
            <>
              <h3 className="sora" style={{fontSize:16,fontWeight:600,marginBottom:22}}>Konfirmasi Order</h3>
              <div style={{marginBottom:22}}>
                {[
                  ['📍 Dari',f.from||'Belum diisi'],
                  ['🏠 Ke',f.to||'Belum diisi'],
                  ['📅 Jadwal',f.date&&f.time?`${f.date} · ${f.time}`:'Belum dipilih'],
                  ['🚚 Kendaraan',f.vehicle==='motor'?'Motor Box':f.vehicle==='pickup'?'Pickup Bak':'Mobil Box'],
                  ['📦 Layanan',f.service==='lite'?'Lite Move':f.service==='regular'?'Regular Move':'Full Service'],
                  ['👥 Helper',`${f.helpers} orang`],
                  ['📋 Barang',f.items.length>0?f.items.join(', '):'Belum ada'],
                ].map(([label,val]) => (
                  <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--bd)',gap:12}}>
                    <span style={{fontSize:14,color:'var(--tx2)',flexShrink:0}}>{label}</span>
                    <span style={{fontSize:14,fontWeight:500,textAlign:'right',wordBreak:'break-word'}}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{background:'rgba(95,122,219,.08)',border:'1px solid rgba(95,122,219,.2)',borderRadius:14,padding:'clamp(16px,2vw,22px)',marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:14,color:'var(--tx2)'}}>Estimasi Total</span>
                  <span className="sora" style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:800,color:'var(--acc)'}}>Rp145.000</span>
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,color:'var(--tx2)',marginBottom:10}}>Metode Pembayaran</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:8}}>
                  {['GoPay','OVO','QRIS','Dana','Transfer','Kartu Kredit'].map(m => (
                    <div key={m} style={{padding:'10px 8px',borderRadius:10,border:'1px solid var(--bd)',textAlign:'center',cursor:'pointer',fontSize:12,color:'var(--tx2)'}}>{m}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* NAV BUTTONS */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:24}}>
            {step>1 ? <button className="btn-g" onClick={() => { saveAndNext(); setBookingStep(s=>s-1); }}>← Kembali</button> : <div></div>}
            {step<3
              ? <button className="btn-p" onClick={() => { saveAndNext(); setBookingStep(s=>s+1); }}>Lanjut →</button>
              : <button className="btn-p" style={{padding:'12px 28px'}} onClick={() => setBookingDone(true)}>✓ Buat Order</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRACKING PAGE
───────────────────────────────────────────── */
function TrackingPage({ trackStatus, setTrackStatus, chatMsgs, setChatMsgs }) {
  const chatRef = useRef(null);
  const statuses = [
    {label:'Order Dikonfirmasi',time:'09:45'},
    {label:'Driver Menuju Lokasi',time:'10:05'},
    {label:'Barang Diangkut',time:'10:30'},
    {label:'Dalam Perjalanan',time:'11:00'},
    {label:'Hampir Tiba',time:'—'},
    {label:'Selesai',time:'—'},
  ];
  const idx = trackStatus;

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs]);

  function sendChat() {
    const inp = document.getElementById('chatInp');
    if (!inp || !inp.value.trim()) return;
    const now = new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
    const msg = inp.value.trim();
    inp.value = '';
    setChatMsgs(prev => [...prev, {s:'user',t:msg,time:now}]);
    setTimeout(() => {
      setChatMsgs(prev => [...prev, {s:'driver',t:'Oke siap!',time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}]);
    }, 1200);
  }

  return (
    <div style={{padding:'clamp(24px,4vw,48px) 0'}}>
      <div className="wrap">
        <h1 className="sora" style={{fontSize:'clamp(20px,3vw,26px)',fontWeight:700,marginBottom:6}}>Lacak Order</h1>
        <p style={{color:'var(--tx2)',marginBottom:24,fontSize:14}}>Real-time tracking pindahanmu</p>
        <div style={{display:'flex',gap:10,marginBottom:28,maxWidth:440}}>
          <input className="inp" style={{flex:1}} placeholder="ID Order (MPD-XXXX)" defaultValue="MPD-2847"/>
          <button className="btn-p" style={{padding:'12px 18px',flexShrink:0}}>Lacak</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',gap:20}}>
          {/* LEFT */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <div className="card card-p">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{fontSize:12,color:'var(--tx2)',marginBottom:3}}>Order #MPD-2847</div>
                  <div className="sora" style={{fontSize:'clamp(14px,2vw,17px)',fontWeight:700}}>Jatinangor → Dipatiukur</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className="badge-ok"><span className="dot" style={{marginRight:5}}></span>Aktif</span>
                  <div style={{fontSize:11,color:'var(--tx2)',marginTop:5}}>ETA ~18 mnt</div>
                </div>
              </div>
              <div className="prog"><div className="prog-f" style={{width:`${Math.round(idx/(statuses.length-1)*100)}%`}}></div></div>
            </div>
            <div className="card card-p">
              <h3 style={{fontSize:14,fontWeight:600,marginBottom:18}}>Status Perjalanan</h3>
              {statuses.map((s,i) => (
                <div key={s.label} style={{display:'flex',gap:12}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:22}}>
                    <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,background:i<=idx?'linear-gradient(135deg,#5F7ADB,#7B92E8)':'var(--bd)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:10,position:'relative',zIndex:1}} dangerouslySetInnerHTML={{__html:i<=idx?ic.chk:''}}></div>
                    {i<statuses.length-1 && <div style={{width:2,flex:1,minHeight:24,background:i<idx?'var(--acc)':'var(--bd)',margin:'3px 0'}}></div>}
                  </div>
                  <div style={{paddingBottom:i<statuses.length-1?16:0,flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:13,fontWeight:i<=idx?600:400,color:i<=idx?'var(--tx)':'var(--tx2)'}}>{s.label}</span>
                      <span style={{fontSize:11,color:'var(--tx2)'}}>{s.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:14,display:'flex',gap:8,flexWrap:'wrap'}}>
                <button className="btn-g btn-sm" onClick={() => setTrackStatus(s=>Math.max(0,s-1))}>← Prev</button>
                <button className="btn-g btn-sm" onClick={() => setTrackStatus(s=>Math.min(statuses.length-1,s+1))}>Next →</button>
              </div>
            </div>
            <div className="card" style={{height:160,overflow:'hidden'}}>
              <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1e2430,#242936)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:10}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(95,122,219,.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--acc)'}} dangerouslySetInnerHTML={{__html:ic.map}}></div>
                <div style={{fontSize:13,color:'var(--tx2)'}}>Live Map Tracking</div>
                <div style={{fontSize:11,color:'var(--bd)'}}>Google Maps API</div>
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <div className="card card-p">
              <h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Info Driver</h3>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#5F7ADB,#7B92E8)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:18,flexShrink:0}}>B</div>
                <div><div style={{fontWeight:600}}>Budi Santoso</div><div style={{color:'#F5A623',fontSize:13}}>★★★★★ 4.9</div></div>
              </div>
              {[['Kendaraan','Pickup Bak L300'],['Plat','D 1234 BS'],['No. HP','+62 812-****-5678']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'1px solid var(--bd)',fontSize:13}}>
                  <span style={{color:'var(--tx2)'}}>{k}</span><span style={{fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card card-p" style={{flex:1}}>
              <h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Chat Driver</h3>
              <div ref={chatRef} id="chatBox" style={{height:200,overflowY:'auto',display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
                {chatMsgs.map((m,i) => (
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.s==='user'?'flex-end':'flex-start'}}>
                    <div className={m.s==='user'?'bbl-u':'bbl-d'}>{m.t}</div>
                    <span style={{fontSize:10,color:'var(--tx2)',marginTop:3}}>{m.time}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8}}>
                <input className="inp" id="chatInp" style={{flex:1,padding:'10px 14px'}} placeholder="Pesan..." onKeyDown={e=>e.key==='Enter'&&sendChat()}/>
                <button className="btn-p" style={{padding:'10px 13px'}} onClick={sendChat} dangerouslySetInnerHTML={{__html:ic.send}}></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REPORT PAGE
───────────────────────────────────────────── */
function ReportPage() {
  const monthly = [
    {m:'Jul',orders:142,rev:18240000},{m:'Agu',orders:178,rev:22890000},
    {m:'Sep',orders:195,rev:25100000},{m:'Okt',orders:221,rev:28400000},
    {m:'Nov',orders:268,rev:34500000},{m:'Des',orders:310,rev:39800000},
    {m:'Jan',orders:284,rev:36500000},
  ];
  const maxRev = Math.max(...monthly.map(m => m.rev));
  const txns = [
    {id:'MPD-2847',user:'Rizki Amalia',svc:'Regular',driver:'Budi S.',status:'Selesai',price:'Rp145.000'},
    {id:'MPD-2846',user:'Bima Prakoso',svc:'Lite',driver:'Dedi W.',status:'Selesai',price:'Rp65.000'},
    {id:'MPD-2845',user:'Sari Dewi',svc:'Full',driver:'Andi P.',status:'Selesai',price:'Rp210.000'},
    {id:'MPD-2844',user:'Dika Ramadhan',svc:'Regular',driver:'—',status:'Batal',price:'Rp0'},
    {id:'MPD-2843',user:'Maya Putri',svc:'Full',driver:'Budi S.',status:'Selesai',price:'Rp185.000'},
    {id:'MPD-2842',user:'Fajar Nugraha',svc:'Lite',driver:'Dedi W.',status:'Selesai',price:'Rp55.000'},
  ];

  return (
    <div className="section">
      <div className="wrap">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:28}}>
          <div>
            <div className="pill" style={{marginBottom:10}}>Laporan Penjualan</div>
            <h1 className="h2 sora">Sales Report</h1>
            <p style={{color:'var(--tx2)',fontSize:14,marginTop:4}}>Periode: Januari 2025</p>
          </div>
          <button className="btn-p btn-sm">📥 Export CSV</button>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="g4" style={{marginBottom:28}}>
          {[
            {label:'Total Transaksi',val:'1.598',ch:'+18%',c:'var(--acc)'},
            {label:'Total Pendapatan',val:'Rp204.9jt',ch:'+22%',c:'var(--ok)'},
            {label:'Total Customer',val:'1.024',ch:'+130',c:'var(--warn)'},
            {label:'Total Driver',val:'23',ch:'+5',c:'var(--acc2)'},
          ].map(s => (
            <div key={s.label} className="stat">
              <div style={{fontSize:11,color:'var(--tx2)',marginBottom:8,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase'}}>{s.label}</div>
              <div className="sora" style={{fontSize:'clamp(18px,2.5vw,26px)',fontWeight:800,color:s.c,marginBottom:4}}>{s.val}</div>
              <div style={{fontSize:12,color:'var(--ok)'}}>{s.ch} bulan ini</div>
            </div>
          ))}
        </div>

        {/* CHART ROW */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))',gap:20,marginBottom:28}}>
          <div className="card card-p">
            <h3 className="sora" style={{fontSize:15,fontWeight:700,marginBottom:20}}>Pendapatan Bulanan</h3>
            <div style={{display:'flex',alignItems:'flex-end',gap:'clamp(6px,1.2vw,12px)',height:160,paddingBottom:24}}>
              {monthly.map(m => (
                <div key={m.m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%',justifyContent:'flex-end'}}>
                  <div style={{fontSize:9,color:'var(--acc2)',fontWeight:600,marginBottom:2}}>Rp{Math.round(m.rev/1e6)}jt</div>
                  <div style={{width:'100%',background:'linear-gradient(180deg,var(--acc),rgba(95,122,219,.25))',borderRadius:'4px 4px 0 0',height:Math.round(m.rev/maxRev*120),minHeight:4,transition:'height .5s'}}></div>
                  <span style={{fontSize:9,color:'var(--tx2)'}}>{m.m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-p">
            <h3 className="sora" style={{fontSize:15,fontWeight:700,marginBottom:18}}>Distribusi Layanan</h3>
            {[['Lite Move',28,'var(--ok)'],['Regular Move',52,'var(--acc)'],['Full Service',20,'var(--warn)']].map(([label,pct,color]) => (
              <div key={label} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13}}>
                  <span style={{color:'var(--tx2)'}}>{label}</span><span style={{fontWeight:600}}>{pct}%</span>
                </div>
                <div className="prog"><div className="prog-f" style={{width:`${pct}%`,background:color}}></div></div>
              </div>
            ))}
            <div style={{marginTop:18,padding:14,background:'var(--bg3)',borderRadius:10}}>
              <div style={{fontSize:12,color:'var(--tx2)',marginBottom:6}}>Top Driver Bulan Ini</div>
              {[['Budi S.','Rp4.2jt','42 trip'],['Dedi W.','Rp3.8jt','38 trip'],['Andi P.','Rp3.1jt','31 trip']].map(([n,rev,trip]) => (
                <div key={n} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--bd)',fontSize:13}}>
                  <span style={{fontWeight:500}}>{n}</span>
                  <div style={{display:'flex',gap:12}}><span style={{color:'var(--ok)'}}>{rev}</span><span style={{color:'var(--tx2)'}}>{trip}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="card card-p">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:12}}>
            <h3 className="sora" style={{fontSize:15,fontWeight:700}}>Tabel Transaksi</h3>
            <div style={{display:'flex',gap:8}}>
              <input className="inp" style={{width:180,padding:'8px 12px',fontSize:13}} placeholder="Cari transaksi..."/>
              <button className="btn-g btn-sm">Filter</button>
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="tbl">
              <thead><tr>{['Order ID','Customer','Layanan','Driver','Status','Total'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {txns.map(o => (
                  <tr key={o.id}>
                    <td style={{color:'var(--acc)',fontWeight:600}}>{o.id}</td>
                    <td>{o.user}</td>
                    <td style={{color:'var(--tx2)'}}>{o.svc}</td>
                    <td>{o.driver}</td>
                    <td><span className={o.status==='Selesai'?'badge-ok':o.status==='Batal'?'badge-err':'badge-warn'}>{o.status}</span></td>
                    <td style={{fontWeight:600}}>{o.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,fontSize:13,color:'var(--tx2)',flexWrap:'wrap',gap:12}}>
            <span>Menampilkan {txns.length} dari 1.598 transaksi</span>
            <div style={{display:'flex',gap:6}}>
              {[1,2,3,'...',159].map((p,i) => (
                <button key={i} style={{width:30,height:30,borderRadius:7,border:'1px solid var(--bd)',background:p===1?'var(--acc)':'transparent',color:p===1?'white':'var(--tx2)',cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD
───────────────────────────────────────────── */
function AdminPage({ user, adminTab, setAdminTab, logout }) {
  const orders = [
    {id:'MPD-2847',user:'Rizki Amalia',from:'Jatinangor',to:'Dipatiukur',status:'Aktif',price:'Rp145.000',driver:'Budi S.'},
    {id:'MPD-2846',user:'Bima Prakoso',from:'Sekeloa',to:'Tubagus',status:'Selesai',price:'Rp95.000',driver:'Dedi W.'},
    {id:'MPD-2845',user:'Sari Dewi',from:'Cisitu',to:'Geger Kalong',status:'Selesai',price:'Rp210.000',driver:'Andi P.'},
    {id:'MPD-2844',user:'Dika Ramadhan',from:'Dago',to:'Antapani',status:'Batal',price:'Rp0',driver:'—'},
    {id:'MPD-2843',user:'Maya Putri',from:'Lembang',to:'Hegarmanah',status:'Selesai',price:'Rp185.000',driver:'Budi S.'},
  ];
  const drivers = [
    {name:'Budi Santoso',veh:'Pickup Bak',trips:142,earn:'Rp4.2jt',status:'Online',rating:'4.9'},
    {name:'Dedi Wahyu',veh:'Motor Box',trips:98,earn:'Rp3.8jt',status:'Online',rating:'4.8'},
    {name:'Andi Pratama',veh:'Mobil Box',trips:75,earn:'Rp3.1jt',status:'Offline',rating:'4.7'},
  ];
  const customers = [
    {name:'Rizki Amalia',email:'rizki@demo.com',orders:4,status:'Aktif'},
    {name:'Bima Prakoso',email:'bima@demo.com',orders:2,status:'Aktif'},
    {name:'Sari Dewi',email:'sari@demo.com',orders:3,status:'Aktif'},
  ];
  const tab = adminTab;
  const sColor = s => s==='Aktif'?'badge-ok':s==='Selesai'?'badge-ok':s==='Batal'?'badge-err':'badge-warn';
  const navItems = [['overview','📊','Overview'],['orders','📦','Order'],['drivers','🚗','Driver'],['customers','👥','Customer'],['report','📈','Laporan']];

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 62px)'}}>
      {/* Sidebar Desktop */}
      <div className="hide-xs" style={{width:200,flexShrink:0,background:'var(--bg2)',borderRight:'1px solid var(--bd)',padding:'20px 12px',display:'flex',flexDirection:'column',gap:2}}>
        <div style={{paddingLeft:14,marginBottom:10,fontSize:10,color:'var(--tx2)',fontWeight:700,letterSpacing:'.08em'}}>ADMIN PANEL</div>
        {navItems.map(([id,em,label]) => (
          <div key={id} className={`sb-link${tab===id?' active':''}`} onClick={() => setAdminTab(id)}>{em} {label}</div>
        ))}
        <div style={{marginTop:'auto',borderTop:'1px solid var(--bd)',paddingTop:12}}>
          <div className="sb-link" onClick={logout} dangerouslySetInnerHTML={{__html:ic.logout+' Keluar'}}></div>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:'hidden',overflowY:'auto'}}>
        <div style={{padding:'clamp(16px,2.5vw,28px)'}}>
          {/* Mobile tabs */}
          <div style={{display:'flex',gap:6,marginBottom:20,overflowX:'auto',paddingBottom:2}}>
            {navItems.map(([id,em,label]) => (
              <button key={id} className={`tab-btn${tab===id?' active':''}`} style={{flexShrink:0,fontSize:13}} onClick={() => setAdminTab(id)}>{em} {label}</button>
            ))}
          </div>
          <div style={{marginBottom:22}}>
            <h1 className="sora" style={{fontSize:'clamp(18px,2.5vw,22px)',fontWeight:700}}>
              {tab==='overview'?'Overview Dashboard':tab==='orders'?'Semua Order':tab==='drivers'?'Manajemen Driver':tab==='customers'?'Data Customer':'Laporan Penjualan'}
            </h1>
            <p style={{color:'var(--tx2)',fontSize:14,marginTop:3}}>Selamat datang, {user?.name||'Admin'}</p>
          </div>

          {tab==='overview' && (
            <>
              <div className="g4" style={{marginBottom:22}}>
                {[
                  {label:'Total Order',val:'1.284',ch:'+12%',c:'var(--acc)'},
                  {label:'Pendapatan',val:'Rp48.2jt',ch:'+8.3%',c:'var(--ok)'},
                  {label:'Driver Aktif',val:'23',ch:'+3',c:'var(--warn)'},
                  {label:'Rating Avg',val:'4.87 ⭐',ch:'+0.02',c:'var(--acc2)'},
                ].map(s => (
                  <div key={s.label} className="stat">
                    <div style={{fontSize:11,color:'var(--tx2)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.04em'}}>{s.label}</div>
                    <div className="sora" style={{fontSize:'clamp(18px,2.5vw,24px)',fontWeight:700,color:s.c}}>{s.val}</div>
                    <div style={{fontSize:11,color:'var(--ok)',marginTop:4}}>{s.ch}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:18,marginBottom:22}}>
                <div className="card card-p">
                  <h3 className="sora" style={{fontSize:14,fontWeight:600,marginBottom:16}}>Order Per Minggu</h3>
                  <div style={{height:130,display:'flex',alignItems:'flex-end',gap:6}}>
                    {[42,65,48,78,92,58,85].map((h,i) => (
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                        <div style={{width:'100%',background:'linear-gradient(180deg,var(--acc),rgba(95,122,219,.2))',borderRadius:'4px 4px 0 0',height:Math.round(h*1.3)}}></div>
                        <span style={{fontSize:9,color:'var(--tx2)'}}>{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card card-p">
                  <h3 className="sora" style={{fontSize:14,fontWeight:600,marginBottom:14}}>Distribusi Layanan</h3>
                  {[['Lite Move',28,'var(--ok)'],['Regular Move',52,'var(--acc)'],['Full Service',20,'var(--warn)']].map(([l,p,c]) => (
                    <div key={l} style={{marginBottom:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:13}}><span style={{color:'var(--tx2)'}}>{l}</span><span style={{fontWeight:600}}>{p}%</span></div>
                      <div className="prog"><div className="prog-f" style={{width:`${p}%`,background:c}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card-p">
                <h3 className="sora" style={{fontSize:14,fontWeight:600,marginBottom:16}}>Order Terbaru</h3>
                <div style={{overflowX:'auto'}}>
                  <table className="tbl">
                    <thead><tr>{['ID','Customer','Rute','Driver','Status','Total'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{orders.slice(0,5).map(o=>(
                      <tr key={o.id}><td style={{color:'var(--acc)',fontWeight:600}}>{o.id}</td><td>{o.user}</td><td style={{color:'var(--tx2)'}}>{o.from}→{o.to}</td><td>{o.driver}</td><td><span className={sColor(o.status)}>{o.status}</span></td><td style={{fontWeight:600}}>{o.price}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab==='orders' && (
            <div className="card card-p">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:12}}>
                <span style={{fontSize:14,color:'var(--tx2)'}}>Total: 1.284 order</span>
                <div style={{display:'flex',gap:8}}><input className="inp" style={{width:160,padding:'8px 12px',fontSize:13}} placeholder="Cari..."/><button className="btn-g btn-sm">Filter</button></div>
              </div>
              <div style={{overflowX:'auto'}}>
                <table className="tbl">
                  <thead><tr>{['ID','Customer','Rute','Driver','Status','Total','Aksi'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{orders.map(o=>(
                    <tr key={o.id}><td style={{color:'var(--acc)',fontWeight:600}}>{o.id}</td><td>{o.user}</td><td style={{color:'var(--tx2)'}}>{o.from}→{o.to}</td><td>{o.driver}</td><td><span className={sColor(o.status)}>{o.status}</span></td><td style={{fontWeight:600}}>{o.price}</td><td><button className="btn-g btn-sm">Detail</button></td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='drivers' && (
            <div className="card card-p">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:12}}>
                <span style={{fontSize:14,color:'var(--tx2)'}}>{drivers.length} driver terdaftar</span>
                <button className="btn-p btn-sm">+ Tambah Driver</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16}}>
                {drivers.map(d => (
                  <div key={d.name} className="card card-p" style={{borderRadius:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                      <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#5F7ADB,#7B92E8)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16,flexShrink:0}}>{d.name[0]}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{d.name}</div>
                        <div style={{fontSize:12,color:'var(--tx2)'}}>{d.veh}</div>
                        <span className={d.status==='Online'?'badge-ok':'badge-err'} style={{fontSize:10}}>{d.status}</span>
                      </div>
                    </div>
                    {[['Trip',d.trips],['Penghasilan',d.earn],['Rating',`⭐ ${d.rating}`]].map(([k,v]) => (
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderTop:'1px solid var(--bd)',fontSize:13}}>
                        <span style={{color:'var(--tx2)'}}>{k}</span><span style={{fontWeight:500}}>{v}</span>
                      </div>
                    ))}
                    <button className="btn-g btn-sm" style={{width:'100%',marginTop:12}}>Assign Order</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='customers' && (
            <div className="card card-p">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:12}}>
                <span style={{fontSize:14,color:'var(--tx2)'}}>{customers.length} customer terdaftar</span>
                <input className="inp" style={{width:160,padding:'8px 12px',fontSize:13}} placeholder="Cari customer..."/>
              </div>
              <div style={{overflowX:'auto'}}>
                <table className="tbl">
                  <thead><tr>{['Nama','Email','Total Order','Status','Aksi'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{customers.map(c=>(
                    <tr key={c.name}>
                      <td style={{fontWeight:500}}>{c.name}</td>
                      <td style={{color:'var(--tx2)'}}>{c.email}</td>
                      <td>{c.orders}</td>
                      <td><span className="badge-ok">{c.status}</span></td>
                      <td><button className="btn-g btn-sm">Detail</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='report' && <ReportPage />}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DRIVER DASHBOARD
───────────────────────────────────────────── */
function DriverPage({ user, driverTab, setDriverTab }) {
  const orders = [
    {id:'MPD-2847',user:'Rizki Amalia',from:'Kos Jatinangor',to:'Kos Dipatiukur',dist:'4.2 KM',price:'Rp145.000',items:12},
    {id:'MPD-2850',user:'Dian Pratama',from:'Kos Sekeloa',to:'Kos Tubagus',dist:'2.8 KM',price:'Rp95.000',items:8},
  ];
  const tab = driverTab || 'orders';

  return (
    <div className="section">
      <div className="wrap">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:14}}>
          <div>
            <h1 className="sora" style={{fontSize:'clamp(20px,3vw,26px)',fontWeight:700}}>Driver Panel</h1>
            <p style={{color:'var(--tx2)',marginTop:4,fontSize:14}}>Halo, {user?.name||'Driver'} 👋</p>
          </div>
          <span className="badge-ok"><span className="dot" style={{marginRight:5}}></span>Online</span>
        </div>
        <div className="g3" style={{marginBottom:28}}>
          {[['Penghasilan Hari Ini','Rp285.000','var(--ok)'],['Trip Selesai','12 Trip','var(--acc)'],['Rating','4.9 ⭐','var(--warn)']].map(([l,v,c]) => (
            <div key={l} className="stat">
              <div style={{fontSize:11,color:'var(--tx2)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</div>
              <div className="sora" style={{fontSize:'clamp(20px,2.5vw,26px)',fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:6,marginBottom:22}}>
          {[['orders','Order Masuk'],['history','Riwayat'],['earning','Penghasilan']].map(([t,l]) => (
            <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setDriverTab(t)}>{l}</button>
          ))}
        </div>

        {tab==='orders' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {orders.map(o => (
              <div key={o.id} className="card card-p">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,gap:12}}>
                  <div>
                    <div style={{fontSize:12,color:'var(--acc)',fontWeight:600,marginBottom:3}}>{o.id}</div>
                    <div style={{fontWeight:600,fontSize:15}}>{o.user}</div>
                  </div>
                  <div className="sora" style={{fontSize:'clamp(16px,2.5vw,20px)',fontWeight:800,color:'var(--ok)',whiteSpace:'nowrap'}}>{o.price}</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10,marginBottom:16}}>
                  {[['📍 Dari',o.from],['🏠 Ke',o.to],['🛣️ Jarak',o.dist],['📦 Barang',`${o.items} item`]].map(([k,v]) => (
                    <div key={k}><div style={{fontSize:11,color:'var(--tx2)'}}>{k}</div><div style={{fontSize:13,fontWeight:500,marginTop:2}}>{v}</div></div>
                  ))}
                </div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button className="btn-p" style={{flex:1,minWidth:120}}>✓ Terima Order</button>
                  <button className="btn-g" style={{padding:'12px 18px'}}>Tolak</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='history' && (
          <div className="card card-p">
            <div style={{overflowX:'auto'}}>
              <table className="tbl">
                <thead><tr>{['Order ID','Customer','Rute','Tgl','Total'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ['MPD-2840','Rizki A.','Jatinangor→Dago','14 Jan','Rp95.000'],
                    ['MPD-2835','Bima P.','Sekeloa→Cisitu','12 Jan','Rp65.000'],
                    ['MPD-2830','Maya P.','Lembang→Hegarmanah','10 Jan','Rp145.000'],
                  ].map(([id,u,r,d,p]) => (
                    <tr key={id}><td style={{color:'var(--acc)',fontWeight:600}}>{id}</td><td>{u}</td><td style={{color:'var(--tx2)'}}>{r}</td><td style={{color:'var(--tx2)'}}>{d}</td><td style={{fontWeight:600}}>{p}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='earning' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:18}}>
            <div className="card card-p">
              <h3 className="sora" style={{fontSize:15,fontWeight:700,marginBottom:16}}>Penghasilan Mingguan</h3>
              <div style={{height:130,display:'flex',alignItems:'flex-end',gap:6}}>
                {[45,62,38,80,55,70,90].map((h,i) => (
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                    <div style={{width:'100%',background:'linear-gradient(180deg,var(--ok),rgba(62,207,160,.2))',borderRadius:'4px 4px 0 0',height:Math.round(h*1.3)}}></div>
                    <span style={{fontSize:9,color:'var(--tx2)'}}>{['S','S','R','K','J','S','M'][i]}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:16,paddingTop:14,borderTop:'1px solid var(--bd)'}}>
                <span style={{fontSize:14,color:'var(--tx2)'}}>Total Minggu Ini</span>
                <span className="sora" style={{fontWeight:700,fontSize:18,color:'var(--ok)'}}>Rp1.285.000</span>
              </div>
            </div>
            <div className="card card-p">
              <h3 className="sora" style={{fontSize:15,fontWeight:700,marginBottom:16}}>Ringkasan</h3>
              {[['Hari Ini','Rp285.000'],['Minggu Ini','Rp1.285.000'],['Bulan Ini','Rp4.200.000'],['Total Trip','142 trip'],['Rating','4.9/5.0']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--bd)',fontSize:14}}>
                  <span style={{color:'var(--tx2)'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOMER DASHBOARD
───────────────────────────────────────────── */
function CustomerPage({ user, customerTab, setCustomerTab, navigate }) {
  const tab = customerTab || 'home';
  const orders = [
    {id:'MPD-2847',date:'15 Jan 2025',from:'Jatinangor',to:'Dipatiukur',status:'Aktif',price:'Rp145.000'},
    {id:'MPD-2801',date:'10 Jan 2025',from:'Sekeloa',to:'Dago',status:'Selesai',price:'Rp95.000'},
    {id:'MPD-2755',date:'3 Jan 2025',from:'Lembang',to:'Hegarmanah',status:'Selesai',price:'Rp185.000'},
  ];

  return (
    <div className="section">
      <div className="wrap">
        <div className="card card-p" style={{marginBottom:22,display:'flex',alignItems:'center',gap:18,flexWrap:'wrap'}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#5F7ADB,#7B92E8)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:26,flexShrink:0}}>{(user?.name||'U')[0]}</div>
          <div style={{flex:1,minWidth:180}}>
            <div className="sora" style={{fontSize:'clamp(16px,2.5vw,20px)',fontWeight:700}}>{user?.name||'Pengguna'}</div>
            <div style={{fontSize:14,color:'var(--tx2)'}}>{user?.email||'user@email.com'}</div>
            <div style={{fontSize:12,color:'var(--ok)',marginTop:3}}>✓ Akun Terverifikasi</div>
          </div>
          <button className="btn-g btn-sm">Edit Profil</button>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:22,flexWrap:'wrap'}}>
          {[['home','🏠 Beranda'],['orders','📦 Riwayat'],['tracking','📍 Tracking'],['review','⭐ Review']].map(([t,l]) => (
            <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setCustomerTab(t)}>{l}</button>
          ))}
        </div>

        {tab==='home' && (
          <>
            <div className="g2" style={{marginBottom:22}}>
              {[['Total Order','4 Order','var(--acc)'],['Sedang Aktif','1 Order','var(--ok)'],['Rating Diberikan','2 Review','var(--warn)'],['Penghematan','Rp45rb','var(--acc2)']].map(([l,v,c]) => (
                <div key={l} className="stat"><div style={{fontSize:11,color:'var(--tx2)',marginBottom:6}}>{l}</div><div className="sora" style={{fontSize:'clamp(18px,2.5vw,22px)',fontWeight:700,color:c}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:22}}>
              {[['📦','Buat Order','Pindahan baru','booking'],['📍','Lacak Barang','Cek status','tracking'],['💬','Chat Driver','Hubungi driver','tracking'],['⭐','Beri Review','Rate pindahan','review']].map(([em,t,d,pg]) => (
                <div key={t} className="card card-hover card-p" style={{textAlign:'center',cursor:'pointer'}} onClick={() => navigate ? navigate(pg) : setCustomerTab(pg==='review'?'review':'home')}>
                  <div style={{fontSize:32,marginBottom:10}}>{em}</div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{t}</div>
                  <div style={{fontSize:12,color:'var(--tx2)'}}>{d}</div>
                </div>
              ))}
            </div>
            <div className="card card-p">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <h3 className="sora" style={{fontSize:15,fontWeight:700}}>Order Terakhir</h3>
                <button className="tab-btn active btn-sm" onClick={() => setCustomerTab('orders')}>Lihat Semua</button>
              </div>
              {orders.slice(0,2).map(o => (
                <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--bd)',flexWrap:'wrap',gap:10}}>
                  <div><div style={{fontSize:12,color:'var(--acc)',fontWeight:600,marginBottom:3}}>{o.id} · {o.date}</div>
                  <div style={{fontWeight:500}}>{o.from} → {o.to}</div></div>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <span className="sora" style={{fontWeight:700}}>{o.price}</span>
                    <span className="badge-ok">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==='orders' && (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {orders.map(o => (
              <div key={o.id} className="card card-p" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
                <div><div style={{fontSize:12,color:'var(--acc)',fontWeight:600,marginBottom:3}}>{o.id} · {o.date}</div><div style={{fontWeight:500}}>{o.from} → {o.to}</div></div>
                <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
                  <span className="sora" style={{fontWeight:700}}>{o.price}</span>
                  <span className="badge-ok">{o.status}</span>
                  <button className="btn-g btn-sm">Detail</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='tracking' && <TrackingInline />}

        {tab==='review' && (
          <div className="card card-p" style={{textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:14}}>⭐</div>
            <h3 className="sora" style={{fontSize:17,fontWeight:600,marginBottom:8}}>Beri Review</h3>
            <p style={{color:'var(--tx2)',marginBottom:22,fontSize:14}}>Bantu pengguna lain dengan review jujurmu</p>
            <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:20,fontSize:36}}>
              {[1,2,3,4,5].map(i => <span key={i} style={{cursor:'pointer',color:'var(--warn)'}}>★</span>)}
            </div>
            <textarea className="inp" style={{maxWidth:400,margin:'0 auto 16px'}} placeholder="Ceritakan pengalamanmu..."></textarea>
            <div style={{display:'flex',justifyContent:'center'}}><button className="btn-p">Kirim Review</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackingInline() {
  return (
    <div style={{padding:0}}>
      <p style={{color:'var(--tx2)',marginBottom:16,fontSize:14}}>Tracking order aktif kamu</p>
      <div className="card card-p">
        <div style={{fontSize:12,color:'var(--tx2)',marginBottom:3}}>Order #MPD-2847</div>
        <div className="sora" style={{fontSize:17,fontWeight:700,marginBottom:12}}>Jatinangor → Dipatiukur</div>
        <span className="badge-ok"><span className="dot" style={{marginRight:5}}></span>Dalam Perjalanan</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function AboutPage({ navigate }) {
  return (
    <div className="section">
      <div className="wrap">
        <div style={{maxWidth:600,margin:'0 auto',textAlign:'center',marginBottom:'clamp(40px,5vw,64px)'}}>
          <div className="pill" style={{marginBottom:20}}>Tentang Kami</div>
          <h1 className="h1 sora" style={{marginBottom:20}}>Pindahan Kos<br/><span className="grad">Tanpa Ribet.</span></h1>
          <p className="body-lg">MagerPindah adalah platform logistik khusus mahasiswa yang menggabungkan kemudahan ride-hailing dengan kebutuhan pindahan kos. Didirikan 2024, kami telah membantu 12.000+ mahasiswa.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:18,marginBottom:40}}>
          {[['🛡️','Aman & Terpercaya','Driver terverifikasi & asuransi barang'],['⚡','Cepat & Mudah','Pesan dalam 3 menit'],['💰','Harga Transparan','Tanpa biaya tersembunyi'],['📍','Tracking Realtime','Pantau dari mana saja']].map(([em,t,d]) => (
            <div key={t} className="feat-card">
              <div style={{fontSize:32,marginBottom:12}}>{em}</div>
              <div className="sora" style={{fontSize:15,fontWeight:700,marginBottom:7}}>{t}</div>
              <div style={{fontSize:13,color:'var(--tx2)',lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div className="cta-wrap">
            <h2 className="h2 sora" style={{marginBottom:14}}>Mulai Pindahan Sekarang</h2>
            <p className="body-lg" style={{marginBottom:28,maxWidth:480,marginLeft:'auto',marginRight:'auto'}}>Bergabung dengan ribuan mahasiswa yang sudah merasakan kemudahan MagerPindah</p>
            <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
              <button className="btn-p" onClick={() => navigate('register')}>Daftar Gratis →</button>
              <button className="btn-g" onClick={() => navigate('booking')}>Simulasi Harga</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceSliders, setPriceSliders] = useState({ distance: 4.2, items: 12, helpers: 2, vehicle: 'pickup' });
  const [activeTesti, setActiveTesti] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState({ from:'', to:'', date:'', time:'', vehicle:'pickup', service:'regular', helpers:0, notes:'', items:[] });
  const [bookingDone, setBookingDone] = useState(false);
  const [trackStatus, setTrackStatus] = useState(2);
  const [chatMsgs, setChatMsgs] = useState([
    { s:'driver', t:'Halo, saya Budi. Sedang menuju lokasi kamu.', time:'10:15' },
    { s:'user', t:'Ok siap, saya di dalam ya.', time:'10:16' },
    { s:'driver', t:'ETA 10 menit!', time:'10:17' },
  ]);
  const [adminTab, setAdminTab] = useState('overview');
  const [driverTab, setDriverTab] = useState('orders');
  const [customerTab, setCustomerTab] = useState('home');

  // Inject CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Auto-rotate testimonials on home
  useEffect(() => {
    if (page !== 'home') return;
    const timer = setInterval(() => setActiveTesti(t => (t + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, [page]);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0 }); }, [page]);

  function navigate(p) {
    setPage(p);
    setDrawerOpen(false);
  }

  function logout() {
    setUser(null);
    navigate('home');
  }

  function toggleDrawer() {
    setDrawerOpen(o => !o);
  }

  function renderPage() {
    switch (page) {
      case 'home': return <HomePage priceSliders={priceSliders} setPriceSliders={setPriceSliders} activeTesti={activeTesti} setActiveTesti={setActiveTesti} navigate={navigate} />;
      case 'login': return <AuthPage mode="login" navigate={navigate} onLogin={setUser} />;
      case 'register': return <AuthPage mode="register" navigate={navigate} onLogin={setUser} />;
      case 'booking': return <BookingPage bookingStep={bookingStep} setBookingStep={setBookingStep} bookingForm={bookingForm} setBookingForm={setBookingForm} bookingDone={bookingDone} setBookingDone={setBookingDone} navigate={navigate} />;
      case 'tracking': return <TrackingPage trackStatus={trackStatus} setTrackStatus={setTrackStatus} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} />;
      case 'report': return <ReportPage />;
      case 'admin': return <AdminPage user={user} adminTab={adminTab} setAdminTab={setAdminTab} logout={logout} />;
      case 'driver': return <DriverPage user={user} driverTab={driverTab} setDriverTab={setDriverTab} />;
      case 'customer': return <CustomerPage user={user} customerTab={customerTab} setCustomerTab={setCustomerTab} navigate={navigate} />;
      case 'about': return <AboutPage navigate={navigate} />;
      default: return <HomePage priceSliders={priceSliders} setPriceSliders={setPriceSliders} activeTesti={activeTesti} setActiveTesti={setActiveTesti} navigate={navigate} />;
    }
  }

  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--tx)',fontFamily:"'DM Sans',sans-serif"}}>
      <Navbar page={page} user={user} navigate={navigate} toggleDrawer={toggleDrawer} logout={logout} />
      <Drawer open={drawerOpen} page={page} user={user} navigate={navigate} toggleDrawer={toggleDrawer} logout={logout} />
      <div style={{paddingTop:62}}>
        {renderPage()}
      </div>
    </div>
  );
}
