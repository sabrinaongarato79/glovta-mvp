import React, { useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const toText = (value = []) => Array.isArray(value) ? value.join(', ') : value;
const toList = (value = '') => value.split(',').map((item) => item.trim()).filter(Boolean);

function localCareerScore(profile) {
  let score = 50;
  if (Number(profile.experienceYears) > 2) score += 20;
  if ((profile.skills || []).length > 3) score += 20;
  if (profile.hasDegree) score += 10;
  return Math.min(score, 100);
}

function ProfilePanel({ profile, onSave }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    goal: profile.goal || '',
    skills: toText(profile.skills),
    languages: toText(profile.languages),
    experienceYears: profile.experienceYears || 0,
    hasDegree: Boolean(profile.hasDegree)
  });
  const [careerScore, setCareerScore] = useState(null);
  const [scoreMode, setScoreMode] = useState('');
  const [message, setMessage] = useState('');

  const preview = useMemo(() => ({
    fullName: form.fullName.trim(),
    goal: form.goal.trim(),
    skills: toList(form.skills),
    languages: toList(form.languages),
    experienceYears: Number(form.experienceYears) || 0,
    hasDegree: Boolean(form.hasDegree)
  }), [form]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSave(preview);
    setMessage('Career Passport guardado en este dispositivo para la demo.');

    if (!API_URL) {
      setCareerScore(localCareerScore(preview));
      setScoreMode('estimación local del MVP');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/career-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceYears: preview.experienceYears,
          skills: preview.skills,
          hasDegree: preview.hasDegree
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setCareerScore(result.data.score);
      setScoreMode('calculado por el backend');
    } catch {
      setCareerScore(localCareerScore(preview));
      setScoreMode('estimación local por contingencia');
    }
  };

  return (
    <div className="module-grid">
      <section className="module-card">
        <div className="module-heading">
          <span className="module-kicker">CAREER PASSPORT</span>
          <h2>Convertí tu experiencia en un perfil estructurado.</h2>
          <p>En el MVP el perfil queda disponible localmente para alimentar matching y aprendizaje.</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Tu nombre" />
          </label>
          <label>
            Objetivo profesional
            <input name="goal" value={form.goal} onChange={updateField} placeholder="Ej: Business Analyst, Customer Success..." />
          </label>
          <label>
            Habilidades
            <input name="skills" value={form.skills} onChange={updateField} placeholder="Excel, SQL, atención al cliente..." />
            <small>Separalas con comas.</small>
          </label>
          <label>
            Idiomas
            <input name="languages" value={form.languages} onChange={updateField} placeholder="Español, inglés, portugués..." />
          </label>

          <div className="form-split">
            <label>
              Años de experiencia
              <input min="0" max="60" type="number" name="experienceYears" value={form.experienceYears} onChange={updateField} />
            </label>
            <label className="check-field">
              <input type="checkbox" name="hasDegree" checked={form.hasDegree} onChange={updateField} />
              <span>Tengo formación terciaria/universitaria</span>
            </label>
          </div>

          <button type="submit" className="primary-action">Guardar Career Passport</button>
          {message && <p className="success-text" role="status">{message}</p>}
        </form>
      </section>

      <aside className="passport-preview" aria-label="Vista previa del Career Passport">
        <span className="passport-label">GLOVTA CAREER PASSPORT</span>
        <h3>{preview.fullName || 'Tu nombre'}</h3>
        <p className="passport-goal">{preview.goal || 'Tu objetivo profesional aparecerá acá.'}</p>

        <div className="passport-section">
          <span>Habilidades</span>
          <div className="tag-list">
            {preview.skills.length ? preview.skills.map((skill) => <b key={skill}>{skill}</b>) : <em>Agregá tus habilidades.</em>}
          </div>
        </div>

        <div className="passport-section">
          <span>Idiomas</span>
          <div className="tag-list">
            {preview.languages.length ? preview.languages.map((language) => <b key={language}>{language}</b>) : <em>Agregá tus idiomas.</em>}
          </div>
        </div>

        {careerScore !== null && (
          <div className="score-panel" aria-live="polite">
            <div>
              <span>Career Score</span>
              <strong>{careerScore}/100</strong>
            </div>
            <p>{scoreMode}. Es una referencia del MVP, no una evaluación laboral definitiva.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default ProfilePanel;
