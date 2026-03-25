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
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="text-lg font-bold">JetStart Training Rubric</div>
        <div className="text-xs text-gray-400">Trainer portal</div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800">Training Sessions</h2>
          <button
            onClick={createSession}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded transition disabled:opacity-50"
          >
            {creating ? 'Creating…' : '+ New Session'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
        )}

        {loading ? (
          <div className="text-gray-400 text-sm">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="text-gray-500 text-sm mb-3">No sessions yet.</div>
            <button
              onClick={createSession}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded transition"
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
                className="bg-white rounded-lg border border-gray-200 px-4 py-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-sm text-gray-800">
                    {s.cohort_name || <span className="text-gray-400 italic">Untitled Cohort</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 space-x-2">
                    {s.trainer && <span>Trainer: <strong>{s.trainer}</strong></span>}
                    {s.dates && <span>· {s.dates}</span>}
                    <span>· Updated {new Date(s.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={e => deleteSession(s.id, e)}
                  className="text-gray-300 group-hover:text-gray-400 hover:!text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50 transition"
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
