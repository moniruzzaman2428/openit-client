import { useState, useEffect } from 'react';
import { FaSpinner, FaTrophy } from 'react-icons/fa';
import { getResults } from '../../services/resultService';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getResults();
        setResults(res.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Results</h1>
        <p className="text-gray-500 text-sm">Your published examination results</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-3">
            <FaTrophy className="text-xl" />
          </div>
          <p className="text-gray-400">No published results yet.</p>
          <p className="text-xs text-gray-400 mt-1">Results will appear here once your teacher publishes them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Exam</th>
                  <th className="px-5 py-3.5 font-medium">Marks</th>
                  <th className="px-5 py-3.5 font-medium">Grade</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-dark">{r.exam?.title || 'Exam'}</td>
                    <td className="px-5 py-3.5 font-semibold text-dark">{r.marks}/{r.exam?.totalMarks || '?'}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-primary text-lg">{r.grade}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                      {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
