import { CollectionItem, BlogPost } from './types';

export const sampleCollection: CollectionItem[] = [
  { id: 'thobe', title: 'Thobe / Jubba', type: 'men', desc: 'Classic long robe, perfect for formal and everyday wear. Available in a range of elegant colors and luxurious fabrics.', imgUrl: 'https://picsum.photos/400/300?random=1' },
  { id: 'kurta', title: 'Kurta Shalwar', type: 'men', desc: 'Comfortable two-piece outfit with refined details, ideal for casual gatherings or festive occasions.', imgUrl: 'https://picsum.photos/400/300?random=2' },
  { id: 'abaya', title: 'Abaya', type: 'women', desc: 'Flowing elegance with modern tailoring, offering both modesty and contemporary style. Custom embroidery options available.', imgUrl: 'https://picsum.photos/400/300?random=3' },
  { id: 'jilbab', title: 'Jilbab', type: 'women', desc: 'Modest, comfortable, and graceful outer garment, designed for daily wear with a focus on ease and coverage.', imgUrl: 'https://picsum.photos/400/300?random=4' },
  { id: 'kaftan', title: 'Kaftan', type: 'women', desc: 'Loose, flowing tunic-style dress, perfect for comfort and elegance. Can be dressed up or down for any occasion.', imgUrl: 'https://picsum.photos/400/300?random=5' },
  { id: 'bisht', title: 'Bisht', type: 'men', desc: 'A traditional outer cloak, often worn for special occasions. Crafted with exquisite detailing and rich fabrics.', imgUrl: 'https://picsum.photos/400/300?random=6' },
  { id: 'hijab', title: 'Hijab & Accessories', type: 'accessories', desc: 'Premium hijabs in various fabrics and colors, alongside stylish accessories to complete your look.', imgUrl: 'https://picsum.photos/400/300?random=7' },
  { id: 'prayer', title: 'Prayer Garments', type: 'accessories', desc: 'Specialized prayer wear designed for comfort, ease, and respect during worship.', imgUrl: 'https://picsum.photos/400/300?random=8' }
];

export const GARMENT_TYPES = {
  MEN: [
    { value: 'thobe', label: 'Thobe / Jubba' },
    { value: 'kurta', label: 'Kurta Shalwar' },
    { value: 'bisht', label: 'Bisht' },
  ],
  WOMEN: [
    { value: 'abaya', label: 'Abaya' },
    { value: 'jilbab', label: 'Jilbab' },
    { value: 'kaftan', label: 'Kaftan' },
  ],
};

export const FABRIC_OPTIONS = [
  'Premium Cotton',
  'Linen Blend',
  'Silk',
  'Wool Blend',
  'Crepe',
  'Satin',
  'Velvet'
];

export const COLOR_OPTIONS = [
  'White',
  'Black',
  'Beige',
  'Navy',
  'Grey',
  'Maroon',
  'Olive Green'
];

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'the-art-of-perfect-fit',
    title: 'The Art of the Perfect Fit: Why Custom Tailoring Matters',
    date: 'February 1, 2025',
    author: 'Miraal Khan',
    imageUrl: 'https://picsum.photos/600/400?random=9',
    excerpt: 'Discover the unparalleled benefits of garments tailored precisely to your unique measurements and preferences. Move beyond off-the-rack clothing and embrace true comfort and style.',
    content: `
      <p>In a world of mass production, the concept of a garment made specifically for you feels like a luxury. But at House of Miraal, we believe it's a necessity for true comfort and confident style. The "perfect fit" isn't just a marketing slogan; it's an art that transforms how you look and feel.</p>

      <h2>The Difference a Custom Fit Makes</h2>
      <p>Off-the-rack clothing is designed for average body types. This often means compromising on sleeve length, shoulder width, or overall drape. Custom tailoring, on the other hand, considers every curve and contour of your unique body. This results in:</p>
      <ul>
        <li><strong>Unmatched Comfort:</strong> No more pulling, pinching, or restrictive movements. Your garment moves with you.</li>
        <li><strong>Enhanced Confidence:</strong> When your clothes fit perfectly, you exude an aura of polish and self-assurance.</li>
        <li><strong>Flattering Silhouettes:</strong> Tailoring accentuates your best features and creates a harmonious visual line.</li>
        <li><strong>Durability:</strong> Custom garments are often made with higher quality materials and construction, designed to last.</li>
      </ul>

      <h2>The House of Miraal Approach</h2>
      <p>Our process begins with your precise measurements. We guide you through each step, ensuring accuracy. Then, our skilled artisans meticulously craft your chosen design, incorporating your fabric and color preferences. The result is not just a garment, but a wearable work of art that is uniquely yours.</p>
      <p>Embrace the difference. Experience the art of the perfect fit with House of Miraal.</p>
    `,
  },
  {
    id: 'b2',
    slug: 'choosing-your-fabric',
    title: 'Choosing Your Fabric: A Guide to Luxurious Materials',
    date: 'February 10, 2025',
    author: 'Aisha Rahman',
    imageUrl: 'https://picsum.photos/600/400?random=10',
    excerpt: 'The right fabric can elevate a garment from ordinary to extraordinary. Explore our guide to premium materials and find the perfect one for your next custom piece.',
    content: `
      <p>Fabric is the soul of any garment. Its texture, drape, and feel determine not only the look but also the comfort and longevity of your custom wear. At House of Miraal, we offer a curated selection of premium fabrics, each chosen for its unique qualities.</p>

      <h2>Understanding Your Options</h2>
      <p>Here’s a brief overview of some popular choices:</p>
      <ul>
        <li><strong>Premium Cotton:</strong> Breathable, soft, and versatile. Ideal for everyday wear and garments that require a crisp finish.</li>
        <li><strong>Linen Blend:</strong> Known for its natural texture and cooling properties. Perfect for warmer climates and relaxed, elegant styles.</li>
        <li><strong>Silk:</strong> The epitome of luxury. Silky smooth, lustrous, and drapes beautifully, making it perfect for special occasion wear.</li>
        <li><strong>Wool Blend:</strong> Offers warmth, structure, and wrinkle resistance. A great choice for structured garments and cooler weather.</li>
        <li><strong>Crepe:</strong> Features a distinctive crinkled texture and excellent drape. Ideal for flowing dresses and elegant abayas.</li>
        <li><strong>Satin:</strong> A weave, not a fiber, known for its glossy surface. Provides a luxurious feel and elegant sheen for evening wear.</li>
        <li><strong>Velvet:</strong> A rich, soft, and luxurious fabric with a dense pile. Perfect for opulent and formal garments, especially in colder seasons.</li>
      </ul>

      <h2>Making the Right Choice</h2>
      <p>Consider the occasion, climate, and desired drape when selecting your fabric. Our AI assistant can also provide personalized recommendations based on your garment type and style notes.</p>
      <p>Invest in quality, and your garment will not only look exquisite but also feel incredible for years to come.</p>
    `,
  },
  {
    id: 'b3',
    slug: 'beyond-the-basics-personalizing-your-garment',
    title: 'Beyond the Basics: Personalizing Your Garment with Unique Details',
    date: 'March 5, 2025',
    author: 'Omar Siddiqui',
    imageUrl: 'https://picsum.photos/600/400?random=11',
    excerpt: 'Custom tailoring offers more than just a perfect fit; it’s an opportunity to express your individuality. Learn how unique details can transform your garment into a personal statement.',
    content: `
      <p>At House of Miraal, we believe that true elegance lies in the details. While a perfect fit and exquisite fabric form the foundation of any custom garment, it's the personalized touches that truly make it your own. Moving beyond the basics, you can infuse your personality into every stitch.</p>

      <h2>Embrace Individuality</h2>
      <p>Here are some ways to personalize your custom wear:</p>
      <ul>
        <li><strong>Embroidery:</strong> From subtle monograms to intricate patterns inspired by traditional motifs, embroidery adds a touch of bespoke luxury.</li>
        <li><strong>Buttons and Fastenings:</strong> Don't underestimate the power of unique buttons, hidden plackets, or decorative closures.</li>
        <li><strong>Collar and Cuff Styles:</strong> Even slight variations in collar shape or cuff design can drastically alter the garment's overall aesthetic.</li>
        <li><strong>Lining Choices:</strong> A contrasting or patterned lining adds an unexpected pop of color and an extra layer of luxury that's just for you.</li>
        <li><strong>Pocket Details:</strong> The style, placement, and even the stitching of pockets can contribute to the garment's character.</li>
        <li><strong>Hemline Adjustments:</strong> Beyond just length, consider unique cuts or decorative finishes for your hem.</li>
      </ul>

      <h2>Collaborate with Our Designers</h2>
      <p>Our team is here to guide you through the myriad of options. Share your vision, your inspirations, or even just a mood board, and we'll help translate it into exquisite details that resonate with your personal style.</p>
      <p>A custom garment from House of Miraal is more than just clothing; it's a reflection of your unique taste and story.</p>
    `,
  },
];