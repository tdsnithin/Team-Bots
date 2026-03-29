import { useState, useCallback } from 'react'
import Controls from './components/Controls'
import Dashboard from './components/Dashboard'
import WavePlot from './components/WavePlot'
import PhasorPlot from './components/PhasorPlot'
import { calculateMetrics } from './utils/rfCalculations'

function App() {
    const [params, setParams] = useState({
      z0Real: 50,
      z0Imag: 0,
      zlReal: 50,
      zlImag: 0,
      frequency: 1, // GHz
      lineLength: 0.1
    })

  
  const [metrics, setMetrics] = useState(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])
  
  const updateMetrics = useCallback((newMetrics) => {
    setMetrics(newMetrics)
  }, [])
  
  // Animate phase for wave visualization
  const animate = useCallback(() => {
    setAnimationPhase(prev => prev + 0.05)
    requestAnimationFrame(animate)
  }, [])
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            VNA Reflection & VSWR Simulator
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
            Professional RF engineering tool for reflection coefficient and VSWR analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Controls + Dashboard */}
          <div className="space-y-8 lg:max-w-2xl">
            <Controls 
              params={params}
              onParamsChange={updateParams}
              onMetricsChange={updateMetrics}
            />
            <Dashboard metrics={metrics} />
          </div>
          
          {/* Right Column: Plots */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <WavePlot params={params} metrics={metrics} phase={animationPhase} />
            </div>
            <div className="glass-card p-8">
              <PhasorPlot metrics={metrics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

