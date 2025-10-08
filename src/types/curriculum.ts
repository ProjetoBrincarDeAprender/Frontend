export interface KnowledgeArea {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
}

export interface Competency {
  id: number;
  name: string;
  description: string;
  code: string;
  knowledgeAreaId: number;
  knowledgeArea?: KnowledgeArea;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  instructions: string;
  competencyId: number;
  competency?: Competency;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTime: number; // em minutos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
}

export interface Question {
  id: number;
  title: string;
  statement: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN' | 'FILL_BLANK';
  activityId: number;
  activity?: Activity;
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
  questionId: number;
}

export interface CreateKnowledgeAreaData {
  name: string;
  description: string;
  code: string;
}

export interface CreateCompetencyData {
  name: string;
  description: string;
  code: string;
  knowledgeAreaId: number;
}

export interface CreateActivityData {
  title: string;
  description: string;
  instructions: string;
  competencyId: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTime: number;
}

export interface CreateQuestionData {
  title: string;
  statement: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN' | 'FILL_BLANK';
  activityId: number;
  options?: Omit<QuestionOption, 'id' | 'questionId'>[];
  correctAnswer?: string;
  points: number;
  order: number;
}