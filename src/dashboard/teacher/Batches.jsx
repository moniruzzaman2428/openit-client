import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getBatches } from '../../services/batchService';

const statusColors = {
  ongoing: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBatches({ limit: 500, sort: 'name' });
        setBatches(res.data?.batches || []);
      } catch (err) {
        setBatches([]);
        Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load assigned batches.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Batches</h1>
        <p className="text-gray-500 text-sm">Batches assigned to you in the database</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {batches.map((batch) => (
            <div key={batch._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-dark text-lg">{batch.name}</h3>
                  <p className="text-sm text-secondary font-medium">{batch.course?.title || 'Course'}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[batch.status] || statusColors.upcoming}`}>{batch.status}</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <p>Time: <span className="text-dark font-medium">{batch.time || '—'}</span></p>
                <p>Days: <span className="text-dark font-medium">{(batch.days || []).join(', ') || '—'}</span></p>
                <p>Room: <span className="text-dark font-medium">{batch.room || '—'}</span></p>
                <p>Students: <span className="text-dark font-medium">{Number(batch.currentStudents || 0)}/{Number(batch.maximumStudents || 0)}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && batches.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">No batches are assigned to you.</div>}
    </div>
  );
};

export default Batches;
