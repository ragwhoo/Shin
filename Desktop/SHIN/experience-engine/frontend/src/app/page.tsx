'use client';

import { useState } from 'react';
import { postReview } from '@/lib/api';
import { ReviewResponse } from '@/lib/types';

export default function HomePage() {
  const [task, setTask] = useState('');
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!task.trim()) return;
    setLoading(true);
    try { setResult(await postReview(task)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Engineering Experience Engine</h1>
        <p className="text-gray-600 mb-4">Submit a task to receive engineering judgment.</p>
        <div className="flex gap-3">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="e.g., Implement JWT authentication"
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && handleReview()}
          />
          <button onClick={handleReview} disabled={loading || !task.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
            {loading ? 'Reviewing...' : 'Review'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Concepts: {result.concepts.join(', ')}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              result.confidence === 'high' ? 'bg-green-100 text-green-700' :
              result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'}`}>
              {result.confidence}
            </span>
          </div>
          {[
            ['Lessons', result.lessons, 'bg-green-50 border-green-200'],
            ['Warnings', result.warnings, 'bg-yellow-50 border-yellow-200'],
            ['Recommendations', result.recommendations, 'bg-purple-50 border-purple-200'],
          ].map(([title, items, color]) => (
            <div key={title as string} className={`rounded-lg border p-4 ${color}`}>
              <h3 className="font-semibold text-sm mb-2">{title as string}</h3>
              {(items as string[]).length === 0
                ? <p className="text-xs text-gray-400">None</p>
                : <ul className="space-y-1">{(items as string[]).map((s, i) =>
                    <li key={i} className="text-sm">{s}</li>)}
                  </ul>}
            </div>
          ))}
          {result.evidence.length > 0 &&
            <p className="text-xs text-gray-400">Evidence: {result.evidence.join(', ')}</p>}
        </div>
      )}
    </div>
  );
}
