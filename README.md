# Janani Lifestyle - Luxury Wellness Retreat

A premium wellness retreat website built with React, Vite, and Tailwind CSS.

## 🌿 Overview

Janani Lifestyle is a luxury nature retreat located in Wayanad, Kerala, offering authentic Ayurveda healing, yoga, meditation, and traditional mud house experiences.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project folder:
   ```bash
   cd janani-lifestyle
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
janani-lifestyle/
├── public/
│   └── assets/
│       └── experiences/    # Experience images
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ScrollReveal.jsx
│   │   ├── ExperienceCard.jsx
│   │   └── FeatureCard.jsx
│   ├── sections/          # Page sections
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Experiences.jsx
│   │   ├── RetreatFeatures.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── data/              # Static data
│   │   └── experiences.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🎨 Design System

### Colors
- Forest Green: `#5c6d57` - Primary brand color
- Earth Beige: `#f2efe7` - Background tones
- Soft Gold: `#c5a356` - Accents
- Misty White: `#fafafa` - Overlays

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## 🖼️ Adding Images

Replace the placeholder divs in the components with actual images:

1. Add your images to `public/assets/` folder
2. Update the image paths in the components:
   - `src/sections/Hero.jsx` - Hero background
   - `src/sections/About.jsx` - About section image
   - `src/components/ExperienceCard.jsx` - Experience card images
   - `src/sections/RetreatFeatures.jsx` - Feature section image

### Recommended Image Sizes
- Hero background: 1920x1080px
- Experience cards: 800x600px
- About section: 800x1000px

## 📱 Features

- ✅ Fully responsive design (mobile-first)
- ✅ Smooth scroll animations
- ✅ Glassmorphism effects
- ✅ Sticky navigation with blur effect
- ✅ Grid-based experience cards
- ✅ Contact/Booking CTA section
- ✅ Newsletter subscription
- ✅ Social media links

## 🛠️ Built With

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations (optional)
- [Lucide React](https://lucide.dev/) - Icons

## 📄 License

This project is created for demonstration purposes.

---

**Janani Lifestyle** - Born from Earth, Guided by Ancient Wisdom 🌿
