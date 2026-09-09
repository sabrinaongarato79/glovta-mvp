module.exports = {
    matchJobToUser: (job, userSkills) => {
        if (!userSkills || userSkills.length === 0) return 50;
        const jobText = `${job.title} ${job.description || ''}`.toLowerCase();
        let matches = 0;
        userSkills.forEach(skill => {
            if (jobText.includes(String(skill).toLowerCase())) matches++;
        });
        return Math.round((matches / userSkills.length) * 100);
    }
};
