import { url } from "inspector";

export const navLinks = [
    {
        id:1,
        url:"/",
        label:"Home"
    },
    {
        id:2,
        url:"#about",
        label:"About",
        dropdown: [
            {
                id: 201,
                url: "/about", 
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
        url:"#choose",
        label:"Why Choose Us" 
    }
]