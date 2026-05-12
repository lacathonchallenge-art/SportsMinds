// ───────── Productions médias — TV/Radio timeline (white bg) ─────────

const NAVY = '#033e7d';

const PRODUCTIONS = [
  { name:'Capsules pour Planète Foot', fmt:'TV',    date:'2001 – 2002',         sponsor:'MEDITEL',   type:'Capsules' },
  { name:'En route pour la Tunisie',   fmt:'TV',    date:'2004 · CAN',          sponsor:'COCA-COLA', type:'Magazine de route' },
  { name:'Lahadat Footfoot',           fmt:'TV',    date:'2004 – 2005',         sponsor:'TOTOFOOT',  type:'Magazine satirique', host:'Noureddine Naybet' },
  { name:'El Guerrouj à cœur ouvert',  fmt:'TV',    date:'2005',                sponsor:'MEDITEL',   type:'Documentaire portrait' },
  { name:'But pas But',                fmt:'TV',    date:'2005 – 2006',         sponsor:'MEDITEL',   type:'Émission de débat', host:'Marouane Chamakh' },
  { name:'Carton rouge',               fmt:'TV',    date:'2007',                sponsor:'KALM',      type:'Talk-show' },
  { name:'Célébrons le But',           fmt:'TV',    date:'2010',                sponsor:'COCA-COLA', type:'Pastilles match' },
];

function Productions({ accent }) {
  return (
    <Section dark={false} padY={50} style={{borderTop:'1px solid rgba(0,0,3,.08)'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:64,gap:32,flexWrap:'wrap'}}>
        <div>
          <div className="label" style={{display:'flex',alignItems:'center',gap:14,color:'rgba(0,0,3,.65)'}}>
            <span style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:26,height:26,border:`1px solid ${NAVY}`,color:NAVY,
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,
            }}>05</span>
            <span style={{height:1,width:38,background:'rgba(0,0,3,.25)'}}/>
            <span>PRODUCTIONS MÉDIAS</span>
          </div>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase',maxWidth:1000,color:'var(--ink)'}}>
            On signal —<br/>365 jours<br/>par&nbsp;<span style={{color:accent}}>an.</span>
          </Reveal>
        </div>
        <Reveal delay={2} className="body-text" style={{maxWidth:380,color:'rgba(0,0,3,.65)'}}>
          De la captation multicam au plateau, du magazine au format court — un atelier de production intégré pour les diffuseurs nationaux.
        </Reveal>
      </div>

      {/* Catalogue header */}
      <Reveal delay={2}>
        <div style={{
          display:'grid',gridTemplateColumns:'auto 1fr auto auto auto',gap:24,
          padding:'14px 20px',border:'1px solid rgba(0,0,3,.12)',
          background:'rgba(3,62,125,.06)',marginBottom:1,alignItems:'center',
        }}>
          <span className="label" style={{
            padding:'4px 10px',background:NAVY,color:'var(--white)',
            display:'inline-flex',alignItems:'center',gap:8,
          }}><LiveDot color={accent}/> CATALOGUE</span>
          <span className="oswald" style={{fontSize:14,letterSpacing:'.1em',color:'var(--ink)'}}>HISTORIQUE DES PRODUCTIONS</span>
          <span className="label" style={{color:'rgba(0,0,3,.55)'}}>TITRE</span>
          <span className="label" style={{color:'rgba(0,0,3,.55)'}}>FORMAT</span>
          <span className="label" style={{color:'rgba(0,0,3,.55)'}}>ANNÉE</span>
        </div>
      </Reveal>

      {/* Production rows */}
      <div style={{border:'1px solid rgba(0,0,3,.12)',borderTop:'none'}}>
        {PRODUCTIONS.map((p,i)=>(
          <Reveal key={p.name} delay={(i%4)+1}>
            <ProdRow p={p} accent={accent} index={i}/>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProdRow({ p, accent, index }) {
  const [hover, setHover] = React.useState(false);
  const meta = [p.type, p.host && `avec ${p.host}`, p.sponsor && `pour ${p.sponsor}`].filter(Boolean).join(' · ');
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        display:'grid',gridTemplateColumns:'auto 1fr auto auto auto',gap:24,alignItems:'center',
        padding:'24px 20px',
        background: hover ? 'rgba(3,62,125,.07)' : 'transparent',
        borderTop: index ? '1px solid rgba(0,0,3,.10)' : 'none',
        transition:'background .3s ease',
        cursor:'pointer',position:'relative',
      }}>
      <span className="label" style={{color:'rgba(0,0,3,.45)',width:40}}>{String(index+1).padStart(2,'0')}</span>
      <div>
        <div className="oswald" style={{fontSize:22,fontWeight:600,letterSpacing:'.04em',color:'var(--ink)'}}>
          «&nbsp;{p.name}&nbsp;»
        </div>
        <div style={{marginTop:6,fontSize:12.5,color:'rgba(0,0,3,.55)'}}>{meta}</div>
      </div>
      <span className="label" style={{
        padding:'5px 9px',
        border:`1px solid ${p.fmt==='TV'?accent:'rgba(0,0,3,.18)'}`,
        color: p.fmt==='TV' ? accent : 'rgba(0,0,3,.75)',
        minWidth:54,textAlign:'center',
      }}>{p.fmt}</span>
      <span className="oswald" style={{fontSize:14,letterSpacing:'.06em',color:NAVY,minWidth:120,fontVariantNumeric:'tabular-nums',fontWeight:600}}>{p.date}</span>
      <span style={{color:accent,transition:'transform .3s ease',transform: hover?'translateX(6px)':'none'}}>
        <Arrow size={16}/>
      </span>
    </div>
  );
}

Object.assign(window, { Productions });
