import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { getAttendance } from '../../services/attendanceService';

const statusColors = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700'
};

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAttendance();
        setRecords(res.data.attendance || []);
        setStats(res.stats || { total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
      } catch (err) {
        console.error(err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
        <h1 className="text-2xl font-bold text-dark">My Attendance</h1>
        <p className="text-gray-500 text-sm">Track your class attendance</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: stats.total, color: 'text-dark' },
          { label: 'Present', value: stats.present, color: 'text-success' },
          { label: 'Absent', value: stats.absent, color: 'text-danger' },
          { label: 'Percentage', value: `${stats.percentage}%`, color: 'text-primary' }
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Attendance Progress</span>
          <span className={`font-bold ${stats.percentage >= 80 ? 'text-success' : stats.percentage >= 60 ? 'text-accent' : 'text-danger'}`}>
            {stats.percentage}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              stats.percentage >= 80 ? 'bg-gradient-to-r from-success to-emerald-400' :
              stats.percentage >= 60 ? 'bg-gradient-to-r from-accent to-amber-400' :
              'bg-gradient-to-r from-danger to-red-400'
            }`}
            style={{ width: `${Math.min(stats.percentage, 100)}%` }}
          />
        </div>
        {stats.late > 0 && (
          <p className="text-xs text-gray-400 mt-2">Late arrivals: {stats.late} (counted as 0.5 present)</p>
        )}
      </div>

      {/* Records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-dark text-sm">Attendance Records</h3>
        </div>
        {records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No attendance records yet.</p>
            <p className="text-xs mt-1">Records will appear after your teacher marks attendance.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {records.map((r) => (
              <div key={r._id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <span className="text-sm text-gray-600">
                    {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  {r.batch?.name && (
                    <span className="text-xs text-gray-400 ml-2">{r.batch.name}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[r.status]}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
