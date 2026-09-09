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
    welcomeOffer: 'First-Time Creator Welcome Offer: 50% OFF Applied (Coupon: FIRST50)',
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
    f5: '10 Global languages with native Arabic RTL support',
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
    welcomeOffer: 'Oferta de bienvenida: 50% de descuento (Cupón: FIRST50)',
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
    f3: 'Automatización de subtítulos y hashtags con IA',
    f4: 'Publicación certificada mediante Meta Graph API v21.0',
    f5: '10 idiomas globales con soporte RTL',
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
    welcomeOffer: 'नए क्रिएटर्स के लिए स्वागत प्रस्ताव: 50% की विशेष छूट (कूपन: FIRST50)',
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
    f5: 'हिंदी, अंग्रेजी सहित 10 वैश्विक भाषाओं का समर्थन',
    pricingLink: 'मूल्य निर्धारण',
    termsLink: 'सेवा की शर्तें',
    refundLink: 'वापसी नीति',
    privacyLink: 'गोपनीयता नीति',
  },
  ar: {
    metaCert: 'معتمد من Meta v21.0',
    pricingNav: 'الأسعار (خصم 50%)',
    signIn: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن',
    welcomeOffer: 'عرض الترحيب للمبدعين: خصم 50% متاح الآن (كوبون: FIRST50)',
    heroTitle1: 'حساب إنستغرام الخاص بك في الوضع التلقائي بالكامل خلال',
    heroTitleHighlight: '3 نقرات سهلة.',
    heroDesc: 'قم بإنشاء محتوى لـ 30 يوماً من التصاميم الجذابة والتعليقات والوسوم الفعالة. نقوم بتحليل منافسيك والنشر مباشرة عبر واجهة Meta الرسمية.',
    startGrowthPlan: 'ابدأ خطة النمو لـ 30 يوماً',
    viewPricing: 'عرض الأسعار ($24.50 للشهر الأول)',
    officialApi: 'واجهة برمجة تطبيقات Meta Graph الرسمية v21.0',
    stripeEncrypted: 'مدفوعات مشفرة وآمنة عبر Stripe',
    moneyBack: 'ضمان استرداد الأموال بنسبة 100%',
    calendarTitle: 'INSTASK • جدول نشر تلقائي لـ 30 يوماً',
    autopilotActive: 'الوضع التلقائي: نشط',
    stepPill: 'محرك نشر سلس',
    stepHeading: 'من البداية إلى محتوى منشور لـ 30 يوماً في 3 خطوات',
    stepSubheading: 'صُمم خصيصاً للشركات الناشئة بدون فريق تسويق مخصص.',
    step1Title: 'اتصال متعدد القنوات',
    step1Desc: 'سجّل الدخول عبر البريد الإلكتروني أو رمز التحقق أو Meta OAuth في أقل من 15 ثانية.',
    step2Title: 'تحليل المنافسين',
    step2Desc: 'يقوم نظامنا بتحليل أفضل منشورات منافسيك لاستخراج أفضل الأفكار والوسوم.',
    step3Title: 'نشر تلقائي',
    step3Desc: 'الذكاء الاصطناعي يكتب النصوص ويصمم الرسومات ويقوم بالنشر التلقائي وفق جدولك.',
    pricingPill: 'خصم ترحيبي',
    pricingHeading: 'أسعار بسيطة وشفافة. خصم 50% اليوم.',
    pricingSubheading: 'إلغاء في أي وقت بنقرة واحدة.',
    planName: 'خطة النمو الاحترافية',
    planDesc: 'محرك نمو تلقائي لحسابك على إنستغرام',
    firstMonthBadge: 'للشهر الأول مع كود FIRST50',
    claimDiscountBtn: 'احصل على خصم 50% وفعّل الآن',
    f1: '30 قالب مرئي بالذكاء الاصطناعي',
    f2: 'تحليل أداء 5 من أبرز المنافسين',
    f3: 'أتمتة كتابة النصوص والوسوم المخصصة',
    f4: 'نشر معتمد عبر واجهة Meta Graph API v21.0',
    f5: 'دعم 10 لغات عالمية مع دعم كامل للغة العربية RTL',
    pricingLink: 'الأسعار',
    termsLink: 'شروط الخدمة',
    refundLink: 'سياسة الاسترداد',
    privacyLink: 'سياسة الخصوصية',
  },
  fr: {
    metaCert: 'Certifié Meta v21.0',
    pricingNav: 'Tarifs (-50%)',
    signIn: 'Connexion',
    getStarted: 'Commencer',
    welcomeOffer: 'Offre créateur : -50% appliqué (Coupon : FIRST50)',
    heroTitle1: 'Votre Instagram en pilote automatique en',
    heroTitleHighlight: '3 clics simples.',
    heroDesc: 'Générez 30 jours de visuels percutants, légendes virales et hashtags. Analyse de vos concurrents et publication directe via l’API Meta.',
    startGrowthPlan: 'Lancer le plan de 30 jours',
    viewPricing: 'Voir les tarifs (24,50 $ 1er mois)',
    officialApi: 'API officielle Meta Graph v21.0',
    stripeEncrypted: 'Paiements sécurisés Stripe 256 bits',
    moneyBack: 'Garantie satisfait ou remboursé',
    calendarTitle: 'INSTASK • Calendrier autonome de 30 jours',
    autopilotActive: 'Pilote automatique : ACTIF',
    stepPill: 'Moteur intelligent',
    stepHeading: 'De zéro à 30 jours publiés en 3 étapes',
    stepSubheading: 'Conçu spécifiquement pour les PME sans équipe marketing.',
    step1Title: 'Connexion multi-canal',
    step1Desc: 'Connexion par e-mail, code SMS ou Meta OAuth en moins de 15 secondes.',
    step2Title: 'Analyse concurrentielle',
    step2Desc: 'Extraction des meilleures accroches et hashtags de vos concurrents directs.',
    step3Title: 'Publication automatique',
    step3Desc: 'L’IA rédige, génère les visuels et publie selon votre calendrier précis.',
    pricingPill: 'Offre de bienvenue',
    pricingHeading: 'Tarification simple et transparente. -50% aujourd’hui.',
    pricingSubheading: 'Sans engagement. Annulation en 1 clic.',
    planName: 'Plan Pro Growth',
    planDesc: 'Moteur de croissance Instagram autonome',
    firstMonthBadge: 'pour le 1er mois avec FIRST50',
    claimDiscountBtn: 'Profiter de -50% et activer',
    f1: '30 modèles visuels IA (formats 1:1 et 4:5)',
    f2: 'Analyse de 5 concurrents directs',
    f3: 'Génération de légendes et hashtags par IA',
    f4: 'Publication certifiée Meta Graph API v21.0',
    f5: '10 langues mondiales avec prise en charge RTL',
    pricingLink: 'Tarifs',
    termsLink: 'Conditions d’utilisation',
    refundLink: 'Politique de remboursement',
    privacyLink: 'Politique de confidentialité',
  },
  de: {
    metaCert: 'Meta v21.0 Zertifiziert',
    pricingNav: 'Preise (50% Rabatt)',
    signIn: 'Anmelden',
    getStarted: 'Jetzt Starten',
    welcomeOffer: 'Willkommensangebot: 50% Rabatt aktiviert (Gutschein: FIRST50)',
    heroTitle1: 'Ihr Instagram auf Autopilot in nur',
    heroTitleHighlight: '3 einfachen Klicks.',
    heroDesc: 'Erstellen Sie 30 Tage hochkonvertierende Grafiken, virale Bildunterschriften und Hashtags. Vollautomatisches Posten über die offizielle Meta Graph API.',
    startGrowthPlan: '30-Tage-Wachstumsplan starten',
    viewPricing: 'Preise ansehen ($24.50 im ersten Monat)',
    officialApi: 'Offizielle Meta Graph API v21.0',
    stripeEncrypted: 'Stripe 256-Bit verschlüsselte Zahlungen',
    moneyBack: '100% Geld-zurück-Garantie',
    calendarTitle: 'INSTASK • 30-Tage Autonomer Kalender',
    autopilotActive: 'Autopilot: AKTIV',
    stepPill: 'Reibungslose Engine',
    stepHeading: 'Von Null zu 30 Tagen Veröffentlichung in 3 Schritten',
    stepSubheading: 'Speziell für kleine Unternehmen ohne eigenes Marketingteam entwickelt.',
    step1Title: 'Multi-Channel-Verbindung',
    step1Desc: 'In unter 15 Sekunden per E-Mail, SMS-Code oder Meta OAuth anmelden. Keine Passwörter gespeichert.',
    step2Title: 'Wettbewerbsanalyse',
    step2Desc: 'Unsere Engine analysiert die besten Beiträge Ihrer Mitbewerber, um erfolgreiche Inhalte zu erstellen.',
    step3Title: 'Autopilot-Veröffentlichung',
    step3Desc: 'KI generiert Texte, rendert Grafiken und veröffentlicht pünktlich nach Ihrem Zeitplan.',
    pricingPill: 'Willkommensrabatt',
    pricingHeading: 'Einfache, transparente Preise. Heute 50% sparen.',
    pricingSubheading: 'Jederzeit mit 1 Klick kündbar. Keine Mindestlaufzeit.',
    planName: 'Pro Growth Plan',
    planDesc: 'Autonomer Instagram-Wachstumsmotor',
    firstMonthBadge: 'im 1. Monat mit FIRST50',
    claimDiscountBtn: '50% Rabatt sichern & starten',
    f1: '30 KI-generierte visuelle Vorlagen (1:1 & 4:5)',
    f2: 'Wettbewerbsanalyse von 5 Mitbewerbern',
    f3: 'KI-gestützte Bildunterschriften & 3-Stufen-Hashtags',
    f4: 'Zertifizierte Meta Graph API v21.0 Veröffentlichung',
    f5: 'Unterstützung für 10 globale Sprachen',
    pricingLink: 'Preise',
    termsLink: 'Nutzungsbedingungen',
    refundLink: 'Rückerstattungsrichtlinie',
    privacyLink: 'Datenschutz',
  },
  pt: {
    metaCert: 'Certificado Meta v21.0',
    pricingNav: 'Preços (50% OFF)',
    signIn: 'Entrar',
    getStarted: 'Começar Agora',
    welcomeOffer: 'Oferta de Boas-Vindas: 50% de Desconto (Cupom: FIRST50)',
    heroTitle1: 'Seu Instagram no Piloto Automático em',
    heroTitleHighlight: '3 Cliques Rápidos.',
    heroDesc: 'Gere 30 dias de designs, legendas virais e hashtags. Analisamos seus principais concorrentes e publicamos diretamente pela API oficial da Meta.',
    startGrowthPlan: 'Iniciar Plano de 30 Dias',
    viewPricing: 'Ver Preços ($24.50 no 1º Mês)',
    officialApi: 'API Oficial Meta Graph v21.0',
    stripeEncrypted: 'Pagamentos Seguros Criptografados Stripe',
    moneyBack: 'Garantia de 100% de Reembolso',
    calendarTitle: 'INSTASK • Calendário Autônomo de 30 Dias',
    autopilotActive: 'Piloto Automático: ATIVO',
    stepPill: 'Motor Sem Fricção',
    stepHeading: 'Do zero a 30 dias de publicações em 3 passos',
    stepSubheading: 'Criado especificamente para pequenos negócios sem equipe de marketing.',
    step1Title: 'Conexão Multicanal',
    step1Desc: 'Acesse em menos de 15 segundos com E-mail, OTP de telefone ou Meta OAuth.',
    step2Title: 'Análise de Concorrentes',
    step2Desc: 'Extraímos os melhores formatos e hashtags dos concorrentes com melhor desempenho.',
    step3Title: 'Publicação Automática',
    step3Desc: 'A IA cria legendas, gera imagens em alta definição e publica no seu cronograma.',
    pricingPill: 'Desconto de Boas-Vindas',
    pricingHeading: 'Preço simples e transparente. 50% de desconto hoje.',
    pricingSubheading: 'Cancele a qualquer momento com 1 clique.',
    planName: 'Plano Pro Growth',
    planDesc: 'Motor autônomo de crescimento para Instagram',
    firstMonthBadge: 'no mês 1 com FIRST50',
    claimDiscountBtn: 'Garantir 50% OFF e Ativar',
    f1: '30 modelos visuais criados por IA (1:1 e 4:5)',
    f2: 'Análise de inteligência de 5 concorrentes',
    f3: 'Legendas com IA e automação de hashtags',
    f4: 'Publicação certificada via Meta Graph API v21.0',
    f5: 'Suporte a 10 idiomas globais com RTL',
    pricingLink: 'Preços',
    termsLink: 'Termos de Serviço',
    refundLink: 'Política de Reembolso',
    privacyLink: 'Privacidade',
  },
  ja: {
    metaCert: 'Meta v21.0 公式認定',
    pricingNav: '料金プラン (50%オフ)',
    signIn: 'ログイン',
    getStarted: '今すぐ開始',
    welcomeOffer: '初回限定オファー：50%割引を適用中 (クーポンコード: FIRST50)',
    heroTitle1: 'Instagram運用を完全に自動化、たったの',
    heroTitleHighlight: '3クリックで完了。',
    heroDesc: '30日分の投稿画像、バズるキャプション、最適なハッシュタグを一括自動生成。競合を分析し、Meta公式APIでスケジュール通りに自動投稿します。',
    startGrowthPlan: '30日間成長プランを開始',
    viewPricing: '料金を見る (初月 $24.50)',
    officialApi: '公式 Meta Graph API v21.0',
    stripeEncrypted: 'Stripe 256ビット暗号化決済',
    moneyBack: '100% 全額返金保証',
    calendarTitle: 'INSTASK • 30日間自動カレンダー',
    autopilotActive: '自動投稿: 有効',
    stepPill: '超高速エンジン',
    stepHeading: '3ステップでゼロから30日分の投稿を完了',
    stepSubheading: '専任マーケターのいない中小企業や個人クリエイター向けに設計。',
    step1Title: 'ワンクリック連携',
    step1Desc: 'メール、SMS認証、またはMeta OAuthで15秒以内にサインイン。',
    step2Title: '競合アカウント分析',
    step2Desc: '上位競合の人気リールやカルーセル投稿を自動分析し、成果の出るフックを抽出。',
    step3Title: '完全自動投稿',
    step3Desc: 'AIがコピー作成と画像レンダリングを行い、指定時刻に自動公開します。',
    pricingPill: '限定割引',
    pricingHeading: '明瞭でシンプルな料金体系。本日限定50%オフ。',
    pricingSubheading: 'いつでも1クリックで解約可能。契約の縛りはありません。',
    planName: 'Pro Growth プラン',
    planDesc: 'Instagram自動運用グロースエンジン',
    firstMonthBadge: 'FIRST50適用で初月割引',
    claimDiscountBtn: '50%オフで今すぐアクティベート',
    f1: '30種類のAI生成テンプレート (1:1 & 4:5)',
    f2: '競合5社の安全なインサイト分析',
    f3: 'AIキャプション＆3層ハッシュタグ自動化',
    f4: '認証済みMeta Graph APIコンテナ投稿',
    f5: '日本語を含む世界10言語に対応',
    pricingLink: '料金',
    termsLink: '利用規約',
    refundLink: '返金ポリシー',
    privacyLink: 'プライバシーポリシー',
  },
  id: {
    metaCert: 'Tersertifikasi Meta v21.0',
    pricingNav: 'Harga (Diskon 50%)',
    signIn: 'Masuk',
    getStarted: 'Mulai Sekarang',
    welcomeOffer: 'Penawaran Kreator Baru: Diskon 50% (Kupon: FIRST50)',
    heroTitle1: 'Instagram Anda di Autopilot Penuh Hanya dalam',
    heroTitleHighlight: '3 Klik Mudah.',
    heroDesc: 'Hasilkan konten 30 hari berupa grafik konversi tinggi, caption viral, dan tagar berjenjang. Kami menganalisis kompetitor dan menerbitkan langsung via Meta Graph API.',
    startGrowthPlan: 'Mulai Rencana 30 Hari',
    viewPricing: 'Lihat Harga ($24.50 Bulan Pertama)',
    officialApi: 'Meta Graph API v21.0 Resmi',
    stripeEncrypted: 'Pembayaran Terenkripsi 256-Bit Stripe',
    moneyBack: 'Garansi 100% Uang Kembali',
    calendarTitle: 'INSTASK • Kalender Otomatis 30 Hari',
    autopilotActive: 'Autopilot: AKTIF',
    stepPill: 'Mesin Tanpa Hambatan',
    stepHeading: 'Dari nol hingga konten 30 hari dalam 3 langkah',
    stepSubheading: 'Dirancang khusus untuk bisnis kecil tanpa tim pemasaran khusus.',
    step1Title: 'Koneksi Multi-Saluran',
    step1Desc: 'Masuk dengan Email, OTP Telepon, atau Meta OAuth dalam waktu kurang dari 15 detik.',
    step2Title: 'Analisis Kompetitor',
    step2Desc: 'Mesin kami memindai konten reels dan komidi putar terbaik kompetitor Anda untuk mengekstrak formula sukses.',
    step3Title: 'Penerbitan Otomatis',
    step3Desc: 'AI membuat teks, merender visual beresolusi tinggi, dan memposting sesuai jadwal tepat Anda.',
    pricingPill: 'Diskon Sambutan',
    pricingHeading: 'Harga sederhana dan transparan. Diskon 50% hari ini.',
    pricingSubheading: 'Batalkan kapan saja dalam 1 klik. Tanpa kontrak mengikat.',
    planName: 'Paket Pro Growth',
    planDesc: 'Mesin pertumbuhan Instagram otomatis',
    firstMonthBadge: 'bulan pertama dengan FIRST50',
    claimDiscountBtn: 'Klaim Diskon 50% & Aktifkan',
    f1: '30 template visual buatan AI (1:1 & 4:5)',
    f2: 'Analisis intelijen 5 kompetitor utama',
    f3: 'Otomatisasi caption AI & 3 tingkat tagar',
    f4: 'Penerbitan resmi tersertifikasi Meta Graph API v21.0',
    f5: 'Mendukung 10 bahasa global dengan RTL',
    pricingLink: 'Harga',
    termsLink: 'Ketentuan Layanan',
    refundLink: 'Kebijakan Pengembalian',
    privacyLink: 'Kebijakan Privasi',
  },
  ru: {
    metaCert: 'Сертификат Meta v21.0',
    pricingNav: 'Тарифы (Скидка 50%)',
    signIn: 'Войти',
    getStarted: 'Начать',
    welcomeOffer: 'Предложение для новых авторов: скидка 50% (Купон: FIRST50)',
    heroTitle1: 'Ваш Instagram на полном автопилоте всего за',
    heroTitleHighlight: '3 простых клика.',
    heroDesc: 'Создавайте 30 дней высококонверсионных постов, вирусных текстов и хештегов. Анализ конкурентов и прямая публикация через официальный Meta Graph API.',
    startGrowthPlan: 'Запустить 30-дневный план',
    viewPricing: 'Тарифы ($24.50 первый месяц)',
    officialApi: 'Официальный Meta Graph API v21.0',
    stripeEncrypted: 'Платежи зашифрованы Stripe 256-бит',
    moneyBack: '100% гарантия возврата средств',
    calendarTitle: 'INSTASK • 30-дневный автокалендарь',
    autopilotActive: 'Автопилот: АКТИВЕН',
    stepPill: 'Быстрый запуск',
    stepHeading: 'От идеи до 30 дней публикаций за 3 шага',
    stepSubheading: 'Создано специально для малого бизнеса без штатного маркетолога.',
    step1Title: 'Мультиканальный вход',
    step1Desc: 'Вход по Email, SMS коду или Meta OAuth менее чем за 15 секунд.',
    step2Title: 'Анализ конкурентов',
    step2Desc: 'Наша система анализирует лучшие публикации конкурентов и находит вирусные темы.',
    step3Title: 'Автоматическая публикация',
    step3Desc: 'ИИ создает тексты и визуалы высокого разрешения, публикуя их строго по вашему расписанию.',
    pricingPill: 'Скидка на старт',
    pricingHeading: 'Простые и прозрачные цены. Скидка 50% сегодня.',
    pricingSubheading: 'Отмена в любой момент в 1 клик. Без скрытых условий.',
    planName: 'Тариф Pro Growth',
    planDesc: 'Автоматический сервис продвижения в Instagram',
    firstMonthBadge: 'первый месяц с кодом FIRST50',
    claimDiscountBtn: 'Получить скидку 50% и активировать',
    f1: '30 визуальных шаблонов от ИИ (1:1 и 4:5)',
    f2: 'Анализ данных по 5 конкурентам',
    f3: 'Автоматические тексты и 3 уровня хештегов',
    f4: 'Официальная публикация через Meta Graph API v21.0',
    f5: 'Поддержка 10 мировых языков с RTL',
    pricingLink: 'Тарифы',
    termsLink: 'Условия обслуживания',
    refundLink: 'Политика возврата',
    privacyLink: 'Конфиденциальность',
  },
};

export default function PublicLandingPage({ params }: LandingPageProps) {
  const urlParams = useParams();
  const pathname = usePathname();

  // Extract locale from params or pathname
  const pathLocale = pathname ? pathname.split('/')[1] : null;
  const rawLocale = (urlParams?.locale as string) || params?.locale || pathLocale || 'en';
  const activeLocale = rawLocale.toLowerCase();

  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;
  const isRTL = activeLocale === 'ar';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
              </span>
              <span className="hidden sm:inline-flex mx-2 items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                {t.metaCert}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={activeLocale} />
            <Link
              href={`/${activeLocale}/pricing`}
              className="hidden md:inline-flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              {t.pricingNav}
            </Link>
            <Link
              href={`/${activeLocale}/login`}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-xs"
            >
              {t.signIn}
            </Link>
            <Link
              href={`/${activeLocale}/login`}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Welcome Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t.welcomeOffer}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t.heroTitle1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroDesc}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/${activeLocale}/login`}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>{t.startGrowthPlan}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href={`/${activeLocale}/pricing`}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm transition-all border border-slate-200 shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>{t.viewPricing}</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.officialApi}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              {t.stripeEncrypted}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {t.moneyBack}
            </span>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xl p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="mx-2 text-xs font-bold text-slate-700">{t.calendarTitle}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t.autopilotActive}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
                {[
                  { day: 'Day 1', theme: 'Behind The Scenes', hook: 'The 36-Hour Sourdough Secret', status: 'Published' },
                  { day: 'Day 2', theme: 'Social Proof', hook: 'Why Austin Foodies Drive 20 Miles', status: 'Published' },
                  { day: 'Day 3', theme: 'Educational', hook: '3 Flours Every Baker Must Know', status: 'Scheduled' },
                  { day: 'Day 4', theme: 'Problem & Solution', hook: 'Never Settle For Stale Bread Again', status: 'Scheduled' },
                ].map((post, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">{post.day}</span>
                      <span className={`px-1.5 py-0.2 rounded-full ${post.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
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
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.step1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.step2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.step3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {t.pricingPill}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              {t.pricingHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.pricingSubheading}
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-rose-500/40 p-8 sm:p-10 shadow-soft-md max-w-xl mx-auto text-left space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{t.planName}</h3>
                <p className="text-xs text-slate-500">{t.planDesc}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through mr-1.5">$49</span>
                <span className="text-4xl font-black text-slate-900">$24.50</span>
                <span className="text-[11px] text-emerald-600 font-bold block">{t.firstMonthBadge}</span>
              </div>
            </div>

            <div className="space-y-3">
              {[t.f1, t.f2, t.f3, t.f4, t.f5].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${activeLocale}/pricing`}
              className="w-full py-4 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{t.claimDiscountBtn}</span>
              <ArrowRight className={`w-4 h-4 text-rose-300 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-800">Instask</span>
            <span className="hidden sm:inline">•</span>
            <span>Operated by <strong>INSTASK</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium">Meta Graph API v21.0 Certified</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <Link href={`/${activeLocale}/pricing`} className="hover:text-slate-900 font-medium">{t.pricingLink}</Link>
            <Link href={`/${activeLocale}/terms`} className="hover:text-slate-900 font-medium">{t.termsLink}</Link>
            <Link href={`/${activeLocale}/refund-policy`} className="hover:text-slate-900 font-medium">{t.refundLink}</Link>
            <Link href={`/${activeLocale}/privacy`} className="hover:text-slate-900 font-medium">{t.privacyLink}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}