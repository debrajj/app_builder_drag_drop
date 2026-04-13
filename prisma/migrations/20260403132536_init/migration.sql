-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "reference" TEXT,
    "additionalData" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    "pageId" TEXT NOT NULL,

    CONSTRAINT "CollectionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "shopifyId" TEXT,
    "collectionType" TEXT,
    "isScrollable" BOOLEAN NOT NULL DEFAULT false,
    "style" TEXT NOT NULL,
    "horizontal" BOOLEAN NOT NULL DEFAULT false,
    "additionalData" TEXT,
    "navigation" TEXT,
    "image" TEXT,
    "column" INTEGER,
    "button" TEXT,
    "collectionFilters" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT,
    "text1" TEXT,
    "text2" TEXT,
    "text3" TEXT,
    "link" TEXT,
    "shopifyId" TEXT,
    "style" TEXT NOT NULL,
    "media" TEXT,
    "additionalData" TEXT,
    "reference" TEXT,
    "navigation" TEXT,
    "button" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSetting" (
    "id" TEXT NOT NULL,
    "offers" TEXT,
    "bestSellerTag" TEXT,
    "newArrivalTag" TEXT,
    "sellingFastTag" TEXT,
    "bigSaveBasedOnValue" TEXT,
    "productLabelTheme" TEXT,
    "wishlist" BOOLEAN NOT NULL DEFAULT true,
    "productDetailTag" TEXT,
    "tagPriority" TEXT,
    "sellingFastQTY" INTEGER,
    "appForceUpdateVersion" TEXT,
    "appNewVersion" TEXT,
    "androidForceUpdateVersion" TEXT,
    "androidNewVersion" TEXT,
    "iosForceUpdateVersion" TEXT,
    "iosNewVersion" TEXT,

    CONSTRAINT "GlobalSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalStyle" (
    "id" TEXT NOT NULL,
    "styleList" TEXT NOT NULL,

    CONSTRAINT "GlobalStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contactUs" TEXT,
    "direction" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "image" TEXT,
    "rating" DOUBLE PRECISION,
    "ratingUser" INTEGER,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "storePosition" INTEGER NOT NULL DEFAULT 0,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'published',

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "id" TEXT NOT NULL,
    "colorName" TEXT NOT NULL,
    "colorCode" TEXT,
    "imageUrl" TEXT,
    "imageName" TEXT,
    "colorType" TEXT NOT NULL DEFAULT 'Color',

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeShopPage" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "HomeShopPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "CollectionGroup" ADD CONSTRAINT "CollectionGroup_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CollectionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
