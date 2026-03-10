import { MetadataRoute } from 'next'

const routes = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/location', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/resources/blogs', priority: 0.8, changeFrequency: 'daily' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // ✅ Consistent: no "www" — matches metadataBase in layout.tsx and robots.txt
  const baseUrl = 'https://telexph.com'

  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}