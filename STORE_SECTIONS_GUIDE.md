# Store Sections Guide

## Overview
The Store Manager now supports organizing stores into sections for better categorization and display in your mobile app.

## Store Fields

### New Fields Added:
- `state`: The state/province where the store is located (e.g., "Karnataka", "Maharashtra")
- `isPopular`: Boolean flag to mark stores in popular cities
- `status`: Publication status ("published" or "draft")

### Existing Fields:
- `name`: Store name
- `city`: City name
- `address`: Full address
- `contactUs`: Contact phone number
- `direction`: Google Maps direction link
- `latitude` / `longitude`: GPS coordinates
- `openingTime` / `closingTime`: Store hours
- `rating` / `ratingUser`: Store ratings
- `image`: Store image URL
- `storePosition`: Display order

## Store Sections

### 1. Popular Cities
Stores marked with `isPopular: true` appear in the "Popular Cities" section. These are typically stores in major metropolitan areas that get the most traffic.

Example cities:
- Bangalore (Karnataka)
- Hyderabad (Telangana)
- Chennai (Tamil Nadu)

### 2. Other Cities
Stores with `isPopular: false` are grouped by state in the "Other Cities" section. This creates an organized hierarchy:

```
Other Cities
  ├─ Maharashtra
  │   ├─ Mumbai Flagship Store
  │   └─ Pune Phoenix
  ├─ Gujarat
  │   └─ Ahmedabad Alpha One
  └─ West Bengal
      └─ Kolkata South City
```

### 3. Draft Stores
Stores with `status: "draft"` appear in a separate "Drafts" section and won't be visible in the published app.

## Using the Store Manager

### Filter Tabs
- **ALL**: Shows all stores organized by sections
- **POPULAR**: Shows only popular city stores
- **OTHER**: Shows only non-popular city stores

### Visual Indicators
- ⭐ Star icon: Indicates a popular city store
- Store cards show: Name, City, and State

### Editing Stores
1. Click on any store card to edit
2. Update the following fields:
   - Store Name
   - City
   - State (for grouping)
   - Status (Published/Draft)
   - Popular City checkbox
   - Address
   - Contact details
   - Opening/Closing times
   - GPS coordinates

## Mobile App Display

In your mobile app, stores will be displayed as:

1. **Stores Near You** - Based on user's GPS location
2. **Popular Cities** - Grid of popular city stores with store count
3. **Other Cities** - Expandable list grouped by state

## Best Practices

1. **Popular Cities**: Mark only 3-5 major cities as popular
2. **State Names**: Use consistent state names (e.g., "Karnataka" not "KA")
3. **Store Position**: Use `storePosition` to control display order within sections
4. **Status**: Keep draft stores for testing before publishing
5. **GPS Coordinates**: Always include accurate lat/long for "Near You" feature

## API Endpoints

All store CRUD operations automatically handle the new fields:

- `GET /api/stores` - Fetch all stores
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

## Example Store Data

```json
{
  "name": "Bangalore Tech Store",
  "city": "Bangalore",
  "state": "Karnataka",
  "address": "45, 100 Feet Road, Indiranagar, Bangalore - 560038",
  "contactUs": "+91 80 4567 1234",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "openingTime": "10:30",
  "closingTime": "21:30",
  "rating": 4.7,
  "ratingUser": 1580,
  "isPopular": true,
  "status": "published",
  "storePosition": 0
}
```
