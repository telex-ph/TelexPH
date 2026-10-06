import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, BRAND, BLOG_POST_PATH, fullTitle, findSeoPage } from "@/data/seo-pages";

const BASE_TITLE = BRAND;

const setMeta = (attr, key, content) => {
  if (!content) return undefined;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  let created = false;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
    created = true;
  }
  const previous = tag.getAttribute("content");
  tag.setAttribute("content", content);

  return () => {
    if (created) tag.remove();
    else if (previous !== null) tag.setAttribute("content", previous);
  };
};

const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    // noindex pages must not inherit a canonical baked into prerendered HTML
    if (!link) return undefined;
    link.remove();
    return () => document.head.appendChild(link);
  }
  let created = false;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
    created = true;
  }
  const previous = link.getAttribute("href");
  link.setAttribute("href", href);

  return () => {
    if (created) link.remove();
    else if (previous !== null) link.setAttribute("href", previous);
  };
};

/**
 * Replaces Next's per-page `export const metadata`.
 *
 * Usage: <Seo title="About" description="..." url="https://..." /> renders
 * nothing but keeps the document head in sync, mirroring the old title
 * template "%s | TelexPH". `noindex` keeps the page out of search results.
 */
const Seo = ({ title, description, image, url, noindex }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? fullTitle(title) : BASE_TITLE;

    const cleanups = [
      setMeta("name", "description", description),
      setMeta("property", "og:title", title || BASE_TITLE),
      setMeta("property", "og:description", description),
      setMeta("property", "og:image", image),
      setMeta("property", "og:url", url),
      setMeta("name", "twitter:title", title || BASE_TITLE),
      setMeta("name", "twitter:description", description),
      setMeta("name", "twitter:image", image),
      setMeta("name", "robots", noindex ? "noindex" : undefined),
      setCanonical(noindex ? undefined : url),
    ].filter(Boolean);

    return () => {
      document.title = previousTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, description, image, url, noindex]);

  return null;
};

/**
 * Head tags for whatever route is showing, looked up in data/seo-pages.js.
 * Routes not listed there (portals, funnels, 404) get noindex.
 */
export const RouteSeo = () => {
  const { pathname, search } = useLocation();
  if (BLOG_POST_PATH.test(pathname)) return null; // pages/Blogs.jsx sets the post's own head tags
  const page = findSeoPage(pathname);
  if (!page) return <Seo noindex />;

  const url = SITE_URL + page.path + (page.keepQuery ? search : "");
  return <Seo title={page.title} description={page.description} url={url} />;
};

export default Seo;
