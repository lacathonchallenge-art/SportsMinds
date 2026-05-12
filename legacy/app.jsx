// ───────── App shell: wires sections + Tweaks ─────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#f0943e",
  "density": "regular",
  "heroMotion": "kinetic",
  "showScoreboard": true
}/*EDITMODE-END*/;

const ACCENTS = ['#f0943e', '#ff3b3b', '#22d3a5', '#ffd54a', '#ffffff'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;

  return (
    <div style={{background:'var(--ink)',color:'var(--white)',minHeight:'100vh'}}>
      <Hero accent={accent} motion={t.heroMotion}/>
      <Intro accent={accent}/>
      <Expertises accent={accent} density={t.density}/>
      <References accent={accent}/>
      <Events accent={accent}/>
      <Productions accent={accent}/>
      <Stats accent={accent}/>
      <CTA accent={accent}/>
      <Footer accent={accent}/>

      <TweaksPanel title="Tweaks · Sports Minds">
        <TweakSection label="Identité"/>
        <TweakColor
          label="Accent"
          value={accent}
          options={ACCENTS}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Hero"/>
        <TweakRadio
          label="Animation"
          value={t.heroMotion}
          options={['kinetic','still']}
          onChange={(v) => setTweak('heroMotion', v)}
        />
        <TweakSection label="Densité"/>
        <TweakRadio
          label="Cartes"
          value={t.density}
          options={['compact','regular','comfy']}
          onChange={(v) => setTweak('density', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
