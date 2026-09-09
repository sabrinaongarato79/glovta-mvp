import React from 'react';

// Iconos simples (trazo único) en vez de logos con marca registrada de terceros:
// cada portal tiene su propio color de acento para que se distingan de un vistazo.
const PLATFORM_STYLES = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  indeed: { label: 'Indeed', color: '#2557A7' },
  zonajobs: { label: 'ZonaJobs', color: '#EA5B0C' },
  computrabajo: { label: 'Computrabajo', color: '#5B2A86' }
};

function ExternalJobLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="external-links">
      <h3 className="external-links-title">Buscar también en otros portales</h3>
      <p className="external-links-note">
        Estos portales no ofrecen una API pública de vacantes, así que te llevan
        directo a tu búsqueda ya armada en su sitio.
      </p>
      <div className="external-links-grid">
        {links.map((link) => {
          const style = PLATFORM_STYLES[link.id] || { label: link.name, color: '#5B6E68' };
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="external-link-pill"
              style={{ borderColor: style.color, color: style.color }}
            >
              {style.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default ExternalJobLinks;
