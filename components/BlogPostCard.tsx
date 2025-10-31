import React from 'react';
import { BlogPost } from '../types';
import { NavLink } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow p-0">
      <NavLink to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
        <div className="h-48 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--bg)] flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </NavLink>
      <div className="p-6">
        <h3 className="font-bold text-lg text-[var(--brand-dark)] mb-2">
          <NavLink to={`/blog/${post.slug}`} className="hover:text-[var(--brand-rich)] transition">
            {post.title}
          </NavLink>
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          By {post.author} on {post.date}
        </p>
        <p className="text-gray-700 text-sm mb-4">{post.excerpt}</p>
        <NavLink
          to={`/blog/${post.slug}`}
          className="inline-block px-4 py-2 border border-gray-300 rounded text-sm text-[var(--brand-dark)] hover:bg-gray-50 transition"
        >
          Read More
        </NavLink>
      </div>
    </article>
  );
};

export default BlogPostCard;