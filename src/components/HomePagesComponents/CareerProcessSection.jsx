import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaSearch, 
  FaLaptopCode, 
  FaBriefcase, 
  FaRocket, 
  FaArrowRight 
} from 'react-icons/fa';

const CareerProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // ৪টি ধাপের ডেটা
  const steps = [
    {
      id: '01',
      stage: 'STAGE 01',
      title: 'Choose Your Skill',
      desc: 'আপনার আগ্রহ ও ক্যারিয়ার লক্ষ্য অনুযায়ী সঠিক কোর্স নির্বাচন করুন।',
      icon: FaSearch,
      color: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        gradient: 'from-blue-500 to-cyan-500',
        shadow: 'shadow-blue-200'
      }
    },
    {
      id: '02',
      stage: 'STAGE 02',
      title: 'Learn Practically',
      desc: 'লাইভ ক্লাস, ল্যাব প্র্যাকটিস ও বাস্তব প্রজেক্টের মাধ্যমে দক্ষতা তৈরি করুন।',
      icon: FaLaptopCode,
      color: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        gradient: 'from-purple-500 to-indigo-500',
        shadow: 'shadow-purple-200'
      }
    },
    {
      id: '03',
      stage: 'STAGE 03',
      title: 'Build Portfolio',
      desc: 'বাস্তব কাজ ও প্রজেক্ট দিয়ে একটি শক্তিশালী পোর্টফোলিও তৈরি করুন।',
      icon: FaBriefcase,
      color: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-green-500',
        shadow: 'shadow-emerald-200'
      }
    },
    {
      id: '04',
      stage: 'STAGE 04',
      title: 'Start Your Career',
      desc: 'চাকরি, ফ্রিল্যান্সিং অথবা নিজস্ব সার্ভিস—আপনার পছন্দের পথে এগিয়ে যান।',
      icon: FaRocket,
      color: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        gradient: 'from-orange-500 to-red-500',
        shadow: 'shadow-orange-200'
      }
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative py-20 lg:py-24 bg-gradient-to-b from-white to-blue-50/50 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 mb-4">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-bold text-blue-700 tracking-widest uppercase">Career Journey</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            Your Career Journey
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-semibold mb-3">
            শেখা থেকে ক্যারিয়ার—<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">৪টি সহজ ধাপ</span>
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            একটি পরিষ্কার learning journey যাতে আপনি শুধু কোর্স শেষ না করে কাজের জন্য প্রস্তুত হতে পারেন।
          </p>
        </motion.div>

        {/* Main Timeline Layout */}
        <div className="relative">
          
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 rounded-full transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                {/* Stage Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 + (index * 0.15) }}
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 ${step.color.bg} border ${step.color.border} rounded-full px-4 py-1.5 shadow-md`}
                >
                  <span className={`text-xs font-bold ${step.color.text}`}>{step.stage}</span>
                </motion.div>

                {/* Card */}
                <div className={`bg-white rounded-2xl p-6 shadow-xl ${step.color.shadow} border border-gray-100 hover:border-gray-200 transition-all duration-300 pt-8 mt-4`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="text-3xl" />
                  </div>

                  {/* Step Number */}
                  <div className="text-center mb-3">
                    <span className={`text-4xl font-black ${step.color.text} opacity-20`}>{step.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Desktop Connector Dot */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-3 w-2.5 h-2.5 rounded-full ${step.color.dot} ring-4 ring-white z-10`}></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a 
            href="/admission" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            আজই আপনার যাত্রা শুরু করুন <FaArrowRight className="text-sm" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};


export default CareerProcessSection;