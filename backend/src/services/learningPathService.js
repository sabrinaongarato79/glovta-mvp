const supabase = require('../supabase');
const aiService = require('./aiService');

module.exports = {
    generatePath: async (targetRole, currentSkills, userId = null) => {
        const prompt = `Crea un plan de aprendizaje paso a paso para convertirse en "${targetRole}". Habilidades actuales: "${currentSkills}".`;
        const plan = await aiService.generateText(prompt);

        const result = {
            role: targetRole,
            plan: plan || 'Plan estándar: 1. Fundamentos, 2. Práctica, 3. Proyectos reales.'
        };

        const { error } = await supabase.from('learning_paths').insert([{
            user_id: userId,
            target_role: targetRole,
            current_skills: currentSkills,
            plan: result.plan
        }]);

        if (error) {
            console.error('Error al guardar learning_path en Supabase:', error.message);
        }

        return result;
    }
};
