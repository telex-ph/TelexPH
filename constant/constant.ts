import { url } from "inspector";

export const navLinks = [
    {
        id:1,
        url:"/", // Home page URL (not anchor)
        label:"Home"
    },
    {
        id:2,
        url:"#about", // **FIXED**: Anchor link na ito para sa About section sa HOMEPAGE
        label:"About",
        // Dropdown para sa About Overview Page
        dropdown: [
            {
                id: 201,
                url: "/about", // Ito ang magli-link sa app/about/page.tsx (Overview Page)
                label: "About Overview"
            }
        ]
    },
    {
        id:3,
        url:"#services",
        label:"Services"
    },
    {
        id:4,
        url:"#industry",
        label:"Industry"
    },
    {
        id:5,
        url:"#careers",
        label:"Careers"
    },
    {
        id:6,
        url:"#choose", // Anchor Link para sa Choose section
        label:"Why Choose Us" 
    }
]