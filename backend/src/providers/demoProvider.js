module.exports = {
    getJobs: async (query) => {
        return [
            {
                id: 'demo-1',
                title: `Desarrollador Full Stack (${query || 'General'})`,
                company: 'Tech Solutions Inc.',
                location: 'Remoto',
                description: 'Buscamos desarrollador JavaScript con Node.js y React.',
                url: null,
                source: 'demo'
            },
            {
                id: 'demo-2',
                title: 'Especialista en IA',
                company: 'DataCorp',
                location: 'Buenos Aires',
                description: 'Experiencia en Python, PyTorch y modelos LLM.',
                url: null,
                source: 'demo'
            }
        ];
    }
};
