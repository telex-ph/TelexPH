
import { useState, useEffect } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import BlogsHero from "./Blogs/BlogsHero";
import BlogsFilter from "./Blogs/BlogsFilter";
import BlogsList from "./Blogs/BlogsList";
import BlogsArticle from "./Blogs/BlogsArticle";
function BlogsPage() {
  const [showNav, setShowNav] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isArticleView, setIsArticleView] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://telexph-admin.onrender.com/api/blogs");
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
  const handleArticleClick = (post) => {
    setSelectedPost(post);
    setIsArticleView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBackToList = () => {
    setIsArticleView(false);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

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
              
              {loading ? <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800000]" />
                </div> : <BlogsList
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

      <Footer />
    </div>;
}
export {
  BlogsPage as default
};
