# Image Loading Issue - Solution

## Problem
Images are not showing on the deployed site (same as localhost).

## Root Cause
Images are stored as external URLs in the database. When the frontend tries to load these images, they may fail due to:
1. **CORS (Cross-Origin Resource Sharing)** - External image URLs blocked by browser
2. **Invalid URLs** - URLs stored in database may be broken or incomplete
3. **Mixed Content** - HTTPS site trying to load HTTP images
4. **Image Proxy Missing** - No image proxy/cache layer

## Solutions

### Option 1: Add Image Proxy Endpoint (Recommended)
Add this to `server.ts` to proxy external images:

```typescript
// Image proxy endpoint
app.get("/api/proxy-image", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter required' });
    }
    
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    res.set('Content-Type', response.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(response.data);
  } catch (error: any) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({ error: 'Failed to load image' });
  }
});
```

Then update `MobilePreview.tsx` to use the proxy:

```typescript
const getProxiedImageUrl = (url: string) => {
  if (!url) return '';
  // If already a proxy URL, return as-is
  if (url.includes('/api/proxy-image')) return url;
  // Convert to proxy URL
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
};

// In renderItem function, replace all image src attributes:
// OLD: src={item.media}
// NEW: src={getProxiedImageUrl(item.media)}
```

### Option 2: Enable CORS for Image URLs
Update the CORS middleware in `server.ts`:

```typescript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowAnyOrigin = ALLOWED_ORIGINS.includes('*');
  const originAllowed = !!origin && ALLOWED_ORIGINS.includes(origin);

  if (allowAnyOrigin) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (originAllowed) {
    res.header('Access-Control-Allow-Origin', origin!);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
```

### Option 3: Upload Images to Media Library
Instead of using external URLs:
1. Go to Media Library in the app
2. Upload images directly
3. Use the uploaded image URLs in your pages

## Quick Fix for Testing
To test if images work, use a public image URL:
- `https://via.placeholder.com/400x300?text=Test`
- `https://picsum.photos/400/300`

## Implementation Steps

1. **Add image proxy endpoint** to `server.ts`
2. **Update MobilePreview.tsx** to use proxy URLs
3. **Test with sample images**
4. **Deploy and verify**

## Files to Modify
- `server.ts` - Add proxy endpoint
- `src/components/MobilePreview.tsx` - Use proxy URLs
- `.env` - Add `IMAGE_PROXY_ENABLED=true` if needed

---
**Status**: Ready to implement
**Priority**: High
**Estimated Time**: 15 minutes
