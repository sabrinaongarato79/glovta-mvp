import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function localPlan(targetRole, currentSkills) {
  return {
    role: targetRole,
    plan:
      `Semana 1 · Diagnóstico de brechas para ${targetRole}\n` +
      `Semana 2 · Fundamentos prioritarios según: ${currentSkills || 'perfil inicial'}\n` +
      'Semana 3 · Práctica guiada y proyecto aplicado\n' +
      'Semana 4 · Portfolio, CV y preparación de entrevistas'
  };
}

function LearningPath({ profile }) {
  const [targetRole, setTargetRole] = useState(profile.goal || '');
  const [currentSkills, setCurrentSkills] = useState((profile.skills || []).join(', '));
  const [plan, setPlan] = useState(null);
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!targetRole.trim()) {
      setError('Indicá el puesto u objetivo profesional.');
      return;
    }

    setLoading(true);
    setError(null);

    if (!API_URL) {
      setPlan(localPlan(targetRole.trim(), currentSkills.trim()));
      setMode('Ruta simulada por el MVP. La IA real todavía no está conectada en producción.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/learning-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, currentSkills })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'No se pudo generar la ruta');
      setPlan(result.data);
      setMode('Ruta generada por el servicio actual del backend. En esta versión, el servicio de IA está simulado.');
    } catch {
      setPlan(localPlan(targetRole.trim(), currentSkills.trim()));
      setMode('El backend no respondió; se muestra una ruta local de contingencia.');
      setError('La integración del backend no está disponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-card">
      <div className="module-heading">
        <span className="module-kicker">LEARNING PATH</span>
        <h2>Convertí una brecha en un próximo paso concreto.</h2>
        <p>
          El MVP genera una ruta de aprendizaje a partir del objetivo profesional y las habilidades actuales.
          La IA real queda como integración posterior sin cambiar la interfaz del servicio.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="learning-form">
        <label>
          Objetivo profesional
          <input
            type="text"
            placeholder="Ej: Full Stack Developer"
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
          />
        </label>
        <label>
          Habilidades actuales
          <input
            type="text"
            placeholder="HTML, CSS, JavaScript..."
            value={currentSkills}
            onChange={(event) => setCurrentSkills(event.target.value)}
          />
        </label>
        <button type="submit" className="primary-action" disabled={loading}>
          {loading ? 'Generando...' : 'Crear ruta'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {mode && <p className="mode-note">{mode}</p>}

      {plan && (
        <div className="plan-output">
          <span className="plan-label">OBJETIVO</span>
          <h3>{plan.role}</h3>
          <pre>{plan.plan}</pre>
        </div>
      )}
    </section>
  );
}

export default LearningPath;
