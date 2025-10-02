# Locatrova Landing Page - Design Guidelines

## Design Approach
**Reference-Based**: Airbnb-inspired design with conversion optimization focus. Platform connects property owners with creative productions (like "Airbnb for film shoots and events").

## Core Design Elements

### Color Palette
**Primary Colors:**
- Primary Orange: `17 95% 60%` (#FF6B35)
- Secondary Orange: `33 95% 55%` (#F7931E)
- Dark Navy: `220 26% 14%` (#1a202c)
- Dark Slate: `214 13% 24%` (#2d3748)

**Neutral Colors:**
- Grey Light: `210 17% 98%` (#f8f9fa)
- Grey Medium: `215 16% 47%` (#6b7280)
- Success Green: `158 64% 52%` (#10b981)
- Error Red: `0 84% 60%` (#ef4444)

### Typography
- **Fonts**: Inter or Poppins via Google Fonts
- **Headings**: H1 3.5rem desktop/2.5rem mobile, weight 700
- **Subheadings**: 1.25rem, weight 400-500
- **Body**: 1rem, weight 400
- **Scale**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing System
Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32 (p-2, p-4, p-8, py-20, etc.)
Section padding: py-12 mobile, py-20 tablet, py-32 desktop

## Page Structure

### 1. Hero Section (Full-Width with Background Image)
- **Layout**: 100vh mobile, 80vh desktop with elegant location background image (villa/loft/creative space)
- **Overlay**: Dark gradient rgba(0,0,0,0.5-0.6)
- **Grid**: 2 columns desktop (60% text, 40% visual), stack mobile
- **Content Left**: 
  - H1: "Trasforma il tuo spazio in una fonte di reddito"
  - Subtitle: "Locatrova connette il tuo spazio con produzioni creative ed eventi. Come Airbnb, ma per shooting, film e produzione."
  - CTA Button: Orange (#FF6B35), 16px 32px padding, 8px border-radius, scale(1.05) hover
  - Trust Badge: "Oltre 500 spazi attivi - Partner di Netflix e Mediaset"
- **Content Right**: Montage video/image of successful locations
- **Text Color**: White with subtle shadow for legibility

### 2. Client Logos Section
- **Background**: Light grey (#f8f9fa)
- **Layout**: Centered, single column
- **Title**: "Trusted by" or "Alcuni nostri clienti"
- **Logo Grid**: 4-5 logos per row desktop, 2-3 mobile, max-width 150px
- **Effect**: Grayscale default, full color on hover, 0.3s transition
- **Logos**: Netflix, Gaumont, Mediaset, Peppermint

### 3. How It Works Section (3 Cards)
- **Background**: White or very light grey
- **Title**: "Semplice come affittare su Airbnb"
- **Layout**: 3-column grid desktop, stack mobile
- **Cards**: 
  - White background, 12px border-radius
  - Box shadow: 0 4px 20px rgba(0,0,0,0.1)
  - Hover: translateY(-8px) with 0.3s transition
  - Icon (emoji or SVG) + Title + Description
  - Step 1: 🏠 "Carica il tuo spazio" (10 minutes setup)
  - Step 2: 🎬 "Le produzioni guardano e selezionano"
  - Step 3: 💰 "Ricevi la richiesta e decidi"

### 4. Case Study Section
- **Background**: Light gradient
- **Layout**: 2 columns (60% text, 40% visual)
- **Badge**: "Case Study" label
- **Headline**: "Marco ha guadagnato €5.000 in 3 mesi con il suo spazio"
- **Description**: Real story with location pin 📍 "Spazio di Marco - Milano, Italia"
- **Card Styling**: White, rounded, shadow, padding 2rem

### 5. Space Types Grid (9 Categories)
- **Title**: "Accettiamo ogni tipo di spazio"
- **Layout**: 3x3 grid desktop, 2 columns tablet, stack mobile
- **Categories**: Case Private, Casali & Ville, Uffici, Sale Eventi, Spazi Creativi, Co-working, Spazi Industriali, Location Uniche, [Custom]
- **Cards**: Icon + Title + Brief description, 8px border-radius, subtle shadow, hover color change to #fff5f0 with orange border

### 6. Multi-Step Form Section (4 Steps)
- **Background**: Gradient (orange tones)
- **Container**: Max-width 600px, white background, 12px border-radius, shadow 0 8px 32px rgba(0,0,0,0.1)
- **Progress Bar**: 4px height, gradient fill #FF6B35 to #F7931E
- **Step 1**: Visual image selector for space type (8 options grid)
- **Step 2**: Contact fields (Name, Email, Phone, City)
- **Step 3**: Space details (Square meters slider, availability checkboxes, characteristics textarea)
- **Step 4**: Expectations select + optional notes + privacy checkboxes
- **Buttons**: "Indietro" and "Avanti" navigation, inline validation
- **Final CTA**: "Richiedi la chiamata gratuita"

### 7. FAQ Section (Accordion)
- **Background**: #f8f9fa
- **Layout**: Single column, max-width 800px centered
- **Items**: 6 expandable questions about earnings, insurance, modifications, costs, refusal rights, first call
- **Styling**: Clean accordion with smooth expand/collapse animation

### 8. Footer/Final CTA
- **Background**: Dark gradient (#1a202c → #2d3748)
- **Headline**: "Il tuo spazio potrebbe già guadagnare"
- **Trust Elements**: 4 checkmarks with key benefits
- **CTA**: Orange button "Inizia ora - È gratuito"
- **Links**: Privacy, Terms, Contact, Social (LinkedIn, Instagram)
- **Copyright**: "Locatrova © 2025"

## Responsive Breakpoints
- **Mobile (<768px)**: Stack all sections, 2 logos per row, single column form
- **Tablet (768-1024px)**: 2-column layouts, reduced padding, form max-width 500px
- **Desktop (>1024px)**: Full layouts as specified, hover effects active, form max-width 600px

## Images
- **Hero**: Elegant location background (villa/loft/cinematic set) full-width, center positioning
- **Case Study**: Visual of successful location space
- **Client Logos**: Netflix, Gaumont, Mediaset, Peppermint (grayscale with color hover)
- **Space Categories**: Icon-based (can use emoji or custom SVGs)

## Conversion Optimization
- Visual selectors over dropdowns
- Progress indicators for engagement
- Trust badges and social proof throughout
- Mobile-first, touch-friendly interactions
- Clear value propositions at each section