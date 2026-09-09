const express = require('express');
const cors = require('cors');
require('dotenv').config();

const jobService = require('./services/jobService');
const learningPathService = require('./services/learningPathService');
const matchingService = require('./services/matchingService');
const careerScoreService = require('./services/careerScoreService');
const paymentService = require('./services/paymentService');
const externalLinksService = require('./services/externalLinksService');

const app = express();
const PORT = process.env.PORT || 5000;

// En desarrollo local (sin FRONTEND_URL configurada) acepta cualquier origen.
// En producción, configurá FRONTEND_URL con la URL real de Vercel para que el
// backend solo responda a pedidos que vengan de tu propio frontend.
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Si el body no es JSON válido, express.json() dispara un error ANTES de llegar
// a cualquier ruta. Sin este middleware, Express responde con su página HTML
// de error por defecto, que incluye el stack trace completo del servidor.
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no es JSON válido' });
    }
    next(err);
});

function handleError(res, error, publicMessage = 'Error interno del servidor') {
    console.error(error);
    res.status(500).json({ success: false, message: publicMessage });
}

// --- Jobs ---
app.get('/api/jobs', async (req, res) => {
    try {
        const query = (req.query.q || '').toString().trim();
        const jobs = await jobService.fetchJobs(query);
        res.json({ success: true, data: jobs });
    } catch (error) {
        handleError(res, error, 'No se pudo obtener la lista de empleos');
    }
});

app.get('/api/jobs/history', async (req, res) => {
    try {
        const jobs = await jobService.getStoredJobs();
        res.json({ success: true, data: jobs });
    } catch (error) {
        handleError(res, error, 'No se pudo obtener el historial de empleos');
    }
});

// --- Learning path ---
app.post('/api/learning-path', async (req, res) => {
    try {
        const { targetRole, currentSkills, userId } = req.body;

        if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
            return res.status(400).json({ success: false, message: 'targetRole es requerido y debe ser texto' });
        }
        if (currentSkills !== undefined && typeof currentSkills !== 'string') {
            return res.status(400).json({ success: false, message: 'currentSkills debe ser texto' });
        }

        const pathData = await learningPathService.generatePath(targetRole.trim(), currentSkills || '', userId || null);
        res.json({ success: true, data: pathData });
    } catch (error) {
        handleError(res, error, 'No se pudo generar la ruta de aprendizaje');
    }
});

// --- Enlaces externos (LinkedIn, Indeed, ZonaJobs, Computrabajo) ---
// No son APIs de datos: ninguna de las cuatro ofrece API pública de vacantes,
// así que este endpoint genera únicamente los enlaces de búsqueda ya armados.
app.get('/api/external-links', (req, res) => {
    try {
        const query = (req.query.q || '').toString().trim();
        const location = (req.query.location || '').toString().trim();

        if (!query) {
            return res.status(400).json({ success: false, message: 'q (búsqueda) es requerido' });
        }

        const links = externalLinksService.getLinks(query, location);
        res.json({ success: true, data: links });
    } catch (error) {
        handleError(res, error, 'No se pudieron generar los enlaces externos');
    }
});

// --- Matching ---
app.post('/api/match', (req, res) => {
    try {
        const { job, userSkills } = req.body;

        if (!job || typeof job !== 'object') {
            return res.status(400).json({ success: false, message: 'job es requerido y debe ser un objeto' });
        }
        if (userSkills !== undefined && !Array.isArray(userSkills)) {
            return res.status(400).json({ success: false, message: 'userSkills debe ser un arreglo de strings' });
        }

        const score = matchingService.matchJobToUser(job, userSkills || []);
        res.json({ success: true, data: { score } });
    } catch (error) {
        handleError(res, error, 'No se pudo calcular el matching');
    }
});

// --- Career score ---
app.post('/api/career-score', (req, res) => {
    try {
        const { experienceYears, skills, hasDegree } = req.body;

        if (experienceYears !== undefined && typeof experienceYears !== 'number') {
            return res.status(400).json({ success: false, message: 'experienceYears debe ser numérico' });
        }
        if (skills !== undefined && !Array.isArray(skills)) {
            return res.status(400).json({ success: false, message: 'skills debe ser un arreglo' });
        }

        const score = careerScoreService.calculateScore({
            experienceYears: experienceYears || 0,
            skills: skills || [],
            hasDegree: !!hasDegree
        });
        res.json({ success: true, data: { score } });
    } catch (error) {
        handleError(res, error, 'No se pudo calcular el career score');
    }
});

// --- Pagos (stub) ---
app.post('/api/payment/preference', async (req, res) => {
    try {
        const { item } = req.body;
        if (!item) {
            return res.status(400).json({ success: false, message: 'item es requerido' });
        }
        const preference = await paymentService.createPreference(item);
        res.json({ success: true, data: preference });
    } catch (error) {
        handleError(res, error, 'No se pudo generar la preferencia de pago');
    }
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Red de seguridad final: cualquier error no controlado por una ruta específica
// cae aquí en vez de llegar al manejador de error HTML por defecto de Express.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor backend Glockta corriendo en http://localhost:${PORT}`);
});
