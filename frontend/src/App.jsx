import React, { useEffect, useMemo, useState } from 'react';
import JobSearch from './components/JobSearch';
import LearningPath from './components/LearningPath';
import ProfilePanel from './components/ProfilePanel';

const EMPTY_PROFILE = {
  fullName: '',
  goal: '',
  skills: [],
  languages: [],
  experienceYears: 0,
  hasDegree: false
};

const DEMO_BRANDS = [
  { mark: 'UR', name: 'Urbania', sector: 'Real Estate' },
  { mark: 'AU', name: 'Auralis', sector: 'Commerce' },
  { mark: 'NX', name: 'Nexora', sector: 'Business Services' },
  { mark: 'VT', name: 'Ventura', sector: 'Travel' },
  { mark: 'LM', name: 'Lumera', sector: 'Beauty & Wellness' },
  { mark: 'LL', name: 'LinguaLab', sector: 'Education' }
];

function readStoredProfile() {
  try {
    const raw = localStorage.getItem('glovta-profile');
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [profile, setProfile] = useState(readStoredProfile);
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem('glovta-high-contrast') === 'true'
  );
  const [largeText, setLargeText] = useState(
    () => localStorage.getItem('glovta-large-text') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('glovta-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('glovta-high-contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('glovta-large-text', String(largeText));
  }, [largeText]);

  const profileReady = useMemo(
    () => Boolean(profile.goal || profile.skills.length || profile.languages.length),
    [profile]
  );

  const tabs = [
    { id: 'jobs', label: 'Oportunidades' },
    { id: 'profile', label: 'Career Passport' },
    { id: 'learning', label: 'Aprendizaje' }
  ];

  return (
    <div className={`app-shell${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`}>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Glovta, inicio">
          <img src="/logo.svg" alt="" className="brand-mark" width="42" height="42" />
          <div className="brand-text">
            <span className="brand-name">GLOVTA</span>
            <span className="brand-tagline">Talent Without Limits</span>
          </div>
        </a>

        <nav className="topnav" aria-label="Navegación principal">
          <button type="button" onClick={() => setActiveTab('jobs')}>Oportunidades</button>
          <button type="button" onClick={() => setActiveTab('profile')}>Mi perfil</button>
          <button type="button" onClick={() => setActiveTab('learning')}>Formación</button>
        </nav>

        <div className="topbar-actions" aria-label="Accesibilidad">
          <button
            type="button"
            className="utility-button"
            aria-pressed={highContrast}
            onClick={() => setHighContrast((value) => !value)}
          >
            Contraste
          </button>
          <button
            type="button"
            className="utility-button"
            aria-pressed={largeText}
            onClick={() => setLargeText((value) => !value)}
          >
            A+
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">EMPLEABILIDAD INCLUSIVA · VISIÓN GLOBAL</span>
            <h1>Talento real.<br /><span>Oportunidades globales.</span></h1>
            <p>
              Glovta conecta perfil profesional, oportunidades, matching explicable
              y aprendizaje en una experiencia inclusiva, pensada para personas y organizaciones de distintos mercados.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => setActiveTab('jobs')}>
                Buscar oportunidades
              </button>
              <button type="button" className="secondary-action" onClick={() => setActiveTab('profile')}>
                Crear mi Career Passport
              </button>
            </div>
          </div>

          <div className="hero-visual" aria-label="Resumen del recorrido Glovta">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="globe-core">
              <img src="/logo.svg" alt="" width="66" height="66" />
            </div>
            <div className="hero-stat stat-one"><strong>01</strong><span>Perfil</span></div>
            <div className="hero-stat stat-two"><strong>02</strong><span>Match</span></div>
            <div className="hero-stat stat-three"><strong>03</strong><span>Aprendizaje</span></div>
          </div>
        </section>

        <section className="demo-strip" aria-label="Aliado institucional">
          <div className="demo-strip-heading">
            <span className="eyebrow">ALIADO INSTITUCIONAL</span>
            <p>Construimos vínculos para ampliar el acceso a formación, talento y oportunidades.</p>
          </div>
          <div className="demo-brands" style={{ gridTemplateColumns: '1fr' }}>
            <div className="demo-brand" style={{ borderLeft: 'none' }}>
              <span className="demo-mark">ES</span>
              <span>
                <strong>ESSA</strong>
                <small>Aliado institucional de Glovta</small>
              </span>
            </div>
          </div>
        </section>

        <section className="demo-strip" aria-label="Marcas demo">
          <div className="demo-strip-heading">
            <span className="eyebrow">CASOS DEMO</span>
            <p>Marcas ficticias creadas para demostrar soluciones y verticales Glovta.</p>
          </div>
          <div className="demo-brands">
            {DEMO_BRANDS.map((brand) => (
              <div className="demo-brand" key={brand.name}>
                <span className="demo-mark">{brand.mark}</span>
                <span>
                  <strong>{brand.name}</strong>
                  <small>{brand.sector}</small>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace" aria-label="Herramientas Glovta">
          <div className="workspace-heading">
            <div>
              <span className="eyebrow">TU ESPACIO</span>
              <h2>Todo el recorrido en tres módulos.</h2>
            </div>
            <span className={profileReady ? 'status-chip ready' : 'status-chip'}>
              {profileReady ? 'Perfil listo' : 'Perfil pendiente'}
            </span>
          </div>

          <nav className="tabs" role="tablist" aria-label="Módulos principales">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? 'tab active' : 'tab'}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="tab-panel" role="tabpanel">
            {activeTab === 'jobs' && <JobSearch profile={profile} />}
            {activeTab === 'profile' && <ProfilePanel profile={profile} onSave={setProfile} />}
            {activeTab === 'learning' && <LearningPath profile={profile} />}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-brand">
          <img src="/logo.svg" alt="" width="34" height="34" />
          <div>
            <strong>GLOVTA</strong>
            <span>Talent Without Limits</span>
          </div>
        </div>
        <p>MVP académico · Empleabilidad, inclusión y tecnología.</p>
      </footer>
    </div>
  );
}

export default App;
