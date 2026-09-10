import React, { useMemo, useState } from 'react';
import JobCard from './JobCard';
import ExternalJobLinks from './ExternalJobLinks';

const API_URL = import.meta.env.VITE_API_URL || '';

const FALLBACK_JOBS = [
  {
    id: 'fallback-1',
    title: 'Customer Success Specialist',
    company: 'Empresa Demo',
    location: 'Remoto / Argentina',
    description: 'Atención al cliente, inglés, CRM, comunicación y organización.',
    url: null,
    source: 'demo'
  },
  {
    id: 'fallback-2',
    title: 'Business Analyst Jr.',
    company: 'Empresa Demo',
    location: 'Buenos Aires',
    description: 'SQL, Excel, comunicación, análisis y documentación de procesos.',
    url: null,
    source: 'demo'
  }
];

function scoreJob(job, profile) {
  const skills = [...(profile.skills || []), ...(profile.languages || [])]
    .map((value) => String(value).trim().toLowerCase())
    .filter(Boolean);
  if (!skills.length) return { score: null, matched: [], gaps: [] };

  const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();
  const matched = skills.filter((skill) => text.includes(skill));
  const score = Math.round((matched.length / skills.length) * 100);
  return { score, matched, gaps: skills.filter((skill) => !matched.includes(skill)) };
}

function JobSearch({ profile }) {
  const [query, setQuery] = useState(profile.goal || '');
  const [location, setLocation] = useState('Argentina');
  const [jobs, setJobs] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('');
  const [error, setError] = useState(null);

  const hasProfile = useMemo(
    () => Boolean((profile.skills || []).length || (profile.languages || []).length),
    [profile]
  );

  const decorateJobs = (items) => items.map((job) => ({
    ...job,
    match: scoreJob(job, profile)
  }));

  const handleSearch = async (event) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setError('Escribí un puesto, habilidad o palabra clave.');
      return;
    }

    setLoading(true);
    setError(null);

    if (!API_URL) {
      setJobs(decorateJobs(FALLBACK_JOBS));
      setExternalLinks([]);
      setMode('Modo demo local: el frontend está funcionando; falta conectar VITE_API_URL para consultar el backend.');
      setLoading(false);
      return;
    }

    try {
      const [jobsRes, linksRes] = await Promise.all([
        fetch(`${API_URL}/api/jobs?q=${encodeURIComponent(cleanQuery)}`),
        fetch(`${API_URL}/api/external-links?q=${encodeURIComponent(cleanQuery)}&location=${encodeURIComponent(location)}`)
      ]);

      const jobsResult = await jobsRes.json();
      const linksResult = await linksRes.json();

      if (!jobsResult.success) throw new Error(jobsResult.message || 'No se pudieron obtener empleos');

      setJobs(decorateJobs(jobsResult.data || []));
      setExternalLinks(linksResult.success ? linksResult.data : []);
      setMode('Resultados obtenidos desde el backend de Glovta. Las fuentes externas se identifican en cada vacante.');
    } catch (err) {
      setJobs(decorateJobs(FALLBACK_JOBS));
      setExternalLinks([]);
      setMode('El backend no respondió. Glovta continúa en modo demo para que el flujo del MVP pueda demostrarse.');
      setError('Integraciones externas no disponibles en este momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-card">
      <div className="module-heading">
        <span className="module-kicker">OPPORTUNITY ENGINE</span>
        <h2>Buscá oportunidades y entendé tu compatibilidad.</h2>
        <p>
          Glovta reúne resultados del backend y ofrece accesos contextuales a otros portales.
          El porcentaje de match es una referencia explicable, no una decisión de contratación.
        </p>
      </div>

      <form onSubmit={handleSearch} className="job-search-form">
        <label>
          Puesto o palabra clave
          <input
            type="text"
            placeholder="Ej: Business Analyst, atención al cliente..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Ubicación
          <input
            type="text"
            placeholder="Argentina"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
        <button type="submit" className="primary-action" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar oportunidades'}
        </button>
      </form>

      {!hasProfile && (
        <p className="info-text">
          Completá tu Career Passport para ver un match personalizado en cada oportunidad.
        </p>
      )}
      {mode && <p className="mode-note" role="status">{mode}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="jobs-grid">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>

      <ExternalJobLinks links={externalLinks} />
    </section>
  );
}

export default JobSearch;
