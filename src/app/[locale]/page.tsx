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
    viewPricing: 'View Pricing & Features (50% Off)',
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
    firstMonthBadge: '50% off first month',
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
    viewPricing: 'Ver Precios y Planes (-50%)',
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
    firstMonthBadge: '50% de descuento primer mes',
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
    viewPricing: 'प्लान एवं कीमत देखें (50% छूट)',
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
    firstMonthBadge: 'पहले महीने पर 50% छूट',
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
      className="min-h-screen bg-[#FAFAFC] flex flex-col font-sans selection:bg-rose-500 selection:text-white"
    >
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] shadow-2xs flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <Instagram className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
              </span>
              <span className="hidden md:inline-flex mx-2 items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                {t.metaCert}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={activeLocale} />
            <Link
              href={`/${activeLocale}/login`}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-2xs"
            >
              {t.signIn}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-6 pb-8 sm:pt-14 sm:pb-16 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{t.welcomeOffer}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
            {t.heroTitle1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 block sm:inline">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto font-normal leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="pt-1 space-y-2 max-w-sm mx-auto w-full">
            <Link
              href={`/${activeLocale}/login`}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-95 active:scale-98 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{t.startGrowthPlan}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href={`/${activeLocale}/pricing`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition py-0.5"
            >
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{t.viewPricing}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-left">
            <div className="bg-white border border-slate-200/70 rounded-2xl p-3 shadow-2xs">
              <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                +420–680
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                New Target Followers/Mo
              </span>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-3 shadow-2xs">
              <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                32 Hours
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Time Saved Monthly
              </span>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-3 shadow-2xs">
              <span className="text-sm font-black text-purple-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                v21.0
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Official Meta Graph API
              </span>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-3 shadow-2xs">
              <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                100% Safe
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Anti-Ban Stagger Limits
              </span>
            </div>
          </div>

          {/* Compact Preview Card */}
          <div className="pt-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-3 text-left overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-slate-700 ml-1">{t.calendarTitle}</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.autopilotActive}
                </span>
              </div>

              <div className="flex gap-2 pt-2.5 overflow-x-auto snap-x snap-mandatory pb-1 text-left">
                {[
                  { day: 'Day 1', theme: 'Problem-Solution', hook: 'Tired of generic quality? Try us.', status: 'Published' },
                  { day: 'Day 2', theme: 'Behind Scenes', hook: 'The secret organic extraction process', status: 'Published' },
                  { day: 'Day 3', theme: 'Social Proof', hook: 'Voted neighborhood favorite in 2026', status: 'Scheduled' },
                  { day: 'Day 4', theme: 'Tips', hook: '3 signs your routine is actually working', status: 'Scheduled' },
                ].map((post, i) => (
                  <div
                    key={i}
                    className="w-[62vw] sm:w-44 shrink-0 snap-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="text-slate-400">{post.day}</span>
                      <span className={`px-1.5 py-0.2 rounded-full ${post.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug">{post.hook}</p>
                    <span className="text-[9px] text-slate-400 block">{post.theme}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 3-Step Flow with Contextual Visual Images */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            
            {/* Step 1: Multi-Channel Connect */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-44 w-full bg-gradient-to-tr from-rose-500/10 via-purple-500/5 to-slate-100 relative overflow-hidden flex items-center justify-center p-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80" 
                  alt="Multi-Channel Connect"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-xs text-white font-black text-[11px] shadow-md flex items-center gap-1">
                  <span>Step 1</span>
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step1Title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.step1Desc}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Niche Intelligence Analysis */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-44 w-full bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-slate-100 relative overflow-hidden flex items-center justify-center p-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" 
                  alt="Niche Intelligence Analysis"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-purple-600/90 backdrop-blur-xs text-white font-black text-[11px] shadow-md flex items-center gap-1">
                  <span>Step 2</span>
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step2Title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.step2Desc}</p>
                </div>
              </div>
            </div>

            {/* Step 3: Autopilot Publishing */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-44 w-full bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-slate-100 relative overflow-hidden flex items-center justify-center p-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" 
                  alt="Autopilot Publishing"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-xs text-white font-black text-[11px] shadow-md flex items-center gap-1">
                  <span>Step 3</span>
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{t.step3Title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.step3Desc}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section className="py-10 bg-[#FAFAFC]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {t.pricingPill}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {t.pricingHeading}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.pricingSubheading}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-rose-200/80 p-5 shadow-sm text-left space-y-3.5">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{t.planName}</h3>
                <p className="text-[11px] text-slate-400">{t.planDesc}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through mr-1">₹3999</span>
                <span className="text-2xl font-black text-slate-900">₹1999</span>
                <span className="text-[10px] text-emerald-600 font-bold block">{t.firstMonthBadge}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {[t.f1, t.f2, t.f3, t.f4, t.f5].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${activeLocale}/login`}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.claimDiscountBtn}</span>
              <ArrowRight className={`w-4 h-4 text-rose-300 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-400 mt-auto text-center space-y-2">
        <p className="text-slate-600 font-medium">
          Instask • <span className="text-emerald-700 font-semibold">Meta Graph API v21.0 Certified</span>
        </p>
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <Link href={`/${activeLocale}/pricing`} className="hover:text-slate-800">{t.pricingLink}</Link>
          <Link href={`/${activeLocale}/terms`} className="hover:text-slate-800">{t.termsLink}</Link>
          <Link href={`/${activeLocale}/refund-policy`} className="hover:text-slate-800">{t.refundLink}</Link>
          <Link href={`/${activeLocale}/privacy`} className="hover:text-slate-800">{t.privacyLink}</Link>
        </div>
      </footer>

    </div>
  );
}