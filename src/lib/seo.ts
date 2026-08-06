import { BlogPost } from "@/types/blog";

export function generateMetadata(post: BlogPost) {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      images: [post.ogImage || post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      images: [post.ogImage || post.coverImage],
    },
  };
}

export function generateStructuredData(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.avatar,
    },
    publisher: {
      "@type": "Organization",
      name: "MakeItAds",
      logo: {
        "@type": "ImageObject",
        url: "https://makeitads.pro/logo.png",
      },
    },
  };
}