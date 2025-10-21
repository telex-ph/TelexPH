import { MetadataRoute } from 'next'

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
    lastModified: new Date(), 
    changeFrequency: 'weekly',
    priority: route.priority,
  }))
}
