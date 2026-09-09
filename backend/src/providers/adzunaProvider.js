const axios = require('axios');

module.exports = {
    getJobs: async (query) => {
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;
        if (!appId || !appKey) return [];

        try {
            const url = `https://api.adzuna.com/v1/api/jobs/es/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(query)}`;
            const response = await axios.get(url, { timeout: 8000 });
            return response.data.results.map(job => ({
                id: `adzuna-${job.id}`,
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                description: job.description,
                url: job.redirect_url,
                source: 'adzuna'
            }));
        } catch (error) {
            console.error('Error Adzuna:', error.message);
            return [];
        }
    }
};
