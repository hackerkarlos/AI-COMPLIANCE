/**
 * Bogføringsloven (Danish Bookkeeping Act) readiness assessment logic.
 *
 * Applies the rules from lov nr. 700 af 24/05/2022 to determine:
 * - Whether a company is subject to Bogføringsloven
 * - What phase-in deadline applies
 * - What compliance gaps exist
 * - Recommended action items
 */

export interface BogforingslovenAnswers {
  cvrRegistered: boolean;
  companyType: 'enkeltmandsvirksomhed' | 'aps' | 'as' | 'is_ks' | 'branch' | 'other';
  annualRevenue: 'under_100k' | '100k_300k' | '300k_1m' | '1m_5m' | 'over_5m';
  revenueInDKK: boolean;
  employeeCount: 'none' | '1_5' | '6_20' | '21_50' | 'over_50';
  currentBookkeepingTool: 'none' | 'excel' | 'approved_cloud' | 'foreign_tool' | 'paper' | 'dont_know';
  hasDigitalBackup: boolean;
  hasDigitalVouchers: boolean;
  usesStandardKontoplan: boolean;
  recordsTransactionsMonthly: boolean;
  retainsRecords5Years: boolean;
  hasVATReporting: boolean;
  hasAccountant: boolean;
  registeredAfter2024: boolean;
}

export interface ComplianceGap {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  legalBasis: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedEffort: 'minimal' | 'moderate' | 'significant';
  done: boolean;
}

export interface ReadinessReport {
  applicable: boolean;
  applicabilityReason: string;
  deadline: string;
  readinessScore: number;
  gaps: ComplianceGap[];
  actionItems: ActionItem[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Determine if Bogføringsloven applies to the company.
 * Under Danish law, ALL companies registered in CVR are subject to the law.
 */
export function checkApplicability(answers: BogforingslovenAnswers): Pick<ReadinessReport, 'applicable' | 'applicabilityReason' | 'deadline'> {
  // Bogføringsloven applies to ALL entities registered in CVR
  if (!answers.cvrRegistered) {
    return {
      applicable: false,
      applicabilityReason: 'Bogføringsloven (lov nr. 700 af 24/05/2022) applies only to companies registered in the Danish CVR register. If you register a company in Denmark in the future, this law will apply to you.',
      deadline: 'N/A',
    };
  }

  // Determine deadline based on revenue and registration date
  let deadline = '';
  if (answers.registeredAfter2024) {
    deadline = 'Already enforced — you should already be compliant (registered after Jan 2024)';
  } else {
    const revNumber = revenueToNumber(answers.annualRevenue);
    if (revNumber > 300000) {
      deadline = 'Already enforced — companies with revenue > DKK 300,000 needed compliance by Jan 2025';
    } else {
      deadline = '1 January 2026 — ALL remaining companies must comply, no revenue threshold';
    }
  }

  return {
    applicable: true,
    applicabilityReason: `As a ${formatCompanyType(answers.companyType)} registered in CVR, your company is subject to Bogføringsloven (Danish Bookkeeping Act). The 2022 reform mandates the use of approved digital bookkeeping systems with automatic backup, digital voucher storage, and proper audit trails. ${answers.annualRevenue === 'under_100k' ? 'Previously you may have been below the DKK 300,000 threshold, but from January 2026 ALL companies must comply regardless of revenue.' : ''}`,
    deadline,
  };
}

/**
 * Analyze answers and produce a readiness report with gaps and action items.
 */
export function analyzeReadiness(answers: BogforingslovenAnswers): ReadinessReport {
  const applicability = checkApplicability(answers);

  if (!applicability.applicable) {
    return {
      ...applicability,
      readinessScore: 100,
      gaps: [],
      actionItems: [],
      riskLevel: 'low',
    };
  }

  const gaps: ComplianceGap[] = [];
  let score = 100;

  // Critical: No bookkeeping system at all
  if (answers.currentBookkeepingTool === 'none' || answers.currentBookkeepingTool === 'paper') {
    gaps.push({
      severity: 'critical',
      title: 'No digital bookkeeping system',
      description: `You are currently using ${answers.currentBookkeepingTool === 'none' ? 'no system' : 'paper-based records'}. The law requires an approved digital bookkeeping system immediately.`,
      legalBasis: '§5a — Digital voucher requirement',
    });
    score -= 30;
  }

  // Critical: Using non-approved tools (Excel)
  if (answers.currentBookkeepingTool === 'excel') {
    gaps.push({
      severity: 'critical',
      title: 'Using spreadsheets instead of approved system',
      description: 'Excel and personal spreadsheets are NOT approved bookkeeping systems under Bogføringsloven. You must migrate to an approved digital system.',
      legalBasis: '§5a — Approved digital bookkeeping system required',
    });
    score -= 25;
  }

  // Critical: Using foreign tools not on Erhvervsstyrelsen's approved list
  if (answers.currentBookkeepingTool === 'foreign_tool') {
    gaps.push({
      severity: 'high',
      title: 'Non-approved foreign bookkeeping tool',
      description: 'Your bookkeeping tool may not be on Erhvervsstyrelsen\'s approved list. Verify it supports digital vouchers, automatic backup, and SAF-T exports.',
      legalBasis: '§5a — System must be registered on Erhvervsstyrelsen\'s list',
    });
    score -= 20;
  }

  // High: No digital backup
  if (!answers.hasDigitalBackup) {
    gaps.push({
      severity: 'high',
      title: 'No automatic backup of bookkeeping data',
      description: 'The law requires automatic backup of all bookkeeping data and digital vouchers to a secure, independent location. Many approved cloud systems handle this automatically.',
      legalBasis: '§5b — Automatic backup requirement',
    });
    score -= 15;
  }

  // High: No digital vouchers
  if (!answers.hasDigitalVouchers) {
    gaps.push({
      severity: 'high',
      title: 'Digital voucher storage not implemented',
      description: 'All transactions must be supported by digital vouchers (receipts, invoices). Scanned paper receipts are acceptable if legible.',
      legalBasis: '§5 — Voucher (bilag) requirement',
    });
    score -= 15;
  }

  // Medium: Not recording transactions monthly
  if (!answers.recordsTransactionsMonthly) {
    gaps.push({
      severity: 'medium',
      title: 'Transactions not recorded within the same month',
      description: 'All financial transactions must be recorded promptly — within the same calendar month they occur. Do not let receipts accumulate.',
      legalBasis: '§7 — Registration of transactions',
    });
    score -= 10;
  }

  // Medium: No 5-year retention
  if (!answers.retainsRecords5Years) {
    gaps.push({
      severity: 'medium',
      title: '5-year retention not implemented',
      description: 'All bookkeeping records and vouchers must be retained for 5 years from the end of the financial year, even when switching systems.',
      legalBasis: '§10 — Retention period',
    });
    score -= 10;
  }

  // Medium: Not using standard kontoplan
  if (!answers.usesStandardKontoplan) {
    gaps.push({
      severity: 'medium',
      title: 'Not using Danish standard chart of accounts',
      description: 'Your chart of accounts should follow the Danish standard kontoplan or be mappable to it. Most approved systems include the standard chart.',
      legalBasis: 'Kontoplan requirement — Erhvervsstyrelsen standard',
    });
    score -= 5;
  }

  // Low: No VAT reporting alignment
  if (!answers.hasVATReporting) {
    gaps.push({
      severity: 'low',
      title: 'Bookkeeping may not support VAT (moms) reporting',
      description: 'Ensure your bookkeeping system supports quarterly or monthly VAT reporting. This is not directly a bookkeeping requirement but is closely related.',
      legalBasis: 'Momsloven alignment — practical guidance',
    });
    score -= 5;
  }

  // Low: No accountant for ApS/A/S
  if ((answers.companyType === 'aps' || answers.companyType === 'as') && !answers.hasAccountant) {
    gaps.push({
      severity: 'low',
      title: 'No professional accountant (revisor)',
      description: 'ApS and A/S companies must file annual accounts with Erhvervsstyrelsen. Professional accounting help is strongly advised.',
      legalBasis: 'Årsregnskabsloven — practical guidance',
    });
    score -= 5;
  }

  // Don't know — add guidance
  if (answers.currentBookkeepingTool === 'dont_know') {
    gaps.push({
      severity: 'medium',
      title: 'Uncertain about current bookkeeping tool',
      description: 'If you\'re unsure what bookkeeping system you\'re using, you likely need to investigate this. Many approved systems include e-conomic (Visma), Billy, Dinero, Uniconta, and Debitoor.',
      legalBasis: '§5a — Approved system requirement awareness',
    });
    score -= 10;
  }

  score = Math.max(0, score);

  const riskLevel: ReadinessReport['riskLevel'] =
    score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'critical';

  // Build action items
  const actionItems = buildActionItems(answers, gaps);

  return {
    ...applicability,
    readinessScore: score,
    gaps: gaps.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity)),
    actionItems,
    riskLevel,
  };
}

/**
 * Generate prioritized action items based on gaps and answers.
 */
function buildActionItems(answers: BogforingslovenAnswers, gaps: ComplianceGap[]): ActionItem[] {
  const items: ActionItem[] = [];

  // Critical: Get an approved system
  if (answers.currentBookkeepingTool === 'none' || answers.currentBookkeepingTool === 'paper' || answers.currentBookkeepingTool === 'excel') {
    items.push({
      id: 'act_001',
      title: 'Choose and register an approved digital bookkeeping system',
      description: 'Select a system from Erhvervsstyrelsen\'s approved list. Popular options: e-conomic (Visma), Billy, Dinero, Uniconta, Debitoor. Migrate all existing records.',
      priority: 'critical',
      estimatedEffort: 'significant',
      done: false,
    });
  }

  // Verify foreign tool
  if (answers.currentBookkeepingTool === 'foreign_tool') {
    items.push({
      id: 'act_001b',
      title: 'Verify current tool is on Erhvervsstyrelsen\'s approved list',
      description: 'Check if your current bookkeeping tool is registered on Erhvervsstyrelsen\'s list of approved systems. If not, migrate to an approved alternative.',
      priority: 'high',
      estimatedEffort: 'moderate',
      done: false,
    });
  }

  // Digital backup
  if (!answers.hasDigitalBackup) {
    items.push({
      id: 'act_002',
      title: 'Enable automatic backup in your bookkeeping system',
      description: 'Most approved cloud systems handle this automatically. Verify auto-backup is active and stores data to a secure, separate location.',
      priority: 'high',
      estimatedEffort: 'minimal',
      done: false,
    });
  }

  // Digital vouchers
  if (!answers.hasDigitalVouchers) {
    items.push({
      id: 'act_003',
      title: 'Implement digital voucher (bilag) storage',
      description: 'Start scanning all paper receipts and storing them digitally. Most approved systems have mobile apps for receipt capture.',
      priority: 'high',
      estimatedEffort: 'moderate',
      done: false,
    });
  }

  // Monthly close
  if (!answers.recordsTransactionsMonthly) {
    items.push({
      id: 'act_004',
      title: 'Set up monthly bookkeeping close process',
      description: 'Record all transactions within the calendar month they occur. Set a calendar reminder for monthly close to avoid accumulating backlogged receipts.',
      priority: 'medium',
      estimatedEffort: 'minimal',
      done: false,
    });
  }

  // 5-year retention
  if (!answers.retainsRecords5Years) {
    items.push({
      id: 'act_005',
      title: 'Set up 5-year record retention',
      description: 'Ensure all bookkeeping records and vouchers are retained for 5 years from the end of the financial year. When switching systems, export and archive old data.',
      priority: 'medium',
      estimatedEffort: 'minimal',
      done: false,
    });
  }

  // Standard kontoplan
  if (!answers.usesStandardKontoplan) {
    items.push({
      id: 'act_006',
      title: 'Adopt the Danish standard chart of accounts (kontoplan)',
      description: 'Switch to Erhvervsstyrelsen\'s standard kontoplan or ensure your custom chart is mappable to it. Most approved systems include the standard chart.',
      priority: 'medium',
      estimatedEffort: 'moderate',
      done: false,
    });
  }

  // VAT reporting
  if (!answers.hasVATReporting) {
    items.push({
      id: 'act_007',
      title: 'Align bookkeeping with VAT (moms) reporting',
      description: 'Ensure your bookkeeping supports quarterly or monthly VAT reporting. This makes tax filing smoother and is practically necessary.',
      priority: 'low',
      estimatedEffort: 'minimal',
      done: false,
    });
  }

  // Accountant recommendation for ApS/AS
  if ((answers.companyType === 'aps' || answers.companyType === 'as') && !answers.hasAccountant) {
    items.push({
      id: 'act_008',
      title: 'Consider hiring a professional accountant (revisor)',
      description: 'ApS and A/S companies must file annual accounts with Erhvervsstyrelsen. Professional help ensures compliance and reduces personal liability.',
      priority: 'low',
      estimatedEffort: 'significant',
      done: false,
    });
  }

  return items.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
}

// ─── Utility functions ────────────────────────────────────────

function revenueToNumber(rev: BogforingslovenAnswers['annualRevenue']): number {
  switch (rev) {
    case 'under_100k': return 50000;
    case '100k_300k': return 200000;
    case '300k_1m': return 500000;
    case '1m_5m': return 2000000;
    case 'over_5m': return 10000000;
    default: return 0;
  }
}

function formatCompanyType(type: BogforingslovenAnswers['companyType']): string {
  switch (type) {
    case 'enkeltmandsvirksomhed': return 'sole trader (enkeltmandsvirksomhed)';
    case 'aps': return 'Anpartsselskab (ApS)';
    case 'as': return 'Aktieselskab (A/S)';
    case 'is_ks': return 'Partnership (I/S or K/S)';
    case 'branch': return 'Branch of foreign company';
    case 'other': return 'other entity';
  }
}

function severityOrder(sev: ComplianceGap['severity']): number {
  switch (sev) {
    case 'critical': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
  }
}

function priorityOrder(pri: ActionItem['priority']): number {
  switch (pri) {
    case 'critical': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
  }
}
