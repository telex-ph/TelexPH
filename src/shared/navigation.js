import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

/**
 * Drop-in replacements for `next/navigation`.
 *
 * `useRouter()` returns an object shaped like Next's App Router instance
 * (push / replace / back / forward / refresh) so existing call sites such as
 * `router.push("/contact")` keep working verbatim.
 */
export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (href) => navigate(href),
    replace: (href) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => navigate(0),
    prefetch: () => {},
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export { useParams };
