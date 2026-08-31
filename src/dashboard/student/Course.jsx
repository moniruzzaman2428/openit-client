import { FaClock, FaUser, FaTag, FaCheckCircle } from 'react-icons/fa';

const Course = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Course</h1>
        <p className="text-gray-500 text-sm">Your enrolled course details</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white">Web Development</h2>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-gray-600 leading-relaxed">
            Become a full-stack web developer. Learn HTML, CSS, JavaScript, React, Node.js and build real-world applications.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
              <FaClock className="text-primary" />
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="font-medium text-dark text-sm">6 Months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
              <FaUser className="text-primary" />
              <div>
                <p className="text-xs text-gray-400">Instructor</p>
                <p className="font-medium text-dark text-sm">Tanvir Ahmed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
              <FaTag className="text-primary" />
              <div>
                <p className="text-xs text-gray-400">Fee</p>
                <p className="font-medium text-dark text-sm">৳15,300</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-dark mb-3">Curriculum</h3>
            <ul className="space-y-2">
              {['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js & Express', 'MongoDB', 'REST APIs', 'Deployment'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-success text-xs" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
