import { useState, useEffect } from 'react';
import RubricApp from './RubricApp';

function NewSessionModal({ onConfirm, onCancel }) {
  const [count, setCount] = useState('');
  const [names, setNames] = useState([]);
  const [step, setStep] = useState('count'); // 'count' | 'names'

  function handleCountSubmit(e) {
    e.preventDefault();
    const n = parseInt(count);
    if (!n || n < 1 || n > 20) return;
    setNames(Array.from({ length: n }, () => ''));
    setStep('names');
  }

  function handleNamesSubmit(e) {
    e.preventDefault();
    const filled = names.map((n, i) => n.trim() || `Student ${i + 1}`);
    onConfirm(filled);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(15,31,13,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Modal header */}
        <div className="px-6 py-4" style={{ backgroundColor: '#0F1F0D' }}>
          <div className="text-white font-bold text-base">New Training Session</div>
          <div className="text-xs mt-0.5" style={{ color: '#ACAA93' }}>
            {step === 'count' ? 'How many participants?' : `Enter participant names`}
          </div>
        </div>

        <div className="px-6 py-5">
          {step === 'count' ? (
            <form onSubmit={handleCountSubmit}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0F1F0D' }}>
                Number of participants
              </label>
              <input
                autoFocus
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={e => setCount(e.target.value)}
                placeholder="e.g. 8"
                className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#E2E1D3' }}
                onFocus={e => e.target.style.borderColor = '#3CD567'}
                onBlur={e => e.target.style.borderColor = '#E2E1D3'}
              />
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={onCancel}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: '#E2E1D3', color: '#666958' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: '#3CD567', color: '#0F1F0D' }}>
                  Next →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNamesSubmit}>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {names.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5 text-right" style={{ color: '#ACAA93' }}>{i + 1}</span>
                    <input
                      autoFocus={i === 0}
                      type="text"
                      value={name}
                      onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }}
                      placeholder={`Student ${i + 1}`}
                      className="flex-1 border-2 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                      style={{ borderColor: '#E2E1D3' }}
                      onFocus={e => e.target.style.borderColor = '#3CD567'}
                      onBlur={e => e.target.style.borderColor = '#E2E1D3'}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setStep('count')}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: '#E2E1D3', color: '#666958' }}>
                  ← Back
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: '#3CD567', color: '#0F1F0D' }}>
                  Create Session
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchSessions(); }, []);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions');
      setSessions(await res.json());
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  async function createSession(students) {
    setCreating(true);
    setShowModal(false);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    const session = await res.json();
    setCreating(false);
    setActiveSession(session);
  }

  async function deleteSession(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this session? This cannot be undone.')) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    setSessions(s => s.filter(x => x.id !== id));
  }

  if (activeSession) {
    return (
      <RubricApp
        session={activeSession}
        onBack={() => { setActiveSession(null); fetchSessions(); }}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#FBFAF1' }}>

      {showModal && (
        <NewSessionModal
          onConfirm={createSession}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Header */}
      <div style={{ backgroundColor: '#0F1F0D' }} className="px-6 py-4 flex items-center gap-3">
        <img src="/logo.png" alt="JetStart" className="h-10 w-auto" />
        <div>
          <div className="text-white text-lg font-bold tracking-tight">JetStart Training Rubric</div>
          <div className="text-xs" style={{ color: '#ACAA93' }}>Trainer portal</div>
        </div>
      </div>

      {/* Hero band */}
      <div style={{ backgroundColor: '#113823' }} className="px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-semibold">Training Sessions</div>
            <div className="text-xs mt-0.5" style={{ color: '#CBFF8A' }}>Select a session or create a new cohort</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={creating}
            className="px-4 py-2 text-sm font-bold rounded transition disabled:opacity-50"
            style={{ backgroundColor: '#3CD567', color: '#0F1F0D' }}
          >
            {creating ? 'Creating…' : '+ New Session'}
          </button>
        </div>
      </div>

      {/* Session list */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
        )}

        {loading ? (
          <div className="text-sm" style={{ color: '#666958' }}>Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-10 text-center" style={{ borderColor: '#E2E1D3' }}>
            <div className="text-sm mb-3" style={{ color: '#666958' }}>No sessions yet.</div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-bold rounded transition"
              style={{ backgroundColor: '#3CD567', color: '#0F1F0D' }}
            >
              Create your first session
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={async () => {
                  const res = await fetch(`/api/sessions/${s.id}`);
                  setActiveSession(await res.json());
                }}
                className="bg-white rounded-xl border px-4 py-3 cursor-pointer transition flex items-center justify-between group hover:shadow-md"
                style={{ borderColor: '#E2E1D3' }}
              >
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#0F1F0D' }}>
                    {s.cohort_name || <span style={{ color: '#ACAA93' }} className="italic">Untitled Cohort</span>}
                  </div>
                  <div className="text-xs mt-0.5 space-x-2" style={{ color: '#666958' }}>
                    {s.trainer && <span>Trainer: <strong>{s.trainer}</strong></span>}
                    {s.dates && <span>· {s.dates}</span>}
                    <span>· Updated {new Date(s.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={e => deleteSession(s.id, e)}
                  className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-500"
                  style={{ color: '#ACAA93' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
