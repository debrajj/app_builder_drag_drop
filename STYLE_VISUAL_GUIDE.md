# Visual Style Guide

## How Each Style Looks

### Banner Styles
**BANNER_COLLECTION_ITEM** 🖼️
```
┌─────────────────────────────┐
│                             │
│        [Full Image]         │
│                             │
│  Title Text (overlay)       │
│  Subtitle (overlay)         │
└─────────────────────────────┘
```
- Full-width image
- Text overlaid on bottom
- 16:9 aspect ratio

**LANDING_PAGE_BANNER_COLLECTION_ITEM** 🎯
```
┌─────────────────────────────┐
│                             │
│    [Hero Image + Gradient]  │
│                             │
│  Large Title (white)        │
│  Description (white)        │
│  [Button]                   │
└─────────────────────────────┘
```
- Hero banner with gradient overlay
- Call-to-action button
- 2:1 aspect ratio

### Image + Text Styles
**IMAGE_WITH_TEXT_COLLECTION_ITEM** 🖼️📝
```
┌─────────────────────────────┐
│ ┌────┐  Title Text          │
│ │Img │  Description text    │
│ └────┘  Price/Extra         │
└─────────────────────────────┘
```
- Image on LEFT, text on RIGHT
- Horizontal layout
- Square image thumbnail

**IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM** 🖼️📝
```
┌─────────────────────────────┐
│ ┌───┐  Bold Title           │
│ │Img│  Description          │
│ └───┘  (Colored background) │
└─────────────────────────────┘
```
- Similar to above but with gradient background
- Used as section divider

### Product Card Styles
**REC_COLLECTION_ITEM / SLIDER_COLLECTION_ITEM** 🛍️
```
┌──────────┐
│          │
│  [Image] │
│          │
├──────────┤
│ Title    │
│ Subtitle │
│ $99  ⭐4.5│
└──────────┘
```
- Vertical product card
- Image, title, price, rating
- 3:4 aspect ratio

**GRID_COLLECTION_ITEM** ▦
```
┌─────────┐ ┌─────────┐
│ [Image] │ │ [Image] │
│ Title   │ │ Title   │
│ Desc    │ │ Desc    │
└─────────┘ └─────────┘
```
- 2-column grid layout
- Square images
- Compact info

**STORE_COLLECTION_ITEM** 🏪
```
┌──────────┐
│          │
│  [Image] │
│          │
├──────────┤
│  Title   │
└──────────┘
```
- Square category card
- Simple title below
- Clean design

### Category Styles
**CIR_COLLECTION_ITEM** ⭕
```
  ┌───┐
  │ ○ │  Round icon
  └───┘
  Label
```
- Circular icon
- Label below
- Compact size

**CATEGORY_TABBING_COLLECTION_ITEM** 🏷️
```
┌────┐
│Img │  Rounded square
└────┘
Label
```
- Rounded square image
- Gradient border
- Category name below

**TAB_COLLECTION_ITEM** 📑
```
┌──────────┐
│ Tab Name │  Pill-shaped button
└──────────┘
```
- Pill-shaped tab
- Text only
- Navigation style

**TI_COLLECTION_ITEM** ⭐
```
┌───┐
│ ⭐ │  Icon in circle
└───┘
LABEL
```
- Icon in colored circle
- Uppercase label
- Compact design

### Video Styles
**VIDEO_COLLECTION_ITEM** 🎥
```
┌─────────────────────────────┐
│                             │
│    [Video Player]           │
│    ▶ Controls               │
│                             │
└─────────────────────────────┘
```
- Full video player
- Playback controls
- 16:9 aspect ratio

**COLLECTION_VIDEO_COLLECTION_ITEM** 🎬
```
┌─────────────────────────────┐
│    [Embedded Video]         │
│    YouTube/Vimeo player     │
└─────────────────────────────┘
```
- Embedded video player
- Supports YouTube, Vimeo
- Full controls

### Review Styles
**VOC_COLLECTION_ITEM** 💬
```
┌─────────────────────────────┐
│ ○ Name      ⭐⭐⭐⭐⭐        │
│ "Review text goes here..."  │
└─────────────────────────────┘
```
- Profile picture
- Star rating
- Review text

**CX_REVIEW_COLLECTION_ITEM** ⭐💬
```
┌─────────────────────────────┐
│ ┌─┐ Customer Name           │
│ │○│ ⭐⭐⭐⭐⭐                │
│ └─┘ "Detailed review..."    │
└─────────────────────────────┘
```
- Larger profile image
- Detailed review card
- More prominent

### Shopping Styles
**BY_PRICE_COLLECTION_ITEM** 💰
```
┌──────────┐
│          │
│  [Image] │
│  $50-100 │
└──────────┘
```
- Price range overlay
- Category image
- Gradient overlay

**BY_OCCASION_COLLECTION_ITEM** 🎉
```
┌──────────┐
│          │
│  [Image] │
│ Wedding  │
└──────────┘
```
- Occasion name overlay
- Themed image
- Gradient overlay

**SHOP_LOOK_COLLECTION_ITEM** 👗
```
┌──────────┐
│ COMPLETE │
│  LOOK    │
│  [Image] │
│          │
├──────────┤
│ Title    │
│ Shop → │
└──────────┘
```
- "Complete Look" badge
- Gradient footer
- Call-to-action

**TOP_PRODUCTS_LIST_COLLECTION_ITEM** 📋
```
┌─────────────────────────────┐
│ ┌───┐ Product Title         │
│ │Img│ Description            │
│ └───┘ $99          ⭐4.5    │
└─────────────────────────────┘
```
- Horizontal list layout
- Small square image
- Price and rating

### Footer Style
**FOOTER_COLLECTION_ITEM** 📍
```
  ⌂
 Home
```
- Icon above
- Label below
- Compact footer button

## Key Differences

### Banner vs Image+Text
- **Banner**: Image fills entire area, text overlaid
- **Image+Text**: Image on side, text beside it

### Product Card vs Grid
- **Product Card**: Vertical, detailed (price, rating)
- **Grid**: 2-column, compact

### Category vs Tab
- **Category**: Visual icon/image with label
- **Tab**: Text-only navigation button

### VOC vs CX Review
- **VOC**: Simple testimonial card
- **CX Review**: Detailed review with larger profile

### Video vs Collection Video
- **Video**: Direct video file player
- **Collection Video**: Embedded YouTube/Vimeo

## Tips for Choosing Styles

1. **For Hero Sections**: Use LANDING_PAGE_BANNER
2. **For Product Lists**: Use REC or SLIDER
3. **For Categories**: Use CATEGORY_TABBING or CIR
4. **For Content Blocks**: Use IMAGE_WITH_TEXT
5. **For Footer**: Use FOOTER_COLLECTION
6. **For Reviews**: Use VOC (simple) or CX_REVIEW (detailed)
7. **For Videos**: Use VIDEO (direct) or COLLECTION_VIDEO (embedded)
