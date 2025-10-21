import { MetadataRoute } from 'next'

<<<<<<< HEAD
=======
// List of your main site routes
>>>>>>> 9d000644f603a041525d96199e33636e12b3a1ff
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
<<<<<<< HEAD
    lastModified: new Date(), 
=======
    lastModified: new Date(), // always current date
>>>>>>> 9d000644f603a041525d96199e33636e12b3a1ff
    changeFrequency: 'weekly',
    priority: route.priority,
  }))
}
