import { Link } from 'react-router-dom';
import { FaUserGraduate, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <FaUserGraduate />
              </div>
              <div>
                <span className="font-bold text-white text-lg block">OPEN IT</span>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">Institute</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              আধুনিক প্রযুক্তি ও প্র্যাকটিক্যাল প্রশিক্ষণের মাধ্যমে দক্ষতা অর্জন করুন। 
              ডিজিটাল দক্ষতায় গড়ে তুলুন আপনার ভবিষ্যৎ।
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary flex items-center justify-center transition">
                <FaFacebook />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary flex items-center justify-center transition">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Courses', path: '/courses' },
                { name: 'Admission', path: '/admission' },
                { name: 'Notices', path: '/notices' },
                { name: 'Gallery', path: '/gallery' }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-secondary transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Courses</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                'Web Development',
                'Graphic Design',
                'Digital Marketing',
                'Freelancing',
                'Basic Computer',
                'Hardware & Networking'
              ].map((course) => (
                <li key={course}>
                  <Link to="/courses" className="hover:text-secondary transition">
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-secondary flex-shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-secondary flex-shrink-0" />
                <span>info@openitinstitute.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Open IT Institute. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
            <Link to="/verify-certificate" className="hover:text-gray-300 transition">Verify Certificate</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
