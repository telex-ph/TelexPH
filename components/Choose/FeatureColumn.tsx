import React from "react";
import FeatureCard from "./FeatureCard";

type Feature = {
  id: number;
  title: string;
  description: string;
  icon: string;
  hasRedDot?: boolean;
};

type Props = {
  features: Feature[];
};

const FeatureColumn = ({ features }: Props) => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
};

export default FeatureColumn;
