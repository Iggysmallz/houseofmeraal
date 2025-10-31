import React, { useEffect } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { BlogPost } from '../types';

interface BlogPageProps {
  blogPosts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ blogPosts }) => {
  useEffect(() => {
    localStorage.setItem('hofm_last_page', 'blog');
  }, []);

  return (
    <section id="page-blog" className="page-content py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black text-[var(--brand-dark)] mb-8">Our Blog</h1>

        {/* This structure supports future monetization by leaving space for ads or sponsored content */}
        {/* For example:
        <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-center">
          <p>Ad Space: Interested in promoting your brand? Contact us!</p>
        </div>
        */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No blog posts found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;