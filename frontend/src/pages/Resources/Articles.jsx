import React from "react";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import articlesData from "../../data/articles";

const Articles = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-emerald-500">
          Mental Health Articles
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Read expert-written articles to improve mental well-being.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articlesData.map((article) => (
          <div
            key={article.id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <span className="inline-block mb-3 px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium">
              {article.category}
            </span>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {article.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaBookOpen />
                {article.readTime}
              </div>

              <Link
                to={`/resources/articles/${article.id}`}
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Read More <FaArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Articles;
