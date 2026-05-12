// ───────── References: white section, brand logos ─────────
// Paste a URL in `url` to display the real logo for a brand.
// Brands without a `url` fall back to a styled text wordmark.

const NAVY = '#033e7d';

const CLIENTS = [
  { name: 'Coca-Cola',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/960px-Coca-Cola_logo.svg.png' },
  { name: 'Danone',           url: 'https://logo-marque.com/wp-content/uploads/2020/12/Danone-Logo.png' },
  { name: 'Samsung',          url: 'https://1000logos.net/wp-content/uploads/2017/06/Samsung-emblem.png' },
  { name: 'Lacoste',          url: 'https://cdn.worldvectorlogo.com/logos/lacoste-logo.svg' },
  { name: 'Maroc Telecom',    url: 'https://1000marcas.net/wp-content/uploads/2021/05/Maroc-Telecom-logo-1.png' },
  { name: 'Royal Air Maroc',  url: 'https://ereport.royalairmaroc.com/pwrse/template/login/images/logo.png' },
  { name: 'Gillette',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Gillette.svg/3840px-Gillette.svg.png' },
  { name: 'Inwi',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/1280px-Logo_inwi.svg.png' },
  { name: 'Méditel',          url: 'https://images.seeklogo.com/logo-png/9/2/meditel-logo-png_seeklogo-90540.png' },
  { name: "L'Oréal",          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/1280px-L%27Or%C3%A9al_logo.svg.png' },
  { name: 'Suzuki',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Suzuki_Motor_Corporation_logo.svg/3840px-Suzuki_Motor_Corporation_logo.svg.png' },
  { name: 'KIA',              url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/KIA_logo2.svg' },
  { name: 'Volkswagen',       url: 'https://upload.wikimedia.org/wikinews/en/d/d3/Volkswagen_logo.png' },
  { name: 'Crédit du Maroc',  url: 'https://lbanka.com/assets/images/banks/CDM.png' },
  { name: 'Société Générale', url: 'https://commonland.com/wp-content/uploads/2023/12/logo-societe-generale.png' },
  { name: 'BMCI',             url: 'https://www.bmci.ma/wp-content/blogs.dir/sites/2/2018/03/BMCI_BL_F_Q.png' },
  { name: 'MDJS',             url: 'https://medias24.com/content/uploads/2025/05/16/LOGO-MDJS.png' },
  { name: 'Mercedes-Benz',    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mercedes-Benz_Logo_2010.svg' },
  { name: "McDonald's",       url: 'https://companylogos.org/wp-content/uploads/2024/08/McDonalds-1968-300x169.png' },
  { name: 'Opel',             url: 'https://cdn.freebiesupply.com/logos/large/2x/opel-1-logo-black-and-white.png' },
  { name: 'Radio Mars',       url: 'https://cdn-radiotime-logos.tunein.com/s135875g.png' },
];

function References() {
  return (
    <Section dark={false} padY={50} style={{borderTop:'1px solid rgba(0,0,3,.08)'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:56,gap:32,flexWrap:'wrap'}}>
        <div>
          <div className="label" style={{display:'flex',alignItems:'center',gap:14,color:'rgba(0,0,3,.6)'}}>
            <span style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:26,height:26,border:`1px solid ${NAVY}`,color:NAVY,
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,
            }}>03</span>
            <span style={{height:1,width:38,background:'rgba(0,0,3,.25)'}}/>
            <span>RÉFÉRENCES</span>
          </div>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase',maxWidth:1000,color:'var(--ink)'}}>
            Ils nous ont fait<br/><span style={{color:NAVY}}>confiance.</span>
          </Reveal>
        </div>
        <Reveal delay={2} className="body-text" style={{maxWidth:360,color:'rgba(0,0,3,.65)'}}>
          Des marques nationales et internationales — sport, lifestyle, automobile, banque, télécom, média — toutes connectées par la même obsession : l'impact.
        </Reveal>
      </div>

      {/* Logo wall — 7 cols × 3 rows */}
      <Reveal delay={3}>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(7, 1fr)',
          gap:1, background:'rgba(0,0,3,.08)', border:'1px solid rgba(0,0,3,.08)',
        }}>
          {CLIENTS.map((c) => (
            <LogoTile key={c.name} name={c.name} url={c.url}/>
          ))}
        </div>
      </Reveal>

    </Section>
  );
}

function LogoTile({ name, url }) {
  const [hover, setHover] = React.useState(false);
  const [imgFailed, setImgFailed] = React.useState(false);
  const showImage = url && !imgFailed;

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        background: hover ? NAVY : 'var(--white)',
        height:110, display:'flex',alignItems:'center',justifyContent:'center',
        transition:'background .3s ease', position:'relative', overflow:'hidden',
      }}>
      {showImage ? (
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          style={{
            maxHeight: 52, maxWidth: '72%', objectFit: 'contain',
            filter: hover ? 'brightness(0) invert(1)' : 'grayscale(1) brightness(.4)',
            opacity: hover ? 1 : .85,
            transition:'filter .3s ease, opacity .3s ease',
          }}
        />
      ) : (
        <span style={{
          fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:14,letterSpacing:'.1em',
          textTransform:'uppercase',
          color: hover ? 'var(--white)' : 'rgba(0,0,3,.55)',
          transition:'color .3s ease',
          textAlign:'center', padding:'0 12px',
        }}>{name}</span>
      )}
      {/* Accent corner mark on hover */}
      <span style={{
        position:'absolute',top:8,right:8,width:6,height:6,background:'var(--white)',
        opacity: hover ? 1 : 0, transition:'opacity .3s ease',
      }}/>
    </div>
  );
}

Object.assign(window, { References });
