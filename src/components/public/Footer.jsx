import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserGraduate, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaYoutube,
  FaLinkedin,
  FaGithub,
  FaArrowRight,
  FaRocket
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#0a1a2f] via-[#071d34] to-[#0b253f] text-gray-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0, 40, 0],
            y: [0, 30, 0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand with Logo */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-lg">
                  <img 
                    src={logo} 
                    alt="Open IT Institute" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <span className="font-black text-white text-lg block leading-none">
                  OPEN IT
                </span>
                <span className="text-[10px] text-cyan-400/70 tracking-[0.2em] uppercase font-medium">
                  Institute
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              আধুনিক প্রযুক্তি ও প্র্যাকটিক্যাল প্রশিক্ষণের মাধ্যমে দক্ষতা অর্জন করুন। 
              ডিজিটাল দক্ষতায় গড়ে তুলুন আপনার ভবিষ্যৎ।
            </p>

            <motion.div 
              className="flex gap-2.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { icon: FaFacebook, color: 'hover:bg-blue-600', href: '#' },
                { icon: FaYoutube, color: 'hover:bg-red-600', href: '#' },
                { icon: FaLinkedin, color: 'hover:bg-blue-700', href: '#' },
                { icon: FaGithub, color: 'hover:bg-gray-700', href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 rounded-xl bg-white/5 hover:${social.color} flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-110`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="text-sm" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Courses', path: '/courses' },
                { name: 'Admission', path: '/admission' },
                { name: 'Notices', path: '/notices' },
                { name: 'Gallery', path: '/gallery' }
              ].map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Popular Courses
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                'Web Development',
                'Graphic Design',
                'Digital Marketing',
                'Freelancing',
                'Basic Computer',
                'Hardware & Networking'
              ].map((course, index) => (
                <motion.li 
                  key={course}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link 
                    to="/courses" 
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-[10px] text-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {course}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { icon: FaMapMarkerAlt, text: 'Dhaka, Bangladesh' },
                { icon: FaPhone, text: '+880 1700-000000' },
                { icon: FaEnvelope, text: 'info@openitinstitute.com' },
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-all">
                    <item.icon className="text-cyan-400 text-sm" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Newsletter */}
            <motion.div 
              className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-gray-400 mb-2">Get updates & offers</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <motion.button 
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div 
          className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs">
            © {currentYear} <span className="text-cyan-400 font-semibold">Open IT Institute</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition">Terms of Service</Link>
            <Link to="/verify-certificate" className="hover:text-cyan-400 transition">Verify Certificate</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;