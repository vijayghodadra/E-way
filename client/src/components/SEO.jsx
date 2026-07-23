import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, schema }) => {
  const siteTitle = title ? `${title} | Care+` : 'Care+ | Luxury Clean Beauty & Herbal Remedies';
  const metaDescription = description || 'Discover ultra-premium bio-active serums, cold-pressed facial elixirs, and traditional Ayurvedic luxury skincare.';
  const metaImage = image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
