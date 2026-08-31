const courses = [
  { id: 1, title: 'Web Development', batches: 2, students: 48, duration: '6 Months' },
  { id: 2, title: 'Web Design', batches: 1, students: 18, duration: '4 Months' },
  { id: 3, title: 'Freelancing', batches: 2, students: 50, duration: '2 Months' },
  { id: 4, title: 'Basic Computer', batches: 1, students: 26, duration: '3 Months' }
];

const Courses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Courses</h1>
        <p className="text-gray-500 text-sm">Courses assigned to you</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold mb-4">
              {course.title.charAt(0)}
            </div>
            <h3 className="font-bold text-dark mb-1">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.duration}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{course.batches} batches</span>
              <span>{course.students} students</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
