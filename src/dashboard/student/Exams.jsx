import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { getExams } from '../../services/examService';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExams({ limit: 50 });
        setExams(res.data.exams || []);
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
        <h1 className="text-2xl font-bold text-dark">Exams</h1>
        <p className="text-gray-500 text-sm">Your upcoming and past examinations</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>No exams scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-dark">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Date: {new Date(exam.examDate).toLocaleDateString()} · Total Marks: {exam.totalMarks}
                  {exam.course?.title && ` · ${exam.course.title}`}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize self-start ${
                exam.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {exam.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;
