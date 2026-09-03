import { Helmet } from "react-helmet-async";

const SITE_NAME = "OPEN IT INSTITUTE";
const SITE_URL = "https://openitinstitute-c8d2d.web.app";

const DEFAULT_DESCRIPTION =
  "ওপেন আইটি ইনস্টিটিউট (Open IT Institute) কেন্দুয়া, নেত্রকোনার একটি আধুনিক কম্পিউটার প্রশিক্ষণ প্রতিষ্ঠান। Web Development, Graphic Design, Digital Marketing, Freelancing এবং বিভিন্ন IT কোর্সে প্রশিক্ষণ দেওয়া হয়।";

const DEFAULT_IMAGE = "/og-image.png";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}) => {
  // Page title
  const fullTitle = title
    ? `${title} | ওপেন আইটি ইনস্টিটিউট`
    : "ওপেন আইটি ইনস্টিটিউট | Open IT Institute";

  // Make sure URL does not contain double slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const url =
    path === ""
      ? SITE_URL
      : `${SITE_URL}${cleanPath}`;

  // Image URL
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return (
    <Helmet>

      {/* =====================================================
          BASIC SEO
      ===================================================== */}

      <html lang="bn" />

      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow"
        }
      />

      <meta
        name="googlebot"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow"
        }
      />

      <link
        rel="canonical"
        href={url}
      />

      <meta
        name="author"
        content={SITE_NAME}
      />

      <meta
        name="theme-color"
        content="#0F4C81"
      />

      {/* =====================================================
          OPEN GRAPH - FACEBOOK / SOCIAL MEDIA
      ===================================================== */}

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={url}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:locale"
        content="bn_BD"
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        property="og:image:alt"
        content="ওপেন আইটি ইনস্টিটিউট"
      />

      {/* =====================================================
          TWITTER / X
      ===================================================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />

      <meta
        name="twitter:image:alt"
        content="ওপেন আইটি ইনস্টিটিউট"
      />

      {/* =====================================================
          WEBSITE IDENTITY
      ===================================================== */}

      <meta
        name="application-name"
        content="OPEN IT INSTITUTE"
      />

      <meta
        name="apple-mobile-web-app-title"
        content="OPEN IT INSTITUTE"
      />

    </Helmet>
  );
};

export default SEO;