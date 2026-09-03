import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaArrowRight,
  FaTimes,
  FaEnvelope,
  FaCode,
  FaLaptopCode,
  FaUserTie,
  FaGraduationCap,
  FaBriefcase,
  FaCheckCircle,
  FaGithub,
  FaReact,
  FaNodeJs,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaQuoteLeft,
  FaRocket,
  FaStar,
  FaMedal
} from "react-icons/fa";

import {
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiReact,
  SiCss,
  SiNodedotjs,
} from "react-icons/si";

import nuruzzamanImage from "../../assets/images/nur.JPG";
import tonoyImage from "../../assets/images/DSC03830.JPG";

const LeadershipSection = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  const leaders = [
    {
      id: 1,
      name: "MD. Nuruzzaman",
      bengaliName: "মো. নুরজ্জামান",
      designation: "CEO & Instructor",
      subtitle: "Entrepreneur & CEO",
      image: nuruzzamanImage,
      shortDescription:
        "একজন সফল উদ্যোক্তা ও দক্ষ ব্যবস্থাপনা ব্যক্তিত্ব। Open IT Institute-এর নেতৃত্ব ও পরিচালনায় গুরুত্বপূর্ণ ভূমিকা পালন করছেন।",
      fullDescription:
        "MD. Nuruzzaman একজন অত্যন্ত দক্ষ ও সক্ষম ব্যক্তি, যিনি একজন সফল উদ্যোক্তা হিসেবে নিজের অবস্থান তৈরি করেছেন। বর্তমানে তিনি Open IT Institute-এর Chief Executive Officer হিসেবে দায়িত্ব পালন করছেন। তাঁর দক্ষ নেতৃত্ব, ব্যবস্থাপনা ও সাংগঠনিক সক্ষমতার মাধ্যমে তিনি প্রতিষ্ঠানের কার্যক্রমকে সুনির্দিষ্ট পরিকল্পনা ও নিষ্ঠার সঙ্গে পরিচালনা করছেন।",
      expertise: [
        "Entrepreneurship",
        "Leadership",
        "Business Management",
        "Institute Management",
        "Training & Development",
      ],
      email: "nuruzzaman.engbd@gmail.com",
      icon: FaUserTie,
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      lightColor: "text-blue-400",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      name: "মো. মনিরুজ্জামান তনয়",
      bengaliName: "মনিরুজ্জামান তনয়",
      designation: "Full Stack Web Developer",
      subtitle: "Web Developer & Technology Specialist",
      image: tonoyImage,
      shortDescription:
        "আধুনিক ওয়েব প্রযুক্তি ব্যবহার করে রেসপন্সিভ ও ব্যবহারকারী-বান্ধব ওয়েব অ্যাপ্লিকেশন তৈরি করেন।",
      fullDescription:
        "মো. মনিরুজ্জামান তনয় একজন ফুল-স্ট্যাক ওয়েব ডেভেলপার (Full Stack Web Developer)। তিনি আধুনিক ওয়েব প্রযুক্তি ব্যবহার করে রেসপন্সিভ ও ব্যবহারকারী-বান্ধব ওয়েব অ্যাপ্লিকেশন তৈরি করেন। ফ্রন্ট-এন্ড থেকে ব্যাক-এন্ড এবং ডেটাবেজ পর্যন্ত একটি পূর্ণাঙ্গ ওয়েব অ্যাপ্লিকেশন তৈরিতে তিনি কাজ করেন।",
      expertise: [
        "React.js",
        "JavaScript",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Git",
        "GitHub",
      ],
      email: null,
      icon: FaLaptopCode,
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      lightColor: "text-purple-400",
      badgeColor: "bg-purple-100 text-purple-700",
    },
  ];

  const skillIcons = {
    "React.js": SiReact,
    JavaScript: SiJavascript,
    "Tailwind CSS": SiTailwindcss,
    HTML5: SiHtml5,
    CSS3: SiCss,
    "Node.js": SiNodedotjs,
    "Express.js": SiExpress,
    MongoDB: SiMongodb,
    Git: SiGit,
    GitHub: SiGithub,
  };

  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 border border-blue-100"
            >
              <FaBriefcase className="text-blue-500" />
              Leadership & Expertise
            </motion.div>

            <h2 className="text-3xl font-black tracking-tight text-gray-800 sm:text-4xl lg:text-5xl">
              আমাদের নেতৃত্বে{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                দক্ষতা ও অভিজ্ঞতা
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              প্রযুক্তি, শিক্ষা, নেতৃত্ব ও বাস্তব অভিজ্ঞতার সমন্বয়ে
              Open IT Institute শিক্ষার্থীদের দক্ষতা উন্নয়ন ও
              ক্যারিয়ার গঠনে কাজ করে যাচ্ছে।
            </p>
          </motion.div>

          {/* Leaders Cards */}
          <div className="grid gap-8 lg:grid-cols-2">
            {leaders.map((leader, index) => {
              const LeaderIcon = leader.icon;
              const colorClass = leader.color;
              const bgColor = leader.bgColor;
              const borderColor = leader.borderColor;
              const textColor = leader.textColor;
              const lightColor = leader.lightColor;
              const badgeColor = leader.badgeColor;

              return (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className={`relative overflow-hidden rounded-3xl bg-white border ${borderColor} shadow-lg hover:shadow-2xl transition-all duration-500`}>
                    {/* Top Gradient Bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${colorClass}`} />

                    {/* Floating Icons Background */}
                    <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                      <LeaderIcon className="text-8xl" />
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <motion.div
                          whileHover={{ scale: 1.05, rotate: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="relative flex-shrink-0"
                        >
                          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${colorClass} opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-500`} />
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bgColor} border-2 border-white flex items-center justify-center`}>
                            <LeaderIcon className={`text-xs ${textColor}`} />
                          </div>
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                              <FaStar className="text-[8px]" />
                              {leader.designation}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                            {leader.name}
                          </h3>
                          <p className="text-sm text-gray-500">{leader.subtitle}</p>

                          {/* Expertise Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {leader.expertise.slice(0, 4).map((skill) => {
                              const SkillIcon = skillIcons[skill];
                              return (
                                <span
                                  key={skill}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium ${bgColor} ${textColor} border ${borderColor}`}
                                >
                                  {SkillIcon && <SkillIcon className="text-[10px]" />}
                                  {skill}
                                </span>
                              );
                            })}
                            {leader.expertise.length > 4 && (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-medium ${bgColor} ${textColor} border ${borderColor}`}>
                                +{leader.expertise.length - 4}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed mt-3 line-clamp-2">
                            {leader.shortDescription}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedLeader(leader)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${colorClass} text-white font-semibold text-sm hover:shadow-lg transition-all duration-300`}
                            >
                              বিস্তারিত দেখুন
                              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            {leader.email && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`mailto:${leader.email}`}
                                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-all duration-300"
                              >
                                <FaEnvelope />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Decorative Line */}
                    <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${colorClass} transition-all duration-700`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-12 max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-3 text-sm text-gray-600 backdrop-blur-sm">
              <FaGraduationCap className="text-blue-500" />
              <span className="font-medium">Experience • Technology • Leadership • Innovation</span>
              <span className="w-px h-6 bg-gray-200" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <FaRocket className="text-blue-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedLeader(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedLeader(null)}
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
              >
                <FaTimes />
              </button>

              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                {/* Modal Image */}
                <div className="relative min-h-[380px] md:min-h-[560px]">
                  <img
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  
                  <div className="absolute bottom-7 left-6 right-6">
                    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold ${selectedLeader.badgeColor} backdrop-blur-sm`}>
                      <FaMedal className="text-[10px]" />
                      {selectedLeader.designation}
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mt-2">
                      {selectedLeader.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedLeader.subtitle}</p>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                      <FaUserTie />
                      Professional Profile
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mt-1">
                      About{" "}
                      <span className={`bg-gradient-to-r ${selectedLeader.color} bg-clip-text text-transparent`}>
                        {selectedLeader.name}
                      </span>
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                    <FaQuoteLeft className="text-gray-300 text-xl mb-3" />
                    <p className="text-sm leading-8 text-gray-700">
                      {selectedLeader.fullDescription}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaCheckCircle className="text-blue-500" />
                      <h4 className="font-bold text-gray-800">Professional Expertise</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selectedLeader.expertise.map((skill) => {
                        const SkillIcon = skillIcons[skill];
                        return (
                          <div
                            key={skill}
                            className={`flex items-center gap-3 rounded-xl border ${selectedLeader.borderColor} ${selectedLeader.bgColor} px-4 py-3 hover:shadow-md transition-all duration-300`}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${selectedLeader.textColor}`}>
                              {SkillIcon ? (
                                <SkillIcon className="text-sm" />
                              ) : (
                                <FaCheckCircle className="text-sm" />
                              )}
                            </div>
                            <span className={`text-sm font-medium ${selectedLeader.textColor}`}>
                              {skill}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedLeader.email && (
                    <div className="mt-6">
                      <a
                        href={`mailto:${selectedLeader.email}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedLeader.bgColor} ${selectedLeader.textColor}`}>
                          <FaEnvelope />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
                          <p className="text-sm font-medium text-gray-700">{selectedLeader.email}</p>
                        </div>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedLeader(null)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                  >
                    <FaTimes />
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadershipSection;