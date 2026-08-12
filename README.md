# 🌾 GROW — Smart Agricultural & Farmer Empowerment Platform

> **LET YOUR KNOWLEDGE YIELD A BETTER FUTURE**

**GROW** is a state-of-the-art, modern web-based agricultural intelligence platform engineered to empower farmers, agronomists, and farm managers. Built with clean HTML5, modern CSS3, and high-performance vanilla JavaScript, GROW delivers real-time market insights, AI-driven crop disease diagnostics, automated yield & profit estimation, live weather advisories, government subsidy portals, and an interactive 24/7 **Kisan Mitra AI Assistant** across all pages.

---

## 🌟 Key Features & Core Modules

### 1. 🏡 Managed Farms Dashboard (`index.html`)
- **Hero & Metrics Banner**: Instant access to key agricultural services with quick action buttons.
- **Farms Handed Over & Looking After**: Visual showcase of active managed farms (Wheat, Greenhouse, Orchard) with health indices, yield growth stats, and active monitoring indicators.
- **Standardized Navigation Header & Clean Minimalist Footer**: Consistent navigation bar and branding across the platform.

### 2. 🧮 Smart Yield Calculator (`yield-calculator.html`)
- **Comprehensive Cost & Tonnage Estimation**: Calculate required seed quantity, N-P-K fertilizer expenditure, expected crop yield (tonnes/acre), gross revenue, and net profit margins.
- **Multi-Crop Support**: Tailored formula presets for Wheat, Rice (Paddy), Cotton, Maize, Sugarcane, Tomatoes, and Mustard.

### 3. 🌤️ Live Weather Engine (`weather.html`)
- **Real-Time City Weather Search**: Integrated with free Open-Meteo and Nominatim Geocoding APIs (no API key required).
- **Comprehensive Forecast Metrics**: Live temperature, humidity, wind speed, precipitation probability, UV index, 7-day forecast cards, and climate-specific field advisories.

### 4. 🐛 AI Crop Doctor & Leaf Diagnostics (`crop-doctor.html`)
- **Interactive Camera & Image Upload**: Real-time leaf scanning for pest and disease detection.
- **Actionable Treatment Plans**: Detailed chemical dosage instructions (e.g. Propiconazole 25% EC), organic remedies (Jeevamrutha, Neem Oil), and preventative agronomist tips.

### 5. 📈 Mandi Market Analytics & Search (`market.html`)
- **Interactive Crop Search & Analysis Dashboard**: Live price search for crops with MSP benchmark comparisons, 24h percentage change badges, 7-day price history bar charts, and expert selling advisories.
- **Redesigned Market Highlights**: Live pulse animated gainer & dip cards displaying top mandi prices across Khanna, Bharatpur, Karnal, and Guntur.

### 6. 📚 Agriculture Learning & Government Schemes Hub (`learning.html`)
- **Farmer Education & Subsidies**: Guides on Zero Budget Natural Farming (ZBNF), Kisan Drone 7-minute spraying, PM-KISAN, PMKSY drip irrigation, and PM-KUSUM solar water pumps.
- **Direct Official Government Portals**: Clickable external links to authentic Government of India websites ([PM-KISAN](https://pmkisan.gov.in/), [PMFBY Insurance](https://pmfby.gov.in/), [eNAM Mandi](https://www.enam.gov.in/), [Soil Health Card](https://soilhealth.dac.gov.in/), [Kisan Suvidha](https://farmer.gov.in/), and [ICAR KVK](https://kvk.icar.gov.in/)).

### 7. 🤖 Kisan Mitra AI Assistant (`main.js` & `style.css`)
- **Global 24/7 Floating Chatbot**: Accessible on every page via a floating launcher button (`Ask Kisan AI`).
- **Smart Query Handler**: Provides instant answers for Mandi prices, crop diseases, fertilizer calculations, weather alerts, and government scheme applications.
- **Rich Interactive UI**: Features 1-click quick suggestion chips, timestamped messages, and a real-time animated 3-dot typing indicator.

---

## 🛠️ Technology Stack

- **Structure**: HTML5 (Semantic elements, accessible modal overlays)
- **Styling**: Vanilla CSS3 (Custom Design System, CSS Variables, Glassmorphism, Responsive Grid/Flexbox, Dynamic Keyframe Animations)
- **Logic**: Vanilla JavaScript ES6+ (Modular functions, dynamic DOM manipulation, LocalStorage/SessionStorage)
- **APIs**: 
  - [Open-Meteo API](https://open-meteo.com/) — Live weather data
  - [Nominatim OpenStreetMap API](https://nominatim.openstreetmap.org/) — City geocoding
- **Typography & Icons**: 
  - Google Fonts ([Inter](https://fonts.google.com/specimen/Inter), [Poppins](https://fonts.google.com/specimen/Poppins))
  - [Font Awesome 6.6](https://fontawesome.com/)

---

## 📁 Directory Structure

```
GROW/
│
├── ASSISTS/
│   ├── LOGO/
│   │   └── LOGO (2).PNG              # Official GROW Brand Logo
│   └── images/
│       ├── farm-wheat.png             # Managed Wheat Farm Image
│       ├── farm-greenhouse.png         # Managed Greenhouse Image
│       └── farm-orchard.png            # Managed Fruit Orchard Image
│
├── index.html                         # Home Page & Managed Farms Section
├── yield-calculator.html               # Yield & Net Profit Calculator
├── weather.html                       # Live Weather Forecast & Advisories
├── crop-doctor.html                   # AI Crop Disease Scanner & Diagnostics
├── market.html                        # Mandi Prices & Market Analysis Panel
├── learning.html                      # Learning Hub & Govt Schemes Directory
├── contact.html                       # Contact Support & FAQ Portal
├── about.html                         # About GROW & Mission Statement
│
├── style.css                          # Core CSS Design System & Component Styles
├── main.js                            # Main Application Logic & AI Chatbot Engine
├── auth.js                            # User Authentication Handler
└── README.md                          # Platform Documentation
```

---

## 🚀 How to Run Locally

1. **Clone or Download** the repository to your local computer.
2. Open the project folder in your preferred code editor (e.g., VS Code).
3. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
4. No node installation or server setup is required — all tools and APIs run seamlessly out of the box!

---

## 🌐 Browser & Device Compatibility

- **Fully Responsive**: Optimized for Mobile phones, Tablets, Laptops, and 4K Displays.
- **Cross-Browser Tested**: Compatible with Chrome, Edge, Safari, Firefox, and Opera.

---

## 📄 License & Credits

© 2026 **GROW Agriculture Tech Platform**. All Rights Reserved.  
*Empowering farmers with smart technology for a sustainable future.*
