
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Seo from "@/shared/Seo";
import { SITE_URL } from "@/data/seo-pages";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import PrintWatermark from "@/shared/PrintWatermark";
import PageLoader from "@/components/PageLoader";
import BlogsHero from "./Blogs/BlogsHero";
import BlogsFilter from "./Blogs/BlogsFilter";
import BlogsList from "./Blogs/BlogsList";
import BlogsArticle from "./Blogs/BlogsArticle";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "/api";
function BlogsPage() {
  const [showNav, setShowNav] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // The open post lives in the URL (/resources/blogs/<slug>) so each post can be shared and indexed.
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/blogs`);
        const data = await response.json();
        const publishedOnly = data.filter((b) => b.status === "published");
        setBlogs(publishedOnly);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);
  const filteredBlogs = blogs.filter((blog) => {
    const matchesTab = activeTab === "All" ? categoryFilter ? blog.mainCategory === categoryFilter : true : blog.mainCategory === activeTab || blog.subcategory === activeTab;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const selectedPost = slug ? blogs.find((b) => b.slug === slug) : null;
  const isArticleView = Boolean(selectedPost);
  const handleArticleClick = (post) => {
    navigate(`/resources/blogs/${post.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBackToList = () => {
    navigate("/resources/blogs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">
      <PrintWatermark />
      <div className="print:hidden">
        <Nav openNav={openNavHandler} />
        <MobileNav showNav={showNav} closeNav={closeNavHandler} />
      </div>

      {slug && !loading && <PostSeo post={selectedPost} />}

      <main className="pb-20">
        {isArticleView ? <div className="animate-in fade-in duration-500">
            {
    /* Added allBlogs and onArticleClick props since your BlogsArticle.tsx requires them for the sidebar */
  }
            <BlogsArticle
    post={selectedPost}
    onBack={handleBackToList}
    allBlogs={blogs}
    onArticleClick={handleArticleClick}
  />
          </div> : <>
            <BlogsHero />
            <div className="max-w-[1400px] mx-auto px-4">
              <BlogsFilter
    viewMode={viewMode}
    setViewMode={setViewMode}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    categoryFilter={categoryFilter}
    setCategoryFilter={setCategoryFilter}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
  />
              
              {loading ? <PageLoader fullScreen={false} /> : <BlogsList
    blogs={filteredBlogs}
    onArticleClick={handleArticleClick}
    searchQuery={searchQuery}
    viewMode={viewMode}
    activeTab={activeTab}
    categoryFilter={categoryFilter}
  />}
            </div>
          </>}
      </main>

      <div className="print:hidden"><Footer /></div>
    </div>;
}
/** Head tags + BlogPosting schema for one post; an unknown or unpublished slug gets noindex. */
function PostSeo({ post }) {
  if (!post) return <Seo noindex />;
  const url = `${SITE_URL}/resources/blogs/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.shortDescription,
    image: post.picture,
    url,
    mainEntityOfPage: url,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${SITE_URL}/#org`, "@type": "Organization", name: "TelexPH" },
  };
  return <>
      <Seo title={post.title} description={post.shortDescription} image={post.picture} url={url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>;
}
export {
  BlogsPage as default
};
