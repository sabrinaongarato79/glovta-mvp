const axios = require('axios');

module.exports = {
    getJobs: async (query) => {
        const apiKey = process.env.JOOBLE_API_KEY;
        if (!apiKey) return [];

        try {
            const response = await axios.post(
                `https://jooble.org/api/${apiKey}`,
                { keywords: query, location: 'Argentina' },
                { timeout: 8000 }
            );
            return (response.data.jobs || []).map((job, idx) => ({
                id: `jooble-${idx}-${Date.now()}`,
                title: job.title,
                company: job.company || 'Confidencial',
                location: job.location,
                description: job.snippet,
                url: job.link,
                source: 'jooble'
            }));
        } catch (error) {
            console.error('Error Jooble:', error.message);
            return [];
        }
    }
};
