Design a professional insurance website homepage with the following specifications:

Primary Color Scheme:
- Background: Light blue (#F5F8FF) for a trustworthy, professional appearance
- Header: Royal blue (#1E3A8A) to establish brand authority
- Navigation: Steel blue (#4B72B0) for clear hierarchy

Brand Elements:
- Insurance company logos/tiles: Deep maroon (#800020) for visual contrast
- Call-to-action buttons: Complementary blue (#2563EB)
- Text colors:
  - Headers: Dark blue (#1E3A8A)
  - Body text: Slate gray (#4A5568) for readability

Layout Guidelines:
- Use ample white space for clarity
- Maintain consistent padding (minimum 16px)
- Implement subtle shadows for depth
- Ensure WCAG 2.1 AA contrast compliance
- Apply gradients sparingly for visual interest

Interaction States:
- Hover effects: Lighten colors by 10%
- Active states: Darken colors by 10%
- Focus states: Add 2px blue outline (#2563EB)


Chat Box Layout Guidelines:

Positioning & Structure:
- Position chat box fixed in the lower right corner of the viewport (bottom: 20px, right: 20px)
- Floating Action Button (FAB): 64x64px with gradient background (#1976d2 to #1565c0)
- Chat popup: 420px width on desktop, 350px on mobile, 550px height
- Z-index: 1300 to ensure visibility above all content
- Use collapse animation with 300ms transition for smooth open/close

Visual Design:
- Container: White background with gradient overlay (#ffffff to #f8fafc)
- Border radius: 16px for modern appearance
- Box shadow: 0 12px 40px rgba(0, 0, 0, 0.15) for depth
- Border: 1px solid rgba(0, 0, 0, 0.08) for subtle definition

Header Styling:
- Background: Linear gradient (#1976d2 to #1565c0)
- Height: Auto with 16px vertical padding
- Title: "Insurance Assistant" with 1.1rem font size, 600 weight
- Avatar: 36x36px white background with blue bot icon
- Close button: White with hover effects and scale transform

Message Design:
- Message bubbles: Modern rounded corners (20px with 8px on sender side)
- User messages: Blue gradient background (#1976d2 to #1565c0) with white text
- Bot messages: White background with subtle border and dark text
- Avatars: 36x36px with gradient backgrounds and shadows
- Spacing: 16px between message groups, 8px internal padding
- Typography: 0.9rem body text, 0.75rem timestamps

Input Area:
- Background: Gradient from #f8fafc to #ffffff
- Border: 1px solid rgba(0, 0, 0, 0.08) at top
- Text field: White background, 12px border radius, blue focus states
- Send button: 40x40px gradient background with 12px radius
- Quick action chips: Outlined style with hover effects
- Padding: 16px all around

Animation & Interactions:
- FAB pulse animation when chat is closed (2s infinite)
- Hover effects: Scale transforms (1.05x) and enhanced shadows
- Smooth transitions: All elements use 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Transform origin: bottom right for natural opening animation
- Loading states: Circular progress indicator for bot responses

Scrolling & Accessibility:
- Custom scrollbar: 6px width with rounded thumb
- Auto-scroll to new messages
- WCAG 2.1 AA contrast compliance throughout
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader friendly markup

Responsive Behavior:
- Mobile: Reduce width to 350px, maintain aspect ratio
- Tablet: Adjust positioning to prevent edge overflow
- Desktop: Full 420px width with optimal positioning
- Touch targets: Minimum 44px for mobile accessibility

Message Features:
- Timestamps on all messages
- Error handling with alert components
- Multi-line input support (max 3 rows)
- Quick suggestion chips for common queries
- Real-time typing indicators (when applicable)
- Message status indicators (sent, delivered, read)
