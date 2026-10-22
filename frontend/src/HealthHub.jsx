import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Calculator, CheckSquare, Plus, Trash2 } from 'lucide-react';

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
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Calorie Calculator State (Number Input)
  const [weight, setWeight] = useState(4);
  const [activity, setActivity] = useState(1.2);
  const dailyCalories = Math.round(70 * Math.pow(weight || 0, 0.75) * activity);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, task: "FVRCP Core Vaccine (Rhinotracheitis / Calicivirus / Panleukopenia)", done: false },
    { id: 2, task: "Rabies Vaccination (Annual / Triennial Booster)", done: true },
    { id: 3, task: "Feline Leukemia Virus (FeLV) Vaccine", done: false },
    { id: 4, task: "Flea, Tick & Heartworm Prevention Treatment", done: true },
    { id: 5, task: "Routine Internal Deworming Protocol", done: false },
    { id: 6, task: "Annual Vet Wellness Checkup & Dental Exam", done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    
    const newItem = {
      id: Date.now(),
      task: newTaskInput.trim(),
      done: false
    };
    setChecklist([...checklist, newItem]);
    setNewTaskInput('');
  };

  const deleteTask = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
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
      
      {/* TOP SECTION: AI Health Assistant with Pure Image Slider */}
      <section className="card-panel">
        <h2><ShieldAlert className="title-icon" /> AI Cat Health Assistant</h2>
        <p className="subtitle">Describe your cat's behavior or health changes in plain sentences.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center', marginTop: '1.5rem' }}>
          
          {/* LEFT: Input Form */}
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
              rows={7}
              style={{ width: '100%', background: 'rgba(147, 161, 243, 0.15)', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '1rem', resize: 'none' }}
            />
            <button type="submit" className="button" disabled={loadingDiagnosis} style={{ width: '100%' }}>
              {loadingDiagnosis ? 'Analyzing Data...' : 'Analyze Health'}
            </button>
          </form>

          {/* RIGHT: Pure Image Carousel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '320px' }}>
            <img
              src={rotatingImages[currentImageIndex]}
              alt="Cat slide"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                borderRadius: '12px',
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          </div>

        </div>

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

      {/* BOTTOM SECTION: Compact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'stretch' }}>
        
        {/* Compact Calorie Calculator with Weight Input Box */}
        <section className="card-panel" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}><Calculator className="title-icon" size={18} /> Daily Feline Feeding & Calorie Calculator</h3>
            <p className="subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Calculate optimal daily caloric intake based on weight and activity level.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500 }}>Weight (kg)</label>
                <input 
                  type="number" 
                  min="0.5" 
                  max="20" 
                  step="0.1" 
                  value={weight} 
                  onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
                  placeholder="e.g. 4.5"
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', color: '#fff', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500 }}>Activity Level</label>
                <select 
                  value={activity} 
                  onChange={(e) => setActivity(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: '#0f172a', color: '#fff', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '0.85rem' }}
                >
                  <option value={1.0}>Inactive / Senior (1.0x)</option>
                  <option value={1.2}>Normal Adult / Neutered (1.2x)</option>
                  <option value={1.4}>Active / Playful (1.4x)</option>
                  <option value={1.6}>High Energy / Kitten (1.6x)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', border: '1px solid var(--accent)' }}>
            <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '0.95rem' }}>Recommended Daily Energy: <strong>{dailyCalories} kcal / day</strong></h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Split into 2-3 meals daily according to vet recommendations.</p>
          </div>
        </section>

        {/* Compact Care & Vaccination Checklist */}
        <section className="card-panel" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}><CheckSquare className="title-icon" size={18} /> Cat Care & Vaccination Checklist</h3>
            <p className="subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Track recommended core vaccines or add your custom health reminders.</p>

            {/* Add Custom Task Form */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginTop: '0.85rem' }}>
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add custom vaccine or care item..."
                style={{ flex: 1, padding: '8px 12px', background: 'rgba(147, 161, 243, 0.15)', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
              <button 
                type="submit" 
                className="button"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', background: 'var(--accent)', color: '#000', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add
              </button>
            </form>

            {/* Compact List with Styled Slim Scrollbar */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px', 
                marginTop: '0.85rem', 
                maxHeight: '180px', 
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#334155 transparent'
              }}
            >
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '8px 12px', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '8px', 
                    border: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => toggleCheck(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                  >
                    <input type="checkbox" checked={item.done} readOnly style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                    <span style={{ 
                      fontSize: '0.85rem', 
                      textDecoration: item.done ? 'line-through' : 'none',
                      opacity: item.done ? 0.6 : 1 
                    }}>
                      {item.task}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(item.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', opacity: 0.7 }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}