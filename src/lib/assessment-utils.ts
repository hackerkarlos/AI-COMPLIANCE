// Assessment Utilities for Risk Calculation and Validation

import type { AssessmentQuestion, AssessmentResponse, RiskCalculation } from '@/types/assessment';

export function calculateRiskScore(
  questions: AssessmentQuestion[],
  responses: Record<string, any>
): RiskCalculation {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  questions.forEach((question) => {
    const response = responses[question.question_code];
    if (!response) return;

    maxPossibleScore += Math.max(0, question.max_points);

    if (question.question_type === 'single_choice') {
      const selectedOption = question.options?.find(opt => opt.value === response);
      if (selectedOption) {
        totalScore += selectedOption.points;
        
        // Check for critical issues
        if (selectedOption.points >= 10) {
          criticalIssues.push(question.question_text);
        }
        
        // Generate recommendations based on high-risk responses
        if (selectedOption.points >= 8) {
          recommendations.push(generateRecommendation(question.question_code, selectedOption.value));
        }
      }
    } else if (question.question_type === 'multiple_choice' && Array.isArray(response)) {
      let questionScore = 0;
      response.forEach((value: string) => {
        const selectedOption = question.options?.find(opt => opt.value === value);
        if (selectedOption) {
          questionScore += selectedOption.points;
        }
      });
      totalScore += questionScore;
      
      if (questionScore >= 10) {
        criticalIssues.push(question.question_text);
      }
    }
  });

  // Ensure score doesn't go below 0
  totalScore = Math.max(0, totalScore);

  const compliancePercentage = maxPossibleScore > 0 ? 
    Math.max(0, ((maxPossibleScore - totalScore) / maxPossibleScore) * 100) : 100;

  let riskLevel: 'minimal' | 'low' | 'medium' | 'high';
  if (totalScore >= 76) riskLevel = 'high';
  else if (totalScore >= 51) riskLevel = 'medium';
  else if (totalScore >= 26) riskLevel = 'low';
  else riskLevel = 'minimal';

  return {
    totalScore,
    maxPossibleScore,
    riskLevel,
    compliancePercentage: Math.round(compliancePercentage * 100) / 100,
    criticalIssues,
    recommendations
  };
}

function generateRecommendation(questionCode: string, answer: string): string {
  const recommendationMap: Record<string, Record<string, string>> = {
    'DATA_TYPES': {
      'special_category': 'Implement additional safeguards for special category data processing, including explicit consent and enhanced security measures.',
      'financial_info': 'Ensure PCI DSS compliance for financial data and implement secure payment processing.'
    },
    'PROCESSING_VOLUME': {
      'more_10000': 'Consider appointing a Data Protection Officer (DPO) as you may meet the threshold requiring mandatory DPO appointment.',
      '1000_10000': 'Implement robust data management systems and consider regular compliance audits.'
    },
    'INTERNATIONAL_TRANSFERS': {
      'without_safeguards': 'Immediately implement appropriate safeguards for international data transfers (SCCs, BCRs, or adequacy decisions).',
      'unsure': 'Conduct a data mapping exercise to identify all international data transfers and implement necessary safeguards.'
    },
    'SECURITY_TECHNICAL': {
      'none': 'Urgent: Implement basic security measures including encryption, access controls, and regular backups.'
    },
    'DPO_STATUS': {
      'unsure': 'Assess whether your organization meets the criteria requiring a DPO appointment based on processing activities.'
    },
    'DATA_BREACHES': {
      'not_reported': 'Review breach notification requirements - unreported breaches may result in significant penalties.',
      'unsure_breach': 'Implement incident detection and response procedures to identify and properly handle data breaches.'
    }
  };

  return recommendationMap[questionCode]?.[answer] || 
    'Review compliance requirements for this area and implement appropriate measures.';
}

export function validateResponse(question: AssessmentQuestion, response: any): boolean {
  if (question.is_required && (!response || response === '' || 
      (Array.isArray(response) && response.length === 0))) {
    return false;
  }

  if (question.question_type === 'single_choice' && response) {
    return question.options?.some(opt => opt.value === response) || false;
  }

  if (question.question_type === 'multiple_choice' && Array.isArray(response)) {
    return response.every(value => 
      question.options?.some(opt => opt.value === value)
    );
  }

  if (question.question_type === 'number' && response !== undefined) {
    return typeof response === 'number' && !isNaN(response);
  }

  if (question.question_type === 'boolean' && response !== undefined) {
    return typeof response === 'boolean';
  }

  return true;
}

export function groupQuestionsByCategory(questions: AssessmentQuestion[]): Record<string, AssessmentQuestion[]> {
  return questions
    .sort((a, b) => a.display_order - b.display_order)
    .reduce((groups, question) => {
      const category = question.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(question);
      return groups;
    }, {} as Record<string, AssessmentQuestion[]>);
}

export function getProgressPercentage(responses: Record<string, any>, totalQuestions: number): number {
  const answeredQuestions = Object.keys(responses).length;
  return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
}