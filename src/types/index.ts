export interface Criterion {
  name: string;
  itemAScore: number;
  itemBScore: number;
  itemAComment: string;
  itemBComment: string;
}

export interface CompareResult {
  id: string;
  itemA: string;
  itemB: string;
  category: string;
  summary: string;
  winner: "A" | "B" | "draw";
  winnerReason: string;
  criteria: Criterion[];
  conclusion: string;
  recommendation: string;
  createdAt: string;
}
