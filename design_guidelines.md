# Training Management Application - Design Guidelines

## Design Approach: Design System (Data-Heavy Enterprise Application)

**Selected System**: Material Design / Carbon Design hybrid approach
**Rationale**: Information-dense productivity tool requiring efficient workflows, data management, and form handling. Focus on usability, consistency, and professional aesthetics over visual storytelling.

## Core Design Principles

1. **Efficiency First**: Minimize clicks, optimize for daily power users
2. **Information Clarity**: Clear data hierarchy, scannable layouts
3. **Workflow Optimization**: Streamlined processes from intake to invoicing
4. **Professional Aesthetic**: Clean, trustworthy, business-appropriate

---

## Typography System

**Font Stack**: Inter (Google Fonts) for all text
- **Headings**: 
  - Page titles: text-2xl font-semibold (24px)
  - Section headers: text-lg font-semibold (18px)
  - Card titles: text-base font-medium (16px)
- **Body Text**: text-sm (14px) - optimized for data-dense interfaces
- **Labels**: text-xs font-medium uppercase tracking-wide (12px)
- **Data/Metrics**: text-xl font-semibold for key numbers

---

## Layout System

**Spacing Units**: Tailwind scale - primarily use 4, 6, 8, 12, 16
- Component padding: p-6
- Section spacing: space-y-6
- Card gaps: gap-4
- Form field spacing: space-y-4
- Page margins: px-8 py-6

**Grid System**:
- Dashboard metrics: 4-column grid (grid-cols-4)
- Form layouts: 2-column on desktop (grid-cols-2), single on mobile
- Data tables: Full-width with horizontal scroll on mobile
- Sidebar navigation: 240px fixed width

---

## Application Structure

### Navigation
**Left Sidebar Navigation** (fixed, always visible):
- Logo/brand at top
- Primary navigation items with icons:
  - Dashboard
  - Clients
  - Proposals
  - Training Sessions
  - Curriculum Library
  - Evaluations
  - Invoices
  - Settings
- User profile at bottom

**Top Bar**:
- Breadcrumb navigation
- Search bar (center-aligned, w-96)
- Notification bell icon
- User avatar with dropdown

### Dashboard Layout
**Metrics Row**: 4-card horizontal layout showing:
- Active Clients count
- Pending Proposals count
- Upcoming Sessions count
- Monthly Revenue

**Primary Content Area**:
- Two-column split (2:1 ratio)
- Left: Upcoming sessions list (chronological)
- Right: Recent activity feed + Quick actions

**Pipeline Visualization**: Kanban-style board showing proposal stages

---

## Component Library

### Cards
- Elevated cards with subtle shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Padding: p-6
- White background with subtle border

### Forms
**Form Container**: max-w-3xl, card-style elevation
**Field Groups**: Two-column layout for related fields
**Input Fields**:
- Height: h-10
- Border: border with focus ring
- Rounded: rounded-md
- Label above input (required indicator with asterisk)

**Form Types Needed**:
- Client Intake Form (multi-step wizard)
- Proposal Builder (WYSIWYG editor + template selection)
- Session Creation (date/time picker, attendee multi-select)
- Evaluation Form (rating scales, text areas)
- Invoice Generator (line items table, calculations)

### Data Tables
- Striped rows (even row subtle background)
- Sortable column headers
- Row actions dropdown (3-dot menu)
- Pagination controls at bottom
- Filters above table (dropdowns, search)
- Checkbox selection for bulk actions

### Buttons
**Primary**: Filled background, medium weight font
**Secondary**: Outline style
**Sizes**: 
  - Default: px-4 py-2
  - Small: px-3 py-1.5 text-sm
  - Large: px-6 py-3
**Icons**: Left-aligned icon with text (gap-2)

### Status Badges
Pill-shaped badges for workflow states:
- Draft, Pending Approval, Approved, In Progress, Completed, Invoiced
- Small size: px-2 py-1 text-xs rounded-full

### Calendar/Scheduler
- Monthly grid view
- Day/Week/Month toggle
- Session blocks with time, client name, training topic
- Drag-to-reschedule capability indicated with cursor styling

### Modals/Dialogs
- Centered overlay with backdrop blur
- Max-width: max-w-2xl for forms, max-w-md for confirmations
- Header with title and close button
- Footer with action buttons (right-aligned)

---

## Page-Specific Layouts

### Client Management
- Master-detail layout
- Left: Searchable client list (names, companies)
- Right: Client detail panel with tabs (Overview, Training History, Contacts, Documents)

### Proposal Editor
- Split-screen layout
- Left: Form fields and outline builder
- Right: Live preview pane
- Floating toolbar for text formatting

### Training Session Detail
- Header with session title, date, status badge
- Three-column info grid: Participants, Curriculum, Logistics
- Tabs below: Agenda, Materials, Evaluations, Notes

### Invoice View
- Document-style layout (resembles printed invoice)
- Company header, client info, line items table
- Summary box with subtotal, tax, total
- Action buttons: Edit, Download PDF, Send, Mark Paid

---

## Icons
**Library**: Heroicons (outline style for navigation, solid for inline actions)

**Key Icons**:
- Dashboard: chart-bar
- Clients: users
- Proposals: document-text
- Sessions: calendar
- Curriculum: academic-cap
- Evaluations: clipboard-check
- Invoices: currency-dollar
- Add/Create: plus-circle
- Edit: pencil
- Delete: trash

---

## Accessibility
- All form inputs with explicit labels and ARIA attributes
- Keyboard navigation for all interactive elements (Tab order logical)
- Focus indicators clearly visible (ring-2 ring-offset-2)
- Sufficient contrast ratios (4.5:1 minimum for text)
- Table headers with proper scope attributes
- Modal dialogs trap focus and announce title

---

## Responsive Behavior
- Desktop-first design (primary users on desktop)
- Tablet (md): Collapsible sidebar, single-column forms
- Mobile (base): Bottom tab navigation, stacked layouts, simplified tables (card view)