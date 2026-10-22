import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Calculator, CheckSquare } from 'lucide-react';

const rotatingImages = [
  "/cat-slide (1).jpeg",
  "/cat-slide (2).jpeg",
  "/cat-slide (3).jpeg",
  "/cat-slide (4).jpeg",
  "/cat-slide (6).jpeg",
  "/cat-slide (7).jpeg",
  "/cat-slide (8).jpeg",
  "/cat-slide (9).jpeg"
];

export default function HealthHub({ backendUrl }) {
  const [symptomInput, setSymptomInput] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

  // Rotating Image Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % rotatingImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Calorie Calculator State
  const [weight, setWeight] = useState(4);
  const [activity, setActivity] = useState(1.2);
  const dailyCalories = Math.round(70 * Math.pow(weight, 0.75) * activity);

  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Annual Vet Checkup & Exam", done: false },
    { id: 2, task: "Flea & Tick Prevention Treatment", done: true },
    { id: 3, task: "Core Vaccinations (Rabies / FVRCP)", done: false },
    { id: 4, task: "Dental Hygiene & Teeth Brushing", done: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setLoadingDiagnosis(true);
    try {
      const response = await fetch(`${backendUrl}/api/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: symptomInput }),
      });
      const data = await response.json();
      setDiagnosisResult(data);
    } catch (error) {
      console.error("Diagnosis error:", error);
      setDiagnosisResult({
        prediction: "Could not connect to the backend service. Please try again in 30 seconds.",
        confidence: "Connection Error"
      });
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* SINGLE COMBINED BOX: AI Health Assistant with Pure Image Slider Aligned Horizontally */}
      <section className="card-panel">
        <h2><ShieldAlert className="title-icon" /> AI Cat Health Assistant</h2>
        <p className="subtitle">Describe your cat's behavior or health changes in plain sentences.</p>

        {/* Horizontal Split Inside the Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center', marginTop: '1.5rem' }}>
          
          {/* LEFT: Input Form & Submit Button */}
          <form onSubmit={handleDiagnose} className="symptom-form">
            <textarea
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleDiagnose(e);
                }
              }}
              placeholder="Type symptoms here..."
              rows={5}
              style={{ width: '100%', background: 'rgba(147, 161, 243, 0.15)', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '1rem', resize: 'none' }}
            />
            <button type="submit" className="button" disabled={loadingDiagnosis} style={{ width: '100%' }}>
              {loadingDiagnosis ? 'Analyzing Data...' : 'Analyze Health'}
            </button>
          </form>

          {/* RIGHT: Pure Image Carousel (No text overlays or headers) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src={rotatingImages[currentImageIndex]}
                alt="Cat slide"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>

            {/* Pagination Dots */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '0.8rem' }}>
              {rotatingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: currentImageIndex === index ? '18px' : '6px',
                    background: currentImageIndex === index ? 'var(--accent)' : '#475569'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Diagnosis Output (spans full width under both) */}
        {diagnosisResult && (
          <div className="result-display animate-slide-up" style={{ marginTop: '1.5rem' }}>
            <h3><Activity size={20} /> Analysis Result:</h3>
            <p className="prediction-text" style={{ whiteSpace: "pre-line", lineHeight: '1.6' }}>
              {diagnosisResult.prediction}
            </p>
            <span className="confidence-tag">{diagnosisResult.confidence}</span>
            <p className="disclaimer">*Always consult a certified veterinarian for official medical evaluations.</p>
          </div>
        )}
      </section>

      {/* BOTTOM SECTION: Calorie Calculator & Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Calorie Calculator */}
        <section className="card-panel" style={{ margin: 0 }}>
          <h3><Calculator className="title-icon" /> Daily Feline Feeding & Calorie Calculator</h3>
          <p className="subtitle">Calculate optimal daily caloric intake based on weight and activity level.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Cat's Weight: {weight} kg</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.5" 
                value={weight} 
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Activity Level</label>
              <select 
                value={activity} 
                onChange={(e) => setActivity(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', borderRadius: '8px', border: '1px solid #1e293b' }}
              >
                <option value={1.0}>Inactive / Senior (1.0x)</option>
                <option value={1.2}>Normal Adult / Neutered (1.2x)</option>
                <option value={1.4}>Active / Playful (1.4x)</option>
                <option value={1.6}>High Energy / Kitten (1.6x)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', border: '1px solid var(--accent)' }}>
            <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '1.05rem' }}>Recommended Daily Energy: <strong>{dailyCalories} kcal / day</strong></h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Split into 2-3 meals daily according to vet recommendations.</p>
          </div>
        </section>

        {/* Care & Vaccination Checklist */}
        <section className="card-panel" style={{ margin: 0 }}>
          <h3><CheckSquare className="title-icon" /> Cat Care & Vaccination Checklist</h3>
          <p className="subtitle">Keep track of essential health milestones and routine treatments.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1.5rem' }}>
            {checklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 18px', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '10px', 
                  border: '1px solid #1e293b',
                  cursor: 'pointer',
                  textDecoration: item.done ? 'line-through' : 'none',
                  opacity: item.done ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <input type="checkbox" checked={item.done} readOnly style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '1rem' }}>{item.task}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}