import { Link as RouterLink } from "react-router-dom";
import { prefetchRoute } from "./prefetch";

/**
 * Drop-in replacement for `next/link`.
 *
 * Accepts `href` (Next's prop) and forwards to react-router's `to`.
 * External links, mailto:, tel: and hash-only links fall back to a plain <a>
 * so they behave exactly as they did before.
 *
 * Hovering (or focusing) an internal link starts downloading that route's
 * chunk, which is roughly what next/link's prefetch did. Pass `prefetch={false}`
 * to opt out.
 */
const Link = ({
  href = "",
  children,
  replace,
  scroll,
  prefetch = true,
  onMouseEnter,
  onFocus,
  ...rest
}) => {
  const isExternal =
    /^(https?:)?\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const warm = () => {
    if (prefetch !== false) prefetchRoute(href.split("#")[0].split("?")[0]);
  };

  if (isExternal) {
    return (
      <a
        href={href}
        {...(/^(https?:)?\/\//i.test(href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href}
      replace={replace}
      onMouseEnter={(e) => {
        warm();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      {...rest}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
