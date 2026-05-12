// ───────── Events showcase — featured + filterable grid + modal ─────────

const EV_FOOTBALL  = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80';
const EV_BASKET    = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80';
const EV_ATHLE     = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80';
const EV_TENNIS    = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80';
const EV_STADIUM   = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80';

const EVENTS = [
  {
    name:'Danone Nations Cup', cat:'Football',     scope:'Tournoi international jeunesse', edition:'15 éditions', loc:'Casablanca', year:'depuis 2010', featured:true,
    image: EV_FOOTBALL,
    description: "Tournoi international de football U-12 réunissant chaque année plus de 2.5 millions d'enfants dans 32 pays. Sports Minds orchestre la production locale et internationale depuis la phase nationale jusqu'à la finale mondiale.",
    highlights:['Production live multi-caméras','Activation Danone sur 25+ écoles','Cérémonies d\'ouverture et clôture','Couverture média nationale'],
    gallery:[EV_FOOTBALL, EV_STADIUM, EV_ATHLE, EV_BASKET],
  },
  {
    name:'Grand Prix Hassan II', cat:'Tennis',      scope:'ATP 250 Marrakech',              edition:'OPS · prod TV', loc:'Marrakech',       year:'2019–2024',
    image: EV_TENNIS,
    description: "Tournoi ATP 250 historique du circuit professionnel masculin, organisé chaque printemps sur terre battue. Sports Minds gère l'opérationnel sur site et la captation TV pour les diffuseurs internationaux.",
    highlights:['Captation 8 caméras live','Operations hospitalité VIP','Habillage antenne ATP Media','Plateau d\'analyse quotidien'],
    gallery:[EV_TENNIS, EV_STADIUM, EV_ATHLE],
  },
  {
    name:'Marathon des Sables', cat:'Ultra-trail', scope:'250km dans le désert',           edition:'Activation marques', loc:'Sud Maroc',     year:'2018',
    image: EV_ATHLE,
    description: "L'ultra-trail le plus exigeant au monde — 250km en autosuffisance dans le désert marocain. Sports Minds y a déployé une activation de marque conçue autour du dépassement de soi et de l'engagement physique.",
    highlights:['Présence terrain sur 6 étapes','Captation drone et POV','Brand storytelling cross-média','Interviews coureurs en live'],
    gallery:[EV_ATHLE, EV_STADIUM, EV_FOOTBALL],
  },
  {
    name:'Marathon de Casablanca', cat:'Running',  scope:'30 000+ coureurs',               edition:'Production globale', loc:'Casablanca',    year:'2021–2024',
    image: EV_ATHLE,
    description: "Plus grand marathon urbain du royaume avec plus de 30 000 participants sur 4 distances (5km, 10km, semi, marathon). Sports Minds prend en charge la production complète : scénographie, parcours, captation, animations live.",
    highlights:['Coordination 30k+ inscrits','15 km de parcours urbain habillé','3 plateaux TV mobiles','Cérémonie podium en prime-time'],
    gallery:[EV_ATHLE, EV_STADIUM, EV_FOOTBALL, EV_BASKET],
  },
  {
    name:'Lacoste Cup Morocco', cat:'Golf/Tennis', scope:'Hospitality & retail activation',edition:'Brand experience', loc:'Rabat',            year:'2022',
    image: EV_TENNIS,
    description: "Évènement hospitality haut de gamme combinant exhibition tennis, retail activation et expérience VIP autour de la marque Lacoste. Conçu de A à Z par Sports Minds en partenariat avec les équipes marketing France.",
    highlights:['Village brand experience 2 000m²','Match exhibition pros + amateurs','Pop-up store retail exclusif','Couverture social & PR'],
    gallery:[EV_TENNIS, EV_FOOTBALL, EV_STADIUM],
  },
  {
    name:'CFAO Summer Drive',  cat:'Auto',         scope:'Tour des plages',                edition:'Road show',          loc:'7 villes',         year:'2023',
    image: EV_STADIUM,
    description: "Road show estival du groupe CFAO sur les principales stations balnéaires marocaines. Mise en scène des dernières gammes automobiles dans un dispositif lifestyle et famille.",
    highlights:['7 étapes en 6 semaines','Dispositif lifestyle plage','Animations enfants & DJ sets','Test drive sur circuit éphémère'],
    gallery:[EV_STADIUM, EV_FOOTBALL, EV_TENNIS],
  },
  {
    name:'Tournoi Nojoum Douars', cat:'Football',  scope:'Sport & impact social',          edition:'Programme national', loc:'Maroc rural',     year:'depuis 2019',
    image: EV_FOOTBALL,
    description: "Programme national de détection et de soutien aux jeunes talents issus du monde rural. Tournoi inter-douars avec plus de 500 équipes inscrites chaque saison, sponsorisé par les institutions et acteurs locaux.",
    highlights:['500+ équipes engagées','Bourses & équipements offerts','Stages avec entraîneurs nationaux','Documentaire de saison'],
    gallery:[EV_FOOTBALL, EV_STADIUM, EV_ATHLE],
  },
  {
    name:'Jet Ski Casablanca', cat:'Nautique',     scope:'Compétition côtière',            edition:'Captation TV',       loc:'Ain Diab',         year:'2024',
    image: EV_STADIUM,
    description: "Compétition de jet ski sur la côte casablancaise — captation multi-caméras dont drone et caméras embarquées. Diffusion plateau sur les chaînes nationales et plateformes sociales.",
    highlights:['Captation drone & embarquée','Live streaming social','Plateau d\'analyse en bord d\'eau','Habillage TV sur-mesure'],
    gallery:[EV_STADIUM, EV_ATHLE, EV_BASKET],
  },
];

const CATS = ['Tous','Football','Tennis','Running','Auto','Nautique','Ultra-trail','Golf/Tennis'];

function Events({ accent }) {
  const [active, setActive] = React.useState('Tous');
  const [openEv, setOpenEv] = React.useState(null);
  const list = EVENTS.filter(e => active === 'Tous' || e.cat === active);
  const featured = EVENTS.find(e => e.featured);

  return (
    <Section id="events" dark padY={50} style={{background:'#04060c'}}>
      <CornerGlow color="rgba(0,63,126,.5)" position="bl" size={800}/>

      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:56,gap:32,flexWrap:'wrap',position:'relative'}}>
        <div>
          <Eyebrow num="04" accent={accent}>ÉVÉNEMENTS MARQUANTS</Eyebrow>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase',maxWidth:1100}}>
            Le terrain,<br/>de la première<br/><span style={{color:accent}}>esquisse</span> au coup<br/>de sifflet final.
          </Reveal>
        </div>
        <Reveal delay={2}>
          {/* Filter chips */}
          <div style={{display:'flex',flexWrap:'wrap',gap:6,maxWidth:520,justifyContent:'flex-end'}}>
            {CATS.map(c=>(
              <button key={c}
                onClick={()=>setActive(c)}
                className="oswald"
                style={{
                  padding:'8px 14px',fontSize:12,letterSpacing:'.08em',
                  background: active===c ? accent : 'transparent',
                  color: active===c ? 'var(--ink)' : 'rgba(255,255,255,.7)',
                  border:`1px solid ${active===c?accent:'var(--line-strong)'}`,
                  cursor:'pointer',transition:'all .2s ease',
                }}>{c}</button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Featured row: big card + 2 stacked */}
      <Reveal delay={3}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:1,background:'var(--line)',border:'1px solid var(--line)',marginBottom:1}}>
          <FeaturedEvent ev={featured} accent={accent} onOpen={() => setOpenEv(featured)}/>
          <div style={{display:'grid',gridTemplateRows:'1fr 1fr',gap:1,background:'var(--line)'}}>
            {EVENTS.slice(1,3).map(e => <EventCard key={e.name} ev={e} accent={accent} small onOpen={() => setOpenEv(e)}/>)}
          </div>
        </div>
      </Reveal>

      {/* Filtered grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'var(--line)',border:'1px solid var(--line)',borderTop:'none'}}>
        {list.slice(featured ? 3 : 0).map((e,i)=>(
          <Reveal key={e.name} delay={(i%4)+1}>
            <EventCard ev={e} accent={accent} onOpen={() => setOpenEv(e)}/>
          </Reveal>
        ))}
      </div>

      {/* Footer link */}
      <div style={{marginTop:40,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="label" style={{color:'rgba(255,255,255,.5)'}}>
          {list.length} événement{list.length>1?'s':''} affiché{list.length>1?'s':''} · {EVENTS.length} au catalogue
        </div>
        <a href="#" className="oswald" style={{color:accent,fontSize:13,letterSpacing:'.1em',display:'inline-flex',alignItems:'center',gap:10}}>
          Voir tout le portfolio <Arrow size={14}/>
        </a>
      </div>

      <EventModal ev={openEv} accent={accent} onClose={() => setOpenEv(null)}/>
    </Section>
  );
}

function FeaturedEvent({ ev, accent, onOpen }) {
  if (!ev) return null;
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        position:'relative',background:'var(--ink)',minHeight:520,overflow:'hidden',cursor:'pointer',
      }}>
      <div aria-hidden style={{
        position:'absolute',inset:0,
        backgroundImage:`url(${ev.image})`,backgroundSize:'cover',backgroundPosition:'center',
        transform: hover ? 'scale(1.04)' : 'scale(1)', transition:'transform 1.2s cubic-bezier(.2,.7,.2,1)',
      }}/>
      <div style={{
        position:'absolute',inset:0,
        background:`linear-gradient(180deg, rgba(0,0,3,0) 30%, rgba(0,0,3,.92) 100%), linear-gradient(45deg, rgba(0,63,126,${hover?0.55:0.25}) 0%, transparent 60%)`,
        transition:'background .4s ease',
      }}/>
      <div style={{position:'absolute',top:24,left:24,right:24,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <span className="label" style={{padding:'6px 10px',background:accent,color:'var(--ink)'}}>★ FLAGSHIP CASE</span>
        <span className="label" style={{color:'var(--white)'}}>{ev.year}</span>
      </div>
      <div style={{position:'absolute',left:32,right:32,bottom:32}}>
        <div className="label" style={{color:accent,marginBottom:14}}>{ev.cat.toUpperCase()} · {ev.loc.toUpperCase()}</div>
        <h3 className="display" style={{
          fontSize:64,margin:0,textTransform:'uppercase',lineHeight:.95,
        }}>{ev.name}</h3>
        <div style={{display:'flex',gap:24,marginTop:18,alignItems:'center',flexWrap:'wrap'}}>
          <span style={{fontSize:14,color:'rgba(255,255,255,.85)'}}>{ev.scope}</span>
          <span style={{width:4,height:4,background:'rgba(255,255,255,.4)',borderRadius:'50%'}}/>
          <span style={{fontSize:14,color:'rgba(255,255,255,.6)'}}>{ev.edition}</span>
        </div>
      </div>
      <div style={{
        position:'absolute',top:24,right:24,
        opacity: hover ? 1 : 0, transition:'opacity .3s ease',
      }}>
        <span className="label" style={{padding:'6px 10px',background:'rgba(0,0,3,.6)',border:'1px solid var(--line-strong)',color:'var(--white)',display:'inline-flex',alignItems:'center',gap:8}}>
          Voir le case <Arrow size={12}/>
        </span>
      </div>
    </div>
  );
}

function EventCard({ ev, accent, small, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        position:'relative',background:'var(--ink)',
        minHeight: small ? 259 : 320, overflow:'hidden', cursor:'pointer',
      }}>
      <div aria-hidden style={{
        position:'absolute',inset:0,opacity:.85,
        backgroundImage:`url(${ev.image})`,backgroundSize:'cover',backgroundPosition:'center',
        transition:'opacity .4s ease, transform .8s ease',transform:hover?'scale(1.04)':'scale(1)',
      }}/>
      <div style={{
        position:'absolute',inset:0,
        background: hover
          ? `linear-gradient(180deg, rgba(0,63,126,.35) 0%, rgba(0,0,3,.94) 100%)`
          : `linear-gradient(180deg, rgba(0,0,3,0) 30%, rgba(0,0,3,.88) 100%)`,
        transition:'background .4s ease',
      }}/>
      <div style={{position:'absolute',top:16,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
        <span className="label" style={{color:'rgba(255,255,255,.7)',padding:'3px 7px',border:'1px solid var(--line-strong)'}}>{ev.cat.toUpperCase()}</span>
        <span className="label" style={{color:'rgba(255,255,255,.45)'}}>{ev.year}</span>
      </div>
      <div style={{position:'absolute',left:18,right:18,bottom:18}}>
        <h4 className="display" style={{fontSize: small?32:30,margin:0,textTransform:'uppercase',lineHeight:.95}}>{ev.name}</h4>
        <div style={{fontSize:12,color:'rgba(255,255,255,.65)',marginTop:8,display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:6,height:6,background:accent,display:'inline-block'}}/>
          {ev.scope} · {ev.loc}
        </div>
        <div style={{
          marginTop:14,height:1,background:'rgba(255,255,255,.18)',position:'relative',overflow:'hidden',
        }}>
          <span style={{position:'absolute',inset:0,background:accent,transform:hover?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform .45s cubic-bezier(.2,.7,.2,1)'}}/>
        </div>
      </div>
      <div style={{
        position:'absolute',top:14,right:14,color:accent,
        opacity:hover?1:0,transform:hover?'translate(0,8px)':'translate(-6px,2px)',
        transition:'all .3s ease',
      }}>
        <CornerArrow size={20}/>
      </div>
    </div>
  );
}

function EventModal({ ev, accent, onClose }) {
  const isOpen = !!ev;
  const [lightboxIdx, setLightboxIdx] = React.useState(null);
  const lightboxOpen = lightboxIdx !== null;
  const gallery = ev?.gallery || [];

  // ESC close (closes lightbox first, then modal)
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxIdx(null);
        else onClose();
      } else if (lightboxOpen && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        const step = e.key === 'ArrowRight' ? 1 : -1;
        setLightboxIdx(i => (i + step + gallery.length) % gallery.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, lightboxOpen, onClose, gallery.length]);

  // Reset lightbox when modal closes/changes event
  React.useEffect(() => { setLightboxIdx(null); }, [ev]);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:100,
        background:'rgba(0,0,3,.82)', backdropFilter:'blur(14px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition:'opacity .3s ease',
        display:'flex', justifyContent:'center', alignItems:'flex-start',
        padding:'0', overflowY:'auto',
      }}>
      {ev && (
        <div
          onClick={(e)=>e.stopPropagation()}
          className="event-modal"
          style={{
            width:'100%', maxWidth:1400, background:'var(--ink)',
            color:'var(--white)', position:'relative',
            transform: isOpen ? 'translateY(0)' : 'translateY(24px)',
            transition:'transform .4s cubic-bezier(.2,.7,.2,1)',
            margin:'40px 0',
            border:'1px solid rgba(255,255,255,.12)',
          }}>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              position:'absolute', top:18, right:18, zIndex:5,
              width:44, height:44, border:'1px solid rgba(255,255,255,.25)',
              background:'rgba(0,0,3,.55)', backdropFilter:'blur(8px)',
              color:'var(--white)', cursor:'pointer', padding:0,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/></svg>
          </button>

          {/* Hero image */}
          <div style={{position:'relative', width:'100%', aspectRatio:'21/9', minHeight:280, overflow:'hidden'}}>
            <div aria-hidden style={{
              position:'absolute', inset:0,
              backgroundImage:`url(${ev.image})`,
              backgroundSize:'cover', backgroundPosition:'center',
            }}/>
            <div aria-hidden style={{
              position:'absolute', inset:0,
              background:`linear-gradient(180deg, rgba(0,0,3,.30) 0%, rgba(0,0,3,.92) 100%), linear-gradient(45deg, rgba(3,62,125,.35) 0%, transparent 55%)`,
            }}/>
            {/* Hero meta */}
            <div style={{position:'absolute', left:'5%', right:'5%', bottom:36}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18,flexWrap:'wrap'}}>
                <span className="label" style={{padding:'5px 10px',background:accent,color:'var(--ink)'}}>{ev.cat.toUpperCase()}</span>
                <span className="label" style={{padding:'5px 10px',background:'#033e7d',color:'var(--white)'}}>{ev.loc.toUpperCase()}</span>
                <span className="label" style={{padding:'5px 10px',border:'1px solid var(--line-strong)',color:'var(--white)'}}>{ev.year}</span>
                {ev.featured && <span className="label" style={{padding:'5px 10px',background:'rgba(255,255,255,.10)',border:'1px solid rgba(255,255,255,.25)',color:'var(--white)'}}>★ FLAGSHIP</span>}
              </div>
              <h2 className="display" style={{
                fontSize:'clamp(40px, 6vw, 88px)', margin:0,
                textTransform:'uppercase', lineHeight:.95, color:'var(--white)',
              }}>{ev.name}</h2>
              <div style={{display:'flex',gap:24,marginTop:14,alignItems:'center',flexWrap:'wrap',color:'rgba(255,255,255,.78)'}}>
                <span style={{fontSize:15}}>{ev.scope}</span>
                <span style={{width:4,height:4,background:'rgba(255,255,255,.4)',borderRadius:'50%'}}/>
                <span style={{fontSize:15}}>{ev.edition}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{padding:'48px 5% 32px',display:'grid',gridTemplateColumns:'1.4fr .8fr',gap:48}}>
            <div>
              <div className="label" style={{color:accent,marginBottom:14}}>RÉSUMÉ DU CASE</div>
              <p className="body-text" style={{color:'rgba(255,255,255,.88)',maxWidth:780,margin:0,lineHeight:1.65}}>
                {ev.description}
              </p>
            </div>
            <div style={{borderLeft:'1px solid rgba(255,255,255,.10)',paddingLeft:32}}>
              <div className="label" style={{color:'#a9c2e6',marginBottom:14}}>POINTS CLÉS</div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
                {(ev.highlights || []).map((h, i) => (
                  <li key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <span style={{
                      flexShrink:0,width:18,height:18,display:'inline-flex',alignItems:'center',justifyContent:'center',
                      background:'#033e7d',color:'var(--white)',fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                      marginTop:2,
                    }}>{String(i+1).padStart(2,'0')}</span>
                    <span className="body-text" style={{color:'rgba(255,255,255,.85)'}}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div style={{padding:'0 5% 48px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
                <div className="label" style={{color:accent}}>GALERIE</div>
                <div className="label" style={{color:'rgba(255,255,255,.4)'}}>{gallery.length} VISUELS · CLIQUEZ POUR AGRANDIR</div>
              </div>
              <div style={{
                display:'grid',
                gridTemplateColumns: `repeat(${Math.min(gallery.length, 4)}, 1fr)`,
                gap:6,
              }}>
                {gallery.map((src, i) => (
                  <GalleryTile key={i} src={src} index={i} accent={accent} onOpen={() => setLightboxIdx(i)}/>
                ))}
              </div>
            </div>
          )}

          {/* CTA footer */}
          <div style={{
            padding:'28px 5% 36px', borderTop:'1px solid rgba(255,255,255,.10)',
            display:'flex',justifyContent:'space-between',alignItems:'center',gap:24,flexWrap:'wrap',
            background:'rgba(3,62,125,.18)',
          }}>
            <div>
              <div className="oswald" style={{fontSize:18,fontWeight:600,color:'var(--white)'}}>Un projet similaire en tête&nbsp;?</div>
              <div className="body-text" style={{color:'rgba(255,255,255,.65)',marginTop:4}}>On vous prépare un brief en 48&nbsp;heures.</div>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              style={{
                display:'inline-flex',alignItems:'center',gap:10,padding:'14px 22px',
                background:accent,color:'var(--ink)',
                fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.12em',
                textTransform:'uppercase',
              }}>
              Lancer un projet <Arrow size={12}/>
            </a>
          </div>

          {/* Lightbox (inside modal so it inherits z-index above backdrop) */}
          <Lightbox
            open={lightboxOpen}
            src={lightboxOpen ? gallery[lightboxIdx] : null}
            index={lightboxIdx}
            total={gallery.length}
            accent={accent}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx(i => (i - 1 + gallery.length) % gallery.length)}
            onNext={() => setLightboxIdx(i => (i + 1) % gallery.length)}
          />
        </div>
      )}
    </div>
  );
}

function GalleryTile({ src, index, accent, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      aria-label={`Agrandir le visuel ${index + 1}`}
      style={{
        position:'relative', aspectRatio:'4/3', overflow:'hidden', cursor:'zoom-in',
        border: hover ? `1px solid ${accent}` : '1px solid rgba(255,255,255,.08)',
        padding:0, background:'#000',
        transition:'border-color .25s ease',
      }}>
      <span aria-hidden style={{
        position:'absolute', inset:0,
        backgroundImage:`url(${src})`, backgroundSize:'cover', backgroundPosition:'center',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition:'transform .6s cubic-bezier(.2,.7,.2,1)',
      }}/>
      <span aria-hidden style={{
        position:'absolute', inset:0,
        background: hover ? 'rgba(0,0,3,.18)' : 'rgba(0,0,3,0)',
        transition:'background .25s ease',
      }}/>
      <span aria-hidden style={{
        position:'absolute', right:10, top:10,
        width:28, height:28, display:'inline-flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,3,.55)', backdropFilter:'blur(6px)',
        color:'var(--white)', opacity: hover ? 1 : 0.55, transition:'opacity .25s ease',
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 5V2h3M10 7v3H7M2 7v3h3M10 5V2H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
        </svg>
      </span>
    </button>
  );
}

function Lightbox({ open, src, index, total, accent, onClose, onPrev, onNext }) {
  return (
    <div
      role="dialog"
      aria-hidden={!open}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:120,
        background:'rgba(0,0,3,.94)', backdropFilter:'blur(18px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition:'opacity .25s ease',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
      {open && src && (
        <React.Fragment>
          {/* Close */}
          <button
            onClick={(e)=>{e.stopPropagation();onClose();}}
            aria-label="Fermer le visuel"
            style={{
              position:'fixed', top:20, right:20, zIndex:2,
              width:44, height:44, border:'1px solid rgba(255,255,255,.25)',
              background:'rgba(0,0,3,.55)', backdropFilter:'blur(8px)',
              color:'var(--white)', cursor:'pointer', padding:0,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/></svg>
          </button>

          {/* Counter */}
          <div style={{
            position:'fixed', top:24, left:24, zIndex:2,
            padding:'8px 12px', background:'rgba(0,0,3,.55)',
            border:'1px solid rgba(255,255,255,.18)',
          }}>
            <span className="label" style={{color:'var(--white)',fontSize:10}}>
              <span style={{color:accent}}>{String(index + 1).padStart(2,'0')}</span> / {String(total).padStart(2,'0')}
            </span>
          </div>

          {/* Prev / Next */}
          {total > 1 && (
            <React.Fragment>
              <LightboxNav direction="prev" onClick={onPrev}/>
              <LightboxNav direction="next" onClick={onNext}/>
            </React.Fragment>
          )}

          {/* Image */}
          <img
            src={src}
            alt=""
            onClick={(e)=>e.stopPropagation()}
            style={{
              maxWidth:'94vw', maxHeight:'88vh',
              objectFit:'contain',
              boxShadow:'0 30px 80px -10px rgba(0,0,0,.6)',
              cursor:'zoom-out',
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}

function LightboxNav({ direction, onClick }) {
  const isPrev = direction === 'prev';
  return (
    <button
      onClick={(e)=>{e.stopPropagation();onClick();}}
      aria-label={isPrev ? 'Visuel précédent' : 'Visuel suivant'}
      style={{
        position:'fixed', top:'50%', transform:'translateY(-50%)',
        [isPrev ? 'left' : 'right']: 20, zIndex:2,
        width:52, height:52, border:'1px solid rgba(255,255,255,.22)',
        background:'rgba(0,0,3,.55)', backdropFilter:'blur(8px)',
        color:'var(--white)', cursor:'pointer', padding:0,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
      }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform: isPrev ? 'rotate(180deg)' : 'none'}}>
        <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"/>
      </svg>
    </button>
  );
}

Object.assign(window, { Events });
