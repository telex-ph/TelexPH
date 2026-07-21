import FeatureCard from "./FeatureCard";
const FeaturesSection = ({ features }) => {
  return <div className="lg:col-span-4 flex flex-col gap-6">
      {features.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
    </div>;
};
var stdin_default = FeaturesSection;
export {
  stdin_default as default
};
