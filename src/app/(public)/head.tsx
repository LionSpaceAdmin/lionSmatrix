import { NextSeo } from 'next-seo';

export default function Head() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: 'https://www.lionsofzion.com/',
    name: 'Lions of Zion',
    logo: 'https://www.lionsofzion.com/logo.png',
  };

  return (
    <>
      <NextSeo
        title="Lions of Zion"
        description="Truth is the first casualty of war. We are the first line of defense."
        canonical="https://www.lionsofzion.com/"
        openGraph={{
          url: 'https://www.lionsofzion.com/',
          title: 'Lions of Zion',
          description: 'Truth is the first casualty of war. We are the first line of defense.',
          images: [
            {
              url: 'https://www.lionsofzion.com/og-image.jpg',
              width: 800,
              height: 600,
              alt: 'Lions of Zion',
            },
          ],
          site_name: 'Lions of Zion',
        }}
        twitter={{
          handle: '@lionsofzion',
          site: '@lionsofzion',
          cardType: 'summary_large_image',
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
