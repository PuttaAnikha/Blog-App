import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageWrapper,
  pageTitleClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
} from "../styles/common";

function HomeComponent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user-api/articles");
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [isAuthenticated]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  return (
    <div className={pageWrapper}>
      <header className="mb-12">
        <h1 className={pageTitleClass}>Latest Stories</h1>
        <p className="text-[#6e6e73] text-lg">Discover the latest insights and articles from our community.</p>
      </header>

      {!isAuthenticated ? (
        <div className={emptyStateClass}>
          <p className="mb-4">Please log in to view the latest articles.</p>
          <button 
            className="bg-[#0066cc] text-white px-6 py-2 rounded-full font-medium"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      ) : (
        <>
          {loading && <p className={loadingClass}>Loading stories...</p>}
          {error && <p className={errorClass}>{error}</p>}
          {!loading && !error && articles.length === 0 && (
            <div className={emptyStateClass}>No articles found.</div>
          )}

          <div className={articleGrid}>
            {articles.map((article) => (
              <div key={article._id} className={articleCardClass} onClick={() => openArticle(article)}>
                <p className={articleMeta}>{article.category}</p>
                <h3 className={articleTitle}>{article.title}</h3>
                <p className={articleExcerpt}>{article.content.slice(0, 100)}...</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  {article.author?.profileImageUrl ? (
                    <img 
                      src={article.author.profileImageUrl} 
                      alt="author" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-[10px] flex items-center justify-center font-bold">
                      {article.author?.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-gray-500 font-medium">By {article.author?.firstName}</span>
                </div>
                <button className={`${ghostBtn} mt-2`}>Read More →</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomeComponent;