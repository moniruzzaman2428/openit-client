const routine = [
  { day: 'Saturday', classes: [
    { time: '10:00 AM - 12:00 PM', batch: 'Batch A', course: 'Web Development', room: 'Lab 1' },
    { time: '01:00 PM - 03:00 PM', batch: 'Batch C', course: 'Web Design', room: 'Lab 2' },
    { time: '04:30 PM - 06:00 PM', batch: 'Batch E', course: 'Freelancing', room: 'Room 3' }
  ]},
  { day: 'Sunday', classes: [
    { time: '11:30 AM - 01:30 PM', batch: 'Batch F', course: 'Web Development', room: 'Lab 1' }
  ]},
  { day: 'Monday', classes: [
    { time: '10:00 AM - 12:00 PM', batch: 'Batch A', course: 'Web Development', room: 'Lab 1' },
    { time: '01:00 PM - 03:00 PM', batch: 'Batch C', course: 'Web Design', room: 'Lab 2' },
    { time: '04:30 PM - 06:00 PM', batch: 'Batch E', course: 'Freelancing', room: 'Room 3' }
  ]},
  { day: 'Tuesday', classes: [
    { time: '11:30 AM - 01:30 PM', batch: 'Batch F', course: 'Web Development', room: 'Lab 1' }
  ]},
  { day: 'Wednesday', classes: [
    { time: '10:00 AM - 12:00 PM', batch: 'Batch A', course: 'Web Development', room: 'Lab 1' },
    { time: '01:00 PM - 03:00 PM', batch: 'Batch C', course: 'Web Design', room: 'Lab 2' },
    { time: '04:30 PM - 06:00 PM', batch: 'Batch E', course: 'Freelancing', room: 'Room 3' }
  ]},
  { day: 'Thursday', classes: [
    { time: '11:30 AM - 01:30 PM', batch: 'Batch F', course: 'Web Development', room: 'Lab 1' }
  ]}
];

const Routine = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Class Routine</h1>
        <p className="text-gray-500 text-sm">Your weekly teaching schedule</p>
      </div>

      <div className="space-y-4">
        {routine.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-secondary/5 px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-dark">{day.day}</h3>
            </div>
            {day.classes.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-400">No classes</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {day.classes.map((cls, i) => (
                  <div key={i} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-dark text-sm">{cls.batch} — {cls.course}</p>
                      <p className="text-xs text-gray-400">{cls.room}</p>
                    </div>
                    <span className="text-sm font-semibold text-secondary">{cls.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Routine;
