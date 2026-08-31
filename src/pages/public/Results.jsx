import { FaTrophy } from 'react-icons/fa';

const Results = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Results</h1>
          <p className="text-white/80">Published examination results</p>
        </div>
      </section>

      <section className="py-16 bg-light">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <FaTrophy className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Results Coming Soon</h2>
            <p className="text-gray-500 text-sm">
              Published results will appear here. Students can also view their results from the Student Dashboard after logging in.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
