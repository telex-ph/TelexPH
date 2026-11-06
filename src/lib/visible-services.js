// Services shown on the homepage + /services: active only, one CSR card, fixed order.
// ponytail: "Coming soon" cards are hidden here; to bring them back, drop the isActive filter.
const ORDER = ["csr", "tech-support", "automation", "ai-builder", "website-builder", "funnel-builder"];
const CSR_IDS = ["csr", "csr-customer-service"];

const rank = (s) => {
  const i = ORDER.indexOf(CSR_IDS.includes(s.serviceId) ? "csr" : s.serviceId);
  return i === -1 ? ORDER.length : i;
};

export const CSR_FEATURES = [
  "Email, chat and voice support",
  "Returns, refunds and order issues",
  "QA and weekly KPI reports"
];

export function visibleServices(list) {
  let seenCsr = false;
  return list
    .filter((s) => s.isActive)
    .filter((s) => {
      if (!CSR_IDS.includes(s.serviceId)) return true;
      if (seenCsr) return false;
      seenCsr = true;
      return true;
    })
    .sort((a, b) => rank(a) - rank(b));
}
