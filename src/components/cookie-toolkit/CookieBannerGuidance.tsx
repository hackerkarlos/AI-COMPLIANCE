// Server component — no client-side interactivity needed.

interface RequirementItem {
  label: string;
  detail: string;
}

interface GuidanceSection {
  title: string;
  items: RequirementItem[];
}

const consentBannerSections: GuidanceSection[] = [
  {
    title: 'What your cookie banner MUST do',
    items: [
      {
        label: 'Clearly state the purpose',
        detail:
          'Explain in plain language that you use cookies and what they are used for before the user makes any choice.',
      },
      {
        label: 'Equal "Accept" and "Reject" buttons',
        detail:
          'Datatilsynet requires that accepting and rejecting cookies are equally easy. The reject option must not be hidden in sub-menus or styled as a less prominent link.',
      },
      {
        label: 'Granular consent per category',
        detail:
          'Users must be able to accept analytics cookies without accepting marketing cookies. Provide category-level toggles (Strictly Necessary / Analytics / Marketing / Functional).',
      },
      {
        label: 'No pre-ticked boxes',
        detail:
          'Non-essential cookie categories must be unchecked by default. Pre-selection is invalid consent under GDPR Article 4(11) and ePrivacy Article 5(3).',
      },
      {
        label: 'No cookie walls',
        detail:
          'You cannot make access to your website conditional on accepting non-essential cookies. Datatilsynet has explicitly ruled against cookie walls.',
      },
      {
        label: 'Consent must be freely given before cookies fire',
        detail:
          'Non-essential cookies must not be loaded until the user actively clicks "Accept". Scrolling or closing the banner is not valid consent.',
      },
    ],
  },
  {
    title: 'Cookie categories explained',
    items: [
      {
        label: 'Strictly Necessary',
        detail:
          'Session management, authentication, load balancing, shopping cart. No consent needed. Cannot be turned off.',
      },
      {
        label: 'Functional / Preferences',
        detail:
          'Language preference, theme choice, personalised settings. Consent required. Low risk.',
      },
      {
        label: 'Analytics',
        detail:
          'Traffic analysis, page views, user journeys (e.g. Google Analytics). Consent required. First-party analytics only may qualify as strictly necessary in narrow circumstances per Datatilsynet — seek specific guidance.',
      },
      {
        label: 'Marketing / Advertising',
        detail:
          'Retargeting, ad conversion tracking, cross-site behavioural profiling (e.g. Meta Pixel, Google Ads). Consent required. Highest risk category.',
      },
    ],
  },
  {
    title: 'Consent Management Platform (CMP) requirements',
    items: [
      {
        label: 'Documented consent records',
        detail:
          'Your CMP must log: what the user consented to, when, and what version of the policy was shown. You must be able to produce this if audited by Datatilsynet.',
      },
      {
        label: 'Easy withdrawal mechanism',
        detail:
          'Users must be able to change or withdraw their consent at any time — with the same ease as giving it. A persistent "Cookie Settings" link in your footer is the standard approach.',
      },
      {
        label: 'Regular re-consent',
        detail:
          'Consent is not indefinite. Re-ask for consent when you add new cookies or material changes to purpose. Industry guidance: re-ask at least every 12 months.',
      },
      {
        label: 'No dark patterns',
        detail:
          'Confusing language ("Are you sure you want to miss out on personalised content?"), colour tricks (green = accept, grey = reject), or misleading toggles are prohibited.',
      },
    ],
  },
  {
    title: 'Datatilsynet enforcement notes',
    items: [
      {
        label: 'Annual cookie sweeps',
        detail:
          'Datatilsynet conducts annual audits of Danish websites. Companies with non-compliant banners receive orders to fix issues and may be fined.',
      },
      {
        label: 'cookie-erklæringen.dk',
        detail:
          'The official Danish cookie declaration tool. Using it is not legally required, but it demonstrates compliance effort and is recognised by Datatilsynet.',
      },
      {
        label: 'Google Analytics transfers',
        detail:
          'Datatilsynet has issued guidance that standard Google Analytics (with US data transfer) requires consent and Standard Contractual Clauses (SCCs) + Transfer Impact Assessment (TIA).',
      },
      {
        label: 'Fines',
        detail:
          'Up to DKK 1,500,000 per violation under Danish law. Datatilsynet can also refer serious or repeated violations to the police for criminal prosecution.',
      },
    ],
  },
];

function RequirementRow({ item }: { item: RequirementItem }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[var(--color-border)] last:border-b-0">
      <span className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]">›</span>
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {item.detail}
        </p>
      </div>
    </div>
  );
}

export function CookieBannerGuidance() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Cookie Banner &amp; Consent Requirements</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Danish Datatilsynet guidance on implementing a compliant cookie consent mechanism.
        </p>
      </div>

      {consentBannerSections.map((section) => (
        <div
          key={section.title}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
        >
          <div className="border-b border-[var(--color-border)] bg-[var(--color-muted)] px-5 py-3">
            <h3 className="text-sm font-semibold">{section.title}</h3>
          </div>
          <div className="px-5">
            {section.items.map((item) => (
              <RequirementRow key={item.label} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* Quick-start note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-900/20">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
          Recommended CMP tools for Danish SMBs
        </p>
        <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
          CookieInformation, Cookiebot, and OneTrust all offer Danish-language configurations and
          are in common use by companies reviewed by Datatilsynet. Whichever CMP you use, verify
          that it blocks non-essential cookies before consent, stores consent logs, and surfaces the
          cookie declaration (cookie-erklæringen.dk format).
        </p>
      </div>
    </div>
  );
}
