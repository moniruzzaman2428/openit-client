import { Helmet } from "react-helmet-async";

const SITE_URL = "https://openitinstitute-c8d2d.web.app"
const SITE_NAME = "OPEN IT INSTITUTE";
const SITE_NAME_BN = "ওপেন আইটি ইনস্টিটিউট";

/* =========================================================
   Structured Data Component
   ========================================================= */

const StructuredData = ({ data }) => {
  if (!data) {
    return null;
  }

  const schemas = Array.isArray(data) ? data : [data];

  const schemaData =
    schemas.length === 1
      ? schemas[0]
      : {
          "@context": "https://schema.org",
          "@graph": schemas,
        };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

/* =========================================================
   Organization Schema
   ========================================================= */

export const organizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",

    "@id": `${SITE_URL}/#organization`,

    name: SITE_NAME,

    alternateName: [
      SITE_NAME_BN,
      "Open IT Institute",
      "Open IT",
      "ওপেন আইটি",
    ],

    url: SITE_URL,

    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },

    image: `${SITE_URL}/logo.png`,

    description:
      "ওপেন আইটি ইনস্টিটিউট (Open IT Institute) কেন্দুয়া, নেত্রকোনার একটি আধুনিক কম্পিউটার প্রশিক্ষণ প্রতিষ্ঠান। এখানে Web Development, Graphic Design, Digital Marketing, Freelancing এবং বিভিন্ন IT বিষয়ে প্রশিক্ষণ প্রদান করা হয়।",

    address: {
      "@type": "PostalAddress",
      streetAddress: "উপজেলা রোড, শান্তিবাগ",
      addressLocality: "কেন্দুয়া",
      addressRegion: "নেত্রকোনা",
      addressCountry: "BD",
    },

    areaServed: {
      "@type": "City",
      name: "কেন্দুয়া",
    },

    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      areaServed: "BD",
      availableLanguage: ["Bengali", "English"],
    },
  };
};

/* =========================================================
   Website Schema
   ========================================================= */

export const websiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    name: SITE_NAME,

    alternateName: [
      SITE_NAME_BN,
      "Open IT",
      "ওপেন আইটি",
    ],

    url: SITE_URL,

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "bn-BD",
  };
};

/* =========================================================
   Local Business Schema
   ========================================================= */

export const localBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",

    "@id": `${SITE_URL}/#localbusiness`,

    name: SITE_NAME,

    alternateName: [
      SITE_NAME_BN,
      "Open IT Institute",
      "Open IT",
      "ওপেন আইটি",
    ],

    url: SITE_URL,

    logo: `${SITE_URL}/logo.png`,

    image: `${SITE_URL}/logo.png`,

    description:
      "ওপেন আইটি ইনস্টিটিউট — কেন্দুয়া, নেত্রকোনার একটি আধুনিক কম্পিউটার ও আইটি প্রশিক্ষণ প্রতিষ্ঠান।",

    address: {
      "@type": "PostalAddress",
      streetAddress: "উপজেলা রোড, শান্তিবাগ",
      addressLocality: "কেন্দুয়া",
      addressRegion: "নেত্রকোনা",
      addressCountry: "BD",
    },

    areaServed: {
      "@type": "City",
      name: "কেন্দুয়া",
    },

    parentOrganization: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
};

/* =========================================================
   Course Schema
   ========================================================= */

export const courseSchema = (course) => {
  if (!course) {
    return null;
  }

  const fee = Number(course.fee) || 0;
  const discount = Number(course.discount) || 0;

  const finalFee =
    discount > 0
      ? Math.round(fee - (fee * discount) / 100)
      : fee;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",

    "@id": `${SITE_URL}/courses/${course.slug}#course`,

    name: course.title,

    description:
      course.description ||
      `${course.title} কোর্স - OPEN IT INSTITUTE`,

    url: `${SITE_URL}/courses/${course.slug}`,

    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    inLanguage: "bn-BD",

    educationalCredentialAwarded:
      "Certificate of Completion",

    offers: {
      "@type": "Offer",

      price: finalFee,

      priceCurrency: "BDT",

      availability: "https://schema.org/InStock",

      url: `${SITE_URL}/admission`,
    },
  };

  if (course.duration) {
    schema.timeRequired = course.duration;
  }

  if (course.classHours) {
    schema.hasCourseInstance = {
      "@type": "CourseInstance",

      courseMode: "onsite",

      courseWorkload: course.classHours,
    };
  }

  return schema;
};

/* =========================================================
   Course List Schema
   ========================================================= */

export const courseListSchema = (courses = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",

    "@id": `${SITE_URL}/courses#course-list`,

    name: "OPEN IT INSTITUTE Courses",

    description:
      "OPEN IT INSTITUTE-এর বিভিন্ন কম্পিউটার ও IT প্রশিক্ষণ কোর্স।",

    numberOfItems: courses.length,

    itemListElement: courses
      .filter(
        (course) =>
          course &&
          course.title &&
          course.slug
      )
      .slice(0, 20)
      .map((course, index) => {
        return {
          "@type": "ListItem",

          position: index + 1,

          item: {
            "@type": "Course",

            name: course.title,

            description:
              course.description ||
              course.title,

            url: `${SITE_URL}/courses/${course.slug}`,

            provider: {
              "@type": "EducationalOrganization",

              name: SITE_NAME,

              url: SITE_URL,
            },
          },
        };
      }),
  };
};

/* =========================================================
   Breadcrumb Schema
   ========================================================= */

export const breadcrumbSchema = (items = []) => {
  return {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: items
      .filter((item) => item && item.name)
      .map((item, index) => {
        const breadcrumb = {
          "@type": "ListItem",

          position: index + 1,

          name: item.name,
        };

        if (item.url) {
          breadcrumb.item = item.url.startsWith("http")
            ? item.url
            : `${SITE_URL}${item.url}`;
        }

        return breadcrumb;
      }),
  };
};

/* =========================================================
   FAQ Schema
   ========================================================= */

export const faqSchema = (faqs = []) => {
  return {
    "@context": "https://schema.org",

    "@type": "FAQPage",

    mainEntity: faqs
      .filter(
        (faq) =>
          faq &&
          faq.question &&
          faq.answer
      )
      .map((faq) => {
        return {
          "@type": "Question",

          name: faq.question,

          acceptedAnswer: {
            "@type": "Answer",

            text: faq.answer,
          },
        };
      }),
  };
};

/* =========================================================
   Contact Page Schema
   ========================================================= */

export const contactPageSchema = () => {
  return {
    "@context": "https://schema.org",

    "@type": "ContactPage",

    "@id": `${SITE_URL}/contact#contact`,

    name: "Contact OPEN IT INSTITUTE",

    url: `${SITE_URL}/contact`,

    inLanguage: "bn-BD",

    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
};

/* =========================================================
   About Page Schema
   ========================================================= */

export const aboutPageSchema = () => {
  return {
    "@context": "https://schema.org",

    "@type": "AboutPage",

    "@id": `${SITE_URL}/about#about`,

    name: `About ${SITE_NAME}`,

    url: `${SITE_URL}/about`,

    inLanguage: "bn-BD",

    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
};

/* =========================================================
   Default Export
   ========================================================= */

export default StructuredData;