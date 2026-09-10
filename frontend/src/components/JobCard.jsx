import React from 'react';

function JobCard({ job }) {
  const score = job.match?.score;

  return (
    <article className="job-item">
      <div className="job-item-top">
        <div>
          <span className="source-label">{job.source || 'demo'}</span>
          <h3>{job.title}</h3>
          <p className="company"><strong>{job.company}</strong> · {job.location}</p>
        </div>
        {score !== null && score !== undefined && (
          <div className="match-score" aria-label={`Compatibilidad estimada ${score} por ciento`}>
            <strong>{score}%</strong>
            <span>match</span>
          </div>
        )}
      </div>

      <p className="description">{job.description}</p>

      {job.match?.matched?.length > 0 && (
        <div className="match-details">
          <span>Coincidencias</span>
          <div className="tag-list compact">
            {job.match.matched.slice(0, 5).map((skill) => <b key={skill}>{skill}</b>)}
          </div>
        </div>
      )}

      <div className="job-actions">
        {job.url ? (
          <a href={job.url} target="_blank" rel="noreferrer" className="text-link">
            Ver oferta externa ↗
          </a>
        ) : (
          <span className="demo-label">Vacante de demostración</span>
        )}
      </div>
    </article>
  );
}

export default JobCard;
