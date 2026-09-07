import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

const categoryColors = {
  exam: 'bg-orange-100 text-orange-700',
  class: 'bg-blue-100 text-blue-700',
  holiday: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
  payment: 'bg-amber-100 text-amber-700',
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/notices');
        const list =
          res?.data?.data?.notices ||
          res?.data?.notices ||
          res?.data?.data ||
          [];
        setNotices(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <FaSpinner className="text-2xl text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Notices</h1>
        <p className="text-gray-500 text-sm">Important announcements for you</p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>No notices published yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => {
            const category = (n.category || n.type || 'general').toLowerCase();
            const dateSrc = n.createdAt || n.date || n.publishedAt;
            return (
              <div
                key={n._id || n.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                      categoryColors[category] || categoryColors.general
                    }`}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {dateSrc ? new Date(dateSrc).toLocaleDateString() : ''}
                  </span>
                </div>
                <h3 className="font-bold text-dark mb-1">{n.title}</h3>
                <p className="text-sm text-gray-500">
                  {n.description || n.content || n.message || ''}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notices;