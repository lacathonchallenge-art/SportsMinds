// ───────── Top navigation: sticky, condenses on scroll, hamburger on small ─────────

function Nav({ accent }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const items = [
    { label: 'Accueil', href: '#home' },
    { label: 'Qui sommes-nous', href: '#about' },
    { label: 'Expertises', href: '#expertises' },
    { label: 'Événements & productions', href: '#events' },
    { label: 'Contact', href: '#contact' },
  ];

  const wrap = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    padding: scrolled ? '12px 40px' : '22px 56px',
    transition: 'all .35s ease',
    background: scrolled ? 'rgba(0,0,3,.78)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
  };

  return (
    <React.Fragment>
      <nav style={wrap}>
        <a href="#home" aria-label="Sports Minds — Accueil" style={{display:'inline-flex',alignItems:'center'}}>
          <Logomark/>
        </a>

        {/* Desktop menu */}
        <ul className="nav-desktop" style={{display:'flex',gap:0,listStyle:'none',margin:0,padding:0}}>
          {items.map((it)=>(
            <li key={it.label}>
              <a href={it.href} className="oswald" style={{
                fontSize:12,fontWeight:500,padding:'10px 16px',
                color:'rgba(255,255,255,.78)',transition:'color .2s ease',display:'inline-block'
              }}
              onMouseEnter={(e)=>e.currentTarget.style.color='var(--white)'}
              onMouseLeave={(e)=>e.currentTarget.style.color='rgba(255,255,255,.78)'}
              >{it.label}</a>
            </li>
          ))}
        </ul>

        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <a href="#contact" className="nav-cta" style={{
            display:'inline-flex',alignItems:'center',gap:10,padding:'12px 18px',
            background:accent,color:'var(--ink)',fontFamily:"'Oswald',sans-serif",fontWeight:600,
            fontSize:12,letterSpacing:'.1em',textTransform:'uppercase',
          }}>Lancer un projet <Arrow size={12}/></a>

          {/* Hamburger button (mobile/tablet) */}
          <button
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="nav-burger"
            style={{
              display:'none', /* shown via CSS at ≤1024 */
              width:44, height:44, border:'1px solid rgba(255,255,255,.25)',
              background:'rgba(0,0,3,.55)', backdropFilter:'blur(8px)',
              cursor:'pointer', padding:0, position:'relative',
            }}
          >
            <Bars open={open}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        aria-hidden={!open}
        className="nav-overlay"
        style={{
          position:'fixed', inset:0, zIndex:49,
          background:`
            radial-gradient(ellipse at top right, rgba(3,62,125,.55) 0%, transparent 55%),
            radial-gradient(ellipse at bottom left, rgba(240,148,62,.18) 0%, transparent 50%),
            linear-gradient(180deg, #000003 0%, #00060f 100%)
          `,
          backdropFilter:'blur(20px)',
          padding:'88px 24px 28px',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition:'transform .4s cubic-bezier(.2,.7,.2,1), opacity .35s ease',
          overflowY:'auto',
        }}>
        {/* Tagline strip */}
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          padding:'10px 12px',marginBottom:24,
          border:'1px solid rgba(255,255,255,.12)',
          background:'rgba(3,62,125,.30)',
        }}>
          <span style={{width:8,height:8,background:accent,borderRadius:'50%',animation:'pulse-ring 2s infinite'}}/>
          <span className="label" style={{color:'rgba(255,255,255,.85)',fontSize:10}}>
            SPORT <span style={{color:accent}}>/</span> MÉDIA <span style={{color:accent}}>/</span> ÉVÉNEMENTIEL
          </span>
        </div>

        <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:0,flex:1}}>
          {items.map((it,i)=>(
            <li key={it.label} style={{borderBottom:'1px solid rgba(255,255,255,.10)'}}>
              <a
                href={it.href}
                onClick={()=>setOpen(false)}
                className="oswald nav-mobile-link"
                style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'18px 4px',color:'var(--white)',
                  fontSize:22,fontWeight:600,letterSpacing:'.04em',
                  textTransform:'uppercase',position:'relative',
                }}>
                <span style={{display:'flex',alignItems:'center',gap:14}}>
                  <span style={{
                    display:'inline-flex',alignItems:'center',justifyContent:'center',
                    width:28,height:28,background:'#033e7d',color:'var(--white)',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.05em',
                  }}>0{i+1}</span>
                  {it.label}
                </span>
                <span style={{color:accent,display:'inline-flex'}}>
                  <Arrow size={14}/>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Contact panel */}
        <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:14}}>
          <div style={{
            display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,
            padding:'14px 16px',
            background:'rgba(3,62,125,.28)',
            border:'1px solid rgba(3,62,125,.55)',
          }}>
            <div>
              <div className="label" style={{color:accent,fontSize:9,marginBottom:6}}>EMAIL</div>
              <a href="mailto:hello@sportsminds.ma" className="oswald" style={{color:'var(--white)',fontSize:12,fontWeight:500}}>hello@sportsminds.ma</a>
            </div>
            <div>
              <div className="label" style={{color:accent,fontSize:9,marginBottom:6}}>TEL.</div>
              <a href="tel:+212522000000" className="oswald" style={{color:'var(--white)',fontSize:12,fontWeight:500}}>+212 522 00 00 00</a>
            </div>
          </div>

          <a href="#contact" onClick={()=>setOpen(false)} style={{
            display:'inline-flex',alignItems:'center',justifyContent:'space-between',gap:10,
            padding:'16px 18px',background:accent,color:'var(--ink)',
            fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.12em',
            textTransform:'uppercase',
          }}>
            <span>Lancer un projet</span>
            <Arrow size={14}/>
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}

function Bars({ open }) {
  const bar = {position:'absolute',left:12,right:12,height:2,background:'var(--white)',transition:'transform .3s ease, opacity .2s ease, top .3s ease'};
  return (
    <React.Fragment>
      <span style={{...bar, top: open ? 21 : 14, transform: open ? 'rotate(45deg)' : 'none'}}/>
      <span style={{...bar, top: 21, opacity: open ? 0 : 1}}/>
      <span style={{...bar, top: open ? 21 : 28, transform: open ? 'rotate(-45deg)' : 'none'}}/>
    </React.Fragment>
  );
}

function Logomark() {
  return (
    <img
      src="sportsmindslogo.jpeg"
      alt="Sports Minds"
      style={{display:'block',height:40,width:'auto'}}
    />
  );
}

Object.assign(window, { Nav });
