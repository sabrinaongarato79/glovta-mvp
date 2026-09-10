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

const PROJECTS = [
  { id: 'urbania', name: 'Urbania', sector: 'Real Estate', line: 'Con impacto' },
  { id: 'auralis', name: 'Auralis', sector: 'Comercio', line: 'Que conecta' },
  { id: 'nexora', name: 'Nexora', sector: 'Servicios empresariales', line: 'Procesos inteligentes' },
  { id: 'ventura', name: 'Ventura', sector: 'Turismo', line: 'Viajes que transforman' },
  { id: 'lumera', name: 'Lumera', sector: 'Bienestar', line: 'En equilibrio' },
  { id: 'lingualab', name: 'LinguaLab', sector: 'Idiomas', line: 'Sin límites' }
];

function readStoredProfile() {
  try {
    const raw = localStorage.getItem('glovta-profile');
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

function ProjectMark({ id }) {
  const common = {
    viewBox: '0 0 52 52',
    width: 40,
    height: 40,
    'aria-hidden': true
  };

  if (id === 'urbania') {
    return (
      <svg {...common}>
        <path d="M10 42V23l8-5v24M22 42V13l8-5v34M34 42V20l8 5v17" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M7 42h38" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  if (id === 'auralis') {
    return (
      <svg {...common}>
        <path d="M26 27C18 18 16 10 21 6c6 5 8 12 5 21ZM26 27c8-9 10-17 5-21-6 5-8 12-5 21ZM26 27c-10-4-18-2-20 4 7 5 14 4 20-4ZM26 27c10-4 18-2 20 4-7 5-14 4-20-4Z" fill="currentColor" opacity=".9" />
        <path d="M26 27v18" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  if (id === 'nexora') {
    return (
      <svg {...common}>
        <path d="M9 10h10l8 10 8-10h10L32 26l13 16H35l-8-10-8 10H9l13-16L9 10Z" fill="currentColor" />
      </svg>
    );
  }

  if (id === 'ventura') {
    return (
      <svg {...common}>
        <path d="M5 34c8-15 17-23 27-24 6 0 11 3 15 8-10-2-18 1-24 9 7-2 14-1 24 7H5Z" fill="currentColor" opacity=".9" />
        <path d="M8 39c10-4 20-4 36 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (id === 'lumera') {
    return (
      <svg {...common}>
        <path d="M26 44V23M26 29C18 27 12 20 12 11c8 1 14 6 14 18ZM26 29c8-2 14-9 14-18-8 1-14 6-14 18ZM26 35c-7-1-12-5-14-11 7 0 12 3 14 11ZM26 35c7-1 12-5 14-11-7 0-12 3-14 11Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M15 10v24c0 6 4 9 10 9h12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle cx="36" cy="21" r="8" fill="currentColor" opacity=".85" />
    </svg>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(null);
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

  const openModule = (tab) => {
    setActiveTab(tab);
    window.setTimeout(() => {
      document.getElementById('workspace-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 20);
  };

  const closeModule = () => setActiveTab(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`app-shell${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`}>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>

      <header className="site-header">
        <div className="header-inner">
          <button type="button" className="brand-button" onClick={() => scrollTo('inicio')} aria-label="Glovta, volver al inicio">
            <img src="/logo.svg" alt="" width="42" height="42" />
            <span className="wordmark">
              <strong>GLOVTA</strong>
              <small>Talento sin fronteras</small>
            </span>
          </button>

          <nav className="main-nav" aria-label="Navegación principal">
            <button type="button" onClick={() => scrollTo('inicio')}>Inicio</button>
            <button type="button" onClick={() => openModule('jobs')}>Oportunidades</button>
            <button type="button" onClick={() => openModule('profile')}>Mi perfil</button>
            <button type="button" onClick={() => openModule('learning')}>Formación</button>
            <button type="button" onClick={() => scrollTo('aliados')}>Aliados</button>
            <button type="button" onClick={() => scrollTo('proyectos')}>Proyectos</button>
          </nav>

          <div className="header-actions" aria-label="Preferencias">
            <span className="language-label">ES</span>
            <button type="button" className="access-button" aria-pressed={highContrast} onClick={() => setHighContrast(v => !v)}>
              Contraste
            </button>
            <button type="button" className="access-button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)}>
              A+
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="section-kicker">PERSONAS · APRENDIZAJE · OPORTUNIDADES · INCLUSIÓN</span>
            <h1>Talento real.<br /><span>Oportunidades globales.</span></h1>
            <p className="hero-lead">
              Una plataforma y consultora con visión global, pensada para conectar talento,
              formación y oportunidades en distintos mercados.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => openModule('jobs')}>
                Explorar oportunidades <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="outline-button" onClick={() => openModule('profile')}>
                Crear mi Career Passport
              </button>
            </div>

            <div className="hero-points" aria-label="Propuesta de valor">
              <div><span className="point-icon">01</span><p><strong>Personas sin barreras</strong><small>Perfiles diversos, una misma plataforma.</small></p></div>
              <div><span className="point-icon">02</span><p><strong>Oportunidades globales</strong><small>Búsqueda y navegación multiplaforma.</small></p></div>
              <div><span className="point-icon">03</span><p><strong>Un futuro más inclusivo</strong><small>Brechas visibles y próximos pasos.</small></p></div>
            </div>
          </div>

          <div className="global-visual" aria-label="Glovta, visión global">
            <svg className="network-globe" viewBox="0 0 620 420" role="img" aria-label="Red global de oportunidades">
              <defs>
                <linearGradient id="globeFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#eaf3ff" />
                  <stop offset="1" stopColor="#c9defa" />
                </linearGradient>
              </defs>
              <circle cx="330" cy="205" r="166" fill="url(#globeFill)" opacity=".82" />
              <ellipse cx="330" cy="205" rx="166" ry="62" fill="none" stroke="#5d8ad1" strokeWidth="1.4" opacity=".35" />
              <ellipse cx="330" cy="205" rx="166" ry="112" fill="none" stroke="#5d8ad1" strokeWidth="1.2" opacity=".27" />
              <ellipse cx="330" cy="205" rx="72" ry="166" fill="none" stroke="#5d8ad1" strokeWidth="1.2" opacity=".27" />
              <ellipse cx="330" cy="205" rx="120" ry="166" fill="none" stroke="#5d8ad1" strokeWidth="1.2" opacity=".22" />
              <path d="M186 173c45-34 86-51 137-49 58 2 105 25 154 67M203 269c55 31 103 43 155 33 42-8 78-27 111-57" fill="none" stroke="#2369c9" strokeWidth="1.5" opacity=".42" />
              <path d="M219 122 292 178 385 136 454 226 348 285 254 254 179 213" fill="none" stroke="#1e6ed6" strokeWidth="1.6" opacity=".55" />
              <circle cx="219" cy="122" r="5" fill="#0e4ea8" />
              <circle cx="292" cy="178" r="5" fill="#0e4ea8" />
              <circle cx="385" cy="136" r="5" fill="#0e4ea8" />
              <circle cx="454" cy="226" r="5" fill="#0e4ea8" />
              <circle cx="348" cy="285" r="5" fill="#0e4ea8" />
              <circle cx="254" cy="254" r="5" fill="#0e4ea8" />
              <circle cx="179" cy="213" r="5" fill="#0e4ea8" />
              <circle cx="292" cy="178" r="11" fill="none" stroke="#0e4ea8" opacity=".28" />
              <circle cx="454" cy="226" r="11" fill="none" stroke="#0e4ea8" opacity=".28" />
            </svg>
            <div className="global-message">
              <strong>Más personas.</strong>
              <strong>Más posibilidades.</strong>
              <span>Una mirada global, una experiencia humana.</span>
            </div>
          </div>
        </section>

        <section className="ally-card" id="aliados" aria-labelledby="essa-title">
          <div className="ally-copy">
            <span className="ally-label">PROYECTO ALIADO · ESSA</span>
            <h2 id="essa-title">Belleza con propósito,<br />oportunidades sin atajos.</h2>
          </div>
          <div className="ally-logo-wrap">
            <img src="/essa-logo.svg" alt="ESSA, Estética Sin Atajos by Paula Andrea" className="essa-logo" />
          </div>
          <div className="ally-description">
            <p>Proyecto de estética y bienestar en desarrollo, acompañado desde Glovta en identidad, presencia digital y experiencia web.</p>
            <span className="project-status">Sitio en desarrollo</span>
          </div>
        </section>

        <section className="projects" id="proyectos" aria-labelledby="projects-title">
          <div className="projects-intro">
            <span className="section-kicker">PROYECTOS DEMO</span>
            <h2 id="projects-title">Distintos sectores.<br />Una misma visión.</h2>
            <p>Marcas ficticias creadas para demostrar soluciones Glovta. No representan clientes reales.</p>
          </div>

          <div className="project-logos">
            {PROJECTS.map((project) => (
              <article className={`project-logo project-${project.id}`} key={project.id}>
                <ProjectMark id={project.id} />
                <strong>{project.name}</strong>
                <span>{project.sector}</span>
                <small>{project.line}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="tools" aria-labelledby="tools-title">
          <div className="tools-heading">
            <div>
              <span className="section-kicker">TU ESPACIO EN GLOVTA</span>
              <h2 id="tools-title">Todo lo que necesitás para avanzar.</h2>
            </div>
            <span className={profileReady ? 'profile-state ready' : 'profile-state'}>
              {profileReady ? 'Career Passport listo' : 'Completá tu perfil'}
            </span>
          </div>

          <div className="tool-cards">
            <button type="button" className="tool-card tool-jobs" onClick={() => openModule('jobs')}>
              <span className="tool-number">01</span>
              <div><strong>Oportunidades</strong><p>Buscá vacantes y compará oportunidades desde un mismo punto de partida.</p></div>
              <span className="tool-arrow" aria-hidden="true">→</span>
            </button>

            <button type="button" className="tool-card tool-profile" onClick={() => openModule('profile')}>
              <span className="tool-number">02</span>
              <div><strong>Career Passport</strong><p>Organizá habilidades, experiencia, idiomas y objetivo profesional.</p></div>
              <span className="tool-arrow" aria-hidden="true">→</span>
            </button>

            <button type="button" className="tool-card tool-learning" onClick={() => openModule('learning')}>
              <span className="tool-number">03</span>
              <div><strong>Aprendizaje</strong><p>Transformá brechas de habilidades en una ruta de formación concreta.</p></div>
              <span className="tool-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        {activeTab && (
          <section className="workspace-panel" id="workspace-panel" aria-label="Módulo activo">
            <div className="workspace-bar">
              <span>Herramienta activa</span>
              <button type="button" onClick={closeModule}>Cerrar ×</button>
            </div>
            {activeTab === 'jobs' && <JobSearch profile={profile} />}
            {activeTab === 'profile' && <ProfilePanel profile={profile} onSave={setProfile} />}
            {activeTab === 'learning' && <LearningPath profile={profile} />}
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/logo.svg" alt="" width="34" height="34" />
            <span><strong>GLOVTA</strong><small>Talento sin fronteras</small></span>
          </div>
          <p>Personas · oportunidades · aprendizaje · impacto global</p>
          <small>MVP académico · Casos demo claramente identificados.</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
