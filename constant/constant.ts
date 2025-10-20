import { url } from "inspector";

export const navLinks = [
  {
    id: 1,
    url: "/",
    label: "Home",
  },
  {
    id: 2,
    url: "#about",
    label: "About",
    dropdown: [
      {
        id: 21,
        url: "/about",  
        label: "Company Overview",
      },
    ],
  },
  {
    id: 3,
    url: "#services",
    label: "Services",
    dropdown: [
      {
        id: 31,
        url: "/services",
        label: "What We Offer",
      },
    ],
  },
  {
    id: 4,
    url: "#choose",
    label: "Why us",
  },
  {
    id: 5,
    url: "#process",
    label: "Careers",
  },
];