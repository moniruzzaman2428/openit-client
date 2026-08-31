import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://openitinstitute.com';
const SITE_NAME = 'OPEN IT INSTITUTE';

/**
 * Inject JSON-LD structured data into the page head.
 * @param {object|object[]} data - Schema.org object or array of objects
 */
const StructuredData = ({ data }) => {
  if (!data) return null;

  const graph = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(
          graph.length === 1
            ? graph[0]
            : { '@context': 'https://schema.org', '@graph': graph }
        )}
      </script>
    </Helmet>
  );
};

/** Organization + EducationalOrganization for the institute */
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'EducationalOrganization'],
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Open IT Institute',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.svg`
  },
  description:
    'Professional computer training institute in Bangladesh offering courses in Web Development, Graphic Design, Digital Marketing, Freelancing and more.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'BD'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880-1700-000000',
    contactType: 'admissions',
    availableLanguage: ['English', 'Bengali']
  },
  sameAs: []
});

/** WebSite schema with optional sitelinks search */
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/courses?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

/** Single course schema (for course details page) */
export const courseSchema = (course) => {
  if (!course) return null;

  const fee =
    course.discount > 0
      ? Math.round(course.fee - (course.fee * course.discount) / 100)
      : course.fee;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL
    },
    url: `${SITE_URL}/courses/${course.slug}`,
    courseCode: course.slug,
    educationalCredentialAwarded: 'Certificate of Completion',
    timeRequired: course.duration || undefined,
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: fee,
      priceCurrency: 'BDT',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/admission`
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      courseWorkload: course.classHours || undefined
    }
  };
};

/** ItemList of courses (for /courses page) */
export const courseListSchema = (courses = []) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Courses at OPEN IT INSTITUTE',
  numberOfItems: courses.length,
  itemListElement: courses.slice(0, 20).map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: c.title,
      url: `${SITE_URL}/courses/${c.slug}`,
      description: c.description,
      provider: { '@type': 'Organization', name: SITE_NAME }
    }
  }))
});

/** BreadcrumbList */
export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url ? `${SITE_URL}${item.url}` : undefined
  }))
});

/** FAQ page schema */
export const faqSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer
    }
  }))
});

/** Contact page */
export const contactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact OPEN IT INSTITUTE',
  url: `${SITE_URL}/contact`,
  mainEntity: {
    '@id': `${SITE_URL}/#organization`
  }
});

export default StructuredData;
