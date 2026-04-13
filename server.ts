import express from "express";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const BASE_PATH = process.env.BASE_PATH || '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: '50mb' }));
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

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// API Routes
app.get(`${BASE_PATH}/api/pages`, async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      include: { collectionGroups: { include: { collections: { include: { items: true } } } } },
      orderBy: { updatedAt: 'desc' }
    });
    console.log(`Fetched ${pages.length} pages from database`);
    res.json(Array.isArray(pages) ? pages : []);
  } catch (error: any) {
    console.error("Prisma Error in /api/pages:", error);
    res.status(500).json({ error: error.message, pages: [] });
  }
});

app.post("/api/pages", async (req, res) => {
  const { name, slug } = req.body;
  const page = await prisma.page.create({
    data: { name, slug: slug || name.toLowerCase().replace(/ /g, '-') }
  });
  res.json(page);
});

app.get("/api/pages/:id", async (req, res) => {
  const page = await prisma.page.findUnique({
    where: { id: req.params.id },
    include: { collectionGroups: { include: { collections: { include: { items: true } } } } }
  });
  res.json(page);
});

app.put("/api/pages/:id", async (req, res) => {
  const { name, slug, status } = req.body;
  const page = await prisma.page.update({
    where: { id: req.params.id },
    data: { name, slug, status }
  });
  res.json(page);
});

app.delete("/api/pages/:id", async (req, res) => {
  await prisma.page.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Collection Groups
app.post("/api/collection-groups", async (req, res) => {
  const { name, style, pageId, order } = req.body;
  const group = await prisma.collectionGroup.create({
    data: { name, style, pageId, order: order || 0 }
  });
  res.json(group);
});

app.put("/api/collection-groups/:id", async (req, res) => {
  const { name, style, backgroundImage, reference, additionalData, status, order } = req.body;
  const group = await prisma.collectionGroup.update({
    where: { id: req.params.id },
    data: { name, style, backgroundImage, reference, additionalData, status, order }
  });
  res.json(group);
});

app.delete("/api/collection-groups/:id", async (req, res) => {
  await prisma.collectionGroup.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Collections
app.post("/api/collections", async (req, res) => {
  const { name, style, groupId, order } = req.body;
  const collection = await prisma.collection.create({
    data: { name, style, groupId, order: order || 0 }
  });
  res.json(collection);
});

app.put("/api/collections/:id", async (req, res) => {
  const { name, link, shopifyId, collectionType, isScrollable, style, horizontal, additionalData, navigation, image, column, button, collectionFilters, status, order } = req.body;
  const collection = await prisma.collection.update({
    where: { id: req.params.id },
    data: { name, link, shopifyId, collectionType, isScrollable, style, horizontal, additionalData, navigation, image, column, button, collectionFilters, status, order }
  });
  res.json(collection);
});

app.delete("/api/collections/:id", async (req, res) => {
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Collection Items
app.post("/api/collection-items", async (req, res) => {
  const { name, style, collectionId, order } = req.body;
  const item = await prisma.collectionItem.create({
    data: { name, style, collectionId, order: order || 0 }
  });
  res.json(item);
});

app.put("/api/collection-items/:id", async (req, res) => {
  const { name, images, text1, text2, text3, link, shopifyId, style, media, additionalData, reference, navigation, button, status, order } = req.body;
  const item = await prisma.collectionItem.update({
    where: { id: req.params.id },
    data: { name, images, text1, text2, text3, link, shopifyId, style, media, additionalData, reference, navigation, button, status, order }
  });
  res.json(item);
});

app.delete("/api/collection-items/:id", async (req, res) => {
  await prisma.collectionItem.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Global Styles
app.get("/api/global-styles", async (req, res) => {
  try {
    const styles = await prisma.globalStyle.findFirst();
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch global styles" });
  }
});

app.post("/api/global-styles", async (req, res) => {
  try {
    const { styleList } = req.body;
    const existing = await prisma.globalStyle.findFirst();
    if (existing) {
      const updated = await prisma.globalStyle.update({
        where: { id: existing.id },
        data: { styleList }
      });
      return res.json(updated);
    }
    const created = await prisma.globalStyle.create({
      data: { styleList }
    });
    res.json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to update global styles" });
  }
});

// Global Settings
app.get("/api/global-settings", async (req, res) => {
  try {
    const settings = await prisma.globalSetting.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch global settings" });
  }
});

app.post("/api/global-settings", async (req, res) => {
  try {
    const existing = await prisma.globalSetting.findFirst();
    if (existing) {
      const updated = await prisma.globalSetting.update({
        where: { id: existing.id },
        data: req.body
      });
      return res.json(updated);
    }
    const created = await prisma.globalSetting.create({
      data: req.body
    });
    res.json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to update global settings" });
  }
});

// Stores
app.get("/api/stores", async (req, res) => {
  const stores = await prisma.store.findMany({ orderBy: { storePosition: 'asc' } });
  res.json(stores);
});

app.post("/api/stores", async (req, res) => {
  const store = await prisma.store.create({ data: req.body });
  res.json(store);
});

app.put("/api/stores/:id", async (req, res) => {
  const store = await prisma.store.update({ where: { id: req.params.id }, data: req.body });
  res.json(store);
});

app.delete("/api/stores/:id", async (req, res) => {
  await prisma.store.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Product Colors
app.get("/api/product-colors", async (req, res) => {
  const colors = await prisma.productColor.findMany();
  res.json(colors);
});

app.post("/api/product-colors", async (req, res) => {
  const color = await prisma.productColor.create({ data: req.body });
  res.json(color);
});

app.put("/api/product-colors/:id", async (req, res) => {
  const color = await prisma.productColor.update({ where: { id: req.params.id }, data: req.body });
  res.json(color);
});

app.delete("/api/product-colors/:id", async (req, res) => {
  await prisma.productColor.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Media
app.get("/api/media", async (req, res) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(media);
});

app.post("/api/media", async (req, res) => {
  const media = await prisma.media.create({ data: req.body });
  res.json(media);
});

app.get("/api/middleware/home-page", async (req, res) => {
  try {
    const response = await axios.get("https://middleware.technoboost.in/api/v1/callback/static-page/webview-home-page");
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Failed to fetch middleware data" });
  }
});

// App Build Data - Complete JSON export in middleware format
app.get("/api/appbuild/data", async (req, res) => {
  try {
    // Fetch the showcase page (or first published page)
    const page = await prisma.page.findFirst({
      where: { status: 'published' },
      include: { 
        collectionGroups: { 
          where: { status: 'published' },
          include: { 
            collections: { 
              where: { status: 'published' },
              include: { 
                items: {
                  where: { status: 'published' },
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            } 
          },
          orderBy: { order: 'asc' }
        } 
      }
    });

    if (!page) {
      return res.json([]);
    }

    // Transform to middleware format
    const middlewareFormat = page.collectionGroups.map(group => ({
      id: null,
      name: group.name || "null",
      collection: null,
      style: group.style,
      backgroundImage: group.backgroundImage || "null",
      reference: group.reference,
      status: false,
      collections: group.collections.map(collection => ({
        name: collection.name,
        link: collection.link || "null",
        shopifyId: collection.shopifyId || "null",
        horizontal: collection.horizontal,
        style: collection.style,
        collectionType: {
          id: null,
          createdDate: null,
          lastUpdate: null,
          status: null,
          name: collection.collectionType || "Card",
          identifier: collection.collectionType || "SL"
        },
        collectionItem: collection.items.map(item => ({
          name: item.name,
          text1: item.text1 || "null",
          text2: item.text2 || "null",
          text3: item.text3 || "null",
          link: item.link || "null",
          shopifyId: item.shopifyId || "null",
          style: item.style,
          media: {
            url: item.media || "",
            type: item.media ? (item.media.includes('youtube') || item.media.includes('vimeo') || item.media.endsWith('.mp4') ? "video" : "image") : ""
          },
          images: item.media ? [{
            name: item.media.split('/').pop() || "image.jpg",
            width: "800",
            height: "800",
            ext: ".jpg",
            url: item.media,
            formats: {
              large: { ext: ".jpg", url: item.media, size: 100, width: 800, height: 800 },
              small: { ext: ".jpg", url: item.media, size: 25, width: 400, height: 400 },
              medium: { ext: ".jpg", url: item.media, size: 50, width: 600, height: 600 },
              thumbnail: { ext: ".jpg", url: item.media, size: 10, width: 200, height: 200 }
            }
          }] : [],
          additionalData: item.additionalData ? JSON.parse(item.additionalData) : {},
          navigation: item.navigation ? JSON.parse(item.navigation) : { screenName: "", searchString: "" }
        })),
        additionalData: collection.additionalData ? JSON.parse(collection.additionalData) : (collection.style === "SLIDER_COLLECTION" ? { slideSeconds: "5" } : null),
        filters: collection.collectionFilters ? JSON.parse(collection.collectionFilters) : [],
        navigation: collection.navigation ? JSON.parse(collection.navigation) : { screenName: "", searchString: "" },
        image: collection.image,
        column: collection.column || 1,
        buttonTitle: collection.button || "null",
        scrollable: collection.isScrollable
      })),
      additionalData: group.additionalData ? JSON.parse(group.additionalData) : null
    }));

    res.json(middlewareFormat);
  } catch (error: any) {
    console.error("Error fetching app build data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Home & Shop Page
app.get("/api/home-shop-page", async (req, res) => {
  const page = await prisma.homeShopPage.findFirst();
  res.json(page);
});

app.post("/api/home-shop-page", async (req, res) => {
  const existing = await prisma.homeShopPage.findFirst();
  if (existing) {
    const updated = await prisma.homeShopPage.update({
      where: { id: existing.id },
      data: req.body
    });
    return res.json(updated);
  }
  const created = await prisma.homeShopPage.create({
    data: req.body
  });
  res.json(created);
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
