# Store Section Feature - Mobile Preview

## Overview
The store section in the mobile preview displays store locations as clickable cards. When a user clicks on any store card, a modal box appears showing the full store details including address, hours, and contact options.

## Features

### 1. Store Cards Display
- Horizontal scrollable list of store cards
- Each card shows:
  - Store image
  - Store name (text1)
  - Store location (text2)
- Clean, simple layout matching other collection items

### 2. Store Detail Modal
When clicking a store card, a centered modal box appears with:
- Semi-transparent backdrop (click to close)
- Store image at the top
- Store name and location
- Full address details
- Store hours with "Open Now" status
- Rating with stars and review count
- Action buttons: Call and Get Direction
- Close button at the bottom

## User Flow

1. User scrolls through store cards in the mobile preview
2. User clicks on a store card
3. Modal box slides up from center showing full store details
4. User can:
   - View complete address information
   - See store hours and status
   - Check ratings
   - Click Call or Direction buttons
   - Close modal by clicking backdrop or Close button

## Technical Implementation

### Components Modified
- **MobilePreview.tsx**
  - Removed banner and expanded list features
  - Simplified to just store cards + modal
  - Modal uses backdrop + centered box pattern
  - Single state: `selectedStore` (no expandedStore needed)

### State Management
- `selectedStore`: Controls modal visibility and content
- When null: modal hidden, normal view shown
- When set: modal appears with store details

### Styling
- Modal box: Centered, rounded corners, max 80% height
- Backdrop: Semi-transparent black overlay
- Responsive within phone preview frame
- Smooth transitions

## Usage

The feature works automatically when:
- Store sections are added to a page
- Stores are created in Store Manager
- Page is viewed in mobile preview

Click any store card to see full details!
