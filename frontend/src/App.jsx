import React, { useState } from 'react';
import JobSearch from './components/JobSearch';
import LearningPath from './components/LearningPath';

function App() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand">
          <img src="/logo.svg" alt="" className="brand-mark" width="36" height="36" />
          <div className="brand-text">
            <span className="brand-name">Glockta</span>
            <span className="brand-tagline">Empleo y aprendizaje sin barreras</span>
          </div>
        </div>
        <nav className="tabs" role="tablist" aria-label="Secciones">
          <button
            role="tab"
            aria-selected={activeTab === 'jobs'}
            className={activeTab === 'jobs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('jobs')}
          >
            Buscar empleo
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'learning'}
            className={activeTab === 'learning' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('learning')}
          >
            Ruta de aprendizaje
          </button>
        </nav>
      </header>

      <main className="content">
        {activeTab === 'jobs' ? <JobSearch /> : <LearningPath />}
      </main>

      <footer className="app-footer">
        <span>Glockta conecta perfiles de cualquier edad, idioma y nivel técnico con oportunidades reales.</span>
      </footer>
    </div>
  );
}

export default App;
