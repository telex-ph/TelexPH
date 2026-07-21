import { useEffect } from "react";

const BASE_TITLE = "TelexPH";

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

/**
 * Replaces Next's per-page `export const metadata`.
 *
 * Usage: <Seo title="About" description="..." /> renders nothing but keeps the
 * document head in sync, mirroring the old title template "%s | TelexPH".
 */
const Seo = ({ title, description, image }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    const cleanups = [
      setMeta("name", "description", description),
      setMeta("property", "og:title", title || BASE_TITLE),
      setMeta("property", "og:description", description),
      setMeta("property", "og:image", image),
      setMeta("name", "twitter:title", title || BASE_TITLE),
      setMeta("name", "twitter:description", description),
      setMeta("name", "twitter:image", image),
    ].filter(Boolean);

    return () => {
      document.title = previousTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, description, image]);

  return null;
};

export default Seo;
