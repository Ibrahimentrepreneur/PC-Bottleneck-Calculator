export interface Cpu {
  id: string;
  name: string;
  score: number; // A relative performance score
}

export interface Gpu {
  id: string;
  name: string;
  score: number; // A relative performance score
}

export interface Resolution {
  id: string;
  name: string;
  modifier: number; // A factor to adjust CPU score based on resolution
}

export interface BottleneckResult {
  cpu: Cpu;
  gpu: Gpu;
  resolution: Resolution;
  percentage: number;
  bottleneckComponent: 'CPU' | 'GPU' | 'None';
  isBalanced: boolean;
}