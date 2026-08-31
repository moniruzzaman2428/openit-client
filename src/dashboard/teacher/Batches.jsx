const batches = [
  { id: 1, name: 'Batch A', course: 'Web Development', time: '10:00 AM', days: 'Sat, Mon, Wed', students: 25, room: 'Lab 1', status: 'ongoing' },
  { id: 2, name: 'Batch C', course: 'Web Design', time: '01:00 PM', days: 'Sat, Mon, Wed', students: 18, room: 'Lab 2', status: 'ongoing' },
  { id: 3, name: 'Batch E', course: 'Freelancing', time: '04:30 PM', days: 'Sat, Mon, Wed', students: 28, room: 'Room 3', status: 'ongoing' },
  { id: 4, name: 'Batch F', course: 'Web Development', time: '11:30 AM', days: 'Sun, Tue, Thu', students: 22, room: 'Lab 1', status: 'upcoming' }
];

const Batches = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Batches</h1>
        <p className="text-gray-500 text-sm">Batches assigned to you</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-dark text-lg">{batch.name}</h3>
                <p className="text-sm text-secondary font-medium">{batch.course}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                batch.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {batch.status}
              </span>
            </div>
            <div className="space-y-1.5 text-sm text-gray-500">
              <p>Time: <span className="text-dark font-medium">{batch.time}</span></p>
              <p>Days: <span className="text-dark font-medium">{batch.days}</span></p>
              <p>Room: <span className="text-dark font-medium">{batch.room}</span></p>
              <p>Students: <span className="text-dark font-medium">{batch.students}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batches;
