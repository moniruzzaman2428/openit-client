import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'OPEN IT INSTITUTE';
const SITE_URL = 'https://openitinstitute.com'; // change in production
const DEFAULT_DESCRIPTION =
  'OPEN IT INSTITUTE — Professional computer training institute in Bangladesh. Courses in Web Development, Graphic Design, Digital Marketing, Freelancing and more.';
const DEFAULT_IMAGE = '/og-image.png';

/**
 * SEO component for public pages
 * Usage: <SEO title="Courses" description="..." path="/courses" />
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${SITE_URL}${image}`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${SITE_URL}${image}`} />

      {/* Additional */}
      <meta name="author" content={SITE_NAME} />
      <meta name="theme-color" content="#0F4C81" />
    </Helmet>
  );
};

export default SEO;
