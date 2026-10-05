/* Content for the logistics Privacy Policy and Terms & Conditions pages.
   Text supplied by TelexPH. `blocks` render in order: a string is a paragraph, an array is a bullet list. */

export const LEGAL_UPDATED = "October 5, 2026";
export const LEGAL_EMAIL = "careers@telexph.com";
export const LEGAL_WEBSITE = "https://www.telexph.com";

export const PRIVACY = {
  path: "/logistics/privacy-policy",
  eyebrow: "Logistics",
  ghost: "PRIVACY",
  lines: ["Privacy", "Policy"],
  title: "Privacy Policy",
  intro:
    "TelexPH values your privacy and is committed to protecting the personal information entrusted to us. This Privacy Policy explains how we collect, use, store, protect, and manage information provided through the TelexPH Logistics website and related services.",
  highlights: [
    { label: "Only what we need", text: "We collect information that is reasonably necessary for legitimate business and service purposes." },
    { label: "We don't sell your data", text: "We do not intend to sell personal information to third parties." },
    { label: "Safeguards in place", text: "Organizational, physical and technical measures protect your information." },
  ],
  closing: "By using the TelexPH Logistics website and services, you acknowledge that you have read and understood this Privacy Policy.",
  sections: [
    {
      id: "controller",
      heading: "Who We Are",
      blocks: [
        "TelexPH, based in Guimba, Nueva Ecija, Philippines, is the Personal Information Controller responsible for personal information collected through the TelexPH Logistics website and related services.",
        `You may reach us at ${LEGAL_EMAIL} for any privacy-related matter.`,
      ],
    },
    {
      id: "collect",
      heading: "Information We Collect",
      blocks: [
        "Depending on how you use our Logistics services, we may collect information such as:",
        [
          "Name and contact information",
          "Email address and telephone/mobile number",
          "Shipment or tracking information",
          "Delivery and destination details",
          "Information submitted through inquiry or support forms",
          "Account and authentication information, when applicable",
          "Information necessary to process and respond to service requests",
          "Technical information such as IP address, browser type, device information, and website activity",
        ],
        "We only collect information that is reasonably necessary for legitimate business and service purposes.",
      ],
    },
    {
      id: "use",
      heading: "How We Use Your Information",
      blocks: [
        "We may use collected information to:",
        [
          "Process and manage logistics and shipment-related requests",
          "Provide shipment updates and delivery-related assistance",
          "Respond to inquiries and customer support requests",
          "Verify and maintain the security of our services",
          "Improve our logistics processes and website",
          "Maintain records necessary for business and legal purposes",
          "Detect, prevent, and investigate unauthorized activities or security incidents",
          "Comply with applicable laws, regulations, and lawful requests",
        ],
      ],
    },
    {
      id: "basis",
      heading: "Legal Basis for Processing",
      blocks: [
        "We process personal information under the Data Privacy Act of 2012 (Republic Act No. 10173) only where a lawful basis applies, such as:",
        [
          "Your consent, for example when you submit an inquiry or support form",
          "The need to take steps at your request or to perform a service or contract with you",
          "Compliance with a legal obligation or lawful request",
          "Our legitimate interests in operating, securing, and improving our services, where these are not overridden by your rights and freedoms",
        ],
      ],
    },
    {
      id: "protection",
      heading: "Protection of Personal Information",
      blocks: [
        "TelexPH takes reasonable organizational, physical, and technical measures to protect personal information against unauthorized access, disclosure, alteration, loss, or destruction.",
        "Access to information is limited to authorized personnel and service providers who require the information to perform legitimate business or service functions.",
      ],
    },
    {
      id: "sharing",
      heading: "Sharing of Information",
      blocks: [
        "We may disclose personal information only when reasonably necessary for legitimate business purposes, including providing logistics services, responding to requests, maintaining our systems, complying with legal obligations, or protecting our rights and the security of our users and services.",
        "Categories of recipients may include:",
        [
          "TelexPH personnel who need the information to handle your request",
          "Service providers that support our website, communications, scheduling, hosting, and information systems",
          "Logistics and delivery partners, where needed to provide logistics-related assistance",
          "Government agencies, regulators, courts, or law enforcement, where required by law",
        ],
        "We do not intend to sell personal information to third parties.",
        "Where third-party service providers are used, appropriate measures should be taken to require them to handle information in accordance with applicable privacy and security requirements.",
      ],
    },
    {
      id: "retention",
      heading: "Data Retention",
      blocks: [
        "Personal information will be retained only for as long as reasonably necessary to fulfill the purposes for which it was collected, provide our services, maintain appropriate business records, resolve disputes, and comply with applicable legal or regulatory requirements.",
        "We decide how long to keep information based on:",
        [
          "The type of information and the purpose for which it was collected",
          "Whether the information is still needed to respond to your request or provide a service",
          "Legal, regulatory, tax, and record-keeping requirements",
          "The need to resolve disputes or protect our legal rights",
        ],
        "When information is no longer needed, it is securely deleted, anonymized, or disposed of.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and Website Analytics",
      blocks: [
        "We record basic website usage information, such as the pages visited, browser and device type, and referring page, through our own systems to understand how the website is used and to keep it secure.",
        "The website may also use cookies or similar technologies to support website functionality and security.",
        "You may adjust your browser settings to manage or restrict cookies. Certain website features may not function properly if cookies are disabled.",
      ],
    },
    {
      id: "security",
      heading: "Data Security",
      blocks: [
        "We continuously seek to maintain appropriate safeguards for personal information and information systems. Security measures may include access controls, authentication mechanisms, monitoring, logging, secure communications, backups, and other safeguards appropriate to the nature of the information being processed.",
        "No method of transmission or electronic storage can be guaranteed to be completely secure. Users should therefore exercise appropriate caution when submitting information online.",
      ],
    },
    {
      id: "rights",
      heading: "Your Privacy Rights",
      blocks: [
        "Under applicable Philippine data privacy laws, you may have rights regarding your personal information, including:",
        [
          "The right to be informed about how your personal information is collected and processed",
          "The right to access your personal information",
          "The right to request correction of inaccurate or incomplete information",
          "The right to object to certain processing of your personal information",
          "The right to request deletion or blocking of personal information where legally applicable",
          "The right to data portability where applicable",
          "The right to lodge a complaint with the National Privacy Commission when you believe your privacy rights have been violated",
        ],
        "To exercise your privacy rights or submit a privacy-related request, please contact TelexPH using the contact information provided below.",
        "TelexPH may need to verify your identity before processing certain requests. Requests will be handled in accordance with applicable laws, regulations, and legitimate business or legal requirements.",
      ],
    },
    {
      id: "third-party",
      heading: "Third-Party Websites and Services",
      blocks: [
        "Our website may contain links or integrations to third-party websites, platforms, or services. TelexPH is not responsible for the privacy practices or content of third-party websites.",
        "Users are encouraged to review the privacy policies of third-party services before providing personal information.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to This Privacy Policy",
      blocks: [
        "TelexPH may update this Privacy Policy from time to time to reflect changes in our services, practices, legal requirements, or security measures.",
        "Any updated version will be posted on this page with the corresponding \"Last Updated\" date.",
      ],
    },
    {
      id: "contact",
      heading: "Contact Us",
      blocks: [
        "For questions, concerns, or requests regarding this Privacy Policy or the handling of personal information, please contact TelexPH:",
        [`Email: ${LEGAL_EMAIL}`, `Website: ${LEGAL_WEBSITE}`],
      ],
    },
  ],
};

export const TERMS = {
  path: "/logistics/terms-and-conditions",
  eyebrow: "Logistics",
  ghost: "TERMS",
  lines: ["Terms &", "Conditions"],
  title: "Terms & Conditions",
  intro:
    "These Terms & Conditions govern your access to and use of the TelexPH Logistics website and related services. By accessing or using the website, you agree to comply with these Terms.",
  highlights: [
    { label: "Lawful use only", text: "Use the website lawfully and without interfering with its operation or security." },
    { label: "Shipment info can change", text: "Delivery details and estimates may change due to circumstances beyond our reasonable control." },
    { label: "Privacy applies too", text: "Your use of the website is also subject to our Privacy Policy." },
  ],
  closing: "By continuing to access or use the TelexPH Logistics website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of Terms",
      blocks: [
        "By accessing the TelexPH Logistics website, submitting an inquiry, requesting logistics assistance, or using any available service, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
        "If you do not agree with these Terms, please discontinue use of the website and its services.",
      ],
    },
    {
      id: "use",
      heading: "Use of the Website",
      blocks: [
        "You agree to use the website only for lawful purposes and in a manner that does not interfere with the operation, security, or availability of the website or its services.",
        "You must not:",
        [
          "Provide false, misleading, or fraudulent information",
          "Attempt to gain unauthorized access to the website or its systems",
          "Interfere with website operations or security controls",
          "Upload malicious software or harmful content",
          "Use the website for unlawful or unauthorized activities",
          "Access information belonging to another user without authorization",
        ],
      ],
    },
    {
      id: "shipment",
      heading: "Shipment and Logistics Information",
      blocks: [
        "Information provided through the Logistics website should be accurate and complete to the best of your knowledge.",
        "Shipment status, delivery information, estimated delivery times, and other logistics information may change due to operational, environmental, transportation, regulatory, or other circumstances beyond our reasonable control.",
        "Where applicable, official shipment records maintained by TelexPH and its authorized logistics systems shall be used as the basis for service-related information.",
      ],
    },
    {
      id: "responsibilities",
      heading: "Customer Responsibilities",
      blocks: [
        "Users are responsible for ensuring that information submitted through the website is accurate and up to date.",
        "Users are also responsible for protecting any account credentials, verification information, or other access information assigned to them and must promptly report suspected unauthorized access.",
      ],
    },
    {
      id: "availability",
      heading: "Service Availability",
      blocks: [
        "TelexPH will make reasonable efforts to maintain the availability and functionality of its Logistics website and services.",
        "However, temporary interruptions may occur due to maintenance, system updates, network issues, security incidents, third-party services, or circumstances beyond our reasonable control.",
      ],
    },
    {
      id: "ip",
      heading: "Intellectual Property",
      blocks: [
        "Unless otherwise stated, the content, design, graphics, logos, text, software, and other materials appearing on the website are owned by or licensed to TelexPH and are protected by applicable intellectual property laws.",
        "You may not reproduce, modify, distribute, publish, or commercially exploit website content without appropriate authorization.",
      ],
    },
    {
      id: "privacy",
      heading: "Privacy and Data Protection",
      blocks: [
        "Your use of the TelexPH Logistics website is also subject to our Privacy Policy, which explains how personal information may be collected, used, stored, and protected.",
        "By using the website, you acknowledge that you have reviewed the applicable Privacy Policy.",
      ],
    },
    {
      id: "security",
      heading: "Security",
      blocks: [
        "Users must not attempt to bypass security controls, access restricted areas, interfere with system logs, compromise accounts, or perform activities that may threaten the confidentiality, integrity, or availability of TelexPH systems or information.",
        "TelexPH reserves the right to investigate suspected security violations and take appropriate action where necessary.",
      ],
    },
    {
      id: "third-party",
      heading: "Third-Party Services",
      blocks: [
        "Certain website functions or logistics services may depend on third-party platforms, systems, networks, or service providers.",
        "TelexPH may not be responsible for interruptions, errors, or limitations caused directly by third-party services beyond its reasonable control.",
      ],
    },
    {
      id: "liability",
      heading: "Limitation of Liability",
      blocks: [
        "To the extent permitted by applicable law, TelexPH shall not be liable for losses or damages resulting from unauthorized use of the website, inaccurate information submitted by users, temporary service interruptions, or circumstances beyond the reasonable control of TelexPH.",
        "Nothing in these Terms is intended to exclude or limit liability where such exclusion or limitation is prohibited by applicable law.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to These Terms",
      blocks: [
        "TelexPH may update these Terms & Conditions from time to time.",
        "Changes will become effective when the updated Terms are published on the website unless otherwise stated.",
        "Your continued use of the website after changes are posted constitutes acceptance of the updated Terms.",
      ],
    },
    {
      id: "law",
      heading: "Governing Law",
      blocks: [
        "These Terms & Conditions shall be interpreted and governed in accordance with the applicable laws of the Philippines, unless otherwise required by applicable law or agreement.",
      ],
    },
    {
      id: "contact",
      heading: "Contact Us",
      blocks: [
        "For questions regarding these Terms & Conditions, please contact TelexPH:",
        [`Email: ${LEGAL_EMAIL}`, `Website: ${LEGAL_WEBSITE}`],
      ],
    },
  ],
};
