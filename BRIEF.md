# IRAPOA Website Build Brief

## Project
Community website for Indian River Aerodrome Property Owners Association (IRAPOA)
Domain: indianriveraerodrome.com

## Tech Stack
- **Framework:** Next.js 14 (App Router, static export)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (static deploy from GitHub)
- **Pattern:** Static site with client-side interactivity

## Site Structure & Pages

### 1. Home Page (/)
- Hero section with aerial/aviation imagery (use placeholder images from unsplash aviation)
- Welcome message about the community
- Quick links to key sections
- "Next Meeting" banner (May 12, 2026 at 6:00 PM)
- News/announcements section

### 2. About (/about)
- Airport info: FL74, Indian River Aerodrome, Vero Beach FL
- Runway: 17/35, 2,567 ft turf, 150 ft wide
- Location with embedded Google Map
- History of the aerodrome community
- Photo gallery placeholder

### 3. Board & Governance (/governance)
- Board of Directors listing:
  - President: Nick Easterling
  - Vice President: Mike Conway
  - Treasurer: Carole Ballough
  - Secretary: Joshua Pageau
  - Directors: Ray Dyson (Airport Manager), Brian Hayes, Lamberto Roscioli
- Attorney: Collins Brown Barkett, Chartered (Doug Vitunac)
- Governing documents section with download links
- Deed restrictions overview

### 4. Documents (/documents)
- Categorized document library with download buttons
- Categories:
  - Meeting Minutes (2025, 2026)
  - Agendas
  - Board Action Trackers
  - Governing Documents (Deed Restrictions, CC&Rs, Bylaws)
  - Annual Meeting Documents (Ballots, Budgets, Cover Letters)
  - Forms (BOD Certification, Email Consent, Sign-In Sheets)
  - Insurance Documents
  - Airport & Pilot Rules
- Search/filter by category and year
- PDF download links (files served from /public/docs/)

### 5. Meetings (/meetings)
- 2026 Meeting Schedule table:
  - Jan 14 - Special Meeting ✅
  - Jan 19 - Board Meeting ✅
  - Feb 16 - Board Meeting ✅
  - Mar 8 - Board Meeting ✅
  - Mar 25 - Special Meeting ✅
  - Apr 7 - Board Meeting ✅
  - May 12 - Board Meeting (UPCOMING)
- Past meeting minutes with download links
- Next meeting details prominently displayed
- Action items from recent meetings

### 6. Calendar (/calendar)
- Visual monthly calendar component
- Events: board meetings, annual meeting, maintenance, community events
- Color-coded by event type
- Upcoming events list sidebar

### 7. Community Directory (/directory)
- Password-protected page (simple client-side password gate, password: "fl74community")
- Resident listing with:
  - Name, Address (Nieuport Dr / Albatross Dr properties)
  - Phone, Email
  - Aircraft (if applicable)
- Searchable/filterable
- Note: Use placeholder data, Drake will populate later

### 8. Contact (/contact)
- Contact form (name, email, subject, message)
- Board contact info (general inquiries)
- HOA email: iraerodrome@gmail.com
- Embedded chat widget for quick questions
- Location/address info

## Design Guidelines
- **Theme:** Professional, aviation-inspired. Navy blue (#1B3A5C), sky blue (#4A90D9), white, warm gray
- **Logo:** Use text "IRAPOA" with small airplane icon for now (placeholder)
- **Typography:** Clean, modern. Inter or similar sans-serif
- **Mobile-first:** Residents will check this from phones at the airstrip
- **Footer:** Quick links, contact info, "Indian River Aerodrome · FL74 · Vero Beach, FL"
- **Aviation touches:** Subtle runway/compass/aviation motifs, not overwhelming

## Chat Widget
- Simple floating chat button (bottom-right)
- Opens a chat panel
- For now: static form that sends to iraerodrome@gmail.com (or stores in localStorage as demo)
- Can be upgraded to real-time later

## Vercel Config
```json
{
  "framework": "nextjs"
}
```

## Important Notes
- All document download links should point to /docs/[category]/[filename].pdf
- Create the /public/docs/ directory structure with placeholder README files explaining where to add real docs
- Calendar data should be easily editable (JSON or MDX file)
- Meeting data should be in a structured data file (easy to update)
- Directory data in a separate JSON file (easy to populate)
- Make all content easily editable by someone updating markdown/JSON files

## Deliverables
1. Complete Next.js project with all 8 pages
2. Responsive design (mobile-first)
3. Document library with category filtering
4. Calendar component
5. Password-protected directory
6. Chat widget
7. Contact form
8. vercel.json configured
9. README.md with setup/deploy instructions
10. All placeholder content clearly marked for easy replacement
