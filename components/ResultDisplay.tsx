import React from 'react';
import type { BottleneckResult } from '../types';
import Loader from './Loader';

interface ResultDisplayProps {
  result: BottleneckResult | null;
  loading: boolean;
}

const ResultBar: React.FC<{ result: BottleneckResult }> = ({ result }) => {
    const { bottleneckComponent, percentage, isBalanced } = result;

    // Use percentage directly, but cap it at 100 for the bar width.
    const fillPercentage = isBalanced ? 0 : Math.min(100, percentage);

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-orange-400">CPU Bound</span>
                <span className="text-blue-400">GPU Bound</span>
            </div>
            <div className="relative w-full h-8 bg-slate-700 rounded-lg overflow-hidden flex">
                {/* Left (CPU) half */}
                <div className="w-1/2 h-full flex justify-end">
                    <div 
                        className="bg-orange-500 h-full rounded-l-lg transition-all duration-500 ease-out"
                        style={{ width: bottleneckComponent === 'CPU' ? `${fillPercentage}%` : '0%' }}
                    ></div>
                </div>
                {/* Right (GPU) half */}
                <div className="w-1/2 h-full flex justify-start">
                     <div 
                        className="bg-blue-500 h-full rounded-r-lg transition-all duration-500 ease-out"
                        style={{ width: bottleneckComponent === 'GPU' ? `${fillPercentage}%` : '0%' }}
                    ></div>
                </div>

                {/* Center line and Balanced text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-0.5 h-full bg-slate-900 z-10"></div>
                    {isBalanced && (
                        <div className="absolute text-white font-bold bg-green-500 px-4 py-1 rounded-md text-sm shadow-lg">Balanced</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PerformanceChart: React.FC<{ result: BottleneckResult }> = ({ result }) => {
  const { cpu, gpu, resolution } = result;
  const effectiveCpuScore = Math.round(cpu.score * resolution.modifier);
  const gpuScore = gpu.score;

  // Normalize against 100 for a consistent scale, as our max score is 100
  const cpuBarWidth = Math.min(100, (effectiveCpuScore / 100) * 100);
  const gpuBarWidth = Math.min(100, (gpuScore / 100) * 100);

  return (
    <div className="space-y-4 my-8">
       <h3 className="text-lg font-semibold text-center text-slate-300 mb-4">Performance Breakdown</h3>
       
       {/* Responsive CPU Bar */}
       <div className="flex flex-col md:flex-row md:items-center md:gap-4">
         <span 
           className="w-full md:w-40 text-left md:text-right text-sm font-medium text-orange-400 truncate mb-1 md:mb-0" 
           title={`Effective CPU Power (${cpu.name})`}
         >
           Effective CPU Power
         </span>
         <div className="w-full md:flex-1 bg-slate-700 rounded-md h-6 overflow-hidden">
           <div 
             className="bg-orange-500 h-6 rounded-md text-xs font-bold text-white flex items-center justify-end px-2 transition-all duration-700 ease-out"
             style={{ width: `${cpuBarWidth}%` }}
           >
             <span>{effectiveCpuScore}</span>
           </div>
         </div>
       </div>

       {/* Responsive GPU Bar */}
       <div className="flex flex-col md:flex-row md:items-center md:gap-4">
         <span 
            className="w-full md:w-40 text-left md:text-right text-sm font-medium text-blue-400 truncate mb-1 md:mb-0" 
            title={`GPU Power (${gpu.name})`}
         >
           GPU Power
         </span>
         <div className="w-full md:flex-1 bg-slate-700 rounded-md h-6 overflow-hidden">
           <div 
             className="bg-blue-500 h-6 rounded-md text-xs font-bold text-white flex items-center justify-end px-2 transition-all duration-700 ease-out"
             style={{ width: `${gpuBarWidth}%` }}
           >
             <span>{gpuScore}</span>
           </div>
         </div>
       </div>
       <p className="text-center text-xs text-slate-500 pt-2">
           Effective CPU power is adjusted for <strong>{resolution.name}</strong>. At higher resolutions, the GPU typically bears more load.
       </p>
    </div>
  );
};

const getExplanationMessage = (result: BottleneckResult): string => {
  const { bottleneckComponent, isBalanced } = result;
  if (isBalanced) {
    return "This is a great pairing for gaming at your selected resolution. Neither component is significantly holding the other back, which should result in a smooth and consistent experience.";
  }
  if (bottleneckComponent === 'GPU') {
    return "Your CPU can prepare frames faster than your GPU can render them at this resolution. This means your graphics card is the main performance-limiting factor, and a GPU upgrade would yield better framerates.";
  }
  if (bottleneckComponent === 'CPU') {
    return "Your GPU is not being fully utilized because it's waiting on the CPU to handle game logic and prepare frames. A more powerful CPU would unlock your GPU's full potential and improve performance.";
  }
  return '';
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  if (loading) {
      return (
          <div className="mt-8 flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
              <Loader />
              <p className="mt-4 text-slate-400">Calculating...</p>
          </div>
      )
  }
  
  if (!result) {
    return null;
  }

  const { cpu, gpu, resolution, percentage, bottleneckComponent, isBalanced } = result;

  const getResultMessage = () => {
    if (isBalanced) {
      return `Your ${cpu.name} and ${gpu.name} are well-balanced at ${resolution.name}.`;
    }
    return `Your ${bottleneckComponent} is the bottleneck by ${percentage}% at ${resolution.name}.`;
  };
  
  const resultColor = isBalanced 
    ? 'text-green-300' 
    : (bottleneckComponent === 'CPU' ? 'text-orange-300' : 'text-blue-300');

  return (
    <div className="mt-8 p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">Calculation Result</h2>
      
      <div className="text-center mb-6">
          <p className={`text-4xl font-extrabold tracking-tighter transition-colors duration-500 ${resultColor}`}>
              {isBalanced ? 'Excellent Match!' : `${percentage}%`}
          </p>
          <p className="text-slate-400 mt-1">{getResultMessage()}</p>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
            {getExplanationMessage(result)}
          </p>
      </div>

      <div className="mb-8 px-4">
        <ResultBar result={result} />
      </div>
      
      <PerformanceChart result={result} />

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultDisplay;