export interface GraphNode {
  id: string;
  label: string;
  type: string;
  confidence: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ReviewResponse {
  task: string;
  concepts: string[];
  lessons: string[];
  warnings: string[];
  recommendations: string[];
  confidence: string;
  evidence: string[];
}
