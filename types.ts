
export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  PHISHING = 'PHISHING'
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  confidence: number;
  riskIndicators: string[];
  explanation: string;
  recommendedActions: string[];
  id: string;
  timestamp: number;
  originalText: string;
}

export interface GeminiAnalysisResponse {
  riskLevel: RiskLevel;
  confidence: number;
  riskIndicators: string[];
  explanation: string;
  recommendedActions: string[];
}
