const Dashboard = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-white/50">
          <div className="text-6xl mb-4">⚡</div>
          <p className="text-xl">Enter parameters to see metrics</p>
        </div>
      </div>
    )
  }
  
  const { gammaMag, gammaPhaseDeg, vswr, returnLoss, powerDelivered, performance } = metrics
  
  const formatVSWR = (vswr) => {
    if (!isFinite(vswr)) return '∞'
    return vswr.toFixed(2)
  }
  
  const formatRL = (rl) => {
    if (!isFinite(rl)) return '∞'
    return rl.toFixed(1)
  }
  
  const formatPower = (p) => (p * 100).toFixed(1) + '%'
  
  return (
    <div className="glass-card p-2">
      <h2 title="Key RF performance indicators for impedance matching" className="text-2xl font-bold mb-6 px-2 text-white flex items-center gap-3">
        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
        Performance Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reflection Coefficient Magnitude */}
        <div className="metric-card">
          <span title="How much signal is reflected back. 0 = no reflection, 1 = full reflection." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">|Γ|</span>
          <div className={`metric-value ${performance}`}>
            {gammaMag.toFixed(3)}
          </div>
        </div>
        
        {/* Gamma Phase */}
        <div className="metric-card">
          <span title="Phase of the reflected signal, showing how the wave shifts." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">∠Γ</span>
          <div className={`metric-value ${performance}`}>
            {gammaPhaseDeg.toFixed(1)}°
          </div>
        </div>
        
        {/* VSWR */}
        <div className="metric-card">
          <span title="Indicates how well the load is matched. 1 is perfect, higher means worse matching." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">VSWR</span>
          <div className={`metric-value ${performance}`}>
            {formatVSWR(vswr)}
          </div>
        </div>
        
        {/* Return Loss */}
        <div className="metric-card">
          <span title="How much signal is lost due to reflection. Higher dB is better match." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">Return Loss</span>
          <div className={`metric-value ${performance}`}>
            {formatRL(returnLoss)} dB
          </div>
        </div>
        
        {/* Power Delivered */}
        <div className="metric-card">
          <span title="Percentage of power that actually reaches the load." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">Power Delivered</span>
          <div className={`metric-value ${performance}`}>
            {formatPower(powerDelivered)}
          </div>
        </div>
        
        {/* Performance Indicator */}
        <div className="metric-card col-span-1 md:col-span-2 lg:col-span-1">
          <span title="Overall quality of impedance matching based on reflection coefficient." className="text-sm font-medium text-white/60 uppercase tracking-wide cursor-help">Match Quality</span>
          <div className={`text-4xl ${performance}`}>
            {performance === 'good' ? '✅' : 
             performance === 'moderate' ? '⚠️' : '❌'}
          </div>
          <div className={`text-sm font-medium capitalize mt-1 ${performance}`}>
            {performance}
          </div>
        </div>
      </div>
      
      {/* Color Legend */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 good"><div className="w-4 h-4 bg-emerald-400 rounded"></div>Good {'< -20 dB'}</div>
          <div className="flex items-center gap-2 moderate"><div className="w-4 h-4 bg-amber-400 rounded"></div>Moderate (-20 to -10 dB)</div>
          <div className="flex items-center gap-2 poor"><div className="w-4 h-4 bg-red-400 rounded"></div>Poor {'> -10 dB'}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

