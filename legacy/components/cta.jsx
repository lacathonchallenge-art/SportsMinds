// ───────── Final CTA + integrated contact form ─────────

function CTA({ accent }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({ nom:'', email:'', phone:'', type:'', message:'' });
  const types = ['Événement', 'Activation', 'Production TV/Radio', 'Conseil', 'Autre'];

  const next = () => setStep(s => Math.min(s+1, 3));
  const back = () => setStep(s => Math.max(s-1, 0));
  const set = (k,v) => setForm(f => ({...f, [k]:v}));
  const submit = (e) => { e.preventDefault(); setStep(3); };

  return (
    <Section id="contact" dark padY={50} style={{position:'relative',background:'var(--ink)',overflow:'hidden'}}>
      {/* Big background number */}
      <div className="display" style={{
        position:'absolute',right:-40,top:60,fontSize:520,color:'rgba(0,63,126,.18)',
        lineHeight:.85,pointerEvents:'none',userSelect:'none',
      }}>07</div>

      <div style={{display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:80,position:'relative'}}>
        {/* Left */}
        <div>
          <Eyebrow num="07" accent={accent}>CONTACT</Eyebrow>
          <Reveal as="h2" delay={1} className="display h2-section" style={{marginTop:24,textTransform:'uppercase'}}>
            Vous avez un<br/>projet<br/><span style={{color:accent}}>sportif</span>,<br/>média ou<br/>événementiel?
          </Reveal>
          <Reveal delay={2} className="body-text" style={{marginTop:36,color:'rgba(255,255,255,.7)',maxWidth:520,textWrap:'pretty'}}>
            SPORTS MINDS vous accompagne de l'idée à la production. Brief en 48h, devis en 5 jours, mise en route immédiate.
          </Reveal>

          <Reveal delay={3} style={{marginTop:56,display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,maxWidth:520}}>
            <div>
              <div className="label" style={{color:'rgba(255,255,255,.45)',marginBottom:8}}>CASABLANCA HQ</div>
              <div className="oswald" style={{fontSize:15,fontWeight:500,lineHeight:1.5}}>23, Rue de l'Atlas<br/>Maârif · 20100</div>
            </div>
            <div>
              <div className="label" style={{color:'rgba(255,255,255,.45)',marginBottom:8}}>JOIGNEZ-NOUS</div>
              <div className="oswald" style={{fontSize:15,fontWeight:500,lineHeight:1.5}}>+212 522 00 00 00<br/><span style={{color:accent}}>hello@sportsminds.ma</span></div>
            </div>
          </Reveal>
        </div>

        {/* Right: form card */}
        <Reveal delay={2}>
          <div style={{
            background:'rgba(255,255,255,.04)',border:'1px solid var(--line-strong)',
            padding:'36px 36px 28px',position:'relative',backdropFilter:'blur(8px)',
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span className="label" style={{color:accent,display:'flex',alignItems:'center',gap:8}}>
                <LiveDot color={accent}/> NOUVEAU BRIEF
              </span>
              <span className="label" style={{color:'rgba(255,255,255,.45)'}}>
                ÉTAPE {step+1}/4
              </span>
            </div>

            {/* Progress */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:32}}>
              {[0,1,2,3].map(i=>(
                <span key={i} style={{
                  height:3,background: i<=step ? accent : 'rgba(255,255,255,.12)',
                  transition:'background .3s ease',
                }}/>
              ))}
            </div>

            {step === 0 && (
              <FormStep title="01 — Qui êtes-vous?" subtitle="Commençons par les bases.">
                <Field label="Nom complet" value={form.nom} onChange={v=>set('nom',v)} placeholder="Karim El Idrissi"/>
                <Field label="Email professionnel" value={form.email} onChange={v=>set('email',v)} placeholder="vous@marque.com"/>
                <Field label="Téléphone" value={form.phone} onChange={v=>set('phone',v)} placeholder="+212 6 ..."/>
                <FormFooter onNext={next} accent={accent} disableBack/>
              </FormStep>
            )}

            {step === 1 && (
              <FormStep title="02 — Type de projet" subtitle="Sélectionnez votre terrain.">
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:20}}>
                  {types.map(t=>(
                    <button key={t} onClick={()=>set('type',t)} className="oswald" style={{
                      padding:'14px 14px',textAlign:'left',cursor:'pointer',
                      background: form.type===t ? accent : 'rgba(255,255,255,.04)',
                      color: form.type===t ? 'var(--ink)' : 'var(--white)',
                      border: form.type===t ? `1px solid ${accent}` : '1px solid var(--line-strong)',
                      fontSize:13, letterSpacing:'.04em',transition:'all .2s ease',
                    }}>{t}</button>
                  ))}
                </div>
                <FormFooter onNext={next} onBack={back} accent={accent}/>
              </FormStep>
            )}

            {step === 2 && (
              <FormStep title="03 — Décrivez votre besoin" subtitle="Plus c'est précis, mieux on répond.">
                <Field
                  label="Brief"
                  value={form.message}
                  onChange={v=>set('message',v)}
                  textarea
                  placeholder="Contexte, objectifs, calendrier souhaité, budget approximatif…"
                />
                <FormFooter onNext={submit} onBack={back} accent={accent} cta="Envoyer le brief"/>
              </FormStep>
            )}

            {step === 3 && (
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{
                  width:64,height:64,borderRadius:'50%',background:accent,color:'var(--ink)',
                  display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:24,
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l5 5 11-12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square"/>
                  </svg>
                </div>
                <h4 className="display" style={{fontSize:44,margin:0,textTransform:'uppercase'}}>Brief reçu.</h4>
                <p style={{marginTop:12,color:'rgba(255,255,255,.65)',fontSize:14,lineHeight:1.6,maxWidth:340,marginInline:'auto'}}>
                  Un partner de l'agence vous recontacte sous <span style={{color:accent}}>48h</span>. En attendant, on prépare déjà vos premières idées.
                </p>
                <button onClick={()=>{setStep(0);setForm({nom:'',email:'',phone:'',type:'',message:''})}}
                  className="oswald" style={{
                    marginTop:32,padding:'12px 22px',background:'transparent',
                    border:'1px solid var(--line-strong)',color:'var(--white)',
                    cursor:'pointer',fontSize:12,letterSpacing:'.1em',
                  }}>↻ Soumettre un autre brief</button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function FormStep({ title, subtitle, children }) {
  return (
    <div>
      <div className="oswald" style={{fontSize:18,fontWeight:600,marginBottom:6}}>{title}</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:24}}>{subtitle}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }) {
  const [focus, setFocus] = React.useState(false);
  const common = {
    width:'100%',background:'transparent',border:'none',
    borderBottom:`1px solid ${focus?'var(--orange)':'rgba(255,255,255,.2)'}`,
    color:'var(--white)',padding:'10px 0',fontSize:15,fontFamily:'inherit',
    outline:'none',transition:'border-color .2s ease',
    resize:'none',
  };
  return (
    <div style={{marginBottom:16}}>
      <label className="label" style={{color:focus?'var(--orange)':'rgba(255,255,255,.5)',display:'block',marginBottom:4,transition:'color .2s ease'}}>{label}</label>
      {textarea
        ? <textarea rows="4" style={common} value={value} placeholder={placeholder} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} onChange={e=>onChange(e.target.value)}/>
        : <input type="text" style={common} value={value} placeholder={placeholder} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} onChange={e=>onChange(e.target.value)}/>}
    </div>
  );
}

function FormFooter({ onNext, onBack, accent, disableBack, cta = 'Suivant' }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',marginTop:24,gap:10}}>
      <button onClick={onBack} disabled={disableBack} className="oswald" style={{
        padding:'12px 18px',background:'transparent',color:'var(--white)',
        border:'1px solid var(--line-strong)',cursor:disableBack?'default':'pointer',
        fontSize:12,letterSpacing:'.1em',opacity:disableBack?.3:1,
      }}>← Retour</button>
      <button onClick={onNext} className="oswald" style={{
        padding:'12px 22px',background:accent,color:'var(--ink)',border:'none',
        cursor:'pointer',fontSize:12,letterSpacing:'.1em',fontWeight:600,
        display:'inline-flex',alignItems:'center',gap:10,
      }}>{cta} <Arrow size={12}/></button>
    </div>
  );
}

Object.assign(window, { CTA });
