const notices = [
  { id: 1, title: 'Monthly Exam on 30th August', category: 'exam', date: '2026-08-28', description: 'Monthly test for Web Development Batch A will be held on 30th August at 10:00 AM.' },
  { id: 2, title: 'Assignment Submission Deadline', category: 'class', date: '2026-08-26', description: 'Submit your React project assignment before 28th August.' },
  { id: 3, title: 'Holiday Notice', category: 'holiday', date: '2026-08-25', description: 'Institute will remain closed on Independence Day.' }
];

const categoryColors = {
  exam: 'bg-orange-100 text-orange-700',
  class: 'bg-blue-100 text-blue-700',
  holiday: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700'
};

const Notices = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Notices</h1>
        <p className="text-gray-500 text-sm">Important announcements for you</p>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${categoryColors[n.category] || categoryColors.general}`}>
                {n.category}
              </span>
              <span className="text-xs text-gray-400">{n.date}</span>
            </div>
            <h3 className="font-bold text-dark mb-1">{n.title}</h3>
            <p className="text-sm text-gray-500">{n.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;
