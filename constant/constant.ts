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
        // dropdown: [ // Commented out as requested
        //     {
        //         id: 201,
        //         url: "/about", 
        //         label: "About Overview"
        //     }
        // ]
    },
    {
        id:3,
        url:"#services", // Updated to point to the 'Services.tsx' section ID
        label:"Services"
    },
    {
        id:4,
        url:"#choose", // Updated to point to the 'Choose.tsx' section ID (Industry -> Choose)
        label:"Industry"
    },
    {
        id:5,
        url:"#process", // Updated to point to the 'Process.tsx' section ID (Careers -> Process)
        label:"Careers"
    },
]