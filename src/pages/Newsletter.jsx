import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/shared/Seo";
import { SITE_URL } from "@/data/seo-pages";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import PageLoader from "@/components/PageLoader";
import NewsletterIssueView, { periodLabel } from "@/components/NewsletterView";
import { getApiBaseUrl } from "@/lib/api-base";
import { useNewsletterTracking } from "@/lib/newsletter-tracking";
import { NEWSLETTER_DEPARTMENTS as DEPARTMENTS } from "@/data/newsletter-departments";

const API_BASE = getApiBaseUrl();
const href = (i) => `/resources/newsletter/${i.slug}`;

const cover = (i) => i.coverUrl
  ? <img src={i.coverUrl} alt={i.coverAlt || `${i.title} newsletter cover`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
  : <span aria-hidden="true" className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1b2538] to-[#a10000] p-4 text-center text-sm font-bold uppercase tracking-widest text-white/80">{i.department}</span>;

function IssueBrowser({ issues }) {
  const [dept, setDept] = useState("All");
  const [q, setQ] = useState("");
  const [grid, setGrid] = useState(true);
  const needle = q.trim().toLowerCase();
  const shown = issues.filter((i) => (dept === "All" || i.department === dept)
    && (!needle || `${i.title} ${i.author} ${i.summary || ""}`.toLowerCase().includes(needle)));
  const tab = (d) => <button key={d} type="button" onClick={() => setDept(d)}
      className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-2.5 py-3 text-xs font-semibold uppercase transition-colors ${dept === d ? "border-[#a10000] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{d}</button>;
  const toggle = (on, label, icon) => <button type="button" aria-label={label} aria-pressed={on} onClick={() => setGrid(label === "Grid view")}
      className={`flex h-12 w-12 items-center justify-center rounded-md ${on ? "bg-white text-[#a10000] shadow" : "text-gray-400"}`}>{icon}</button>;
  return <section className="mx-auto max-w-[1200px]">
      <div className="flex justify-between overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{["All", ...DEPARTMENTS].map(tab)}</div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search newsletters..." aria-label="Search newsletters"
          className="h-12 w-full max-w-md rounded-md border border-gray-200 px-4 text-sm shadow-sm outline-none focus:border-[#a10000]" />
        <div className="flex rounded-lg bg-gray-100 p-1">
          {toggle(!grid, "List view", "☰")}
          {toggle(grid, "Grid view", "▦")}
        </div>
      </div>
      {!shown.length ? <p className="py-24 text-center text-gray-500">No newsletters available.</p>
        : grid ? <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((i) => <li key={i._id}>
                <Link to={href(i)} className="group block h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-xl">
                  <span className="block aspect-[16/10] overflow-hidden bg-gray-100">{cover(i)}</span>
                  <span className="block p-5">
                    <span className="inline-block rounded bg-[#a10000]/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[#a10000]">{i.department}</span>
                    <span className="mt-3 block text-lg font-bold leading-snug text-gray-900">{i.title}</span>
                    {i.summary && <span className="mt-2 line-clamp-2 block text-sm text-gray-600">{i.summary}</span>}
                    <span className="mt-4 block text-xs text-gray-500">{periodLabel(i.period)} · By {i.author}</span>
                  </span>
                </Link>
              </li>)}
          </ul>
        : <ul className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {shown.map((i) => <li key={i._id}>
                <Link to={href(i)} className="group flex items-center gap-4 py-4 transition-colors hover:bg-gray-50">
                  <span className="h-16 w-24 shrink-0 overflow-hidden rounded ring-1 ring-black/10">{cover(i)}</span>
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-500">{periodLabel(i.period)}</span>
                    <span className="block truncate font-bold text-gray-900">{i.title}</span>
                    <span className="block text-sm text-gray-500">By {i.author} · {i.department} Department</span>
                  </span>
                </Link>
              </li>)}
          </ul>}
    </section>;
}

const Heart = ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.8 5 6.2 5c2 0 3.4 1.1 4.3 2.4h3C14.4 6.1 15.8 5 17.8 5c3.4 0 5.3 3.4 3.8 6.8C19.5 16.4 12 21 12 21z" /></svg>;

// The only like button: sits at the right of the issue title.
function LikeButton({ likes, liked, onToggle }) {
  return <button type="button" onClick={onToggle} aria-pressed={liked} aria-label={liked ? "Unlike this issue" : "Like this issue"}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-6 text-sm font-bold transition-colors ${liked ? "border-[#a10000] bg-[#a10000] text-white" : "border-[#a10000] bg-white text-[#a10000] hover:bg-[#a10000]/10"}`}>
      <Heart filled={liked} />{liked ? "Liked" : "Like"}<span className="opacity-80">&middot; {likes}</span>
    </button>;
}

// Head tags + Article schema (and FAQPage when the issue has FAQ pairs) for one issue.
function IssueSeo({ issue }) {
  const url = `${SITE_URL}${href(issue)}`;
  const description = issue.metaDescription || issue.summary || `${issue.title} - TelexPH newsletter`;
  const org = { "@id": `${SITE_URL}/#org`, "@type": "Organization", name: "TelexPH" };
  const article = {
    "@context": "https://schema.org", "@type": "Article", headline: issue.metaTitle || issue.title, description,
    image: issue.coverUrl || undefined, url, mainEntityOfPage: url, datePublished: issue.publishedAt || issue.createdAt, dateModified: issue.updatedAt,
    author: { "@type": "Person", name: issue.author }, publisher: org,
  };
  const faq = (issue.faq || []).filter((f) => f.question && f.answer);
  const faqLd = faq.length > 0 && { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
  const ld = (o) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o).replace(/</g, "\\u003c") }} />;
  return <>
      <Seo title={issue.metaTitle || issue.title} description={description} image={issue.coverUrl || undefined} url={url} />
      {ld(article)}
      {faqLd && ld(faqLd)}
    </>;
}

function NewsletterPage() {
  const [showNav, setShowNav] = useState(false);
  const { slug } = useParams();
  const track = useNewsletterTracking(slug);
  const [data, setData] = useState(null); // an array on the index, one issue on /:slug
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    setData(null);
    fetch(`${API_BASE}/newsletter/issues${slug ? `/${encodeURIComponent(slug)}` : ""}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setData(d))
      .catch((e) => alive && e !== 404 && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  // data can be stale for one render after the route changes (the effect resets it
  // afterwards), so check its shape instead of trusting slug alone.
  const list = Array.isArray(data) ? data : null;
  const issue = slug && !list ? data : null;

  return <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />
      {slug && !loading && !failed && !issue && <Seo noindex />}
      {slug && issue && <IssueSeo issue={issue} />}

      <main className="px-4 pb-20 pt-32 md:pt-40">
        {slug ? <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a10000]">TelexPH Newsletter</p>
            <p className="mt-2 text-sm text-gray-500"><Link to="/resources/newsletter" className="hover:text-[#a10000]">&larr; All issues</Link></p>
          </div>
        : <header className="relative mb-12 text-center">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-6 select-none text-[clamp(3rem,12vw,8rem)] font-black uppercase leading-none text-transparent [-webkit-text-stroke:1px_#e5e7eb]">Newsletter</span>
            <h1 className="relative text-4xl font-black uppercase tracking-tight text-gray-900 md:text-6xl">TelexPH Newsletter: Company News &amp; Updates</h1>
            <p className="relative mx-auto mt-6 max-w-[640px] text-gray-600">Catch up on stories, updates and milestones from every department at Telex Philippines.</p>
            <p className="relative mt-6 text-[11px] uppercase tracking-widest text-gray-500">
              <Link to="/" className="hover:text-[#a10000]">Home</Link> &gt;&gt; Resources &gt;&gt; <span className="text-[#a10000]">Newsletter</span>
            </p>
          </header>}

        {loading ? <PageLoader fullScreen={false} /> : failed ? <p className="text-center text-gray-500">Couldn't load the newsletter. Please try again later.</p>
          : slug ? (issue ? <NewsletterIssueView issue={issue} headerAction={<LikeButton likes={track.likes} liked={track.liked} onToggle={track.toggleLike} />} /> : <p className="text-center text-gray-500">Issue not found.</p>)
          : <IssueBrowser issues={list || []} />}
      </main>
      <Footer />
    </div>;
}
export {
  NewsletterPage as default
};
