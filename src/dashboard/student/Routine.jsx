const routine = [
  { day: 'Saturday', time: '10:00 AM - 12:00 PM', course: 'Web Development', room: 'Lab 1', teacher: 'Tanvir Ahmed' },
  { day: 'Monday', time: '10:00 AM - 12:00 PM', course: 'Web Development', room: 'Lab 1', teacher: 'Tanvir Ahmed' },
  { day: 'Wednesday', time: '10:00 AM - 12:00 PM', course: 'Web Development', room: 'Lab 1', teacher: 'Tanvir Ahmed' }
];

const Routine = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Class Routine</h1>
        <p className="text-gray-500 text-sm">Your weekly class schedule</p>
      </div>

      <div className="space-y-3">
        {routine.map((cls) => (
          <div
            key={cls.day}
            className={`bg-white rounded-2xl p-5 border shadow-sm ${
              cls.day === today ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-dark">{cls.day}</h3>
                  {cls.day === today && (
                    <span className="text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded-lg">Today</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{cls.course} · {cls.room}</p>
                <p className="text-xs text-gray-400 mt-0.5">Teacher: {cls.teacher}</p>
              </div>
              <span className="text-sm font-bold text-primary">{cls.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Routine;
