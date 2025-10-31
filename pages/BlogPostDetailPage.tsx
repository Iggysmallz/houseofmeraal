import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogPostDetailPageProps {
  blogPosts: BlogPost[];
}

const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ blogPosts }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    localStorage.setItem('hofm_last_page', `blog/${slug}`);
  }, [slug]);

  if (!post) {
    return (
      <section className="page-content py-12 text-center animate-fade-in">
        <h1 className="text-3xl font-black text-[var(--brand-dark)] mb-4">Blog Post Not Found</h1>
        <p className="text-gray-700 mb-6">The article you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-3 bg-[var(--brand-dark)] text-white rounded hover:opacity-95 transition"
        >
          Back to Blog
        </button>
      </section>
    );
  }

  // Note: Using dangerouslySetInnerHTML for rendering HTML content.
  // In a real-world scenario, if content comes from user input,
  // it should be sanitized on the server to prevent XSS attacks.
  // For static content (like in constants.ts), this is generally safe.

  return (
    <section id="page-blog-detail" className="page-content py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 inline-flex items-center text-sm text-[var(--brand-accent)] hover:text-[var(--brand-rich)] transition"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>

        <article className="bg-white rounded-lg shadow-xl p-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-6"
          />
          <h1 className="text-4xl font-black text-[var(--brand-dark)] mb-4">{post.title}</h1>
          <p className="text-gray-600 text-sm mb-6">
            By <span className="font-semibold">{post.author}</span> on {post.date}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          >
            {/* This div is where the blog post's content will be rendered. */}
            {/* It supports HTML content, which can be generated from Markdown. */}
            {/* For potential income, ad slots could be strategically placed here,
                e.g., after the first paragraph or mid-article. */}
          </div>
        </article>
      </div>
    </section>
  );
};

export default BlogPostDetailPage;