// ───────── Intro presentation strip ─────────

const NAVY = '#033e7d';

function Intro({ accent }) {
  return (
    <Section dark={false} padY={50}>
      <CornerGlow color="rgba(0,63,126,.18)" position="tr" size={700}/>
      <div style={{display:'grid',gridTemplateColumns:'.7fr 1.3fr',gap:80,alignItems:'start',position:'relative'}}>
        <div>
          <div className="label" style={{display:'flex',alignItems:'center',gap:14,color:'rgba(0,0,3,.65)'}}>
            <span style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:26,height:26,border:`1px solid ${NAVY}`,color:NAVY,
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,
            }}>01</span>
            <span style={{height:1,width:38,background:'rgba(0,0,3,.25)'}}/>
            <span>L'AGENCE</span>
          </div>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase',color:NAVY}}>
            18 ans<br/>sur le<br/><span style={{color:accent}}>terrain.</span>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <p className="body-text" style={{maxWidth:780,color:'rgba(0,0,3,.88)',textWrap:'pretty',margin:0}}>
            Depuis plus de <span style={{color:NAVY,fontWeight:700}}>18&nbsp;ans</span>, SPORTS MINDS accompagne les marques, institutions et acteurs du sport dans la création d'événements, de contenus médias et de dispositifs de communication à forte visibilité.
          </p>
          <div style={{marginTop:48,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,paddingTop:32,borderTop:'1px solid rgba(0,0,3,.12)'}}>
            {[
              { title:'STRATÉGIE',  desc:'Concept, positionnement, narrative sportif', icon:'target' },
              { title:'PRODUCTION', desc:'Captation, plateau TV, post-production',     icon:'camera' },
              { title:'ACTIVATION', desc:'Brand experience, sponsoring, opérations',   icon:'mega'   },
            ].map((c,i) => (
              <IntroPillar key={c.title} index={i} accent={accent} {...c}/>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function IntroPillar({ index, accent, title, desc, icon }) {
  const [hover, setHover] = React.useState(false);
  const bar = index === 1 ? NAVY : accent;
  const num = `0${index + 1}`;

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        position:'relative',
        padding:'22px 22px 20px 26px',
        background:'rgba(255,255,255,.65)',
        border:'1px solid rgba(0,0,3,.10)',
        transform: hover ? 'translateY(-3px)' : 'none',
        boxShadow: hover ? '0 18px 40px -22px rgba(0,0,3,.25)' : '0 0 0 transparent',
        transition:'transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .25s ease',
        borderColor: hover ? 'rgba(0,0,3,.18)' : 'rgba(0,0,3,.10)',
        overflow:'hidden',
      }}>
      {/* Left accent bar */}
      <span aria-hidden style={{
        position:'absolute', left:0, top:0, bottom:0,
        width: hover ? 6 : 4, background: bar,
        transition:'width .35s ease',
      }}/>

      {/* Top row: icon + number */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <PillarIcon name={icon} color={bar}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.14em',
          padding:'4px 7px', background: bar, color:'var(--white)',
        }}>{num}</span>
      </div>

      {/* Title */}
      <div className="oswald" style={{
        fontSize:17, fontWeight:700, letterSpacing:'.04em',
        color: index === 1 ? NAVY : 'var(--ink)',
        marginBottom:4,
      }}>{title}</div>

      {/* Underline */}
      <span aria-hidden style={{
        display:'block', width: hover ? 32 : 18, height:2, background: bar,
        marginBottom:10, transition:'width .35s ease',
      }}/>

      {/* Description */}
      <div className="body-text" style={{color:'rgba(0,0,3,.62)'}}>{desc}</div>
    </div>
  );
}

function PillarIcon({ name, color }) {
  const common = { width:22, height:22, viewBox:'0 0 24 24', fill:'none', stroke: color, strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };
  if (name === 'target') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/>
    </svg>
  );
  if (name === 'camera') return (
    <svg {...common}>
      <rect x="2" y="7" width="14" height="10" rx="1"/>
      <path d="M16 10l5-3v10l-5-3z"/>
      <circle cx="7" cy="12" r="1.5"/>
    </svg>
  );
  if (name === 'mega') return (
    <svg {...common}>
      <path d="M3 10v4h4l8 5V5l-8 5H3z"/>
      <path d="M18 8a5 5 0 0 1 0 8"/>
    </svg>
  );
  return null;
}

Object.assign(window, { Intro });
