// Genera enlaces de búsqueda directa a portales que no ofrecen API pública
// (LinkedIn Jobs, Indeed, ZonaJobs, Computrabajo). No devuelven datos de vacantes
// -- eso requeriría un convenio comercial con cada plataforma -- pero sí evitan que
// el usuario tenga que volver a escribir la búsqueda en cada sitio.
const PLATFORMS = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        buildUrl: (query, location) =>
            `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${location ? `&location=${encodeURIComponent(location)}` : ''}`
    },
    {
        id: 'indeed',
        name: 'Indeed',
        buildUrl: (query, location) =>
            `https://ar.indeed.com/jobs?q=${encodeURIComponent(query)}${location ? `&l=${encodeURIComponent(location)}` : ''}`
    },
    {
        id: 'zonajobs',
        name: 'ZonaJobs',
        buildUrl: (query) =>
            `https://www.zonajobs.com.ar/empleos-busqueda-${encodeURIComponent(query.trim().replace(/\s+/g, '-').toLowerCase())}.html`
    },
    {
        id: 'computrabajo',
        name: 'Computrabajo',
        buildUrl: (query) =>
            `https://www.computrabajo.com.ar/trabajo-de-${encodeURIComponent(query.trim().replace(/\s+/g, '-').toLowerCase())}`
    }
];

module.exports = {
    getLinks: (query, location = '') => {
        return PLATFORMS.map(platform => ({
            id: platform.id,
            name: platform.name,
            url: platform.buildUrl(query, location)
        }));
    }
};
