import React, { useState } from 'react';
import JobCard from './JobCard';
import ExternalJobLinks from './ExternalJobLinks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function JobSearch() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, linksRes] = await Promise.all([
        fetch(`${API_URL}/api/jobs?q=${encodeURIComponent(query)}`),
        fetch(`${API_URL}/api/external-links?q=${encodeURIComponent(query)}`)
      ]);
      const jobsResult = await jobsRes.json();
      const linksResult = await linksRes.json();

      if (jobsResult.success) {
        setJobs(jobsResult.data);
      } else {
        setError(jobsResult.message || 'No se pudieron obtener los empleos');
      }

      if (linksResult.success) {
        setExternalLinks(linksResult.data);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Buscador de Empleos Integrado</h2>
      <form onSubmit={handleSearch} className="form-group">
        <input
          type="text"
          placeholder="Ej: React, Node.js, Python..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Buscar Puestos'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <ExternalJobLinks links={externalLinks} />
    </div>
  );
}

export default JobSearch;
