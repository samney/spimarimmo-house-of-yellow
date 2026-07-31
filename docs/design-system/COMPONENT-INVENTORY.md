# Component Inventory — public site

Derived from DOM block classes (HOY-010) + captures (HOY-020). Each maps to a React component in the rebuild. Fidelity target: geometry within ~2px at every required viewport.

## Global
| Component | Reference evidence | Notes |
|---|---|---|
| `SiteHeader` | fixed, z-12; left nav (4 links), centered HOY mark, right socials + Connect pill | nav link = base text size; active link underlined |
| `ConnectPill` | yellow rounded CTA, repeated-text marquee (11 spans, 2 groups) | pill radius 6.897vw scale |
| `MobileNav` | `nav-open--mobile.png` | hamburger toggle; overlay menu z-98/100 |
| `WhatsAppButton` | sticky bottom-right, z-10, yellow circle | links to api.whatsapp.com |
| `CustomCursor` | z-20; labels Play/Video (5-span repeat); dark-section inversion | desktop only |
| `SiteFooter` | Office/Contact/Sitemap/Join-the-movement columns + copyright row + Cookies link | |
| `ConsentBanner` + `ConsentPreferences` | states captures; Complianz-equivalent behavior, z-99999/100000 | categories: functional, preferences, statistics, marketing |
| `PageTransition` | Swup-equivalent | |
| `VideoBlock` | native `<video>` muted/loop/playsinline, `playVideoOnScroll initVideoOnScroll`, poster, play/pause overlay | shared by all media sections |

## Home
`HeroVideo` (fullscreen), `WelcomeIntro` (editorial char-reveal), `StatementBlock`, `WhoAreWeYellow` (yellow section), `CtaRow` (Connect/Culture), `TheWorks` + `FeaturedProjectCard` ×3, `ClientLogoMarquee`, `BeyondTheScreen`, `MetricsCounters`, `HowWeRollSummary`, `ServiceNarratives` (video/photo/animation), `LetsConnectClosing`.

## Made by Yellow
`WorksHeader`, `ProjectFilters` (8 categories + `+ filter works` toggle + `Reset filters`), `ViewToggle` (Grid/List), `ProjectGrid` / `ProjectList`, `ProjectTile` (year, title, Views, Delivery time, hover-video), `WhoWeAreClosing` (`[ 01 ] Who we are` + Culture CTA).

## Project detail
`ProjectHeader` (`headerProjectBlock`), `ProjectStats` (`projectStatsBlock` — 4 animated counters), `ProjectTitleQuote`, `ProjectTwoImages` (variants: plain / `text` / `sqaures`→"squares"), `ProjectText` (The Client / The Process / The Project), `ProjectFullWidthLoop`, `ProjectCredits` ("Big thank you to:"), `ProjectRelated` (next-project nav).

## Culture
`CultureHeader`, `CultureItem` ×n (discipline blocks), `CultureQuote`, `CultureQuoteAnimation`, `CultureWork` (featured work — shared with Connect).

## How We Roll
`HowWeRollHeader`, `ProjectTwoImages` (shared), `HowWeRollTitle`, `HowWeRollTextItems`, `NumBlockIndex` (numbered phases), `HowWeRollDividerAnimation`, `CultureQuoteAnimation` (variant `howWeRoll removeDarkCursor`).

## Connect
`ConnectHeader` ("Your move…"), `WorldClocks` (Eindhoven/Dubai/Miami, live), `ContactDetails` (tel/mail/WhatsApp), `ContactForm` (name/email/message + validation/loading/success/error), `InstagramFeed`, `CultureWork` (shared), footer.

## Cookies
`PolicyDocument` (10 numbered sections), embedded `ConsentPreferences` widget.

## 404
Single viewport-height page (capture `404-reference-capture`); content per capture.
