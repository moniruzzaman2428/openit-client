import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaCertificate,
  FaBriefcase,
  FaRocket,
  FaUsers,
  FaBookOpen,
  FaAward,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaNetworkWired,
  FaDesktop,
} from 'react-icons/fa';

export const stats = [
  { icon: FaUsers, value: '2500+', label: 'Total Students' },
  { icon: FaBookOpen, value: '15+', label: 'Courses' },
  { icon: FaChalkboardTeacher, value: '25+', label: 'Expert Teachers' },
  { icon: FaAward, value: '1800+', label: 'Successful Students' },
];

export const whyChoose = [
  {
    icon: FaChalkboardTeacher,
    title: 'Experienced Trainers',
    desc: 'Industry experts with years of practical experience.',
  },
  {
    icon: FaLaptopCode,
    title: 'Practical Classes',
    desc: 'Hands-on training with real-world projects.',
  },
  {
    icon: FaRocket,
    title: 'Modern Computer Lab',
    desc: 'Fully equipped lab with latest hardware & software.',
  },
  {
    icon: FaBriefcase,
    title: 'Career Guidance',
    desc: 'Job placement support and freelancing guidance.',
  },
  {
    icon: FaCertificate,
    title: 'Certificate',
    desc: 'Industry-recognized certificate upon completion.',
  },
  {
    icon: FaUserGraduate,
    title: 'Skill-Based Learning',
    desc: 'Curriculum focused on practical skills that matter.',
  },
];

export const courses = [
  {
    title: 'Web Development',
    duration: '6 Months',
    fee: '15,000',
    icon: FaCode,
    color: 'from-blue-500 via-cyan-500 to-sky-400',
  },
  {
    title: 'Graphic Design',
    duration: '4 Months',
    fee: '12,000',
    icon: FaPalette,
    color: 'from-violet-500 via-purple-500 to-pink-500',
  },
  {
    title: 'Digital Marketing',
    duration: '3 Months',
    fee: '10,000',
    icon: FaBullhorn,
    color: 'from-orange-500 via-amber-500 to-yellow-400',
  },
  {
    title: 'Freelancing',
    duration: '2 Months',
    fee: '8,000',
    icon: FaBriefcase,
    color: 'from-emerald-500 via-green-500 to-teal-400',
  },
  {
    title: 'Basic Computer',
    duration: '3 Months',
    fee: '6,000',
    icon: FaDesktop,
    color: 'from-indigo-500 via-blue-500 to-cyan-400',
  },
  {
    title: 'Hardware & Networking',
    duration: '4 Months',
    fee: '12,000',
    icon: FaNetworkWired,
    color: 'from-rose-500 via-red-500 to-orange-400',
  },
];

export const careerSteps = [
  {
    number: '01',
    title: 'Choose Your Skill',
    desc: 'আপনার আগ্রহ ও ক্যারিয়ার লক্ষ্য অনুযায়ী সঠিক কোর্স নির্বাচন করুন।',
  },
  {
    number: '02',
    title: 'Learn Practically',
    desc: 'লাইভ ক্লাস, ল্যাব প্র্যাকটিস ও বাস্তব প্রজেক্টের মাধ্যমে দক্ষতা তৈরি করুন।',
  },
  {
    number: '03',
    title: 'Build Portfolio',
    desc: 'বাস্তব কাজ ও প্রজেক্ট দিয়ে একটি শক্তিশালী পোর্টফোলিও তৈরি করুন।',
  },
  {
    number: '04',
    title: 'Start Your Career',
    desc: 'চাকরি, ফ্রিল্যান্সিং অথবা নিজস্ব সার্ভিস—আপনার পছন্দের পথে এগিয়ে যান।',
  },
];
