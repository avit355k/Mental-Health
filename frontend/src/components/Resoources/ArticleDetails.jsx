import React from "react";
import { useParams } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import articlesData from "../../data/articles";

const ArticleDetails = () => {
  const { id } = useParams();
  const article = articlesData.find(a => a.id === Number(id));

  if (!article) {
    return <p className="text-center mt-20">Article not found</p>;
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <span className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium">
        {article.category}
      </span>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-8">
        <FaBookOpen />
        {article.readTime}
      </div>

      {/*  Markdown content */}
      <article className="prose prose-emerald max-w-none">
        <ReactMarkdown>
          {article.content}
        </ReactMarkdown>
      </article>
    </section>
  );
};

export default ArticleDetails;
