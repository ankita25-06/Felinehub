import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Calculator, CheckSquare, Camera } from 'lucide-react';

// Using your local images from frontend/public
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

  // Rotating Image Showcase State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically cycle through local slide images every 4 seconds
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
      
      {/* TOP SECTION: Side-by-Side Grid for Health Assistant & Rotating Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* 1. AI Health Assistant & Disease Section */}
        <section className="card-panel" style={{ margin: 0 }}>
          <h2><ShieldAlert className="title-icon" /> AI Cat Health Assistant</h2>
          <p className="subtitle">Describe your cat's behavior or health changes in plain sentences.</p>
          
          <form onSubmit={handleDiagnose} className="symptom-form" style={{ marginTop: '1rem' }}>
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
              rows={4}
              style={{ width: '100%', background: 'rgba(147, 161, 243, 0.15)', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '1rem', resize: 'none' }}
            />
            <button type="submit" className="button" disabled={loadingDiagnosis} style={{ width: '100%' }}>
              {loadingDiagnosis ? 'Analyzing Data...' : 'Analyze Health'}
            </button>
          </form>

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

        {/* 2. Dynamic Rotating Image Gallery Showcase */}
        <section className="card-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Camera className="title-icon" /> Feline Gallery Showcase
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--accent)' }}>
              Live Showcase
            </span>
          </div>
          <p className="subtitle">Visual showcase of companion breeds and care aesthetics.</p>

          <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', borderRadius: '12px', border: '1px solid #1e293b', marginTop: '1rem' }}>
            <img
              src={rotatingImages[currentImageIndex]}
              alt="Feline slide showcase"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)', padding: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                Monitoring comfort, health, and breed traits in real-time.
              </p>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1rem', flexWrap: 'wrap' }}>
            {rotatingImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: currentImageIndex === index ? '20px' : '8px',
                  background: currentImageIndex === index ? 'var(--accent)' : '#475569'
                }}
              />
            ))}
          </div>
        </section>

      </div>

      {/* BOTTOM SECTION: Calorie Calculator & Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* 3. Daily Feline Feeding & Calorie Calculator */}
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

        {/* 4. Cat Care & Vaccination Checklist */}
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