import { url } from "inspector";

export const navLinks = [
    {
        id:1,
        url:"#home", // Anchor Link: Home section (gagamitin natin ito sa mobile para mag-scroll sa taas)
        label:"Home"
    },
    {
        id:2,
        url:"#about", // Anchor Link: About section sa homepage
        label:"About",
        // Idinagdag ang dropdown
        dropdown: [
            {
                id: 201,
                url: "/about", // Ito ang magli-link sa app/about/page.tsx (About Overview)
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
        url:"#choose", // Anchor Link: Why Choose Us section
        label:"Why Choose Us" 
    }
]