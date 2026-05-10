# Book Blog Platform - Design System Specification

## 1. Design Principles

- **Content-First**: Typography and readability are paramount
- **Clean & Modern**: Minimal distractions, focus on the writing
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG 2.1 AA compliance
- **Performance**: Fast loading, optimized images

---

## 2. Color System

### Light Mode

**Primary Palette**
- `--color-primary`: #2563eb (Blue 600) - CTAs, links, active states
- `--color-primary-hover`: #1d4ed8 (Blue 700)
- `--color-primary-light`: #dbeafe (Blue 100) - Backgrounds

**Neutral Palette**
- `--color-background`: #ffffff (White)
- `--color-surface`: #f9fafb (Gray 50) - Cards, secondary backgrounds
- `--color-border`: #e5e7eb (Gray 200)
- `--color-text-primary`: #111827 (Gray 900) - Headings, body text
- `--color-text-secondary`: #6b7280 (Gray 500) - Captions, metadata
- `--color-text-tertiary`: #9ca3af (Gray 400) - Placeholders

**Semantic Colors**
- `--color-success`: #10b981 (Green 500)
- `--color-warning`: #f59e0b (Amber 500)
- `--color-error`: #ef4444 (Red 500)
- `--color-info`: #3b82f6 (Blue 500)

**Accent Colors** (for categories/tags)
- `--color-accent-purple`: #8b5cf6
- `--color-accent-pink`: #ec4899
- `--color-accent-orange`: #f97316
- `--color-accent-teal`: #14b8a6

### Dark Mode

**Primary Palette**
- `--color-primary`: #3b82f6 (Blue 500)
- `--color-primary-hover`: #60a5fa (Blue 400)
- `--color-primary-light`: #1e3a8a (Blue 900)

**Neutral Palette**
- `--color-background`: #0f172a (Slate 900)
- `--color-surface`: #1e293b (Slate 800)
- `--color-border`: #334155 (Slate 700)
- `--color-text-primary`: #f1f5f9 (Slate 100)
- `--color-text-secondary`: #94a3b8 (Slate 400)
- `--color-text-tertiary`: #64748b (Slate 500)

---

## 3. Typography

### Font Families

**Display/Headings**: Inter or Geist Sans
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Body Text**: Inter or System UI
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Code/Monospace**: Fira Code or JetBrains Mono
```css
font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 48px (3rem) | 700 (Bold) | 1.2 | Page titles |
| **H2** | 36px (2.25rem) | 700 (Bold) | 1.3 | Section headings |
| **H3** | 30px (1.875rem) | 600 (Semibold) | 1.4 | Post titles (cards) |
| **H4** | 24px (1.5rem) | 600 (Semibold) | 1.4 | Subsections |
| **H5** | 20px (1.25rem) | 600 (Semibold) | 1.5 | Component titles |
| **H6** | 18px (1.125rem) | 600 (Semibold) | 1.5 | Small headings |
| **Body Large** | 18px (1.125rem) | 400 (Regular) | 1.7 | Post content, intros |
| **Body** | 16px (1rem) | 400 (Regular) | 1.6 | Standard text |
| **Body Small** | 14px (0.875rem) | 400 (Regular) | 1.5 | Captions, metadata |
| **Caption** | 12px (0.75rem) | 400 (Regular) | 1.4 | Timestamps, labels |

### Post Content Typography

- **Font Size**: 18px (1.125rem) - optimized for reading
- **Line Height**: 1.75 (31.5px)
- **Max Width**: 680px (65-75 characters per line)
- **Paragraph Spacing**: 1.5em

---

## 4. Spacing System

Use 8px base unit (0.5rem)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px (0.25rem) | Tight spacing |
| `sm` | 8px (0.5rem) | Button padding, small gaps |
| `md` | 16px (1rem) | Default gap, card padding |
| `lg` | 24px (1.5rem) | Section spacing |
| `xl` | 32px (2rem) | Large sections |
| `2xl` | 48px (3rem) | Page sections |
| `3xl` | 64px (4rem) | Hero sections |

---

## 5. Layout System

### Grid System
- **Max Container Width**: 1280px (80rem)
- **Gutter**: 24px (1.5rem)
- **Columns**: 12-column grid

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Page Layouts

**Standard Page**
```
┌────────────────────────────────────┐
│         Header (sticky)            │
├────────────────────────────────────┤
│                                    │
│         Main Content Area          │
│         (max-width: 1280px)        │
│                                    │
├────────────────────────────────────┤
│            Footer                  │
└────────────────────────────────────┘
```

**Blog Post Layout**
```
┌────────────────────────────────────┐
│         Header (sticky)            │
├────────────────────────────────────┤
│         Hero/Cover Image           │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │   Post Content                 │ │
│ │   (max-width: 680px, centered) │ │
│ │                                │ │
│ └────────────────────────────────┘ │
├────────────────────────────────────┤
│         Related Posts              │
├────────────────────────────────────┤
│            Footer                  │
└────────────────────────────────────┘
```

**Dashboard Layout (2-Column)**
```
┌─────────────┬──────────────────────┐
│  Sidebar    │   Main Content       │
│  (240px)    │   (flex-1)           │
│             │                      │
│  Nav Items  │   Dashboard Widgets  │
│             │                      │
└─────────────┴──────────────────────┘
```

---

## 6. Component Library

### Navigation Components

**1. Header/Navbar**
- Logo (left)
- Navigation links (center/left)
- Search bar (expandable on click)
- Dark mode toggle
- User menu (right)
- Sticky on scroll with shadow

**2. Footer**
- Logo + tagline
- Link columns (About, Categories, Legal)
- Social media icons
- Copyright

**3. Sidebar Navigation** (Dashboard/Admin)
- Collapsible on mobile
- Active state indicators
- Icon + label

### Content Components

**4. Post Card** (3 variants)
- **Featured**: Large image, title, excerpt, author, date, reading time, tags
- **Standard**: Medium image, title, excerpt, metadata
- **Compact**: Small thumbnail, title, metadata only

**5. Post Detail Components**
- Cover image (full-width or hero)
- Title + metadata bar (author avatar, name, date, reading time, views, likes)
- Content area (Markdown rendered)
- Tags list
- Like button (animated heart)
- Share buttons
- Author bio card
- Related posts section

**6. Category Badge**
- Colored background
- Small, rounded
- Different colors per category

**7. Tag Chip**
- Outlined style
- Clickable
- Hover state

### Form Components

**8. Input Field**
- Label (optional)
- Placeholder
- Focus state (border color change)
- Error state (red border + message)
- Helper text

**9. Textarea**
- Similar to input
- Auto-expanding option
- Character counter (optional)

**10. Button** (4 variants)
- **Primary**: Solid background, white text
- **Secondary**: Outlined
- **Ghost**: Text only
- **Danger**: Red for destructive actions
- **Sizes**: sm, md, lg

**11. Dropdown/Select**
- Native or custom styled
- Searchable (for multi-select)

**12. Checkbox/Radio**
- Custom styled
- Label position: right

**13. File Upload**
- Drag & drop zone
- Preview for images
- Progress indicator

### Feedback Components

**14. Toast Notification**
- Position: top-right
- Auto-dismiss (4s)
- Types: success, error, warning, info
- Icon + message + close button

**15. Modal/Dialog**
- Overlay background (dark with opacity)
- Centered content
- Close button (X)
- Sizes: sm, md, lg, full

**16. Loading States**
- Skeleton loaders (for cards, text)
- Spinner (for buttons, page loading)
- Progress bar (for uploads)

**17. Empty State**
- Illustration/icon
- Message
- CTA button

### Data Display Components

**18. Stats Card**
- Icon
- Number (large)
- Label
- Trend indicator (optional)

**19. Table** (Admin panel)
- Sortable columns
- Row actions (edit, delete)
- Pagination controls
- Responsive (cards on mobile)

**20. Pagination**
- Previous/Next buttons
- Page numbers (with ellipsis)
- "Showing X-Y of Z results"

**21. Avatar**
- Circular
- Sizes: xs, sm, md, lg
- Fallback (initials)

**22. Badge/Label**
- Status indicator (draft, published)
- Notification count

### Rich Text Editor Components

**23. Markdown Editor**
- Toolbar (bold, italic, heading, link, image, code, list)
- Split view (editor | preview)
- Full-screen mode
- Autosave indicator

---

## 7. Interaction Patterns

### Micro-interactions

**Like Animation**
- Heart icon scales up on click
- Color transition (gray → red)
- Particle effect (optional)

**Button Hover**
- Scale: 1.02
- Transition: 150ms ease

**Card Hover**
- Lift effect (shadow increase)
- Image zoom (subtle)

**Loading States**
- Skeleton pulse animation
- Spinner rotation

### Transitions

```css
/* Default transition */
transition: all 0.2s ease-in-out;

/* Page transitions */
transition: opacity 0.3s ease, transform 0.3s ease;

/* Modal entrance */
transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 8. Icons

**Icon Library**: Lucide React (or Heroicons)

**Common Icons**:
- Navigation: Menu, X (close), Search, User, Settings
- Actions: Edit, Trash, Plus, Check, ChevronDown
- Social: Heart, Share, Bookmark, Eye
- Content: Image, Link, Code, List, Bold, Italic
- Categories: Book, Tag, Folder, Calendar

**Icon Sizes**:
- Small: 16px
- Medium: 20px
- Large: 24px
- XL: 32px

---

## 9. Imagery Guidelines

### Post Cover Images
- **Aspect Ratio**: 16:9 or 21:9
- **Dimensions**: 1200x675px (min)
- **Format**: WebP (with JPEG fallback)
- **Optimization**: Lazy loading, blur-up effect

### Author Avatars
- **Size**: 40x40px (standard), 80x80px (profile)
- **Format**: WebP or JPEG
- **Fallback**: Initials on colored background

### Placeholder Images
- Use Unsplash or similar for demo content
- Categories: books, libraries, reading, writing

---

## 10. Page Wireframes

### 10.1 Home Page

```
┌──────────────────────────────────────────┐
│ Header [Logo | Nav | Search | User]     │
├──────────────────────────────────────────┤
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │     Featured Post (Hero)             │ │
│ │     [Large Image]                    │ │
│ │     [Title + Excerpt + Metadata]     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Latest Posts   [View All →]          │ │
│ ├──────────────────────────────────────┤ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐          │ │
│ │ │ Post │ │ Post │ │ Post │          │ │
│ │ │ Card │ │ Card │ │ Card │          │ │
│ │ └──────┘ └──────┘ └──────┘          │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐          │ │
│ │ │ Post │ │ Post │ │ Post │          │ │
│ │ └──────┘ └──────┘ └──────┘          │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Popular Categories                   │ │
│ │ [Fiction] [Non-Fiction] [Tech] ...   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Load More / Pagination]                 │
│                                          │
├──────────────────────────────────────────┤
│ Footer [Links | Social | Copyright]     │
└──────────────────────────────────────────┘
```

### 10.2 Post Detail Page

```
┌──────────────────────────────────────────┐
│ Header [Logo | Nav | Search | User]     │
├──────────────────────────────────────────┤
│                                          │
│     [Full-Width Cover Image]             │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│    ┌────────────────────────────────┐    │
│    │ [Category Badge]               │    │
│    │                                │    │
│    │ Post Title (H1)                │    │
│    │                                │    │
│    │ [Avatar] Author Name           │    │
│    │ Date • Reading time • 👁 Views │    │
│    │                                │    │
│    ├────────────────────────────────┤    │
│    │                                │    │
│    │ Post Content (Markdown)        │    │
│    │ - Paragraphs                   │    │
│    │ - Images                       │    │
│    │ - Code blocks                  │    │
│    │ - Lists                        │    │
│    │                                │    │
│    ├────────────────────────────────┤    │
│    │                                │    │
│    │ Tags: [tag1] [tag2] [tag3]     │    │
│    │                                │    │
│    │ [❤️ Like (42)] [Share]         │    │
│    │                                │    │
│    └────────────────────────────────┘    │
│                                          │
│    ┌────────────────────────────────┐    │
│    │ About the Author               │    │
│    │ [Avatar] [Bio] [Follow]        │    │
│    └────────────────────────────────┘    │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Related Posts                        │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐          │ │
│ │ │ Post │ │ Post │ │ Post │          │ │
│ │ └──────┘ └──────┘ └──────┘          │ │
│ └──────────────────────────────────────┘ │
│                                          │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 10.3 Category Page

```
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────────────────────────────────┤
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [Category Icon]                      │ │
│ │ Category Name (H1)                   │ │
│ │ Brief description...                 │ │
│ │                                      │ │
│ │ 42 posts                             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Filter: All | Most Recent | Popular]    │
│ [Search within category...]              │
│                                          │
│ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │ Post │ │ Post │ │ Post │              │
│ │ Card │ │ Card │ │ Card │              │
│ └──────┘ └──────┘ └──────┘              │
│ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │ Post │ │ Post │ │ Post │              │
│ └──────┘ └──────┘ └──────┘              │
│                                          │
│ [Pagination]                             │
│                                          │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 10.4 User Dashboard

```
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────────────────────────────────┤
│                                          │
│ My Dashboard                             │
│                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ 📝      │ │ ❤️      │ │ 👁      │     │
│ │ 12      │ │ 234     │ │ 1.2k    │     │
│ │ Posts   │ │ Likes   │ │ Views   │     │
│ └─────────┘ └─────────┘ └─────────┘     │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ My Posts    [+ New Post]             │ │
│ ├──────────────────────────────────────┤ │
│ │ [All | Published | Drafts]           │ │
│ ├──────────────────────────────────────┤ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ Post Title                       │ │ │
│ │ │ Status: Published • 142 views    │ │ │
│ │ │ [Edit] [Delete]                  │ │ │
│ │ └──────────────────────────────────┘ │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ Another Post                     │ │ │
│ │ │ Status: Draft                    │ │ │
│ │ │ [Edit] [Delete]                  │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│                                          │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 10.5 Admin Dashboard

```
┌─────────────┬────────────────────────────┐
│ SIDEBAR     │ MAIN CONTENT               │
├─────────────┼────────────────────────────┤
│             │                            │
│ Logo        │ Admin Dashboard            │
│             │                            │
│ ──────────  │ ┌──────┐ ┌──────┐ ┌──────┐│
│ 📊 Overview │ │ Total│ │ Total│ │ Active││
│ 📝 Posts    │ │ Posts│ │ Users│ │ Users ││
│ 👥 Users    │ │ 248  │ │ 1.2k │ │ 342  ││
│ 📁 Categories│ └──────┘ └──────┘ └──────┘│
│ 🏷️ Tags      │                            │
│             │ Recent Posts               │
│ ──────────  │ ┌────────────────────────┐ │
│ ⚙️ Settings  │ │ Post Title             │ │
│ 🚪 Logout    │ │ Author • Status • Date │ │
│             │ │ [Edit] [Delete]        │ │
│             │ └────────────────────────┘ │
│             │ ┌────────────────────────┐ │
│             │ │ Post Title             │ │
│             │ │ Author • Status • Date │ │
│             │ │ [Edit] [Delete]        │ │
│             │ └────────────────────────┘ │
│             │                            │
│             │ Popular Posts (This Week)  │
│             │ 1. Post Title (1.2k views) │
│             │ 2. Post Title (987 views)  │
│             │ 3. Post Title (834 views)  │
│             │                            │
└─────────────┴────────────────────────────┘
```

### 10.6 Post Editor

```
┌──────────────────────────────────────────┐
│ Header                   [Save] [Publish]│
├──────────────────────────────────────────┤
│                                          │
│ [Title field (H1 style)]                 │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Cover Image                          │ │
│ │ [Click to upload or drag & drop]     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Category: [Dropdown ▾]                   │
│ Tags: [tag1] [×] [tag2] [×] [+ Add]     │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Markdown Editor                      │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ B I H 🔗 📷 <> • ≡ 1. ⬜ |←→| │ │ │
│ │ ├──────────────────────────────────┤ │ │
│ │ │                                  │ │ │
│ │ │ # Start writing...               │ │ │
│ │ │                                  │ │ │
│ │ │                                  │ │ │
│ │ │                                  │ │ │
│ │ └──────────────────────────────────┘ │ │
│ │                                      │ │
│ │ [Edit] [Preview] [Split]             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Status: Draft ▾   [Save Draft] [Publish]│
│                                          │
└──────────────────────────────────────────┘
```

### 10.7 Authentication Pages

**Login**
```
┌──────────────────────────────────────────┐
│              [Logo]                      │
│                                          │
│         Welcome Back                     │
│     Sign in to your account              │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Email                                │ │
│ │ [                              ]     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Password                             │ │
│ │ [                              ] 👁   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [ ] Remember me    Forgot password?      │
│                                          │
│        [Sign In (button)]                │
│                                          │
│ Don't have an account? Sign up           │
│                                          │
└──────────────────────────────────────────┘
```

**Register**
```
┌──────────────────────────────────────────┐
│              [Logo]                      │
│                                          │
│      Create your account                 │
│    Join our community of writers         │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Full Name                            │ │
│ │ [                              ]     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Email                                │ │
│ │ [                              ]     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Password                             │ │
│ │ [                              ] 👁   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Confirm Password                     │ │
│ │ [                              ] 👁   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [ ] I agree to Terms & Privacy Policy    │
│                                          │
│        [Create Account (button)]         │
│                                          │
│ Already have an account? Sign in         │
│                                          │
└──────────────────────────────────────────┘
```

---

## 11. Responsive Behavior

### Mobile (<768px)
- Single column layout
- Hamburger menu
- Stacked post cards
- Simplified navigation
- Bottom navigation bar (optional)
- Full-width images

### Tablet (768px-1024px)
- 2-column post grid
- Side drawer navigation
- Condensed metadata

### Desktop (>1024px)
- 3-column post grid
- Full navigation bar
- Sidebar (for dashboards)
- Hover effects enabled

---

## 12. Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Alt text for all images
- [ ] ARIA labels for icons
- [ ] Skip to main content link
- [ ] Semantic HTML (header, nav, main, article, aside, footer)
- [ ] Form labels properly associated
- [ ] Error messages announced to screen readers

---

## 13. Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

**Optimization Strategies**:
- Image lazy loading
- Code splitting
- Font preloading
- CSS critical path
- Debounced search
- Optimistic UI updates

---

## 14. Implementation Priority

### Phase 1: Core Components
1. Design tokens (colors, typography, spacing)
2. Button, Input, Card components
3. Header, Footer, Layout
4. Post Card (all variants)

### Phase 2: Page Templates
1. Home page
2. Post detail page
3. Category page

### Phase 3: Advanced Features
1. User dashboard
2. Admin panel
3. Post editor
4. Authentication pages

### Phase 4: Polish
1. Animations & micro-interactions
2. Loading states
3. Empty states
4. Dark mode refinement

---

## 15. Design Tokens Export

**CSS Variables** (to be defined in `theme.css`):

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

## Next Steps

1. Review and approve this design system
2. Create reference designs in Figma (optional)
3. Begin implementation starting with Phase 1 components
4. Build a Storybook/component showcase (optional)

**Ready to move to implementation?** Let me know which phase you'd like to start with!
