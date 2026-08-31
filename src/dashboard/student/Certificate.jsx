import { useState, useEffect } from 'react';
import { FaCertificate, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { getCertificates } from '../../services/certificateService';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCertificates();
        setCertificates(res.data.certificates || []);
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

  const validCert = certificates.find((c) => c.status === 'valid');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Certificate</h1>
        <p className="text-gray-500 text-sm">View your course completion certificate</p>
      </div>

      {validCert ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-primary to-[#0a3a63] p-6 text-white text-center">
            <FaCertificate className="text-4xl mx-auto mb-2 opacity-80" />
            <h2 className="text-xl font-bold">Certificate of Completion</h2>
            <p className="text-white/70 text-sm mt-1">OPEN IT INSTITUTE</p>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-success font-semibold mb-4">
              <FaCheckCircle /> Valid Certificate
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Certificate ID</span>
              <span className="font-mono font-semibold text-primary">{validCert.certificateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Course</span>
              <span className="font-medium text-dark">{validCert.course?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-dark">{validCert.duration || validCert.course?.duration || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Completion Date</span>
              <span className="font-medium text-dark">{new Date(validCert.completionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issue Date</span>
              <span className="font-medium text-dark">{new Date(validCert.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verification Code</span>
              <span className="font-mono text-xs text-gray-600">{validCert.verificationCode}</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <a
                href={`/verify-certificate`}
                className="block text-center text-sm text-primary font-medium hover:underline"
              >
                Verify on public page →
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-4">
            <FaCertificate className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Certificate Not Available Yet</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your certificate will be issued by the admin after successful course completion.
            Complete all modules and clear your dues.
          </p>
          <div className="bg-light rounded-xl p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg">In Progress</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
