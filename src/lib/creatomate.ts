// INSTASK - Creatomate Visual Asset Generation Engine
// Enforces strict 1:1 (1080x1080) & 4:5 (1080x1350) aspect ratios to eliminate Meta 36003 errors.
// Includes a zero-fail typographic SVG card fallback generator.

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
}

export interface RenderResult {
  mediaUrl: string;
  isFallback: boolean;
  aspectRatio: '1:1' | '4:5';
  width: number;
  height: number;
}

export async function renderPostAsset(input: CreatomateRenderInput): Promise<RenderResult> {
  const apiKey = process.env.CREATOMATE_API_KEY;
  const isPortrait = input.aspectRatio === '4:5';
  const width = 1080;
  const height = isPortrait ? 1350 : 1080;

  if (apiKey) {
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
      console.warn('Creatomate render request failed, switching to zero-fail typographic safety generator:', err);
    }
  }

  // Zero-Fail Typographic Card Generator (Generates crisp, high-resolution SVG Data URI conforming to Meta 1:1 or 4:5 standards)
  const fallbackSvg = generateTypographicCardSvg({
    ...input,
    width,
    height,
  });

  const encodedSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSvg)}`;

  return {
    mediaUrl: encodedSvg,
    isFallback: true,
    aspectRatio: input.aspectRatio,
    width,
    height,
  };
}

// Generate high-end SVG typographic poster card (1080x1080 or 1080x1350)
function generateTypographicCardSvg(params: CreatomateRenderInput & { width: number; height: number }): string {
  const { width, height, brandName, handle, headline, bullets, theme, brandColor = '#e1306c', dayNumber } = params;
  const displayHandle = handle ? `@${handle.replace(/^@/, '')}` : `@${brandName.toLowerCase().replace(/\s+/g, '')}`;

  // Theme-specific subtle color gradient accents
  const themeGradients: Record<string, [string, string]> = {
    'Problem-Solution': ['#0F172A', '#1E293B'],
    'Behind the Scenes': ['#18181B', '#27272A'],
    'Social Proof': ['#0B132B', '#1C2541'],
    'Educational Tips': ['#0C1E28', '#1A3644'],
    'Community & Memes': ['#1B112C', '#2E1A47'],
  };

  const [bgStart, bgEnd] = themeGradients[theme] || ['#0F172A', '#1E293B'];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="100%" stop-color="${bgEnd}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${brandColor}" />
      <stop offset="100%" stop-color="#fd1d1d" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#cardBg)" />

  <!-- Subtle Ambient Glow -->
  <circle cx="${width * 0.85}" cy="${height * 0.15}" r="320" fill="${brandColor}" opacity="0.15" filter="url(#shadow)" />
  <circle cx="${width * 0.15}" cy="${height * 0.85}" r="280" fill="#833ab4" opacity="0.1" filter="url(#shadow)" />

  <!-- Outer Border Container -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="32" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />

  <!-- Top Header Bar -->
  <g transform="translate(80, 100)">
    <!-- Theme Badge -->
    <rect x="0" y="0" width="220" height="44" rx="22" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5"/>
    <text x="110" y="27" fill="#F8FAFC" font-family="Inter, -apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1">
      ${escapeXml(theme.toUpperCase())}
    </text>

    <!-- Day Counter -->
    <text x="${width - 240}" y="28" fill="rgba(255, 255, 255, 0.6)" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="end">
      DAY ${dayNumber} / 30
    </text>
  </g>

  <!-- Central Main Card -->
  <g transform="translate(80, 200)">
    <!-- Accent Line -->
    <rect x="0" y="0" width="80" height="6" rx="3" fill="url(#accentGrad)" />

    <!-- Viral Headline Hook -->
    <text x="0" y="70" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-0.5">
      ${wrapTextSvg(headline, 28, 0, 70, 64)}
    </text>

    <!-- 3 Value Bullets -->
    <g transform="translate(0, 360)">
      ${bullets
        .slice(0, 3)
        .map((bullet, idx) => {
          const y = idx * 95;
          return `
        <g transform="translate(0, ${y})">
          <circle cx="20" cy="20" r="16" fill="${brandColor}" opacity="0.2"/>
          <path d="M14 20 L18 24 L26 16" fill="none" stroke="${brandColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="56" y="27" fill="#F1F5F9" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="600">
            ${escapeXml(bullet)}
          </text>
        </g>`;
        })
        .join('')}
    </g>
  </g>

  <!-- Bottom Brand Footer -->
  <g transform="translate(80, ${height - 130})">
    <line x1="0" y1="0" x2="${width - 160}" y2="0" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />
    
    <!-- Brand Identity -->
    <text x="0" y="52" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="700">
      ${escapeXml(brandName)}
    </text>
    
    <text x="${width - 160}" y="52" fill="${brandColor}" font-family="Inter, -apple-system, sans-serif" font-size="24" font-weight="700" text-anchor="end">
      ${escapeXml(displayHandle)}
    </text>
  </g>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function wrapTextSvg(text: string, maxCharsPerLine: number, x: number, startY: number, lineHeight: number): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');
}
