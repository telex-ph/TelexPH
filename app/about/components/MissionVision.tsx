import React from "react";
import { Target, Eye, Users, Award, TrendingUp, Heart } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

export default function MissionVision() {
  return (
    <div className="bg-gray-50">
      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" />
            <span
              className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
              style={{ color: COLORS.primary }}
            >
              — WHAT DRIVES US FORWARD
            </span>
          </div>
        </div>

        {/* Mission and Vision Cards */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Mission Card */}
            <div className="group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                    style={{ borderColor: COLORS.primary }}
                  >
                    <Target
                      className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]"
                      style={{ color: COLORS.primary }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                      style={{ borderColor: COLORS.primary }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2
                    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-tight`}
                  >
                    MISSION
                  </h2>
                  <p
                    className={`${FONT_CLASSES.rubikRegular} text-gray-600 text-sm sm:text-base leading-relaxed`}
                  >
                    To empower businesses through innovative outsourcing
                    solutions, cutting-edge technology, and adaptive strategies
                    that drive efficiency, growth, and long-term success.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                    style={{ borderColor: COLORS.dark }}
                  >
                    <Eye
                      className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]"
                      style={{ color: COLORS.dark }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                      style={{ borderColor: COLORS.dark }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2
                    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-tight`}
                  >
                    VISION
                  </h2>
                  <p
                    className={`${FONT_CLASSES.rubikRegular} text-gray-600 text-sm sm:text-base leading-relaxed`}
                  >
                    To be a global leader in business process solutions,
                    recognized for harnessing innovation, people, and technology
                    to create sustainable value, transform industries, and shape
                    the future of work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 sm:py-16 bg-gray-50 -mt-4 sm:-mt-5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
          {/* Header with Diamond Icon */}
          <div className="mb-10 sm:mb-16">
            {/* Mobile & Mid Screen Layout */}
            <div className="flex items-center gap-4 sm:gap-6 lg:hidden">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                  style={{ borderColor: COLORS.primary }}
                >
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: COLORS.primary }}
                  >
                    <path d="M12 2L2 9l10 13 10-13-10-7z" />
                    <path d="M2 9h20" />
                    <path d="M12 2l4 7-4 13-4-13 4-7z" />
                  </svg>
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                    style={{ borderColor: COLORS.primary }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h2
                  className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 tracking-tight translate-y-1`}
                >
                  CORE VALUES
                </h2>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-1 rounded-full"
                      style={{ backgroundColor: COLORS.primary }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                  style={{ borderColor: COLORS.primary }}
                >
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: COLORS.primary }}
                  >
                    <path d="M12 2L2 9l10 13 10-13-10-7z" />
                    <path d="M2 9h20" />
                    <path d="M12 2l4 7-4 13-4-13 4-7z" />
                  </svg>
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                    style={{ borderColor: COLORS.primary }}
                  />
                </div>
              </div>

              <h2
                className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 tracking-tight text-center sm:text-left`}
              >
                CORE VALUES
              </h2>
            </div>
          </div>

          {/* Core Values Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Provide",
                desc: "Jobs and to give employee a friendly work environment where they can hone their skills.",
                icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />,
              },
              {
                title: "Contribute",
                desc: "To the continued worldwide development of service industry through management.",
                icon: <Award className="w-6 h-6 sm:w-7 sm:h-7" />,
              },
              {
                title: "Pursue",
                desc: "Total Quality and Customer Satisfaction allowing Company, Employees, and Community to grow.",
                icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />,
              },
              {
                title: "Grow & Prosper",
                desc: "With an appreciative feeling of mutual pride & trust.",
                icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
              >
                {/* Top section */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:block">
                  <div
                    className="sm:flex md:flex lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <div style={{ color: COLORS.primary }}>{item.icon}</div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span
                      className={`${FONT_CLASSES.openSansBold} text-xs sm:text-sm text-gray-900`}
                    >
                      To
                    </span>
                    <h3
                      className={`${FONT_CLASSES.poppinsBlack} text-lg sm:text-2xl text-gray-900 leading-tight`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* ✅ Description (normal weight, not bold) */}
                <p
                  className={`${FONT_CLASSES.rubikRegular} text-gray-700 text-[13px] sm:text-[14px] leading-relaxed mb-3 sm:mb-4`}
                >
                  {item.desc}
                </p>

                <div
                  className="hidden lg:flex w-14 h-14 rounded-full items-center justify-center absolute bottom-4 right-4"
                  style={{ backgroundColor: COLORS.primaryLight }}
                >
                  <div style={{ color: COLORS.primary }}>{item.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
