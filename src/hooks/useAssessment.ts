'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AssessmentQuestion, AssessmentFormData, RiskCalculation } from '@/types/assessment';
import { calculateRiskScore, validateResponse } from '@/lib/assessment-utils';

interface UseAssessmentOptions {
  questions: AssessmentQuestion[];
  onSave?: (data: AssessmentFormData) => Promise<void>;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export function useAssessment({ 
  questions, 
  onSave, 
  autoSave = true, 
  autoSaveDelay = 2000 
}: UseAssessmentOptions) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [riskCalculation, setRiskCalculation] = useState<RiskCalculation | null>(null);

  // Auto-save timer
  useEffect(() => {
    if (!autoSave || !onSave || Object.keys(responses).length === 0) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave({
          responses,
          currentStep,
          totalSteps: questions.length
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [responses, currentStep, onSave, autoSave, autoSaveDelay, questions.length]);

  // Calculate risk score when responses change
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      const calculation = calculateRiskScore(questions, responses);
      setRiskCalculation(calculation);
    }
  }, [responses, questions]);

  const updateResponse = useCallback((questionCode: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionCode]: value
    }));

    // Clear any existing error for this question
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionCode];
      return newErrors;
    });
  }, []);

  const removeResponse = useCallback((questionCode: string) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[questionCode];
      return newResponses;
    });
  }, []);

  const validateCurrentStep = useCallback((stepQuestions: AssessmentQuestion[]) => {
    const newErrors: Record<string, string> = {};
    
    stepQuestions.forEach(question => {
      const response = responses[question.question_code];
      if (!validateResponse(question, response)) {
        newErrors[question.question_code] = `${question.question_text} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [responses]);

  const nextStep = useCallback((stepQuestions?: AssessmentQuestion[]) => {
    if (stepQuestions && !validateCurrentStep(stepQuestions)) {
      return false;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentStep, questions.length, validateCurrentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < questions.length) {
      setCurrentStep(step);
    }
  }, [questions.length]);

  const resetAssessment = useCallback(() => {
    setResponses({});
    setCurrentStep(0);
    setErrors({});
    setRiskCalculation(null);
  }, []);

  const isComplete = Object.keys(responses).length === questions.length;
  const progress = questions.length > 0 ? (Object.keys(responses).length / questions.length) * 100 : 0;

  const saveAssessment = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave({
        responses,
        currentStep,
        totalSteps: questions.length
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, responses, currentStep, questions.length]);

  return {
    // State
    responses,
    currentStep,
    errors,
    isSaving,
    riskCalculation,
    
    // Computed
    isComplete,
    progress,
    
    // Actions
    updateResponse,
    removeResponse,
    nextStep,
    previousStep,
    goToStep,
    resetAssessment,
    saveAssessment,
    validateCurrentStep
  };
}