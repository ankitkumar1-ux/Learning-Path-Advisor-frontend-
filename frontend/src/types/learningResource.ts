export interface LearningResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: string;
  difficulty: string;
  tags: string[];
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendationResponse {
  summary: string;
  resources: LearningResource[];
  totalEstimatedMinutes: number;
  explanation: string;
}
