import React from 'react';

const PLATFORM_STYLES = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  indeed: { label: 'Indeed', color: '#2557A7' },
  zonajobs: { label: 'ZonaJobs', color: '#EA5B0C' },
  computrabajo: { label: 'Computrabajo', color: '#6C3F98' }
};

function ExternalJobLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <aside className="external-links">
      <span className="module-kicker">NAVEGACIÓN EXTERNA</span>
      <h3>Continuá la misma búsqueda en otros portales.</h3>
      <p>
        Estos accesos no importan vacantes ni simulan APIs. Glovta construye la búsqueda y te lleva al portal original.
      </p>
      <div className="external-links-grid">
        {links.map((link) => {
          const style = PLATFORM_STYLES[link.id] || { label: link.name, color: '#56645f' };
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="external-link"
              style={{ '--platform-color': style.color }}
            >
              <span>{style.label}</span>
              <b>↗</b>
            </a>
          );
        })}
      </div>
    </aside>
  );
}

export default ExternalJobLinks;
