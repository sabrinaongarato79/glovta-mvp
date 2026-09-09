import React from 'react';

function JobCard({ job }) {
  return (
    <div className="job-item">
      <h3>{job.title}</h3>
      <p className="company"><strong>{job.company}</strong> — {job.location}</p>
      <p className="description">{job.description}</p>
      <span className="badge">{job.source}</span>
      {job.url && (
        <a href={job.url} target="_blank" rel="noreferrer" className="job-link">Ver oferta</a>
      )}
    </div>
  );
}

export default JobCard;
