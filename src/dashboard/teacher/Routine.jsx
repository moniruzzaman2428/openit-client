import { useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getBatches } from '../../services/batchService';

const WEEKDAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Routine = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBatches({ limit: 500, sort: 'time' })
      .then((res) => setBatches(res.data?.batches || []))
      .catch((err) => {
        setBatches([]);
        Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load class routine.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const routine = useMemo(() => WEEKDAYS.map((day) => ({
    day,
    classes: batches.filter((batch) => (batch.days || []).includes(day) && batch.status !== 'cancelled'),
  })), [batches]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Class Routine</h1>
        <p className="text-gray-500 text-sm">Weekly schedule generated from your assigned batches</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {routine.map(({ day, classes }) => (
            <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-secondary/5 px-5 py-3 border-b border-gray-100"><h3 className="font-bold text-dark">{day}</h3></div>
              {classes.length === 0 ? (
                <p className="px-5 py-4 text-sm text-gray-400">No classes</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {classes.map((cls) => (
                    <div key={cls._id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-dark text-sm">{cls.name} — {cls.course?.title || 'Course'}</p>
                        <p className="text-xs text-gray-400">{cls.room || 'No room assigned'}</p>
                      </div>
                      <span className="text-sm font-semibold text-secondary">{cls.time || 'Time not set'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Routine;
