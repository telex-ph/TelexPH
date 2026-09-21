/**
 * Content for the keyword-targeted service pages (rendered by pages/ServicePage.jsx).
 * Plain JS on purpose: scripts/prerender.mjs imports this file in Node to build the sitemap.
 *
 * TODO(marketing): add real pricing ranges and one case study with numbers per page.
 * Keep every FAQ answer visible on the page; the FAQPage schema is generated from it.
 */
export const SERVICE_PAGES = [
  {
    path: "/gohighlevel",
    title: "GoHighLevel Services: VA, Admin & Support",
    description:
      "GoHighLevel VAs, admin services and white label support for marketing agencies, run by a trained team in the Philippines. Funnels, workflows and CRM.",
    eyebrow: "GoHighLevel & CRM",
    h1: "GoHighLevel Services for Agencies",
    answer:
      "TelexPH provides GoHighLevel support for marketing agencies and growing businesses. Our team in the Philippines builds funnels, sets up workflows and automations, manages pipelines and sub-accounts, and handles day-to-day CRM admin, so your in-house team can focus on clients and sales instead of platform maintenance.",
    included: [
      "GoHighLevel account and sub-account administration",
      "Funnel and website building",
      "Workflow and automation setup",
      "Pipeline and CRM management",
      "Booking, calendar and appointment setup",
      "Surveys, forms, courses and products",
      "White label and gray label client support",
    ],
    steps: [
      { title: "Discovery call", text: "We review your GoHighLevel setup, your clients and the work you want off your plate." },
      { title: "Team match", text: "We assign a GoHighLevel-trained VA or admin team that fits your workload and time zone." },
      { title: "Onboarding", text: "We document your processes, snapshots and naming rules so work stays consistent." },
      { title: "Daily delivery", text: "Your team handles tasks through your preferred channel, with regular progress updates." },
    ],
    audience: [
      "Marketing agencies that resell GoHighLevel to clients",
      "SaaS and white label GoHighLevel resellers",
      "Coaches, consultants and service businesses running on GoHighLevel",
    ],
    why: [
      "TelexPH has provided offshore staffing since 2017 from Guimba, Nueva Ecija, Philippines, and serves clients in the US, UK, Australia, Canada and New Zealand.",
      "Our GoHighLevel team combines platform training with AI-assisted workflows, which cuts repetitive CRM work and speeds up delivery for agencies.",
    ],
    faqs: [
      { q: "What GoHighLevel services does TelexPH offer?", a: "TelexPH offers GoHighLevel administration, dedicated GoHighLevel VAs, funnel and website building, workflow automation, CRM and pipeline management, and white label support for agencies." },
      { q: "Can you work inside our clients' sub-accounts?", a: "Yes. Our team works inside your agency account and client sub-accounts using the access level you choose, and follows your snapshots and naming rules." },
      { q: "Which time zones do you cover?", a: "We support clients in the US, UK, Australia, Canada and New Zealand, and schedule working hours to overlap with your business day." },
      { q: "How do I get started?", a: "Book a discovery call through our contact page. We review your setup, recommend a team size and send a custom quote." },
    ],
  },
  {
    path: "/gohighlevel/admin-services",
    title: "GoHighLevel Admin Services for Agencies",
    description:
      "Outsource GoHighLevel admin work to a trained team in the Philippines: sub-account setup, workflows, pipelines, calendars, forms and ongoing CRM upkeep.",
    eyebrow: "GoHighLevel & CRM",
    h1: "GoHighLevel Admin Services",
    answer:
      "GoHighLevel admin services cover the daily setup and upkeep of your GoHighLevel account. A GoHighLevel admin creates and maintains sub-accounts, builds workflows and pipelines, configures calendars, forms and integrations, and fixes broken automations. TelexPH provides this as an ongoing service for agencies that need reliable platform management without hiring in-house.",
    included: [
      "Sub-account creation from your snapshots",
      "Workflow and trigger setup, testing and repair",
      "Pipeline stages, opportunities and tags",
      "Calendar, booking and reminder configuration",
      "Forms, surveys and custom fields",
      "Integrations with tools such as Stripe, Zapier and Google",
      "User roles, permissions and account cleanup",
    ],
    steps: [
      { title: "Account audit", text: "We review your agency account, snapshots and open issues." },
      { title: "Admin plan", text: "We agree on recurring tasks, response times and how requests reach us." },
      { title: "Setup and fixes", text: "We clear the backlog first, then move to ongoing maintenance." },
      { title: "Ongoing admin", text: "New client setups, changes and fixes are handled as they come in." },
    ],
    audience: [
      "Agencies onboarding new GoHighLevel clients every month",
      "Teams with broken or undocumented workflows",
      "Owners who spend their own time on platform admin",
    ],
    why: [
      "Our admins work only inside the systems you approve and follow your documented processes.",
      "TelexPH has run offshore teams since 2017, so you get trained staff with supervision instead of a single freelancer.",
    ],
    faqs: [
      { q: "What does a GoHighLevel admin do?", a: "A GoHighLevel admin sets up and maintains the platform: sub-accounts, workflows, pipelines, calendars, forms, integrations and user permissions. They also troubleshoot automations that stop working." },
      { q: "Is a GoHighLevel admin different from a GoHighLevel VA?", a: "An admin focuses on platform setup and maintenance. A GoHighLevel VA usually also handles client-facing tasks such as follow-ups, scheduling and inbox work inside GoHighLevel." },
      { q: "Can you fix our existing workflows?", a: "Yes. We audit your current workflows, document what they do, repair broken triggers and remove duplicates before taking on new work." },
      { q: "How is pricing set?", a: "Pricing depends on the number of sub-accounts and the volume of work. Book a discovery call for a custom quote." },
    ],
  },
  {
    path: "/gohighlevel/va",
    title: "Hire a GoHighLevel VA from the Philippines",
    description:
      "Hire a dedicated GoHighLevel virtual assistant from the Philippines. Trained in funnels, workflows, pipelines and client follow-up for agencies and SMBs.",
    eyebrow: "GoHighLevel & CRM",
    h1: "Hire a GoHighLevel VA",
    answer:
      "A GoHighLevel VA is a virtual assistant trained to work inside GoHighLevel. They build funnels and pages, manage contacts and pipelines, set up workflows, and handle follow-ups, scheduling and reporting. TelexPH provides dedicated GoHighLevel VAs from the Philippines who work your hours and follow your processes.",
    included: [
      "Funnel, page and form building",
      "Contact, tag and pipeline management",
      "Workflow and campaign setup",
      "Appointment booking and calendar management",
      "Lead follow-up by SMS, email and chat",
      "Reporting and dashboard updates",
    ],
    steps: [
      { title: "Tell us the role", text: "Share the tasks, tools and hours you need covered." },
      { title: "Meet your VA", text: "We shortlist GoHighLevel-trained candidates for you to interview." },
      { title: "Onboard", text: "Your VA learns your account, processes and communication style." },
      { title: "Scale", text: "Add more VAs or an admin team lead as your client list grows." },
    ],
    audience: [
      "Agencies that need extra hands for client builds",
      "Business owners running sales and marketing on GoHighLevel",
      "Teams that want a full-time VA instead of a freelancer",
    ],
    why: [
      "Our VAs are trained in GoHighLevel, Slack, Notion, Asana and other common business tools.",
      "You get a dedicated team member with TelexPH supervision and backup coverage.",
    ],
    faqs: [
      { q: "What is a GoHighLevel VA?", a: "A GoHighLevel VA is a virtual assistant trained to use GoHighLevel. They build funnels, manage contacts and pipelines, set up workflows and handle follow-ups for your business or agency clients." },
      { q: "How can a GoHighLevel VA help an agency?", a: "A GoHighLevel VA takes on repetitive platform work such as client builds, sub-account setup and lead follow-up, so agency owners and account managers can spend more time on sales and strategy." },
      { q: "Will the VA work in my time zone?", a: "Yes. Our VAs can work hours that overlap with US, UK, Australia, Canada or New Zealand business days." },
      { q: "Can I interview the VA before starting?", a: "Yes. We shortlist candidates for your role and you choose who joins your team." },
    ],
  },
  {
    path: "/gohighlevel/white-label-support",
    title: "GoHighLevel White Label Support for Agencies",
    description:
      "White label GoHighLevel support under your agency's brand. Our Philippines team handles client builds, support tickets and account setup for your clients.",
    eyebrow: "GoHighLevel & CRM",
    h1: "GoHighLevel White Label Support",
    answer:
      "GoHighLevel white label support means a partner team delivers GoHighLevel work to your clients under your agency's brand. TelexPH builds client accounts, answers support requests and maintains automations as part of your team, so your clients deal only with your agency and you can take on more accounts without hiring.",
    included: [
      "Client account builds from your snapshots",
      "Support tickets answered under your brand",
      "Funnel, website and automation changes",
      "Onboarding calls and client training support",
      "Gray label options where your team stays client-facing",
    ],
    steps: [
      { title: "Brand setup", text: "We learn your brand voice, service tiers and support channels." },
      { title: "Process mapping", text: "We document how requests arrive, who approves work and response times." },
      { title: "Pilot", text: "We start with a small group of clients to confirm quality." },
      { title: "Full rollout", text: "We take on the rest of your client base as you are ready." },
    ],
    audience: [
      "GoHighLevel SaaS mode resellers",
      "Agencies with more client requests than staff",
      "Agencies that want to offer support without building a support team",
    ],
    why: [
      "Your clients see your brand only. We work inside your tools and communication channels.",
      "TelexPH has provided offshore support for international clients since 2017.",
    ],
    faqs: [
      { q: "What is GoHighLevel white label support?", a: "It is GoHighLevel build and support work delivered by a partner team under your agency's brand. Your clients deal only with your agency while the partner does the work." },
      { q: "What is the difference between white label and gray label?", a: "With white label, our team talks to your clients as part of your agency. With gray label, your team stays client-facing and we do the work behind the scenes." },
      { q: "Will my clients know you are a separate company?", a: "No. We work under your brand, inside your tools and through your support channels." },
      { q: "How fast can you start?", a: "We start with a pilot group of clients after a discovery call and process review. Contact us for current availability." },
    ],
  },
  {
    path: "/virtual-assistant-philippines",
    title: "Virtual Assistant Philippines: Dedicated VAs",
    description:
      "Hire dedicated virtual assistants from the Philippines for admin, sales support, customer service and CRM work. Trained, supervised and ready to scale.",
    eyebrow: "Virtual Staffing",
    h1: "Virtual Assistants from the Philippines",
    answer:
      "A virtual assistant from the Philippines is a remote professional who handles admin, customer support, sales support or marketing tasks for businesses abroad. The Philippines is a popular choice because of strong English skills and time zone flexibility. TelexPH provides dedicated, supervised VAs trained in modern business tools.",
    included: [
      "Administrative support and inbox management",
      "Executive assistance and scheduling",
      "Sales support and lead management",
      "Customer service by email, chat and phone",
      "Data entry and back-office work",
      "CRM and GoHighLevel tasks",
    ],
    steps: [
      { title: "Define the role", text: "Tell us the tasks, tools and hours you need." },
      { title: "Shortlist", text: "We present matched candidates for you to interview." },
      { title: "Onboard", text: "Your VA learns your processes with support from our team leads." },
      { title: "Grow", text: "Add VAs or move to a dedicated offshore team as you scale." },
    ],
    audience: [
      "Small businesses and founders who need more time",
      "Marketing agencies and e-commerce brands",
      "Companies in the US, UK, Australia, Canada and New Zealand",
    ],
    why: [
      "TelexPH has provided offshore staffing since 2017 and employs more than 50 professionals in the Philippines.",
      "Our VAs are trained in GoHighLevel, Slack, Notion, Asana, HubSpot and other common tools.",
    ],
    faqs: [
      { q: "What can a Filipino virtual assistant do?", a: "A Filipino virtual assistant can handle admin work, scheduling, inbox management, customer support, sales support, data entry, social media and CRM tasks." },
      { q: "Why hire a virtual assistant from the Philippines?", a: "The Philippines has a large English-speaking workforce, experience serving Western clients and staff who can work hours that match your time zone." },
      { q: "What is the difference between a VA and dedicated offshore staff?", a: "A VA usually covers a set of tasks for one person or team. Dedicated offshore staff work full-time as part of your company, often in a larger team with a lead." },
      { q: "How much does a virtual assistant from the Philippines cost?", a: "Cost depends on the role, skills and hours. Contact TelexPH for a custom quote based on your needs." },
    ],
  },
  {
    path: "/hire-virtual-assistant-philippines",
    title: "How to Hire a Virtual Assistant in the Philippines",
    description:
      "A simple guide to hiring a virtual assistant in the Philippines: define the role, choose a hiring model, interview, onboard and manage your VA.",
    eyebrow: "Virtual Staffing",
    h1: "How to Hire a Virtual Assistant in the Philippines",
    answer:
      "To hire a virtual assistant in the Philippines, define the tasks and hours you need, choose between a freelancer and a staffing company, interview shortlisted candidates, then onboard with documented processes. A staffing company such as TelexPH handles recruitment, supervision and backup coverage, which lowers the risk for first-time hires.",
    included: [
      "Role definition and task list",
      "Candidate sourcing and screening",
      "Interviews with shortlisted VAs",
      "Onboarding and process documentation",
      "Supervision and performance check-ins",
      "Replacement if the fit is not right",
    ],
    steps: [
      { title: "Define the role", text: "List the tasks, tools, hours and skills you need." },
      { title: "Choose a hiring model", text: "Freelancer platforms are cheaper up front. A staffing company adds screening, supervision and backup." },
      { title: "Interview", text: "Test real tasks, English communication and tool experience." },
      { title: "Onboard and manage", text: "Share written processes, set weekly goals and review work often." },
    ],
    audience: [
      "First-time VA employers",
      "Businesses replacing an unreliable freelancer",
      "Teams hiring several VAs at once",
    ],
    why: [
      "TelexPH has recruited and managed offshore staff in the Philippines since 2017.",
      "We screen for English communication, tool skills and reliability before you meet a candidate.",
    ],
    faqs: [
      { q: "How do I hire a virtual assistant in the Philippines?", a: "Define the role, choose a freelancer platform or a staffing company, interview shortlisted candidates and onboard them with clear written processes." },
      { q: "Should I use a freelancer or a staffing company?", a: "Freelancers can cost less, but you handle screening, management and replacement yourself. A staffing company handles recruitment, supervision and backup coverage." },
      { q: "What skills should I look for in a VA?", a: "Look for clear written English, experience with your tools, reliability and the specific skills your tasks need, such as CRM or customer support." },
      { q: "How long does hiring take?", a: "It depends on the role. Contact TelexPH to get a timeline for your position." },
    ],
  },
  {
    path: "/customer-service-outsourcing-philippines",
    title: "Customer Service Outsourcing Philippines",
    description:
      "Outsource customer service to the Philippines. Email, chat, phone and technical support teams for businesses in the US, UK, AU, CA and NZ.",
    eyebrow: "Customer Experience",
    h1: "Customer Service Outsourcing to the Philippines",
    answer:
      "Customer service outsourcing means a partner team answers your customers' questions by email, chat, phone or social media on your behalf. Outsourcing to the Philippines gives you English-speaking agents who can cover your business hours or run 24/7. TelexPH provides trained customer support teams for growing businesses.",
    included: [
      "Email and ticket support",
      "Live chat support",
      "Phone support",
      "Technical and helpdesk support",
      "Social media inbox management",
      "Multichannel support across your tools",
    ],
    steps: [
      { title: "Scope", text: "We review your channels, ticket volume and service level goals." },
      { title: "Training", text: "Agents learn your product, tone of voice and escalation rules." },
      { title: "Launch", text: "We go live on the channels you choose, with a team lead on each shift." },
      { title: "Improve", text: "We report on volume and response times and adjust staffing as you grow." },
    ],
    audience: [
      "E-commerce and SaaS businesses",
      "Agencies supporting client customers",
      "Companies that need after-hours or 24/7 coverage",
    ],
    why: [
      "TelexPH offers round-the-clock customer support coverage for clients across time zones.",
      "Our agents work inside your helpdesk and CRM, so your customers get one consistent experience.",
    ],
    faqs: [
      { q: "What is customer service outsourcing?", a: "It is hiring a partner team to answer customer questions by email, chat, phone or social media on your behalf, using your tools and brand voice." },
      { q: "Why outsource customer service to the Philippines?", a: "The Philippines has a large English-speaking workforce with long experience supporting customers in the US, UK, Australia and other markets, and teams can cover any time zone." },
      { q: "What can an outsourced support team handle?", a: "Order questions, account issues, basic technical support, returns, bookings and social media messages. Complex cases are escalated to your team." },
      { q: "What is the difference between customer service and customer experience?", a: "Customer service is answering questions and solving problems. Customer experience covers every interaction a customer has with your business, including service." },
    ],
  },
];
