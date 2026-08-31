import { FaTools } from 'react-icons/fa';

const Placeholder = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
          <FaTools className="text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">{title}</h2>
        <p className="text-gray-500 text-sm">
          This module will be fully connected to the backend API in upcoming phases.
          The UI structure is ready.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
