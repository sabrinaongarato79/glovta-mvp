// NOTA DE ALCANCE (MVP): este servicio simula la generación de contenido con IA.
// En producción se conectaría a la API de OpenAI o Claude usando la misma interfaz,
// reemplazando únicamente la función generateText.
module.exports = {
    generateText: async (prompt) => {
        return `Ruta generada a partir de: "${prompt}"\n` +
            `- Semana 1: Fundamentos y diagnóstico de brechas\n` +
            `- Semana 2: Práctica dirigida y proyectos guiados\n` +
            `- Semana 3: Proyecto final y preparación de entrevistas`;
    }
};
