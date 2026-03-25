import { useState, useEffect } from 'react';
import RubricApp from './RubricApp';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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

  async function createSession() {
    setCreating(true);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
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
            onClick={createSession}
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
              onClick={createSession}
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
                onClick={() => setActiveSession(s)}
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
