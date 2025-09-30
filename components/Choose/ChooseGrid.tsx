import React from "react";
import FeatureColumn from "./FeatureColumn";
import CenterGrid from "./CenterGrid";

const ChooseGrid = () => {
  const leftFeatures = [
    {
      id: 1,
      title: "Innovative Solutions",
      description: "In addition to residential services, we specialize in commercial.",
      icon: "layers",
    },
    {
      id: 2,
      title: "Construction Expertise",
      description: "For those looking to enhance their energy independence.",
      icon: "building",
    },
    {
      id: 3,
      title: "Comprehensive Service",
      description: "Our wide network of equipment and technology suppliers.",
      icon: "wrench",
    },
  ];

  const rightFeatures = [
    {
      id: 4,
      title: "Innovative Solutions",
      description: "Understanding the financial aspects of solar installation.",
      icon: "shield",
    },
    {
      id: 5,
      title: "Powered by Trust",
      description: "Our wide network of equipment and technology suppliers.",
      icon: "network",
    },
    {
      id: 6,
      title: "Eco-Friendly",
      description: "To ensure your construction system operates at peak performance.",
      icon: "leaf",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - 3 Feature Cards */}
      <FeatureColumn features={leftFeatures} />

      {/* Center Column - 2x2 Grid */}
      <CenterGrid />

      {/* Right Column - 3 Feature Cards */}
      <FeatureColumn features={rightFeatures} />
    </div>
  );
};

export default ChooseGrid;
