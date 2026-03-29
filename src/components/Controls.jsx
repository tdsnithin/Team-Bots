import { useState, useEffect, useCallback } from 'react'
import { calculateMetrics, PRESETS } from '../utils/rfCalculations'

const Controls = ({ params, onParamsChange, onMetricsChange }) => {
  const [localParams, setLocalParams] = useState(params)
  const [currentPreset, setCurrentPreset] = useState('matched')
  
  // Sync local params with parent
  useEffect(() => {
    setLocalParams(params)
  }, [params])
  
  const debouncedCalculate = useCallback(() => {
    const metrics = calculateMetrics(localParams)
    onMetricsChange(metrics)
    onParamsChange(localParams)
  }, [localParams, onMetricsChange, onParamsChange])
  
  useEffect(() => {
    const timeout = setTimeout(debouncedCalculate, 50)
    return () => clearTimeout(timeout)
  }, [localParams, debouncedCalculate])
  
  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey]
    setLocalParams(preset)
    setCurrentPreset(presetKey)
  }
  
  const handleInputChange = (field, value) => {
    setLocalParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }
  
  const handleSliderChange = (field, value) => {
    setLocalParams(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  return (
    <div className="glass-card p-8 space-y-8">
      <div>
        <h2 title="Adjust characteristic and load impedances Z0 and Zl" className="text-2xl font-bold mb-6 text-white flex items-center gap-3 cursor-help">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
          Impedance Controls
        </h2>
        
        {/* Characteristic Impedance Z0 */}
        <div className="space-y-4 mb-8">
          <label title="Standard impedance of the transmission line, usually 50 ohms." className="block text-lg font-semibold text-white/90 mb-3 cursor-help">Z₀ (Reference Impedance)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label title="Resistive part of the line impedance." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Real (Ω)</label>
              <input 
                type="number" 
                value={localParams.z0Real}
                onChange={(e) => handleInputChange('z0Real', e.target.value)}
                className="input-field"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label title="Reactive part of the line impedance (usually 0)." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Imag (Ω)</label>
              <input 
                type="number" 
                value={localParams.z0Imag}
                onChange={(e) => handleInputChange('z0Imag', e.target.value)}
                className="input-field"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        {/* Load Impedance Zl */}
        <div className="space-y-4 mb-8">
          <label title="Impedance of the connected load at the end of the line." className="block text-lg font-semibold text-white/90 mb-3 cursor-help">Zₗ (Load Impedance)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label title="Resistive component of the load." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Real (Ω)</label>
              <div className="space-y-2">
                <input 
                  type="number" 
                  value={localParams.zlReal}
                  onChange={(e) => handleInputChange('zlReal', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.1"
                />
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    step="0.1"
                    value={localParams.zlReal}
                    onChange={(e) => handleSliderChange('zlReal', parseFloat(e.target.value))}
                    className="w-full h-3 bg-transparent appearance-none cursor-pointer absolute opacity-0 z-10"
                  />
                  <div 
                    className="slider-track" 
                    style={{width: `${(localParams.zlReal / 200) * 100}%`}}
                  />
                </div>
              </div>
            </div>
            <div>
              <label title="Reactive component (inductive or capacitive behavior)." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Imag (Ω)</label>
              <div className="space-y-2">
                <input 
                  type="number" 
                  value={localParams.zlImag}
                  onChange={(e) => handleInputChange('zlImag', e.target.value)}
                  className="input-field"
                  step="0.1"
                  min="-200"
                  max="200"
                />
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="-200" 
                    max="200" 
                    step="0.1"
                    value={localParams.zlImag}
                    onChange={(e) => handleSliderChange('zlImag', parseFloat(e.target.value))}
                    className="w-full h-3 bg-transparent appearance-none cursor-pointer absolute opacity-0 z-10"
                  />
                  <div 
                    className="slider-track" 
                    style={{width: `${((localParams.zlImag + 200) / 400) * 100}%`, backgroundColor: localParams.zlImag >= 0 ? '#10b981' : '#f59e0b'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Parameters */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label title="Signal frequency. Higher frequency means shorter wavelength and more oscillations." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Frequency (GHz)</label>
            <div className="space-y-2">
              <input 
                type="number" 
                value={localParams.frequency}
                onChange={(e) => handleInputChange('frequency', parseFloat(e.target.value) || 1)}
                className="input-field"
                min="0.1"
                max="10"
                step="0.01"
              />
              <div className="slider-container">
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.01"
                  value={localParams.frequency}
                  onChange={(e) => handleSliderChange('frequency', parseFloat(e.target.value))}
                  className="w-full h-3 bg-transparent appearance-none cursor-pointer absolute opacity-0 z-10"
                />
                <div 
                  className="slider-track" 
                  style={{width: `${((localParams.frequency - 0.1) / 9.9) * 100}%`}}
                />
              </div>
            </div>
          </div>
          <div>
            <label title="Physical length of the transmission line. Affects how waves reflect and interfere." className="block text-sm font-medium mb-2 text-white/70 cursor-help">Line Length (m)</label>
            <input 
              type="number" 
              value={localParams.lineLength}
              onChange={(e) => handleInputChange('lineLength', parseFloat(e.target.value))}
              className="input-field"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Presets */}
        <div>
          <label className="block text-lg font-semibold text-white/90 mb-4">Presets</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`preset-btn ${currentPreset === key ? 'bg-white/30 border-white/40 ring-2 ring-blue-400/50' : ''}`}
              >
                <span className={`w-3 h-3 rounded-full ${key === 'matched' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls

