# STARE-WORTHY AI DESIGN PROMPT (Condensed for AI Tools)

Use this prompt with Claude, ChatGPT, Midjourney, or any AI design tool to generate ultra-high-fidelity mockups.

---

## SYSTEM CONTEXT

Generate **stare-worthy, jaw-dropping design mockups** for Pigeon (privacy-first messaging platform). Not generic SaaS design. Not AI slop. Premium, refined, intentionally crafted.

**What makes it stare-worthy:**
- Intentional asymmetry (2-column hero, 2+1 feature grid)
- Custom animation curves, refined motion
- Luxury restraint (one accent color, generous whitespace)
- Animated data visualization (not static mockups)
- Refined typography hierarchy (300-400 weight, tight tracking)
- Layered depth (blur + transparency, soft shadows)

---

## DESIGN BRIEF

**Direction:** Luxury/Refined Dark Minimalism  
**Aesthetic:** "Stripe dark mode meets premium fintech meets data visualization art"  
**Tone:** Confident, refined, sophisticated, NOT playful or corporate  
**Color Palette:** #0a0a0a dark base + #f5f5f5 text + #00d9ff cyan accent + #8b5ce6 purple (gradients only)  
**Typography:** Ultra-light display (300 weight, -0.03em tracking) + 400-weight body  
**Spacing:** Generous (120px section gaps, 48px card padding)  
**Density:** Spacious, breathing room everywhere  

---

## SECTION 1: HERO (THE ATTENTION-STOPPING MOMENT)

### Layout
- **2-column asymmetric grid**
  - Left (55%): Text + CTAs (OFFSET 20-30px lower than right for intentional misalignment)
  - Right (45%): Animated data visualization
- **Background:** #0a0a0a with subtle gradient (cyan rgba(0,217,255,0.08) to purple rgba(139,92,246,0.06))
- **Floating shapes:** 2-3 barely-visible circles (opacity 0.03) in background

### Headline (Left)
- Size: 72px
- Weight: 300 (ultra-light, luxury signal)
- Tracking: -0.03em
- Line-height: 1.1
- Color: #f5f5f5
- Max-width: 600px
- Copy: Specific, NOT marketing fluff (e.g., "Private conversations. No exposure." — not "Build the future")

### Subheadline (Left)
- Size: 18px
- Weight: 400
- Tracking: 0.01em
- Line-height: 1.6
- Color: rgba(255, 255, 255, 0.62)
- Specific benefits tied to Pigeon

### CTA Buttons (Left)
- **Primary:** Gradient button (cyan → purple), 48px height, 120px width, 8px border-radius, shadow glow on hover (rgba(0,217,255,0.3) 0 0 20px), lift on hover (translateY -4px), 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Secondary:** Outlined only, NO fill, border rgba(255,255,255,0.2), hover border rgba(255,255,255,0.4)

### Data Visualization (Right)
- **Type:** Animated bar chart or flow visualization showing privacy/security metrics
- **Content:** 5-7 animated bars with staggered animation (100ms between each)
- **Animation:** 
  - Entry: 600ms cubic-bezier(0.23, 0.96, 0.09, 1.04) (luxurious spring)
  - Loop: 20s ease-in-out (hypnotic, smooth)
  - Parallax on scroll: -10px to 10px vertical shift
- **Colors:** Use accent color (#00d9ff) with subtle transparency
- **Depth:** Semi-transparent gradient overlay, NO harsh shadows

### Scroll Indicator (Bottom)
- Animation: Bounce 2s infinite
- Color: rgba(255, 255, 255, 0.3)
- Size: Small, doesn't dominate
- Disappears on scroll

---

## SECTION 2: FEATURES (ASYMMETRIC GRID)

### Grid Structure
- **2+1 layout:**
  - Large featured card: 60% width, landscape ratio (400×300px)
  - Two small cards stacked: 40% width, each 48% of height, 4% gap between

### Featured Card (Left, Large)
- **Size:** 400×300px
- **Background:** Linear gradient 135deg, from rgba(0,217,255,0.08) to rgba(139,92,246,0.04)
- **Border:** 1px rgba(255,255,255,0.12)
- **Border-radius:** 16px
- **Padding:** 48px
- **Content:** Icon (32×32px, #00d9ff) + H3 (24px, 400 weight) + body text (16px, rgba(255,255,255,0.62)) + optional metric (24px bold, accent color)
- **Hover:** Lift (translateY -6px) + background opacity +4% + border rgba(255,255,255,0.20) + shadow (rgba(0,217,255,0.1) 0 12px 32px) + 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

### Small Cards (Right, Stacked)
- **Each:** 200×140px
- **Background:** rgba(255,255,255,0.03)
- **Border:** 1px rgba(255,255,255,0.08)
- **Border-radius:** 12px (smaller than featured, visual weight hierarchy)
- **Padding:** 24px
- **Content:** Icon (24×24px) + H4 (16px, 400 weight) + small text (13px, rgba(255,255,255,0.5))
- **Hover:** Border rgba(255,255,255,0.12) + lift (translateY -4px) + 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) + NO shadow (keeps refined feel)

### Section Spacing
- Top padding: 120px
- Bottom padding: 120px
- Card gap: 16px
- Horizontal margins: 80px desktop, 24px mobile

---

## SECTION 3: CHAT PREVIEW (PREMIUM DEPTH)

### Container
- **Background:** #0a0a0a with gradient overlay
- **Backdrop blur:** 20px (premium depth)
- **Border:** 1px rgba(255,255,255,0.12)
- **Border-radius:** 20px
- **Padding:** 32px
- **Max-width:** 800px, centered

### Header
- **Avatar:** 40×40px, #00d9ff placeholder
- **Name:** 16px, 500 weight, #f5f5f5
- **Status badge:** 12px, "Online" or "Verified", rgba(0,217,255,0.8)

### Messages
- **Incoming (Left):** rgba(255,255,255,0.06) bg + border-left 2px rgba(0,217,255,0.3) + padding 16px + border-radius 8px + animation slideInLeft 400ms cubic-bezier(0.23, 0.96, 0.09, 1.04)
- **Outgoing (Right):** rgba(0,217,255,0.12) bg + border-right 2px rgba(0,217,255,0.4) + padding 16px + border-radius 8px + animation slideInRight 400ms (delay +100ms)
- **Spacing between messages:** 12px (natural conversation)

### Input + Button
- **Input:** rgba(255,255,255,0.04) bg + border 1px rgba(255,255,255,0.08) + border-radius 8px + padding 12px 16px + font 14px 400 weight + focus border rgba(255,255,255,0.12) NO outline + placeholder rgba(255,255,255,0.3)
- **Send Button:** Gradient (cyan → purple) + 40×40px + border-radius 8px + icon centered + hover scale(1.05) + 150ms cubic-bezier(0.16, 1, 0.3, 1)

---

## SECTION 4: DESIGN PRINCIPLES

### Layout
- 4-column equal grid (2 columns mobile)

### Each Card
- **Border-left:** 2px solid #00d9ff (accent on left only, NOT all sides — luxury restraint)
- **Padding:** 24px
- **Border-radius:** 12px
- **Background:** rgba(255,255,255,0.02)
- **Content:** H4 (18px, 400 weight) + description (14px, rgba(255,255,255,0.62))
- **Hover:** Lift (translateY -8px) + background rgba(255,255,255,0.04) + border-left 3px #00d9ff (accent strengthens) + shadow (rgba(0,217,255,0.08) 0 16px 32px) + 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

### Example Principles
1. "Privacy First" — specific copy about no tracking
2. "End-to-End Encrypted" — specific technical promise
3. "Verified Conversations" — specific trust signal
4. "Zero Knowledge Design" — specific architecture benefit

---

## SECTION 5: NAVIGATION (SCROLL-AWARE)

### Structure
- Fixed to top, z-index 50, full width

### Background (Dynamic)
- Initial: rgba(10, 10, 10, 0) + no blur
- On scroll (scrollY > 100px): rgba(10, 10, 10, 0.8) + 12px backdrop blur + border-bottom 1px rgba(255,255,255,0.08)
- Transition: 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

### Content
- **Left:** Logo/brand name, 14px, 500 weight, letter-spacing 0.08em
- **Right:** Nav items (3-4 max), 13px, 400 weight, color rgba(255,255,255,0.7), hover rgba(255,255,255,1), transition 150ms ease-in-out
- **Active state:** Underline 1px #00d9ff

---

## ANIMATION TIMING SYSTEM

**Every animation must use custom cubic-bezier, NEVER default CSS ease.**

- **Entry animations:** 600ms cubic-bezier(0.23, 0.96, 0.09, 1.04) — staggered 100-150ms between elements
- **Interaction (hover/click):** 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Micro-interactions:** 150ms cubic-bezier(0.16, 1, 0.3, 1)
- **Scroll animations:** Parallax -10px to 10px, navbar opacity = scrollY/300
- **Infinite loops:** 20s ease-in-out on background elements

---

## COLOR PALETTE (Exact Hex Values)

| Element | Color | Use |
|---------|-------|-----|
| Background | #0a0a0a | Dark base, not pure black |
| Text primary | #f5f5f5 | Headlines, body text |
| Text secondary | rgba(255,255,255,0.62) | Subheadings, secondary info |
| Text tertiary | rgba(255,255,255,0.40) | Hints, disabled states |
| Text subtle | rgba(255,255,255,0.30) | Borders, very subtle elements |
| Accent primary | #00d9ff | Cyan, buttons, active states, sparse moments only |
| Accent secondary | #8b5ce6 | Purple, gradients, complementary moments |
| Surface 0 | rgba(255,255,255,0.02) | Ultra-subtle backgrounds |
| Surface 1 | rgba(255,255,255,0.04) | Card backgrounds |
| Surface 2 | rgba(255,255,255,0.06) | Hovered surfaces |
| Border prominent | rgba(255,255,255,0.12) | Active borders |
| Border standard | rgba(255,255,255,0.08) | Normal borders |
| Border subtle | rgba(255,255,255,0.04) | Barely visible dividers |

**Color Restraint Rule:** Never use more than 3 colors in one view. Monochromatic + single accent is the goal.

---

## TYPOGRAPHY (Exact Specs)

| Level | Size | Weight | Tracking | Line-height | Use |
|-------|------|--------|----------|-------------|-----|
| H1 | 72px | 300 | -0.03em | 1.1 | Main headline |
| H2 | 48px | 300 | -0.025em | 1.15 | Section headline |
| H3 | 32px | 300 | -0.02em | 1.2 | Subheading |
| H4 | 18px | 400 | -0.01em | 1.4 | Card title |
| Body | 16px | 400 | 0em | 1.6 | Paragraph text |
| Small | 14px | 400 | 0.01em | 1.5 | Labels, captions |
| Tiny | 12px | 400 | 0.02em | 1.4 | Small labels, meta |

**Typography Restraint:** Only 3 weights max (300, 400, 500). Tracking only on display (H1-H3). No gradient text.

---

## ANTI-PATTERNS (DO NOT INCLUDE)

❌ NO centered symmetry everywhere  
❌ NO 3-column equal feature grids  
❌ NO uniform border-radius  
❌ NO identical padding on all components  
❌ NO default CSS easing (ease, ease-in-out, etc.)  
❌ NO multiple competing accent colors  
❌ NO card nesting (container in container in container)  
❌ NO harsh shadows (max 15% opacity)  
❌ NO gradient text  
❌ NO vague copy ("Build the future", "Scale without limits")  
❌ NO pure black #000 or #000000  
❌ NO glassmorphism without structural reason  

---

## REQUIRED DETAILS FOR EACH MOCKUP

When generating mockups, ALWAYS include:

1. **Exact hex color values** for every element
2. **Pixel dimensions** for spacing, fonts, components
3. **Typography specs** (font size, weight, tracking, line-height)
4. **Animation details:** duration, curve (cubic-bezier), stagger if applicable
5. **Hover/active states** for every interactive element
6. **Shadow specs** if shadows are used (color, blur, offset, opacity)
7. **Border-radius** per component (NOT uniform)
8. **Mobile responsive** version (how it stacks at 375px)

---

## GENERATION REQUESTS

### For Hero Section
**Prompt:** "Generate a stare-worthy hero section for Pigeon privacy messaging platform. Use: 2-column asymmetric layout (text left 55%, data visualization right 45%), ultra-light typography (300 weight, -0.03em tracking), animated data bars (not static), gradient background (#00d9ff to #8b5ce6, subtle), custom animation curves (entry 600ms cubic-bezier(0.23,0.96,0.09,1.04)), luxury restraint aesthetic. Include before/after states and exact specs."

### For Feature Grid
**Prompt:** "Generate a 2+1 asymmetric feature grid (NOT 3 equal columns) for Pigeon. Large featured card 60% left (400×300px), two small cards 40% right stacked. Use refined cards with subtle gradients, accent border-left, hover lift effects (300ms cubic-bezier), luxury palette (#0a0a0a dark, #f5f5f5 text, #00d9ff accent). Include hover states and exact px dimensions."

### For Chat Preview
**Prompt:** "Generate premium chat preview with 20px backdrop blur, layered transparency, animated message entry, refined input + button. Use accent color strategically (border-left 2px on messages), staggered animations (slideInLeft/Right 400ms cubic-bezier(0.23,0.96,0.09,1.04)). Luxury depth through blur + transparency, not harsh shadows."

### For Full Page
**Prompt:** "Generate complete Pigeon landing page mockup: scrollable, asymmetric hero 2-column layout, 2+1 feature grid, chat preview with 20px blur, design principles section (4 cards with left accent border), scroll-aware navbar (dynamic backdrop blur + opacity). Use luxury/refined dark minimalism aesthetic, custom animation curves everywhere, 120px section gaps, generous whitespace. Include all interactive states and mobile responsive version."

---

## EVALUATION CHECKLIST

After generation, verify the design includes:

- [ ] Asymmetric hero (NOT centered)
- [ ] Animated data visualization (NOT static)
- [ ] 2+1 feature grid (NOT 3 equal)
- [ ] Custom cubic-bezier curves (NEVER default ease)
- [ ] Single accent color used strategically
- [ ] Refined typography (300-400 weight only)
- [ ] Generous whitespace (120px gaps)
- [ ] Soft shadows (2-15% opacity or none)
- [ ] Varied border-radius per component
- [ ] Luxury restraint evident throughout
- [ ] Specific copy tied to Pigeon (privacy, encryption, verification)
- [ ] Scroll-aware interactions (navbar blur, parallax)
- [ ] Mobile responsive mockup included
- [ ] Hover states for all interactive elements
- [ ] Exact hex colors and px dimensions provided

---

**This is production-ready specification. Share the full detailed prompt for maximum fidelity.**

