// Newsletter templates (version-2 designs, see telexph-admin/src/newsletter/newsletter.design.js). The admin picks one,
// uploads content, and the AI fills it. The public page is narrow (about 1400px), so every template uses at most two
// columns, keeps blocks that need width (scorecard, cards) full-width, and has columns of similar height. The sample
// copy is deliberately realistic in length: the AI replaces it, and the template looks right with real text.
// Photo and logo slots stay empty for the admin.

const RED = { primary: "#a10000", dark: "#530607", text: "#282828", soft: "", background: "#ffffff" };

const month = (now) => now.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
const ribbon = (now) => ({ type: "ribbon", text: `COMPANY NEWSLETTER - ISSUE ${month(now)}` });
const masthead = (extra) => ({ type: "masthead", brand: "TELEX", label: "ACCOUNT SPOTLIGHT", sub: "Start - End", ...extra });
const band = (theme) => ({ type: "band", bg: theme.primary, color: "#ffffff", align: "left", title: "Salamat, team!", subtitle: "", text: "Thank you to every agent, team lead and support crew who made this possible. Here is to the next milestone." });
const footer = () => ({ type: "footer", columns: [{ title: "Account name", text: "Telex Philippines" }, { title: "OUR PROMISE", text: "Empowering success with world-class talent." }, { title: "IN PARTNERSHIP WITH", text: "Partner" }], note: "Copyright TelexPH. All rights reserved. Figures are month-to-date." });
const cols = (...c) => ({ type: "columns", cols: c.map(([span, ...blocks]) => ({ span, blocks })) });

// Blocks reused across templates.
const hero = () => ({ type: "hero", tag: "PARTNERSHIP SPOTLIGHT", title: "FROM PILOT TO PARTNERSHIP.", subtitle: "Team - Telex Philippines", stats: [{ value: "30 > 52", label: "Billed agents" }, { value: "+73%", label: "Growth" }, { value: "4", label: "LOBs" }, { value: "38.5K", label: "Oct calls" }] });
const story = (eyebrow = "THE STORY") => ({ type: "story", eyebrow, headline: "Three months,", accent: "one growing team.", paragraphs: ["In August, Telex Philippines opened a pilot program with 30 active agents. The goal was simple: prove that our team could deliver fast, reliable support for one of the busiest names in logistics.", "By the end of October the program had grown to 52 agents across four lines of business. Along the way the team got faster every month, answering more calls per agent while cutting idle time."] });
const quote = () => ({ type: "quote", text: "A pilot that started with 30 seats is now a 52-agent, four-line partnership, and the team is just getting started.", cite: "" });
const timeline = () => ({ type: "timeline", eyebrow: "THE JOURNEY", items: [{ date: "AUG 2026", title: "Pilot launch", text: "30 active agents go live on voice support." }, { date: "SEP 2026", title: "Scaling up", text: "New agents ramp up and the email team grows." }, { date: "OCT 2026", title: "Full program", text: "52 agents across all four lines of business." }] });
const kpiItems = [{ value: "74", label: "Calls / agent / day", note: "Up from 58 in Aug" }, { value: "4,399s", label: "Avg pause time", note: "Under the 5,400s goal" }, { value: "5.38m", label: "Avg talk time", note: "Down from 6.86 mins" }, { value: "6.0%", label: "Missed call rate", note: "Improved from 7.2%" }];
const kpis = () => ({ type: "kpis", eyebrow: "SCORECARD", items: kpiItems });
const scorecard = () => ({ type: "kpis", eyebrow: "MONTH SCORECARD", meta: "AUG VS OCT", bars: ["AUG", "OCT"], items: kpiItems.map((k, i) => ({ ...k, bar: [[65, 85], [90, 70], [90, 70], [80, 65]][i] })) });
const stat = () => ({ type: "stat", icon: "@", value: "19,164", label: "emails in October", note: "Up from 18,048 in September" });
const cards = () => ({ type: "cards", eyebrow: "4 LINES OF BUSINESS", items: [{ n: "01", title: "Voice", text: "Inbound customer calls for deliveries." }, { n: "02", title: "Email", text: "Written support for inquiries and follow-ups." }, { n: "03", title: "Outbound", text: "Proactive calls that keep shipments on track." }, { n: "04", title: "POD Checkers", text: "Proof-of-delivery checks for every parcel." }] });
const photos = () => ({ type: "photos", eyebrow: "MEET THE TEAM", items: [{ caption: "On the production floor" }, { caption: "Outside the site" }] });
const wide = () => ({ type: "image", caption: "The team on the production floor" });
const second = () => ({ type: "text", eyebrow: "ALSO THIS MONTH", title: "Growing the email team", paragraphs: ["The email line added agents in September and handled more cases every week, with faster first replies and fewer follow-ups needed."] });

const make = (theme, sections, now) => ({ version: 2, theme, sections: [ribbon(now), ...sections, band(theme), footer()] });

// Cover and story on the left, scorecard on the right, the four lines of business across the page.
export const spotlightTemplate = (now = new Date()) => make(RED, [
  masthead({ pair: true, brand: "TELEX x PARTNER", label: "EST. LOCATION", sub: "Account Spotlight" }),
  cols([7, hero(), story()], [5, scorecard(), stat(), quote()]),
  cols([12, cards()])
], now);

// Text-led: the story, a quote and a second article beside the numbers and the journey.
const editorialTemplate = (now = new Date()) => make(RED, [
  masthead(),
  cols([8, story(), quote(), second()], [4, kpis(), timeline()])
], now);

// A big cover, then two even columns, then the scorecard across the page.
const showcaseTemplate = (now = new Date()) => make(RED, [
  masthead({ pair: true, brand: "TELEX x PARTNER" }),
  cols([12, hero()]),
  cols([6, story()], [6, timeline(), quote()]),
  cols([12, scorecard()])
], now);

// Numbers first: the scorecard leads, then story and journey side by side.
const numbersTemplate = (now = new Date()) => make(RED, [
  masthead({ pair: true, brand: "TELEX x PARTNER" }),
  cols([12, scorecard()]),
  cols([6, story(), stat()], [6, timeline(), quote()])
], now);

// Magazine: a wide photo, two articles side by side, the business lines to close.
const magazineTemplate = (now = new Date()) => make(RED, [
  masthead(),
  cols([12, wide()]),
  cols([6, story("FEATURE")], [6, second(), quote()]),
  cols([12, cards()])
], now);

const darkLast = (c) => ({ ...c, cols: c.cols.map((x, i, all) => (i === all.length - 1 ? { ...x, bg: RED.dark } : x)) }); // the last column becomes a dark panel

// One-page highlight, like a slide: headline, four big-number tiles, a callout and two boxes on the left; a dark panel
// on the right with the headline number and a checklist of everything done. No ribbon or banner.
const highlightTemplate = (now = new Date()) => ({
  version: 2,
  theme: RED,
  sections: [
    masthead({ label: "NEWSLETTER HIGHLIGHT", sub: "Automation" }),
    darkLast(cols(
      [8,
        { type: "story", eyebrow: "", headline: "Ten everyday processes", accent: "now run on automation", paragraphs: ["From purchase approvals to recruitment intake, gatepasses and email monitoring, the team has moved ten manual processes into systems built in-house."] },
        { type: "kpis", tiles: true, eyebrow: "", items: [{ value: "10", label: "Processes automated" }, { value: "+1", label: "New this month" }, { value: "4", label: "New systems launched" }, { value: "7", label: "Developers building them" }] },
        { type: "callout", icon: "↑", lead: "Newest: purchase approvals.", text: "Purchase requests are now submitted and approved online, from request to approval in one system." },
        { type: "boxes", items: [{ label: "WHY IT WORKED", text: "Each build replaces a step people did by hand: a form, a reminder, a follow-up." }, { label: "WHAT IT MEANS FOR TELEX", text: "Fewer manual steps across HR, recruitment, operations and sales, and the list keeps growing." }] }
      ],
      [4,
        { type: "stat", value: "10", label: "processes live", note: "" },
        { type: "list", title: "Automated at Telex", items: [{ title: "Purchase approvals", sub: "Office of the President", tag: "NEW" }, { title: "Recruitment intake", sub: "Internal + external hiring", tag: "LIVE" }, { title: "Gatepass approvals", sub: "Requests + reminders", tag: "LIVE" }, { title: "Call appointments", sub: "Self-booking", tag: "LIVE" }, { title: "Email SLA monitoring", sub: "Inbox tracking", tag: "LIVE" }] },
        { type: "stat", value: "+1", label: "new this month", note: "" }
      ]
    )),
    { type: "footer", columns: [], note: "Source: project tracker - Monthly Business Report. Telex Philippines - Digital Innovation." }
  ]
});


// What the admin picks from before the AI fills one with an upload.
export const TEMPLATES = [
  { id: "spotlight", name: "Spotlight", desc: "Cover and story beside the scorecard, business lines across the page.", make: spotlightTemplate },
  { id: "editorial", name: "Editorial", desc: "A wide story column with a narrow sidebar of numbers and the journey.", make: editorialTemplate },
  { id: "showcase", name: "Showcase", desc: "A big cover, two even columns, the scorecard across the page.", make: showcaseTemplate },
  { id: "numbers", name: "Numbers first", desc: "A full-width scorecard leads; story and journey side by side.", make: numbersTemplate },
  { id: "highlight", name: "Highlight (one page)", desc: "A slide-style page: big numbers, a callout, and a dark checklist panel.", make: highlightTemplate },
  { id: "magazine", name: "Magazine", desc: "A wide photo, two articles, and the business lines to close.", make: magazineTemplate }
];
