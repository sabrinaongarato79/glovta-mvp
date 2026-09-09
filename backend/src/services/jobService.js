const supabase = require('../supabase');
const demoProvider = require('../providers/demoProvider');
const adzunaProvider = require('../providers/adzunaProvider');
const joobleProvider = require('../providers/joobleProvider');

module.exports = {
    fetchJobs: async (query) => {
        const [demoJobs, adzunaJobs, joobleJobs] = await Promise.all([
            demoProvider.getJobs(query),
            adzunaProvider.getJobs(query),
            joobleProvider.getJobs(query)
        ]);

        const allJobs = [...demoJobs, ...adzunaJobs, ...joobleJobs];

        if (allJobs.length > 0) {
            const { error } = await supabase.from('jobs').upsert(allJobs, { onConflict: 'id' });
            if (error) {
                console.error('Error al persistir jobs en Supabase:', error.message);
            }
        }

        return allJobs;
    },

    getStoredJobs: async () => {
        const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Error al leer jobs de Supabase:', error.message);
            return [];
        }
        return data;
    }
};
