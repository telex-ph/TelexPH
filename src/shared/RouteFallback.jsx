/**
 * Shown while a lazily-loaded route chunk is downloading.
 *
 * Deliberately blank rather than a spinner: chunks usually arrive in a few
 * dozen milliseconds, and a spinner that appears and vanishes that fast reads
 * as a flicker. Reserving full viewport height keeps the header from jumping.
 */
const RouteFallback = () => (
  <div style={{ minHeight: "100dvh" }} aria-busy="true" />
);

export default RouteFallback;
