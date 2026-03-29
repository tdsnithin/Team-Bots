import { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist-min'

const WavePlot = ({ params, metrics, phase }) => {
  const plotRef = useRef()
  const [plotReady, setPlotReady] = useState(false)
  
  useEffect(() => {
    if (!plotRef.current || !plotReady || !metrics) return
    
    const c = 3e8 // speed of light m/s
    const f_GHz = params.frequency
    const f_Hz = f_GHz * 1e9
    const lambda = c / f_Hz
    const beta = 2 * Math.PI / lambda
    const omega_t = phase * 2 * Math.PI
    const lineLength = params.lineLength || 0.1
    const N = 500
    const x = Array.from({length: N}, (_, i) => (i / (N-1)) * lineLength)
    
    const incident = x.map(xi => Math.cos(omega_t - beta * xi))
    const gammaPhaseRad = (metrics.gammaPhaseDeg * Math.PI / 180) || 0
    const reflected = x.map(xi => metrics.gammaMag * Math.cos(omega_t + beta * xi + gammaPhaseRad))
    const standing = x.map((xi, i) => incident[i] + reflected[i])
    
    Plotly.react(plotRef.current, {
      data: [
        {
          x: x,
          y: incident,
          mode: 'lines',
          name: 'Incident Wave',
          line: { color: '#10b981', width: 4 },
          hovertemplate: 'Position: %{x:.3f}m | V_i: %{y:.2f}<extra></extra>'
        },
        {
          x: x,
          y: reflected,
          mode: 'lines',
          name: 'Reflected Wave',
          line: { color: '#ef4444', width: 3, dash: 'dash' },
          hovertemplate: 'Position: %{x:.3f}m | V_r: %{y:.2f}<extra></extra>'
        },
        {
          x: x,
          y: standing,
          mode: 'lines',
          name: 'Standing Wave',
          line: { color: '#3b82f6', width: 6 },
          hovertemplate: 'Position: %{x:.3f}m | V: %{y:.2f}<extra></extra>'
        }
      ],
      layout: {
        title: {
          text: `Standing Wave Pattern (f=${f_GHz.toFixed(2)} GHz, L=${lineLength.toFixed(2)} m)`,
          font: { size: 18, color: 'white' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(15,23,42,0.8)',
        font: { color: 'white' },
        xaxis: {
          title: 'Position along transmission line (meters)',
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'rgba(255,255,255,0.2)'
        },
        yaxis: {
          title: 'Voltage amplitude',
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'rgba(255,255,255,0.2)',
          range: [-3, 3]
        },
        margin: { l: 60, r: 20, t: 50, b: 60 },
        showlegend: true,
        legend: { 
          bgcolor: 'rgba(255,255,255,0.1)',
          bordercolor: 'rgba(255,255,255,0.2)'
        },
        annotations: [
          {
            x: 0.02,
            y: 2.6,
            xref: 'paper',
            yref: 'paper',
            text: `Γ = ${metrics.gammaMag.toFixed(3)} ∠${metrics.gammaPhaseDeg.toFixed(1)}°`,
            showarrow: false,
            font: { color: '#3b82f6', size: 12 },
            bgcolor: 'rgba(0,0,0,0.7)'
          }
        ]
      },
      config: {
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
      }
    })
  }, [phase, metrics, params, plotReady])
  
  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, [], {
        paper_bgcolor: 'rgba(0,0,0,0)'
      }).then(() => setPlotReady(true))
    }
  }, [])
  
  return (
    <div className="h-96" title="Shows how incident and reflected waves combine along the transmission line.">
      <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default WavePlot
