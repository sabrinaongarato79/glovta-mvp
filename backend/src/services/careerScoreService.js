module.exports = {
    calculateScore: (userProfile) => {
        let score = 50;
        if (userProfile.experienceYears > 2) score += 20;
        if (userProfile.skills && userProfile.skills.length > 3) score += 20;
        if (userProfile.hasDegree) score += 10;
        return Math.min(score, 100);
    }
};
