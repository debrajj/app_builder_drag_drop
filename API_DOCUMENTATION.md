# App Builder API Documentation

Base URL: `https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder`

## Pages API

### Get All Pages
```
GET /api/pages
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Home Page",
    "slug": "home",
    "status": "published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "collectionGroups": []
  }
]
```

### Get Single Page
```
GET /api/pages/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Home Page",
  "slug": "home",
  "status": "published",
  "collectionGroups": [
    {
      "id": "uuid",
      "name": "Hero Section",
      "style": "HERO",
      "collections": []
    }
  ]
}
```

### Create Page
```
POST /api/pages
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Page",
  "slug": "new-page"
}
```

### Update Page
```
PUT /api/pages/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Page",
  "slug": "updated-page",
  "status": "published"
}
```

### Delete Page
```
DELETE /api/pages/:id
```

---

## Collection Groups API

### Create Collection Group
```
POST /api/collection-groups
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Hero Section",
  "style": "HERO",
  "pageId": "page-uuid",
  "order": 0,
  "backgroundImage": "https://example.com/image.jpg",
  "reference": "hero-ref",
  "additionalData": "{\"key\":\"value\"}"
}
```

### Update Collection Group
```
PUT /api/collection-groups/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Hero",
  "style": "HERO",
  "backgroundImage": "https://example.com/new-image.jpg",
  "status": "published",
  "order": 1
}
```

### Delete Collection Group
```
DELETE /api/collection-groups/:id
```

---

## Collections API

### Create Collection
```
POST /api/collections
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Featured Products",
  "style": "GRID",
  "groupId": "group-uuid",
  "order": 0,
  "link": "/products",
  "shopifyId": "shop-123",
  "collectionType": "Card",
  "isScrollable": true,
  "horizontal": false,
  "image": "https://example.com/collection.jpg",
  "column": 2,
  "button": "View All",
  "collectionFilters": "[{\"type\":\"category\",\"value\":\"electronics\"}]",
  "navigation": "{\"screenName\":\"ProductList\",\"searchString\":\"?category=electronics\"}",
  "additionalData": "{\"slideSeconds\":\"5\"}"
}
```

### Update Collection
```
PUT /api/collections/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Collection",
  "style": "SLIDER",
  "status": "published",
  "order": 1
}
```

### Delete Collection
```
DELETE /api/collections/:id
```

---

## Collection Items API

### Create Collection Item
```
POST /api/collection-items
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Product 1",
  "style": "CARD",
  "collectionId": "collection-uuid",
  "order": 0,
  "text1": "Product Title",
  "text2": "$99.99",
  "text3": "In Stock",
  "link": "/product/1",
  "shopifyId": "prod-123",
  "media": "https://example.com/product.jpg",
  "images": "[{\"url\":\"https://example.com/img1.jpg\"}]",
  "button": "Add to Cart",
  "navigation": "{\"screenName\":\"ProductDetail\",\"searchString\":\"?id=1\"}",
  "additionalData": "{\"discount\":\"20%\"}"
}
```

### Update Collection Item
```
PUT /api/collection-items/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product",
  "text1": "New Title",
  "text2": "$79.99",
  "status": "published",
  "order": 1
}
```

### Delete Collection Item
```
DELETE /api/collection-items/:id
```

---

## Global Settings API

### Get Global Settings
```
GET /api/global-settings
```

**Response:**
```json
{
  "id": "uuid",
  "offers": "Summer Sale",
  "bestSellerTag": "Best Seller",
  "newArrivalTag": "New",
  "sellingFastTag": "Selling Fast",
  "bigSaveBasedOnValue": "50",
  "productLabelTheme": "modern",
  "wishlist": true,
  "productDetailTag": "{\"tag\":\"value\"}",
  "tagPriority": "[\"bestSeller\",\"newArrival\"]",
  "sellingFastQTY": 10,
  "appForceUpdateVersion": "1.0.0",
  "appNewVersion": "1.1.0",
  "androidForceUpdateVersion": "1.0.0",
  "androidNewVersion": "1.1.0",
  "iosForceUpdateVersion": "1.0.0",
  "iosNewVersion": "1.1.0"
}
```

### Update Global Settings
```
POST /api/global-settings
Content-Type: application/json
```

**Request Body:**
```json
{
  "offers": "Winter Sale",
  "bestSellerTag": "Top Seller",
  "wishlist": true,
  "sellingFastQTY": 5
}
```

---

## Global Styles API

### Get Global Styles
```
GET /api/global-styles
```

**Response:**
```json
{
  "id": "uuid",
  "styleList": "{\"primaryColor\":\"#FF0000\",\"secondaryColor\":\"#00FF00\"}"
}
```

### Update Global Styles
```
POST /api/global-styles
Content-Type: application/json
```

**Request Body:**
```json
{
  "styleList": "{\"primaryColor\":\"#0000FF\",\"fontSize\":\"16px\"}"
}
```

---

## Stores API

### Get All Stores
```
GET /api/stores
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Main Store",
    "address": "123 Main St",
    "contactUs": "+1234567890",
    "direction": "Near Central Park",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York",
    "state": "NY",
    "image": "https://example.com/store.jpg",
    "rating": 4.5,
    "ratingUser": 100,
    "openingTime": "09:00",
    "closingTime": "21:00",
    "storePosition": 1,
    "isPopular": true,
    "status": "published"
  }
]
```

### Create Store
```
POST /api/stores
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Store",
  "address": "456 Oak Ave",
  "contactUs": "+9876543210",
  "city": "Los Angeles",
  "state": "CA",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "openingTime": "10:00",
  "closingTime": "20:00",
  "storePosition": 2,
  "isPopular": false,
  "status": "published"
}
```

### Update Store
```
PUT /api/stores/:id
Content-Type: application/json
```

### Delete Store
```
DELETE /api/stores/:id
```

---

## Product Colors API

### Get All Product Colors
```
GET /api/product-colors
```

**Response:**
```json
[
  {
    "id": "uuid",
    "colorName": "Red",
    "colorCode": "#FF0000",
    "imageUrl": "https://example.com/red.jpg",
    "imageName": "red.jpg",
    "colorType": "Color"
  }
]
```

### Create Product Color
```
POST /api/product-colors
Content-Type: application/json
```

**Request Body:**
```json
{
  "colorName": "Blue",
  "colorCode": "#0000FF",
  "imageUrl": "https://example.com/blue.jpg",
  "imageName": "blue.jpg",
  "colorType": "Color"
}
```

### Update Product Color
```
PUT /api/product-colors/:id
Content-Type: application/json
```

### Delete Product Color
```
DELETE /api/product-colors/:id
```

---

## Media API

### Get All Media
```
GET /api/media
```

**Response:**
```json
[
  {
    "id": "uuid",
    "url": "https://example.com/image.jpg",
    "name": "image.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Upload Media
```
POST /api/media
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com/new-image.jpg",
  "name": "new-image.jpg",
  "size": 2048000,
  "type": "image/png"
}
```

---

## App Build Data API (Middleware Format)

### Get Published App Data
```
GET /api/appbuild/data
```

Returns the first published page data in middleware format.

### Get Page Data by Slug
```
GET /api/:slug
```

Returns specific page data by slug name in middleware format.

**Examples:**
- `GET /api/showcase` - Returns showcase page data
- `GET /api/home` - Returns home page data  
- `GET /api/products` - Returns products page data

**Response:** Returns complete published page data in middleware format
```json
[
  {
    "id": null,
    "name": "Hero Section",
    "collection": null,
    "style": "HERO",
    "backgroundImage": "https://example.com/bg.jpg",
    "reference": "hero-ref",
    "status": false,
    "collections": [
      {
        "name": "Featured Products",
        "link": "/products",
        "shopifyId": "shop-123",
        "horizontal": false,
        "style": "GRID",
        "collectionType": {
          "id": null,
          "createdDate": null,
          "lastUpdate": null,
          "status": null,
          "name": "Card",
          "identifier": "SL"
        },
        "collectionItem": [
          {
            "name": "Product 1",
            "text1": "Title",
            "text2": "$99",
            "text3": "In Stock",
            "link": "/product/1",
            "shopifyId": "prod-123",
            "style": "CARD",
            "media": {
              "url": "https://example.com/product.jpg",
              "type": "image"
            },
            "images": [],
            "additionalData": {},
            "navigation": {
              "screenName": "",
              "searchString": ""
            }
          }
        ],
        "additionalData": null,
        "filters": [],
        "navigation": {
          "screenName": "",
          "searchString": ""
        },
        "image": null,
        "column": 1,
        "buttonTitle": "View All",
        "scrollable": false
      }
    ],
    "additionalData": null
  }
]
```

---

## Home & Shop Page API

### Get Home Shop Page
```
GET /api/home-shop-page
```

### Update Home Shop Page
```
POST /api/home-shop-page
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": "{\"homeConfig\":{},\"shopConfig\":{}}"
}
```

---

## Middleware Integration API

### Get Middleware Home Page Data
```
GET /api/middleware/home-page
```

Proxies to: `https://middleware.technoboost.in/api/v1/callback/static-page/webview-home-page`

---

## Example Usage

### JavaScript/Fetch
```javascript
// Get all pages
fetch('https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/pages')
  .then(res => res.json())
  .then(data => console.log(data));

// Create a new page
fetch('https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/pages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My New Page',
    slug: 'my-new-page'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### cURL
```bash
# Get all pages
curl https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/pages

# Create a page
curl -X POST https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/pages \
  -H "Content-Type: application/json" \
  -d '{"name":"New Page","slug":"new-page"}'

# Get app build data
curl https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/appbuild/data

# Get specific page by slug
curl https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/showcase
curl https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder/api/home
```

**Direct Port Access (if port 3002 is open):**
```bash
# Get showcase page
curl http://43.205.214.197:3002/api/showcase

# Get home page
curl http://43.205.214.197:3002/api/home
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are automatically generated
- JSON fields (additionalData, navigation, etc.) should be stringified JSON
- The `/api/appbuild/data` endpoint only returns published content
- Images and media URLs should be fully qualified (https://)
