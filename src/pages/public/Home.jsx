import CareerProcessSection from '../../components/HomePagesComponents/CareerProcessSection';
import CoursesSection from '../../components/HomePagesComponents/CoursesSection';
import CTASection from '../../components/HomePagesComponents/CTASection';
import HeroSection from '../../components/HomePagesComponents/HeroSection';
import StatsSection from '../../components/HomePagesComponents/StatsSection';
import WhyChooseSection from '../../components/HomePagesComponents/WhyChooseSection';
import SEO from '../../components/seo/SEO';
import StructuredData, {
  organizationSchema,
  websiteSchema,
} from '../../components/seo/StructuredData';

const Home = () => {
  return (
    <>
      <StructuredData data={[organizationSchema(), websiteSchema()]} />
      <SEO
        title="ওপেন আইটি ইনস্টিটিউট"
        description="ওপেন আইটি ইনস্টিটিউট (Open IT Institute) কেন্দুয়া, নেত্রকোনার একটি আধুনিক কম্পিউটার প্রশিক্ষণ প্রতিষ্ঠান। Web Development, Graphic Design, Digital Marketing ও Freelancing কোর্সে প্রশিক্ষণ দেওয়া হয়।"
        path="/"
      />

      <HeroSection />

      {/* Stats Section with Container */}
      <div className="relative -mt-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsSection />
        </div>
      </div>

      {/* Other Sections with Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <WhyChooseSection />
        <CoursesSection />
        <CareerProcessSection />
      </div>

      {/* CTA Section - Full Width */}
      <CTASection />
    </>
  );
};

export default Home;