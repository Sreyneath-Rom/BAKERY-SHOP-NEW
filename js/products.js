export const PRODUCTS = [
  // Breads & Pastries
  {
    id: 'croissant-classic',
    name: 'French Butter Croissant',
    category: 'pastry',
    price: 2.50,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Bestseller',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Folded with 100% French AOP butter over 72 hours for 81 delicate, flaky layers and a melt-in-your-mouth honeycomb interior.',
    sizes: [
      { label: 'Single', priceMultiplier: 1.0, value: 'Single' },
      { label: 'Box of 4 (-10%)', priceMultiplier: 3.6, value: 'Box of 4' }
    ]
  },
  {
    id: 'chocolate-pain',
    name: 'Pain au Chocolat',
    category: 'pastry',
    price: 3.50,
    rating: 4.9,
    reviewsCount: 118,
    badge: 'Chef Choice',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Golden laminated pastry rolled around double batons of 64% Valrhona dark chocolate, baked until caramelized.',
    sizes: [
      { label: 'Single', priceMultiplier: 1.0, value: 'Single' },
      { label: 'Box of 4', priceMultiplier: 3.6, value: 'Box of 4' }
    ]
  },
  {
    id: 'artisan-baguette',
    name: 'Tradition Sourdough Baguette',
    category: 'bread',
    price: 2.50,
    rating: 4.8,
    reviewsCount: 95,
    badge: 'Fresh Batch',
    dietary: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Naturally leavened with wild starter, stone-milled flour, and sea salt. Crisp blistered crust with airy crumb.',
    sizes: [
      { label: 'Standard Baguette', priceMultiplier: 1.0, value: 'Standard' },
      { label: 'Sliced with Butter Dip', priceMultiplier: 1.4, value: 'Sliced with Dip' }
    ]
  },
  {
    id: 'multigrain-loaf',
    name: 'Ancient Grain & Seed Loaf',
    category: 'bread',
    price: 2.40,
    rating: 4.7,
    reviewsCount: 68,
    badge: 'Healthy Choice',
    dietary: ['Vegan', 'High-Fiber'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Topped with toasted pumpkin seeds, golden flax, chia, and sunflower kernels. Rich in nutty flavor and fiber.',
    sizes: [
      { label: 'Whole Loaf (500g)', priceMultiplier: 1.0, value: 'Whole Loaf' },
      { label: 'Sliced (500g)', priceMultiplier: 1.0, value: 'Sliced' }
    ]
  },
  {
    id: 'fire-floss-bun',
    name: 'Spicy Pork Fire Floss Bun',
    category: 'bread',
    price: 2.50,
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Popular',
    dietary: [],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Soft Hokkaido milk bun glazed with egg cream sauce, coated generously in savory dried pork floss with chili flakes.',
    sizes: [
      { label: 'Single Bun', priceMultiplier: 1.0, value: 'Single' },
      { label: 'Pack of 3', priceMultiplier: 2.8, value: 'Pack of 3' }
    ]
  },
  {
    id: 'cheese-sausage-roll',
    name: 'Smoked Sausage & Cheddar Roll',
    category: 'bread',
    price: 2.50,
    rating: 4.8,
    reviewsCount: 74,
    badge: 'Warm Bake',
    dietary: [],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Smoked German sausage wrapped in pillowy brioche dough, topped with aged cheddar and garden parsley.',
    sizes: [
      { label: 'Single', priceMultiplier: 1.0, value: 'Single' }
    ]
  },
  {
    id: 'pillow-raisin-brioche',
    name: 'Pillow Raisin Brioche',
    category: 'bread',
    price: 2.50,
    rating: 4.7,
    reviewsCount: 52,
    badge: 'Sweet Bread',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Feather-light golden brioche swirled with rum-steeped California golden raisins and vanilla pearl sugar.',
    sizes: [
      { label: 'Standard', priceMultiplier: 1.0, value: 'Standard' }
    ]
  },
  {
    id: 'tuna-mayo-bun',
    name: 'Savory Tuna & Herb Bun',
    category: 'bread',
    price: 2.00,
    rating: 4.6,
    reviewsCount: 46,
    badge: 'Daily Fresh',
    dietary: ['Pescatarian'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Tender tuna filling with Japanese Kewpie mayonnaise, sweet corn, black pepper, and fresh dill.',
    sizes: [
      { label: 'Single', priceMultiplier: 1.0, value: 'Single' }
    ]
  },
  {
    id: 'an-pan-red-bean',
    name: 'Tokyo An Pan (Sweet Red Bean)',
    category: 'bread',
    price: 2.00,
    rating: 4.8,
    reviewsCount: 63,
    badge: 'Japanese Classic',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Silky Hokkaido Azuki red bean paste enveloped in ultra-soft bun dough, garnished with black sesame.',
    sizes: [
      { label: 'Single', priceMultiplier: 1.0, value: 'Single' }
    ]
  },

  // Cakes
  {
    id: 'chocolate-strawberry-cake',
    name: 'Chocolate Strawberry Truffle Cake',
    category: 'cake',
    price: 3.50,
    rating: 5.0,
    reviewsCount: 210,
    badge: 'Signature',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Layers of moist Belgian cocoa sponge filled with fresh Dalat strawberry compote and whipped dark chocolate ganache.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '6" Petite (4-6 ppl)', priceMultiplier: 6.0, value: '6" Petite' },
      { label: '8" Party (8-12 ppl)', priceMultiplier: 9.5, value: '8" Party' }
    ]
  },
  {
    id: 'stracciatella-maqui-cheesecake',
    name: 'Stracciatella & Wild Berry Cheesecake',
    category: 'cake',
    price: 3.50,
    rating: 4.9,
    reviewsCount: 165,
    badge: 'Bestseller',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'New York style slow-baked cream cheese speckled with dark chocolate flakes and layered with wild maqui berry coulis.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '6" Whole', priceMultiplier: 6.2, value: '6" Whole' },
      { label: '8" Whole', priceMultiplier: 9.8, value: '8" Whole' }
    ]
  },
  {
    id: 'black-velvet-cake',
    name: 'Midnight Black Velvet Cake',
    category: 'cake',
    price: 3.00,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Customer Fav',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Black cocoa infused velvet sponge with Madagascar vanilla bean cream cheese frosting and edible gold dusting.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '6" Whole', priceMultiplier: 5.5, value: '6" Whole' },
      { label: '8" Whole', priceMultiplier: 8.5, value: '8" Whole' }
    ]
  },
  {
    id: 'chocolate-orange-bliss',
    name: 'Chocolate Candied Orange Gateau',
    category: 'cake',
    price: 3.00,
    rating: 4.8,
    reviewsCount: 94,
    badge: 'New Season',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Dark orange liqueur-infused sponge layered with citrus curd, candied orange peel, and dark chocolate mirror glaze.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '8" Whole', priceMultiplier: 8.5, value: '8" Whole' }
    ]
  },
  {
    id: 'gluten-free-citrus',
    name: 'Gluten-Free Almond Lemon Drizzle',
    category: 'cake',
    price: 2.50,
    rating: 4.9,
    reviewsCount: 104,
    badge: 'Gluten Free',
    dietary: ['Gluten-Free', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Ground Spanish almond flour cake soaked in fresh organic lemon syrup, topped with toasted flaked almonds.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '8" Whole', priceMultiplier: 7.5, value: '8" Whole' }
    ]
  },
  {
    id: 'skinny-matcha-cake',
    name: 'Kyoto Ceremonial Matcha Chiffon',
    category: 'cake',
    price: 2.50,
    rating: 4.7,
    reviewsCount: 76,
    badge: 'Low Sugar',
    dietary: ['Vegetarian', 'Low-Sugar'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Ultra airy chiffon cake whisked with Uji matcha green tea and lightly sweetened coconut cream.',
    sizes: [
      { label: 'Slice', priceMultiplier: 1.0, value: 'Slice' },
      { label: '6" Whole', priceMultiplier: 5.5, value: '6" Whole' }
    ]
  },

  // Sandwiches & Savory Meals
  {
    id: 'tuna-avocado-sandwich',
    name: 'Seared Tuna & Avocado Brioche',
    category: 'sandwich',
    price: 2.50,
    rating: 4.8,
    reviewsCount: 82,
    badge: 'Bestseller',
    dietary: ['Pescatarian'],
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Tuna tossed with lime, red onions, and capers on toasted brioche with sliced ripe avocado and crisp romaine.',
    sizes: [
      { label: 'Regular', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Combo (+ Iced Drink)', priceMultiplier: 1.6, value: 'Combo' }
    ]
  },
  {
    id: 'sardine-egg-sandwich',
    name: 'Sardine & Farm Egg Salad Toast',
    category: 'sandwich',
    price: 2.00,
    rating: 4.7,
    reviewsCount: 44,
    badge: 'Chef Special',
    dietary: ['Pescatarian'],
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Mediterranean sardines and organic soft-boiled eggs with micro-greens, whole grain mustard, and lemon pepper.',
    sizes: [
      { label: 'Regular', priceMultiplier: 1.0, value: 'Regular' }
    ]
  },
  {
    id: 'ham-gruyere-croissant',
    name: 'Parisian Ham & Smoked Gruyère',
    category: 'sandwich',
    price: 2.50,
    rating: 4.9,
    reviewsCount: 130,
    badge: 'Popular',
    dietary: [],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Cured country ham, melted Swiss Gruyère cheese, and Dijon bechamel pressed inside our signature warm croissant.',
    sizes: [
      { label: 'Regular', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Combo (+ Drink)', priceMultiplier: 1.6, value: 'Combo' }
    ]
  },
  {
    id: 'cocktail-finger-sandwiches',
    name: 'Artisan Cocktail Canapé Trio',
    category: 'sandwich',
    price: 2.50,
    rating: 4.6,
    reviewsCount: 39,
    badge: 'Tea Time',
    dietary: ['Vegetarian-Option'],
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Selection of 3 delicate crustless finger sandwiches: Cucumber & Dill Cream, Smoked Salmon, and Egg Truffle.',
    sizes: [
      { label: 'Set of 3', priceMultiplier: 1.0, value: 'Set of 3' },
      { label: 'Party Platter (12 pcs)', priceMultiplier: 3.8, value: 'Party Platter' }
    ]
  },
  {
    id: 'artisan-burger-fries',
    name: 'Brioche Smash Burger & Truffle Wedges',
    category: 'sandwich',
    price: 3.50,
    rating: 4.9,
    reviewsCount: 156,
    badge: 'Hearty Meal',
    dietary: [],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Prime beef patty, melted aged Monterey jack, caramelized shallots, house secret sauce in a toasted sesame brioche bun.',
    sizes: [
      { label: 'Burger & Fries', priceMultiplier: 1.0, value: 'Standard' }
    ]
  },
  {
    id: 'multigrain-veggie-stack',
    name: 'Roasted Garden Veggie & Hummus Stack',
    category: 'sandwich',
    price: 2.20,
    rating: 4.8,
    reviewsCount: 71,
    badge: 'Vegan',
    dietary: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Grilled zucchini, roasted bell peppers, fresh baby spinach, and velvety garlic hummus on seeded multigrain bread.',
    sizes: [
      { label: 'Regular', priceMultiplier: 1.0, value: 'Regular' }
    ]
  },

  // Drinks & Beverages
  {
    id: 'iced-mondulkiri-coffee',
    name: 'Phnom Penh Iced Condensed Milk Coffee',
    category: 'drink',
    price: 1.50,
    rating: 4.9,
    reviewsCount: 220,
    badge: 'Local Favorite',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Slow-dripped dark roast Mondulkiri coffee beans stirred with sweet condensed milk over crystal crushed ice.',
    sizes: [
      { label: 'Regular (16oz)', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Large (22oz)', priceMultiplier: 1.33, value: 'Large' }
    ]
  },
  {
    id: 'strawberry-hibiscus-cooler',
    name: 'Fresh Strawberry Hibiscus Fizz',
    category: 'drink',
    price: 2.00,
    rating: 4.9,
    reviewsCount: 160,
    badge: 'Refreshing',
    dietary: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Muddled fresh strawberries, brewed ruby hibiscus tea, fresh mint leaves, sparkling soda, and a splash of lime.',
    sizes: [
      { label: 'Regular (16oz)', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Large (22oz)', priceMultiplier: 1.3, value: 'Large' }
    ]
  },
  {
    id: 'matcha-latte-iced',
    name: 'Iced Uji Matcha Cloud Latte',
    category: 'drink',
    price: 2.50,
    rating: 4.9,
    reviewsCount: 145,
    badge: 'Signature',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Ceremonial grade Japanese green tea layered over velvety fresh milk and topped with sweet cold foam.',
    sizes: [
      { label: 'Regular (16oz)', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Large with Oat Milk', priceMultiplier: 1.4, value: 'Large (Oat)' }
    ]
  },
  {
    id: 'passion-fruit-iced-tea',
    name: 'Tropical Passion Fruit Jasmine Tea',
    category: 'drink',
    price: 2.00,
    rating: 4.8,
    reviewsCount: 110,
    badge: 'Top Rated',
    dietary: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Fragrant jasmine green tea infused with tart passion fruit pulp, chia seeds, and wild honey.',
    sizes: [
      { label: 'Regular', priceMultiplier: 1.0, value: 'Regular' },
      { label: 'Large', priceMultiplier: 1.3, value: 'Large' }
    ]
  },
  {
    id: 'cappuccino-artisan',
    name: 'Velvet Flat White / Cappuccino',
    category: 'drink',
    price: 2.00,
    rating: 4.8,
    reviewsCount: 98,
    badge: 'Barista Choice',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Double shot of house espresso with micro-foamed whole milk and delicate latte art.',
    sizes: [
      { label: 'Hot (8oz)', priceMultiplier: 1.0, value: 'Hot' },
      { label: 'Iced (16oz)', priceMultiplier: 1.25, value: 'Iced' }
    ]
  },
  {
    id: 'pineapple-citrus-cooler',
    name: 'Sparkling Pineapple Basil Tonic',
    category: 'drink',
    price: 2.00,
    rating: 4.7,
    reviewsCount: 54,
    badge: 'Mocktail',
    dietary: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=700&h=500&q=85',
    description: 'Cold-pressed Kampot golden pineapple juice, muddled Thai sweet basil, and effervescent tonic water over ice.',
    sizes: [
      { label: 'Regular (16oz)', priceMultiplier: 1.0, value: 'Regular' }
    ]
  }
];

// Daily Set Combos
export const DAILY_SETS = [
  {
    id: 'morning-set',
    name: 'Morning Sunshine Set',
    category: 'combo',
    price: 3.80,
    originalPrice: 5.00,
    image: 'images/morning.png',
    items: ['Ham & Smoked Gruyère Croissant', 'Phnom Penh Iced Coffee'],
    badge: 'Save 24%',
    description: 'Start your morning with our warm Parisian croissant sandwich paired with rich Mondulkiri iced coffee.'
  },
  {
    id: 'afternoon-set',
    name: 'Afternoon Sweet Break',
    category: 'combo',
    price: 4.50,
    originalPrice: 5.50,
    image: 'images/afternoon.png',
    items: ['Strawberry Truffle Cake Slice', 'Fresh Strawberry Hibiscus Fizz'],
    badge: 'Save 18%',
    description: 'A little midday indulgence with our signature strawberry cake slice and chilled sparkling tea.'
  },
  {
    id: 'evening-set',
    name: 'Sunset Dinner Pairing',
    category: 'combo',
    price: 5.00,
    originalPrice: 6.50,
    image: 'images/evening.png',
    items: ['Brioche Smash Burger & Wedges', 'Sparkling Pineapple Basil Cooler'],
    badge: 'Save 23%',
    description: 'A warm, comforting artisan meal for two to share or an easy savory dinner after work.'
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}
