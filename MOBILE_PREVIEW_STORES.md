# Mobile Preview - Store Display

## Overview
The mobile preview now displays stores with a beautiful banner and card layout, matching the mobile app design.

## Features

### 1. Store Banner
When a STORE_SECTION is present in the page, the mobile preview shows:

- **Gradient Banner**: Purple → Pink → Red gradient background
- **Store Count**: Displays total number of stores (e.g., "5+ STORES")
- **Subtitle**: "ACROSS INDIA"
- **City Skyline**: Decorative building silhouettes in the background
- **Compact Design**: Optimized for mobile screen size

### 2. Store Cards
Below the banner, stores are displayed as horizontal scrollable cards:

- **Card Layout**: 
  - Square image (store photo)
  - Store name (text1)
  - Location/area (text2)
- **Styling**:
  - White background
  - Rounded corners
  - Border and shadow
  - 128px width
- **Scrollable**: Horizontal scroll for multiple stores

### 3. Section Title
Optional collection name displayed above the store cards (e.g., "Our Stores")

## How It Works

### Data Structure
Stores are defined in the page's collection groups:

```typescript
{
  style: 'STORE_SECTION',
  collections: [{
    style: 'STORE_COLLECTION',
    items: [
      {
        style: 'STORE_COLLECTION_ITEM',
        name: 'Mumbai Store',
        text1: 'Mumbai Store',
        text2: 'Andheri West',
        media: 'https://...'
      }
    ]
  }]
}
```

### Rendering Logic
The `renderGroup` function in MobilePreview checks for `STORE_SECTION`:

1. Detects STORE_SECTION style
2. Renders custom banner with store count
3. Displays collection name
4. Maps through items and renders store cards

## Visual Design

### Banner
- **Height**: 96px (p-6 padding)
- **Background**: `from-purple-600 via-pink-500 to-red-500`
- **Text**: White, centered
- **Title**: 3xl font size, bold
- **Subtitle**: sm font size, 90% opacity

### Store Cards
- **Width**: 128px (w-32)
- **Aspect Ratio**: 1:1 (square)
- **Border**: 1px gray-100
- **Shadow**: sm
- **Padding**: 8px (p-2)
- **Text**: 
  - Name: xs, bold, truncated
  - Location: 10px, gray-500, truncated

### Background Pattern
- **Buildings**: 8 white rectangles with varying heights
- **Opacity**: 10%
- **Position**: Bottom of banner
- **Heights**: 16px to 40px (randomized)

## Example Usage

To add stores to your page:

1. Go to Page Editor
2. Add a new Section with style "STORE_SECTION"
3. Add a Collection with style "STORE_COLLECTION"
4. Add Collection Items with:
   - Style: "STORE_COLLECTION_ITEM"
   - Name: Store identifier
   - text1: Display name
   - text2: Location/area
   - media: Store image URL

## Mobile Preview Display

The stores will appear in the mobile preview as:

```
┌─────────────────────────┐
│   5+ STORES             │
│   ACROSS INDIA          │
│   [city skyline]        │
└─────────────────────────┘

Our Stores

┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │
│────│ │────│ │────│ │────│
│Name│ │Name│ │Name│ │Name│
│Loc │ │Loc │ │Loc │ │Loc │
└────┘ └────┘ └────┘ └────┘
  ←  Scroll horizontally  →
```

## Integration with Store Manager

The stores shown in the mobile preview are:
- **Static**: Defined as collection items in the page
- **Editable**: Through the Page Editor interface
- **Separate**: From the Store Manager database

To show dynamic stores from the Store Manager in the mobile preview, you would need to:
1. Create an API endpoint to fetch stores
2. Modify the page rendering to include store data
3. Update the mobile preview to fetch and display real-time store data

## Benefits

1. **Visual Consistency**: Matches mobile app design
2. **Immediate Preview**: See how stores look on mobile
3. **Easy Testing**: Test different store layouts
4. **Professional Look**: Beautiful gradient banner
5. **Responsive**: Adapts to mobile screen size
