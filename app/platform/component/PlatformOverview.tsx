"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Tab = "platforms" | "tools" | "industries";
interface Platform { name: string; country: string; image: string; }
interface IndustryAccount { abbr: string; name: string; desc: string; tag: string; avatarClass?: string; }
interface IndustryPanel {
  key: string; label: string; count: string; backdropLetters: string;
  eyebrow: string; title: string; body: string; accounts: IndustryAccount[];
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=360&fit=crop&crop=face",
];

const COUNTRIES = ["ALL","NL","FR","ES","BG","CH","DE","HU","IT","BE","AE","SI","SK","HR","SA","JP","TR","DK","UA","GR","US","UK","AU","IE","CZ"];
const countryNames: Record<string,string> = {
  ALL:"All Regions",NL:"Netherlands",FR:"France",ES:"Spain",BG:"Bulgaria",
  CH:"Switzerland",DE:"Germany",HU:"Hungary",IT:"Italy",BE:"Belgium",
  AE:"UAE / Middle East",SI:"Slovenia",SK:"Slovakia",HR:"Croatia",
  SA:"Saudi Arabia",JP:"Japan",TR:"Turkey",DK:"Denmark",UA:"Ukraine",
  GR:"Greece",US:"United States",UK:"United Kingdom",AU:"Australia",
  IE:"Ireland",CZ:"Czech Republic",
};

const platforms: Platform[] = [
  {name:"Carrefour",country:"ES",image:"/images/Platform/Carrefour.png"},
  {name:"Conforama",country:"FR",image:"/images/Platform/Conforama.png"},
  {name:"Brico Depot",country:"ES",image:"/images/Platform/Brico.png"},
  {name:"Pccomp",country:"SK",image:"https://picsum.photos/id/1043/600/400"},
  {name:"Planeta Huerto",country:"ES",image:"https://picsum.photos/id/1047/600/400"},
  {name:"Sprinter",country:"ES",image:"https://picsum.photos/id/1050/600/400"},
  {name:"Tiendanimal",country:"ES",image:"https://picsum.photos/id/1053/600/400"},
  {name:"KIABI",country:"FR",image:"https://picsum.photos/id/106/600/400"},
  {name:"MANOMANO",country:"FR",image:"https://picsum.photos/id/1060/600/400"},
  {name:"MIRAVIA",country:"ES",image:"https://picsum.photos/id/1062/600/400"},
  {name:"Leroy Merlin",country:"FR",image:"https://picsum.photos/id/133/600/400"},
  {name:"CDON",country:"DK",image:"https://picsum.photos/id/1068/600/400"},
  {name:"FYNDIQ",country:"DK",image:"https://picsum.photos/id/1069/600/400"},
  {name:"Altex",country:"BG",image:"https://picsum.photos/id/1071/600/400"},
  {name:"CEL",country:"BG",image:"https://picsum.photos/id/1072/600/400"},
  {name:"Okazii",country:"BG",image:"https://picsum.photos/id/1073/600/400"},
  {name:"Public",country:"GR",image:"https://picsum.photos/id/1074/600/400"},
  {name:"Vivre",country:"BG",image:"https://picsum.photos/id/1075/600/400"},
  {name:"Worten",country:"ES",image:"https://picsum.photos/id/1076/600/400"},
  {name:"ClubeFashion",country:"ES",image:"https://picsum.photos/id/1077/600/400"},
  {name:"Sport Zone",country:"ES",image:"https://picsum.photos/id/1078/600/400"},
  {name:"KuantoKusta",country:"ES",image:"https://picsum.photos/id/1079/600/400"},
  {name:"Decathlon",country:"FR",image:"https://picsum.photos/id/1080/600/400"},
  {name:"Brico",country:"BE",image:"https://picsum.photos/id/1081/600/400"},
  {name:"Inno",country:"BE",image:"https://picsum.photos/id/1082/600/400"},
  {name:"FNAC",country:"BE",image:"https://picsum.photos/id/1083/600/400"},
  {name:"Hubo",country:"BE",image:"https://picsum.photos/id/1084/600/400"},
  {name:"KAUFLAND",country:"DE",image:"https://picsum.photos/id/1085/600/400"},
  {name:"OTTO",country:"DE",image:"https://picsum.photos/id/1086/600/400"},
  {name:"Check 24",country:"DE",image:"https://picsum.photos/id/1087/600/400"},
  {name:"Newegg",country:"US",image:"/images/Platform/Newegg.png"},
  {name:"eBay",country:"US",image:"https://picsum.photos/id/292/600/400"},
  {name:"Houzz",country:"US",image:"https://picsum.photos/id/1090/600/400"},
  {name:"Kroger",country:"US",image:"https://picsum.photos/id/1091/600/400"},
  {name:"Macys",country:"US",image:"https://picsum.photos/id/1092/600/400"},
  {name:"SEARS",country:"US",image:"https://picsum.photos/id/1093/600/400"},
  {name:"Overstock",country:"US",image:"https://picsum.photos/id/1094/600/400"},
  {name:"RetailCloud",country:"US",image:"https://picsum.photos/id/1095/600/400"},
  {name:"Temu",country:"US",image:"https://picsum.photos/id/1096/600/400"},
  {name:"WALMART",country:"US",image:"https://picsum.photos/id/251/600/400"},
  {name:"Shein",country:"US",image:"https://picsum.photos/id/1098/600/400"},
  {name:"WISH",country:"US",image:"https://picsum.photos/id/1099/600/400"},
  {name:"BUNNINGS",country:"AU",image:"https://picsum.photos/id/10/600/400"},
  {name:"Catch of the Day",country:"AU",image:"https://picsum.photos/id/11/600/400"},
  {name:"Barbequesgalore",country:"AU",image:"https://picsum.photos/id/12/600/400"},
  {name:"Harvey Norman",country:"AU",image:"https://picsum.photos/id/870/600/400"},
  {name:"OZSALE",country:"AU",image:"https://picsum.photos/id/14/600/400"},
  {name:"Conrad",country:"DE",image:"https://picsum.photos/id/15/600/400"},
  {name:"Metro",country:"DE",image:"https://picsum.photos/id/16/600/400"},
  {name:"MediaMarkt",country:"DE",image:"https://picsum.photos/id/411/600/400"},
  {name:"HOOD",country:"DE",image:"https://picsum.photos/id/18/600/400"},
  {name:"YATEGO",country:"DE",image:"https://picsum.photos/id/19/600/400"},
  {name:"PRAXIS",country:"NL",image:"https://picsum.photos/id/20/600/400"},
  {name:"Brico Bravo",country:"BE",image:"https://picsum.photos/id/21/600/400"},
  {name:"Eprice",country:"IT",image:"https://picsum.photos/id/22/600/400"},
  {name:"IBS",country:"IT",image:"https://picsum.photos/id/23/600/400"},
  {name:"Fruugo",country:"UK",image:"https://picsum.photos/id/24/600/400"},
  {name:"OBI",country:"DE",image:"https://picsum.photos/id/25/600/400"},
  {name:"AUCHAN",country:"FR",image:"https://picsum.photos/id/26/600/400"},
  {name:"Boulanger",country:"FR",image:"https://picsum.photos/id/27/600/400"},
  {name:"bricomarche",country:"FR",image:"https://picsum.photos/id/28/600/400"},
  {name:"Castorama",country:"FR",image:"https://picsum.photos/id/29/600/400"},
  {name:"Truffaut",country:"FR",image:"https://picsum.photos/id/30/600/400"},
  {name:"ELeclerc",country:"FR",image:"https://picsum.photos/id/31/600/400"},
  {name:"laposte",country:"FR",image:"https://picsum.photos/id/32/600/400"},
  {name:"Darty",country:"FR",image:"https://picsum.photos/id/33/600/400"},
  {name:"Cdiscount",country:"FR",image:"https://picsum.photos/id/34/600/400"},
  {name:"RAKUTEN",country:"JP",image:"https://picsum.photos/id/1018/600/400"},
  {name:"Rue de Commerce",country:"FR",image:"https://picsum.photos/id/36/600/400"},
  {name:"ShowroomPrive",country:"FR",image:"https://picsum.photos/id/37/600/400"},
  {name:"ubaldi",country:"FR",image:"https://picsum.photos/id/38/600/400"},
  {name:"Zooplus",country:"DE",image:"https://picsum.photos/id/39/600/400"},
  {name:"GammVert",country:"FR",image:"https://picsum.photos/id/40/600/400"},
  {name:"Jardiland",country:"FR",image:"https://picsum.photos/id/41/600/400"},
  {name:"MyDeal",country:"AU",image:"https://picsum.photos/id/42/600/400"},
  {name:"KOGAN",country:"AU",image:"https://picsum.photos/id/43/600/400"},
  {name:"LASOO",country:"AU",image:"https://picsum.photos/id/44/600/400"},
  {name:"emag",country:"BG",image:"https://picsum.photos/id/45/600/400"},
  {name:"Pepita",country:"HU",image:"https://picsum.photos/id/46/600/400"},
  {name:"Homecentre",country:"AE",image:"https://picsum.photos/id/47/600/400"},
  {name:"Sharaf",country:"AE",image:"https://picsum.photos/id/48/600/400"},
  {name:"BestBuy",country:"US",image:"https://picsum.photos/id/49/600/400"},
  {name:"Walmart",country:"US",image:"https://picsum.photos/id/50/600/400"},
  {name:"B&Q",country:"UK",image:"https://picsum.photos/id/51/600/400"},
  {name:"Robert Dyas",country:"UK",image:"https://picsum.photos/id/52/600/400"},
  {name:"ONBUY",country:"UK",image:"https://picsum.photos/id/53/600/400"},
  {name:"Trendyol",country:"TR",image:"https://picsum.photos/id/488/600/400"},
  {name:"Noon",country:"AE",image:"https://picsum.photos/id/669/600/400"},
  {name:"Bol.com",country:"NL",image:"https://picsum.photos/id/367/600/400"},
  {name:"Leenbakker",country:"NL",image:"https://picsum.photos/id/57/600/400"},
  {name:"Beslist",country:"NL",image:"https://picsum.photos/id/58/600/400"},
  {name:"Home24",country:"DE",image:"https://picsum.photos/id/59/600/400"},
  {name:"Voelkner",country:"DE",image:"https://picsum.photos/id/60/600/400"},
  {name:"Wayfair",country:"US",image:"https://picsum.photos/id/61/600/400"},
  {name:"XXXLutz",country:"DE",image:"https://picsum.photos/id/62/600/400"},
  {name:"Fressnapf",country:"DE",image:"https://picsum.photos/id/63/600/400"},
  {name:"Poco",country:"DE",image:"https://picsum.photos/id/64/600/400"},
  {name:"Vente Unique",country:"FR",image:"https://picsum.photos/id/65/600/400"},
  {name:"GALAXUS",country:"CH",image:"https://picsum.photos/id/66/600/400"},
  {name:"manor",country:"CH",image:"https://picsum.photos/id/67/600/400"},
  {name:"RICARDO",country:"CH",image:"https://picsum.photos/id/68/600/400"},
  {name:"ALLEGRO",country:"CZ",image:"https://picsum.photos/id/69/600/400"},
  {name:"BRW",country:"IE",image:"https://picsum.photos/id/70/600/400"},
  {name:"Home & You",country:"CZ",image:"https://picsum.photos/id/71/600/400"},
  {name:"Empik",country:"CZ",image:"https://picsum.photos/id/72/600/400"},
  {name:"Morele",country:"CZ",image:"https://picsum.photos/id/73/600/400"},
  {name:"MALL",country:"CZ",image:"https://picsum.photos/id/74/600/400"},
  {name:"BigBang",country:"SI",image:"https://picsum.photos/id/75/600/400"},
  {name:"Mimovrste",country:"SI",image:"https://picsum.photos/id/76/600/400"},
  {name:"Mall",country:"SK",image:"https://picsum.photos/id/77/600/400"},
  {name:"KAUP24",country:"HR",image:"https://picsum.photos/id/78/600/400"},
  {name:"PIGU",country:"UA",image:"https://picsum.photos/id/79/600/400"},
  {name:"220",country:"UA",image:"https://picsum.photos/id/80/600/400"},
  {name:"Amazon",country:"US",image:"https://picsum.photos/id/201/600/400"},
  {name:"Webshop",country:"NL",image:"https://picsum.photos/id/82/600/400"},
];

const platformDescriptions: Record<string,string> = {
  "ALL":"We have partnered with and managed listings across 115+ leading e-commerce platforms worldwide — from global giants to regional powerhouses spanning 24 countries.",
  "Carrefour":"One of the world's largest retail chains, Carrefour operates in 30+ countries.",
  "Decathlon":"The world's largest sporting goods retailer, present in 60+ countries.",
  "Leroy Merlin":"Europe's #1 home improvement retailer, operating across 13 countries.",
  "Amazon":"The world's largest e-commerce platform.",
  "Walmart":"America's largest retailer and a growing e-commerce force.",
  "eBay":"A global marketplace connecting millions of buyers and sellers.",
  "Bol.com":"The Netherlands' #1 online retailer.",
  "MediaMarkt":"Europe's leading consumer electronics retailer.",
  "Trendyol":"Turkey's largest e-commerce platform.",
  "Noon":"The Middle East's homegrown e-commerce giant.",
  "Harvey Norman":"Australia's leading electrical and bedding retailer.",
  "RAKUTEN":"Japan's largest e-commerce marketplace.",
};

const industryPanels: IndustryPanel[] = [
  {key:"all",label:"All Industries",count:"22+",backdropLetters:"AL",eyebrow:"🌐 All Industries",title:"Full Industry Portfolio",body:"We partner with brands across 10 distinct verticals spanning kitchen, electronics, fashion, healthcare, logistics, and more.",accounts:[]},
  {key:"kitchen",label:"Kitchen",count:"3",backdropLetters:"KI",eyebrow:"🍳 Kitchen Industry",title:"Cookware & Kitchen Brands",body:"Our kitchen vertical brings together brands built on home cooking, kitchen hardware, and BBQ culture.",accounts:[
    {abbr:"AK",name:"Akicon",desc:"Kitchen and bath fixtures, faucets, and accessories for modern homes.",tag:"Kitchen"},
    {abbr:"AI",name:"Airmsen",desc:"Innovative kitchen appliances and cooking tools built for everyday use.",tag:"Kitchen"},
    {abbr:"MB",name:"Mr.BBQ",desc:"BBQ grills, accessories, and outdoor cooking essentials.",tag:"Kitchen"},
  ]},
  {key:"electronics",label:"Electronics",count:"4",backdropLetters:"EL",eyebrow:"⚡ Electronics",title:"Consumer Tech & Smart Devices",body:"We manage electronics brands spanning charging solutions, smart lighting, e-cigarettes, and home security cameras.",accounts:[
    {abbr:"BU",name:"BaseUs",desc:"Powerbanks, chargers, and cables engineered for fast, reliable charging.",tag:"Electronics",avatarClass:"dark"},
    {abbr:"GK",name:"Geekvape",desc:"Advanced electronic cigarette devices and vaping accessories.",tag:"Electronics",avatarClass:"gray"},
    {abbr:"GV",name:"GOVEE",desc:"Smart outdoor and ambient lighting solutions powered by app control.",tag:"Electronics",avatarClass:"dark"},
    {abbr:"EZ",name:"Ezviz",desc:"Home security cameras and smart surveillance systems.",tag:"Electronics",avatarClass:"gray"},
  ]},
  {key:"fashion",label:"Fashion Retail",count:"2",backdropLetters:"FA",eyebrow:"👗 Fashion Retail",title:"Fashion & Apparel Brands",body:"Fashion brands that trust us to manage their digital presence across leading marketplaces worldwide.",accounts:[
    {abbr:"AZ",name:"Azazie",desc:"Premium bridal gowns, bridesmaid dresses, and event-ready fashion.",tag:"Fashion"},
    {abbr:"BL",name:"Baleaf",desc:"Performance athleisure and activewear designed for workouts and yoga.",tag:"Fashion",avatarClass:"gray"},
  ]},
  {key:"home",label:"Home & Ergo",count:"2",backdropLetters:"HO",eyebrow:"🪑 Home & Ergo",title:"Ergonomic & Home Products",body:"Ergonomic furniture and home wellness brands that support comfortable modern living.",accounts:[
    {abbr:"FX",name:"Flexispot",desc:"Standing desks, ergonomic chairs, and height-adjustable workstations.",tag:"Home & Ergo"},
    {abbr:"BE",name:"BESTOi",desc:"Ergonomic home accessories and wellness products.",tag:"Home & Ergo",avatarClass:"gray"},
  ]},
  {key:"medical",label:"Medical",count:"2",backdropLetters:"ME",eyebrow:"🏥 Medical",title:"Healthcare & Medical Devices",body:"Medical and healthcare brands from clinical imaging systems to consumer wellness devices.",accounts:[
    {abbr:"MN",name:"Mindray",desc:"Medical imaging systems, patient monitoring, and diagnostic equipment.",tag:"Medical",avatarClass:"teal"},
    {abbr:"CS",name:"Coslus",desc:"Consumer healthcare devices including oral care and personal wellness.",tag:"Medical",avatarClass:"teal"},
  ]},
  {key:"automotive",label:"Automotive",count:"2",backdropLetters:"AU",eyebrow:"🚗 Automotive",title:"Automotive Parts & Accessories",body:"Automotive brands covering OEM parts, child safety seats, and vehicle accessories.",accounts:[
    {abbr:"FP",name:"Fridayparts",desc:"OEM and aftermarket replacement parts for heavy machinery.",tag:"Automotive",avatarClass:"dark"},
    {abbr:"DN",name:"Diono",desc:"Child car seats, boosters, and automotive travel accessories.",tag:"Automotive",avatarClass:"gray"},
  ]},
  {key:"travel",label:"Travel & Gov't",count:"2",backdropLetters:"TR",eyebrow:"✈️ Travel & Gov't",title:"Travel & Government Services",body:"Travel and government service brands including visa processing and online air booking.",accounts:[
    {abbr:"CG",name:"CGI-Visa",desc:"Visa application services, government travel documentation.",tag:"Gov't",avatarClass:"blue"},
    {abbr:"JT",name:"Jettzy",desc:"Online air travel booking platform with competitive fares.",tag:"Travel",avatarClass:"blue"},
  ]},
  {key:"logistics",label:"Logistics",count:"1",backdropLetters:"LO",eyebrow:"📦 Logistics",title:"Logistics & Supply Chain",body:"End-to-end logistics management and live shipment tracking for e-commerce brands.",accounts:[
    {abbr:"GF",name:"GOFO",desc:"End-to-end logistics management and delivery solutions.",tag:"Logistics",avatarClass:"amber"},
  ]},
  {key:"software",label:"Software",count:"1",backdropLetters:"SO",eyebrow:"💻 Software",title:"Consumer & Business Software",body:"Software brands covering PC optimization, security tools, and professional productivity.",accounts:[
    {abbr:"AV",name:"Avanquest",desc:"Consumer and professional software including PC optimization and security.",tag:"Software",avatarClass:"dark"},
  ]},
  {key:"specialty",label:"Specialty",count:"6",backdropLetters:"SP",eyebrow:"⭐ Specialty",title:"Specialty & Niche Verticals",body:"Niche brands spanning thermal printers, coolers, micromobility, eyewear, hospitality, and audio.",accounts:[
    {abbr:"JD",name:"Jadens",desc:"Thermal label printers and shipping supplies for warehouses.",tag:"Specialty",avatarClass:"dark"},
    {abbr:"CO",name:"Cooler",desc:"Portable coolers and ice retention products for outdoor use.",tag:"Specialty",avatarClass:"gray"},
    {abbr:"3K",name:"3KM Ario",desc:"Micromobility and personal transport tech solutions.",tag:"Specialty",avatarClass:"dark"},
    {abbr:"NM",name:"Next Marvel",desc:"Eyewear accessories including lens kits and cases.",tag:"Specialty",avatarClass:"dark"},
    {abbr:"GN",name:"GNG",desc:"Hotel booking and hospitality solutions for travelers.",tag:"Specialty",avatarClass:"blue"},
    {abbr:"MO",name:"MasterOnly",desc:"Professional studio speakers and audio accessories.",tag:"Specialty",avatarClass:"rose"},
  ]},
];

const toolCards = [
  {abbr:"Cx",cat:"security",name:"Citrix",catLabel:"Security",desc:"Secure virtual desktop infrastructure for remote operations.",color:"red",img:""},
  {abbr:"Zd",cat:"comms",name:"Zendesk",catLabel:"Communication",desc:"Customer support ticketing and communication management.",color:"dark",img:""},
  {abbr:"Ok",cat:"security",name:"Okta",catLabel:"Security",desc:"Identity and access management for secure team authentication.",color:"light",img:""},
  {abbr:"Jr",cat:"pm",name:"Jira",catLabel:"Project Mgmt",desc:"Agile project tracking and sprint management for ops teams.",color:"pink",img:""},
  {abbr:"Sf",cat:"catalog",name:"Salsify",catLabel:"Catalog",desc:"Product experience management (PXM) for content syndication.",color:"dark",img:""},
  {abbr:"Lk",cat:"analytics",name:"Looker",catLabel:"Analytics & BI",desc:"Business intelligence and data visualization for reporting.",color:"red",img:""},
  {abbr:"Sl",cat:"comms",name:"Slack",catLabel:"Communication",desc:"Channel-based team communication and instant messaging.",color:"light",img:""},
  {abbr:"Tm",cat:"comms",name:"Teams",catLabel:"Communication",desc:"Real-time messaging and video collaboration across departments.",color:"dark",img:""},
  {abbr:"Cv",cat:"security",name:"CATO VPN",catLabel:"Security",desc:"Cloud-native network security and secure access edge.",color:"pink",img:""},
  {abbr:"Sp",cat:"security",name:"Sailpoint",catLabel:"Security",desc:"Identity governance and access control for enterprise security.",color:"red",img:""},
  {abbr:"Xl",cat:"catalog",name:"Excel",catLabel:"Catalog",desc:"Spreadsheet-based catalog tracking and data workflows.",color:"light",img:""},
  {abbr:"Bb",cat:"catalog",name:"Babel",catLabel:"Catalog",desc:"Translation and localization for multilingual catalog content.",color:"pink",img:""},
  {abbr:"Br",cat:"comms",name:"Bria",catLabel:"Communication",desc:"VoIP communication tool for client-facing and internal calls.",color:"dark",img:""},
  {abbr:"Nx",cat:"infra",name:"Nexus",catLabel:"Infrastructure",desc:"Repository manager for artifact storage and build pipelines.",color:"red",img:""},
  {abbr:"Pp",cat:"pm",name:"People Plaza",catLabel:"Project Mgmt",desc:"HR and workforce management system for team operations.",color:"light",img:""},
  {abbr:"Ol",cat:"comms",name:"Outlook",catLabel:"Communication",desc:"Enterprise email and calendar coordination across global teams.",color:"pink",img:""},
  {abbr:"Od",cat:"infra",name:"OneDrive",catLabel:"Infrastructure",desc:"Cloud file storage and document sharing across global teams.",color:"dark",img:""},
  {abbr:"Pt",cat:"catalog",name:"Powerpoint",catLabel:"Catalog",desc:"Presentation and client reporting tool for business reviews.",color:"light",img:""},
  {abbr:"Wd",cat:"catalog",name:"Word",catLabel:"Catalog",desc:"Document creation and SOP documentation for operations teams.",color:"red",img:""},
];

const toolPillCats = [
  {key:"all",label:"All"},{key:"security",label:"Security"},{key:"comms",label:"Communication"},
  {key:"catalog",label:"Catalog"},{key:"analytics",label:"Analytics & BI"},
  {key:"pm",label:"Project Mgmt"},{key:"infra",label:"Infrastructure"},
];

const verticalRows = [
  {num:"01",name:"Kitchen",desc:"Cookware, appliances, and kitchen accessories built for modern households.",chips:["Akicon","Airmsen","Mr.BBQ"],img:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"},
  {num:"02",name:"Electronics",desc:"Smart devices, cameras, lighting, and consumer tech products.",chips:["BaseUs","Geekvape","GOVEE","Ezviz"],img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop"},
  {num:"03",name:"Fashion Retail",desc:"Bridal, athleisure, and event-ready apparel across global marketplaces.",chips:["Azazie","Baleaf"],img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"},
  {num:"04",name:"Home & Ergo",desc:"Ergonomic furniture, standing desks, and home wellness products.",chips:["Flexispot","BESTOi"],img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"},
  {num:"05",name:"Medical",desc:"Clinical imaging, patient monitoring, and consumer healthcare devices.",chips:["Mindray","Coslus"],img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"},
  {num:"06",name:"Automotive",desc:"OEM parts, child safety seats, and automotive travel accessories.",chips:["Fridayparts","Diono"],img:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"},
  {num:"07",name:"Travel & Gov't",desc:"Travel documentation and government service solutions for global citizens.",chips:["CGI-Visa","Jettzy"],img:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"},
  {num:"08",name:"Logistics",desc:"End-to-end logistics management and live shipment tracking platforms.",chips:["GOFO"],img:"https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop"},
  {num:"09",name:"Software",desc:"Consumer and professional software including PC optimization and security tools.",chips:["Avanquest"],img:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"},
  {num:"10",name:"Specialty Verticals",desc:"Niche markets spanning eyewear, coolers, micromobility, audio, and hospitality.",chips:["Jadens","Cooler","3KM Ario","Next Marvel","GNG","MasterOnly"],img:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop"},
];

const dirCards = [
  {abbr:"AK",name:"Akicon",industry:"Kitchen and Bath Industry",ind:"kitchen",badge:"commerce",badgeLabel:"Kitchen"},
  {abbr:"AV",name:"Avanquest",industry:"Software Development",ind:"software",badge:"tech",badgeLabel:"Software",ac:"dark"},
  {abbr:"EZ",name:"Ezviz",industry:"Security Home Cameras",ind:"electronics",badge:"tech",badgeLabel:"Electronics",ac:"gray"},
  {abbr:"MN",name:"Mindray",industry:"Medical Imaging Needs",ind:"medical",badge:"health",badgeLabel:"Medical",ac:"teal"},
  {abbr:"JD",name:"Jadens",industry:"Thermal Label Printers",ind:"specialty",badge:"retail",badgeLabel:"Specialty",ac:"dark"},
  {abbr:"FX",name:"Flexispot",industry:"Ergonomic Furniture & Home",ind:"home",badge:"commerce",badgeLabel:"Home & Ergo"},
  {abbr:"BU",name:"BaseUs",industry:"Powerbanks, Chargers & Cables",ind:"electronics",badge:"tech",badgeLabel:"Electronics",ac:"dark"},
  {abbr:"BE",name:"BESTOi",industry:"Home Ergonomics",ind:"home",badge:"commerce",badgeLabel:"Home & Ergo",ac:"gray"},
  {abbr:"GF",name:"GOFO",industry:"Logistics, Tracking & Deliveries",ind:"logistics",badge:"logistic",badgeLabel:"Logistics",ac:"amber"},
  {abbr:"GV",name:"GOVEE",industry:"Outdoor Lights",ind:"electronics",badge:"tech",badgeLabel:"Electronics",ac:"dark"},
  {abbr:"GK",name:"Geekvape",industry:"Electronic E-Cigarettes",ind:"electronics",badge:"tech",badgeLabel:"Electronics",ac:"gray"},
  {abbr:"CG",name:"CGI-Visa",industry:"Govt Services / Travel Docs",ind:"travel",badge:"travel",badgeLabel:"Travel & Gov't",ac:"blue"},
  {abbr:"AZ",name:"Azazie",industry:"Fashion Retail",ind:"fashion",badge:"retail",badgeLabel:"Fashion"},
  {abbr:"3K",name:"3KM Ario",industry:"Micromobility / Transport Tech",ind:"specialty",badge:"retail",badgeLabel:"Specialty",ac:"dark"},
  {abbr:"BL",name:"Baleaf",industry:"Fashion Retail",ind:"fashion",badge:"retail",badgeLabel:"Fashion",ac:"gray"},
  {abbr:"NM",name:"Next Marvel",industry:"Eyewear Accessories",ind:"specialty",badge:"retail",badgeLabel:"Specialty",ac:"dark"},
  {abbr:"CO",name:"Cooler",industry:"Portable Coolers",ind:"specialty",badge:"retail",badgeLabel:"Specialty",ac:"gray"},
  {abbr:"GN",name:"GNG",industry:"Hotel and Booking",ind:"specialty",badge:"travel",badgeLabel:"Specialty",ac:"blue"},
  {abbr:"CS",name:"Coslus",industry:"Healthcare and Medical Devices",ind:"medical",badge:"health",badgeLabel:"Medical",ac:"teal"},
  {abbr:"FP",name:"Fridayparts",industry:"Automotive",ind:"automotive",badge:"commerce",badgeLabel:"Automotive",ac:"dark"},
  {abbr:"AI",name:"Airmsen",industry:"Kitchen Industry",ind:"kitchen",badge:"commerce",badgeLabel:"Kitchen"},
  {abbr:"DN",name:"Diono",industry:"Carseats Accessories",ind:"automotive",badge:"commerce",badgeLabel:"Automotive",ac:"gray"},
  {abbr:"MB",name:"Mr.BBQ",industry:"Kitchen Industry",ind:"kitchen",badge:"commerce",badgeLabel:"Kitchen"},
  {abbr:"MO",name:"MasterOnly",industry:"Studio & Speaker Accessories",ind:"specialty",badge:"retail",badgeLabel:"Specialty",ac:"rose"},
  {abbr:"JT",name:"Jettzy",industry:"Travel Air Booking",ind:"travel",badge:"travel",badgeLabel:"Travel & Gov't",ac:"blue"},
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function makeSVGLogo(name: string, bg: string, fg: string): string {
  const abbr = name.replace(/[^A-Z0-9]/gi,"").slice(0,3).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bg}"/>
    <text x="100" y="95" font-family="Arial Black,sans-serif" font-size="52" font-weight="900" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${abbr}</text>
    <text x="100" y="148" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${fg}" opacity="0.7" text-anchor="middle">${name}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const thmBatch1 = [
  {name:"Citrix",bg:"#1e3a5f",fg:"#ffffff"},{name:"Zendesk",bg:"#03363d",fg:"#ffffff"},
  {name:"Okta",bg:"#007dc1",fg:"#ffffff"},{name:"Jira",bg:"#0052cc",fg:"#ffffff"},
  {name:"Salsify",bg:"#6e40c9",fg:"#ffffff"},{name:"Looker",bg:"#4285f4",fg:"#ffffff"},
  {name:"Slack",bg:"#4a154b",fg:"#ffffff"},{name:"Salesforce",bg:"#00a1e0",fg:"#ffffff"},
  {name:"Excel",bg:"#217346",fg:"#ffffff"},{name:"Teams",bg:"#6264a7",fg:"#ffffff"},
].map(t=>({...t,src:makeSVGLogo(t.name,t.bg,t.fg)}));

const thmBatch2 = [
  {name:"Mirakl",bg:"#12233a",fg:"#ffffff"},{name:"Amazon",bg:"#ff9900",fg:"#111111"},
  {name:"Walmart",bg:"#0071ce",fg:"#ffffff"},{name:"eBay",bg:"#e53238",fg:"#ffffff"},
  {name:"Kaufland",bg:"#e20015",fg:"#ffffff"},{name:"OTTO",bg:"#cc0000",fg:"#ffffff"},
  {name:"Cdiscount",bg:"#1a1a6e",fg:"#ffffff"},{name:"Shopify",bg:"#96bf48",fg:"#ffffff"},
  {name:"Zalando",bg:"#ff6900",fg:"#ffffff"},{name:"Temu",bg:"#ff6600",fg:"#ffffff"},
].map(t=>({...t,src:makeSVGLogo(t.name,t.bg,t.fg)}));

const thmPositions = [
  {left:"4%",top:"0%",width:"52%",height:"55%"},
  {left:"58%",top:"0%",width:"40%",height:"44%"},
  {left:"4%",top:"57%",width:"38%",height:"44%"},
  {left:"44%",top:"50%",width:"24%",height:"32%"},
  {left:"70%",top:"57%",width:"28%",height:"40%"},
];

const countryFlag: Record<string,string> = {
  NL:"nl",FR:"fr",ES:"es",BG:"bg",CH:"ch",DE:"de",HU:"hu",IT:"it",BE:"be",AE:"ae",
  SI:"si",SK:"sk",HR:"hr",SA:"sa",JP:"jp",TR:"tr",DK:"dk",UA:"ua",GR:"gr",
  US:"us",UK:"gb",AU:"au",IE:"ie",CZ:"cz",
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function TabNav({active,onSwitch,align="center"}:{active:Tab;onSwitch:(t:Tab)=>void;align?:"center"|"left"}) {
  const tabs: {key:Tab;label:string}[] = [{key:"platforms",label:"Platforms"},{key:"tools",label:"Tools"},{key:"industries",label:"Industries"}];
  return (
    <nav className={`flex items-center gap-1 mb-10 ${align==="center"?"justify-center":"justify-start"} max-sm:justify-center`}>
      {tabs.map(t=>(
        <button key={t.key} onClick={()=>onSwitch(t.key)}
          className={`px-4 py-1.5 text-[13px] font-semibold tracking-[0.02em] rounded-md transition-all duration-200 whitespace-nowrap border-none cursor-pointer
            ${active===t.key?"bg-[rgba(40,40,40,0.08)] text-[#282828]":"text-[#9ca3af] hover:text-[#374151] hover:bg-[rgba(0,0,0,0.04)]"}`}
          style={{background:"none",fontFamily:"sans-serif"}}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

function HeroMosaic({id,batches}:{id:string;batches:[typeof thmBatch1,typeof thmBatch2]}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posIdxRef = useRef([0,1,2,3,4]);
  const itemIdxRef = useRef([0,1,2,3,4]);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const batchRef = useRef(batches[0]);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{
    const container = containerRef.current;
    if(!container) return;
    container.innerHTML="";
    const batch = batchRef.current;
    const cards: HTMLDivElement[] = [];
    for(let i=0;i<5;i++){
      const pos=thmPositions[i], item=batch[i];
      const el=document.createElement("div");
      Object.assign(el.style,{
        position:"absolute",left:pos.left,top:pos.top,width:pos.width,height:pos.height,
        borderRadius:"16px",overflow:"hidden",background:item.bg,
        boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
        transition:"left 700ms cubic-bezier(0.4,0,0.2,1),top 700ms cubic-bezier(0.4,0,0.2,1),width 700ms cubic-bezier(0.4,0,0.2,1),height 700ms cubic-bezier(0.4,0,0.2,1),opacity 700ms ease",
        zIndex:i===0?"3":"1",
      });
      const img=document.createElement("img");
      img.src=item.src; img.alt=item.name;
      Object.assign(img.style,{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"});
      el.appendChild(img);
      container.appendChild(el);
      cards.push(el);
      (el as any)._posIdx=i;
    }
    cardsRef.current=cards;
    itemIdxRef.current=[0,1,2,3,4];

    timerRef.current=setInterval(()=>{
      const byPos: Record<number,HTMLDivElement>={};
      cards.forEach(c=>{byPos[(c as any)._posIdx]=c;});
      requestAnimationFrame(()=>{
        cards.forEach(c=>{
          const next=((c as any)._posIdx+1)%5;
          const p=thmPositions[next];
          c.style.left=p.left; c.style.top=p.top; c.style.width=p.width; c.style.height=p.height;
          c.style.zIndex=next===0?"3":"1";
          (c as any)._posIdx=next;
        });
      });
      const maxIdx=Math.max(...itemIdxRef.current);
      const nextItemIdx=(maxIdx+1)%batchRef.current.length;
      const cardGoingToBig=byPos[4];
      if(cardGoingToBig){
        const nextItem=batchRef.current[nextItemIdx];
        const img=cardGoingToBig.querySelector("img") as HTMLImageElement;
        if(img){img.src=nextItem.src; img.alt=nextItem.name;}
        cardGoingToBig.style.background=nextItem.bg;
        const cidx=cards.indexOf(cardGoingToBig);
        if(cidx>=0) itemIdxRef.current[cidx]=nextItemIdx;
      }
    },2000);

    return ()=>{ if(timerRef.current) clearInterval(timerRef.current); };
  },[]);

  return (
    <div ref={containerRef} id={id} className="relative w-full h-full" style={{minHeight:"inherit"}} />
  );
}

function MosaicSlider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const allPlatforms = platforms.map(p=>p.name);
  const COUNT = allPlatforms.length;

  useEffect(()=>{
    const wrap=wrapRef.current, stage=stageRef.current;
    if(!wrap||!stage) return;
    const isMobile=window.innerWidth<640;
    const CARD_W=isMobile?130:200, CARD_H=isMobile?86:130;
    const STEP=CARD_W+(isMobile?10:16);
    const VISIBLE=isMobile?3:7;
    const AUTO_SPEED=0.010;
    stage.style.height=CARD_H+"px";

    let offset=0,vel=0,dragging=false,dragStartX=0,dragStartOff=0,lastX=0,autoActive=true;
    let rafId:number;

    function getStyle(dist:number){
      const abs=Math.abs(dist);
      return{
        scale:Math.max(0.60,1-abs*0.06),
        tx:dist*STEP, ty:abs*abs*5,
        zIndex:Math.round(100-abs*10),
        opacity:Math.max(0.20,1-abs*0.14),
      };
    }

    const pool: {div:HTMLDivElement;img:HTMLImageElement;span:HTMLSpanElement}[]=[];
    for(let i=0;i<VISIBLE*2+1;i++){
      const div=document.createElement("div");
      div.className="mosaic-card";
      div.style.cssText=`position:absolute;width:${CARD_W}px;height:${CARD_H}px;border-radius:14px;overflow:hidden;cursor:grab;will-change:transform;background:#f7f7f7;`;
      const img=document.createElement("img");
      img.draggable=false; img.crossOrigin="anonymous"; img.loading="eager";
      img.style.cssText="width:100%;height:100%;object-fit:cover;pointer-events:none;display:block;";
      const lbl=document.createElement("div");
      lbl.style.cssText="position:absolute;inset:0;display:flex;align-items:flex-end;padding:10px;background:linear-gradient(to top,rgba(0,0,0,0.7) 38%,transparent);";
      const span=document.createElement("span");
      span.style.cssText="color:#fff;font-family:sans-serif;font-weight:700;font-size:11px;letter-spacing:0.04em;line-height:1.3;pointer-events:none;";
      lbl.appendChild(span); div.appendChild(img); div.appendChild(lbl);
      stage.appendChild(div);
      pool.push({div,img,span});
    }

    function render(){
      const ci=Math.round(offset);
      pool.forEach((el,pi)=>{
        const d=pi-VISIBLE;
        const idx=((ci+d)%COUNT+COUNT)%COUNT;
        const dist=d-(offset-ci);
        const abs=Math.abs(dist);
        if(abs>VISIBLE+0.5){el.div.style.display="none";return;}
        el.div.style.display="";
        const{scale,tx,ty,zIndex,opacity}=getStyle(dist);
        el.div.style.transform=`translateX(${tx}px) translateY(${ty}px) scale(${scale})`;
        el.div.style.zIndex=String(zIndex);
        el.div.style.opacity=String(opacity);
        const newSrc=PHOTOS[idx%PHOTOS.length];
        if(el.img.src!==newSrc) el.img.src=newSrc;
        el.img.alt=allPlatforms[idx];
        el.span.textContent=allPlatforms[idx];
      });
    }

    let lastTime=0;
    function animate(ts:number){
      const dt=lastTime===0?16:Math.min(ts-lastTime,32); lastTime=ts;
      if(!dragging){
        if(autoActive) offset+=AUTO_SPEED*(dt/16);
        else{ vel*=0.94; offset+=vel; if(Math.abs(vel)<0.001) autoActive=true; }
        offset=((offset%COUNT)+COUNT)%COUNT;
      }
      render(); rafId=requestAnimationFrame(animate);
    }

    function handleVisibilityChange(){
      if(document.visibilityState==="visible") lastTime=0;
    }
    document.addEventListener("visibilitychange",handleVisibilityChange);

    rafId=requestAnimationFrame(animate);

    wrap.addEventListener("pointerdown",e=>{
      dragging=true; autoActive=false; vel=0;
      dragStartX=e.clientX; dragStartOff=offset; lastX=e.clientX;
      wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener("pointermove",e=>{
      if(!dragging) return;
      vel=(lastX-e.clientX)/STEP; lastX=e.clientX;
      offset=((dragStartOff+(e.clientX-dragStartX)/STEP*-1)%COUNT+COUNT)%COUNT;
    });
    wrap.addEventListener("pointerup",()=>{dragging=false;});
    wrap.addEventListener("pointerleave",()=>{dragging=false;});
    wrap.addEventListener("touchstart",e=>e.stopPropagation(),{passive:true});
    wrap.addEventListener("touchend",e=>e.stopPropagation(),{passive:true});
    wrap.addEventListener("touchmove",e=>e.stopPropagation(),{passive:true});

    return()=>{
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange",handleVisibilityChange);
    };
  },[]);

  return (
    <div className="w-full relative overflow-hidden max-w-[1200px] max-sm:h-[160px]" style={{height:"220px"}}>
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden select-none touch-none" style={{userSelect:"none"}}>
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none z-20" style={{width:"120px",background:"linear-gradient(to right,#f7f7f7 20%,transparent)"}}/>
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-20" style={{width:"120px",background:"linear-gradient(to left,#f7f7f7 20%,transparent)"}}/>
        <div ref={stageRef} className="absolute" style={{left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:0}}/>
      </div>
    </div>
  );
}

function PlatformImageSlider({items,selectedCountry}:{items:Platform[];selectedCountry:string}){
  const [activeIdx,setActiveIdx]=useState(0);
  const trackRef=useRef<HTMLDivElement>(null);
  const isDraggingRef=useRef(false);
  const dragStartXRef=useRef(0);
  const dragScrollRef=useRef(0);
  const CARD_W=320,GAP=20,STRIDE=340;

  const activeIdxRef = useRef(0);

  const scrollToIdx=useCallback((idx:number, updateState=true)=>{
    const clamped=Math.max(0,Math.min(idx,items.length-1));
    activeIdxRef.current=clamped;
    if(updateState) setActiveIdx(clamped);
    const track=trackRef.current;
    if(!track) return;
    const target=clamped*STRIDE;
    const start=track.scrollLeft, dist=target-start, dur=420, t0=performance.now();
    function ease(t:number){return t<0.5?2*t*t:-1+(4-2*t)*t;}
    function step(now:number){
      const pct=Math.min((now-t0)/dur,1);
      if(track) track.scrollLeft=start+dist*ease(pct);
      if(pct<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },[items.length]);

  // Continuous auto-advance every 4 seconds
  useEffect(()=>{
    activeIdxRef.current=0;
    setActiveIdx(0);
    scrollToIdx(0,false);
    const id=setInterval(()=>{
      const next=(activeIdxRef.current+1)%items.length;
      activeIdxRef.current=next;
      setActiveIdx(next);
      scrollToIdx(next,false);
    },4000);
    return()=>clearInterval(id);
  },[items]);

  const handlePointerDown=useCallback((e:React.PointerEvent)=>{
    isDraggingRef.current=true;
    dragStartXRef.current=e.clientX;
    dragScrollRef.current=trackRef.current?.scrollLeft??0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  },[]);

  const handlePointerMove=useCallback((e:React.PointerEvent)=>{
    if(!isDraggingRef.current||!trackRef.current) return;
    const dx=dragStartXRef.current-e.clientX;
    trackRef.current.scrollLeft=dragScrollRef.current+dx;
  },[]);

  const handlePointerUp=useCallback((e:React.PointerEvent)=>{
    if(!isDraggingRef.current) return;
    isDraggingRef.current=false;
    const dx=e.clientX-dragStartXRef.current;
    const threshold=40;
    if(Math.abs(dx)>threshold){
      const dir=dx<0?1:-1;
      const next=Math.max(0,Math.min(activeIdx+dir,items.length-1));
      scrollToIdx(next);
    } else {
      scrollToIdx(activeIdx);
    }
  },[activeIdx,items.length,scrollToIdx]);

  const descForActive = platformDescriptions[items[activeIdx]?.name] ?? platformDescriptions["ALL"];

  return (
    <div className="flex flex-col lg:flex-row min-h-[340px] w-full">
      <div className="flex flex-col justify-center px-8 py-10 flex-shrink-0 lg:w-[38%]">
        <h2 className="font-black uppercase tracking-[-0.02em] text-white text-[clamp(24px,3vw,42px)] leading-none mb-5 transition-all duration-300" style={{fontFamily:"'Poppins',sans-serif"}}>
          {items[activeIdx]?.name ?? "Featured Platforms"}
        </h2>
        <p className="text-sm text-[rgba(255,255,255,0.6)] leading-[1.8] mb-6" style={{fontFamily:"'Open Sans',sans-serif"}}>
          {descForActive}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[2px] uppercase bg-[rgba(255,255,255,0.1)] px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)]" style={{fontFamily:"sans-serif"}}>
            {items[activeIdx]?.country ?? ""}
          </span>
          <span className="text-xs text-[rgba(255,255,255,0.35)]" style={{fontFamily:"'Open Sans',sans-serif"}}>Marketplace Partner</span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden min-h-[340px] max-w-[680px]">
        <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10" style={{background:"linear-gradient(to left,#282828 30%,transparent)"}}/>
        <div
          ref={trackRef}
          className="flex h-full overflow-x-auto gap-5 select-none pr-8 items-center"
          style={{scrollbarWidth:"none",touchAction:"pan-y",cursor:isDraggingRef.current?"grabbing":"grab"}}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {items.map((p,i)=>(
            <div key={p.name+i}
              onClick={()=>{ if(!isDraggingRef.current){ scrollToIdx(i); } }}
              className="flex-shrink-0 relative rounded-2xl overflow-hidden transition-all duration-300 ease-in-out"
              style={{width:CARD_W,height:CARD_W,transform:i===activeIdx?"scale(1)":"scale(0.88)",opacity:i===activeIdx?1:0.45,boxShadow:i===activeIdx?"0 20px 60px rgba(0,0,0,0.6)":"0 4px 16px rgba(0,0,0,0.2)",cursor:"pointer"}}>
              <img src={p.image} alt={p.name} draggable={false} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <span className="inline-block text-[11px] font-bold tracking-[2px] uppercase bg-white/20 px-4 py-1 rounded-full mb-3 backdrop-blur-sm" style={{fontFamily:"sans-serif"}}>{p.country}</span>
                <div className="font-black uppercase tracking-[-0.02em] leading-none mb-1.5 text-[clamp(26px,3vw,40px)]" style={{fontFamily:"'Poppins',sans-serif"}}>{p.name}</div>
                <p className="text-xs text-white/65" style={{fontFamily:"'Open Sans',sans-serif"}}>Marketplace Partner</p>
              </div>
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center text-white/60 text-lg transition-all hover:bg-white hover:text-black">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolCard({abbr,name,catLabel,desc,color,img}:{abbr:string;name:string;catLabel:string;desc:string;color:string;img:string}){
  const thumbBg: Record<string,string>={
    red:"bg-[#a10000] text-white/90",
    dark:"bg-[#282828] text-white/85",
    light:"bg-[#f0f0f0] text-[rgba(40,40,40,0.3)]",
    pink:"bg-[#f9eded] text-[rgba(161,0,0,0.25)]",
  };
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#ebebeb] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className={`h-[130px] flex items-center justify-center font-black text-[52px] tracking-[-0.04em] overflow-hidden ${thumbBg[color]||thumbBg.light}`}
           style={{fontFamily:"'Poppins',sans-serif"}}>
        {img ? <img src={img} alt={name} className="w-full h-full object-cover block"/> : abbr}
      </div>
      <div className="p-4 pt-[18px]">
        <div className="text-[10px] font-bold tracking-[2px] uppercase mb-1.5" style={{color:"#a10000",fontFamily:"sans-serif"}}>{catLabel}</div>
        <div className="font-extrabold text-xl uppercase tracking-[0.03em] text-[#282828] mb-1.5" style={{fontFamily:"'Poppins',sans-serif"}}>{name}</div>
        <div className="text-[13px] text-[#888] leading-relaxed" style={{fontFamily:"'Open Sans',sans-serif"}}>{desc}</div>
      </div>
    </div>
  );
}

function AvatarEl({abbr,cls}:{abbr:string;cls?:string}){
  const colors: Record<string,string>={
    "":"bg-[#a10000] text-white",dark:"bg-[#282828] text-white/85",
    gray:"bg-[#e0e0e0] text-[#555]",teal:"bg-[#0d9488] text-white",
    blue:"bg-[#1e40af] text-white",amber:"bg-[#d97706] text-white",
    rose:"bg-[#f43f5e] text-white",
  };
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${colors[cls||""]||colors[""]}`}
         style={{fontFamily:"'Poppins',sans-serif"}}>
      {abbr}
    </div>
  );
}

function BadgeEl({type,label}:{type:string;label:string}){
  const colors: Record<string,string>={
    commerce:"bg-[rgba(161,0,0,0.08)] text-[#a10000]",
    tech:"bg-[rgba(59,130,246,0.1)] text-[#2563eb]",
    health:"bg-[rgba(13,148,136,0.1)] text-[#0d9488]",
    retail:"bg-[rgba(161,0,0,0.07)] text-[#a10000]",
    travel:"bg-[rgba(30,64,175,0.1)] text-[#1e40af]",
    logistic:"bg-[rgba(217,119,6,0.1)] text-[#d97706]",
  };
  return (
    <span className={`text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-0.5 rounded-full ${colors[type]||colors.commerce}`}
          style={{fontFamily:"sans-serif"}}>
      {label}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function PlatformOverview() {
  const [activeTab, setActiveTab] = useState<Tab>("platforms");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [countryDropOpen, setCountryDropOpen] = useState(false);
  const [activeToolCat, setActiveToolCat] = useState("all");
  const [toolShowMore, setToolShowMore] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState("all");
  const indAutoRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const indAutoIdxRef = useRef(0);
  const [autoHighlight, setAutoHighlight] = useState<string|null>(null);
  const [indDropOpen, setIndDropOpen] = useState(false);
  const [indDirFilter, setIndDirFilter] = useState("all");
  const [dirShowMore, setDirShowMore] = useState(false);
  const [vertShowMore, setVertShowMore] = useState(false);
  const countryDropRef = useRef<HTMLDivElement>(null);
  const indDropRef = useRef<HTMLDivElement>(null);

  const filteredPlatforms = selectedCountry==="ALL" ? platforms : platforms.filter(p=>p.country===selectedCountry);
  const filteredTools = activeToolCat==="all" ? toolCards : toolCards.filter(t=>t.cat===activeToolCat);
  const visibleTools = toolShowMore ? filteredTools : filteredTools.slice(0,8);
  const filteredDir = indDirFilter==="all" ? dirCards : dirCards.filter(c=>c.ind===indDirFilter);
  const visibleDir = dirShowMore ? filteredDir : filteredDir.slice(0,8);
  const visibleVerts = vertShowMore ? verticalRows : verticalRows.slice(0,6);

  // When "all": show all accounts combined; when specific: show that industry's accounts
  const allAccounts = industryPanels.filter(p=>p.key!=="all").flatMap(p=>p.accounts);
  const nonAllPanels = industryPanels.filter(p=>p.key!=="all");
  const activePanel = activeIndustry==="all"
    ? {...industryPanels[0], accounts: allAccounts}
    : industryPanels.find(p=>p.key===activeIndustry) ?? industryPanels[1];

  // Auto-rotate panel highlight when "all" is selected
  useEffect(()=>{
    if(indAutoRef.current) clearInterval(indAutoRef.current);
    if(activeIndustry!=="all") { setAutoHighlight(null); return; }
    indAutoIdxRef.current=0;
    setAutoHighlight(nonAllPanels[0].key);
    indAutoRef.current=setInterval(()=>{
      indAutoIdxRef.current=(indAutoIdxRef.current+1)%nonAllPanels.length;
      setAutoHighlight(nonAllPanels[indAutoIdxRef.current].key);
    },4000);
    return()=>{ if(indAutoRef.current) clearInterval(indAutoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeIndustry, activeTab]);

  useEffect(()=>{
    function handleClick(e:MouseEvent){
      if(countryDropRef.current && !countryDropRef.current.contains(e.target as Node)) setCountryDropOpen(false);
      if(indDropRef.current && !indDropRef.current.contains(e.target as Node)) setIndDropOpen(false);
    }
    document.addEventListener("mousedown",handleClick);
    return()=>document.removeEventListener("mousedown",handleClick);
  },[]);

  const indDropPanel = industryPanels.find(p=>p.key===activeIndustry);

  return (
    <div className="font-sans text-[#282828] overflow-x-hidden" style={{fontFamily:"'Open Sans',sans-serif"}}>

      {/* ══ PLATFORMS TAB ══ */}
      {activeTab==="platforms" && (
        <div>
          {/* Hero */}
          <section className="bg-[#f7f7f7] overflow-hidden pt-[162px] px-6 pb-0 max-sm:pt-12 max-sm:px-4">
            <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto">
              <div className="flex flex-col items-center text-center w-full max-w-[1020px] relative z-[2] pb-12">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] font-black uppercase tracking-[-0.02em] text-[rgba(40,40,40,0.06)] pointer-events-none select-none leading-none text-center z-0 whitespace-nowrap"
                     style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(60px,10vw,130px)"}}>
                  PLATFORM<br/>OVERVIEW
                </div>
                <div className="relative z-[1] flex flex-col items-center w-full">
                  <TabNav active={activeTab} onSwitch={setActiveTab} align="center"/>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-4" style={{color:"#a10000",fontFamily:"sans-serif"}}>PLATFORM ECOSYSTEM</p>
                  <h1 className="font-black uppercase tracking-[-0.02em] leading-[0.95] text-[#282828] mb-5" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,4vw,56px)"}}>
                    Powering Growth Across 115+<br/><em className="text-[#a10000] not-italic">Global E-Commerce Platforms</em>
                  </h1>
                  <p className="max-w-[560px] mb-7 text-[15px] leading-[1.75] text-[rgba(40,40,40,0.55)]" style={{fontFamily:"'Open Sans',sans-serif"}}>
                    Over a decade of managed listings, catalog operations, and marketplace expertise across{" "}
                    <strong className="text-[#282828] font-semibold">the world's leading e-commerce ecosystems.</strong>{" "}
                    Operating across 24 countries with over a decade of marketplace expertise.
                  </p>
                  <div className="text-[12px] tracking-[0.04em] text-[#aaa]" style={{fontFamily:"sans-serif"}}>
                    Home &gt;&gt; About &gt;&gt; <span className="text-[#a10000]">Platform Overview</span>
                  </div>
                </div>
              </div>
              <MosaicSlider/>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-[#f7f7f7] py-[72px] px-10 max-sm:py-12 max-sm:px-5">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="flex gap-3 items-start">
                {[
                  [{val:"115+",label:"E-commerce platforms\nmanaged and optimized",variant:"red"},{val:"10+",label:"Years of hands-on\nmarketplace experience",variant:"white"}],
                  [{val:"24",label:"Countries with active\nmarketplace operations",variant:"white"},{val:"5★",label:"Client satisfaction across\nglobal engagements",variant:"pink"}],
                ].map((col,ci)=>(
                  <div key={ci} className={`flex-1 flex flex-col gap-3 ${ci===1?"pt-8":""}`}>
                    {col.map((s,si)=>{
                      const bg=s.variant==="red"?"bg-[#a10000]":s.variant==="pink"?"bg-[#f9eded]":"bg-white";
                      const valColor=s.variant==="red"?"text-white":s.variant==="pink"?"text-[#a10000]":"text-[#282828]";
                      const lblColor=s.variant==="red"?"text-white/80":s.variant==="pink"?"text-[#a10000]":"text-[#999]";
                      return (
                        <div key={si} className={`relative overflow-hidden rounded-2xl p-6 pb-5 flex flex-col justify-between min-h-[130px] cursor-pointer hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 ${bg} ${s.variant==="red"?"shadow-[0_4px_18px_rgba(161,0,0,0.20)]":s.variant==="pink"?"shadow-[0_4px_18px_rgba(161,0,0,0.08)]":"shadow-[0_2px_14px_rgba(0,0,0,0.07)]"}`}>
                          <div className={`absolute bottom-[-10px] right-[-6px] font-black text-[72px] leading-none tracking-[-0.04em] pointer-events-none select-none ${s.variant==="red"?"text-white/[0.08]":s.variant==="pink"?"text-[rgba(161,0,0,0.10)]":"text-[rgba(0,0,0,0.04)]"}`} style={{fontFamily:"'Poppins',sans-serif"}}>{s.val}</div>
                          <div className={`font-black leading-none tracking-[-0.02em] relative ${valColor}`} style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(36px,4vw,52px)"}}>{s.val}</div>
                          <div className={`text-[11px] font-medium leading-[1.8] tracking-[0.04em] mt-5 relative whitespace-pre-line ${lblColor}`} style={{fontFamily:"sans-serif"}}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-4" style={{color:"#a10000",fontFamily:"sans-serif"}}>OUR GLOBAL EXPERIENCE</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] mb-6 leading-[1.05]" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,3.5vw,44px)"}}>A Decade of<br/>Marketplace Excellence</h2>
                <p className="text-[15px] text-[#555] leading-[1.8] mb-5" style={{fontFamily:"'Open Sans',sans-serif"}}>
                  For over 4 years, Telex Philippines has partnered with leading global marketplaces — from industry giants like <strong className="text-[#282828]">Amazon, eBay, and Walmart</strong> to high-performing regional platforms across Europe, the Middle East, and Asia.
                </p>
                <p className="text-[15px] text-[#555] leading-[1.8] mb-8" style={{fontFamily:"'Open Sans',sans-serif"}}>
                  We specialize in end-to-end marketplace operations, including product listing optimization, catalog management, and platform integrations.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-[3px] bg-[#a10000] rounded"/>
                  <span className="text-[13px] tracking-[0.04em] font-semibold text-[#282828]" style={{fontFamily:"sans-serif"}}>Trusted by brands operating in 24+ countries worldwide.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Platform Slider Section */}
          <section className="bg-[#282828] py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
                <div>
                  <p className="inline-block text-[11px] tracking-[4px] uppercase font-bold mb-2.5 text-white bg-[#a10000] px-3 py-1 rounded-md" style={{fontFamily:"sans-serif"}}>GLOBAL MARKETPLACE NETWORK</p>
                  <h2 className="font-black uppercase tracking-[-0.02em] leading-none text-white" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,4vw,52px)"}}>Our Platform Partners</h2>
                  <p className="mt-3 max-w-[480px] text-sm text-[#9ca3af] leading-[1.75]" style={{fontFamily:"'Open Sans',sans-serif"}}>
                    {selectedCountry==="ALL" ? "Over the years, we've built working relationships with 115+ leading e-commerce platforms across 24 countries." : `Explore the active marketplace partners in ${countryNames[selectedCountry]}.`}
                  </p>
                </div>
                <div ref={countryDropRef} className="relative flex-shrink-0">
                  <button onClick={()=>setCountryDropOpen(o=>!o)}
                    className={`flex items-center gap-3 px-6 py-3.5 border-2 rounded-xl text-sm font-bold tracking-wider uppercase min-w-[220px] justify-between transition-all duration-200 ${countryDropOpen?"bg-white text-black border-white":"bg-transparent border-gray-700 text-white hover:border-gray-400"}`}
                    style={{fontFamily:"sans-serif"}}>
                    <span>{selectedCountry==="ALL"?"All Countries":`${selectedCountry} — ${countryNames[selectedCountry]}`}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${countryDropOpen?"rotate-180":""}`}>
                      <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {countryDropOpen && (
                    <div className="absolute top-[calc(100%+8px)] right-0 bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl z-50 min-w-[260px] max-h-80 overflow-y-auto">
                      {COUNTRIES.map(c=>{
                        const count=c==="ALL"?platforms.length:platforms.filter(p=>p.country===c).length;
                        if(count===0 && c!=="ALL") return null;
                        return (
                          <button key={c} onClick={()=>{setSelectedCountry(c);setCountryDropOpen(false);}}
                            className={`flex items-center justify-between w-full px-6 py-3 text-left hover:bg-white/10 transition-colors border-l-4 text-sm text-gray-300 ${c===selectedCountry?"border-l-[#a10000] text-white":"border-l-transparent"}`}
                            style={{fontFamily:"sans-serif"}}>
                            <span>{c==="ALL"?"All Countries":`${c} — ${countryNames[c]}`}</span>
                            <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {filteredPlatforms.length>0
                ? <PlatformImageSlider items={filteredPlatforms} selectedCountry={selectedCountry}/>
                : <div className="text-center py-20 text-[#9ca3af]" style={{fontFamily:"'Open Sans',sans-serif"}}>No platforms found for this country.</div>
              }
              <div className="text-center mt-8 text-sm text-[#6b7280]" style={{fontFamily:"'Open Sans',sans-serif"}}>
                Showing <strong className="text-white">{filteredPlatforms.length}</strong> platform{filteredPlatforms.length!==1?"s":""}
                {selectedCountry!=="ALL" && ` in ${countryNames[selectedCountry]}`}
              </div>
            </div>
          </section>

          {/* Why Us */}
          <section className="bg-[#f5f5f5] py-20 px-6">
            <div className="max-w-[1100px] mx-auto">
              <div className="text-center mb-14">
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-2.5 text-[#a10000]" style={{fontFamily:"sans-serif"}}>Why Choose Telex</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828]" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(30px,4vw,48px)"}}>DRIVING GLOBAL E-COMMERCE PERFORMANCE AT SCALE</h2>
                <p className="mt-4 max-w-[560px] mx-auto text-[15px] text-[#666] leading-[1.7]" style={{fontFamily:"'Open Sans',sans-serif"}}>
                  We combine marketplace expertise, advanced technology, and localized execution to help brands expand, optimize, and lead.
                </p>
              </div>
              <div className="grid gap-6" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
                {[
                  {title:"Enterprise-Grade Integrations",text:"Seamlessly connect with 115+ global marketplaces through certified partnerships and robust API integrations."},
                  {title:"End-to-End Catalog Operations",text:"From onboarding and content optimization to pricing and inventory management, we handle the full product lifecycle."},
                  {title:"Data-Led Growth Strategy",text:"Leverage actionable insights, performance analytics, and continuous optimization to maximize visibility and revenue."},
                  {title:"Global Reach, Local Expertise",text:"Operate confidently across 24+ countries with region-specific strategies tailored to local marketplaces."},
                ].map((c,i)=>(
                  <div key={i} className="bg-white border border-[#e8e8e8] rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                    <div className="mb-4">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#a10000" strokeWidth="2"/><path d="M8 14l4 4 8-8" stroke="#a10000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <h3 className="font-extrabold text-[20px] text-[#282828] uppercase tracking-[0.05em] mb-2.5" style={{fontFamily:"'Poppins',sans-serif"}}>{c.title}</h3>
                    <p className="text-sm text-[#666] leading-[1.65]" style={{fontFamily:"'Open Sans',sans-serif"}}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══ TOOLS TAB ══ */}
      {activeTab==="tools" && (
        <div>
          {/* Hero */}
          <section className="bg-[#f7f7f7] overflow-hidden min-h-[870px] flex items-stretch">
            <div className="flex flex-row items-stretch w-full max-w-[1280px] mx-auto px-6 md:px-10 max-[900px]:flex-col">
              <div className="flex flex-col justify-center pr-14 py-20 flex-[0_0_52%] max-w-[52%] relative z-[2] items-start text-left max-[900px]:flex-none max-[900px]:max-w-full max-[900px]:pr-0 max-[900px]:px-6 max-[900px]:py-16 max-sm:items-center max-sm:text-center max-sm:px-5 max-sm:py-12">
                <div className="absolute top-1/2 left-0 -translate-y-[55%] font-black uppercase tracking-[-0.02em] text-[rgba(40,40,40,0.06)] pointer-events-none select-none leading-none z-0 whitespace-nowrap" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(60px,10vw,130px)"}}>
                  TOOLS &<br/>TECH
                </div>
                <div className="relative z-[1] flex flex-col items-start text-left max-sm:items-center max-sm:text-center w-full">
                  <TabNav active={activeTab} onSwitch={setActiveTab} align="left"/>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000]" style={{fontFamily:"sans-serif"}}>TECHNOLOGY STACK</p>
                  <h1 className="font-black uppercase tracking-[-0.02em] leading-[0.95] text-[#282828] mb-5" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,4vw,56px)"}}>
                    Powering Operations<br/>with <em className="text-[#a10000] not-italic">20+ Integrated</em><br/><em className="text-[#a10000] not-italic">Tools & Platforms</em>
                  </h1>
                  <p className="max-w-[520px] text-[15px] leading-[1.75] text-[rgba(40,40,40,0.55)] mb-7" style={{fontFamily:"'Open Sans',sans-serif"}}>
                    From catalog management to CRM and analytics, our team operates across a curated stack of enterprise-grade tools.
                  </p>
                  <div className="text-[12px] tracking-[0.04em] text-[#aaa]" style={{fontFamily:"sans-serif"}}>
                    Home &gt;&gt; About &gt;&gt; <span className="text-[#a10000]">Tools Overview</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center py-10 relative overflow-hidden max-[900px]:min-h-[280px] max-sm:min-h-[220px]">
                <div className="relative w-full h-[420px] max-[900px]:h-[280px] max-sm:h-[220px]">
                  <HeroMosaic id="thm-mosaic" batches={[thmBatch1,thmBatch2]}/>
                </div>
              </div>
            </div>
          </section>

          {/* Tool Stack */}
          <section className="bg-[#f7f7f7] py-[72px] pb-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
                <div>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-2 text-[#a10000]" style={{fontFamily:"sans-serif"}}>INTERNAL TOOLS</p>
                  <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(26px,3vw,40px)"}}>Our Tool Stack</h2>
                </div>

              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {toolPillCats.map(p=>(
                  <button key={p.key} onClick={()=>{setActiveToolCat(p.key);setToolShowMore(false);}}
                    className={`text-xs font-semibold tracking-[0.04em] px-4 py-1.5 rounded-full border-[1.5px] transition-all duration-200 cursor-pointer ${activeToolCat===p.key?"bg-[#a10000] border-[#a10000] text-white":"bg-white border-[#ddd] text-[#888] hover:border-[#a10000] hover:text-[#a10000]"}`}
                    style={{fontFamily:"sans-serif"}}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {visibleTools.map((t,i)=><ToolCard key={t.name+i} {...t}/>)}
              </div>
              {filteredTools.length>8 && (
                <div className="text-center mt-8">
                  <button onClick={()=>setToolShowMore(s=>!s)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-[1.5px] border-[#d0d0d0] bg-white text-xs font-bold tracking-[0.07em] uppercase text-[#555] cursor-pointer hover:border-[#a10000] hover:text-[#a10000] transition-all"
                    style={{fontFamily:"sans-serif"}}>
                    {toolShowMore?"Show Less":"Show More"}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={toolShowMore?"rotate-180":""}>
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Platform Backends */}
          <section className="bg-[#f7f7f7] py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                <div>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-2 text-[#a10000]" style={{fontFamily:"sans-serif"}}>PLATFORM BACKENDS</p>
                  <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(26px,3vw,40px)"}}>Systems We<br/>Operate Inside</h2>
                </div>

              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Featured */}
                <div className="col-span-full grid grid-cols-[1fr_2fr] rounded-[20px] overflow-hidden bg-[#282828] border border-white/[0.06] min-h-[200px] hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200 max-sm:grid-cols-1">
                  <div className="bg-[#a10000] flex items-center justify-center font-black text-[72px] tracking-[-0.04em] text-white/20 p-10 max-sm:min-h-[120px] max-sm:text-[52px] max-sm:p-6" style={{fontFamily:"'Poppins',sans-serif"}}>MK</div>
                  <div className="p-9 flex flex-col justify-center max-sm:p-6">
                    <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase bg-white/10 text-white/70 px-3 py-1 rounded-full mb-3.5 w-fit" style={{fontFamily:"sans-serif"}}>Flagship Backend</span>
                    <div className="font-black uppercase tracking-[-0.02em] text-white mb-3 leading-[1.05]" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(22px,2.5vw,30px)"}}>Mirakl — The Marketplace Operating System</div>
                    <div className="text-sm text-white/55 leading-[1.7]" style={{fontFamily:"'Open Sans',sans-serif"}}>Our most-used platform backend. We manage hundreds of thousands of SKUs across Mirakl-powered storefronts in Europe and beyond.</div>
                  </div>
                </div>
                {[
                  {abbr:"AMZ",color:"red",tag:"Global Giant",name:"Amazon Seller Central",desc:"Full catalog operations inside Amazon Seller Central — listing creation, optimization, A+ content, pricing, and inventory management."},
                  {abbr:"WMT",color:"dark",tag:"US Market",name:"Walmart Marketplace",desc:"Direct backend access to Walmart Marketplace — managing product listings, pricing strategies, and catalog compliance."},
                  {abbr:"50+",color:"light",tag:"Full Network",name:"50+ Platform Backends",desc:"From KAUFLAND, OTTO, and Cdiscount in Europe to Temu, Shein, and BestBuy in the US — our team operates inside every major platform."},
                ].map((c,i)=>{
                  const bg=c.color==="red"?"bg-[#a10000] text-white":c.color==="dark"?"bg-[#282828] text-white/85":"bg-[#f0f0f0] text-[rgba(40,40,40,0.5)]";
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-[#e8e8e8] p-7 flex flex-col gap-3.5 hover:-translate-y-1 hover:shadow-lg hover:border-[rgba(161,0,0,0.2)] transition-all duration-200">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl tracking-[-0.02em] flex-shrink-0 ${bg}`} style={{fontFamily:"'Poppins',sans-serif"}}>{c.abbr}</div>
                      <div>
                        <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#a10000] mb-0.5" style={{fontFamily:"sans-serif"}}>{c.tag}</div>
                        <div className="font-extrabold text-xl uppercase tracking-[0.03em] text-[#282828]" style={{fontFamily:"'Poppins',sans-serif"}}>{c.name}</div>
                      </div>
                      <div className="text-[13px] text-[#888] leading-[1.65] mt-auto" style={{fontFamily:"'Open Sans',sans-serif"}}>{c.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Integration Flow */}
          <section className="bg-[#282828] py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
                <div>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-3 text-[#a10000]" style={{fontFamily:"sans-serif"}}>HOW WE OPERATE</p>
                  <h2 className="font-black uppercase tracking-[-0.02em] text-white mb-4 leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,3.5vw,46px)"}}>From Onboarding<br/>to Live Marketplace</h2>
                  <p className="text-sm text-white/50 leading-[1.75] mb-9" style={{fontFamily:"'Open Sans',sans-serif"}}>A streamlined 5-step process ensures every platform integration is executed consistently at scale.</p>
                  <div className="flex items-center gap-0 mb-10">
                    {["CX","ZD","OK","SF"].map((a,i)=>(
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#282828] flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0 ${i===0?"ml-0":"-ml-2.5"} ${["bg-[#1e3a5f]","bg-[#03363d]","bg-[#007dc1]","bg-[#6e40c9]"][i]}`} style={{fontFamily:"'Poppins',sans-serif"}}>{a}</div>
                    ))}
                    <span className="ml-3 text-sm text-white/50" style={{fontFamily:"'Open Sans',sans-serif"}}><strong className="text-white">19 tools</strong> work together</span>
                  </div>
                  <div className="flex flex-col gap-0 relative pl-4 border-l-2 border-[rgba(255,255,255,0.08)]">
                    {[
                      {title:"Platform Access",desc:"Secure credentials provisioned via Okta and CATO VPN."},
                      {title:"Catalog Setup",desc:"Product data structured and normalized using Salsify and Excel."},
                      {title:"Content Push",desc:"Listings pushed via Mirakl, direct API, or seller portal backend."},
                      {title:"Quality Check",desc:"Listings reviewed in Zendesk and flagged errors resolved via Jira."},
                      {title:"Live Monitoring",desc:"Performance tracked via Looker with weekly reporting to clients."},
                    ].map((s,i)=>(
                      <div key={i} className="flex gap-3 pb-7 last:pb-0">
                        <div className="relative -left-[22px] mt-1 w-3 h-3 rounded-full bg-[#a10000] flex-shrink-0 ring-4 ring-[#282828]"/>
                        <div className="-ml-3">
                          <div className="font-extrabold text-base uppercase tracking-[0.04em] text-white mb-1" style={{fontFamily:"'Poppins',sans-serif"}}>{s.title}</div>
                          <div className="text-[13px] text-white/45 leading-relaxed" style={{fontFamily:"'Open Sans',sans-serif"}}>{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  {[
                    {num:"115+",label:"PLATFORMS MANAGED",desc:"Active integrations across 115+ unique e-commerce platforms globally."},
                    {num:"100+",label:"SIMULTANEOUS OPERATIONS",desc:"Our team manages 100+ live marketplace accounts at any given time."},
                    {num:"5",label:"STEP INTEGRATION PROCESS",desc:"From access provisioning to live monitoring — zero gaps in execution."},
                  ].map((s,i)=>(
                    <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-8 py-7 hover:border-[rgba(161,0,0,0.4)] transition-all">
                      <div className="font-black text-[52px] leading-none tracking-[-0.03em] text-white mb-1.5" style={{fontFamily:"'Poppins',sans-serif"}}>{s.num}</div>
                      <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/35 mb-2.5" style={{fontFamily:"sans-serif"}}>{s.label}</div>
                      <div className="text-[13px] text-white/45 leading-relaxed" style={{fontFamily:"'Open Sans',sans-serif"}}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Why Tools */}
          <section className="bg-white py-20 border-t border-[#ebebeb]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="text-center max-w-[680px] mx-auto mb-14">
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-3 text-[#a10000]" style={{fontFamily:"sans-serif"}}>WHY OUR STACK</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] mb-4 leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(26px,3vw,40px)"}}>Built for Scale, Precision & Performance</h2>
                <p className="text-[15px] text-[#888] leading-[1.7]" style={{fontFamily:"'Open Sans',sans-serif"}}>Every tool in our stack was chosen for a reason — together they form a system that runs 115+ marketplace operations without missing a beat.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {[
                  {num:"01",title:"Identity Security",desc:"Citrix, Okta, CATO VPN, and Sailpoint lock down access for every operator across 24+ countries.",tag:"Security"},
                  {num:"02",title:"Seamless Comms",desc:"Slack, Teams, Bria, and Outlook keep globally distributed teams aligned with zero gaps across time zones.",tag:"Collaboration"},
                  {num:"03",title:"Catalog Precision",desc:"Salsify and Excel power structured workflows to manage hundreds of thousands of SKUs with consistent output.",tag:"Catalog Ops"},
                  {num:"04",title:"Data-Driven Ops",desc:"Looker gives clients real-time visibility into listing performance, errors, and optimization opportunities.",tag:"Analytics"},
                  {num:"05",title:"Project Accountability",desc:"Jira ensures every task and escalation is tracked — nothing falls through the cracks across 100+ simultaneous operations.",tag:"Project Mgmt"},
                  {num:"06",title:"Secure Infrastructure",desc:"Nexus and OneDrive provide a reliable backbone for artifact management, file sharing, and team-wide document access.",tag:"Infrastructure"},
                ].map((c,i)=>(
                  <div key={i} className="rounded-2xl p-7 border border-[#ebebeb] bg-[#fafafa] hover:-translate-y-1 hover:shadow-lg hover:border-[rgba(161,0,0,0.2)] transition-all duration-200">
                    <div className="font-black text-[36px] leading-none text-[rgba(161,0,0,0.12)] mb-3" style={{fontFamily:"'Poppins',sans-serif"}}>{c.num}</div>
                    <div className="font-extrabold text-[17px] uppercase tracking-[0.04em] text-[#282828] mb-2" style={{fontFamily:"'Poppins',sans-serif"}}>{c.title}</div>
                    <div className="text-[13px] text-[#777] leading-[1.65]" style={{fontFamily:"'Open Sans',sans-serif"}}>{c.desc}</div>
                    <span className="inline-block mt-3.5 text-[10px] font-bold tracking-[2px] uppercase bg-[rgba(161,0,0,0.07)] text-[#a10000] px-2.5 py-0.5 rounded-full" style={{fontFamily:"sans-serif"}}>{c.tag}</span>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>
      )}

      {/* ══ INDUSTRIES TAB ══ */}
      {activeTab==="industries" && (
        <div>
          {/* Hero */}
          <section className="bg-[#f7f7f7] overflow-hidden min-h-[790px] flex items-stretch">
            <div className="flex flex-row items-stretch w-full max-w-[1280px] mx-auto px-6 md:px-10 max-[900px]:flex-col">
              <div className="flex flex-col justify-center pr-14 py-20 flex-[0_0_52%] max-w-[52%] relative z-[2] items-start text-left max-[900px]:flex-none max-[900px]:max-w-full max-[900px]:pr-0 max-[900px]:px-6 max-[900px]:py-16 max-sm:items-center max-sm:text-center max-sm:px-5 max-sm:py-12">
                <div className="relative z-[1] flex flex-col items-start text-left max-sm:items-center max-sm:text-center w-full">
                  <TabNav active={activeTab} onSwitch={setActiveTab} align="left"/>
                  <p className="text-[11px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000]" style={{fontFamily:"sans-serif"}}>INDUSTRY PORTFOLIO</p>
                  <h1 className="font-black uppercase tracking-[-0.02em] leading-[0.95] text-[#282828] mb-5" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,4vw,56px)"}}>
                    Serving <em className="text-[#a10000] not-italic">22+ Accounts</em><br/>Across 10 Key Industries
                  </h1>
                  <p className="max-w-[520px] text-[15px] leading-[1.75] text-[rgba(40,40,40,0.55)] mb-7" style={{fontFamily:"'Open Sans',sans-serif"}}>
                    From kitchen goods to government travel documentation — our operations span a diverse portfolio of industries, each served with precision and marketplace expertise.
                  </p>
                  <div className="text-[12px] tracking-[0.04em] text-[#aaa]" style={{fontFamily:"sans-serif"}}>
                    Home &gt;&gt; About &gt;&gt; <span className="text-[#a10000]">Industries Overview</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center py-10 relative overflow-hidden max-[900px]:min-h-[280px] max-sm:min-h-[240px]">
                <div className="relative w-full h-[420px] max-[900px]:h-[280px] max-sm:h-[240px]">
                  <HeroMosaic id="ind-hero-mosaic" batches={[thmBatch2,thmBatch1]}/>
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="bg-white py-20">
            <div className="max-w-[1100px] mx-auto px-10 max-sm:px-5 grid grid-cols-1 md:grid-cols-2 gap-[72px] items-center max-md:gap-12">
              <div className="relative h-[380px] max-sm:h-[260px]">
                {[
                  {cls:"absolute w-[58%] h-[62%] left-0 top-0 z-[2]",src:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",alt:"Kitchen"},
                  {cls:"absolute w-[46%] h-[48%] right-0 top-0 z-[1]",src:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",alt:"Tech"},
                  {cls:"absolute w-[50%] h-[46%] left-[10%] bottom-0 z-[3] border-4 border-white",src:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=360&fit=crop",alt:"Fashion"},
                  {cls:"absolute w-[38%] h-[38%] right-0 bottom-[14%] z-[2]",src:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=350&h=280&fit=crop",alt:"Medical"},
                ].map((img,i)=>(
                  <div key={i} className={`${img.cls} rounded-[18px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.14)] bg-[#e0e0e0]`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-3 text-[#a10000]" style={{fontFamily:"sans-serif"}}>About —</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] mb-5 leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,3.5vw,46px)"}}>Diverse Verticals,<br/>One Standard<br/>of Excellence</h2>
                <p className="text-sm text-[#777] leading-[1.8] mb-8" style={{fontFamily:"'Open Sans',sans-serif"}}>Our client portfolio spans a wide spectrum of commerce — from household essentials and cutting-edge electronics to specialized healthcare and government services.</p>
                <div className="flex gap-7 flex-wrap">
                  {[{val:"22+",lbl:"Accounts"},{val:"10",lbl:"Verticals"},{val:"B2B",lbl:"Model"}].map((s,i)=>(
                    <div key={i} className="flex flex-col items-start px-6 py-[18px] rounded-xl bg-[#f7f7f7] border border-[#ebebeb] min-w-[90px]">
                      <span className="font-black text-[36px] leading-none tracking-[-0.02em] text-[#a10000]" style={{fontFamily:"'Poppins',sans-serif"}}>{s.val}</span>
                      <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#aaa] mt-1" style={{fontFamily:"sans-serif"}}>{s.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Industries We Serve */}
          <section className="py-20 relative" style={{background:"#1a1a1a",backgroundImage:"url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=60&fit=crop'),linear-gradient(135deg,rgba(26,26,26,0.92),rgba(30,24,24,0.97))",backgroundBlendMode:"multiply",backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0 pointer-events-none z-0" style={{background:"radial-gradient(ellipse at 70% 50%,rgba(161,0,0,0.06) 0%,transparent 65%),linear-gradient(180deg,rgba(26,26,26,0.45) 0%,rgba(26,26,26,0.75) 100%)"}}/>
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative z-[1]">
              {/* Header + dropdown */}
              <div className="flex items-end justify-between gap-8 flex-wrap mb-9 max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[11px] tracking-[4px] uppercase font-bold mb-2 text-white bg-[#a10000] px-3 py-1 rounded-md" style={{fontFamily:"sans-serif"}}>BY VERTICAL</span>
                  <h2 className="font-black uppercase tracking-[-0.02em] text-white leading-none" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,3vw,42px)"}}>Industries We Serve</h2>
                  <p className="text-[13px] text-white/35 mt-2.5 max-w-[480px] leading-[1.7]" style={{fontFamily:"'Open Sans',sans-serif"}}>
                    Select an industry from the dropdown to explore the accounts we manage within that vertical.
                  </p>
                </div>
                <div ref={indDropRef} className="relative inline-block flex-shrink-0 z-[100] max-sm:w-full">
                  <button onClick={()=>setIndDropOpen(o=>!o)}
                    className={`flex items-center gap-3 px-6 py-3.5 border-2 rounded-xl text-[13px] font-bold tracking-[0.07em] uppercase min-w-[240px] justify-between cursor-pointer transition-all duration-200 max-sm:w-full max-sm:min-w-0 max-sm:box-border ${indDropOpen?"bg-white text-[#1a1a1a] border-white":"bg-transparent border-white/20 text-white hover:border-white/40"}`}
                    style={{fontFamily:"sans-serif"}}>
                    <span>{activeIndustry==="all"?"ALL INDUSTRIES":(industryPanels.find(p=>p.key===activeIndustry)?.label.toUpperCase()??"ALL INDUSTRIES")}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform flex-shrink-0 ${indDropOpen?"rotate-180":""}`}>
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {indDropOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.55)] z-[999] min-w-[260px] max-h-[340px] overflow-y-auto">
                      {industryPanels.map(p=>(
                        <button key={p.key} onClick={()=>{
                          if(indAutoRef.current){ clearInterval(indAutoRef.current); indAutoRef.current=null; }
                          setActiveIndustry(p.key);setIndDropOpen(false);
                        }}
                          className={`flex items-center justify-between w-full px-[22px] py-[11px] text-left text-xs font-bold tracking-[0.06em] uppercase transition-all border-l-[3px] bg-none cursor-pointer hover:bg-white/[0.07] hover:text-white ${activeIndustry===p.key?"border-l-[#a10000] text-white bg-[rgba(161,0,0,0.08)]":"border-l-transparent text-white/60"}`}
                          style={{fontFamily:"sans-serif",borderTop:"none",borderRight:"none",borderBottom:"none"}}>
                          <span>{p.label}</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-white/40">{p.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Two-col layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start min-h-[460px] max-sm:gap-8">
                {/* Left panel */}
                <div className="relative overflow-hidden rounded-[20px] bg-white/[0.03] border border-white/[0.07] px-9 py-10 min-h-[380px] flex flex-col justify-end max-sm:min-h-[260px] max-sm:px-6 max-sm:py-7">
                  <div className="absolute bottom-[-10px] right-[-10px] font-black leading-none tracking-[-0.04em] text-white/[0.04] pointer-events-none select-none uppercase transition-opacity duration-300" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(80px,18vw,200px)"}}>{activePanel.backdropLetters}</div>
                  <div className="relative z-[1]">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-white bg-[#a10000] px-3 py-1 rounded-md mb-3 w-fit" style={{fontFamily:"sans-serif"}}>{activePanel.eyebrow}</div>
                    <div className="font-black uppercase tracking-[-0.02em] text-white leading-[1.05] mb-4" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(18px,2.8vw,34px)"}}>{activePanel.title}</div>
                    <div className="text-[13.5px] text-white/45 leading-[1.85] max-w-[400px] max-sm:max-w-full max-sm:text-[13px]" style={{fontFamily:"'Open Sans',sans-serif"}}>{activePanel.body}</div>
                    <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10">
                      <span className="font-black text-[22px] text-[#a10000] tracking-[-0.02em]" style={{fontFamily:"'Poppins',sans-serif"}}>{activePanel.count}</span>
                      <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/35" style={{fontFamily:"sans-serif"}}>Managed Accounts</span>
                    </div>
                  </div>
                </div>
                {/* Right panel */}
                <div className="overflow-y-auto max-h-[480px] pr-1" style={{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"}}>
                  <div className="flex flex-col gap-2.5">
                    {activePanel.accounts.length>0 ? activePanel.accounts.map((acc,i)=>(
                      <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all cursor-default max-sm:px-3.5 max-sm:py-3 max-sm:gap-3">
                        <AvatarEl abbr={acc.abbr} cls={acc.avatarClass}/>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-[15px] uppercase tracking-[0.04em] text-white mb-0.5" style={{fontFamily:"'Poppins',sans-serif"}}>{acc.name}</div>
                          <div className="text-[13px] text-white/45 leading-relaxed max-sm:text-xs max-sm:whitespace-normal" style={{fontFamily:"'Open Sans',sans-serif"}}>{acc.desc}</div>
                        </div>
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-0.5 rounded-full bg-[#a10000]/20 text-[#a10000] flex-shrink-0" style={{fontFamily:"sans-serif"}}>{acc.tag}</span>
                      </div>
                    )) : (
                      <div className="text-white/30 text-sm pt-8" style={{fontFamily:"'Open Sans',sans-serif"}}>Select a vertical to see managed accounts.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Accounts by Industry (Verticals) */}
          <section className="bg-[#f7f7f7] py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="mb-9 text-center">
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-2 text-[#a10000]" style={{fontFamily:"sans-serif"}}>INDUSTRY BREAKDOWN</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] leading-none mb-3" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,3vw,42px)"}}>Accounts by Industry</h2>
                <p className="text-[13px] text-[#888] max-w-[560px] mx-auto leading-[1.7]" style={{fontFamily:"'Open Sans',sans-serif"}}>We partner with brands across 10 distinct verticals — from kitchen essentials to cutting-edge tech, healthcare, and specialty niches.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleVerts.map((v,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                    <div className="relative h-[200px] overflow-hidden bg-[#e0e0e0]">
                      <img src={v.img} alt={v.name} className="w-full h-full object-cover"/>
                      <div className="absolute top-4 left-4 font-black text-[52px] leading-none tracking-[-0.04em] text-[#a10000]" style={{fontFamily:"'Poppins',sans-serif",WebkitTextStroke:"2px #a10000",color:"transparent"}}>{v.num}</div>
                    </div>
                    <div className="p-6">
                      <div className="font-black text-xl uppercase tracking-[-0.01em] text-[#282828] mb-2" style={{fontFamily:"'Poppins',sans-serif"}}>{v.name}</div>
                      <div className="text-[13px] text-[#888] mb-4 leading-[1.65]" style={{fontFamily:"'Open Sans',sans-serif"}}>{v.desc}</div>
                      <div className="flex flex-wrap gap-2">
                        {v.chips.map((c,ci)=>(
                          <span key={ci} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[rgba(161,0,0,0.06)] text-[#a10000] border border-[rgba(161,0,0,0.12)]" style={{fontFamily:"sans-serif"}}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {verticalRows.length>6 && (
                <div className="text-center mt-8">
                  <button onClick={()=>setVertShowMore(s=>!s)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-[1.5px] border-[#ddd] bg-white text-xs font-bold tracking-[0.07em] uppercase text-[#555] cursor-pointer hover:border-[#a10000] hover:text-[#a10000] transition-all"
                    style={{fontFamily:"sans-serif"}}>
                    {vertShowMore?"Show Less":"Show More"}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={vertShowMore?"rotate-180":""}>
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Full Account Directory */}
          <section className="bg-[#f0f0f0] py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
              <div className="mb-8">
                <p className="text-[11px] tracking-[4px] uppercase font-bold mb-2 text-[#a10000]" style={{fontFamily:"sans-serif"}}>COMPLETE ROSTER</p>
                <h2 className="font-black uppercase tracking-[-0.02em] text-[#282828] leading-none mb-2.5" style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(26px,3vw,40px)"}}>Full Account Directory</h2>
                <p className="text-sm text-[#888] leading-[1.7] max-w-[520px] mb-8" style={{fontFamily:"'Open Sans',sans-serif"}}>Every brand we've partnered with, organized by vertical. Use the filters below to explore specific industries.</p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {[{k:"all",l:"All"},{k:"kitchen",l:"Kitchen"},{k:"electronics",l:"Electronics"},{k:"fashion",l:"Fashion"},{k:"home",l:"Home & Ergo"},{k:"medical",l:"Medical"},{k:"automotive",l:"Automotive"},{k:"travel",l:"Travel & Gov't"},{k:"logistics",l:"Logistics"},{k:"software",l:"Software"},{k:"specialty",l:"Specialty"}].map(p=>(
                    <button key={p.k} onClick={()=>{setIndDirFilter(p.k);setDirShowMore(false);}}
                      className={`text-xs font-semibold tracking-[0.04em] px-4 py-1.5 rounded-full border-[1.5px] transition-all cursor-pointer ${indDirFilter===p.k?"bg-[#a10000] border-[#a10000] text-white":"bg-white border-[#ddd] text-[#777] hover:border-[#a10000] hover:text-[#a10000]"}`}
                      style={{fontFamily:"sans-serif"}}>{p.l}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleDir.map((c,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-[#e8e8e8] p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <AvatarEl abbr={c.abbr} cls={c.ac}/>
                      <div>
                        <div className="font-extrabold text-base uppercase tracking-[0.03em] text-[#282828]" style={{fontFamily:"'Poppins',sans-serif"}}>{c.name}</div>
                        <div className="text-xs text-[#aaa]" style={{fontFamily:"'Open Sans',sans-serif"}}>{c.industry}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <BadgeEl type={c.badge} label={c.badgeLabel}/>
                      <div className="w-2 h-2 rounded-full bg-[#22c55e]"/>
                    </div>
                  </div>
                ))}
              </div>
              {filteredDir.length>8 && (
                <div className="text-center mt-8">
                  <button onClick={()=>setDirShowMore(s=>!s)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-[1.5px] border-[#ddd] bg-white text-xs font-bold tracking-[0.07em] uppercase text-[#555] cursor-pointer hover:border-[#a10000] hover:text-[#a10000] transition-all"
                    style={{fontFamily:"sans-serif"}}>
                    {dirShowMore?"Show Less":"Show More"}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={dirShowMore?"rotate-180":""}>
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}