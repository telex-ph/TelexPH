import VAassesment from "./VAassesment";
const metadata = {
  title: "Client Portal | Assessments",
  description: "Review and score VA assessment submissions."
};
function Page() {
  return <VAassesment />;
}
export {
  Page as default,
  metadata
};
