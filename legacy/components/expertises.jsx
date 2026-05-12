// ───────── Domaines d'expertise: 6 cards in a sport-card grid ─────────

// Unsplash images (free use under the Unsplash License). Swap any URL freely.
const EXPERTISES = [
  { n: '01', title: 'Communication\névénementielle', tag: 'STRATEGY',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
    desc: 'Plans 360°, déploiement multi-canal et orchestration de campagnes sportives à forte visibilité.',
    capabilities: ['Plan stratégique','Direction artistique','Relations presse','RP & influence'],
  },
  { n: '02', title: 'Conception et production\nd\'événements sportifs', tag: 'EVENTS',
    img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
    desc: "De la première esquisse à la cérémonie finale — concept, scénographie, logistique et opérations sur site.",
    capabilities: ['Scénographie','Logistique','Sécurité','Régie générale'],
  },
  { n: '03', title: 'Production\ntélévisée et radio', tag: 'BROADCAST',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    desc: "Magazines, capsules, plateaux et captations multi-caméras pour les diffuseurs nationaux et internationaux.",
    capabilities: ['Captation multicam','Plateaux TV','Post-production','Habillage antenne'],
  },
  { n: '04', title: "Droit d'image\nde sportifs professionnels", tag: 'TALENT',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    desc: "Représentation, contrats d'image et placements de talents pour fédérations, marques et clubs.",
    capabilities: ['Négociation','Placement','Contrats','Suivi'],
  },
  { n: '05', title: 'Activation de marque\n& sponsoring', tag: 'BRAND',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    desc: "Brand experience, fan zones, naming, content & social — l'activation qui transforme la visibilité en préférence.",
    capabilities: ['Fan experience','Naming','Hospitality','Content social'],
  },
  { n: '06', title: 'Conseil en stratégie\nde communication', tag: 'ADVISORY',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    desc: "Diagnostic, positionnement et roadmap — un partenariat long-terme pour ancrer les marques dans le sport.",
    capabilities: ['Diagnostic','Positionnement','Roadmap','KPI & mesure'],
  },
];

function Expertises({ accent, density }) {
  const padding = density === 'compact' ? 24 : density === 'comfy' ? 40 : 32;
  return (
    <Section id="expertises" dark padY={50}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:56,gap:32,flexWrap:'wrap'}}>
        <div>
          <Eyebrow num="02" accent={accent}>DOMAINES D'EXPERTISE</Eyebrow>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase',maxWidth:900}}>
            Six terrains.<br/>Un&nbsp;<span style={{color:accent}}>seul</span> plateau<br/>de jeu.
          </Reveal>
        </div>
        <Reveal delay={2} className="body-text" style={{maxWidth:380,color:'rgba(255,255,255,.65)'}}>
          Six expertises intégrées sous le même toit. Un brief peut commencer en stratégie, traverser la production et finir en activation — sans changer d'interlocuteur.
        </Reveal>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:1,background:'var(--line)',border:'1px solid var(--line)'}}>
        {EXPERTISES.map((e,i)=>(
          <ExpCard key={e.n} {...e} accent={accent} padding={padding} delay={(i%3)+1} img={e.img}/>
        ))}
      </div>
    </Section>
  );
}

function ExpCard({ n, title, tag, desc, capabilities, accent, padding, delay, img }) {
  const [hover, setHover] = React.useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        style={{
          position:'relative', background:'var(--ink)',
          padding, minHeight: 360,
          display:'flex',flexDirection:'column',justifyContent:'space-between',
          cursor:'pointer', overflow:'hidden',
        }}>
        {/* Background image */}
        {img && (
          <div aria-hidden style={{
            position:'absolute', inset:0,
            backgroundImage:`url(${img})`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity: hover ? .95 : .75,
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition:'opacity .45s ease, transform 1.2s cubic-bezier(.2,.7,.2,1)',
          }}/>
        )}
        {/* Dark overlay for legibility — lighter at top, stronger at bottom */}
        <div aria-hidden style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:`linear-gradient(180deg, rgba(0,0,3,.15) 0%, rgba(0,0,3,.35) 45%, rgba(0,0,3,.70) 100%)`,
        }}/>
        {/* Hover tint */}
        <div aria-hidden style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'rgba(3,62,125,.18)',
          opacity: hover ? 1 : 0,
          transition:'opacity .35s ease',
        }}/>

        {/* Top tag bar */}
        <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <span className="label" style={{color:'rgba(255,255,255,.65)'}}>{n} / 06</span>
          <span className="label" style={{
            padding:'4px 8px',background:'#033e7d',color:'var(--white)',
            border:'1px solid #033e7d',
          }}>{tag}</span>
        </div>

        {/* Title */}
        <div style={{position:'relative',zIndex:1,marginTop:36}}>
          <h3 className="oswald" style={{
            fontSize:26,fontWeight:600,lineHeight:1.08,margin:0,whiteSpace:'pre-line',
            textTransform:'uppercase',color:'var(--white)',
          }}>{title}</h3>
          <p className="body-text" style={{
            marginTop:14,color:'rgba(255,255,255,.85)',
            maxWidth:360, textWrap:'pretty',
          }}>{desc}</p>
        </div>

        {/* Capabilities */}
        <div style={{
          position:'relative',zIndex:1,
          marginTop:24,paddingTop:18,borderTop:'1px dashed rgba(255,255,255,.25)',
          display:'flex',flexWrap:'wrap',gap:6,
        }}>
          {capabilities.map((c)=>(
            <span key={c} className="label" style={{
              fontSize:10,padding:'5px 8px',
              background:'rgba(0,0,3,.45)',color:'rgba(255,255,255,.85)',
              border:'1px solid rgba(255,255,255,.18)',
              backdropFilter:'blur(4px)',
            }}>{c}</span>
          ))}
        </div>

        {/* Hover arrow */}
        <div style={{
          position:'absolute',right:padding,top:padding+38,
          opacity: hover ? 1 : 0, transform: hover ? 'translate(0,0)' : 'translate(-8px,8px)',
          transition:'all .35s ease', color: accent,
        }}>
          <CornerArrow size={26}/>
        </div>

        {/* Bottom accent bar */}
        <div style={{
          position:'absolute',left:0,right:0,bottom:0,height:3,background:accent,
          transform: hover ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left',
          transition:'transform .45s cubic-bezier(.2,.7,.2,1)',
        }}/>
      </div>
    </Reveal>
  );
}

Object.assign(window, { Expertises });
