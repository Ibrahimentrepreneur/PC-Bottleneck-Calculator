
import type { Cpu, Gpu, Resolution } from './types';

export const CPU_LIST: Cpu[] = [
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', score: 75 },
  { id: 'i5-13600k', name: 'Intel Core i5-13600K', score: 88 },
  { id: 'i7-13700k', name: 'Intel Core i7-13700K', score: 95 },
  { id: 'i9-13900k', name: 'Intel Core i9-13900K', score: 100 },
  { id: 'r5-5600x', name: 'AMD Ryzen 5 5600X', score: 72 },
  { id: 'r5-7600x', name: 'AMD Ryzen 5 7600X', score: 85 },
  { id: 'r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', score: 96 },
  { id: 'r9-7950x', name: 'AMD Ryzen 9 7950X', score: 99 },
];

export const GPU_LIST: Gpu[] = [
  { id: 'rtx3060', name: 'NVIDIA GeForce RTX 3060', score: 65 },
  { id: 'rtx3070', name: 'NVIDIA GeForce RTX 3070', score: 75 },
  { id: 'rtx3080', name: 'NVIDIA GeForce RTX 3080', score: 85 },
  { id: 'rtx4070', name: 'NVIDIA GeForce RTX 4070', score: 90 },
  { id: 'rtx4080', name: 'NVIDIA GeForce RTX 4080', score: 96 },
  { id: 'rtx4090', name: 'NVIDIA GeForce RTX 4090', score: 100 },
  { id: 'rx6700xt', name: 'AMD Radeon RX 6700 XT', score: 72 },
  { id: 'rx7800xt', name: 'AMD Radeon RX 7800 XT', score: 88 },
  { id: 'rx7900xtx', name: 'AMD Radeon RX 7900 XTX', score: 97 },
];

export const RESOLUTION_LIST: Resolution[] = [
  { id: '1080p', name: '1080p (Full HD)', modifier: 1.0 }, // CPU is more important
  { id: '1440p', name: '1440p (QHD)', modifier: 0.85 },
  { id: '2160p', name: '4K (UHD)', modifier: 0.7 }, // GPU is more important
];
