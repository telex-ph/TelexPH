
import { COLORS, FONTS, FONT_WEIGHTS, FONT_CLASSES } from "@/constant/styles";
const UseCaseSolution = () => {
  const secondarySolutions = [
    {
      title: "Predictive Analytics",
      tag: "Data Science",
      description: "Analyze historical patterns to forecast future trends, allowing for proactive resource allocation and risk mitigation.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Automated Compliance",
      tag: "Governance",
      description: "Real-time monitoring of communication channels to ensure all interactions meet industry-specific legal and ethical standards.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Seamless CRM Sync",
      tag: "Integration",
      description: "Instant data bi-directional synchronization between your communication stack and core business databases.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Global Scalability",
      tag: "Infrastructure",
      description: "Deploy solutions across multiple regions with zero latency issues, ensuring a consistent experience worldwide.",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=500"
    }
  ];
  return <section className="py-24 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
    className="uppercase tracking-[0.25em] py-2 inline-block text-[10px] md:text-[14px]"
    style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary }}
  >
                — Solution Architecture
              </span>
            </div>

            <h2
    className="text-4xl md:text-[48px] mb-6 uppercase tracking-tighter leading-none"
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: "#282828" }}
  >
              Intelligent
              <br />
              <span style={{ color: COLORS.primary }}>Orchestration.</span>
            </h2>

            <p className="max-w-2xl leading-relaxed text-gray-500 text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular }}>
              Our framework integrates cognitive computing with enterprise-grade infrastructure to deliver autonomous operational excellence across every touchpoint.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        
          <div className="md:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden group min-h-[550px]">
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <span
    className="inline-block py-2 px-5 rounded-md bg-gray-50 text-gray-500 uppercase tracking-widest mb-6"
    style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "10px" }}
  >
                  Neural Engine v2.0
                </span>
                <h3
    className="text-2xl md:text-[28px] mb-6 leading-tight uppercase tracking-tight"
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: "#282828" }}
  >
                  Cognitive Operational Layer
                </h3>
                <p className="text-gray-500 leading-relaxed mb-10 text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular }}>
                  Analyze historical patterns to forecast future trends, allowing for proactive resource allocation. Unstructured data transitions meet industry standards.
                </p>
                <div className="space-y-4 mt-6">
                  {["Low-Latency API Gateway", "Dynamic API Gateway", "Dynamic Load Balancing"].map((item, idx) => <div key={idx} className="flex items-center gap-5 p-4 rounded-lg bg-gray-50/80 border border-gray-100 shadow-sm transition-transform group-hover:translate-x-1">
                      <div className="w-3 h-3 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: COLORS.primary }} />
                      <p
    className="uppercase tracking-wider"
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "12px", color: "#282828" }}
  >
                        {item}
                      </p>
                    </div>)}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col gap-4 bg-gray-50/30">
               <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden shadow-sm">
                 <img
    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
    alt="Tech"
  />
               </div>
               <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden shadow-sm">
                 <img
    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
    alt="Office"
  />
               </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm flex flex-col justify-center flex-1 transition-all hover:shadow-md">
                <h4 className={`${FONT_CLASSES.openSansBold} text-4xl md:text-5xl font-bold mb-3 tracking-tighter`} style={{ color: COLORS.primary }}>80%</h4>
                <p className={`${FONT_CLASSES.openSansBold} text-xs font-bold text-gray-900 uppercase tracking-widest mb-3`}>Query Automation</p>
                <div className="w-12 h-1.5 mb-5 rounded-full opacity-20" style={{ backgroundColor: COLORS.primary }} />
                <p className="text-sm text-gray-400 leading-relaxed font-normal">
                  Reduction in manual ticket handling across all integrated departments.
                </p>
            </div>
            
            <div className="p-10 rounded-2xl text-white relative overflow-hidden flex flex-col justify-center flex-1 transition-all hover:shadow-lg" style={{ backgroundColor: COLORS.primary }}>
                <div className="relative z-10">
                    <h4 className={`${FONT_CLASSES.openSansBold} text-4xl md:text-5xl font-bold mb-3 tracking-tighter`}>24/7</h4>
                    <p className={`${FONT_CLASSES.openSansBold} text-xs font-bold text-white uppercase tracking-widest mb-3`}>System Reliability</p>
                    <div className="w-12 h-1.5 mb-5 rounded-full bg-white/20" />
                    <p className="text-sm text-white/70 leading-relaxed font-normal">
                      Continuous monitoring and automated failover protocols ensuring uptime.
                    </p>
                </div>
                <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {secondarySolutions.map((item, index) => <div key={index} className="bg-white border border-gray-100 p-5 md:p-7 rounded-xl hover:border-gray-200 transition-all group shadow-sm flex flex-col">
              <div className="w-full h-40 rounded-lg mb-6 overflow-hidden bg-gray-50">
                <img
    src={item.image}
    alt={item.title}
    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
  />
              </div>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{item.tag}</p>
              <h4 className={`${FONT_CLASSES.openSansBold} text-base md:text-lg font-bold text-gray-800 mb-3 uppercase tracking-tight`}>
                {item.title}
              </h4>
              <p className="text-[12px] md:text-[14px] text-gray-500 leading-relaxed flex-grow font-normal">
                {item.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
var stdin_default = UseCaseSolution;
export {
  stdin_default as default
};
