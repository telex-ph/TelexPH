
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
const SERVICE_CONFIGS = {
  "ai-builder": {
    name: "AI Builder",
    title: "AI Builder Free Audit",
    description: "Transform your business with cutting-edge AI solutions",
    benefits: ["Expert Analysis", "Quick Results", "ROI Focused"],
    color: "blue",
    bgColor: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      {
        name: "interest",
        type: "select",
        options: ["Process Automation", "Customer Service Chatbots", "Predictive Analytics", "AI Content Generation", "Custom AI Solutions"]
      },
      { name: "challenges", type: "textarea", placeholder: "Tell us about your current business challenges..." }
    ]
  },
  "automation": {
    name: "Automation",
    title: "Automation Free Audit",
    description: "Streamline your operations with intelligent automation solutions",
    benefits: ["Save Time", "Cut Costs", "Reduce Errors"],
    color: "green",
    bgColor: "from-green-50 to-emerald-100",
    borderColor: "border-green-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      {
        name: "processes",
        type: "select",
        options: ["Customer Service", "Sales Processes", "Marketing Automation", "HR & Onboarding", "Financial Processes", "Custom Workflows"]
      },
      {
        name: "teamSize",
        type: "select",
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "201+ employees"]
      }
    ]
  },
  "funnel-builder": {
    name: "Funnel Builder",
    title: "Funnel Builder Free Audit",
    description: "Convert more visitors into customers with high-converting sales funnels",
    benefits: ["Higher Conversions", "Better ROI", "Sales Growth"],
    color: "purple",
    bgColor: "from-purple-50 to-pink-100",
    borderColor: "border-purple-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "website", type: "url", placeholder: "https://yourwebsite.com", required: true },
      { name: "conversionRate", type: "text", placeholder: `e.g., 2% or "I don't know"` },
      {
        name: "visitors",
        type: "select",
        options: ["0-1,000 visitors", "1,000-5,000 visitors", "5,000-20,000 visitors", "20,000+ visitors"]
      }
    ]
  },
  "crm": {
    name: "CRM",
    title: "CRM Free Audit",
    description: "Manage leads, track deals, and grow relationships with a powerful CRM system",
    benefits: ["Lead Management", "Sales Pipeline", "Customer Insights"],
    color: "indigo",
    bgColor: "from-indigo-50 to-blue-100",
    borderColor: "border-indigo-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "currentCRM", type: "text", placeholder: "Current CRM system (if any)" },
      {
        name: "teamSize",
        type: "select",
        options: ["1-5 sales reps", "6-20 sales reps", "21-50 sales reps", "50+ sales reps"]
      }
    ]
  },
  "email-marketing": {
    name: "Email Marketing",
    title: "Email Marketing Free Audit",
    description: "Launch targeted email campaigns that convert with smart automation",
    benefits: ["Higher Open Rates", "Better Engagement", "Automated Campaigns"],
    color: "orange",
    bgColor: "from-orange-50 to-amber-100",
    borderColor: "border-orange-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "listSize", type: "text", placeholder: "Current email list size" },
      {
        name: "goals",
        type: "select",
        options: ["Lead Nurturing", "Sales Promotions", "Newsletter", "Event Invitations", "Customer Retention"]
      }
    ]
  },
  "web-development": {
    name: "Web Development",
    title: "Web Development Free Audit",
    description: "Launch beautiful, fast, and SEO-optimized websites built to represent your brand",
    benefits: ["Modern Design", "Fast Performance", "SEO Optimized"],
    color: "teal",
    bgColor: "from-teal-50 to-cyan-100",
    borderColor: "border-teal-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "currentWebsite", type: "url", placeholder: "Current website URL (if any)" },
      {
        name: "projectType",
        type: "select",
        options: ["New Website", "Website Redesign", "E-commerce", "Web Application", "Landing Page"]
      }
    ]
  },
  "booking-appointment": {
    name: "Booking & Appointment",
    title: "Booking System Free Audit",
    description: "Let clients book appointments seamlessly with automated reminders",
    benefits: ["Easy Booking", "Automated Reminders", "Calendar Sync"],
    color: "cyan",
    bgColor: "from-cyan-50 to-blue-100",
    borderColor: "border-cyan-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "currentSystem", type: "text", placeholder: "Current booking system (if any)" },
      {
        name: "appointmentType",
        type: "select",
        options: ["Consultations", "Services", "Meetings", "Classes", "Events"]
      }
    ]
  },
  "social-media-management": {
    name: "Social Media Management",
    title: "Social Media Free Audit",
    description: "Plan, schedule, and analyze your social media presence across all platforms",
    benefits: ["Content Planning", "Analytics", "Multi-Platform"],
    color: "pink",
    bgColor: "from-pink-50 to-rose-100",
    borderColor: "border-pink-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "socialPlatforms", type: "text", placeholder: "Current social media platforms" },
      {
        name: "goals",
        type: "select",
        options: ["Brand Awareness", "Lead Generation", "Community Building", "Customer Support", "Sales"]
      }
    ]
  },
  "courses-products": {
    name: "Courses/Products",
    title: "Courses & Products Free Audit",
    description: "Create and sell online courses or digital products with built-in payment processing",
    benefits: ["E-Learning Platform", "Payment Integration", "Certificates"],
    color: "amber",
    bgColor: "from-amber-50 to-yellow-100",
    borderColor: "border-amber-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "courseType", type: "text", placeholder: "Type of courses/products you want to sell" },
      {
        name: "audience",
        type: "select",
        options: ["General Public", "Professionals", "Students", "Corporate Training", "Hobbyists"]
      }
    ]
  },
  "csr": {
    name: "CSR",
    title: "Customer Service Free Audit",
    description: "Deliver exceptional customer service with ticketing, live chat, and support automation",
    benefits: ["Ticketing System", "Live Chat", "Support Automation"],
    color: "red",
    bgColor: "from-red-50 to-rose-100",
    borderColor: "border-red-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "currentSupport", type: "text", placeholder: "Current customer support system" },
      {
        name: "supportVolume",
        type: "select",
        options: ["1-50 tickets/day", "51-200 tickets/day", "201-500 tickets/day", "500+ tickets/day"]
      }
    ]
  },
  "document-signing": {
    name: "Document Signing",
    title: "Document Signing Free Audit",
    description: "Streamline your document workflow with secure digital signature solutions",
    benefits: ["Digital Signatures", "Secure Storage", "Workflow Automation"],
    color: "slate",
    bgColor: "from-slate-50 to-gray-100",
    borderColor: "border-slate-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "documentTypes", type: "text", placeholder: "Types of documents you need signed" },
      {
        name: "signingVolume",
        type: "select",
        options: ["1-10 documents/month", "11-50 documents/month", "51-200 documents/month", "200+ documents/month"]
      }
    ]
  },
  "gray-label": {
    name: "Gray-Label",
    title: "Gray-Label Solutions Free Audit",
    description: "Offer our platform under your own brand and expand your service portfolio",
    benefits: ["White Label", "Brand Customization", "Resell Ready"],
    color: "gray",
    bgColor: "from-gray-50 to-slate-100",
    borderColor: "border-gray-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "targetMarket", type: "text", placeholder: "Your target market/industry" },
      {
        name: "businessModel",
        type: "select",
        options: ["Agency", "Consulting", "Reseller", "Integration Partner", "Franchise"]
      }
    ]
  },
  "sms": {
    name: "SMS",
    title: "SMS Marketing Free Audit",
    description: "Reach customers directly with powerful SMS marketing and communication solutions",
    benefits: ["High Open Rates", "Instant Delivery", "Automation"],
    color: "green",
    bgColor: "from-green-50 to-emerald-100",
    borderColor: "border-green-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "listSize", type: "text", placeholder: "Current SMS list size" },
      {
        name: "useCase",
        type: "select",
        options: ["Marketing Campaigns", "Appointment Reminders", "Notifications", "Alerts", "Customer Support"]
      }
    ]
  },
  "survey-forms": {
    name: "Surveys & Forms",
    title: "Surveys & Forms Free Audit",
    description: "Collect valuable feedback and data with custom forms, surveys, and detailed reports",
    benefits: ["Custom Forms", "Real-time Analytics", "Data Export"],
    color: "blue",
    bgColor: "from-blue-50 to-indigo-100",
    borderColor: "border-blue-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "surveyType", type: "text", placeholder: "Type of surveys/forms you need" },
      {
        name: "responseVolume",
        type: "select",
        options: ["1-100 responses/month", "101-1000 responses/month", "1001-5000 responses/month", "5000+ responses/month"]
      }
    ]
  },
  "tech-support": {
    name: "Tech Support",
    title: "Tech Support Free Audit",
    description: "Get reliable technical support whenever you need it - fast, remote, and always available",
    benefits: ["24/7 Support", "Remote Assistance", "Fast Response"],
    color: "indigo",
    bgColor: "from-indigo-50 to-blue-100",
    borderColor: "border-indigo-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "supportNeeds", type: "text", placeholder: "Current technical support challenges" },
      {
        name: "urgency",
        type: "select",
        options: ["Immediate Support Needed", "Planning for Future", "Backup Support", "Specialized Expertise"]
      }
    ]
  },
  "video-graphics-design": {
    name: "Video & Graphics Design",
    title: "Video & Graphics Design Free Audit",
    description: "Create stunning visual content and videos that captivate your audience",
    benefits: ["Professional Design", "Video Production", "Brand Consistency"],
    color: "purple",
    bgColor: "from-purple-50 to-pink-100",
    borderColor: "border-purple-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "projectType", type: "text", placeholder: "Type of design/video projects needed" },
      {
        name: "timeline",
        type: "select",
        options: ["ASAP", "Within 1 month", "2-3 months", "Ongoing projects"]
      }
    ]
  },
  "website-builder": {
    name: "Website Builder",
    title: "Website Builder Free Audit",
    description: "Build professional websites with our intuitive drag-and-drop website builder",
    benefits: ["Drag & Drop", "No Coding", "Mobile Responsive"],
    color: "teal",
    bgColor: "from-teal-50 to-cyan-100",
    borderColor: "border-teal-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "websiteType", type: "text", placeholder: "Type of website you want to build" },
      {
        name: "technicalSkill",
        type: "select",
        options: ["No technical experience", "Basic knowledge", "Intermediate", "Advanced"]
      }
    ]
  },
  "white-label": {
    name: "White-Label",
    title: "White-Label Solutions Free Audit",
    description: "Offer our complete platform under your brand with full customization options",
    benefits: ["Full Branding", "Custom Features", "Revenue Sharing"],
    color: "zinc",
    bgColor: "from-zinc-50 to-gray-100",
    borderColor: "border-zinc-200",
    fields: [
      { name: "firstName", type: "text", placeholder: "John", required: true },
      { name: "lastName", type: "text", placeholder: "Doe", required: true },
      { name: "email", type: "email", placeholder: "john@company.com", required: true },
      { name: "company", type: "text", placeholder: "Acme Corporation", required: true },
      { name: "targetClients", type: "text", placeholder: "Your target client base" },
      {
        name: "scale",
        type: "select",
        options: ["Startup", "Small Business", "Medium Enterprise", "Large Enterprise"]
      }
    ]
  }
};
function FunnelPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.service;
  const config = SERVICE_CONFIGS[serviceId];
  useEffect(() => {
    if (serviceId && config) {
      const trackFunnelView = async () => {
        try {
          await fetch("/api/page-views/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: window.location.href,
              sessionId: sessionStorage.getItem("sessionId") || `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              isConversion: false,
              funnelName: config.name
            })
          });
        } catch (error) {
          console.log("Funnel tracking error:", error);
        }
      };
      trackFunnelView();
    }
  }, [serviceId, config]);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/page-views/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: window.location.href,
          sessionId: sessionStorage.getItem("sessionId") || `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          isConversion: true,
          funnelName: config.name
        })
      });
    } catch (error) {
      console.log("Conversion tracking error:", error);
    }
    alert(`Thank you for your interest in ${config.name}! We'll contact you soon for your free audit.`);
  };
  if (!config) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The requested service funnel is not available.</p>
          <button
      onClick={() => router.back()}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
            Go Back
          </button>
        </div>
      </div>;
  }
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    teal: "bg-teal-600 hover:bg-teal-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    pink: "bg-pink-600 hover:bg-pink-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    red: "bg-red-600 hover:bg-red-700",
    slate: "bg-slate-600 hover:bg-slate-700",
    gray: "bg-gray-600 hover:bg-gray-700",
    zinc: "bg-zinc-600 hover:bg-zinc-700"
  };
  const lightColorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    teal: "bg-teal-50 text-teal-600",
    cyan: "bg-cyan-50 text-cyan-600",
    pink: "bg-pink-50 text-pink-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-50 text-slate-600",
    gray: "bg-gray-50 text-gray-600",
    zinc: "bg-zinc-50 text-zinc-600"
  };
  const borderColorClasses = {
    blue: "border-blue-200",
    green: "border-green-200",
    purple: "border-purple-200",
    indigo: "border-indigo-200",
    orange: "border-orange-200",
    teal: "border-teal-200",
    cyan: "border-cyan-200",
    pink: "border-pink-200",
    amber: "border-amber-200",
    red: "border-red-200",
    slate: "border-slate-200",
    gray: "border-gray-200",
    zinc: "border-zinc-200"
  };
  return <div className={`min-h-screen bg-gradient-to-br ${config.bgColor}`}>
      {
    /* Funnel Header */
  }
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
    onClick={() => router.back()}
    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
  >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {
    /* Funnel Content */
  }
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {config.description}
          </p>
          <div className={`${lightColorClasses[config.color]} ${borderColorClasses[config.color]} border rounded-lg p-4 max-w-2xl mx-auto`}>
            <p className={config.color === "orange" ? "text-orange-800" : config.color === "pink" ? "text-pink-800" : `text-${config.color}-800`}>
              <strong>What you'll get:</strong> Complete analysis, implementation strategy, and personalized roadmap
            </p>
          </div>
        </div>

        {
    /* Audit Form */
  }
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Your Free {config.name} Audit</h2>
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {config.fields.slice(0, 2).map((field) => <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.placeholder || field.name} *
                  </label>
                  <input
    type={field.type}
    required={field.required}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder={field.placeholder}
  />
                </div>)}
            </div>

            {config.fields.slice(2).map((field) => <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.placeholder || field.name} {field.required && "*"}
                </label>
                {field.type === "select" ? <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select an option</option>
                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select> : field.type === "textarea" ? <textarea
    rows={4}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder={field.placeholder}
  /> : <input
    type={field.type}
    required={field.required}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder={field.placeholder}
  />}
              </div>)}

            <button
    type="submit"
    className={`w-full ${colorClasses[config.color]} text-white py-4 px-6 rounded-lg font-semibold transition-colors`}
  >
              Get My Free {config.name} Audit
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>No credit card required. Free audit with no obligations.</p>
          </div>
        </div>

        {
    /* Benefits Section */
  }
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {config.benefits.map((benefit, index) => <div key={benefit} className="text-center">
              <div className={`${lightColorClasses[config.color]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {index === 0 && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>}
                {index === 1 && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>}
                {index === 2 && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>}
              </div>
              <h3 className="font-semibold mb-2">{benefit}</h3>
              <p className="text-gray-600">Get insights from specialists with years of experience</p>
            </div>)}
        </div>
      </div>
    </div>;
}
export {
  FunnelPage as default
};
