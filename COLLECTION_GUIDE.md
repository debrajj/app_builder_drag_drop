# Collection Editor Guide

## Overview
The Collection Editor allows you to build dynamic app layouts using a hierarchical structure:
- **Pages** contain **Collection Groups** (Sections)
- **Collection Groups** contain **Collections** (Blocks)
- **Collections** contain **Collection Items** (Individual items)

## Collection Types Explained

### Collection Type Presets
- **SL** - Slider Collection: Horizontal scrolling items
- **STORE** - Store Collection: Shop categories and products
- **FOOTER** - Footer Collection: Navigation footer items
- **REC** - Recommended Collection: Product recommendations
- **VDO** - Video Collection: Video content display
- **CIR** - Circular Collection: Circular/round item display
- **TI** - Tab Items Collection: Tabbed content
- **GC** - Grid Collection: Grid layout items
- **RECENTLY_VIEWED** - Recently viewed products
- **VOC** - Voice of Customer (reviews/testimonials)

### Navigation Screen Types
- **ProductPageScreen** - Navigate to product detail page
- **ProductListWizzyScreen** - Navigate to product listing
- **ShopifyHandle** - Navigate using Shopify collection handle
- **StaticPage** - Navigate to static content page
- **WebViewScreen** - Open web view
- **Dynamic** - Dynamic navigation based on content

## Common Setup Patterns

### 1. Shop Categories (Men, Women, Kids, etc.)
```
Collection Group: "Shop Categories"
├── Style: SHOP_SECTION_HEADER_WITH_ICON
├── Collection: "Men"
│   ├── Style: STORE_COLLECTION
│   ├── Collection Type: STORE
│   ├── Navigation: ShopifyHandle
│   └── Search String: "men-collection"
├── Collection: "Women"
│   ├── Style: STORE_COLLECTION
│   ├── Collection Type: STORE
│   ├── Navigation: ShopifyHandle
│   └── Search String: "women-collection"
```

### 2. Footer Navigation
```
Collection Group: "Footer"
├── Style: FOOTER_SECTION
└── Collection: "Footer Nav"
    ├── Style: FOOTER_COLLECTION
    ├── Collection Type: FOOTER
    ├── Items: Home, Shop, Wishlist, Profile
    └── Each item has navigation screen + search string
```

### 3. Video Content
```
Collection Group: "Featured Videos"
├── Style: VIDEO_SECTION
└── Collection: "Product Videos"
    ├── Style: VIDEO_COLLECTION
    ├── Collection Type: VDO
    └── Items with video URLs in media field
```

## Collection Item Styles Explained

### Product Display Styles
- **REC_COLLECTION_ITEM** - Rectangular product cards with image, title, price, rating
- **SLIDER_COLLECTION_ITEM** - Similar to REC, used in horizontal sliders
- **GRID_COLLECTION_ITEM** - Grid layout product cards (2 columns)
- **STORE_COLLECTION_ITEM** - Store/category cards with square images
- **RECENTLY_VIEWED_COLLECTION_ITEM** - Recently viewed products
- **TOP_PRODUCTS_LIST_COLLECTION_ITEM** - List view with horizontal layout

### Banner & Media Styles
- **BANNER_COLLECTION_ITEM** - Full-width banner with text overlay
- **VIDEO_COLLECTION_ITEM** - Video player with controls
- **COLLECTION_VIDEO_COLLECTION_ITEM** - Dedicated video collection items
- **LANDING_PAGE_BANNER_COLLECTION_ITEM** - Landing page hero banners

### Category & Navigation Styles
- **CIR_COLLECTION_ITEM** - Circular category icons
- **TI_COLLECTION_ITEM** - Tab items with icons
- **TAB_COLLECTION_ITEM** - Tab navigation items
- **CATEGORY_TABBING_COLLECTION_ITEM** - Category tabs with images
- **CATEGORY_STYLE_COLLECTION_ITEM** - Category cards
- **CATEGORY_TAB_COLLECTION_ITEM** - Category navigation tabs
- **FOOTER_COLLECTION_ITEM** - Footer navigation items

### Content & Review Styles
- **VOC_COLLECTION_ITEM** - Voice of Customer (testimonials/reviews)
- **CX_REVIEW_COLLECTION_ITEM** - Customer experience reviews
- **IMAGE_WITH_TEXT_COLLECTION_ITEM** - Image with text description
- **IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM** - Section breaker with image and text

### Shopping & Discovery Styles
- **BY_PRICE_COLLECTION_ITEM** - Shop by price range cards
- **BY_OCCASION_COLLECTION_ITEM** - Shop by occasion cards
- **SHOP_LOOK_COLLECTION_ITEM** - Complete look/outfit cards
- **PRODUCTS_WITH_TABS_COLLECTION_ITEM** - Products with tab filters
- **PRODUCTS_WITHOUT_TABS_COLLECTION_ITEM** - Products without filters

## Auto-Sync Feature

When you change a Collection's Style, all items inside that collection will automatically update to use the matching item style. This means:

- Change Collection to `SLIDER_COLLECTION` → Items become `SLIDER_COLLECTION_ITEM`
- Change Collection to `GRID_COLLECTION` → Items become `GRID_COLLECTION_ITEM`
- Change Collection to `FOOTER_COLLECTION` → Items become `FOOTER_COLLECTION_ITEM`

You don't need to manually update each item's style anymore!

## Field Explanations

### Collection Fields
- **Name**: Display name for the collection
- **Style**: Visual style (affects rendering)
- **Status**: Draft (hidden) or Published (visible)
- **Collection Type**: Functional type (affects behavior)
- **Scrollable**: Enable horizontal scrolling
- **Horizontal**: Layout items horizontally
- **Columns**: Number of columns in grid layout
- **Link**: External link for the collection
- **Image**: Collection header/background image

### Navigation Fields
- **Screen Name**: Target screen type
- **Search String/ID**: Identifier for navigation (collection handle, product ID, etc.)

### Item Fields
- **Text 1**: Primary title/name
- **Text 2**: Subtitle/description
- **Text 3**: Price or additional info
- **Media URL**: Image or video URL
- **Link**: External link for the item

## Video URL Support
The system now supports various video formats:
- YouTube URLs (youtube.com, youtu.be)
- Vimeo URLs (vimeo.com)
- Direct video files (.mp4, .webm)
- Video URLs are automatically detected and displayed with video icons

## Troubleshooting

### Footer Not Showing
1. Create a Collection Group with style `FOOTER_SECTION`
2. Add a Collection with style `FOOTER_COLLECTION` and type `FOOTER`
3. Add Collection Items for each footer tab
4. Set status to "Published" for all elements

### Categories Not Working
1. Ensure Collection Type is set correctly (usually `STORE`)
2. Set proper Navigation Screen Name (usually `ShopifyHandle`)
3. Add correct Search String (collection handle or ID)
4. Verify all items are Published

### Videos Not Displaying
1. Check that Media URL is a valid video URL
2. Ensure the URL is accessible (not private)
3. For YouTube, use direct video URLs or embed URLs
4. Video detection is automatic based on URL patterns