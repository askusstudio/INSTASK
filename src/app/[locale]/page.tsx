'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  Instagram,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface LandingPageProps {
  params: { locale: string };
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    metaCert: 'Meta v21.0 Certified',
    pricingNav: 'Pricing (50% Off)',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    welcomeOffer: 'Creator Welcome Offer: 50% OFF Applied',
    heroTitle1: 'Your Instagram on Full Autopilot in',
    heroTitleHighlight: '3 Easy Clicks.',
    heroDesc: "Generate 30 days of high-converting graphics, viral captions, and 3-tier hashtags. We scrape your top competitors and publish directly via Meta's official Graph API.",
    startGrowthPlan: 'Start 30-Day Growth Plan',
    viewPricing: 'View Pricing ($24.50 First Month)',
    officialApi: 'Official Meta Graph API v21.0',
    stripeEncrypted: 'Stripe 256-Bit Encrypted Payments',
    moneyBack: '100% Money-Back Guarantee',
    calendarTitle: 'INSTASK • 30-Day Autonomous Calendar',
    autopilotActive: 'Autopilot: ACTIVE',
    stepPill: 'Zero-Friction Engine',
    stepHeading: 'From zero to 30 days published in 3 steps',
    stepSubheading: 'Built specifically for small businesses with no dedicated marketing team.',
    step1Title: 'Multi-Channel Connect',
    step1Desc: 'Sign in with Email, Phone OTP, or Instagram/Facebook Meta OAuth in under 15 seconds. No passwords stored.',
    step2Title: 'Niche Intelligence Analysis',
    step2Desc: "Our Apify engine scrapes your top competitors' top-performing reels and carousel posts to extract winning hooks and hashtag tiers.",
    step3Title: 'Autopilot Publishing',
    step3Desc: 'Gemini 2.5 Flash crafts 30 days of copy, Creatomate renders high-res graphics, and Meta Graph API auto-publishes on your exact schedule.',
    pricingPill: 'Welcome Discount',
    pricingHeading: 'Simple, transparent pricing. 50% off today.',
    pricingSubheading: 'Cancel anytime in 1 click. Zero lock-in contracts.',
    planName: 'Pro Growth Plan',
    planDesc: 'Autonomous Instagram growth engine',
    firstMonthBadge: 'for month 1 with FIRST50',
    claimDiscountBtn: 'Claim 50% Off & Activate Now',
    f1: '30 AI-generated visual templates (1:1 & 4:5 aspect ratio)',
    f2: '5 Competitor intelligence scraping with 2s safety limits',
    f3: 'Gemini 2.5 Flash caption & 3-tier hashtag automation',
    f4: 'Certified Meta Graph API v21.0 container publishing',
    f5: 'Global and Indian regional language support with native RTL',
    pricingLink: 'Pricing',
    termsLink: 'Terms of Service',
    refundLink: 'Refund Policy',
    privacyLink: 'Privacy Policy',
  },
  es: {
    metaCert: 'Certificado Meta v21.0',
    pricingNav: 'Precios (-50%)',
    signIn: 'Iniciar Sesión',
    getStarted: 'Empezar',
    welcomeOffer: 'Oferta de bienvenida: 50% de descuento',
    heroTitle1: 'Tu Instagram en Piloto Automático en',
    heroTitleHighlight: '3 Fáciles Clics.',
    heroDesc: 'Genera 30 días de gráficos de alta conversión, subtítulos virales y hashtags. Analizamos a tus competidores y publicamos con la API oficial de Meta.',
    startGrowthPlan: 'Comenzar Plan de 30 Días',
    viewPricing: 'Ver Precios ($24.50 Primer Mes)',
    officialApi: 'API Oficial Meta Graph v21.0',
    stripeEncrypted: 'Pagos Seguros Encriptados Stripe',
    moneyBack: 'Garantía 100% de Devolución',
    calendarTitle: 'INSTASK • Calendario Autónomo de 30 Días',
    autopilotActive: 'Piloto Automático: ACTIVO',
    stepPill: 'Motor Sin Fricción',
    stepHeading: 'De cero a 30 días publicados en 3 pasos',
    stepSubheading: 'Diseñado específicamente para pequeños negocios sin equipo de marketing.',
    step1Title: 'Conexión Multicanal',
    step1Desc: 'Accede con correo, teléfono OTP o Meta OAuth en 15 segundos.',
    step2Title: 'Inteligencia de Nicho',
    step2Desc: 'Analizamos los mejores reels y carruseles de tus competidores para extraer ganchos ganadores.',
    step3Title: 'Publicación Automática',
    step3Desc: 'IA crea tus textos, genera gráficos en alta resolución y publica automáticamente según tu horario.',
    pricingPill: 'Descuento de Bienvenida',
    pricingHeading: 'Precios simples y transparentes. 50% de descuento hoy.',
    pricingSubheading: 'Cancela cuando quieras en 1 clic.',
    planName: 'Plan Pro Growth',
    planDesc: 'Motor autónomo de crecimiento para Instagram',
    firstMonthBadge: 'para el mes 1 con FIRST50',
    claimDiscountBtn: 'Obtén 50% Descuento y Activa Ahora',
    f1: '30 plantillas visuales generadas por IA (1:1 y 4:5)',
    f2: 'Análisis inteligente de 5 competidores',
    f3: 'Análisis de subtítulos y hashtags con IA',
    f4: 'Publicación certificada mediante Meta Graph API v21.0',
    f5: 'Idiomas globales y regionales con soporte nativo RTL',
    pricingLink: 'Precios',
    termsLink: 'Términos del Servicio',
    refundLink: 'Política de Reembolso',
    privacyLink: 'Política de Privacidad',
  },
  hi: {
    metaCert: 'मेटा v21.0 प्रमाणित',
    pricingNav: 'मूल्य निर्धारण (50% छूट)',
    signIn: 'साइन इन करें',
    getStarted: 'शुरू करें',
    welcomeOffer: 'नए क्रिएटर्स के लिए: 50% की विशेष छूट लागू',
    heroTitle1: 'आपका इंस्टाग्राम अब पूरी तरह ऑटोपायलट पर, सिर्फ',
    heroTitleHighlight: '3 आसान क्लिक में।',
    heroDesc: '30 दिनों के वायरल ग्राफिक्स, आकर्षक कैप्शन और 3-स्तरीय हैशटैग बनाएं। हम आपके प्रतिस्पर्धियों का विश्लेषण करते हैं और सीधे मेटा के आधिकारिक API से पोस्ट करते हैं।',
    startGrowthPlan: '30-दिवसीय ग्रोथ प्लान शुरू करें',
    viewPricing: 'कीमत देखें ($24.50 पहला महीना)',
    officialApi: 'आधिकारिक मेटा ग्राफ API v21.0',
    stripeEncrypted: 'स्ट्राइप 256-बिट सुरक्षित भुगतान',
    moneyBack: '100% धन वापसी गारंटी',
    calendarTitle: 'INSTASK • 30-दिवसीय स्वचालित कैलेंडर',
    autopilotActive: 'ऑटोपायलट: सक्रिय',
    stepPill: 'सरल एवं तीव्र इंजन',
    stepHeading: 'शून्य से 30 दिनों का कंटेंट सिर्फ 3 चरणों में',
    stepSubheading: 'विशेष रूप से छोटे व्यवसायों और स्वतंत्र रचनाकारों के लिए निर्मित।',
    step1Title: 'मल्टी-चैनल कनेक्ट',
    step1Desc: 'ईमेल, फोन ओटीपी या इंस्टाग्राम/फेसबुक मेटा ऑथ से 15 सेकंड में लॉगिन करें। पासवर्ड की आवश्यकता नहीं।',
    step2Title: 'प्रतिस्पर्धी विश्लेषण',
    step2Desc: 'हमारा सिस्टम आपके शीर्ष प्रतिस्पर्धियों के वायरल रील्स और पोस्ट का विश्लेषण करके सर्वश्रेष्ठ हुक्स निकालता है।',
    step3Title: 'स्वचालित प्रकाशन',
    step3Desc: 'AI कैप्शन तैयार करता है, हाई-रेजोल्यूशन ग्राफिक्स रेंडर होते हैं और मेटा ग्राफ API आपके शेड्यूल पर ऑटो-पब्लिश करता है।',
    pricingPill: 'विशेष छूट',
    pricingHeading: 'सरल और पारदर्शी मूल्य निर्धारण। आज ही 50% छूट पाएं।',
    pricingSubheading: 'कभी भी 1 क्लिक में रद्द करें। कोई अनुबंध नहीं।',
    planName: 'प्रो ग्रोथ प्लान',
    planDesc: 'स्वचालित इंस्टाग्राम ग्रोथ इंजन',
    firstMonthBadge: 'FIRST50 कूपन के साथ पहले महीने के लिए',
    claimDiscountBtn: '50% छूट प्राप्त करें और अभी सक्रिय करें',
    f1: '30 AI-जनरेटेड विज़ुअल टेम्प्लेट्स (1:1 और 4:5 अनुपात)',
    f2: '5 प्रतिस्पर्धियों का सुरक्षित डेटा विश्लेषण',
    f3: 'AI कैप्शन और 3-स्तरीय हैशटैग ऑटोमेशन',
    f4: 'प्रमाणित मेटा ग्राफ API v21.0 कंटेनर पब्लिशिंग',
    f5: 'हिंदी, अंग्रेजी सहित वैश्विक और भारतीय क्षेत्रीय भाषाओं का समर्थन',
    pricingLink: 'मूल्य निर्धारण',
    termsLink: 'सेवा की शर्तें',
    refundLink: 'वापसी नीति',
    privacyLink: 'गोपनीयता नीति',
  },
};

export default function PublicLandingPage({ params }: LandingPageProps) {
  const urlParams = useParams();
  const pathname = usePathname();

  const pathLocale = pathname ? pathname.split('/')[1] : null;
  const rawLocale = (urlParams?.locale as string) || params?.locale || pathLocale || 'en';
  const activeLocale = rawLocale.toLowerCase();

  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;
  const isRTL = activeLocale === 'ar';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-20 md:pb-0"
    >
      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
              </span>
              <span className="hidden md:inline-flex mx-2 items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                {t.metaCert}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher currentLocale={activeLocale} />
            <Link
              href={`/${activeLocale}/login`}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-2xs"
            >
              {t.signIn}
            </Link>
            <Link
              href={`/${activeLocale}/login`}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition shadow-xs flex items-center gap-1"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-14 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-[11px] sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{t.welcomeOffer}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            {t.heroTitle1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 block sm:inline mt-1 sm:mt-0">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed px-2">
            {t.heroDesc}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4">
            <Link
              href={`/${activeLocale}/login`}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-95 text-white rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t.startGrowthPlan}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href={`/${activeLocale}/pricing`}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm transition-all border border-slate-200 shadow-2xs flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t.viewPricing}</span>
            </Link>
          </div>

          {/* Plixi-Style 2x2 Metric Badges (Mobile Optimized) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto pt-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
              <span className="text-lg sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-500 inline" />
                +420-680
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                New Target Followers/Mo
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
              <span className="text-lg sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-rose-500 inline" />
                32 Hours
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Time Saved Monthly
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
              <span className="text-lg sm:text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 inline" />
                v21.0
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Official Meta Graph API
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
              <span className="text-lg sm:text-2xl font-black text-purple-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-purple-600 inline" />
                100% Safe
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Anti-Ban Stagger Limits
              </span>
            </div>
          </div>

          {/* Plixi Horizontal Snap-Scroll Visual Preview */}
          <div className="pt-6 sm:pt-10 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xl p-3 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
                  <span className="mx-1 sm:mx-2 text-[11px] sm:text-xs font-bold text-slate-700">
                    {t.calendarTitle}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.autopilotActive}
                </span>
              </div>

              {/* Mobile: Horizontal Snap Scroll / Desktop: 4 Columns */}
              <div className="flex md:grid md:grid-cols-4 gap-3 pt-4 overflow-x-auto snap-x snap-mandatory pb-2 text-left -mx-1 px-1">
                {[
                  { day: 'Day 1', theme: 'Problem-Solution', hook: 'Tired of generic beauty quality? Try us.', status: 'Published' },
                  { day: 'Day 2', theme: 'Behind The Scenes', hook: 'The secret organic extraction process', status: 'Published' },
                  { day: 'Day 3', theme: 'Social Proof', hook: 'Voted neighborhood favorite in 2026', status: 'Scheduled' },
                  { day: 'Day 4', theme: 'Educational Tips', hook: '3 signs your routine is actually working', status: 'Scheduled' },
                ].map((post, i) => (
                  <div
                    key={i}
                    className="w-[78vw] sm:w-[45vw] md:w-auto shrink-0 snap-center p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">{post.day}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full ${
                          post.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-2">{post.hook}</p>
                    <span className="text-[9px] font-medium text-slate-400 block">{post.theme}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Step Architecture Flow */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              {t.stepPill}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              {t.stepHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              {t.stepSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {t.pricingPill}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2.5">
              {t.pricingHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.pricingSubheading}
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-rose-500/40 p-5 sm:p-10 shadow-soft-md max-w-xl mx-auto text-left space-y-5">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{t.planName}</h3>
                <p className="text-xs text-slate-500">{t.planDesc}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through mr-1">$49</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">$24.50</span>
                <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold block">{t.firstMonthBadge}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[t.f1, t.f2, t.f3, t.f4, t.f5].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${activeLocale}/pricing`}
              className="w-full py-3.5 sm:py-4 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{t.claimDiscountBtn}</span>
              <ArrowRight className={`w-4 h-4 text-rose-300 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-800">Instask</span>
            <span className="hidden sm:inline">•</span>
            <span>Operated by <strong>INSTASK</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium">Meta Graph API v21.0 Certified</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-600">
            <Link href={`/${activeLocale}/pricing`} className="hover:text-slate-900 font-medium">{t.pricingLink}</Link>
            <Link href={`/${activeLocale}/terms`} className="hover:text-slate-900 font-medium">{t.termsLink}</Link>
            <Link href={`/${activeLocale}/refund-policy`} className="hover:text-slate-900 font-medium">{t.refundLink}</Link>
            <Link href={`/${activeLocale}/privacy`} className="hover:text-slate-900 font-medium">{t.privacyLink}</Link>
          </div>
        </div>
      </footer>

      {/* Persistent Plixi-Style Mobile Bottom Floating CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">50% Welcome Off</span>
          <span className="text-sm font-black text-slate-900">
            $24.50<span className="text-[10px] text-slate-400 font-normal">/mo</span>
          </span>
        </div>
        <Link
          href={`/${activeLocale}/login`}
          className="py-2 px-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}