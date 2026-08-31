import { FaClock, FaCalendarAlt, FaDoorOpen, FaUser, FaUsers } from 'react-icons/fa';

const Batch = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Batch</h1>
        <p className="text-gray-500 text-sm">Your batch information and schedule</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Batch A</h2>
            <p className="text-primary font-medium">Web Development</p>
          </div>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">Ongoing</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: FaClock, label: 'Class Time', value: '10:00 AM - 12:00 PM' },
            { icon: FaCalendarAlt, label: 'Class Days', value: 'Saturday, Monday, Wednesday' },
            { icon: FaDoorOpen, label: 'Room', value: 'Lab 1' },
            { icon: FaUser, label: 'Teacher', value: 'Tanvir Ahmed' },
            { icon: FaUsers, label: 'Total Students', value: '25' },
            { icon: FaCalendarAlt, label: 'Start Date', value: '2026-03-01' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-light">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <item.icon className="text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="font-medium text-dark text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Batch;
