// INSTASK - Gemini 2.5 Flash Strategy & Copywriting Agent
// Leverages official Google GenAI with strict niche-grounded prompting & dynamic fallback.

import { GoogleGenAI } from '@google/genai';

export interface PlanPostItem {
  day: number;
  scheduled_time: string;
  theme: string;
  headline: string;
  body_bullets: string[];
  caption: string;
  hashtags: string[];
  template_id: string;
  aspect_ratio: '1:1' | '4:5';
}

export interface GeneratePlanOptions {
  brandName: string;
  location?: string;
  productSummary: string;
  competitors: string[];
  language?: string;
  timezone?: string;
}

const CONTENT_THEMES = [
  'Problem-Solution',
  'Behind the Scenes',
  'Social Proof',
  'Educational Tips',
  'Community & Memes',
];

export async function generate30DayGrowthPlan(options: GeneratePlanOptions): Promise<PlanPostItem[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const language = options.language || 'en';
      const prompt = `
You are an Elite Social Media Director creating an authentic, custom 30-Day Instagram Growth Plan.
CRITICAL MANDATE: Every single post MUST be strictly tailored to this business's specific niche and offering summary. DO NOT use generic or unrelated industry examples.

Business Dossier:
- Brand Name: "${options.brandName}"
- Target Location: "${options.location || 'Local / Online'}"
- EXACT Offering & Products/Services: "${options.productSummary}"
- Target Output Language: "${language}"
- Competitor Inspiration: "${options.competitors.join(', ') || 'Niche leaders'}"

Generation Rules:
1. Generate an array of exactly 30 unique post items (day 1 to 30).
2. Balance evenly across 5 themes:
   - "Problem-Solution": Address specific pain points experienced by customers looking for ${options.productSummary}, and show how ${options.brandName} solves them.
   - "Behind the Scenes": Reveal actual processes, care, quality checks, equipment, or founder mindset for this specific offering.
   - "Social Proof": Realistic customer transformations, reviews, and satisfaction stories specific to ${options.brandName}.
   - "Educational Tips": Practical tips, myths vs. facts, and insider advice directly educating about ${options.productSummary}.
   - "Community & Memes": Relatable, lighthearted situational humor and engagement questions specific to customers of this exact niche.

For each post object:
- "day": integer (1 to 30)
- "scheduled_time": ISO UTC string spaced over the next 30 days at peak hours (10:00, 14:00, or 18:30 UTC)
- "theme": One of the 5 themes above
- "headline": Punchy, viral hook of 3 to 7 WORDS specifically naming or addressing aspects of ${options.productSummary}. NEVER mention unrelated niches (no bakeries/cafes unless the brand is one).
- "body_bullets": Array of exactly 3 concise value points for graphic overlay directly relevant to the post topic.
- "caption": Engaging 3-paragraph caption in ${language} with hook, value, clear CTA, and natural double spacing.
- "hashtags": Array of exactly 15 hyper-relevant tags (mix of brand, niche keywords, and location).
- "template_id": Alternating "template-instask-square-01" and "template-instask-portrait-01"
- "aspect_ratio": "1:1" for square or "4:5" for portrait

Return ONLY valid JSON array or an object with a "posts" key containing the array. No markdown codeblocks.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      if (response.text) {
        let cleaned = response.text.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleaned);
        const postsArray = Array.isArray(parsed) ? parsed : parsed.posts;

        if (Array.isArray(postsArray) && postsArray.length > 0) {
          return sanitizeGeneratedPosts(postsArray, options);
        }
      }
    } catch (error) {
      console.warn('Gemini 2.5 Flash execution fallback triggered:', error);
    }
  }

  // Dynamic context-grounded fallback (Never uses hardcoded bakery items)
  return generateDynamicContextualPlan(options);
}

function sanitizeGeneratedPosts(
  posts: Partial<PlanPostItem>[],
  options: GeneratePlanOptions
): PlanPostItem[] {
  const baseDate = new Date();
  return posts.slice(0, 30).map((p, idx) => {
    const day = p.day || idx + 1;
    const postDate = new Date(baseDate.getTime() + day * 24 * 60 * 60 * 1000);
    postDate.setUTCHours(10 + (idx % 3) * 4, 0, 0, 0);

    const safeBrand = options.brandName || 'Our Brand';
    const safeSummary = options.productSummary || 'Premium Services';

    return {
      day,
      scheduled_time: p.scheduled_time || postDate.toISOString(),
      theme: p.theme || CONTENT_THEMES[idx % CONTENT_THEMES.length],
      headline: (p.headline || `${safeBrand}: Elevating ${safeSummary.slice(0, 30)}`).slice(0, 75),
      body_bullets:
        Array.isArray(p.body_bullets) && p.body_bullets.length >= 3
          ? p.body_bullets.slice(0, 3)
          : [
              `Curated for ${safeBrand} clients`,
              `Highest standards of quality`,
              `Trusted local results`,
            ],
      caption:
        p.caption ||
        `Experience the difference with ${safeBrand}. ✨\n\nWe specialize in ${safeSummary}, providing tailored quality that speaks for itself.\n\n👇 Drop your thoughts below or tap the link in our bio to learn more!\n\n`,
      hashtags:
        Array.isArray(p.hashtags) && p.hashtags.length > 0
          ? p.hashtags.slice(0, 15)
          : [
              `#${safeBrand.replace(/\s+/g, '')}`,
              `#${(options.location || 'Local').replace(/[^a-zA-Z0-9]/g, '')}`,
              '#ClientResults',
              '#QualityFirst',
              '#SmallBusinessLove',
              '#DirectToConsumer',
              '#DailyInspiration',
              '#Transformations',
              '#VerifiedResults',
              '#AuthenticCraft',
              '#ShopLocal',
              '#CustomerFavorite',
              '#IndustryLeaders',
              '#ExcellenceInService',
              '#GrowYourBrand',
            ],
      template_id:
        p.template_id || (idx % 2 === 0 ? 'template-instask-square-01' : 'template-instask-portrait-01'),
      aspect_ratio: idx % 2 === 0 ? '1:1' : '4:5',
    };
  });
}

// Dynamic fallback that strictly extracts from the user's actual product description
export function generateDynamicContextualPlan(options: GeneratePlanOptions): PlanPostItem[] {
  const brand = options.brandName || 'Our Brand';
  const location = options.location || 'Your City';
  const summary = options.productSummary || 'our signature products and tailored experiences';
  const baseDate = new Date();

  // Extract core themes based on what user actually entered
  const contextualPostGenerators = [
    {
      theme: 'Problem-Solution',
      headline: () => `Tired of Settling? Choose ${brand}.`,
      bullets: [
        'Tailored specifically to your needs',
        'No shortcuts or compromises',
        'Proven satisfaction & consistency',
      ],
      caption: `Struggling to find reliable solutions for ${summary}? 💡\n\nAt ${brand}, we believe you deserve exceptional standards. Everything we do is focused on delivering genuine results without cutting corners.\n\n📍 Serving clients in ${location}. Tap the link in our bio to get started today!`,
    },
    {
      theme: 'Behind the Scenes',
      headline: () => `The Passion Behind ${brand}`,
      bullets: [
        `Meticulous attention to detail`,
        `Premium tools & best-in-class care`,
        `Delivering ${summary.slice(0, 35)} daily`,
      ],
      caption: `Behind every great result is hours of preparation and care. 🔍\n\nTake a look inside our process. When crafting ${summary}, we focus on every micro-detail so your experience is seamless from start to finish.\n\nWhat would you like to see next? Let us know in the comments! 👇`,
    },
    {
      theme: 'Social Proof',
      headline: () => `"The Best Decision I Made This Month!"`,
      bullets: [
        `Trusted by 100+ satisfied clients`,
        `Consistent 5-star feedback`,
        `Real transformation with ${brand}`,
      ],
      caption: `"Finding ${brand} completely changed my expectations. Truly outstanding work with ${summary}!" ⭐⭐⭐⭐⭐\n\nYour feedback and trust are what drive our standards higher every single day.\n\nReady to experience it yourself? Click the link in bio to book or order! 🚀`,
    },
    {
      theme: 'Educational Tips',
      headline: () => `3 Things to Look for in ${brand}`,
      bullets: [
        'Clear, verified quality standards',
        'Personalized care and communication',
        'Long-term consistency over hype',
      ],
      caption: `Navigating options for ${summary} can be overwhelming. Here are 3 essentials you should never compromise on:\n\n1. Verification: Make sure the team has proven expertise.\n2. Transparency: No hidden caveats or poor communication.\n3. Custom Fit: Solutions matched to your exact scenario.\n\n📌 Save this checklist for your next decision!`,
    },
    {
      theme: 'Community & Memes',
      headline: () => `Your Sign to Upgrade Today`,
      bullets: [
        `Zero regrets`,
        `Elevated everyday experience`,
        `Because quality matters`,
      ],
      caption: `This is your official sign to treat yourself to the standard you deserve. ✨\n\nWhether you need ${summary} or just want to elevate your day, ${brand} has you covered.\n\nDrop a ❤️ below if you agree!`,
    },
  ];

  const posts: PlanPostItem[] = [];

  for (let i = 1; i <= 30; i++) {
    const generator = contextualPostGenerators[(i - 1) % contextualPostGenerators.length];
    const postDate = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    const hours = [10, 14, 18][(i - 1) % 3];
    postDate.setUTCHours(hours, 0, 0, 0);

    const isPortrait = i % 2 === 0;

    posts.push({
      day: i,
      scheduled_time: postDate.toISOString(),
      theme: generator.theme,
      headline: generator.headline(),
      body_bullets: generator.bullets,
      caption: generator.caption,
      hashtags: [
        `#${brand.replace(/\s+/g, '')}`,
        `#${location.replace(/[^a-zA-Z0-9]/g, '')}`,
        '#SmallBusinessGrowth',
        '#CustomerFirst',
        '#AuthenticExperience',
        '#QualityStandards',
        '#CommunitySpotlight',
        '#NicheExcellence',
        '#VerifiedQuality',
        '#ShopLocal',
        '#ClientLove',
        '#DailyInspiration',
        '#TrustedBrand',
        '#LocalFavorite',
        '#InstagramStrategy',
      ],
      template_id: isPortrait ? 'template-instask-portrait-01' : 'template-instask-square-01',
      aspect_ratio: isPortrait ? '4:5' : '1:1',
    });
  }

  return posts;
}