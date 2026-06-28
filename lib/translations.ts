export type Locale = "he" | "en" | "fr";

export interface T {
  nav: { home: string; properties: string; blog: string; about: string; contact: string; message: string; close: string; open: string; };
  hero: { eyebrow: string; line1: string; line2: string; subtitle: string; cta_properties: string; cta_contact: string; rating: string; };
  stats: { experience: string; deals: string; rating: string; office: string; office_value: string; };
  sections: {
    properties: { eyebrow: string; title: string; all: string; };
    about: { eyebrow: string; quote: string; read_more: string; };
    testimonials: { eyebrow: string; title: string; all: string; };
    cta: { eyebrow: string; title1: string; title2: string; subtitle: string; whatsapp: string; };
    blog: { eyebrow: string; title: string; all: string; };
  };
  footer: { tagline: string; quick_nav: string; contact: string; legal: string; privacy: string; accessibility: string; copyright: string; license: string; };
  cookie: { message: string; accept: string; decline: string; privacy_link: string; };
  theme: { dark: string; light: string; };
}

export const translations: Record<Locale, T> = {
  he: {
    nav: {
      home: "בית",
      properties: "נכסים",
      blog: "בלוג",
      about: "אודות",
      contact: "צור קשר",
      message: "שלח הודעה",
      close: "סגור תפריט",
      open: "פתח תפריט",
    },
    hero: {
      eyebrow: 'הירקון 319, נמל ת"א',
      line1: "עידן",
      line2: "לנדל״ן",
      subtitle: "עשרים שנות ניסיון בתיווך ושיווק נדל״ן יוקרה. שקיפות מלאה, תוצאות אמיתיות.",
      cta_properties: "גלה נכסים",
      cta_contact: "דבר עם עידן",
      rating: "דירוג גוגל",
    },
    stats: {
      experience: "שנות ניסיון",
      deals: "עסקאות שהושלמו",
      rating: "דירוג בגוגל",
      office: "כתובת המשרד",
      office_value: "נמל ת״א",
    },
    sections: {
      properties: {
        eyebrow: "נכסים נבחרים",
        title: "הנכסים שלנו",
        all: "כל הנכסים",
      },
      about: {
        eyebrow: "אודות",
        quote: "עסקת נדל״ן טובה\nמשנה חיים.",
        read_more: "קרא עוד עלי",
      },
      testimonials: {
        eyebrow: "לקוחות מדברים",
        title: "מה אומרים עלינו",
        all: "כל הביקורות בגוגל",
      },
      cta: {
        eyebrow: "מוכנים לצעד הבא?",
        title1: "בואו נמצא את",
        title2: "הנכס המושלם שלכם",
        subtitle:
          "מוכרים, קונים, משכירים או מחפשים השקעה — עידן חולי כאן לענות על כל שאלה.",
        whatsapp: "שלח הודעה ב-WhatsApp",
      },
      blog: {
        eyebrow: "בלוג",
        title: "כתבות ותובנות",
        all: "כל הכתבות",
      },
    },
    footer: {
      tagline: "20 שנות ניסיון בתיווך, יזמות ושיווק נדל״ן יוקרה בגוש דן.",
      quick_nav: "ניווט מהיר",
      contact: "צור קשר",
      legal: "מידע משפטי",
      privacy: "מדיניות פרטיות",
      accessibility: "הצהרת נגישות",
      copyright: "עידן לנדל״ן — כל הזכויות שמורות",
      license: "מס׳ רישיון תיווך",
    },
    cookie: {
      message: "אתר זה משתמש בעוגיות לשיפור חוויית השימוש ולניתוח תנועה.",
      accept: "אישור",
      decline: "דחה",
      privacy_link: "מדיניות פרטיות",
    },
    theme: {
      dark: "מצב כהה",
      light: "מצב בהיר",
    },
  },

  en: {
    nav: {
      home: "Home",
      properties: "Properties",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      message: "Send Message",
      close: "Close menu",
      open: "Open menu",
    },
    hero: {
      eyebrow: "319 HaYarkon St., Tel Aviv Port",
      line1: "Idan",
      line2: "Real Estate",
      subtitle:
        "Twenty years of luxury real estate expertise. Full transparency, real results.",
      cta_properties: "View Properties",
      cta_contact: "Talk to Idan",
      rating: "Google Rating",
    },
    stats: {
      experience: "Years Experience",
      deals: "Deals Closed",
      rating: "Google Rating",
      office: "Office Address",
      office_value: "Tel Aviv Port",
    },
    sections: {
      properties: {
        eyebrow: "Featured Listings",
        title: "Our Properties",
        all: "All Properties",
      },
      about: {
        eyebrow: "About",
        quote: "A great real estate deal\nchanges lives.",
        read_more: "Learn more about me",
      },
      testimonials: {
        eyebrow: "Clients Speak",
        title: "What They Say",
        all: "All Google Reviews",
      },
      cta: {
        eyebrow: "Ready for the next step?",
        title1: "Let's find your",
        title2: "perfect property",
        subtitle:
          "Buying, selling, renting or investing — Idan Huli is here to answer every question.",
        whatsapp: "Message on WhatsApp",
      },
      blog: {
        eyebrow: "Blog",
        title: "Articles & Insights",
        all: "All Articles",
      },
    },
    footer: {
      tagline:
        "20 years of luxury real estate brokerage experience across the Dan region.",
      quick_nav: "Quick Links",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy Policy",
      accessibility: "Accessibility",
      copyright: "Idan Real Estate — All rights reserved",
      license: "Broker License No.",
    },
    cookie: {
      message:
        "This site uses cookies to improve user experience and analyze traffic.",
      accept: "Accept",
      decline: "Decline",
      privacy_link: "Privacy Policy",
    },
    theme: {
      dark: "Dark mode",
      light: "Light mode",
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      properties: "Biens",
      blog: "Blog",
      about: "À propos",
      contact: "Contact",
      message: "Envoyer un message",
      close: "Fermer le menu",
      open: "Ouvrir le menu",
    },
    hero: {
      eyebrow: "319 HaYarkon, Port de Tel Aviv",
      line1: "Idan",
      line2: "Immobilier",
      subtitle:
        "Vingt ans d'expertise en immobilier de luxe. Transparence totale, résultats concrets.",
      cta_properties: "Voir les biens",
      cta_contact: "Parler à Idan",
      rating: "Note Google",
    },
    stats: {
      experience: "Ans d'expérience",
      deals: "Transactions réalisées",
      rating: "Note Google",
      office: "Adresse du bureau",
      office_value: "Port de Tel Aviv",
    },
    sections: {
      properties: {
        eyebrow: "Sélection de biens",
        title: "Nos biens",
        all: "Tous les biens",
      },
      about: {
        eyebrow: "À propos",
        quote: "Une bonne transaction\nimmobilière change une vie.",
        read_more: "En savoir plus",
      },
      testimonials: {
        eyebrow: "Témoignages",
        title: "Ce qu'ils disent",
        all: "Tous les avis Google",
      },
      cta: {
        eyebrow: "Prêt pour la prochaine étape?",
        title1: "Trouvons ensemble votre",
        title2: "bien idéal",
        subtitle:
          "Achat, vente, location ou investissement — Idan Huli est là pour répondre à toutes vos questions.",
        whatsapp: "Message WhatsApp",
      },
      blog: {
        eyebrow: "Blog",
        title: "Articles & Analyses",
        all: "Tous les articles",
      },
    },
    footer: {
      tagline:
        "20 ans d'expérience en courtage immobilier de luxe dans la région de Dan.",
      quick_nav: "Liens rapides",
      contact: "Contact",
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      accessibility: "Accessibilité",
      copyright: "Idan Immobilier — Tous droits réservés",
      license: "N° de licence",
    },
    cookie: {
      message:
        "Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic.",
      accept: "Accepter",
      decline: "Refuser",
      privacy_link: "Confidentialité",
    },
    theme: {
      dark: "Mode sombre",
      light: "Mode clair",
    },
  },
};
