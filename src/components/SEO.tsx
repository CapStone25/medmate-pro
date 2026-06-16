import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://care-navigate-tool.lovable.app";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SEO = ({ title, description, image = DEFAULT_IMAGE, type = "website", jsonLd }: SEOProps) => {
  const { pathname, search } = useLocation();
  const url = `${SITE_URL}${pathname}${search || ""}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;