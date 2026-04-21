# STARE-WORTHY DESIGN PROMPT FOR PIGEON

## Meta-Brief: What Makes Users *Stop and Stare*

This is not "fine design." This is **jaw-dropping, attention-halting, portfolio-worthy design** that makes users pause and study every detail.

The difference between "good" and "stare-worthy":
- **Good:** Clean, well-spaced, pleasant to use
- **Stare-worthy:** Clean + intentional asymmetry + unexpected moments + precise craft details + refined motion + luxury restraint + memorable interactions

**Stare-worthy design has:**
1. **Visual surprise** — unexpected asymmetry or layout that breaks the grid intentionally
2. **Craft details** — micro-interactions, custom curves, refined shadows, precise typography
3. **Luxury restraint** — fewer colors, fewer animations, more white space
4. **Memorable moments** — hero section you want to screenshot, animation that delights
5. **Hierarchy that whispers** — you understand importance immediately without being told
6. **Motion that feels alive** — custom easing, staggered timing, purposeful movement

---

## PIGEON'S STARE-WORTHY DIRECTION

**Direction:** Luxury/Refined Dark Minimalism + Data Visualization Artistry  
**Aesthetic:** "Stripe dark mode meets premium fintech meets data art"  
**Density:** Spacious with confident breathing room  
**Core Tension:** Minimal UI + Maximum data visualization moments

---

## THE DETAILED PROMPT

### 1. HERO SECTION — The Attention-Stopping Moment

**Goal:** Someone lands on your site and stops scrolling immediately.

#### Layout & Asymmetry
- **Structure:** 2-column asymmetric grid (NOT centered, NOT equal)
  - Left column (55%): Text + CTAs (headline, subheadline, 2-3 buttons)
  - Right column (45%): Animated data visualization (the "wow" moment)
- **Vertical offset:** Left column 20-30px lower than right (intentional misalignment, not accidental)
- **Anti-pattern:** DO NOT center everything or use equal columns

#### Hero Typography (Left Column)
- **Headline (H1)**
  - Font size: clamp(48px, 8vw, 72px)
  - Font weight: 300 (ultra-light, luxury signal)
  - Letter-spacing: -0.03em (tight, refined)
  - Line-height: 1.1
  - Color: #f5f5f5
  - Max-width: 600px (readable, not cramped across full width)
  - Approach: ONE powerful statement, not marketing fluff
  - Example feel: "Private conversations. No exposure." (specific, not "Build the future")

- **Subheadline (H3)**
  - Font size: 18px
  - Font weight: 400
  - Letter-spacing: 0.01em
  - Line-height: 1.6
  - Color: rgba(255, 255, 255, 0.62) (secondary hierarchy)
  - Max-width: 520px
  - Tone: Specific benefits, not hedging

#### Hero Visual (Right Column) — The Stare-Worthy Moment
This is where users stop and stare. This is NOT just a screenshot or static image.

- **Type:** Animated data visualization showing privacy/security metrics
- **Content Ideas:**
  - Real-time message flow (bars moving, data flowing)
  - Encryption strength visualization (animated lock states)
  - Data privacy timeline (floating elements showing protection levels)
  - Network nodes with connections (shows distributed nature)
  - Message throughput metrics (real-time animated counters)

- **Visual Details:**
  - 3-5 animated bars/elements, each with staggered animation
  - Floating geometric shapes in background (circles, lines, subtle)
  - Gradient overlay: top (cyan #00d9ff) to transparent to purple (#8b5ce6)
  - Custom animation timing:
    - Entry: 600ms cubic-bezier(0.23, 0.96, 0.09, 1.04)
    - Each bar offset by 100ms (stagger creates flow)
    - Infinite loop: 20s smooth, hypnotic motion
  - Parallax on scroll: -10px to 10px vertical shift as user scrolls
  - NO harsh shadows; depth via semi-transparent gradients only

#### CTA Buttons (Left Column)
- **Primary Button**
  - Style: Gradient button (cyan → purple)
  - Size: 48px height, 120px width
  - Typography: 16px, 500 weight
  - Hover state:
    - Shadow glow: rgba(0, 217, 255, 0.3) 0 0 20px
    - Transform: translateY(-4px)
    - Transition: 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
  - NO rounded corners (refined minimalism) — 8px border-radius max
  - Cursor changes to pointer with scale feedback

- **Secondary Button**
  - Style: Outlined, no fill
  - Border: 1px rgba(255, 255, 255, 0.2)
  - Hover: Border becomes rgba(255, 255, 255, 0.4)
  - NO background color on hover (restrained)

#### Hero Background
- Base: #0a0a0a
- Gradient overlay: 135deg, cyan (rgba(0, 217, 255, 0.08)) to purple (rgba(139, 92, 246, 0.06))
- Floating shapes: 2-3 semi-transparent circles, barely visible (opacity 0.03)
- NO harsh gradients; everything is subtle

#### Scroll Indicator (Bottom of Hero)
- Small animated arrow or text: "Scroll to explore"
- Animation: Bounce 2s infinite (subtle, not distracting)
- Color: rgba(255, 255, 255, 0.3)
- Disappears on scroll

---

### 2. FEATURE SECTION — Asymmetric Grid, Refined Cards

**Goal:** Show product benefits through memorable layouts, not generic feature cards.

#### Layout Strategy
- **Grid:** 2+1 asymmetric layout (NOT 3 equal columns)
  - Large featured card: 60% width (left)
  - Two small stacked cards: 40% width (right, each 48% height, 4% gap between)

#### Featured Card (Left, Large)
- **Size:** 400px × 300px (landscape-heavy ratio, not square)
- **Background:** Linear gradient (subtle)
  - Direction: 135deg
  - From: rgba(0, 217, 255, 0.08)
  - To: rgba(139, 92, 246, 0.04)
- **Border:** 1px rgba(255, 255, 255, 0.12)
- **Border-radius:** 16px (larger than small cards, visual weight)
- **Padding:** 48px (generous, luxury signal)
- **Content:**
  - Icon (32×32px, color #00d9ff)
  - H3 heading: 24px, 400 weight
  - Body text: 16px, 400 weight, rgba(255,255,255,0.62)
  - Optional: small data metric (24px bold, accent color)

- **Hover State:**
  - Background shift: overlay opacity increases 4%
  - Lift: translateY(-6px)
  - Border color: rgba(255, 255, 255, 0.20)
  - Transition: 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
  - Shadow: rgba(0, 217, 255, 0.1) 0 12px 32px (soft, cyan-tinted)

#### Small Cards (Right, Stacked)
- **Each card:** 200px × 140px
- **Background:** rgba(255, 255, 255, 0.03)
- **Border:** 1px rgba(255, 255, 255, 0.08)
- **Border-radius:** 12px (smaller than featured)
- **Padding:** 24px

- **Content per card:**
  - Icon (24×24px)
  - H4 heading: 16px, 400 weight
  - Body: 13px, 400 weight, rgba(255,255,255,0.5)

- **Hover State:**
  - Border: rgba(255, 255, 255, 0.12)
  - Lift: translateY(-4px)
  - Transition: 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
  - NO shadow (keeps it refined, not heavy)

#### Section Spacing
- Top padding: 120px
- Bottom padding: 120px
- Gap between cards: 16px
- Horizontal margins: 80px on desktop, 24px on mobile

---

### 3. DATA SHOWCASE / CHAT PREVIEW — Depth & Layering

**Goal:** Show the product in action with premium depth and professional appearance.

#### Container
- **Background:** #0a0a0a with gradient overlay
- **Backdrop blur:** 20px (premium depth signal)
- **Border:** 1px rgba(255, 255, 255, 0.12)
- **Border-radius:** 20px
- **Padding:** 32px
- **Width:** 100% max-width 800px, centered

#### Chat Header
- **Avatar:** 40×40px, accent color placeholder
- **Name:** 16px, 500 weight, #f5f5f5
- **Status:** "Online" or "Verified" badge, 12px, rgba(0,217,255,0.8)
- **Layout:** Flex, left-aligned

#### Message Thread
- **Incoming message** (left-aligned)
  - Background: rgba(255, 255, 255, 0.06)
  - Border-left: 2px solid rgba(0, 217, 255, 0.3) (accent accent, not full)
  - Padding: 16px
  - Border-radius: 8px (small, functional)
  - Text: 14px, 400 weight
  - Animation: slideInLeft 400ms cubic-bezier(0.23, 0.96, 0.09, 1.04)

- **Outgoing message** (right-aligned)
  - Background: rgba(0, 217, 255, 0.12)
  - Border-right: 2px solid rgba(0, 217, 255, 0.4)
  - Padding: 16px
  - Border-radius: 8px
  - Text: 14px, 400 weight, #f5f5f5
  - Animation: slideInRight 400ms cubic-bezier(0.23, 0.96, 0.09, 1.04) (delay +100ms)

- **Message spacing:** 12px between messages (tight, natural conversation)

#### Input + Button
- **Container:** Flex, gap 8px, border-top 1px rgba(255,255,255,0.08)
- **Input:**
  - Background: rgba(255, 255, 255, 0.04)
  - Border: 1px rgba(255, 255, 255, 0.08)
  - Border-radius: 8px
  - Padding: 12px 16px
  - Font: 14px, 400 weight
  - Focus: Border becomes rgba(255, 255, 255, 0.12), NO outline
  - Placeholder: rgba(255, 255, 255, 0.3)

- **Send Button:**
  - Background: Gradient (cyan → purple)
  - Size: 40×40px, icon centered
  - Border-radius: 8px
  - Cursor: pointer with transform scale(1.05) on hover
  - Transition: 150ms cubic-bezier(0.16, 1, 0.3, 1)

---

### 4. DESIGN PRINCIPLES SECTION — Teach Your Aesthetic

**Goal:** Explicitly show users what you're about. Make values visible.

#### Layout
- 4-column grid (2 columns on mobile)
- Equal-width cards

#### Each Principle Card
- **Title:** H4, 18px, 400 weight
- **Description:** 14px, 400 weight, rgba(255,255,255,0.62)
- **Border-left:** 2px solid #00d9ff (accent on left only, not all sides)
- **Padding:** 24px
- **Border-radius:** 12px
- **Background:** rgba(255, 255, 255, 0.02)

#### Card Content Examples
1. **Privacy First** — "No tracking, no exposure, no compromise."
2. **End-to-End Encrypted** — "Only you and recipients see your messages."
3. **Verified Conversations** — "Know who you're talking to, every time."
4. **Zero Knowledge Design** — "We can't read your data even if we tried."

#### Hover State (Principle Cards)
- Lift: translateY(-8px)
- Background: rgba(255, 255, 255, 0.04)
- Border-left: 3px solid #00d9ff (accent strengthens)
- Shadow: rgba(0, 217, 255, 0.08) 0 16px 32px
- Transition: 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

---

### 5. NAVIGATION BAR — Scroll-Aware, Refined

#### Structure
- Fixed to top, z-index 50
- Full width

#### Background (Scroll-Dependent)
- Initial: rgba(10, 10, 10, 0) + no backdrop blur
- Scrolled (scrollY > 100px): rgba(10, 10, 10, 0.8) + 12px backdrop blur
- Border-bottom: 1px rgba(255, 255, 255, 0.08)
- Transition: 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

#### Content
- Left: Logo / brand name, 14px, 500 weight, letter-spacing 0.08em
- Right: Navigation items (3-4 items max)
  - Font: 13px, 400 weight
  - Color: rgba(255, 255, 255, 0.7)
  - Hover: rgba(255, 255, 255, 1)
  - Transition: 150ms ease-in-out

#### Active State
- Underline: 1px solid #00d9ff
- Color: #f5f5f5

---

### 6. FOOTER & SPACING

#### Section Gaps (Breathing Room)
- Hero to Features: 120px gap (NOT cramped)
- Features to Chat: 120px gap
- Chat to Principles: 120px gap
- Principles to Footer: 100px gap
- **Key principle:** Whitespace = confidence. Cramped = cheap.

#### Footer
- Background: #0a0a0a
- Border-top: 1px rgba(255, 255, 255, 0.08)
- Padding: 60px top, 40px bottom
- Content:
  - Left: Brand name + year + small icon
  - Right: 3-4 links, 13px, 400 weight, rgba(255,255,255,0.5)
  - Hover links: rgba(255,255,255,0.8)

---

## ANIMATION TIMING HIERARCHY

**This is crucial for the stare-worthy feel.** Every animation has a reason.

### Entry Animations (When page/component appears)
- **Duration:** 600ms
- **Curve:** cubic-bezier(0.23, 0.96, 0.09, 1.04) — luxurious, spring-like
- **Applied to:** Hero elements, feature cards on first mount, chat messages
- **Stagger:** 100-150ms between elements
- **Type:** Opacity fade-in + slideUp

### Interaction Animations (Hover, click)
- **Duration:** 300ms
- **Curve:** cubic-bezier(0.25, 0.46, 0.45, 0.94) — refined precision
- **Applied to:** Button hovers, card lifts, navigation transitions
- **Type:** Transform (translateY, scale), no layout shift

### Micro-interactions (Immediate feedback)
- **Duration:** 150ms
- **Curve:** cubic-bezier(0.16, 1, 0.3, 1) — snappy, premium
- **Applied to:** Input focus, button press, icon change
- **Type:** Border color, background shift, icon swap

### Scroll Animations (Continuous, scroll-dependent)
- **Type:** Parallax (background elements move slower than scroll)
- **Offset:** -10px to 10px vertical
- **Navbar opacity:** scrollY / 300 (increases as user scrolls)
- **Applied to:** Hero background, nav blur

### Loops (Infinite, background)
- **Duration:** 20s
- **Curve:** ease-in-out
- **Applied to:** Floating shapes, data visualization bars
- **Type:** Float (vertical oscillation), rotation
- **Opacity:** 2-3% on floating elements (barely visible, hypnotic)

---

## COLOR PALETTE — Strategic Restraint

### Primary
- **Background:** #0a0a0a (refined dark, not pure black)
- **Text:** #f5f5f5 (soft white, readable)
- **Muted text:** rgba(255, 255, 255, 0.62)
- **Subtle text:** rgba(255, 255, 255, 0.40)
- **Ultra-subtle:** rgba(255, 255, 255, 0.30)

### Accent (Used Strategically)
- **Cyan:** #00d9ff (primary accent, active states, key moments only)
- **Purple:** #8b5ce6 (gradient complement, secondary moments)

### Surface Layers (Depth through transparency)
- **Surface 0:** rgba(255, 255, 255, 0.02)
- **Surface 1:** rgba(255, 255, 255, 0.04)
- **Surface 2:** rgba(255, 255, 255, 0.06)
- **Hover:** rgba(255, 255, 255, 0.08)

### Borders
- **Prominent:** rgba(255, 255, 255, 0.12)
- **Standard:** rgba(255, 255, 255, 0.08)
- **Subtle:** rgba(255, 255, 255, 0.04)

### Shadows (Soft, Never Harsh)
- **Card hover:** rgba(0, 217, 255, 0.1) 0 12px 32px
- **Overlay:** rgba(0, 0, 0, 0.3) 0 8px 24px (rare)
- **Max opacity:** Never exceed 15%

---

## TYPOGRAPHY SYSTEM

### Display (Headlines)
- **H1:** 72px / 300 weight / -0.03em tracking / 1.1 line-height
- **H2:** 48px / 300 weight / -0.025em tracking / 1.15 line-height
- **H3:** 32px / 300 weight / -0.02em tracking / 1.2 line-height

### UI (Labels, buttons)
- **H4:** 18px / 400 weight / -0.01em tracking / 1.4 line-height
- **Body:** 16px / 400 weight / 0em tracking / 1.6 line-height
- **Small:** 14px / 400 weight / 0.01em tracking / 1.5 line-height
- **Tiny:** 12px / 400 weight / 0.02em tracking / 1.4 line-height

### Mono (Data, Code, Crypto)
- **Use sparingly:** Only for wallet addresses, transaction IDs, API keys
- **Font:** Monospace (Monaco, SF Mono, or Courier New)
- **Size:** 12px
- **Color:** rgba(255, 255, 255, 0.7)

### Key Principles
- Never more than 3 font weights (300, 400, 500 max)
- Tracking (letter-spacing) on display (H1-H3) only
- Line-height decreases as size increases (visual balance)
- NO gradient text (tacky, unreadable)
- NO all-caps except small labels (PRIVACY, VERIFIED, etc.)

---

## ANTI-PATTERNS TO AVOID (Non-Negotiable)

❌ **DO NOT:**
1. Center everything horizontally
2. Use 3 equal-width feature cards (generic, overdone)
3. Add uniform border-radius everywhere
4. Use identical padding on all components
5. Apply default CSS easing (`ease`, `ease-in-out`)
6. Use multiple competing accent colors
7. Nest cards within cards
8. Use harsh shadows (>15% opacity)
9. Add gradient text on headings
10. Use vague, aspirational copy ("Build the future", "Scale without limits")
11. Uniform spacing between sections
12. Glassmorphism without structural reason

✅ **DO:**
1. Break the grid intentionally (asymmetry)
2. Use varied border-radius (8px, 10px, 12px, 16px, 20px per component role)
3. Vary padding strategically (12px, 16px, 24px, 32px, 48px)
4. Apply custom cubic-bezier curves
5. Use ONE accent color, used sparingly
6. Gradient overlays on backgrounds only
7. Specific copy tied to your product ("Private conversations", "No exposure")
8. Intentional spacing (120px gaps = breathing room)
9. Refined shadows (2-8% opacity, sometimes none)
10. Asymmetric hero + symmetric data grids
11. Whitespace as a design decision
12. Depth through backdrop blur + layered transparency

---

## RESPONSIVE BREAKPOINTS

### Mobile (320px - 640px)
- Hero: Stack into 1-column (text above visual)
- Features: 2+1 grid becomes 1-column stack
- Font sizes: clamp(24px, 6vw, 48px) for headlines
- Padding: 20px horizontal
- Tap targets: Minimum 44px height

### Tablet (641px - 1024px)
- Hero: Asymmetric 2-column maintained
- Features: 2+1 grid maintained with responsive proportions
- Font sizes: clamp(32px, 6vw, 56px)
- Padding: 40px horizontal

### Desktop (1025px+)
- Full 2-column hero
- Full 2+1 feature grid
- Maximum padding: 80px horizontal
- Max-width sections: 1280px

---

## STARE-WORTHY CHECKLIST

Before calling design complete, verify:

- [ ] Hero section has intentional asymmetry (not centered)
- [ ] Data visualization animated, not static
- [ ] Feature grid is 2+1, NOT 3 equal columns
- [ ] Every animation uses custom cubic-bezier (not `ease`)
- [ ] Color palette is monochromatic + ONE accent
- [ ] Typography uses light weights (300-400)
- [ ] Whitespace is generous (120px gaps)
- [ ] Cards have varied border-radius per role
- [ ] Shadows are soft (2-8% opacity) or nonexistent
- [ ] Copy is specific to Pigeon, not generic
- [ ] Scroll interactions visible (navbar blur, parallax)
- [ ] Hover states are smooth, refined, not snappy
- [ ] No competing colors, gradients are rare
- [ ] Mobile responsive verified (stack gracefully)
- [ ] Accessibility checked (color contrast, focus states)

---

## THE STARE-WORTHY MOMENT (Why This Matters)

Users stop and stare when:

1. **Asymmetry catches eye** — The hero isn't centered like every other SaaS site
2. **Animation has personality** — Not bouncy, not rigid, but intentional and smooth
3. **Whitespace communicates** — Generous gaps between sections signal confidence, not laziness
4. **Details align** — Typography, shadows, borders, colors all work together
5. **Color is restrained** — One accent used sparingly makes moments feel special
6. **Data visualization delights** — Animated metrics or visuals are engaging, not decorative
7. **Interactions feel premium** — Hovers are smooth, timing is custom, motion respects your eye

**The key:** Design so well that visitors don't consciously notice what makes it different — they just feel it. They pause. They stare. They save the screenshot.

---

## Implementation Notes for AI Design Tools

When using Claude, GPT, or your design tool:

1. **Share this entire prompt** as context
2. **Specify:** "Create a high-fidelity visual mockup showing [section]"
3. **Ask for:** Detailed component breakdowns with color hex, spacing (px), typography specs, animation curves
4. **Request:** Before/after hover states for every interactive element
5. **Verify:** Anti-patterns list is followed (no centered symmetry, no 3-column grids, etc.)
6. **Iterate:** Ask for 3 versions and pick the one that feels most intentional and premium

---

**This is your north star for stare-worthy design. Everything follows from these principles.**

