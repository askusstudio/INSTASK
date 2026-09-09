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
  // --- Global Major Languages ---
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
    f5: 'Idiomas globales y regionales con soporte nativo RTL',
    pricingLink: 'Precios',
    termsLink: 'Términos del Servicio',
    refundLink: 'Política de Reembolso',
    privacyLink: 'Política de Privacidad',
  },
  ar: {
    metaCert: 'معتمد من Meta v21.0',
    pricingNav: 'الأسعار (خصم 50%)',
    signIn: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن',
    welcomeOffer: 'عرض الترحيب للمبدعين: خصم 50% متاح الآن (كوبون: FIRST50)',
    heroTitle1: 'حساب إنستغرام الخاص بك في الوضع التلقائي بالكامل خلال',
    heroTitleHighlight: '3 نقرات سهلة.',
    heroDesc: 'قم بإنشاء محتوى لـ 30 يوماً من التصاميم الجذابة والتعليقات والوسوم الفعالة عبر واجهة Meta الرسمية.',
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
    f5: 'دعم متعدد اللغات مع دعم كامل للغة العربية RTL',
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
    heroDesc: 'Générez 30 jours de visuels percutants, légendes virales et hashtags. Analyse directe de vos concurrents et publication Meta API.',
    startGrowthPlan: 'Lancer le plan de 30 jours',
    viewPricing: 'Voir les tarifs (24,50 $ 1er mois)',
    officialApi: 'API officielle Meta Graph v21.0',
    stripeEncrypted: 'Paiements sécurisés Stripe 256 bits',
    moneyBack: 'Garantie satisfait ou remboursé',
    calendarTitle: 'INSTASK • Calendrier autonome de 30 jours',
    autopilotActive: 'Pilote automatique : ACTIF',
    stepPill: 'Moteur intelligent',
    stepHeading: 'De zéro à 30 jours publiés en 3 étapes',
    stepSubheading: 'Conçu pour les créateurs et entreprises sans équipe marketing.',
    step1Title: 'Connexion multi-canal',
    step1Desc: 'Connexion par e-mail, SMS ou Meta OAuth en moins de 15 secondes.',
    step2Title: 'Analyse concurrentielle',
    step2Desc: 'Extraction des meilleures idées de vos concurrents directs.',
    step3Title: 'Publication automatique',
    step3Desc: 'L’IA rédige et publie automatiquement selon votre calendrier.',
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
    f5: 'Support multilingue mondial avec prise en charge RTL',
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
    heroDesc: 'Erstellen Sie 30 Tage hochkonvertierende Grafiken, Bildunterschriften und Hashtags mit automatischer Meta API-Veröffentlichung.',
    startGrowthPlan: '30-Tage-Wachstumsplan starten',
    viewPricing: 'Preise ansehen ($24.50 im ersten Monat)',
    officialApi: 'Offizielle Meta Graph API v21.0',
    stripeEncrypted: 'Stripe 256-Bit verschlüsselte Zahlungen',
    moneyBack: '100% Geld-zurück-Garantie',
    calendarTitle: 'INSTASK • 30-Tage Autonomer Kalender',
    autopilotActive: 'Autopilot: AKTIV',
    stepPill: 'Reibungslose Engine',
    stepHeading: 'Von Null zu 30 Tagen Veröffentlichung in 3 Schritten',
    stepSubheading: 'Entwickelt für kleine Unternehmen und Content Creators.',
    step1Title: 'Multi-Channel-Verbindung',
    step1Desc: 'In unter 15 Sekunden per E-Mail, SMS oder Meta OAuth anmelden.',
    step2Title: 'Wettbewerbsanalyse',
    step2Desc: 'Unsere Engine analysiert erfolgreiche Posts Ihrer Konkurrenz.',
    step3Title: 'Autopilot-Veröffentlichung',
    step3Desc: 'KI generiert Inhalte und veröffentlicht pünktlich nach Zeitplan.',
    pricingPill: 'Willkommensrabatt',
    pricingHeading: 'Transparente Preise. Heute 50% sparen.',
    pricingSubheading: 'Jederzeit mit 1 Klick kündbar.',
    planName: 'Pro Growth Plan',
    planDesc: 'Autonomer Instagram-Wachstumsmotor',
    firstMonthBadge: 'im 1. Monat mit FIRST50',
    claimDiscountBtn: '50% Rabatt sichern & starten',
    f1: '30 KI-generierte visuelle Vorlagen (1:1 & 4:5)',
    f2: 'Wettbewerbsanalyse von 5 Mitbewerbern',
    f3: 'KI-gestützte Bildunterschriften & Hashtags',
    f4: 'Zertifizierte Meta Graph API v21.0 Veröffentlichung',
    f5: 'Globale Sprachunterstützung mit RTL',
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
    heroDesc: 'Gere 30 dias de designs, legendas virais e hashtags com publicação automática via Meta Graph API.',
    startGrowthPlan: 'Iniciar Plano de 30 Dias',
    viewPricing: 'Ver Preços ($24.50 no 1º Mês)',
    officialApi: 'API Oficial Meta Graph v21.0',
    stripeEncrypted: 'Pagamentos Seguros Criptografados Stripe',
    moneyBack: 'Garantia de 100% de Reembolso',
    calendarTitle: 'INSTASK • Calendário Autônomo de 30 Dias',
    autopilotActive: 'Piloto Automático: ATIVO',
    stepPill: 'Motor Sem Fricção',
    stepHeading: 'Do zero a 30 dias de publicações em 3 passos',
    stepSubheading: 'Criado para negócios locais e criadores sem time de marketing.',
    step1Title: 'Conexão Multicanal',
    step1Desc: 'Acesse em menos de 15 segundos com E-mail, SMS ou Meta OAuth.',
    step2Title: 'Análise de Concorrentes',
    step2Desc: 'Extraímos ganchos de alta performance de concorrentes de nicho.',
    step3Title: 'Publicação Automática',
    step3Desc: 'A IA cria legendas, gera imagens e agenda tudo para você.',
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
    f5: 'Suporte a idiomas globais e regionais com RTL',
    pricingLink: 'Preços',
    termsLink: 'Termos de Serviço',
    refundLink: 'Política de Reembolso',
    privacyLink: 'Privacidade',
  },
  it: {
    metaCert: 'Certificato Meta v21.0',
    pricingNav: 'Prezzi (-50%)',
    signIn: 'Accedi',
    getStarted: 'Inizia Ora',
    welcomeOffer: 'Offerta di Benvenuto: 50% di Sconto (Coupon: FIRST50)',
    heroTitle1: 'Il tuo Instagram in Pilota Automatico in',
    heroTitleHighlight: '3 Semplici Click.',
    heroDesc: 'Genera 30 giorni di contenuti grafici, didascalie virali e hashtag pubblicati direttamente tramite Meta API.',
    startGrowthPlan: 'Inizia il Piano di 30 Giorni',
    viewPricing: 'Vedi Prezzi ($24.50 Primo Mese)',
    officialApi: 'API Ufficiale Meta Graph v21.0',
    stripeEncrypted: 'Pagamenti Sicuri Crittografati Stripe',
    moneyBack: 'Garanzia di Rimborso al 100%',
    calendarTitle: 'INSTASK • Calendario Autonomo di 30 Giorni',
    autopilotActive: 'Pilota Automatico: ATTIVO',
    stepPill: 'Zero Sforzo',
    stepHeading: 'Da zero a 30 giorni di post in soli 3 passaggi',
    stepSubheading: 'Creato su misura per piccole imprese e creator indipendenti.',
    step1Title: 'Accesso Rapido',
    step1Desc: 'Accedi via Email, SMS o Meta OAuth in 15 secondi.',
    step2Title: 'Analisi della Concorrenza',
    step2Desc: 'Analizziamo i post migliori dei concorrenti per generare engagement.',
    step3Title: 'Pubblicazione Automatica',
    step3Desc: "L'IA crea immagini e testi, pubblicando automaticamente nel tuo orario preferito.",
    pricingPill: 'Sconto Speciale',
    pricingHeading: 'Prezzi semplici e chiari. 50% di sconto oggi.',
    pricingSubheading: 'Disdici quando vuoi con un click.',
    planName: 'Piano Pro Growth',
    planDesc: 'Motore autonomo di crescita Instagram',
    firstMonthBadge: 'per il 1° mese con FIRST50',
    claimDiscountBtn: 'Approfitta del 50% e Attiva',
    f1: '30 modelli grafici generati da IA',
    f2: 'Analisi automatica di 5 concorrenti',
    f3: 'Didascalie e hashtag intelligenti con IA',
    f4: 'Pubblicazione certificata tramite Meta Graph API',
    f5: 'Supporto a lingue globali e regionali',
    pricingLink: 'Prezzi',
    termsLink: 'Termini di Servizio',
    refundLink: 'Politica di Rimborso',
    privacyLink: 'Privacy',
  },
  ja: {
    metaCert: 'Meta v21.0 公式認定',
    pricingNav: '料金プラン (50%オフ)',
    signIn: 'ログイン',
    getStarted: '今すぐ開始',
    welcomeOffer: '初回限定オファー：50%割引を適用中 (クーポンコード: FIRST50)',
    heroTitle1: 'Instagram運用を完全に自動化、たったの',
    heroTitleHighlight: '3クリックで完了。',
    heroDesc: '30日分の投稿画像、バズるキャプション、最適なハッシュタグを一括自動生成。Meta公式APIでスケジュール通りに自動投稿します。',
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
    step2Desc: '人気リールやカルーセル投稿を自動分析し、成果の出るフックを抽出。',
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
    f5: '多言語およびRTLネイティブ対応',
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
    heroDesc: 'Hasilkan konten 30 hari berupa grafik konversi tinggi, caption viral, dan tagar berjenjang langsung via Meta Graph API.',
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
    step1Desc: 'Masuk dengan Email, OTP Telepon, atau Meta OAuth dalam 15 detik.',
    step2Title: 'Analisis Kompetitor',
    step2Desc: 'Memindai konten kompetitor terbaik untuk mengekstrak formula sukses.',
    step3Title: 'Penerbitan Otomatis',
    step3Desc: 'AI merender visual resolusi tinggi dan memposting sesuai jadwal tepat Anda.',
    pricingPill: 'Diskon Sambutan',
    pricingHeading: 'Harga sederhana dan transparan. Diskon 50% hari ini.',
    pricingSubheading: 'Batalkan kapan saja dalam 1 klik.',
    planName: 'Paket Pro Growth',
    planDesc: 'Mesin pertumbuhan Instagram otomatis',
    firstMonthBadge: 'bulan pertama dengan FIRST50',
    claimDiscountBtn: 'Klaim Diskon 50% & Aktifkan',
    f1: '30 template visual buatan AI (1:1 & 4:5)',
    f2: 'Analisis intelijen 5 kompetitor utama',
    f3: 'Otomatisasi caption AI & 3 tingkat tagar',
    f4: 'Penerbitan resmi tersertifikasi Meta Graph API v21.0',
    f5: 'Mendukung bahasa global dan regional dengan RTL',
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
    heroDesc: 'Создавайте 30 дней высококонверсионных постов, вирусных текстов и хештегов с прямой публикацией через Meta Graph API.',
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
    step1Desc: 'Вход по Email, SMS или Meta OAuth менее чем за 15 секунд.',
    step2Title: 'Анализ конкурентов',
    step2Desc: 'Анализ трендов и вирусных публикаций конкурентов.',
    step3Title: 'Автоматическая публикация',
    step3Desc: 'ИИ создает контент и публикует строго по расписанию.',
    pricingPill: 'Скидка на старт',
    pricingHeading: 'Простые и прозрачные цены. Скидка 50% сегодня.',
    pricingSubheading: 'Отмена в любой момент в 1 клик.',
    planName: 'Тариф Pro Growth',
    planDesc: 'Автоматический сервис продвижения в Instagram',
    firstMonthBadge: 'первый месяц с кодом FIRST50',
    claimDiscountBtn: 'Получить скидку 50% и активировать',
    f1: '30 визуальных шаблонов от ИИ (1:1 и 4:5)',
    f2: 'Анализ данных по 5 конкурентам',
    f3: 'Автоматические тексты и 3 уровня хештегов',
    f4: 'Официальная публикация через Meta Graph API v21.0',
    f5: 'Поддержка мировых и региональных языков',
    pricingLink: 'Тарифы',
    termsLink: 'Условия обслуживания',
    refundLink: 'Политика возврата',
    privacyLink: 'Конфиденциальность',
  },
  zh: {
    metaCert: 'Meta v21.0 官方认证',
    pricingNav: '价格 (5折优惠)',
    signIn: '登录',
    getStarted: '立即开始',
    welcomeOffer: '创作者迎新特惠：立享5折优惠 (优惠码: FIRST50)',
    heroTitle1: '轻松3步，实现 Instagram',
    heroTitleHighlight: '全自动运营。',
    heroDesc: '一键生成30天的高转化海报、爆款文案和精准标签，通过 Meta 官方 Graph API 自动定时发布。',
    startGrowthPlan: '开启30天增长计划',
    viewPricing: '查看价格 (首月仅需 $24.50)',
    officialApi: 'Meta Graph API v21.0 官方认证',
    stripeEncrypted: 'Stripe 256位加密安全支付',
    moneyBack: '100% 退款保证',
    calendarTitle: 'INSTASK • 30天全自动内容日历',
    autopilotActive: '自动托管: 已启动',
    stepPill: '极速引擎',
    stepHeading: '仅需3步，从零完成30天内容排期',
    stepSubheading: '专为没有专职营销团队的中小品牌和创作者打造。',
    step1Title: '多渠道快速连接',
    step1Desc: '支持邮箱、短信验证码或 Meta OAuth 一键登录。',
    step2Title: '竞品深度分析',
    step2Desc: '系统自动提炼同行最受欢迎文案与标签组合。',
    step3Title: '全自动定时发布',
    step3Desc: 'AI 自动排版并严格按设定时间自动发布。',
    pricingPill: '特惠折扣',
    pricingHeading: '透明简单的定价，今日立享5折优惠。',
    pricingSubheading: '随时一键取消，无任何捆绑合约。',
    planName: 'Pro 增长计划',
    planDesc: 'Instagram 自动化全托管增长引擎',
    firstMonthBadge: '使用 FIRST50 首月享特惠',
    claimDiscountBtn: '领取5折优惠并激活',
    f1: '30套 AI 生成视觉模板 (1:1 与 4:5 比例)',
    f2: '5家核心竞品智能数据分析',
    f3: 'AI 爆款文案与三级标签全自动生成',
    f4: '经 Meta Graph API v21.0 认证的官方发布接口',
    f5: '全面支持全球主流及区域语言',
    pricingLink: '定价',
    termsLink: '服务条款',
    refundLink: '退款政策',
    privacyLink: '隐私政策',
  },
  ko: {
    metaCert: 'Meta v21.0 공식 인증',
    pricingNav: '요금제 (50% 할인)',
    signIn: '로그인',
    getStarted: '시작하기',
    welcomeOffer: '신규 크리에이터 웰컴 혜택: 50% 즉시 할인 (쿠폰: FIRST50)',
    heroTitle1: '완전 자동화된 인스타그램 운영, 단',
    heroTitleHighlight: '3번의 쉬운 클릭으로.',
    heroDesc: '30일 치의 고전환 카드뉴스 이미지, 바이럴 캡션, 3단계 해시태그를 자동 생성하고 공식 Meta Graph API로 자동 발행합니다.',
    startGrowthPlan: '30일 성장 플랜 시작하기',
    viewPricing: '요금제 확인하기 (첫 달 $24.50)',
    officialApi: '공식 Meta Graph API v21.0',
    stripeEncrypted: 'Stripe 256비트 암호화 결제',
    moneyBack: '100% 전액 환불 보장',
    calendarTitle: 'INSTASK • 30일 자율 캘린더',
    autopilotActive: '오토파일럿: 활성화됨',
    stepPill: '간편 자동화 엔진',
    stepHeading: '단 3단계로 끝내는 30일 치 콘텐츠 게시',
    stepSubheading: '마케팅 전담 인력이 없는 소규모 비즈니스와 크리에이터를 위해 최적화되었습니다.',
    step1Title: '멀티 채널 간편 연동',
    step1Desc: '이메일, 문자 인증 또는 Meta OAuth를 통해 15초 만에 로그인합니다.',
    step2Title: '경쟁사 인텔리전스 분석',
    step2Desc: '타깃 업계 최고 성과 릴스와 게시물을 분석해 승리하는 공식을 추출합니다.',
    step3Title: '자동 예약 발행',
    step3Desc: 'AI가 디자인 렌더링부터 캡션 작성, 지정 일정 자동 발행까지 처리합니다.',
    pricingPill: '웰컴 할인',
    pricingHeading: '투명하고 직관적인 가격. 오늘 50% 할인받으세요.',
    pricingSubheading: '언제든 클릭 한 번으로 간편 해지 가능합니다.',
    planName: '프로 그로스 플랜',
    planDesc: '인스타그램 자율 성장 엔진',
    firstMonthBadge: 'FIRST50 쿠폰 적용 첫 달',
    claimDiscountBtn: '50% 할인받고 지금 시작하기',
    f1: '30종의 AI 맞춤형 비주얼 템플릿',
    f2: '경쟁사 5곳 스마트 데이터 분석',
    f3: 'AI 캡션 및 해시태그 자동 생성',
    f4: '공식 Meta Graph API 인증 발행',
    f5: '다국어 및 지역 언어 완벽 지원',
    pricingLink: '요금제',
    termsLink: '이용약관',
    refundLink: '환불 정책',
    privacyLink: '개인정보처리방침',
  },

  // --- Indian State / Regional Languages ---
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
    f5: 'हिंदी, अंग्रेजी सहित वैश्विक और भारतीय क्षेत्रीय भाषाओं का समर्थन',
    pricingLink: 'मूल्य निर्धारण',
    termsLink: 'सेवा की शर्तें',
    refundLink: 'वापसी नीति',
    privacyLink: 'गोपनीयता नीति',
  },
  bn: {
    metaCert: 'মেটা v21.0 সার্টিফাইড',
    pricingNav: 'মূল্যতালিকা (৫০% ছাড়)',
    signIn: 'লগইন করুন',
    getStarted: 'শুরু করুন',
    welcomeOffer: 'নতুন ক্রিয়েটরদের জন্য উপহার: ৫০% বিশেষ ছাড় (কুপন: FIRST50)',
    heroTitle1: 'আপনার ইনস্টাগ্রাম এখন সম্পূর্ণ অটোমেটেড, মাত্র',
    heroTitleHighlight: '৩টি সহজ ক্লিকে।',
    heroDesc: '৩০ দিনের নজরকাড়া গ্রাফিক্স, ভাইরাল ক্যাপশন এবং হ্যাশট্যাগ তৈরি করুন। আপনার প্রতিযোগীদের বিশ্লেষণ করে সরাসরি অফিসিয়াল মেটা এপিআই দিয়ে পোস্ট করুন।',
    startGrowthPlan: '৩০ দিনের গ্রোথ প্ল্যান শুরু করুন',
    viewPricing: 'মূল্য দেখুন ($২৪.৫০ প্রথম মাস)',
    officialApi: 'অফিসিয়াল মেটা গ্রাফ এপিআই v21.0',
    stripeEncrypted: 'স্ট্রাইপ ২৫৬-বিট সুরক্ষিত পেমেন্ট',
    moneyBack: '১০০% টাকা ফেরতের নিশ্চয়তা',
    calendarTitle: 'INSTASK • ৩০ দিনের স্বয়ংক্রিয় ক্যালেন্ডার',
    autopilotActive: 'অটোপাইলট: সক্রিয়',
    stepPill: 'সহজ ইঞ্জিন',
    stepHeading: 'শূন্য থেকে ৩০ দিনের কন্টেন্ট মাত্র ৩ ধাপে',
    stepSubheading: 'ছোট ব্যবসা ও ক্রিয়েটরদের জন্য বিশেষভাবে ডিজাইন করা হয়েছে।',
    step1Title: 'মাল্টি-চ্যানেল কানেক্ট',
    step1Desc: 'ইমেল, ফোন ওটিপি বা মেটা অথ দিয়ে ১৫ সেকেন্ডে সাইন ইন করুন।',
    step2Title: 'প্রতিযোগী বিশ্লেষণ',
    step2Desc: 'আপনার খাতের সেরা পারফর্ম করা রিল ও পোস্ট পর্যবেক্ষণ করে সফল ফর্মুলা সংগ্রহ করুন।',
    step3Title: 'স্বয়ংক্রিয় পাবলিশিং',
    step3Desc: 'এআই ক্যাপশন তৈরি করে, হাই-রেজোলিউশন ডিজাইন বানায় এবং সময়মতো পোস্ট করে।',
    pricingPill: 'ওয়েলকাম অফার',
    pricingHeading: 'সহজ ও স্পষ্ট মূল্য। আজই ৫০% ছাড় পান।',
    pricingSubheading: 'যেকোনো সময় ১ ক্লিকে বাতিল করুন।',
    planName: 'প্রো গ্রোথ প্ল্যান',
    planDesc: 'স্বয়ংক্রিয় ইনস্টাগ্রাম গ্রোথ সলিউশন',
    firstMonthBadge: 'FIRST50 কুপন সহ প্রথম মাসে',
    claimDiscountBtn: '৫০% ছাড় পান এবং সক্রিয় করুন',
    f1: '৩০টি এআই-জেনারেটেড ভিজ্যুয়াল টেমপ্লেট',
    f2: '৫টি শীর্ষ প্রতিযোগীর ডেটা বিশ্লেষণ',
    f3: 'এআই ক্যাপশন ও হ্যাশট্যাগ অটোমেশন',
    f4: 'মেটা গ্রাফ এপিআই v21.0 ভেরিফাইড পাবলিশিং',
    f5: 'বাংলা ও ভারতীয় আঞ্চলিক ভাষার সম্পূর্ণ সমর্থন',
    pricingLink: 'মূল্য',
    termsLink: 'ব্যবহারের শর্তাবলী',
    refundLink: 'রিফান্ড নীতি',
    privacyLink: 'গোপনীয়তা নীতি',
  },
  mr: {
    metaCert: 'मेटा v21.0 प्रमाणित',
    pricingNav: 'किंमत (५०% सूट)',
    signIn: 'साइन इन करा',
    getStarted: 'सुरू करा',
    welcomeOffer: 'नवीन क्रिएटर्ससाठी विशेष ऑफर: ५०% सूट (कूपन: FIRST50)',
    heroTitle1: 'तुमचे इंस्टाग्राम आता पूर्णपणे ऑटोपायलटवर, फक्त',
    heroTitleHighlight: '३ सोप्या क्लिक्समध्ये.',
    heroDesc: '३० दिवसांचे आकर्षक ग्राफिक्स, व्हायरल कॅप्शन आणि हॅशटॅग तयार करा. प्रतिस्पर्ध्यांचे विश्लेषण करून थेट अधिकृत मेटा API द्वारे पोस्ट करा.',
    startGrowthPlan: '३० दिवसांचा ग्रोथ प्लॅन सुरू करा',
    viewPricing: 'किंमत पहा ($२४.५० पहिला महिना)',
    officialApi: 'अधिकृत मेटा ग्राफ API v21.0',
    stripeEncrypted: 'स्ट्राइप २५६-बिट सुरक्षित पेमेंट',
    moneyBack: '१००% पैसे परत मिळण्याची हमी',
    calendarTitle: 'INSTASK • ३०-दिवसांचे ऑटोमॅटिक कॅलेंडर',
    autopilotActive: 'ऑटोपायलट: सक्रिय',
    stepPill: 'सोपे इंजिन',
    stepHeading: 'फक्त ३ पायऱ्यांमध्ये ३० दिवसांचे कंटेंट नियोजन',
    stepSubheading: 'लहान व्यवसाय आणि वैयक्तिक ब्रँड्ससाठी खास डिझाइन केलेले.',
    step1Title: 'मल्टी-चॅनल कनेक्ट',
    step1Desc: 'ईमेल, फोन ओटीपी किंवा मेटा द्वारे १५ सेकंदात लॉग इन करा.',
    step2Title: 'प्रतिस्पर्धी विश्लेषण',
    step2Desc: 'तुमच्या क्षेत्रातील व्हायरल रील्स आणि पोस्टचे सखोल विश्लेषण.',
    step3Title: 'स्वयंचलित प्रसिद्धी',
    step3Desc: 'AI कॅप्शन तयार करतो आणि ठरवलेल्या वेळेत थेट पोस्ट करतो.',
    pricingPill: 'स्वागत ऑफर',
    pricingHeading: 'पारदर्शक आणि सोपी किंमत. आजच ५०% सूट मिळवा.',
    pricingSubheading: 'कधीही १ क्लिकमध्ये रद्द करा.',
    planName: 'प्रो ग्रोथ प्लॅन',
    planDesc: 'स्वयंचलित इंस्टाग्राम वाढीचे इंजिन',
    firstMonthBadge: 'पहिल्या महिन्यासाठी FIRST50 सह',
    claimDiscountBtn: '५०% सूट मिळवा आणि सुरू करा',
    f1: '३० AI-जनरेटेड व्हिज्युअल टेम्पलेट्स',
    f2: '५ प्रमुख प्रतिस्पर्ध्यांचे विश्लेषण',
    f3: 'AI कॅप्शन आणि हॅशटॅग ऑटोमेशन',
    f4: 'प्रमाणित मेटा ग्राफ API द्वारे सुरक्षित पोस्टिंग',
    f5: 'मराठी व प्रादेशिक भारतीय भाषांचे समर्थन',
    pricingLink: 'किंमत',
    termsLink: 'सेवा अटी',
    refundLink: 'परतावा धोरण',
    privacyLink: 'गोपनीयता धोरण',
  },
  te: {
    metaCert: 'మెటా v21.0 సర్టిఫైడ్',
    pricingNav: 'ధరలు (50% తగ్గింపు)',
    signIn: 'లాగిన్ అవ్వండి',
    getStarted: 'ప్రారంభించండి',
    welcomeOffer: 'కొత్త క్రియేటర్లకు ఆహ్వాన ఆఫర్: 50% తగ్గింపు (కూపన్: FIRST50)',
    heroTitle1: 'మీ ఇన్‌స్టాగ్రామ్ ఇక పూర్తిగా ఆటోపైలట్‌లో, కేవలం',
    heroTitleHighlight: '3 సులభమైన క్లిక్‌లలో.',
    heroDesc: '30 రోజుల ఆకర్షణీయమైన గ్రాఫిక్స్, వైరల్ క్యాప్షన్లు, హ్యాష్‌ట్యాగ్‌లను రూపొందించండి. మెటా అధికారిక API ద్వారా నేరుగా పోస్ట్ చేయండి.',
    startGrowthPlan: '30-రోజుల గ్రోత్ ప్లాన్ ప్రారంభించండి',
    viewPricing: 'ధర చూడండి (మొదటి నెల $24.50)',
    officialApi: 'అధికారిక మెటా గ్రాఫ్ API v21.0',
    stripeEncrypted: 'స్ట్రైప్ 256-బిట్ సురక్షిత చెల్లింపులు',
    moneyBack: '100% మనీ-బ్యాక్ గ్యారెంటీ',
    calendarTitle: 'INSTASK • 30-రోజుల ఆటోమేటిక్ క్యాలెండర్',
    autopilotActive: 'ఆటోపైలట్: యాక్టివ్',
    stepPill: 'సులువైన ఇంజిన్',
    stepHeading: 'కేవలం 3 దశల్లో 30 రోజుల కంటెంట్ ప్రచురణ',
    stepSubheading: 'చిన్న వ్యాపారాలు మరియు క్రియేటర్ల కోసం ప్రత్యేకంగా రూపొందించబడింది.',
    step1Title: 'మల్టీ-ఛానల్ కనెక్ట్',
    step1Desc: 'ఇమెయిల్, ఫోన్ OTP లేదా మెటా ద్వారా 15 సెకన్లలో లాగిన్ అవ్వండి.',
    step2Title: 'పోటీదారుల విశ్లేషణ',
    step2Desc: 'మీ రంగంలోని అగ్ర పోటీదారుల పోస్టులను విశ్లేషించి ఉత్తమ ఐడియాలను అందిస్తుంది.',
    step3Title: 'ఆటోమేటిక్ పోస్టింగ్',
    step3Desc: 'AI క్యాప్షన్లను సిద్ధం చేసి, ఖచ్చితమైన సమయానికి పోస్ట్ చేస్తుంది.',
    pricingPill: 'వెల్కమ్ డిస్కౌంట్',
    pricingHeading: 'సరళమైన, పారదర్శకమైన ధరలు. నేడే 50% తగ్గింపు పొందండి.',
    pricingSubheading: 'ఎప్పుడైనా 1 క్లిక్‌తో రద్దు చేసుకోండి.',
    planName: 'ప్రో గ్రోత్ ప్లాన్',
    planDesc: 'ఇన్‌స్టాగ్రామ్ ఆటోమేటిక్ గ్రోత్ ఇంజిన్',
    firstMonthBadge: 'FIRST50 కూపన్‌తో మొదటి నెలకే',
    claimDiscountBtn: '50% తగ్గింపుతో ఇప్పుడే యాక్టివేట్ చేయండి',
    f1: '30 AI రూపొందించిన విజువల్ టెంప్లేట్‌లు',
    f2: '5 ప్రముఖ పోటీదారుల డేటా విశ్లేషణ',
    f3: 'AI క్యాప్షన్ & హ్యాష్‌ట్యాగ్ ఆటోమేషన్',
    f4: 'మెటా గ్రాఫ్ API ద్వారా సురక్షిత ప్రచురణ',
    f5: 'తెలుగు మరియు ఇతర భారతీయ ప్రాంతీయ భాషల మద్దతు',
    pricingLink: 'ధరలు',
    termsLink: 'సేవా నిబంధనలు',
    refundLink: 'రీఫండ్ విధానం',
    privacyLink: 'గోప్యతా విధానం',
  },
  ta: {
    metaCert: 'மெட்டா v21.0 அங்கீகரிக்கப்பட்டது',
    pricingNav: 'கட்டண விவரம் (50% தள்ளுபடி)',
    signIn: 'உள்நுழைய',
    getStarted: 'தொடங்குங்கள்',
    welcomeOffer: 'புதிய படைப்பாளர்களுக்கு 50% தள்ளுபடி (கூப்பன்: FIRST50)',
    heroTitle1: 'உங்கள் இன்ஸ்டாகிராம் இனி முழு தானியங்கி முறையில், வெறும்',
    heroTitleHighlight: '3 எளிய கிளிக்குகளில்.',
    heroDesc: '30 நாட்களுக்கான வைரல் கிராபிக்ஸ், தலைப்புகள் மற்றும் ஹேஷ்டேக்குகளை உருவாக்குங்கள். மெட்டாவின் அதிகாரப்பூர்வ API மூலம் தானாகவே பதிவிடுங்கள்.',
    startGrowthPlan: '30-நாள் வளர்ச்சி திட்டத்தைத் தொடங்குங்கள்',
    viewPricing: 'கட்டணம் பார்க்க ($24.50 முதல் மாதம்)',
    officialApi: 'அதிகாரப்பூர்வ மெட்டா கிராஃப் API v21.0',
    stripeEncrypted: 'ஸ்ட்ரைப் 256-பிட் பாதுகாப்பான கட்டணம்',
    moneyBack: '100% கட்டணத் திரும்பப் பெறும் உத்தரவாதம்',
    calendarTitle: 'INSTASK • 30-நாள் தானியங்கி நாட்காட்டி',
    autopilotActive: 'ஆட்டோபைலட்: செயல்படுகிறது',
    stepPill: 'எளிதான இயங்குதளம்',
    stepHeading: 'வெறும் 3 படிகளில் 30 நாட்களுக்கான பதிவுகள்',
    stepSubheading: 'சிறு வணிகங்கள் மற்றும் உள்ளடக்க உருவாக்குநர்களுக்காக வடிவமைக்கப்பட்டது.',
    step1Title: 'மல்டி-சேனல் இணைப்பு',
    step1Desc: 'மின்னஞ்சல், தொலைபேசி OTP அல்லது மெட்டா மூலம் 15 வினாடிகளில் உள்நுழையுங்கள்.',
    step2Title: 'போட்டியாளர் பகுப்பாய்வு',
    step2Desc: 'உங்கள் துறையில் உள்ள முன்னணி போட்டியாளர்களின் பதிவுகளை ஆய்வு செய்கிறது.',
    step3Title: 'தானியங்கி வெளியீடு',
    step3Desc: 'AI தலைப்புகளை எழுதி, அட்டவணைப்படி சரியான நேரத்தில் வெளியிடுகிறது.',
    pricingPill: 'வரவேற்பு தள்ளுபடி',
    pricingHeading: 'வெளிப்படையான விலை. இன்றே 50% தள்ளுபடி பெறுங்கள்.',
    pricingSubheading: 'எப்போது வேண்டுமானாலும் 1 கிளிக்கில் ரத்து செய்யலாம்.',
    planName: 'ப்ரோ குரோத் திட்டம்',
    planDesc: 'இன்ஸ்டாகிராம் தானியங்கி வளர்ச்சி தளம்',
    firstMonthBadge: 'FIRST50 கூப்பனுடன் முதல் மாதத்திற்கு',
    claimDiscountBtn: '50% தள்ளுபடியுடன் செயல்படுத்துங்கள்',
    f1: '30 AI-உருவாக்கிய காட்சி வார்ப்புருக்கள்',
    f2: '5 முக்கிய போட்டியாளர்களின் தரவு பகுப்பாய்வு',
    f3: 'AI தலைப்புகள் மற்றும் ஹேஷ்டேக் ஆட்டோமேஷன்',
    f4: 'அங்கீகரிக்கப்பட்ட மெட்டா கிராஃப் API மூலம் வெளியீடு',
    f5: 'தமிழ் உள்ளிட்ட உலகளாவிய மற்றும் இந்திய மொழிகள்',
    pricingLink: 'விலை',
    termsLink: 'சேவை விதிமுறைகள்',
    refundLink: 'பணம் திரும்பப்பெறும் கொள்கை',
    privacyLink: 'தனியுரிமைக் கொள்கை',
  },
  gu: {
    metaCert: 'મેટા v21.0 પ્રમાણિત',
    pricingNav: 'કિંમતો (૫૦% છૂટ)',
    signIn: 'સાઇન ઇન કરો',
    getStarted: 'શરૂ કરો',
    welcomeOffer: 'નવા ક્રિએટર્સ માટે ઓફર: ૫૦% ની વિશેષ છૂટ (કૂપન: FIRST50)',
    heroTitle1: 'તમારું ઇન્સ્ટાગ્રામ હવે સંપૂર્ણ ઓટોપાયલટ પર, માત્ર',
    heroTitleHighlight: '૩ સરળ ક્લિક્સમાં.',
    heroDesc: '૩૦ દિવસના આકર્ષક ગ્રાફિક્સ, વાયરલ કૅપ્શન્સ અને હૅશટૅગ્સ બનાવો. સ્પર્ધકોનું વિશ્લેષણ કરીને સીધા અધિકૃત મેટા API દ્વારા પોસ્ટ કરો.',
    startGrowthPlan: '૩૦-દિવસનો ગ્રોથ પ્લાન શરૂ કરો',
    viewPricing: 'કિંમત જુઓ ($૨૪.૫૦ પ્રથમ મહિનો)',
    officialApi: 'અધિકૃત મેટા ગ્રાફ API v21.0',
    stripeEncrypted: 'સ્ટ્રાઇપ ૨૫૬-બીટ સુરક્ષિત ચુકવણી',
    moneyBack: '૧૦૦% નાણાં વાપસી ગેરંટી',
    calendarTitle: 'INSTASK • ૩૦-દિવસનું સ્વચાલિત કૅલેન્ડર',
    autopilotActive: 'ઓટોપાયલટ: સક્રિય',
    stepPill: 'ઝડપી એન્જિન',
    stepHeading: 'માત્ર ૩ સરળ પગલાંમાં ૩૦ દિવસનું કન્ટેન્ટ તૈયાર',
    stepSubheading: 'નાના વેપારીઓ અને ક્રિએટર્સ માટે ખાસ બનાવવામાં આવ્યું છે.',
    step1Title: 'મલ્ટી-ચેનલ કનેક્ટ',
    step1Desc: 'ઈમેલ, ફોન ઓટીપી અથવા મેટા દ્વારા ૧૫ સેકન્ડમાં લોગિન કરો.',
    step2Title: 'સ્પર્ધક વિશ્લેષણ',
    step2Desc: 'તમારા ક્ષેત્રના ટોચના સ્પર્ધકોની લોકપ્રિય પોસ્ટ્સનું સ્માર્ટ વિશ્લેષણ.',
    step3Title: 'ઓટોમેટિક પબ્લિશિંગ',
    step3Desc: 'AI કૅપ્શન બનાવે છે અને નક્કી કરેલા સમયે આપોઆપ પોસ્ટ કરે છે.',
    pricingPill: 'વેલકમ ઓફર',
    pricingHeading: 'સરળ અને પારદર્શક કિંમતો. આજે જ ૫૦% છૂટ મેળવો.',
    pricingSubheading: 'ગમે ત્યારે ૧ ક્લિકમાં રદ કરો.',
    planName: 'પ્રો ગ્રોથ પ્લાન',
    planDesc: 'સ્વચાલિત ઇન્સ્ટાગ્રામ ગ્રોથ એન્જિન',
    firstMonthBadge: 'FIRST50 કૂપન સાથે પ્રથમ મહિના માટે',
    claimDiscountBtn: '૫૦% છૂટ સાથે હમણાં સક્રિય કરો',
    f1: '૩૦ AI-જનરેટેડ વિઝ્યુઅલ ટેમ્પ્લેટ્સ',
    f2: '૫ અગ્રણી સ્પર્ધકોનું ઇન્ટેલિજન્સ એનાલિસિસ',
    f3: 'AI કૅપ્શન અને હૅશટૅગ ઓટોમેશન',
    f4: 'પ્રમાણિત મેટા ગ્રાફ API દ્વારા સલામત પોસ્ટિંગ',
    f5: 'ગુજરાતી સહિત ભારતની પ્રાદેશિક ભાષાઓનું સમર્થન',
    pricingLink: 'કિંમતો',
    termsLink: 'સેવાની શરતો',
    refundLink: 'રિફંડ નીતિ',
    privacyLink: 'ગોપનીયતા નીતિ',
  },
  kn: {
    metaCert: 'ಮೆಟಾ v21.0 ಪ್ರಮಾಣೀಕೃತ',
    pricingNav: 'ದರಗಳು (50% ರಿಯಾಯಿತಿ)',
    signIn: 'ಸೈನ್ ಇನ್',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    welcomeOffer: 'ಹೊಸ ಕ್ರಿಯೇಟರ್‌ಗಳಿಗೆ ಸ್ವಾಗತ ಕೊಡುಗೆ: 50% ರಿಯಾಯಿತಿ (ಕೂಪನ್: FIRST50)',
    heroTitle1: 'ನಿಮ್ಮ ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಈಗ ಸಂಪೂರ್ಣ ಆಟೋಪೈಲಟ್‌ನಲ್ಲಿ, ಕೇವಲ',
    heroTitleHighlight: '3 ಸುಲಭ ಕ್ಲಿಕ್‌ಗಳಲ್ಲಿ.',
    heroDesc: '30 ದಿನಗಳ ಆಕರ್ಷಕ ಗ್ರಾಫಿಕ್ಸ್, ವೈರಲ್ ಕ್ಯಾಪ್ಷನ್‌ಗಳು ಮತ್ತು ಹ್ಯಾಶ್‌ಟ್ಯಾಗ್‌ಗಳನ್ನು ರಚಿಸಿ. ಅಧಿಕೃತ ಮೆಟಾ API ಮೂಲಕ ನೇರವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಿ.',
    startGrowthPlan: '30-ದಿನಗಳ ಬೆಳವಣಿಗೆಯ ಯೋಜನೆ ಆರಂಭಿಸಿ',
    viewPricing: 'ದರ ನೋಡಿ (ಮೊದಲ ತಿಂಗಳು $24.50)',
    officialApi: 'ಅಧಿಕೃತ ಮೆಟಾ ಗ್ರಾಫ್ API v21.0',
    stripeEncrypted: 'ಸ್ಟ್ರೈಪ್ 256-ಬಿಟ್ ಸುರಕ್ಷಿತ ಪಾವತಿ',
    moneyBack: '100% ಹಣ ಮರುಪಾವತಿ ಭರವಸೆ',
    calendarTitle: 'INSTASK • 30-ದಿನಗಳ ಸ್ವಯಂಚಾಲಿತ ಕ್ಯಾಲೆಂಡರ್',
    autopilotActive: 'ಆಟೋಪೈಲಟ್: ಸಕ್ರಿಯವಾಗಿದೆ',
    stepPill: 'ಸರಳ ಎಂಜಿನ್',
    stepHeading: 'ಕೇವಲ 3 ಹಂತಗಳಲ್ಲಿ 30 ದಿನಗಳ ಕಂಟೆಂಟ್ ಪೋಸ್ಟಿಂಗ್',
    stepSubheading: 'ಸಣ್ಣ ಉದ್ಯಮಗಳು ಮತ್ತು ಕ್ರಿಯೇಟರ್‌ಗಳಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
    step1Title: 'ಮಲ್ಟಿ-ಚಾನೆಲ್ ಸಂಪರ್ಕ',
    step1Desc: 'ಇಮೇಲ್, ಫೋನ್ OTP ಅಥವಾ ಮೆಟಾ ಮೂಲಕ 15 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ.',
    step2Title: 'ಪ್ರತಿಸ್ಪರ್ಧಿಗಳ ವಿಶ್ಲೇಷಣೆ',
    step2Desc: 'ನಿಮ್ಮ ಕ್ಷೇತ್ರದ ಪ್ರಮುಖ ಪ್ರತಿಸ್ಪರ್ಧಿಗಳ ಅತ್ಯುತ್ತಮ ಪೋಸ್ಟ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ.',
    step3Title: 'ಸ್ವಯಂಚಾಲಿತ ಪ್ರಕಟಣೆ',
    step3Desc: 'AI ಕ್ಯಾಪ್ಷನ್‌ಗಳನ್ನು ಬರೆದು ನಿಗದಿತ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪೋಸ್ಟ್ ಮಾಡುತ್ತದೆ.',
    pricingPill: 'ಸ್ವಾಗತ ರಿಯಾಯಿತಿ',
    pricingHeading: 'ಸರಳ ಮತ್ತು ಪಾರದರ್ಶಕ ದರಗಳು. ಇಂದೇ 50% ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ.',
    pricingSubheading: 'ಯಾವಾಗ ಬೇಕಾದರೂ 1 ಕ್ಲಿಕ್‌ನಲ್ಲಿ ರದ್ದುಗೊಳಿಸಿ.',
    planName: 'ಪ್ರೊ ಗ್ರೋತ್ ಪ್ಲಾನ್',
    planDesc: 'ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಸ್ವಯಂಚಾಲಿತ ಬೆಳವಣಿಗೆಯ ಎಂಜಿನ್',
    firstMonthBadge: 'FIRST50 ಕೂಪನ್‌ನೊಂದಿಗೆ ಮೊದಲ ತಿಂಗಳು',
    claimDiscountBtn: '50% ರಿಯಾಯಿತಿ ಪಡೆದು ಈಗಲೇ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    f1: '30 AI ರಚಿತ ದೃಶ್ಯ ಟೆಂಪ್ಲೇಟ್‌ಗಳು',
    f2: '5 ಪ್ರಮುಖ ಪ್ರತಿಸ್ಪರ್ಧಿಗಳ ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ',
    f3: 'AI ಕ್ಯಾಪ್ಷನ್ ಮತ್ತು ಹ್ಯಾಶ್‌ಟ್ಯಾಗ್ ಆಟೊಮೇಷನ್',
    f4: 'ಮೆಟಾ ಗ್ರಾಫ್ API ಮೂಲಕ ಸುರಕ್ಷಿತ ಪ್ರಕಟಣೆ',
    f5: 'ಕನ್ನಡ ಮತ್ತು ಇತರ ಭಾರತೀಯ ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳ ಬೆಂಬಲ',
    pricingLink: 'ದರಗಳು',
    termsLink: 'ಸೇವಾ ನಿಯಮಗಳು',
    refundLink: 'ಮರುಪಾವತಿ ನೀತಿ',
    privacyLink: 'ಗೌಪ್ಯತಾ ನೀತಿ',
  },
  ml: {
    metaCert: 'മെറ്റാ v21.0 അംഗീകൃതം',
    pricingNav: 'വിലവിവരങ്ങൾ (50% കിഴിവ്)',
    signIn: 'സൈൻ ഇൻ',
    getStarted: 'ആരംഭിക്കുക',
    welcomeOffer: 'പുതിയ ക്രിയേറ്റർമാർക്ക് സ്വാഗത ഓഫർ: 50% കിഴിവ് (കൂപ്പൺ: FIRST50)',
    heroTitle1: 'നിങ്ങളുടെ ഇൻസ്റ്റാഗ്രാം ഇനി പൂർണ്ണമായും ഓട്ടോപൈലറ്റിൽ, വെറും',
    heroTitleHighlight: '3 ലളിതമായ ക്ലിക്കുകളിൽ.',
    heroDesc: '30 ദിവസത്തെ വൈറൽ ഗ്രാഫിക്സുകളും ആകർഷകമായ അടിക്കുറിപ്പുകളും നിർമ്മിച്ച് ഔദ്യോഗിക മെറ്റാ API വഴി സ്വയമേവ പോസ്റ്റ് ചെയ്യുക.',
    startGrowthPlan: '30 ദിവസത്തെ ഗ്രോത്ത് പ്ലാൻ ആരംഭിക്കുക',
    viewPricing: 'വില വിവരങ്ങൾ കാണുക ($24.50 ആദ്യ മാസം)',
    officialApi: 'ഔദ്യോഗിക മെറ്റാ ഗ്രാഫ് API v21.0',
    stripeEncrypted: 'സ്ട്രൈപ്പ് 256-ബിറ്റ് സുരക്ഷിത പേയ്‌മെന്റുകൾ',
    moneyBack: '100% പണം തിരികെ നൽകുന്ന ഗ്യാരണ്ടി',
    calendarTitle: 'INSTASK • 30 ദിവസത്തെ ഓട്ടോമാറ്റിക് കലണ്ടർ',
    autopilotActive: 'ഓട്ടോപൈലറ്റ്: സജീവം',
    stepPill: 'ലളിതമായ എഞ്ചിൻ',
    stepHeading: 'വെറും 3 ഘട്ടങ്ങളിലൂടെ 30 ദിവസത്തെ ഉള്ളടക്കം',
    stepSubheading: 'ചെറുകിട സംരംഭകർക്കും ക്രിയേറ്റർമാർക്കുമായി പ്രത്യേകമായി രൂപകൽപ്പന ചെയ്തത്.',
    step1Title: 'മൾട്ടി-ചാനൽ കണക്റ്റ്',
    step1Desc: 'ഇമെയിൽ, ഫോൺ OTP അല്ലെങ്കിൽ മെറ്റാ വഴി 15 സെക്കൻഡിനുള്ളിൽ ലോഗിൻ ചെയ്യുക.',
    step2Title: 'മത്സര വിശകലനം',
    step2Desc: 'നിങ്ങളുടെ രംഗത്തെ മികച്ച പോസ്റ്റുകൾ വിശകലനം ചെയ്ത് മികച്ച ഫോർമുലകൾ കണ്ടെത്തുന്നു.',
    step3Title: 'ഓട്ടോമാറ്റിക് പ്രസിദ്ധീകരണം',
    step3Desc: 'AI അടിക്കുറിപ്പുകൾ തയ്യാറാക്കി കൃത്യസമയത്ത് പോസ്റ്റ് ചെയ്യുന്നു.',
    pricingPill: 'പ്രത്യേക കിഴിവ്',
    pricingHeading: 'ലളിതവും വ്യക്തവുമായ നിരക്കുകൾ. ഇന്ന് 50% കിഴിവ് നേടൂ.',
    pricingSubheading: 'എപ്പോൾ വേണമെങ്കിലും 1 ക്ലിക്കിൽ റദ്ദാക്കാം.',
    planName: 'പ്രോ ഗ്രോത്ത് പ്ലാൻ',
    planDesc: 'ഇൻസ്റ്റാഗ്രാം ഓട്ടോമാറ്റിക് ഗ്രോത്ത് എഞ്ചിൻ',
    firstMonthBadge: 'FIRST50 കൂപ്പൺ ഉപയോഗിച്ച് ആദ്യ മാസം',
    claimDiscountBtn: '50% കിഴിവോടെ ഇപ്പോൾ സജീവമാക്കുക',
    f1: '30 AI നിർമ്മിത വിഷ്വൽ ടെംപ്ലേറ്റുകൾ',
    f2: '5 മുൻനിര എതിരാളികളുടെ ഡാറ്റാ വിശകലനം',
    f3: 'AI അടിക്കുറിപ്പുകളും ഹാഷ്‌ടാഗ് ഓട്ടോമേഷനും',
    f4: 'മെറ്റാ ഗ്രാഫ് API വഴി സുരക്ഷിത പോസ്റ്റിംഗ്',
    f5: 'മലയാളം ഉൾപ്പെടെയുള്ള ഇന്ത്യൻ പ്രാദേശിക ഭാഷകൾ',
    pricingLink: 'വിലവിവരങ്ങൾ',
    termsLink: 'സേവന നിബന്ധനകൾ',
    refundLink: 'റീഫണ്ട് നയം',
    privacyLink: 'സ്വകാര്യതാ നയം',
  },
  pa: {
    metaCert: 'ਮੈਟਾ v21.0 ਪ੍ਰਮਾਣਿਤ',
    pricingNav: 'ਕੀਮਤਾਂ (50% ਛੋਟ)',
    signIn: 'ਸਾਈਨ ਇਨ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    welcomeOffer: 'ਨਵੇਂ ਕ੍ਰਿਏਟਰਾਂ ਲਈ ਖਾਸ ਆਫਰ: 50% ਛੋਟ (ਕੂਪਨ: FIRST50)',
    heroTitle1: 'ਤੁਹਾਡਾ ਇੰਸਟਾਗ੍ਰਾਮ ਹੁਣ ਪੂਰੀ ਤਰ੍ਹਾਂ ਆਟੋਪਾਇਲਟ ਤੇ, ਸਿਰਫ਼',
    heroTitleHighlight: '3 ਆਸਾਨ ਕਲਿੱਕਾਂ ਵਿੱਚ।',
    heroDesc: '30 ਦਿਨਾਂ ਦੇ ਵਾਇਰਲ ਗ੍ਰਾਫਿਕਸ, ਕੈਪਸ਼ਨ ਅਤੇ ਹੈਸ਼ਟੈਗ ਤਿਆਰ ਕਰੋ। ਸਿੱਧਾ ਅਧਿਕਾਰਤ ਮੈਟਾ API ਰਾਹੀਂ ਆਟੋ-ਪੋਸਟ ਕਰੋ।',
    startGrowthPlan: '30-ਦਿਨਾਂ ਦਾ ਗ੍ਰੋਥ ਪਲਾਨ ਸ਼ੁਰੂ ਕਰੋ',
    viewPricing: 'ਕੀਮਤ ਦੇਖੋ ($24.50 ਪਹਿਲਾ ਮਹੀਨਾ)',
    officialApi: 'ਅਧਿਕਾਰਤ ਮੈਟਾ ਗ੍ਰਾਫ API v21.0',
    stripeEncrypted: 'ਸਟ੍ਰਾਈਪ 256-ਬਿੱਟ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ',
    moneyBack: '100% ਪੈਸੇ ਵਾਪਸੀ ਦੀ ਗਾਰੰਟੀ',
    calendarTitle: 'INSTASK • 30-ਦਿਨਾਂ ਦਾ ਆਟੋਮੈਟਿਕ ਕੈਲੰਡਰ',
    autopilotActive: 'ਆਟੋਪਾਇਲਟ: ਐਕਟਿਵ',
    stepPill: 'ਆਸਾਨ ਇੰਜਣ',
    stepHeading: 'ਸਿਰਫ਼ 3 ਕਦਮਾਂ ਵਿੱਚ 30 ਦਿਨਾਂ ਦਾ ਕੰਟੈਂਟ ਪਬਲਿਸ਼',
    stepSubheading: 'ਛੋਟੇ ਕਾਰੋਬਾਰਾਂ ਅਤੇ ਕ੍ਰਿਏਟਰਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ ਤੇ ਤਿਆਰ ਕੀਤਾ ਗਿਆ।',
    step1Title: 'ਮਲਟੀ-ਚੈਨਲ ਕਨੈਕਟ',
    step1Desc: 'ਈਮੇਲ, ਫ਼ੋਨ OTP ਜਾਂ ਮੈਟਾ ਰਾਹੀਂ 15 ਸਕਿੰਟਾਂ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ।',
    step2Title: 'ਮੁਕਾਬਲੇਬਾਜ਼ਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    step2Desc: 'ਤੁਹਾਡੇ ਮੁਕਾਬਲੇਬਾਜ਼ਾਂ ਦੀਆਂ ਵਾਇਰਲ ਰੀਲਾਂ ਅਤੇ ਪੋਸਟਾਂ ਦਾ ਡੂੰਘਾ ਵਿਸ਼ਲੇਸ਼ਣ।',
    step3Title: 'ਆਟੋਮੈਟਿਕ ਪਬਲਿਸ਼ਿੰਗ',
    step3Desc: 'AI ਕੈਪਸ਼ਨ ਤਿਆਰ ਕਰਦਾ ਹੈ ਅਤੇ ਸਹੀ ਸਮੇਂ ਤੇ ਆਪਣੇ ਆਪ ਪੋਸਟ ਕਰਦਾ ਹੈ।',
    pricingPill: 'ਵੈਲਕਮ ਛੋਟ',
    pricingHeading: 'ਸਪੱਸ਼ਟ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਕੀਮਤਾਂ। ਅੱਜ ਹੀ 50% ਛੋਟ ਪਾਓ।',
    pricingSubheading: 'ਕਿਸੇ ਵੀ ਸਮੇਂ 1 ਕਲਿੱਕ ਵਿੱਚ ਰੱਦ ਕਰੋ।',
    planName: 'ਪ੍ਰੋ ਗ੍ਰੋਥ ਪਲਾਨ',
    planDesc: 'ਇੰਸਟਾਗ੍ਰਾਮ ਆਟੋਮੈਟਿਕ ਗ੍ਰੋਥ ਇੰਜਣ',
    firstMonthBadge: 'FIRST50 ਕੂਪਨ ਨਾਲ ਪਹਿਲੇ ਮਹੀਨੇ ਲਈ',
    claimDiscountBtn: '50% ਛੋਟ ਲਵੋ ਅਤੇ ਐਕਟਿਵ ਕਰੋ',
    f1: '30 AI-ਤਿਆਰ ਵਿਜ਼ੂਅਲ ਟੈਂਪਲੇਟਸ',
    f2: '5 ਮੁੱਖ ਮੁਕਾਬਲੇਬਾਜ਼ਾਂ ਦਾ ਡਾਟਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    f3: 'AI ਕੈਪਸ਼ਨ ਅਤੇ ਹੈਸ਼ਟੈਗ ਆਟੋਮੇਸ਼ਨ',
    f4: 'ਮੈਟਾ ਗ੍ਰਾਫ API v21.0 ਪ੍ਰਮਾਣਿਤ ਪਬਲਿਸ਼ਿੰਗ',
    f5: 'ਪੰਜਾਬੀ ਅਤੇ ਹੋਰ ਭਾਰਤੀ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ ਦਾ ਸਮਰਥਨ',
    pricingLink: 'ਕੀਮਤਾਂ',
    termsLink: 'ਸੇਵਾ ਦੇ ਨਿਯਮ',
    refundLink: 'ਰਿਫੰਡ ਨੀਤੀ',
    privacyLink: 'ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ',
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