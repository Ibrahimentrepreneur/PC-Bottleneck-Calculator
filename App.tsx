
import React, { useState, useCallback } from 'react';
import { CPU_LIST, GPU_LIST, RESOLUTION_LIST } from './constants';
import type { Cpu, Gpu, Resolution, BottleneckResult } from './types';
import Selector from './components/Selector';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [selectedCpu, setSelectedCpu] = useState<string>(CPU_LIST[5].id);
  const [selectedGpu, setSelectedGpu] = useState<string>(GPU_LIST[5].id);
  const [selectedResolution, setSelectedResolution] = useState<string>(RESOLUTION_LIST[0].id);
  
  const [result, setResult] = useState<BottleneckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Short delay for better UX to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const cpu = CPU_LIST.find(c => c.id === selectedCpu);
    const gpu = GPU_LIST.find(g => g.id === selectedGpu);
    const resolution = RESOLUTION_LIST.find(r => r.id === selectedResolution);

    if (!cpu || !gpu || !resolution) {
      setError("Please select a valid CPU, GPU, and resolution.");
      setLoading(false);
      return;
    }

    // Calculation logic
    const effectiveCpuScore = cpu.score * resolution.modifier;
    const difference = gpu.score - effectiveCpuScore;
    
    let percentage = 0;
    if (gpu.score > 0 || effectiveCpuScore > 0) {
        percentage = (Math.abs(difference) / ((gpu.score + effectiveCpuScore) / 2)) * 100;
    }
    
    const bottleneckComponent = difference < 0 ? 'GPU' : 'CPU';
    const isBalanced = percentage < 10;

    const finalResult: BottleneckResult = {
      cpu,
      gpu,
      resolution,
      percentage: parseFloat(percentage.toFixed(1)),
      bottleneckComponent: isBalanced ? 'None' : bottleneckComponent,
      isBalanced,
    };
    
    setResult(finalResult);
    setLoading(false);
  }, [selectedCpu, selectedGpu, selectedResolution]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-tight">Bottleneck Solver</h1>
          <p className="text-slate-500 italic">not just a calculator</p>
          <p className="text-slate-400 mt-3 text-lg max-w-3xl mx-auto">Find out if your CPU and GPU are a good match for all your tasks, from gaming and creative work to professional use.</p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Selector
              label="Processor (CPU)"
              value={selectedCpu}
              onChange={e => setSelectedCpu(e.target.value)}
              options={CPU_LIST.map(c => ({ value: c.id, label: c.name }))}
            />
            <Selector
              label="Graphics Card (GPU)"
              value={selectedGpu}
              onChange={e => setSelectedGpu(e.target.value)}
              options={GPU_LIST.map(g => ({ value: g.id, label: g.name }))}
            />
            <Selector
              label="Screen Resolution"
              value={selectedResolution}
              onChange={e => setSelectedResolution(e.target.value)}
              options={RESOLUTION_LIST.map(r => ({ value: r.id, label: r.name }))}
            />
          </div>
          <div className="text-center">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-12 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 shadow-lg"
            >
              {loading ? 'Calculating...' : 'Calculate Bottleneck'}
            </button>
          </div>
        </main>
        
        {error && <div className="mt-6 bg-red-500/20 text-red-300 p-4 rounded-lg text-center">{error}</div>}
        
        <ResultDisplay result={result} loading={loading} />

      </div>
    </div>
  );
};

export default App;
