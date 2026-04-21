import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a Style Showcase Page with ALL styles
  const showcasePage = await prisma.page.create({
    data: {
      name: 'Style Showcase',
      slug: 'showcase',
      status: 'published',
      collectionGroups: {
        create: [
          // 1. Banner Section
          {
            name: 'Hero Banners',
            style: 'BANNER_SECTION',
            order: 0,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Featured Offers',
                  style: 'BANNER_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      {
                        name: 'Summer Sale',
                        text1: 'UP TO 50% OFF',
                        text2: 'Summer Collection 2026',
                        media: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                        style: 'BANNER_COLLECTION_ITEM',
                        status: 'published',
                        order: 0
                      },
                      {
                        name: 'New Arrivals',
                        text1: 'FRESH STYLES',
                        text2: 'Discover the latest trends',
                        media: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
                        style: 'BANNER_COLLECTION_ITEM',
                        status: 'published',
                        order: 1
                      },
                      {
                        name: 'Winter Collection',
                        text1: 'STAY WARM',
                        text2: 'Cozy essentials for cold days',
                        media: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
                        style: 'BANNER_COLLECTION_ITEM',
                        status: 'published',
                        order: 2
                      }
                    ]
                  }
                }
              ]
            }
          },
          // 2. Circular Categories
          {
            name: 'Categories',
            style: 'CIR_SECTION',
            order: 1,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Shop by Category',
                  style: 'CIR_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Men', media: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200', style: 'CIR_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Women', media: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200', style: 'CIR_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Kids', media: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200', style: 'CIR_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Accessories', media: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=200', style: 'CIR_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 3. Product Slider
          {
            name: 'New Arrivals',
            style: 'SLIDE_SECTION',
            order: 2,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Latest Products',
                  style: 'SLIDER_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Product 1', text1: 'Cool T-Shirt', text2: 'Premium Cotton', text3: '$29.99', media: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', style: 'SLIDER_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Product 2', text1: 'Denim Jeans', text2: 'Slim Fit', text3: '$49.99', media: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', style: 'SLIDER_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Product 3', text1: 'Sneakers', text2: 'Running Shoes', text3: '$79.99', media: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400', style: 'SLIDER_COLLECTION_ITEM', status: 'published', order: 2 },
                    ]
                  }
                }
              ]
            }
          },
          // 4. Image with Text
          {
            name: 'Featured Content',
            style: 'IMAGE_WITH_TEXT_SECTION',
            order: 3,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'About Our Brand',
                  style: 'IMAGE_WITH_TEXT_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { 
                        name: 'Quality First', 
                        text1: 'Premium Quality', 
                        text2: 'We source the finest materials for our products', 
                        text3: 'Learn More',
                        media: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 
                        style: 'IMAGE_WITH_TEXT_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 0 
                      },
                      { 
                        name: 'Sustainable', 
                        text1: 'Eco-Friendly', 
                        text2: 'Committed to sustainable fashion practices', 
                        text3: 'Read More',
                        media: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400', 
                        style: 'IMAGE_WITH_TEXT_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 1 
                      }
                    ]
                  }
                }
              ]
            }
          },
          // 5. Grid Products
          {
            name: 'Best Sellers',
            style: 'GRID_SECTION',
            order: 4,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Top Picks',
                  style: 'GRID_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { name: 'Item 1', text1: 'Hoodie', text2: 'Warm & Cozy', media: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', style: 'GRID_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Item 2', text1: 'Jacket', text2: 'Winter Collection', media: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', style: 'GRID_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Item 3', text1: 'Sweater', text2: 'Knitted', media: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', style: 'GRID_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Item 4', text1: 'Scarf', text2: 'Wool Blend', media: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400', style: 'GRID_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 6. Tab Items
          {
            name: 'Shop by Style',
            style: 'TAB_SECTION',
            order: 5,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Style Categories',
                  style: 'TAB_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Casual', style: 'TAB_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Formal', style: 'TAB_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Sports', style: 'TAB_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Party', style: 'TAB_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 7. Category Tabbing
          {
            name: 'Trending Categories',
            style: 'CATEGORY_SECTION',
            order: 6,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Popular Now',
                  style: 'CATEGORY_TABBING_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Dresses', media: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200', style: 'CATEGORY_TABBING_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Shoes', media: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200', style: 'CATEGORY_TABBING_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Bags', media: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', style: 'CATEGORY_TABBING_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Watches', media: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', style: 'CATEGORY_TABBING_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 8. Landing Page Banner
          {
            name: 'Special Offer',
            style: 'LANDING_BANNER_SECTION',
            order: 7,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Flash Sale',
                  style: 'LANDING_PAGE_BANNER_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      {
                        name: 'Flash Sale',
                        text1: 'Limited Time Offer',
                        text2: 'Get up to 70% off on selected items',
                        button: 'Shop Now',
                        media: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
                        style: 'LANDING_PAGE_BANNER_COLLECTION_ITEM',
                        status: 'published',
                        order: 0
                      }
                    ]
                  }
                }
              ]
            }
          },
          // 9. By Price
          {
            name: 'Shop by Price',
            style: 'BY_PRICE_SECTION',
            order: 8,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Price Ranges',
                  style: 'BY_PRICE_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Under $50', text1: 'Under $50', media: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', style: 'BY_PRICE_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: '$50 - $100', text1: '$50 - $100', media: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400', style: 'BY_PRICE_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: '$100 - $200', text1: '$100 - $200', media: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', style: 'BY_PRICE_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Above $200', text1: 'Above $200', media: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', style: 'BY_PRICE_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 10. By Occasion
          {
            name: 'Shop by Occasion',
            style: 'BY_OCCASION_SECTION',
            order: 9,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Special Events',
                  style: 'BY_OCCASION_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Wedding', text1: 'Wedding', media: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', style: 'BY_OCCASION_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Party', text1: 'Party', media: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', style: 'BY_OCCASION_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Office', text1: 'Office', media: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', style: 'BY_OCCASION_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Casual', text1: 'Casual', media: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', style: 'BY_OCCASION_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 11. Shop Look
          {
            name: 'Complete Looks',
            style: 'SHOP_LOOK_SECTION',
            order: 10,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Curated Outfits',
                  style: 'SHOP_LOOK_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Summer Vibes', text1: 'Summer Vibes', media: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', style: 'SHOP_LOOK_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Business Casual', text1: 'Business Casual', media: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400', style: 'SHOP_LOOK_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Street Style', text1: 'Street Style', media: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400', style: 'SHOP_LOOK_COLLECTION_ITEM', status: 'published', order: 2 },
                    ]
                  }
                }
              ]
            }
          },
          // 12. Top Products List
          {
            name: 'Trending Now',
            style: 'TOP_PRODUCTS_SECTION',
            order: 11,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Hot Items',
                  style: 'TOP_PRODUCTS_LIST_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { name: 'Product 1', text1: 'Leather Jacket', text2: 'Premium Quality', text3: '$199', media: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200', style: 'TOP_PRODUCTS_LIST_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Product 2', text1: 'Designer Bag', text2: 'Limited Edition', text3: '$299', media: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', style: 'TOP_PRODUCTS_LIST_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Product 3', text1: 'Smart Watch', text2: 'Latest Model', text3: '$399', media: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', style: 'TOP_PRODUCTS_LIST_COLLECTION_ITEM', status: 'published', order: 2 },
                    ]
                  }
                }
              ]
            }
          },
          // 13. TI Collection Items
          {
            name: 'Quick Links',
            style: 'TI_SECTION',
            order: 12,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Services',
                  style: 'TI_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'FREE SHIPPING', style: 'TI_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'EASY RETURNS', style: 'TI_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: '24/7 SUPPORT', style: 'TI_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'SECURE PAY', style: 'TI_COLLECTION_ITEM', status: 'published', order: 3 },
                    ]
                  }
                }
              ]
            }
          },
          // 14. Image with Text Breaker
          {
            name: 'Brand Story',
            style: 'IMAGE_TEXT_BREAKER_SECTION',
            order: 13,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Our Mission',
                  style: 'IMAGE_WITH_TEXT_BREAKER_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { 
                        name: 'Sustainability', 
                        text1: 'Eco-Friendly Fashion', 
                        text2: 'We believe in creating beautiful products while protecting our planet', 
                        media: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', 
                        style: 'IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 0 
                      }
                    ]
                  }
                }
              ]
            }
          },
          // 15. Video Collection
          {
            name: 'Featured Videos',
            style: 'VIDEO_SECTION',
            order: 14,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Behind the Scenes',
                  style: 'COLLECTION_VIDEO_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { 
                        name: 'Brand Story', 
                        text1: 'Watch Our Journey',
                        media: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
                        style: 'COLLECTION_VIDEO_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 0 
                      }
                    ]
                  }
                }
              ]
            }
          },
          // 16. CX Reviews
          {
            name: 'Customer Stories',
            style: 'CX_REVIEW_SECTION',
            order: 15,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Detailed Reviews',
                  style: 'CX_REVIEW_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Michael Chen', text1: 'Absolutely love the quality! The attention to detail is incredible. I have ordered multiple times and each time the products exceed my expectations. Highly recommend!', media: 'https://i.pravatar.cc/150?img=12', style: 'CX_REVIEW_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Jessica Williams', text1: 'Best online shopping experience ever! Fast delivery, great packaging, and the customer service team is super helpful. Will definitely shop again!', media: 'https://i.pravatar.cc/150?img=5', style: 'CX_REVIEW_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'David Kumar', text1: 'The products are worth every penny. Great fit, comfortable, and stylish. The sustainable approach is a big plus for me!', media: 'https://i.pravatar.cc/150?img=8', style: 'CX_REVIEW_COLLECTION_ITEM', status: 'published', order: 2 },
                    ]
                  }
                }
              ]
            }
          },
          // 17. Store/Category Cards
          {
            name: 'Shop by Store',
            style: 'STORE_SECTION',
            order: 16,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Our Stores',
                  style: 'STORE_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Mumbai Store', text1: 'Mumbai Store', text2: 'Andheri West', media: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', style: 'STORE_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'Delhi Store', text1: 'Delhi Store', text2: 'Connaught Place', media: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', style: 'STORE_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Bangalore Store', text1: 'Bangalore Store', text2: 'Indiranagar', media: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400', style: 'STORE_COLLECTION_ITEM', status: 'published', order: 2 },
                      { name: 'Pune Store', text1: 'Pune Store', text2: 'Koregaon Park', media: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400', style: 'STORE_COLLECTION_ITEM', status: 'published', order: 3 },
                      { name: 'Hyderabad Store', text1: 'Hyderabad Store', text2: 'Banjara Hills', media: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=400', style: 'STORE_COLLECTION_ITEM', status: 'published', order: 4 },
                    ]
                  }
                }
              ]
            }
          },
          // 18. Reviews
          {
            name: 'Customer Reviews',
            style: 'VOC_SECTION',
            order: 17,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'What Our Customers Say',
                  style: 'VOC_COLLECTION',
                  order: 0,
                  status: 'published',
                  horizontal: true,
                  items: {
                    create: [
                      { name: 'Sarah M.', text1: 'Amazing quality! The fabric is so soft and the fit is perfect. Will definitely order again!', media: 'https://i.pravatar.cc/150?img=1', style: 'VOC_COLLECTION_ITEM', status: 'published', order: 0 },
                      { name: 'John D.', text1: 'Fast shipping and great customer service. The products exceeded my expectations!', media: 'https://i.pravatar.cc/150?img=2', style: 'VOC_COLLECTION_ITEM', status: 'published', order: 1 },
                      { name: 'Emily R.', text1: 'Love the sustainable approach! Quality products that are good for the planet.', media: 'https://i.pravatar.cc/150?img=3', style: 'VOC_COLLECTION_ITEM', status: 'published', order: 2 },
                    ]
                  }
                }
              ]
            }
          },
          // 19. Footer
          {
            name: 'Footer Navigation',
            style: 'FOOTER_SECTION',
            order: 18,
            status: 'published',
            collections: {
              create: [
                {
                  name: 'Footer Content',
                  style: 'FOOTER_COLLECTION',
                  order: 0,
                  status: 'published',
                  items: {
                    create: [
                      { 
                        name: 'Company', 
                        text1: 'Home',
                        text2: 'Projects',
                        text3: 'About Us',
                        style: 'FOOTER_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 0 
                      },
                      { 
                        name: 'Connect', 
                        text1: 'WhatsApp',
                        text2: 'LinkedIn',
                        style: 'FOOTER_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 1 
                      },
                      { 
                        name: 'Contact', 
                        text1: '+91 9930303137',
                        text2: 'connect@thelongrun.in',
                        style: 'FOOTER_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 2 
                      },
                      { 
                        name: 'Legal', 
                        text1: 'Copyright © 2025 - 2026',
                        text2: 'Privacy Policy',
                        text3: 'Terms of Service',
                        style: 'FOOTER_COLLECTION_ITEM', 
                        status: 'published', 
                        order: 3 
                      },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Global Settings
  await prisma.globalSetting.create({
    data: {
      bestSellerTag: 'BEST SELLER',
      newArrivalTag: 'NEW',
      sellingFastTag: 'SELLING FAST',
      wishlist: true,
      androidNewVersion: '1.0.0',
      iosNewVersion: '1.0.0'
    }
  });

  // Global Styles
  await prisma.globalStyle.create({
    data: {
      styleList: JSON.stringify({
        PAGE: { backgroundColor: '#FFFFFF' },
        CIR_SECTION: { padding: '20px 0' },
        BANNER_SECTION: { margin: '0 0 20px 0' }
      })
    }
  });

  // Stores - Popular Cities
  await prisma.store.create({
    data: {
      name: 'Bangalore Tech Store',
      city: 'Bangalore',
      state: 'Karnataka',
      address: '45, 100 Feet Road, Indiranagar, Bangalore - 560038',
      contactUs: '+91 80 4567 1234',
      latitude: 12.9716,
      longitude: 77.5946,
      openingTime: '10:30 AM',
      closingTime: '9:30 PM',
      rating: 4.7,
      ratingUser: 1580,
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',
      storePosition: 0,
      isPopular: true,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Hyderabad Store',
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
      contactUs: '+91 40 2345 6789',
      latitude: 17.4065,
      longitude: 78.4772,
      openingTime: '10:00 AM',
      closingTime: '9:30 PM',
      rating: 4.6,
      ratingUser: 1320,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=600',
      storePosition: 1,
      isPopular: true,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Chennai Store',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Express Avenue Mall, Royapettah, Chennai - 600002',
      contactUs: '+91 44 2345 6789',
      latitude: 13.0827,
      longitude: 80.2707,
      openingTime: '10:00 AM',
      closingTime: '10:00 PM',
      rating: 4.5,
      ratingUser: 1150,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      storePosition: 2,
      isPopular: true,
      status: 'published'
    }
  });

  // Other Cities
  await prisma.store.create({
    data: {
      name: 'Mumbai Flagship Store',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Shop 101, Phoenix Mall, Lower Parel, Mumbai - 400013',
      contactUs: '+91 22 4567 8900',
      latitude: 19.0760,
      longitude: 72.8777,
      openingTime: '10:00 AM',
      closingTime: '10:00 PM',
      rating: 4.5,
      ratingUser: 1250,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      storePosition: 3,
      isPopular: false,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Pune Store',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Phoenix Market City, Viman Nagar, Pune - 411014',
      contactUs: '+91 20 2345 6789',
      latitude: 18.5204,
      longitude: 73.8567,
      openingTime: '10:00 AM',
      closingTime: '9:30 PM',
      rating: 4.4,
      ratingUser: 980,
      image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600',
      storePosition: 4,
      isPopular: false,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Delhi Central Store',
      city: 'Delhi',
      state: 'Delhi',
      address: 'F-23, Connaught Place, New Delhi - 110001',
      contactUs: '+91 11 2345 6789',
      latitude: 28.6139,
      longitude: 77.2090,
      openingTime: '10:00 AM',
      closingTime: '9:00 PM',
      rating: 4.3,
      ratingUser: 890,
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600',
      storePosition: 5,
      isPopular: false,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Ahmedabad Store',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Alpha One Mall, Vastrapur, Ahmedabad - 380015',
      contactUs: '+91 79 2345 6789',
      latitude: 23.0225,
      longitude: 72.5714,
      openingTime: '10:00 AM',
      closingTime: '9:30 PM',
      rating: 4.2,
      ratingUser: 750,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      storePosition: 6,
      isPopular: false,
      status: 'published'
    }
  });

  await prisma.store.create({
    data: {
      name: 'Kolkata Store',
      city: 'Kolkata',
      state: 'West Bengal',
      address: 'South City Mall, Prince Anwar Shah Road, Kolkata - 700068',
      contactUs: '+91 33 2345 6789',
      latitude: 22.5726,
      longitude: 88.3639,
      openingTime: '10:00 AM',
      closingTime: '9:30 PM',
      rating: 4.4,
      ratingUser: 1020,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      storePosition: 7,
      isPopular: false,
      status: 'published'
    }
  });

  // Product Colors
  await prisma.productColor.create({
    data: { colorName: 'Midnight Black', colorCode: '#000000', colorType: 'Color' }
  });
  await prisma.productColor.create({
    data: { colorName: 'Ocean Blue', colorCode: '#0000FF', colorType: 'Color' }
  });

  // Media Library - Demo Images
  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      name: 'store-interior-1.jpg',
      size: 245000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      name: 'fashion-banner-1.jpg',
      size: 312000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
      name: 'winter-collection.jpg',
      size: 289000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      name: 'product-tshirt.jpg',
      size: 156000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      name: 'product-jeans.jpg',
      size: 178000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
      name: 'product-sneakers.jpg',
      size: 198000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      name: 'product-hoodie.jpg',
      size: 167000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      name: 'product-jacket.jpg',
      size: 189000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://i.pravatar.cc/150?img=1',
      name: 'avatar-sarah.jpg',
      size: 12000,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://i.pravatar.cc/150?img=2',
      name: 'avatar-john.jpg',
      size: 11500,
      type: 'image/jpeg'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://i.pravatar.cc/150?img=3',
      name: 'avatar-emily.jpg',
      size: 13000,
      type: 'image/jpeg'
    }
  });

  // Demo Videos
  await prisma.media.create({
    data: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      name: 'brand-story-video.mp4',
      size: 5400000,
      type: 'video/mp4'
    }
  });

  await prisma.media.create({
    data: {
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      name: 'product-showcase.mp4',
      size: 4200000,
      type: 'video/mp4'
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
