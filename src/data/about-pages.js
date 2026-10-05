/* Content for the About > Hardware & Infrastructure / Compliance & Security / Operations pages.
   Plain JS (no JSX, no aliases) so scripts and SEO config can import it.
   Wording follows the site's existing copy: setups are agreed with each client during discovery.
   Only add specifics (numbers, certifications, tools) here once TelexPH can stand behind them. */

export const ABOUT_PAGES = [
  {
    path: "/about/hardware-infrastructure",
    label: "Hardware & Infrastructure",
    title: "Hardware & Infrastructure",
    seoTitle: "Hardware and Infrastructure Behind Our Teams",
    description:
      "Robust UPS and generator backup, high-performance workstations with 64GB RAM, and triple internet redundancy using Globe, PLDT and Starlink.",
    eyebrow: "About TelexPH",
    scene: "hardware",
    ghost: "HARDWARE",
    lines: ["Hardware &","Infrastructure"],
    sections: [
      {
        id: "power-backup",
        icon: "zap",
        heading: "Power & Business Continuity",
        text: "The site is supported by robust UPS and generator backup systems, ensuring uninterrupted operations and business continuity during power disruptions.\n\nThis infrastructure safeguards critical systems and maintains consistent service delivery for all client engagements.",
      },
      {
        id: "workstations",
        icon: "cpu",
        heading: "Workstations",
        text: "The site is equipped with high-performance workstations featuring advanced processors, 64GB RAM, and scalable storage, ensuring efficient multitasking, system stability, and seamless support for client operations. The infrastructure includes:",
        points: [
          "Advanced processors (Intel i5 13th Gen / AMD Ryzen 7)",
          "64GB RAM for high-performance workloads",
          "Up to 2.7TB storage for efficient data handling",
          "Stable graphics capability",
        ],
      },
      {
        id: "internet-redundancy",
        icon: "wifi",
        heading: "Internet Redundancy",
        text: "Established triple internet redundancy using:",
        chips: ["Globe", "PLDT", "STARLINK"],
        points: [
          "Zero downtime during network interruptions",
          "100% operational continuity across all shifts",
          "Improved system reliability and stability",
          "Seamless transition between internet providers",
        ],
      },
    ],
  },
  {
    path: "/about/compliance-security",
    label: "Compliance & Security",
    title: "Compliance & Security",
    seoTitle: "Compliance and Security at TelexPH",
    description:
      "TELEX Philippines maintains a strong security and compliance framework: GDPR-aligned privacy practices, role-based access control, enforced NDAs, secure monitoring and Fortinet security controls.",
    eyebrow: "About TelexPH",
    scene: "compliance",
    ghost: "COMPLIANCE",
    lines: ["Compliance &","Security"],
    statsTitle: "Philippines Delivery Center · Security Posture",
    stats: [
      { value: "GDPR", label: "Compliant" },
      { value: "ISO 27001", label: "Ready" },
      { value: "SECURED", label: "End-to-end" },
      { value: "RBAC", label: "Role-based" },
      { value: "NDA", label: "Enforced" },
    ],
    intro:
      "TELEX Philippines maintains a strong security and compliance framework supported by enterprise-grade protection, continuous monitoring, and dedicated Compliance and Cybersecurity teams.",
    sections: [
      {
        id: "compliance",
        icon: "scroll",
        heading: "Compliance",
        text: "We implement GDPR-aligned data privacy practices, role-based access control (RBAC), secure system monitoring, and enforced NDAs for all employees. Regular compliance training is also conducted to ensure a secure and reliable environment for client operations.",
        points: [
          "GDPR-compliant processes implemented",
          "Data privacy policies enforced",
          "Role-based system access (RBAC)",
          "NDA signed by all employees",
          "Secure login & monitoring systems",
          "Regular GDPR compliance training",
        ],
        wide: true,
      },
      {
        id: "security",
        icon: "shield",
        heading: "Security",
        subheading: "Fortinet Security Controls",
        text: "Our network is protected by Fortinet's multi-layered security ecosystem, strengthening our defense against cyber threats, malicious content, unauthorized access, and emerging security risks.",
        points: [
          "Network Security & Firewall Protection",
          "Intrusion Prevention System (IPS)",
          "Advanced Malware Protection",
          "FortiGuard Web & URL Filtering",
          "Video & Content Filtering",
          "Email Security & Anti-Spam Protection",
          "Application & Access Control",
          "Threat Monitoring & Intelligence",
        ],
        wide: true,
        visual: "firewall",
      },
    ],
  },
  {
    path: "/about/operations",
    label: "Operations",
    title: "Operations",
    seoTitle: "How TelexPH Operations Work",
    description:
      "A structured, multi-channel operation for voice, email and chat, managed by agents, team leaders, QA and trainers, with strong SLA and quality management and a secure workplace.",
    eyebrow: "About TelexPH",
    scene: "operations",
    ghost: "OPERATIONS",
    lines: ["Our","Operations"],
    partners: {
      id: "partners",
      heading: "Our Global Partners",
      paragraphs: [
        "For over 5 years, Telex Philippines has partnered with leading global marketplaces, from industry giants like Amazon, eBay, and Walmart to high-performing regional platforms across Europe, the Middle East, and Asia.",
        "We specialize in end-to-end marketplace operations, including product listing optimization, catalog management, and platform integrations, enabling brands to scale efficiently and compete globally.",
      ],
      marketplaces: ["Amazon", "eBay", "Walmart", "Europe", "Middle East", "Asia"],
      services: ["Product listing optimization", "Catalog management", "Platform integrations"],
    },
    seating: {
      id: "seating-headcount",
      heading: "Seating & Headcount",
      subheading: "Company Capacity & Workforce",
      paragraphs: [
        "TelexPH Business Support Services Inc. currently operates with a seating capacity of approximately **327 seats** and a workforce of nearly **400 employees.** The company continues to expand its operations to support growing global client demands while maintaining high-quality customer experience and outsourcing services.",
        "With its scalable workforce structure and operational capabilities, TelexPH is equipped to provide reliable offshore support solutions for businesses across multiple industries.",
      ],
      figures: [
        { qualifier: "approximately", value: "327", label: "Seats" },
        { qualifier: "nearly", value: "400", label: "Employees" },
      ],
    },
    sections: [
      {
        id: "operations-service-capability",
        icon: "workflow",
        heading: "Operational & Service Capability",
        text: "A structured, multi-channel operation supporting voice, email, and chat, backed by a defined team structure of agents, team leaders, QA, and trainers. With active on-site management and supervision, combined with a strong SLA and quality management approach, we ensure consistent, well-managed, and high-performance service delivery.",
      },
      {
        id: "performance-quality",
        icon: "gauge",
        heading: "Performance & Quality Excellence",
        text: "We consistently deliver high-performance results through structured quality management, real-time monitoring, and continuous process optimization, ensuring reliability, efficiency, and client satisfaction.",
        metrics: [
          { value: "99%", label: "Accuracy Rate" },
          { value: "98%", label: "SLA Compliance" },
          { value: "+20%", label: "Productivity Improvement" },
        ],
      },
      {
        id: "workplace-environment",
        icon: "building",
        heading: "Workplace Environment",
        text: "A secure and professionally managed office environment designed for operational excellence, with stable high-speed infrastructure and enhanced security protocols, including controlled access, a strict no-personal-devices policy, and continuous 24/7 CCTV surveillance.",
      },
    ],
  },
];

export const findAboutPage = (pathname) => {
  const key = pathname.toLowerCase().replace(/(.)\/$/, "$1");
  return ABOUT_PAGES.find((p) => p.path === key);
};
