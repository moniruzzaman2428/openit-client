import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { verifyCertificate } from '../../services/certificateService';
import SEO from '../../components/seo/SEO';

const VerifyCertificate = () => {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await verifyCertificate(certId.trim());
      setResult(res);
    } catch (err) {
      setResult({
        valid: false,
        message: err.response?.data?.message || 'Verification failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO title="Verify Certificate" description="Verify the authenticity of OPEN IT INSTITUTE certificates. Enter Certificate ID or Verification Code." path="/verify-certificate" />
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Verify Certificate</h1>
          <p className="text-white/80">Check the authenticity of any Open IT Institute certificate</p>
        </div>
      </section>

      <section className="py-16 bg-light">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-3">
                <FaCertificate className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-dark">Certificate Verification</h2>
              <p className="text-sm text-gray-500 mt-1">Enter Certificate ID or Verification Code</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. CERT26123456"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-center font-mono tracking-wider uppercase"
              />
              <button
                type="submit"
                disabled={loading || !certId.trim()}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <><FaSearch /> Verify</>
                )}
              </button>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-5 rounded-xl border ${
                  result.valid
                    ? 'bg-success/5 border-success/20'
                    : 'bg-danger/5 border-danger/20'
                }`}
              >
                {result.valid ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-success font-bold">
                      <FaCheckCircle /> VALID CERTIFICATE
                    </div>
                    <div className="text-sm space-y-1.5 text-gray-600">
                      <p><span className="font-medium text-dark">Student:</span> {result.data.studentName}</p>
                      <p><span className="font-medium text-dark">Student ID:</span> {result.data.studentId}</p>
                      <p><span className="font-medium text-dark">Course:</span> {result.data.course}</p>
                      <p><span className="font-medium text-dark">Certificate ID:</span> {result.data.certificateId}</p>
                      <p><span className="font-medium text-dark">Duration:</span> {result.data.duration || 'N/A'}</p>
                      <p><span className="font-medium text-dark">Completion:</span> {new Date(result.data.completionDate).toLocaleDateString()}</p>
                      <p><span className="font-medium text-dark">Issue Date:</span> {new Date(result.data.issueDate).toLocaleDateString()}</p>
                      <p><span className="font-medium text-dark">Institute:</span> {result.data.institute}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-danger font-bold">
                      <FaTimesCircle /> INVALID CERTIFICATE
                    </div>
                    <p className="text-sm text-gray-500">{result.message}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VerifyCertificate;
