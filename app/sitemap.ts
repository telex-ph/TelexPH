import { MetadataRoute } from 'next'

// List of your main site routes
const routes = [
  { path: '/', priority: 1.0 },
  { path: '/location', priority: 0.8 },
  { path: '/about', priority: 0.8 },
  { path: '/services', priority: 0.8 },
  { path: '/contact', priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.telexph.com'

  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(), // always current date
    changeFrequency: 'weekly',
    priority: route.priority,
  }))
}
