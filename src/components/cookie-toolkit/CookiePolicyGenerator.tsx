'use client';

import { useState, useTransition } from 'react';
import type { CookiePolicyTemplate } from '@/app/api/cookie-policy/route';

// ─── Helper: render template to plain text ────────────────────

function renderPolicyAsText(policy: CookiePolicyTemplate, companyName: string): string {
  const lines: string[] = [];
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  lines.push(`COOKIE POLICY — ${companyName.toUpperCase()}`);
  lines.push(`Last updated: ${today}`);
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('');

  lines.push('1. INTRODUCTION');
  lines.push('');
  lines.push(policy.introduction);
  lines.push('');

  lines.push('2. WHAT ARE COOKIES?');
  lines.push('');
  lines.push(policy.what_are_cookies);
  lines.push('');

  lines.push('3. COOKIES WE USE');
  lines.push('');
  for (const cat of policy.cookies_we_use) {
    lines.push(`${cat.category.toUpperCase()}`);
    lines.push(`  Purpose:     ${cat.purpose}`);
    lines.push(`  Legal basis: ${cat.legal_basis}`);
    lines.push(`  Retention:   ${cat.retention}`);
    if (cat.examples) {
      lines.push(`  Examples:    ${cat.examples}`);
    }
    lines.push('');
  }

  lines.push('4. HOW WE OBTAIN YOUR CONSENT');
  lines.push('');
  lines.push(policy.consent_mechanism);
  lines.push('');

  lines.push('5. HOW TO MANAGE AND DELETE COOKIES');
  lines.push('');
  lines.push(policy.how_to_manage_cookies);
  lines.push('');

  lines.push('6. THIRD-PARTY COOKIES AND DATA TRANSFERS');
  lines.push('');
  lines.push(policy.third_parties);
  lines.push('');

  lines.push('7. UPDATES TO THIS POLICY');
  lines.push('');
  lines.push(policy.updates_to_policy);
  lines.push('');

  lines.push('8. CONTACT US');
  lines.push('');
  lines.push(policy.contact_details_placeholder);
  lines.push('');

  return lines.join('\n');
}

// ─── Component ────────────────────────────────────────────────

export function CookiePolicyGenerator({ companyName }: { companyName: string }) {
  const [policyText, setPolicyText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      try {
        const resp = await fetch('/api/cookie-policy', { method: 'POST' });
        if (!resp.ok) {
          const body = (await resp.json()) as { error?: string };
          throw new Error(body.error ?? 'Request failed');
        }
        const data = (await resp.json()) as { success: boolean; policy: CookiePolicyTemplate };
        setPolicyText(renderPolicyAsText(data.policy, companyName));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate policy');
      }
    });
  };

  const handleCopy = async () => {
    if (!policyText) return;
    await navigator.clipboard.writeText(policyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegenerate = () => {
    setPolicyText(null);
    handleGenerate();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Cookie Policy Template</h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Generate a GDPR / ePrivacy-compliant cookie policy tailored to your company profile.
          </p>
        </div>

        {!policyText && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="flex-shrink-0 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 transition-opacity"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </span>
            ) : (
              'Generate Cookie Policy Template'
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Empty state — show after initial page load */}
      {!policyText && !isPending && !error && (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Click <strong>Generate Cookie Policy Template</strong> above to create a customised draft
            based on your company profile.
          </p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            Uses AI to tailor the policy to the cookies your company is likely to use.
          </p>
        </div>
      )}

      {/* Policy output */}
      {policyText && (
        <div className="space-y-3">
          {/* Action row */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Review, fill in the bracketed placeholders, then paste into your website or CMS.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isPending}
                className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-50 transition-colors"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          </div>

          {/* Policy text area */}
          <textarea
            readOnly
            value={policyText}
            rows={28}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-xs text-[var(--color-foreground)] leading-relaxed focus:outline-none resize-y"
            aria-label="Generated cookie policy template"
          />

          {/* Translation disclaimer */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Template is in English
            </p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
              Danish law does not require a specific language, but Datatilsynet recommends that your
              cookie policy is accessible and understandable to Danish users. Review this template
              with a Danish-speaking legal advisor before publishing, and consider publishing a
              Danish translation alongside the English version.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
