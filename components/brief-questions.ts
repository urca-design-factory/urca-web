// Single source for the e-commerce project brief: the form renders it, the
// API route validates against it and the notification/export text is built
// from it, so a question added here appears everywhere.

export type BriefLocale = "en" | "tr";

type Copy = Record<BriefLocale, string>;

type Option = { value: string; label: Copy };

export type BriefField = {
  key: string;
  kind: "text" | "email" | "textarea" | "radio" | "checkbox";
  label: Copy;
  hint?: Copy;
  required?: boolean;
  options?: readonly Option[];
  /** Adds a free-text "Other" answer stored under `${key}_other`. */
  other?: boolean;
  autoComplete?: string;
};

export type BriefSection = {
  key: string;
  title: Copy;
  intro: Copy;
  fields: readonly BriefField[];
};

const notSure: Option = {
  value: "not-sure",
  label: { en: "Not sure yet", tr: "Henüz emin değilim" },
};

const readiness: readonly Option[] = [
  { value: "yes", label: { en: "Yes, ready", tr: "Evet, hazır" } },
  { value: "partly", label: { en: "Partly", tr: "Kısmen" } },
  {
    value: "help",
    label: { en: "No, we’d like help with it", tr: "Hayır, bunda da destek isteriz" },
  },
];

export const briefSections: readonly BriefSection[] = [
  {
    key: "contact",
    title: { en: "About you", tr: "Siz" },
    intro: {
      en: "So we know who we are writing back to.",
      tr: "Kime döneceğimizi bilmek için.",
    },
    fields: [
      {
        key: "name",
        kind: "text",
        label: { en: "Your name", tr: "Adınız soyadınız" },
        required: true,
        autoComplete: "name",
      },
      {
        key: "brand",
        kind: "text",
        label: { en: "Brand name", tr: "Marka adı" },
        required: true,
        autoComplete: "organization",
      },
      {
        key: "email",
        kind: "email",
        label: { en: "Email", tr: "E-posta" },
        required: true,
        autoComplete: "email",
      },
      {
        key: "link",
        kind: "text",
        label: { en: "Website or Instagram", tr: "Web siteniz veya Instagram hesabınız" },
        hint: { en: "Optional.", tr: "İsteğe bağlı." },
      },
    ],
  },
  {
    key: "products",
    title: { en: "Brand and products", tr: "Marka ve ürünler" },
    intro: {
      en: "What you sell, and to whom.",
      tr: "Ne sattığınızı ve kime sattığınızı anlamak için.",
    },
    fields: [
      {
        key: "brand_story",
        kind: "textarea",
        label: {
          en: "Describe your brand in a few sentences. Who is it for?",
          tr: "Markanızı birkaç cümleyle anlatır mısınız? Kimlere hitap ediyor?",
        },
      },
      {
        key: "product_count",
        kind: "radio",
        label: {
          en: "Roughly how many products will the store carry?",
          tr: "Sitede yaklaşık kaç ürün yer alacak?",
        },
        options: [
          { value: "under-20", label: { en: "Under 20", tr: "20’den az" } },
          { value: "20-50", label: { en: "20–50", tr: "20–50" } },
          { value: "50-200", label: { en: "50–200", tr: "50–200" } },
          { value: "200-plus", label: { en: "More than 200", tr: "200’den fazla" } },
          notSure,
        ],
      },
      {
        key: "variants",
        kind: "checkbox",
        label: {
          en: "Do products come in options?",
          tr: "Ürünlerin seçenekleri var mı?",
        },
        hint: { en: "Choose all that apply.", tr: "Birden fazla seçebilirsiniz." },
        options: [
          {
            value: "size",
            label: { en: "Size (ring size, chain length)", tr: "Ölçü (yüzük ölçüsü, zincir uzunluğu)" },
          },
          {
            value: "material",
            label: { en: "Material (gold, silver…)", tr: "Malzeme (altın, gümüş vb.)" },
          },
          { value: "colour", label: { en: "Colour or stone", tr: "Renk veya taş" } },
          { value: "none", label: { en: "No options", tr: "Seçenek yok" } },
        ],
        other: true,
      },
      {
        key: "personalisation",
        kind: "radio",
        label: {
          en: "Do you offer personalised or made-to-order pieces?",
          tr: "Kişiye özel (isim, gravür) ya da siparişe göre üretilen ürünleriniz var mı?",
        },
        options: [
          { value: "yes", label: { en: "Yes", tr: "Evet" } },
          { value: "planned", label: { en: "Not yet, but planned", tr: "Henüz yok ama düşünüyoruz" } },
          { value: "no", label: { en: "No", tr: "Hayır" } },
        ],
      },
      {
        key: "collections",
        kind: "radio",
        label: {
          en: "Do you release products in collections?",
          tr: "Ürünlerinizi koleksiyonlar halinde mi çıkarıyorsunuz?",
        },
        options: [
          { value: "yes", label: { en: "Yes", tr: "Evet" } },
          { value: "sometimes", label: { en: "Sometimes", tr: "Bazen" } },
          { value: "no", label: { en: "No", tr: "Hayır" } },
        ],
      },
    ],
  },
  {
    key: "selling",
    title: { en: "Selling and delivery", tr: "Satış ve teslimat" },
    intro: {
      en: "These decide payments, shipping and languages.",
      tr: "Ödeme, kargo ve dil seçimleri bu cevaplara göre şekillenir.",
    },
    fields: [
      {
        key: "markets",
        kind: "checkbox",
        label: { en: "Where will you sell?", tr: "Hangi ülkelere satış yapacaksınız?" },
        hint: { en: "Choose all that apply.", tr: "Birden fazla seçebilirsiniz." },
        options: [
          { value: "romania", label: { en: "Romania", tr: "Romanya" } },
          { value: "turkey", label: { en: "Turkey", tr: "Türkiye" } },
          { value: "eu", label: { en: "Rest of the EU", tr: "Diğer AB ülkeleri" } },
          { value: "worldwide", label: { en: "Worldwide", tr: "Tüm dünya" } },
        ],
        other: true,
      },
      {
        key: "languages",
        kind: "text",
        label: { en: "Which languages should the site be in?", tr: "Site hangi dillerde olmalı?" },
        hint: { en: "For example Romanian and English.", tr: "Örneğin Rumence ve İngilizce." },
      },
      {
        key: "currencies",
        kind: "text",
        label: { en: "Which currencies will you sell in?", tr: "Hangi para birimleriyle satış yapılacak?" },
        hint: { en: "For example RON and EUR.", tr: "Örneğin RON ve EUR." },
      },
      {
        key: "payments",
        kind: "checkbox",
        label: {
          en: "Which payment methods would you like to offer?",
          tr: "Hangi ödeme yöntemlerini sunmak istiyorsunuz?",
        },
        hint: { en: "Choose all that apply.", tr: "Birden fazla seçebilirsiniz." },
        options: [
          { value: "card", label: { en: "Credit or debit card", tr: "Kredi veya banka kartı" } },
          { value: "wallets", label: { en: "Apple Pay / Google Pay", tr: "Apple Pay / Google Pay" } },
          { value: "cod", label: { en: "Cash on delivery", tr: "Kapıda ödeme" } },
          { value: "transfer", label: { en: "Bank transfer", tr: "Havale / EFT" } },
        ],
        other: true,
      },
      {
        key: "shipping",
        kind: "textarea",
        label: {
          en: "How do you ship today? Which courier do you use, and how do you price shipping?",
          tr: "Kargoyu nasıl yapıyorsunuz? Çalıştığınız bir firma var mı, kargo ücretini nasıl belirliyorsunuz?",
        },
      },
      {
        key: "returns",
        kind: "textarea",
        label: {
          en: "How do returns and exchanges work?",
          tr: "İade ve değişim süreciniz nasıl işliyor?",
        },
      },
    ],
  },
  {
    key: "current",
    title: { en: "Where you are now", tr: "Mevcut durum" },
    intro: {
      en: "So we know what we are starting from.",
      tr: "Nereden başlayacağımızı bilmek için.",
    },
    fields: [
      {
        key: "channels",
        kind: "checkbox",
        label: { en: "Where do you sell today?", tr: "Şu anda satışlarınızı nereden yapıyorsunuz?" },
        hint: { en: "Choose all that apply.", tr: "Birden fazla seçebilirsiniz." },
        options: [
          { value: "instagram", label: { en: "Instagram", tr: "Instagram" } },
          { value: "etsy", label: { en: "Etsy", tr: "Etsy" } },
          {
            value: "marketplace",
            label: { en: "A marketplace (eMAG, Trendyol…)", tr: "Pazaryeri (Trendyol, eMAG vb.)" },
          },
          { value: "store", label: { en: "A physical shop", tr: "Fiziksel mağaza" } },
          { value: "not-yet", label: { en: "Not selling yet", tr: "Henüz satış yapmıyoruz" } },
        ],
        other: true,
      },
      {
        key: "current_site",
        kind: "text",
        label: {
          en: "Do you already have a website or domain?",
          tr: "Mevcut bir web siteniz veya alan adınız var mı?",
        },
        hint: {
          en: "For example yourbrand.com. Leave empty if not.",
          tr: "Örneğin markaniz.com. Yoksa boş bırakabilirsiniz.",
        },
      },
      {
        key: "identity",
        kind: "radio",
        label: {
          en: "Is your brand identity ready (logo, colours, typefaces)?",
          tr: "Logo, renkler, yazı tipi gibi marka kimliğiniz hazır mı?",
        },
        options: readiness,
      },
      {
        key: "photos",
        kind: "radio",
        label: {
          en: "Do you have professional product photos?",
          tr: "Profesyonel ürün fotoğraflarınız var mı?",
        },
        options: readiness,
      },
      {
        key: "copy",
        kind: "radio",
        label: {
          en: "Are product descriptions and page texts (About, FAQ) written?",
          tr: "Ürün açıklamaları ve “Hakkımızda”, “SSS” gibi sayfaların metinleri hazır mı?",
        },
        options: readiness,
      },
    ],
  },
  {
    key: "site",
    title: { en: "The site", tr: "Site beklentileri" },
    intro: {
      en: "How the store should feel, and what it needs to do.",
      tr: "Sitenin nasıl hissettirmesi ve neler yapması gerektiği.",
    },
    fields: [
      {
        key: "references",
        kind: "textarea",
        label: {
          en: "Share two or three sites you like, and what you like about them.",
          tr: "Beğendiğiniz 2–3 siteyi ve onlarda neyi beğendiğinizi paylaşır mısınız?",
        },
      },
      {
        key: "features",
        kind: "checkbox",
        label: { en: "Which features are a must?", tr: "Olmazsa olmaz dediğiniz özellikler neler?" },
        hint: { en: "Choose all that apply.", tr: "Birden fazla seçebilirsiniz." },
        options: [
          { value: "wishlist", label: { en: "Wishlist", tr: "Favoriler" } },
          { value: "discounts", label: { en: "Discount codes", tr: "İndirim kodları" } },
          { value: "gift", label: { en: "Gift wrap and note", tr: "Hediye paketi ve not" } },
          { value: "newsletter", label: { en: "Newsletter sign-up", tr: "E-bülten kaydı" } },
          { value: "reviews", label: { en: "Customer reviews", tr: "Müşteri yorumları" } },
          {
            value: "accounts",
            label: { en: "Customer accounts and order history", tr: "Üyelik ve sipariş geçmişi" },
          },
        ],
        other: true,
      },
      {
        key: "self_manage",
        kind: "radio",
        label: {
          en: "After launch, who will add products and handle orders?",
          tr: "Site yayına girdikten sonra ürün ekleme ve sipariş takibini kim yapacak?",
        },
        options: [
          { value: "us", label: { en: "We will", tr: "Kendimiz" } },
          { value: "studio", label: { en: "We’d like you to", tr: "Sizin yapmanızı isteriz" } },
          { value: "both", label: { en: "A mix of both", tr: "İkisi birlikte" } },
        ],
      },
      {
        key: "integrations",
        kind: "text",
        label: {
          en: "Any accounting, stock or marketing tools the site should connect to?",
          tr: "Siteye bağlanması gereken muhasebe, stok veya pazarlama programları var mı?",
        },
        hint: {
          en: "For example SmartBill or Mailchimp.",
          tr: "Örneğin SmartBill, Paraşüt veya Mailchimp.",
        },
      },
      {
        key: "platform",
        kind: "radio",
        label: { en: "Do you have a platform preference?", tr: "Bir platform tercihiniz var mı?" },
        options: [
          { value: "shopify", label: { en: "Shopify", tr: "Shopify" } },
          { value: "woocommerce", label: { en: "WooCommerce", tr: "WooCommerce" } },
          {
            value: "advise",
            label: { en: "No preference, advise us", tr: "Tercihimiz yok, siz önerin" },
          },
        ],
        other: true,
      },
    ],
  },
  {
    key: "timing",
    title: { en: "Timing and budget", tr: "Zaman ve bütçe" },
    intro: {
      en: "So we can propose options that fit.",
      tr: "Size uygun seçenekler sunabilmemiz için.",
    },
    fields: [
      {
        key: "launch",
        kind: "textarea",
        label: {
          en: "When would you like the site to go live? Is there a date it has to meet?",
          tr: "Siteyi ne zaman yayında görmek istersiniz? Yetişmesi gereken bir tarih var mı (lansman, özel gün)?",
        },
      },
      {
        key: "budget",
        kind: "radio",
        label: {
          en: "Do you have a budget range in mind?",
          tr: "Bu proje için düşündüğünüz bir bütçe aralığı var mı?",
        },
        hint: {
          en: "It helps us shape options around it. It is not a commitment.",
          tr: "Bütçenize uygun seçenekler sunabilmek için soruyoruz. Bağlayıcı değildir.",
        },
        options: [
          { value: "under-2000", label: { en: "Under €2,000", tr: "2.000 €’dan az" } },
          { value: "2000-4000", label: { en: "€2,000–4,000", tr: "2.000–4.000 €" } },
          { value: "4000-8000", label: { en: "€4,000–8,000", tr: "4.000–8.000 €" } },
          { value: "over-8000", label: { en: "Over €8,000", tr: "8.000 €’dan fazla" } },
          {
            value: "not-sure",
            label: { en: "Not sure yet, show us options", tr: "Henüz bilmiyoruz, seçenekleri görmek isteriz" },
          },
        ],
      },
      {
        key: "maintenance",
        kind: "radio",
        label: {
          en: "Would you like ongoing maintenance and support after launch?",
          tr: "Yayından sonra bakım, güncelleme ve teknik destek ister misiniz?",
        },
        options: [
          { value: "yes", label: { en: "Yes", tr: "Evet" } },
          { value: "no", label: { en: "No", tr: "Hayır" } },
          notSure,
        ],
      },
      {
        key: "notes",
        kind: "textarea",
        label: { en: "Anything else we should know?", tr: "Eklemek istediğiniz başka bir şey var mı?" },
      },
    ],
  },
];

export const BRIEF_LIMITS = {
  text: 300,
  textarea: 4000,
  body: 48_000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BriefAnswers = Record<string, string | string[]>;

const allFields = briefSections.flatMap((section) => section.fields);

/**
 * Keeps only known keys and allowed option values, trims text and enforces
 * length limits. Returns the clean answers, or the first problem found.
 */
export function cleanBriefAnswers(
  input: unknown,
): { ok: true; answers: BriefAnswers } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "invalid_request" };
  }
  const raw = input as Record<string, unknown>;
  const answers: BriefAnswers = {};

  for (const field of allFields) {
    const value = raw[field.key];

    if (field.kind === "checkbox") {
      const allowed = new Set(field.options?.map((option) => option.value));
      const picked = Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string" && allowed.has(item))
        : [];
      if (picked.length > 0) answers[field.key] = [...new Set(picked)];
    } else if (field.kind === "radio") {
      if (typeof value === "string" && field.options?.some((option) => option.value === value)) {
        answers[field.key] = value;
      }
    } else {
      const limit = field.kind === "textarea" ? BRIEF_LIMITS.textarea : BRIEF_LIMITS.text;
      const text = typeof value === "string" ? value.trim().slice(0, limit) : "";
      if (text) answers[field.key] = text;
    }

    if (field.other) {
      const other = raw[`${field.key}_other`];
      const text = typeof other === "string" ? other.trim().slice(0, BRIEF_LIMITS.text) : "";
      if (text) answers[`${field.key}_other`] = text;
    }

    if (field.required && !answers[field.key]) {
      return { ok: false, error: `missing_${field.key}` };
    }
  }

  const email = String(answers.email ?? "").toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  answers.email = email;

  return { ok: true, answers };
}

/** Plain-text summary of a brief, used for the notification email and the export script. */
export function formatBrief(answers: BriefAnswers, locale: BriefLocale): string {
  const otherLabel = locale === "tr" ? "Diğer" : "Other";

  return briefSections
    .map((section, index) => {
      const heading = `${String(index + 1).padStart(2, "0")} ${section.title[locale].toLocaleUpperCase(locale)}`;
      const lines = section.fields.map((field) => {
        const value = answers[field.key];
        const values = (Array.isArray(value) ? value : value ? [value] : []).map(
          (item) => field.options?.find((option) => option.value === item)?.label[locale] ?? item,
        );
        const other = answers[`${field.key}_other`];
        if (typeof other === "string") values.push(`${otherLabel}: ${other}`);
        return `${field.label[locale]}\n  ${values.length > 0 ? values.join(", ") : "—"}`;
      });
      return [heading, ...lines].join("\n\n");
    })
    .join("\n\n\n");
}
