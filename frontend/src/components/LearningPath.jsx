import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LearningPath() {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/learning-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, currentSkills }),
      });
      const result = await response.json();
      if (result.success) {
        setPlan(result.data);
      } else {
        setError(result.message || 'No se pudo generar la ruta');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generador de Ruta de Aprendizaje (IA)</h2>
      <form onSubmit={handleGenerate} className="form-stack">
        <input
          type="text"
          placeholder="Puesto objetivo (Ej: Full Stack Developer)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Habilidades actuales (Ej: HTML, CSS, JavaScript básico)"
          value={currentSkills}
          onChange={(e) => setCurrentSkills(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generando Plan...' : 'Crear Plan Personalizado'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {plan && (
        <div className="plan-output">
          <h3>Objetivo: {plan.role}</h3>
          <pre>{plan.plan}</pre>
        </div>
      )}
    </div>
  );
}

export default LearningPath;
