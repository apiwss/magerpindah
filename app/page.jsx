"use client";
import { useState, useEffect, useRef } from "react";

/* ── CSS-IN-JS VARIABLES (injected once) ── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#1C1F23; --bg2:#22262B; --bg3:#272C33; --bd:#2E3540;
  --acc:#5F7ADB; --acc2:#A2B2EE; --acc-glow:rgba(95,122,219,.18);
  --tx:#F0F2F5; --tx2:#9BA5B2; --tx3:#C8D0DB;
  --ok:#3ECFA0; --warn:#F5A623; --err:#E05C5C;
  --r:14px; --r2:10px; --r3:18px;
}
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--tx); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 99px; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.75)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes fu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
.sora { font-family: 'Sora', sans-serif; }
.grad { background: linear-gradient(135deg,#fff 0%,#A2B2EE 55%,#5F7ADB 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.fade-up { animation: fu .65s ease both; }
.float { animation: float 4.5s ease-in-out infinite; }
.dot { width:8px;height:8px;border-radius:50%;background:var(--ok);display:inline-block;animation:pulse 2s infinite; }
.prog { height:5px;background:var(--bd);border-radius:99px;overflow:hidden; }
.prog-f { height:100%;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:99px;transition:width .8s ease; }
input[type=range] { width:100%;accent-color:var(--acc);height:4px;border-radius:99px; }
`;

/* ── STYLES HELPERS ── */
const s = {
  card: { background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r3)', transition:'border-color .25s,box-shadow .25s,transform .25s' },
  cardP: { padding:'clamp(18px,2.5vw,30px)' },
  glass: { background:'rgba(34,38,43,.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(95,122,219,.14)' },
  glow: { boxShadow:'0 0 36px rgba(95,122,219,.22),0 0 72px rgba(95,122,219,.07)' },
  btnP: { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, borderRadius:'var(--r)', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer', transition:'all .22s', WebkitTapHighlightColor:'transparent', whiteSpace:'nowrap', border:'none', fontSize:'clamp(14px,1.2vw,16px)', padding:'clamp(11px,1.2vw,14px) clamp(20px,2vw,30px)', background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', color:'#fff', position:'relative', overflow:'hidden' },
  btnG: { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, borderRadius:'var(--r)', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer', transition:'all .22s', WebkitTapHighlightColor:'transparent', whiteSpace:'nowrap', background:'transparent', color:'var(--tx)', border:'1px solid var(--bd)', fontSize:'clamp(14px,1.2vw,16px)', padding:'clamp(11px,1.2vw,14px) clamp(20px,2vw,30px)' },
  btnSm: { padding:'8px 16px', fontSize:13, borderRadius:'var(--r2)' },
  inp: { width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--bd)', borderRadius:'var(--r2)', color:'var(--tx)', padding:'12px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:'none', transition:'border-color .2s,box-shadow .2s', WebkitAppearance:'none', appearance:'none' },
  pill: { display:'inline-block', background:'rgba(95,122,219,.13)', color:'var(--acc2)', border:'1px solid rgba(95,122,219,.22)', padding:'4px 14px', borderRadius:'99px', fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase' },
  badgeOk: { background:'rgba(62,207,160,.12)', color:'var(--ok)', border:'1px solid rgba(62,207,160,.2)', padding:'3px 11px', borderRadius:'99px', fontSize:11, fontWeight:700, display:'inline-block' },
  badgeErr: { background:'rgba(224,92,92,.12)', color:'var(--err)', border:'1px solid rgba(224,92,92,.2)', padding:'3px 11px', borderRadius:'99px', fontSize:11, fontWeight:700, display:'inline-block' },
  badgeWarn: { background:'rgba(245,166,35,.12)', color:'var(--warn)', border:'1px solid rgba(245,166,35,.2)', padding:'3px 11px', borderRadius:'99px', fontSize:11, fontWeight:700, display:'inline-block' },
  sbLink: { display:'flex', alignItems:'center', gap:11, padding:'10px 14px', borderRadius:'var(--r2)', cursor:'pointer', color:'var(--tx2)', fontSize:14, fontWeight:500, transition:'background .18s,color .18s', userSelect:'none' },
  wrap: { width:'100%', maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px,4vw,48px)' },
};

/* ── DEMO ACCOUNTS ── */
const DEMO_USERS = [
  { email:'customer@demo.com', pass:'demo123', name:'Rizki Amalia', role:'customer', phone:'+62812-0001' },
  { email:'driver@demo.com',   pass:'demo123', name:'Budi Santoso',  role:'driver',   phone:'+62812-0002' },
  { email:'admin@demo.com',    pass:'demo123', name:'Admin MagerPindah', role:'admin', phone:'+62812-0003' },
];

/* ── PRICE CALC ── */
function calcPrice(sl) {
  const base = { motor:45000, pickup:85000, box:145000 };
  return Math.round((base[sl.vehicle]||85000) + sl.distance*3500 + sl.items*1500 + sl.helpers*25000);
}

/* ── BADGE HELPER ── */
function Badge({ status }) {
  const st = status === 'Aktif' || status === 'Selesai' || status === 'Online' ? 'ok'
    : status === 'Batal' || status === 'Offline' ? 'err' : 'warn';
  return <span style={st==='ok'?s.badgeOk:st==='err'?s.badgeErr:s.badgeWarn}>{status}</span>;
}

/* ── NAVBAR ── */
function Navbar({ page, user, onNavigate, onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = [
    {page:'home',label:'Beranda'},{page:'booking',label:'Pesan'},
    {page:'tracking',label:'Tracking'},{page:'report',label:'Laporan'},{page:'about',label:'Tentang'},
  ];
  const dashPage = user ? (user.role==='admin'?'admin':user.role==='driver'?'driver':'customer') : 'home';

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(28,31,35,.9)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderBottom:'1px solid var(--bd)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', height:62, gap:20, padding:'0 clamp(16px,4vw,48px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', flexShrink:0 }} onClick={()=>onNavigate('home')}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <span className="sora" style={{ fontWeight:700, fontSize:17 }}>Mager<span style={{ color:'var(--acc)' }}>Pindah</span></span>
          </div>
          <div style={{ display:'flex', gap:2, flex:1 }} className="hide-mobile-nav">
            {navItems.map(n=>(
              <span key={n.page} onClick={()=>onNavigate(n.page)} style={{ padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight: page===n.page?600:500, color: page===n.page?'var(--tx)':'var(--tx2)', background: page===n.page?'rgba(255,255,255,.05)':'transparent' }}>{n.label}</span>
            ))}
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', alignItems:'center', gap:10 }} className="hide-mobile-nav">
            {user ? (
              <>
                <button style={{...s.btnG,...s.btnSm}} onClick={()=>onNavigate(dashPage)}>{user.name.split(' ')[0]}</button>
                <button style={{...s.btnG,...s.btnSm}} onClick={onLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </>
            ) : (
              <>
                <button style={{...s.btnG,...s.btnSm}} onClick={()=>onNavigate('login')}>Masuk</button>
                <button style={{...s.btnP,...s.btnSm}} onClick={()=>onNavigate('register')}>Daftar</button>
              </>
            )}
          </div>
          <button onClick={()=>setDrawerOpen(true)} style={{ background:'transparent', border:'1px solid var(--bd)', borderRadius:9, padding:'7px 10px', cursor:'pointer', color:'var(--tx)', display:'flex', alignItems:'center' }} className="show-mobile-only">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && <div onClick={()=>setDrawerOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:300, backdropFilter:'blur(4px)' }} />}
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(80vw,290px)', background:'var(--bg2)', zIndex:400, padding:'24px 18px', display:'flex', flexDirection:'column', gap:4, boxShadow:'-8px 0 40px rgba(0,0,0,.4)', transform: drawerOpen?'translateX(0)':'translateX(100%)', transition:'transform .28s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <span className="sora" style={{ fontWeight:700, fontSize:16 }}>Mager<span style={{ color:'var(--acc)' }}>Pindah</span></span>
          <button onClick={()=>setDrawerOpen(false)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--tx2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {navItems.map(n=>(
          <div key={n.page} onClick={()=>{onNavigate(n.page);setDrawerOpen(false);}} style={{ padding:'12px 14px', borderRadius:10, cursor:'pointer', fontSize:15, fontWeight:500, background:page===n.page?'rgba(95,122,219,.12)':'transparent', color:page===n.page?'var(--acc2)':'var(--tx2)', marginBottom:2 }}>{n.label}</div>
        ))}
        <div style={{ borderTop:'1px solid var(--bd)', marginTop:16, paddingTop:16, display:'flex', flexDirection:'column', gap:10 }}>
          {user ? (
            <>
              <button style={{...s.btnG, width:'100%'}} onClick={()=>{onNavigate(dashPage);setDrawerOpen(false);}}>Dashboard</button>
              <button style={{...s.btnG, width:'100%'}} onClick={()=>{onLogout();setDrawerOpen(false);}}>Keluar</button>
            </>
          ) : (
            <>
              <button style={{...s.btnG, width:'100%'}} onClick={()=>{onNavigate('login');setDrawerOpen(false);}}>Masuk</button>
              <button style={{...s.btnP, width:'100%'}} onClick={()=>{onNavigate('register');setDrawerOpen(false);}}>Daftar Gratis</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── HOME PAGE ── */
function HomePage({ onNavigate }) {
  const [sliders, setSliders] = useState({ distance:4.2, items:12, helpers:2, vehicle:'pickup' });
  const [activeTesti, setActiveTesti] = useState(0);

  const price = calcPrice(sliders);
  const testimoni = [
    { name:'Rizki Amalia', role:'Mahasiswi UNPAD', text:'Pindahan Jatinangor ke Dipatiukur cuma 1 jam! Helper ramah, barang aman semua.', av:'RA' },
    { name:'Bima Prakoso',  role:'Mahasiswa ITB',   text:'Harga akurat, ga ada biaya tersembunyi. Tracking smooth banget di HP!', av:'BP' },
    { name:'Sari Dewi',     role:'Mahasiswi UPI',   text:'Perempuan pindahan sendiri? Aman banget. Driver & helper profesional. Recommended!', av:'SD' },
  ];
  const t = testimoni[activeTesti];
  const stats = [{ v:'12.400+',l:'Order Selesai'},{v:'4.9★',l:'Rating Rata-rata'},{v:'150+',l:'Driver Aktif'},{v:'23 Kota',l:'Jangkauan'}];
  const svc = [
    { icon:'🛵', title:'Lite Move', desc:'Tas, kardus, galon, meja kecil — untuk pindahan minimalis.', price:'Rp45rb', color:'#3ECFA0', feats:['Motor/Motor Box','Kapasitas 50 kg','Cepat & Hemat'] },
    { icon:'🚚', title:'Regular Move', desc:'Kasur, meja, kursi, rak — pindahan standar mahasiswa.', price:'Rp85rb', color:'#5F7ADB', feats:['Pickup Bak','Kapasitas 500 kg','+ Opsi Helper'] },
    { icon:'📦', title:'Full Service', desc:'Helper bongkar, angkut & susun. Tinggal duduk, beres!', price:'Rp195rb', color:'#F5A623', feats:['Mobil Box + Helper','Bongkar & Susun','Untuk yang Sibuk'] },
  ];
  const vehicles = [
    { id:'motor', icon:'🛵', name:'Motor Box', cap:'50 kg', items:'5–8 item', base:45000, tag:'HEMAT' },
    { id:'pickup', icon:'🚚', name:'Pickup Bak', cap:'500 kg', items:'10–20 item', base:85000, tag:'POPULER' },
    { id:'box', icon:'📦', name:'Mobil Box', cap:'1000 kg', items:'20–40 item', base:145000, tag:'FULL' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(a => (a+1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* HERO */}
      <section style={{ position:'relative', minHeight:'clamp(520px,88vh,900px)', display:'flex', alignItems:'center', overflow:'hidden', padding:'clamp(40px,6vw,80px) 0' }}>
        <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none', width:'min(500px,80vw)', height:'min(500px,80vw)', background:'rgba(95,122,219,.07)', top:-80, right:-60 }} />
        <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none', width:250, height:250, background:'rgba(62,207,160,.05)', bottom:80, left:-40 }} />
        <div style={s.wrap}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,480px),1fr))', gap:'clamp(40px,6vw,80px)', alignItems:'center' }}>
            <div className="fade-up">
              <div style={s.pill}>🚀 Platform Pindahan #1 Mahasiswa</div>
              <h1 className="sora" style={{ fontSize:'clamp(28px,5.5vw,60px)', fontWeight:800, lineHeight:1.12, letterSpacing:'-.02em', margin:'18px 0' }}>
                Pindahan Kos<br /><span className="grad">Sekarang Semudah</span><br />Pesan Ojek Online
              </h1>
              <p style={{ fontSize:'clamp(15px,1.5vw,18px)', lineHeight:1.78, color:'var(--tx2)', marginBottom:32, maxWidth:480 }}>
                Pesan kendaraan, helper angkut, sampai tracking barang langsung dari website. Tinggal pesan, barang beres.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40 }}>
                <button style={s.btnP} onClick={()=>onNavigate('booking')}>Pesan Sekarang →</button>
                <button style={s.btnG}>Simulasi Harga</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,auto)', gap:'clamp(16px,3vw,32px)', width:'fit-content' }}>
                {stats.map(st=>(
                  <div key={st.l}>
                    <div className="sora" style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:800 }}>{st.v}</div>
                    <div style={{ fontSize:12, color:'var(--tx2)', marginTop:2 }}>{st.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="float" style={{ display:'flex', justifyContent:'center' }}>
              <div style={{ width:'min(100%,380px)', position:'relative' }}>
                <div style={{ ...s.glass, ...s.glow, borderRadius:22, padding:'clamp(18px,2.5vw,28px)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    </div>
                    <div>
                      <div className="sora" style={{ fontWeight:700, fontSize:15 }}>Order #MPD-2847</div>
                      <div style={{ fontSize:12, color:'var(--ok)', display:'flex', alignItems:'center', gap:5 }}><span className="dot" />Sedang Berjalan</div>
                    </div>
                  </div>
                  {[['📍 Dari','Kos Melati, Jatinangor'],['🏠 Ke','Kos Cendana, Dipatiukur'],['🚚 Driver','Budi Santoso — L300'],['💰 Total','Rp145.000']].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid rgba(255,255,255,.06)', fontSize:13 }}>
                      <span style={{ color:'var(--tx2)' }}>{k}</span>
                      <span style={{ fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:12, color:'var(--tx2)' }}>
                      <span>Progres Perjalanan</span><span style={{ color:'var(--acc2)' }}>68%</span>
                    </div>
                    <div className="prog"><div className="prog-f" style={{ width:'68%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding:'clamp(48px,8vw,96px) 0', background:'var(--bg2)' }}>
        <div style={s.wrap}>
          <div style={{ textAlign:'center', marginBottom:'clamp(40px,5vw,64px)' }}>
            <div style={{ ...s.pill, marginBottom:16 }}>Layanan Kami</div>
            <h2 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700, marginBottom:14 }}>Pilih Sesuai <span className="grad">Kebutuhanmu</span></h2>
            <p style={{ fontSize:'clamp(15px,1.5vw,18px)', color:'var(--tx2)', maxWidth:520, margin:'0 auto' }}>Dari pindahan minimalis sampai full service, semua ada.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap:'clamp(16px,2.5vw,24px)' }}>
            {svc.map((sv,i)=>(
              <div key={i} style={{ ...s.card, padding:'clamp(22px,3vw,32px)', cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(95,122,219,.32)';e.currentTarget.style.transform='translateY(-3px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bd)';e.currentTarget.style.transform='none';}}>
                <div style={{ fontSize:40, marginBottom:16 }}>{sv.icon}</div>
                <div className="sora" style={{ fontSize:'clamp(16px,2vw,20px)', fontWeight:700, marginBottom:10 }}>{sv.title}</div>
                <p style={{ fontSize:14, color:'var(--tx2)', lineHeight:1.7, marginBottom:18 }}>{sv.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:22 }}>
                  {sv.feats.map(f=>(
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sv.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color:'var(--tx3)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span className="sora" style={{ fontSize:'clamp(20px,2.5vw,24px)', fontWeight:800, color:sv.color }}>{sv.price}</span>
                  <button style={{ ...s.btnP, ...s.btnSm }} onClick={()=>onNavigate('booking')}>Pesan →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE CALCULATOR */}
      <section style={{ padding:'clamp(48px,8vw,96px) 0' }}>
        <div style={s.wrap}>
          <div style={{ textAlign:'center', marginBottom:'clamp(32px,4vw,52px)' }}>
            <div style={{ ...s.pill, marginBottom:14 }}>Kalkulator Harga</div>
            <h2 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700, marginBottom:12 }}>Simulasi <span className="grad">Harga Pindahan</span></h2>
            <p style={{ fontSize:'clamp(14px,1.3vw,16px)', color:'var(--tx2)' }}>Perkiraan harga sebelum order</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap:'clamp(24px,4vw,48px)', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
              {/* Kendaraan */}
              <div>
                <label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:10, fontWeight:600 }}>Jenis Kendaraan</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {vehicles.map(v=>(
                    <div key={v.id} onClick={()=>setSliders(p=>({...p,vehicle:v.id}))} style={{ padding:'12px 8px', borderRadius:12, cursor:'pointer', textAlign:'center', border:`1px solid ${sliders.vehicle===v.id?'var(--acc)':'var(--bd)'}`, background: sliders.vehicle===v.id?'rgba(95,122,219,.1)':'transparent', transition:'all .2s' }}>
                      <div style={{ fontSize:22, marginBottom:5 }}>{v.icon}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:sliders.vehicle===v.id?'var(--acc2)':'var(--tx)' }}>{v.name}</div>
                      <div style={{ fontSize:10, color:'var(--tx2)', marginTop:2 }}>{v.cap}</div>
                    </div>
                  ))}
                </div>
              </div>
              {[
                { key:'distance', label:'Jarak Tempuh', val:`${sliders.distance} km`, min:1, max:20, step:.1 },
                { key:'items',    label:'Jumlah Barang', val:`${sliders.items} item`, min:1, max:50, step:1 },
                { key:'helpers',  label:'Jumlah Helper', val:`${sliders.helpers} orang`, min:0, max:4, step:1 },
              ].map(sl=>(
                <div key={sl.key}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                    <span style={{ color:'var(--tx2)' }}>{sl.label}</span>
                    <span style={{ fontWeight:600, color:'var(--acc2)' }}>{sl.val}</span>
                  </div>
                  <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sliders[sl.key]} onChange={e=>setSliders(p=>({...p,[sl.key]:+e.target.value}))} />
                </div>
              ))}
            </div>
            <div style={{ ...s.card, ...s.cardP, textAlign:'center' }}>
              <div style={{ fontSize:14, color:'var(--tx2)', marginBottom:8 }}>Estimasi Biaya</div>
              <div className="sora" style={{ fontSize:'clamp(36px,5vw,52px)', fontWeight:800, color:'var(--acc)', marginBottom:6 }}>
                {`Rp${price.toLocaleString('id-ID')}`}
              </div>
              <div style={{ fontSize:13, color:'var(--tx2)', marginBottom:24, lineHeight:1.6 }}>
                {vehicles.find(v=>v.id===sliders.vehicle)?.name} · {sliders.distance} km · {sliders.helpers} helper
              </div>
              {[
                ['Biaya Dasar', `Rp${({motor:45000,pickup:85000,box:145000}[sliders.vehicle]||85000).toLocaleString('id-ID')}`],
                ['Jarak', `Rp${Math.round(sliders.distance*3500).toLocaleString('id-ID')}`],
                ['Barang', `Rp${Math.round(sliders.items*1500).toLocaleString('id-ID')}`],
                ['Helper', `Rp${Math.round(sliders.helpers*25000).toLocaleString('id-ID')}`],
              ].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid var(--bd)', fontSize:13 }}>
                  <span style={{ color:'var(--tx2)' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <button style={{ ...s.btnP, width:'100%', marginTop:22, padding:14 }} onClick={()=>onNavigate('booking')}>Pesan Sekarang →</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'clamp(48px,8vw,96px) 0', background:'var(--bg2)' }}>
        <div style={s.wrap}>
          <div style={{ textAlign:'center', marginBottom:'clamp(32px,4vw,52px)' }}>
            <div style={{ ...s.pill, marginBottom:14 }}>Testimoni</div>
            <h2 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700 }}>Kata Mereka yang <span className="grad">Sudah Pindahan</span></h2>
          </div>
          <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
            <div style={{ ...s.card, padding:'clamp(28px,4vw,48px)' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:20, margin:'0 auto 20px' }}>{t.av}</div>
              <p style={{ fontSize:'clamp(15px,1.5vw,18px)', lineHeight:1.78, color:'var(--tx3)', marginBottom:22, fontStyle:'italic' }}>"{t.text}"</p>
              <div className="sora" style={{ fontWeight:700 }}>{t.name}</div>
              <div style={{ fontSize:13, color:'var(--tx2)', marginTop:4 }}>{t.role}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
              {[0,1,2].map(i=>(
                <div key={i} onClick={()=>setActiveTesti(i)} style={{ width: i===activeTesti?24:8, height:8, borderRadius:99, background: i===activeTesti?'var(--acc)':'var(--bd)', cursor:'pointer', transition:'width .3s,background .3s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'clamp(48px,8vw,96px) 0' }}>
        <div style={s.wrap}>
          <div style={{ background:'linear-gradient(135deg,rgba(95,122,219,.14) 0%,rgba(95,122,219,.04) 100%)', border:'1px solid rgba(95,122,219,.22)', borderRadius:22, textAlign:'center', padding:'clamp(40px,6vw,72px) clamp(24px,5vw,80px)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:400, height:200, background:'radial-gradient(ellipse,rgba(95,122,219,.12),transparent 70%)', pointerEvents:'none' }} />
            <h2 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700, marginBottom:14 }}>Siap Pindahan Tanpa Ribet?</h2>
            <p style={{ fontSize:'clamp(15px,1.5vw,18px)', color:'var(--tx2)', marginBottom:32, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>Bergabung dengan ribuan mahasiswa yang sudah merasakan kemudahan MagerPindah</p>
            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <button style={s.btnP} onClick={()=>onNavigate('register')}>Daftar Gratis →</button>
              <button style={s.btnG} onClick={()=>onNavigate('booking')}>Simulasi Harga</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── AUTH PAGE ── */
function AuthPage({ mode, onNavigate, onLogin }) {
  const [form, setForm] = useState({ name:'', email:'', pass:'', phone:'', role:'customer' });
  const [err, setErr] = useState('');

  function handleSubmit() {
    setErr('');
    if (mode === 'login') {
      const found = DEMO_USERS.find(u=>u.email===form.email && u.pass===form.pass);
      if (found) { onLogin(found); }
      else setErr('Email atau password salah.');
    } else {
      if (!form.name || !form.email || !form.pass) { setErr('Semua field wajib diisi.'); return; }
      onLogin({ name:form.name, email:form.email, pass:form.pass, phone:form.phone, role:form.role });
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(24px,4vw,48px) clamp(16px,4vw,24px)' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%,rgba(95,122,219,.06),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ ...s.card, width:'100%', maxWidth:420, padding:'clamp(24px,4vw,40px)', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <h2 className="sora" style={{ fontSize:22, fontWeight:700, marginBottom:5 }}>{mode==='login'?'Masuk ke Akun':'Buat Akun Baru'}</h2>
          <p style={{ fontSize:14, color:'var(--tx2)' }}>MagerPindah — Pindahan Kos Tanpa Ribet</p>
        </div>
        {mode==='login' && (
          <div style={{ background:'rgba(95,122,219,.08)', border:'1px solid rgba(95,122,219,.2)', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:12, color:'var(--acc2)', lineHeight:1.6 }}>
            Demo → customer@demo.com | driver@demo.com | admin@demo.com<br/>Password: demo123
          </div>
        )}
        {err && <div style={{ background:'rgba(224,92,92,.1)', border:'1px solid rgba(224,92,92,.2)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:'var(--err)' }}>{err}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {mode==='register' && <input className="inp" style={s.inp} placeholder="Nama lengkap" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />}
          <input className="inp" style={s.inp} type="email" placeholder="Email address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
          <input className="inp" style={s.inp} type="password" placeholder="Password" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
          {mode==='register' && (
            <>
              <input className="inp" style={s.inp} type="tel" placeholder="Nomor WhatsApp" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
              <select className="inp" style={{...s.inp,background:'var(--bg2)'}} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                <option value="customer">Customer (Mau Pindahan)</option>
                <option value="driver">Driver (Mau Jadi Mitra)</option>
              </select>
            </>
          )}
        </div>
        <button style={{ ...s.btnP, width:'100%', marginTop:20, padding:14 }} onClick={handleSubmit}>
          {mode==='login'?'Masuk Sekarang':'Daftar Gratis'}
        </button>
        <p style={{ textAlign:'center', marginTop:18, fontSize:14, color:'var(--tx2)' }}>
          {mode==='login'?'Belum punya akun? ':'Sudah punya akun? '}
          <span style={{ color:'var(--acc2)', cursor:'pointer', fontWeight:600 }} onClick={()=>onNavigate(mode==='login'?'register':'login')}>
            {mode==='login'?'Daftar':'Masuk'}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── BOOKING PAGE ── */
function BookingPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ from:'', to:'', date:'', time:'', vehicle:'pickup', service:'regular', helpers:0, notes:'', items:[] });
  const [newItem, setNewItem] = useState('');
  const steps = ['Lokasi & Waktu','Layanan & Barang','Konfirmasi'];
  const orderId = useRef(Math.floor(Math.random()*9000)+1000);

  function addItem() {
    if (newItem.trim()) { setForm(p=>({...p,items:[...p.items,newItem.trim()]})); setNewItem(''); }
  }

  if (done) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(24px,4vw,48px) 16px' }}>
      <div style={{ textAlign:'center', maxWidth:440 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(62,207,160,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', color:'var(--ok)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="sora" style={{ fontSize:'clamp(22px,3vw,28px)', fontWeight:700, marginBottom:10 }}>Order Berhasil!</h2>
        <p style={{ color:'var(--tx2)', marginBottom:8 }}>ID Order: <strong style={{ color:'var(--acc)' }}>#MPD-{orderId.current}</strong></p>
        <p style={{ color:'var(--tx2)', marginBottom:32, lineHeight:1.7 }}>Driver sedang konfirmasi. Kamu akan dapat notifikasi segera.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button style={s.btnP} onClick={()=>onNavigate('tracking')}>Lacak Order</button>
          <button style={s.btnG} onClick={()=>{setDone(false);setStep(1);}}>Buat Lagi</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', padding:'clamp(24px,4vw,48px) 0' }}>
      <div style={{ ...s.wrap, maxWidth:760 }}>
        <h1 className="sora" style={{ fontSize:'clamp(22px,3vw,28px)', fontWeight:700, marginBottom:6 }}>Buat Order Pindahan</h1>
        <p style={{ color:'var(--tx2)', marginBottom:32 }}>Isi detail pindahanmu</p>
        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:32, overflowX:'auto', paddingBottom:4 }}>
          {steps.map((st,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, cursor:i<step-1?'pointer':'default' }} onClick={()=>i<step-1&&setStep(i+1)}>
                <div style={{ width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, background:i+1<=step?'linear-gradient(135deg,#5F7ADB,#7B92E8)':'var(--bd)', color:'white', transition:'background .3s' }}>
                  {i+1<step ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : <span style={{ color:i+1===step?'white':'var(--tx2)' }}>{i+1}</span>}
                </div>
                <span style={{ fontSize:13, fontWeight:i+1===step?600:400, color:i+1===step?'var(--tx)':'var(--tx2)', whiteSpace:'nowrap' }}>{st}</span>
              </div>
              {i<steps.length-1 && <div style={{ flex:1, height:1, margin:'0 8px', minWidth:20, background:i+1<step?'var(--acc)':'var(--bd)', transition:'background .3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ ...s.card, ...s.cardP }}>
          {step===1 && (
            <div>
              <h3 className="sora" style={{ fontSize:16, fontWeight:600, marginBottom:18 }}>Lokasi & Waktu</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[['bf_from','📍 Alamat Asal (Kos Lama)','Cth: Kos Melati, Jl. Cihampelas No. 12','from'],['bf_to','🏠 Alamat Tujuan (Kos Baru)','Cth: Kos Cendana, Jl. Dipatiukur No. 5','to']].map(([id,label,ph,key])=>(
                  <div key={id}><label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:7 }}>{label}</label>
                    <input style={s.inp} placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} /></div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
                  <div><label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:7 }}>📅 Tanggal</label><input type="date" style={s.inp} value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></div>
                  <div><label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:7 }}>🕐 Jam</label><input type="time" style={s.inp} value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} /></div>
                </div>
              </div>
            </div>
          )}
          {step===2 && (
            <div>
              <h3 className="sora" style={{ fontSize:16, fontWeight:600, marginBottom:18 }}>Layanan & Barang</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:10 }}>Jenis Layanan</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10 }}>
                    {[['lite','🛵','Lite Move','Kecil'],['regular','🚚','Regular','Standar'],['full','📦','Full Service','+ Helper']].map(([v,em,label,sub])=>(
                      <div key={v} onClick={()=>setForm(p=>({...p,service:v}))} style={{ padding:'clamp(10px,1.5vw,14px)', borderRadius:12, cursor:'pointer', textAlign:'center', border:`1px solid ${form.service===v?'var(--acc)':'var(--bd)'}`, background:form.service===v?'rgba(95,122,219,.1)':'transparent', transition:'all .2s' }}>
                        <div style={{ fontSize:22, marginBottom:5 }}>{em}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:form.service===v?'var(--acc2)':'var(--tx)' }}>{label}</div>
                        <div style={{ fontSize:11, color:'var(--tx2)' }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:7 }}>Kendaraan</label>
                  <select style={{...s.inp, background:'var(--bg2)'}} value={form.vehicle} onChange={e=>setForm(p=>({...p,vehicle:e.target.value}))}>
                    <option value="motor">🛵 Motor Box (50 kg)</option>
                    <option value="pickup">🚚 Pickup Bak (500 kg)</option>
                    <option value="box">📦 Mobil Box (1000 kg)</option>
                  </select>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <label style={{ fontSize:13, color:'var(--tx2)' }}>Jumlah Helper</label>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <button onClick={()=>setForm(p=>({...p,helpers:Math.max(0,p.helpers-1)}))} style={{ width:34, height:34, borderRadius:9, border:'1px solid var(--bd)', background:'transparent', color:'var(--tx)', cursor:'pointer', fontSize:18 }}>-</button>
                      <span className="sora" style={{ fontWeight:700, minWidth:22, textAlign:'center' }}>{form.helpers}</span>
                      <button onClick={()=>setForm(p=>({...p,helpers:Math.min(4,p.helpers+1)}))} style={{ width:34, height:34, borderRadius:9, border:'1px solid var(--bd)', background:'transparent', color:'var(--tx)', cursor:'pointer', fontSize:18 }}>+</button>
                    </div>
                  </div>
                  <p style={{ fontSize:12, color:'var(--tx2)' }}>Rp25.000/orang · Maks 4 orang</p>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:8 }}>Daftar Barang</label>
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <input style={{...s.inp, flex:1}} placeholder="Cth: Kasur single, Lemari kecil..." value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addItem()} />
                    <button style={{...s.btnG,...s.btnSm, flexShrink:0}} onClick={addItem}>+ Tambah</button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {form.items.length===0 ? <span style={{ fontSize:13, color:'var(--tx2)' }}>Belum ada barang</span>
                      : form.items.map((item,i)=>(
                        <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--bd)', borderRadius:8, padding:'5px 10px', fontSize:13 }}>
                          {item}
                          <span onClick={()=>setForm(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))} style={{ cursor:'pointer', color:'var(--tx2)', fontSize:16, lineHeight:1 }}>×</span>
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div><label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:7 }}>Catatan Tambahan</label>
                  <textarea style={{...s.inp, resize:'vertical', minHeight:80}} placeholder="Misal: ada tangga, barang fragile, dll." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} /></div>
              </div>
            </div>
          )}
          {step===3 && (
            <div>
              <h3 className="sora" style={{ fontSize:16, fontWeight:600, marginBottom:22 }}>Konfirmasi Order</h3>
              <div style={{ marginBottom:22 }}>
                {[['📍 Dari',form.from||'Belum diisi'],['🏠 Ke',form.to||'Belum diisi'],['📅 Jadwal',form.date&&form.time?`${form.date} · ${form.time}`:'Belum dipilih'],['🚚 Kendaraan',form.vehicle==='motor'?'Motor Box':form.vehicle==='pickup'?'Pickup Bak':'Mobil Box'],['📦 Layanan',form.service==='lite'?'Lite Move':form.service==='regular'?'Regular Move':'Full Service'],['👥 Helper',`${form.helpers} orang`],['📋 Barang',form.items.length>0?form.items.join(', '):'Belum ada']].map(([label,val])=>(
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid var(--bd)', gap:12 }}>
                    <span style={{ fontSize:14, color:'var(--tx2)', flexShrink:0 }}>{label}</span>
                    <span style={{ fontSize:14, fontWeight:500, textAlign:'right', wordBreak:'break-word' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(95,122,219,.08)', border:'1px solid rgba(95,122,219,.2)', borderRadius:14, padding:'clamp(16px,2vw,22px)', marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:14, color:'var(--tx2)' }}>Estimasi Total</span>
                  <span className="sora" style={{ fontSize:'clamp(22px,3vw,28px)', fontWeight:800, color:'var(--acc)' }}>Rp145.000</span>
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, color:'var(--tx2)', marginBottom:10 }}>Metode Pembayaran</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:8 }}>
                  {['GoPay','OVO','QRIS','Dana','Transfer','Kartu Kredit'].map(m=>(
                    <div key={m} style={{ padding:'10px 8px', borderRadius:10, border:'1px solid var(--bd)', textAlign:'center', cursor:'pointer', fontSize:12, color:'var(--tx2)', transition:'all .2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--acc)';e.currentTarget.style.color='var(--acc2)';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bd)';e.currentTarget.style.color='var(--tx2)';}}>{m}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24 }}>
            {step>1 ? <button style={s.btnG} onClick={()=>setStep(p=>p-1)}>← Kembali</button> : <div />}
            {step<3 ? <button style={s.btnP} onClick={()=>setStep(p=>p+1)}>Lanjut →</button>
              : <button style={{...s.btnP, padding:'12px 28px'}} onClick={()=>setDone(true)}>✓ Buat Order</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TRACKING PAGE ── */
function TrackingPage() {
  const [trackStatus, setTrackStatus] = useState(2);
  const [msgs, setMsgs] = useState([
    { s:'driver', t:'Halo, saya Budi. Sedang menuju lokasi kamu.', time:'10:15' },
    { s:'user',   t:'Ok siap, saya di dalam ya.', time:'10:16' },
    { s:'driver', t:'ETA 10 menit!', time:'10:17' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBoxRef = useRef(null);
  const statuses = [
    { label:'Order Dikonfirmasi', time:'09:45' },
    { label:'Driver Menuju Lokasi', time:'10:05' },
    { label:'Barang Diangkut',     time:'10:30' },
    { label:'Dalam Perjalanan',    time:'11:00' },
    { label:'Hampir Tiba',         time:'—' },
    { label:'Selesai',             time:'—' },
  ];

  useEffect(() => { if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; }, [msgs]);

  function sendChat() {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
    setMsgs(m=>[...m,{s:'user',t:chatInput.trim(),time:now}]);
    setChatInput('');
    setTimeout(()=>{
      setMsgs(m=>[...m,{s:'driver',t:'Oke siap!',time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}]);
    },1200);
  }

  return (
    <div style={{ padding:'clamp(24px,4vw,48px) 0' }}>
      <div style={s.wrap}>
        <h1 className="sora" style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:700, marginBottom:6 }}>Lacak Order</h1>
        <p style={{ color:'var(--tx2)', marginBottom:24, fontSize:14 }}>Real-time tracking pindahanmu</p>
        <div style={{ display:'flex', gap:10, marginBottom:28, maxWidth:440 }}>
          <input style={{...s.inp, flex:1}} placeholder="ID Order (MPD-XXXX)" defaultValue="MPD-2847" />
          <button style={{...s.btnP, padding:'12px 18px', flexShrink:0}}>Lacak</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap:20 }}>
          {/* LEFT */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ ...s.card, ...s.cardP }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:12, color:'var(--tx2)', marginBottom:3 }}>Order #MPD-2847</div>
                  <div className="sora" style={{ fontSize:'clamp(14px,2vw,17px)', fontWeight:700 }}>Jatinangor → Dipatiukur</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={s.badgeOk}><span className="dot" style={{ marginRight:5 }} />Aktif</span>
                  <div style={{ fontSize:11, color:'var(--tx2)', marginTop:5 }}>ETA ~18 mnt</div>
                </div>
              </div>
              <div className="prog"><div className="prog-f" style={{ width:`${Math.round(trackStatus/(statuses.length-1)*100)}%` }} /></div>
            </div>
            <div style={{ ...s.card, ...s.cardP }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Status Perjalanan</h3>
              {statuses.map((st,i)=>(
                <div key={i} style={{ display:'flex', gap:12 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:22 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, background:i<=trackStatus?'linear-gradient(135deg,#5F7ADB,#7B92E8)':'var(--bd)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:10, position:'relative', zIndex:1 }}>
                      {i<=trackStatus && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    {i<statuses.length-1 && <div style={{ width:2, flex:1, minHeight:24, background:i<trackStatus?'var(--acc)':'var(--bd)', margin:'3px 0' }} />}
                  </div>
                  <div style={{ paddingBottom:i<statuses.length-1?16:0, flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, fontWeight:i<=trackStatus?600:400, color:i<=trackStatus?'var(--tx)':'var(--tx2)' }}>{st.label}</span>
                      <span style={{ fontSize:11, color:'var(--tx2)' }}>{st.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
                <button style={{...s.btnG,...s.btnSm}} onClick={()=>setTrackStatus(p=>Math.max(0,p-1))}>← Prev</button>
                <button style={{...s.btnG,...s.btnSm}} onClick={()=>setTrackStatus(p=>Math.min(statuses.length-1,p+1))}>Next →</button>
              </div>
            </div>
            <div style={{ ...s.card, height:160, overflow:'hidden' }}>
              <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1e2430,#242936)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(95,122,219,.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--acc)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                </div>
                <div style={{ fontSize:13, color:'var(--tx2)' }}>Live Map Tracking</div>
                <div style={{ fontSize:11, color:'var(--bd)' }}>Google Maps API</div>
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ ...s.card, ...s.cardP }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Info Driver</h3>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:18, flexShrink:0 }}>B</div>
                <div><div style={{ fontWeight:600 }}>Budi Santoso</div><div style={{ color:'#F5A623', fontSize:13 }}>★★★★★ 4.9</div></div>
              </div>
              {[['Kendaraan','Pickup Bak L300'],['Plat','D 1234 BS'],['No. HP','+62 812-****-5678']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid var(--bd)', fontSize:13 }}>
                  <span style={{ color:'var(--tx2)' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, ...s.cardP, flex:1 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Chat Driver</h3>
              <div ref={chatBoxRef} style={{ height:200, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:m.s==='user'?'flex-end':'flex-start' }}>
                    <div style={ m.s==='user'
                      ? { background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', color:'#fff', borderRadius:'18px 18px 4px 18px', padding:'10px 14px', maxWidth:'78%', fontSize:14 }
                      : { background:'var(--bg2)', border:'1px solid var(--bd)', color:'var(--tx3)', borderRadius:'18px 18px 18px 4px', padding:'10px 14px', maxWidth:'78%', fontSize:14 }
                    }>{m.t}</div>
                    <span style={{ fontSize:10, color:'var(--tx2)', marginTop:3 }}>{m.time}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input style={{...s.inp, flex:1, padding:'10px 14px'}} placeholder="Pesan..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} />
                <button style={{...s.btnP, padding:'10px 13px'}} onClick={sendChat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── REPORT PAGE ── */
function ReportPage() {
  const monthly = [
    {m:'Jul',rev:18240000},{m:'Agu',rev:22890000},{m:'Sep',rev:25100000},{m:'Okt',rev:28400000},
    {m:'Nov',rev:34500000},{m:'Des',rev:39800000},{m:'Jan',rev:36500000},
  ];
  const maxRev = Math.max(...monthly.map(m=>m.rev));
  const txns = [
    {id:'MPD-2847',user:'Rizki Amalia',svc:'Regular',driver:'Budi S.',status:'Selesai',price:'Rp145.000'},
    {id:'MPD-2846',user:'Bima Prakoso',svc:'Lite',driver:'Dedi W.',status:'Selesai',price:'Rp65.000'},
    {id:'MPD-2845',user:'Sari Dewi',svc:'Full',driver:'Andi P.',status:'Selesai',price:'Rp210.000'},
    {id:'MPD-2844',user:'Dika Ramadhan',svc:'Regular',driver:'—',status:'Batal',price:'Rp0'},
    {id:'MPD-2843',user:'Maya Putri',svc:'Full',driver:'Budi S.',status:'Selesai',price:'Rp185.000'},
    {id:'MPD-2842',user:'Fajar Nugraha',svc:'Lite',driver:'Dedi W.',status:'Selesai',price:'Rp55.000'},
  ];

  return (
    <div style={{ padding:'clamp(48px,8vw,96px) 0' }}>
      <div style={s.wrap}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:28 }}>
          <div>
            <div style={{ ...s.pill, marginBottom:10 }}>Laporan Penjualan</div>
            <h1 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700 }}>Sales Report</h1>
            <p style={{ color:'var(--tx2)', fontSize:14, marginTop:4 }}>Periode: Januari 2025</p>
          </div>
          <button style={{...s.btnP,...s.btnSm}}>📥 Export CSV</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'clamp(10px,1.5vw,18px)', marginBottom:28 }}>
          {[{label:'Total Transaksi',val:'1.598',ch:'+18%',c:'var(--acc)'},{label:'Total Pendapatan',val:'Rp204.9jt',ch:'+22%',c:'var(--ok)'},{label:'Total Customer',val:'1.024',ch:'+130',c:'var(--warn)'},{label:'Total Driver',val:'23',ch:'+5',c:'var(--acc2)'}].map(st=>(
            <div key={st.label} style={{ background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r)', padding:'clamp(14px,2vw,22px)' }}>
              <div style={{ fontSize:11, color:'var(--tx2)', marginBottom:8, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>{st.label}</div>
              <div className="sora" style={{ fontSize:'clamp(18px,2.5vw,26px)', fontWeight:800, color:st.c, marginBottom:4 }}>{st.val}</div>
              <div style={{ fontSize:12, color:'var(--ok)' }}>{st.ch} bulan ini</div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:20, marginBottom:28 }}>
          <div style={{ ...s.card, ...s.cardP }}>
            <h3 className="sora" style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Pendapatan Bulanan</h3>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'clamp(6px,1.2vw,12px)', height:160, paddingBottom:24 }}>
              {monthly.map(m=>(
                <div key={m.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
                  <div style={{ fontSize:9, color:'var(--acc2)', fontWeight:600, marginBottom:2 }}>Rp{Math.round(m.rev/1e6)}jt</div>
                  <div style={{ width:'100%', background:'linear-gradient(180deg,var(--acc),rgba(95,122,219,.25))', borderRadius:'4px 4px 0 0', height:Math.round(m.rev/maxRev*120), minHeight:4 }} />
                  <span style={{ fontSize:9, color:'var(--tx2)' }}>{m.m}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...s.card, ...s.cardP }}>
            <h3 className="sora" style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Distribusi Layanan</h3>
            {[['Lite Move',28,'var(--ok)'],['Regular Move',52,'var(--acc)'],['Full Service',20,'var(--warn)']].map(([label,pct,color])=>(
              <div key={label} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
                  <span style={{ color:'var(--tx2)' }}>{label}</span><span style={{ fontWeight:600 }}>{pct}%</span>
                </div>
                <div className="prog"><div className="prog-f" style={{ width:`${pct}%`, background:color }} /></div>
              </div>
            ))}
            <div style={{ marginTop:18, padding:14, background:'var(--bg3)', borderRadius:10 }}>
              <div style={{ fontSize:12, color:'var(--tx2)', marginBottom:6 }}>Top Driver Bulan Ini</div>
              {[['Budi S.','Rp4.2jt','42 trip'],['Dedi W.','Rp3.8jt','38 trip'],['Andi P.','Rp3.1jt','31 trip']].map(([n,rev,trip])=>(
                <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid var(--bd)', fontSize:13 }}>
                  <span style={{ fontWeight:500 }}>{n}</span>
                  <div style={{ display:'flex', gap:12 }}><span style={{ color:'var(--ok)' }}>{rev}</span><span style={{ color:'var(--tx2)' }}>{trip}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ ...s.card, ...s.cardP }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:12 }}>
            <h3 className="sora" style={{ fontSize:15, fontWeight:700 }}>Tabel Transaksi</h3>
            <div style={{ display:'flex', gap:8 }}>
              <input style={{...s.inp, width:180, padding:'8px 12px', fontSize:13}} placeholder="Cari transaksi..." />
              <button style={{...s.btnG,...s.btnSm}}>Filter</button>
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Order ID','Customer','Layanan','Driver','Status','Total'].map(h=>(
                <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'var(--tx2)', borderBottom:'1px solid var(--bd)', fontWeight:600, whiteSpace:'nowrap', letterSpacing:'.04em', textTransform:'uppercase' }}>{h}</th>
              ))}</tr></thead>
              <tbody>{txns.map(o=>(
                <tr key={o.id}>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--acc)', fontWeight:600 }}>{o.id}</td>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.user}</td>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{o.svc}</td>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.driver}</td>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><Badge status={o.status} /></td>
                  <td style={{ padding:'11px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', fontWeight:600 }}>{o.price}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN DASHBOARD ── */
function AdminPage({ user, onNavigate, onLogout }) {
  const [tab, setTab] = useState('overview');
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
  const navItems = [['overview','📊','Overview'],['orders','📦','Order'],['drivers','🚗','Driver'],['customers','👥','Customer'],['report','📈','Laporan']];

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>
      <div style={{ width:200, flexShrink:0, background:'var(--bg2)', borderRight:'1px solid var(--bd)', padding:'20px 12px', display:'flex', flexDirection:'column', gap:2 }} className="hide-xs">
        <div style={{ paddingLeft:14, marginBottom:10, fontSize:10, color:'var(--tx2)', fontWeight:700, letterSpacing:'.08em' }}>ADMIN PANEL</div>
        {navItems.map(([id,em,label])=>(
          <div key={id} onClick={()=>setTab(id)} style={{ ...s.sbLink, background:tab===id?'rgba(95,122,219,.13)':'transparent', color:tab===id?'var(--acc2)':'var(--tx2)' }}>{em} {label}</div>
        ))}
        <div style={{ marginTop:'auto', borderTop:'1px solid var(--bd)', paddingTop:12 }}>
          <div style={{ ...s.sbLink }} onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflow:'hidden', overflowY:'auto' }}>
        {/* Mobile tabs */}
        <div style={{ display:'flex', gap:4, padding:'14px 16px', borderBottom:'1px solid var(--bd)', overflowX:'auto' }} className="show-mobile-only">
          {navItems.map(([id,em,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:'7px 13px', borderRadius:'var(--r2)', border:'none', background:tab===id?'rgba(95,122,219,.15)':'transparent', color:tab===id?'var(--acc2)':'var(--tx2)', fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>{em} {label}</button>
          ))}
        </div>
        <div style={{ padding:'clamp(18px,3vw,32px)' }}>
          {tab==='overview' && (
            <>
              <h2 className="sora" style={{ fontSize:'clamp(18px,2.5vw,22px)', fontWeight:700, marginBottom:20 }}>Overview</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'clamp(10px,1.5vw,18px)', marginBottom:22 }}>
                {[{label:'Order Hari Ini',val:'47',ch:'+12%',c:'var(--acc)'},{label:'Pendapatan',val:'Rp48.2jt',ch:'+8.3%',c:'var(--ok)'},{label:'Driver Aktif',val:'23',ch:'+3',c:'var(--warn)'},{label:'Rating Avg',val:'4.87 ⭐',ch:'+0.02',c:'var(--acc2)'}].map(st=>(
                  <div key={st.label} style={{ background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r)', padding:'clamp(14px,2vw,22px)' }}>
                    <div style={{ fontSize:11, color:'var(--tx2)', marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>{st.label}</div>
                    <div className="sora" style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:700, color:st.c }}>{st.val}</div>
                    <div style={{ fontSize:11, color:'var(--ok)', marginTop:4 }}>{st.ch}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap:18, marginBottom:22 }}>
                <div style={{ ...s.card, ...s.cardP }}>
                  <h3 className="sora" style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Order Per Minggu</h3>
                  <div style={{ height:130, display:'flex', alignItems:'flex-end', gap:6 }}>
                    {[42,65,48,78,92,58,85].map((h,i)=>(
                      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                        <div style={{ width:'100%', background:'linear-gradient(180deg,var(--acc),rgba(95,122,219,.2))', borderRadius:'4px 4px 0 0', height:Math.round(h*1.3) }} />
                        <span style={{ fontSize:9, color:'var(--tx2)' }}>{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...s.card, ...s.cardP }}>
                  <h3 className="sora" style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Distribusi Layanan</h3>
                  {[['Lite Move',28,'var(--ok)'],['Regular Move',52,'var(--acc)'],['Full Service',20,'var(--warn)']].map(([l,p,c])=>(
                    <div key={l} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13 }}><span style={{ color:'var(--tx2)' }}>{l}</span><span style={{ fontWeight:600 }}>{p}%</span></div>
                      <div className="prog"><div className="prog-f" style={{ width:`${p}%`, background:c }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...s.card, ...s.cardP }}>
                <h3 className="sora" style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Order Terbaru</h3>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr>{['ID','Customer','Rute','Driver','Status','Total'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'var(--tx2)', borderBottom:'1px solid var(--bd)', fontWeight:600, whiteSpace:'nowrap', letterSpacing:'.04em', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                    <tbody>{orders.slice(0,5).map(o=>(
                      <tr key={o.id}>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--acc)', fontWeight:600 }}>{o.id}</td>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.user}</td>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{o.from}→{o.to}</td>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.driver}</td>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><Badge status={o.status} /></td>
                        <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', fontWeight:600 }}>{o.price}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {tab==='orders' && (
            <div style={{ ...s.card, ...s.cardP }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                <span style={{ fontSize:14, color:'var(--tx2)' }}>Total: 1.284 order</span>
                <div style={{ display:'flex', gap:8 }}><input style={{...s.inp, width:160, padding:'8px 12px', fontSize:13}} placeholder="Cari..." /><button style={{...s.btnG,...s.btnSm}}>Filter</button></div>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['ID','Customer','Rute','Driver','Status','Total','Aksi'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'var(--tx2)', borderBottom:'1px solid var(--bd)', fontWeight:600, whiteSpace:'nowrap', letterSpacing:'.04em', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{orders.map(o=>(
                    <tr key={o.id}>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--acc)', fontWeight:600 }}>{o.id}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.user}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{o.from}→{o.to}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{o.driver}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><Badge status={o.status} /></td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', fontWeight:600 }}>{o.price}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><button style={{...s.btnG,...s.btnSm}}>Detail</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          {tab==='drivers' && (
            <div style={{ ...s.card, ...s.cardP }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                <span style={{ fontSize:14, color:'var(--tx2)' }}>{drivers.length} driver terdaftar</span>
                <button style={{...s.btnP,...s.btnSm}}>+ Tambah Driver</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
                {drivers.map(d=>(
                  <div key={d.name} style={{ ...s.card, ...s.cardP, borderRadius:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 }}>{d.name[0]}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{d.name}</div>
                        <div style={{ fontSize:12, color:'var(--tx2)' }}>{d.veh}</div>
                        <Badge status={d.status} />
                      </div>
                    </div>
                    {[['Trip',d.trips],['Penghasilan',d.earn],['Rating',`⭐ ${d.rating}`]].map(([k,v])=>(
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:'1px solid var(--bd)', fontSize:13 }}>
                        <span style={{ color:'var(--tx2)' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                    <button style={{...s.btnG,...s.btnSm, width:'100%', marginTop:12}}>Assign Order</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='customers' && (
            <div style={{ ...s.card, ...s.cardP }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                <span style={{ fontSize:14, color:'var(--tx2)' }}>{customers.length} customer terdaftar</span>
                <input style={{...s.inp, width:160, padding:'8px 12px', fontSize:13}} placeholder="Cari customer..." />
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Nama','Email','Total Order','Status','Aksi'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'var(--tx2)', borderBottom:'1px solid var(--bd)', fontWeight:600, whiteSpace:'nowrap', letterSpacing:'.04em', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>{customers.map(c=>(
                    <tr key={c.name}>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', fontWeight:500 }}>{c.name}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{c.email}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{c.orders}</td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><Badge status={c.status} /></td>
                      <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}><button style={{...s.btnG,...s.btnSm}}>Detail</button></td>
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

/* ── DRIVER DASHBOARD ── */
function DriverPage({ user }) {
  const [tab, setTab] = useState('orders');
  const orders = [
    {id:'MPD-2847',user:'Rizki Amalia',from:'Kos Jatinangor',to:'Kos Dipatiukur',dist:'4.2 KM',price:'Rp145.000',items:12},
    {id:'MPD-2850',user:'Dian Pratama',from:'Kos Sekeloa',to:'Kos Tubagus',dist:'2.8 KM',price:'Rp95.000',items:8},
  ];

  return (
    <div style={{ padding:'clamp(48px,8vw,96px) 0' }}>
      <div style={s.wrap}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:14 }}>
          <div>
            <h1 className="sora" style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:700 }}>Driver Panel</h1>
            <p style={{ color:'var(--tx2)', marginTop:4, fontSize:14 }}>Halo, {user?.name||'Driver'} 👋</p>
          </div>
          <span style={s.badgeOk}><span className="dot" style={{ marginRight:5 }} />Online</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'clamp(12px,2vw,22px)', marginBottom:28 }}>
          {[['Penghasilan Hari Ini','Rp285.000','var(--ok)'],['Trip Selesai','12 Trip','var(--acc)'],['Rating','4.9 ⭐','var(--warn)']].map(([l,v,c])=>(
            <div key={l} style={{ background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r)', padding:'clamp(14px,2vw,22px)' }}>
              <div style={{ fontSize:11, color:'var(--tx2)', marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>{l}</div>
              <div className="sora" style={{ fontSize:'clamp(20px,2.5vw,26px)', fontWeight:800, color:c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:22 }}>
          {[['orders','Order Masuk'],['history','Riwayat'],['earning','Penghasilan']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'9px 18px', borderRadius:'var(--r2)', border:'none', background:tab===t?'rgba(95,122,219,.15)':'transparent', color:tab===t?'var(--acc2)':'var(--tx2)', fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:14, cursor:'pointer', transition:'background .2s,color .2s' }}>{l}</button>
          ))}
        </div>
        {tab==='orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {orders.map(o=>(
              <div key={o.id} style={{ ...s.card, ...s.cardP }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, gap:12 }}>
                  <div>
                    <div style={{ fontSize:12, color:'var(--acc)', fontWeight:600, marginBottom:3 }}>{o.id}</div>
                    <div style={{ fontWeight:600, fontSize:15 }}>{o.user}</div>
                  </div>
                  <div className="sora" style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:800, color:'var(--ok)', whiteSpace:'nowrap' }}>{o.price}</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10, marginBottom:16 }}>
                  {[['📍 Dari',o.from],['🏠 Ke',o.to],['🛣️ Jarak',o.dist],['📦 Barang',`${o.items} item`]].map(([k,v])=>(
                    <div key={k}><div style={{ fontSize:11, color:'var(--tx2)' }}>{k}</div><div style={{ fontSize:13, fontWeight:500, marginTop:2 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <button style={{...s.btnP, flex:1, minWidth:120}}>✓ Terima Order</button>
                  <button style={{...s.btnG, padding:'12px 18px'}}>Tolak</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='history' && (
          <div style={{ ...s.card, ...s.cardP }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr>{['Order ID','Customer','Rute','Tgl','Total'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'var(--tx2)', borderBottom:'1px solid var(--bd)', fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                <tbody>{[
                  ['MPD-2840','Rizki A.','Jatinangor→Dago','14 Jan','Rp95.000'],
                  ['MPD-2835','Bima P.','Sekeloa→Cisitu','12 Jan','Rp65.000'],
                  ['MPD-2830','Maya P.','Lembang→Hegarmanah','10 Jan','Rp145.000'],
                ].map(([id,u,r,d,p])=>(
                  <tr key={id}>
                    <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--acc)', fontWeight:600 }}>{id}</td>
                    <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)' }}>{u}</td>
                    <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{r}</td>
                    <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', color:'var(--tx2)' }}>{d}</td>
                    <td style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--bd)', fontWeight:600 }}>{p}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        {tab==='earning' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap:18 }}>
            <div style={{ ...s.card, ...s.cardP }}>
              <h3 className="sora" style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Penghasilan Mingguan</h3>
              <div style={{ height:130, display:'flex', alignItems:'flex-end', gap:6 }}>
                {[45,62,38,80,55,70,90].map((h,i)=>(
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div style={{ width:'100%', background:'linear-gradient(180deg,var(--ok),rgba(62,207,160,.2))', borderRadius:'4px 4px 0 0', height:Math.round(h*1.3) }} />
                    <span style={{ fontSize:9, color:'var(--tx2)' }}>{['S','S','R','K','J','S','M'][i]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, paddingTop:14, borderTop:'1px solid var(--bd)' }}>
                <span style={{ fontSize:14, color:'var(--tx2)' }}>Total Minggu Ini</span>
                <span className="sora" style={{ fontWeight:700, fontSize:18, color:'var(--ok)' }}>Rp1.285.000</span>
              </div>
            </div>
            <div style={{ ...s.card, ...s.cardP }}>
              <h3 className="sora" style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Ringkasan</h3>
              {[['Hari Ini','Rp285.000'],['Minggu Ini','Rp1.285.000'],['Bulan Ini','Rp4.200.000'],['Total Trip','142 trip'],['Rating','4.9/5.0']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--bd)', fontSize:14 }}>
                  <span style={{ color:'var(--tx2)' }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CUSTOMER DASHBOARD ── */
function CustomerPage({ user, onNavigate }) {
  const [tab, setTab] = useState('home');
  const [stars, setStars] = useState(0);
  const orders = [
    {id:'MPD-2847',date:'15 Jan 2025',from:'Jatinangor',to:'Dipatiukur',status:'Aktif',price:'Rp145.000'},
    {id:'MPD-2801',date:'10 Jan 2025',from:'Sekeloa',to:'Dago',status:'Selesai',price:'Rp95.000'},
    {id:'MPD-2755',date:'3 Jan 2025',from:'Lembang',to:'Hegarmanah',status:'Selesai',price:'Rp185.000'},
  ];

  return (
    <div style={{ padding:'clamp(48px,8vw,96px) 0' }}>
      <div style={s.wrap}>
        <div style={{ ...s.card, ...s.cardP, marginBottom:22, display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#5F7ADB,#7B92E8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:26, flexShrink:0 }}>{(user?.name||'U')[0]}</div>
          <div style={{ flex:1, minWidth:180 }}>
            <div className="sora" style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700 }}>{user?.name||'Pengguna'}</div>
            <div style={{ fontSize:14, color:'var(--tx2)' }}>{user?.email||'user@email.com'}</div>
            <div style={{ fontSize:12, color:'var(--ok)', marginTop:3 }}>✓ Akun Terverifikasi</div>
          </div>
          <button style={{...s.btnG,...s.btnSm}}>Edit Profil</button>
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:22, flexWrap:'wrap' }}>
          {[['home','🏠 Beranda'],['orders','📦 Riwayat'],['tracking','📍 Tracking'],['review','⭐ Review']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'9px 18px', borderRadius:'var(--r2)', border:'none', background:tab===t?'rgba(95,122,219,.15)':'transparent', color:tab===t?'var(--acc2)':'var(--tx2)', fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:14, cursor:'pointer' }}>{l}</button>
          ))}
        </div>
        {tab==='home' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'clamp(12px,2vw,22px)', marginBottom:22 }}>
              {[['Total Order','4 Order','var(--acc)'],['Sedang Aktif','1 Order','var(--ok)'],['Rating Diberikan','2 Review','var(--warn)'],['Penghematan','Rp45rb','var(--acc2)']].map(([l,v,c])=>(
                <div key={l} style={{ background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r)', padding:'clamp(14px,2vw,22px)' }}>
                  <div style={{ fontSize:11, color:'var(--tx2)', marginBottom:6 }}>{l}</div>
                  <div className="sora" style={{ fontSize:'clamp(18px,2.5vw,22px)', fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:22 }}>
              {[['📦','Buat Order','Pindahan baru','booking'],['📍','Lacak Barang','Cek status','tracking'],['💬','Chat Driver','Hubungi driver','tracking'],['⭐','Beri Review','Rate pindahan','review']].map(([em,t,d,pg])=>(
                <div key={t} style={{ ...s.card, ...s.cardP, textAlign:'center', cursor:'pointer' }} onClick={()=>pg==='review'?setTab('review'):onNavigate(pg)}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(95,122,219,.32)';e.currentTarget.style.transform='translateY(-3px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bd)';e.currentTarget.style.transform='none';}}>
                  <div style={{ fontSize:32, marginBottom:10 }}>{em}</div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:12, color:'var(--tx2)' }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, ...s.cardP }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <h3 className="sora" style={{ fontSize:15, fontWeight:700 }}>Order Terakhir</h3>
                <button onClick={()=>setTab('orders')} style={{ padding:'7px 14px', borderRadius:'var(--r2)', border:'none', background:'rgba(95,122,219,.15)', color:'var(--acc2)', fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:13, cursor:'pointer' }}>Lihat Semua</button>
              </div>
              {orders.slice(0,2).map(o=>(
                <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--bd)', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ fontSize:12, color:'var(--acc)', fontWeight:600, marginBottom:3 }}>{o.id} · {o.date}</div>
                    <div style={{ fontWeight:500 }}>{o.from} → {o.to}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span className="sora" style={{ fontWeight:700 }}>{o.price}</span>
                    <Badge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab==='orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {orders.map(o=>(
              <div key={o.id} style={{ ...s.card, ...s.cardP, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:12, color:'var(--acc)', fontWeight:600, marginBottom:3 }}>{o.id} · {o.date}</div>
                  <div style={{ fontWeight:500 }}>{o.from} → {o.to}</div>
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
                  <span className="sora" style={{ fontWeight:700 }}>{o.price}</span>
                  <Badge status={o.status} />
                  <button style={{...s.btnG,...s.btnSm}}>Detail</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='tracking' && <TrackingPage />}
        {tab==='review' && (
          <div style={{ ...s.card, ...s.cardP, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>⭐</div>
            <h3 className="sora" style={{ fontSize:17, fontWeight:600, marginBottom:8 }}>Beri Review</h3>
            <p style={{ color:'var(--tx2)', marginBottom:22, fontSize:14 }}>Bantu pengguna lain dengan review jujurmu</p>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20, fontSize:36 }}>
              {[1,2,3,4,5].map(i=>(
                <span key={i} onClick={()=>setStars(i)} style={{ cursor:'pointer', color: i<=stars?'#F5A623':'var(--bd)', transition:'color .2s' }}>★</span>
              ))}
            </div>
            <textarea style={{...s.inp, maxWidth:400, margin:'0 auto 16px', display:'block', resize:'vertical', minHeight:80}} placeholder="Ceritakan pengalamanmu..." />
            <div style={{ display:'flex', justifyContent:'center' }}><button style={s.btnP}>Kirim Review</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ABOUT PAGE ── */
function AboutPage({ onNavigate }) {
  return (
    <div style={{ padding:'clamp(48px,8vw,96px) 0' }}>
      <div style={s.wrap}>
        <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center', marginBottom:'clamp(40px,5vw,64px)' }}>
          <div style={{ ...s.pill, marginBottom:20 }}>Tentang Kami</div>
          <h1 className="sora" style={{ fontSize:'clamp(28px,5.5vw,60px)', fontWeight:800, lineHeight:1.12, letterSpacing:'-.02em', marginBottom:20 }}>Pindahan Kos<br /><span className="grad">Tanpa Ribet.</span></h1>
          <p style={{ fontSize:'clamp(15px,1.5vw,18px)', lineHeight:1.78, color:'var(--tx2)' }}>MagerPindah adalah platform logistik khusus mahasiswa yang menggabungkan kemudahan ride-hailing dengan kebutuhan pindahan kos. Didirikan 2024, kami telah membantu 12.000+ mahasiswa.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:18, marginBottom:40 }}>
          {[['🛡️','Aman & Terpercaya','Driver terverifikasi & asuransi barang'],['⚡','Cepat & Mudah','Pesan dalam 3 menit'],['💰','Harga Transparan','Tanpa biaya tersembunyi'],['📍','Tracking Realtime','Pantau dari mana saja']].map(([em,t,d])=>(
            <div key={t} style={{ background:'var(--bg2)', border:'1px solid var(--bd)', borderRadius:'var(--r)', padding:'clamp(16px,2vw,24px)', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{em}</div>
              <div className="sora" style={{ fontSize:15, fontWeight:700, marginBottom:7 }}>{t}</div>
              <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(95,122,219,.14) 0%,rgba(95,122,219,.04) 100%)', border:'1px solid rgba(95,122,219,.22)', borderRadius:22, textAlign:'center', padding:'clamp(40px,6vw,72px) clamp(24px,5vw,80px)', position:'relative', overflow:'hidden' }}>
            <h2 className="sora" style={{ fontSize:'clamp(22px,3.5vw,42px)', fontWeight:700, marginBottom:14 }}>Mulai Pindahan Sekarang</h2>
            <p style={{ fontSize:'clamp(15px,1.5vw,18px)', color:'var(--tx2)', marginBottom:28, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>Bergabung dengan ribuan mahasiswa yang sudah merasakan kemudahan MagerPindah</p>
            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <button style={s.btnP} onClick={()=>onNavigate('register')}>Daftar Gratis →</button>
              <button style={s.btnG} onClick={()=>onNavigate('booking')}>Simulasi Harga</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── RESPONSIVE STYLE TAG ── */
const RESPONSIVE_CSS = `
@media(max-width:1024px){ .hide-mobile-nav{display:none!important} .show-mobile-only{display:flex!important} }
@media(min-width:1025px){ .show-mobile-only{display:none!important} }
@media(max-width:640px){ .hide-xs{display:none!important} }
.inp:focus { border-color: rgba(95,122,219,.55) !important; box-shadow: 0 0 0 3px rgba(95,122,219,.1) !important; }
`;

/* ── ROOT APP ── */
export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  function navigate(p) { setPage(p); window.scrollTo({top:0}); }
  function handleLogin(u) {
    setUser(u);
    navigate(u.role==='admin'?'admin':u.role==='driver'?'driver':'customer');
  }
  function handleLogout() { setUser(null); navigate('home'); }

  return (
    <>
      <style>{GLOBAL_CSS + RESPONSIVE_CSS}</style>
      <Navbar page={page} user={user} onNavigate={navigate} onLogout={handleLogout} />
      <div style={{ paddingTop:62 }}>
        {page==='home'     && <HomePage onNavigate={navigate} />}
        {page==='login'    && <AuthPage mode="login" onNavigate={navigate} onLogin={handleLogin} />}
        {page==='register' && <AuthPage mode="register" onNavigate={navigate} onLogin={handleLogin} />}
        {page==='booking'  && <BookingPage onNavigate={navigate} />}
        {page==='tracking' && <TrackingPage />}
        {page==='report'   && <ReportPage />}
        {page==='admin'    && <AdminPage user={user} onNavigate={navigate} onLogout={handleLogout} />}
        {page==='driver'   && <DriverPage user={user} />}
        {page==='customer' && <CustomerPage user={user} onNavigate={navigate} />}
        {page==='about'    && <AboutPage onNavigate={navigate} />}
      </div>
    </>
  );
}
