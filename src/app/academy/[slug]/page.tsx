import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data for articles
const mockArticles: { [key: string]: any } = {
  'info-warfare': {
    title: 'Understanding Information Warfare',
    content: 'This is placeholder content for the article "Understanding Information Warfare". In a real implementation, this would be rendered from MDX.'
  },
  'osint-basics': {
    title: 'OSINT Basics',
    content: 'This is placeholder content for the article "OSINT Basics". In a real implementation, this would be rendered from MDX.'
  },
  'deepfake-detection': {
    title: 'Deepfake Detection 101',
    content: 'This is placeholder content for the article "Deepfake Detection 101". In a real implementation, this would be rendered from MDX.'
  },
};

const articleSlugs = Object.keys(mockArticles);

const getArticle = async (slug: string) => {
  return mockArticles[slug];
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return { title: article.title };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const currentIndex = articleSlugs.indexOf(params.slug);
  const prevArticleSlug = currentIndex > 0 ? articleSlugs[currentIndex - 1] : null;
  const nextArticleSlug = currentIndex < articleSlugs.length - 1 ? articleSlugs[currentIndex + 1] : null;

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <article className="prose prose-invert mx-auto">
          <h1>{article.title}</h1>
          <p>{article.content}</p>
          <h2 id="section-1">Section 1</h2>
          <p>More placeholder content for section 1.</p>
          <h2 id="section-2">Section 2</h2>
          <p>More placeholder content for section 2.</p>
        </article>
        <div className="mt-12 flex justify-between">
            {prevArticleSlug ? (
              <Link href={`/academy/${prevArticleSlug}`} className="text-primary hover:underline">
                  &larr; Previous: {mockArticles[prevArticleSlug].title}
              </Link>
            ) : <div />}
            {nextArticleSlug ? (
              <Link href={`/academy/${nextArticleSlug}`} className="text-primary hover:underline">
                  Next: {mockArticles[nextArticleSlug].title} &rarr;
              </Link>
            ) : <div />}
        </div>
      </div>
    </div>
  );
}