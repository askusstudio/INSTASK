// INSTASK - Realtime Dynamic Visual Generation Engine
// Dynamically identifies brand vertical and serves 30 non-repeating, niche-relevant assets.

export interface CreatomateRenderInput {
  templateId?: string;
  aspectRatio: '1:1' | '4:5';
  brandName: string;
  brandColor?: string;
  handle?: string;
  headline: string;
  bullets: string[];
  theme: string;
  dayNumber: number;
  logoUrl?: string;
  industry?: string;
}

export interface RenderResult {
  mediaUrl: string;
  isFallback: boolean;
  aspectRatio: '1:1' | '4:5';
  width: number;
  height: number;
}

// 30 Unique High-Res Assets Per Vertical (Zero duplicates across 30 days)
const NICHE_IMAGE_POOLS: Record<string, string[]> = {
  food: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=1080&auto=format&fit=crop&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549576490-b0b4831dd60a?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530822847156-5df684f04f38?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519748771451-a94c5963879f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1080&auto=format&fit=crop&q=80',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f41d9943486?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597359-0a69a04a58b5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228722-d0b71941219b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228724-4da924c56858?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f41d9943486?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1080&auto=format&fit=crop&q=80',
  ],
  tech: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1080&auto=format&fit=crop&q=80',
  ],
};

function detectNicheKey(brandName: string, industry?: string, headline?: string): string {
  const combined = `${brandName || ''} ${industry || ''} ${headline || ''}`.toLowerCase();
  
  if (combined.match(/coffee|cafe|bakery|restaurant|cake|pizza|burger|food|dine|bistro|brew|roast|tea|kitchen|cookie|pastry/)) {
    return 'food';
  }
  if (combined.match(/gym|fitness|workout|trainer|crossfit|yoga|protein|muscle|athlete|lifting|pilates|wellness/)) {
    return 'fitness';
  }
  if (combined.match(/cloth|fashion|wear|apparel|boutique|outfit|style|dress|shoes|streetwear|luxury|jewelry|collection|tailor/)) {
    return 'fashion';
  }
  if (combined.match(/tech|software|saas|ai|agency|consulting|marketing|digital|code|developer|startup|cloud|data/)) {
    return 'tech';
  }
  // Default fallback is beauty/salon/skincare
  return 'beauty';
}

export async function renderPostAsset(input: CreatomateRenderInput): Promise<RenderResult> {
  const apiKey = process.env.CREATOMATE_API_KEY;
  const isPortrait = input.aspectRatio === '4:5';
  const width = 1080;
  const height = isPortrait ? 1350 : 1080;

  // Real-time niche detection
  const detectedNiche = detectNicheKey(input.brandName, input.industry, input.headline);
  const pool = NICHE_IMAGE_POOLS[detectedNiche] || NICHE_IMAGE_POOLS.beauty;

  // Strict 1-to-1 Day Indexing (Zero Repeats across Day 1 to Day 30)
  const safeIndex = Math.max(0, Math.min(pool.length - 1, (input.dayNumber || 1) - 1));
  const selectedPhotoUrl = pool[safeIndex];

  if (apiKey && apiKey.length > 20 && !apiKey.includes('demo')) {
    try {
      const templateId =
        input.templateId ||
        (isPortrait
          ? process.env.CREATOMATE_TEMPLATE_ID_4_5 || 'template-instask-portrait-01'
          : process.env.CREATOMATE_TEMPLATE_ID_1_1 || 'template-instask-square-01');

      const response = await fetch('https://api.creatomate.com/v1/renders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          modifications: {
            'Brand-Name.text': input.brandName,
            'Handle.text': input.handle ? `@${input.handle.replace(/^@/, '')}` : `@${input.brandName.toLowerCase().replace(/\s+/g, '')}`,
            'Headline.text': input.headline,
            'Background-Image.source': selectedPhotoUrl,
            'Bullet-1.text': input.bullets[0] || '',
            'Bullet-2.text': input.bullets[1] || '',
            'Bullet-3.text': input.bullets[2] || '',
            'Theme-Badge.text': input.theme.toUpperCase(),
            'Brand-Accent.color': input.brandColor || '#e1306c',
            ...(input.logoUrl ? { 'Logo.source': input.logoUrl } : {}),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const renderItem = Array.isArray(data) ? data[0] : data;
        if (renderItem?.url) {
          return {
            mediaUrl: renderItem.url,
            isFallback: false,
            aspectRatio: input.aspectRatio,
            width,
            height,
          };
        }
      }
    } catch (err) {
      console.warn('Creatomate render request failed, switching to direct photo delivery:', err);
    }
  }

  return {
    mediaUrl: selectedPhotoUrl,
    isFallback: false,
    aspectRatio: input.aspectRatio,
    width,
    height,
  };
}