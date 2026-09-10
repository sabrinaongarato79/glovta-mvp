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
    { id: 'learning', label: 'Ruta de aprendizaje' }
  ];

  return (
    <div
      className={`app-shell${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`}
    >
      <a className="skip-link" href="#main-content">Saltar al contenido</a>

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Glovta, inicio">
          <img src="/logo.svg" alt="" className="brand-mark" width="44" height="44" />
          <div className="brand-text">
            <span className="brand-name">Glovta</span>
            <span className="brand-tagline">Talento y oportunidades sin barreras</span>
          </div>
        </a>

        <div className="topbar-actions" aria-label="Preferencias de accesibilidad">
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
            <span className="eyebrow">MVP · EMPLEABILIDAD INCLUSIVA</span>
            <h1>Tu talento merece <span>más oportunidades</span>, no más barreras.</h1>
            <p>
              Glovta reúne perfil profesional, búsqueda laboral, matching explicable
              y rutas de aprendizaje en una experiencia clara, accesible y escalable.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => setActiveTab('jobs')}>
                Explorar oportunidades
              </button>
              <button type="button" className="secondary-action" onClick={() => setActiveTab('profile')}>
                Crear mi Career Passport
              </button>
            </div>

            <div className="trust-row" aria-label="Características del MVP">
              <span>Matching explicable</span>
              <span>4 portales externos</span>
              <span>Accesibilidad integrada</span>
            </div>
          </div>

          <div className="hero-panel" aria-label="Flujo de Glovta">
            <div className="hero-panel-label">Cómo acompaña Glovta</div>
            <ol className="journey">
              <li><strong>01</strong><span>Definís tu perfil y objetivo.</span></li>
              <li><strong>02</strong><span>Buscás oportunidades relevantes.</span></li>
              <li><strong>03</strong><span>Entendés coincidencias y brechas.</span></li>
              <li><strong>04</strong><span>Armás tu próxima ruta de aprendizaje.</span></li>
            </ol>
            <p className="hero-panel-note">Glovta orienta y acompaña; no toma decisiones de contratación.</p>
          </div>
        </section>

        <section className="workspace" aria-label="Herramientas Glovta">
          <div className="workspace-heading">
            <div>
              <span className="eyebrow">TU ESPACIO</span>
              <h2>Un recorrido, no herramientas aisladas.</h2>
            </div>
            <span className={profileReady ? 'status-chip ready' : 'status-chip'}>
              {profileReady ? 'Career Passport listo' : 'Completá tu perfil'}
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

        <section className="principles" aria-label="Principios de diseño">
          <article>
            <span>01</span>
            <h3>Inclusión desde el diseño</h3>
            <p>Contraste, tipografía adaptable, navegación semántica y experiencia responsive.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Datos explicables</h3>
            <p>El matching muestra coincidencias y brechas; no usa una caja negra para decidir.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Arquitectura abierta</h3>
            <p>Proveedores de empleo y servicios externos se conectan sin atar Glovta a una sola plataforma.</p>
          </article>
        </section>
      </main>

      <footer className="app-footer">
        <div>
          <strong>Glovta</strong>
          <span>Empleabilidad, aprendizaje e inclusión digital.</span>
        </div>
        <p>MVP académico. Las integraciones externas se identifican como API, demo o navegación externa según su estado real.</p>
      </footer>
    </div>
  );
}

export default App;
