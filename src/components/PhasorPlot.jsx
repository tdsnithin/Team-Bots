import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'

const PhasorPlot = ({ metrics }) => {
  const plotRef = useRef()
  
  useEffect(() => {
    if (!plotRef.current || !metrics) return
    
    const gamma = metrics.gamma
    
    Plotly.react(plotRef.current, {
      data: [
        {
          x: [0],
          y: [0],
          mode: 'markers+text',
          marker: { size: 12, color: 'white' },
          text: ['Origin'],
          textposition: 'middle center',
          showlegend: false
        },
        {
          x: [gamma.re],
          y: [gamma.im],
          mode: 'markers+lines+text',
          line: { 
            color: metrics.performance === 'good' ? '#10b981' : 
                   metrics.performance === 'moderate' ? '#f59e0b' : '#ef4444',
            width: 4 
          },
          marker: { 
            size: 16,
            color: metrics.performance === 'good' ? '#10b981' : 
                   metrics.performance === 'moderate' ? '#f59e0b' : '#ef4444'
          },
          text: ['Γ'],
          textposition: 'top center',
          name: 'Reflection Coefficient Γ',
          hovertemplate: `Γ: (%{x:.3f}, %{y:.3f})<br>Magnitude: ${metrics.gammaMag.toFixed(3)}<br>Phase: ${metrics.gammaPhaseDeg.toFixed(1)}°<extra></extra>`
        },
        // Unit circle
        {
          x: Array.from({length: 100}, (_, i) => Math.cos(i * 2 * Math.PI / 99)),
          y: Array.from({length: 100}, (_, i) => Math.sin(i * 2 * Math.PI / 99)),
          mode: 'lines',
          line: { color: 'rgba(255,255,255,0.3)', width: 2, dash: 'dot' },
          showlegend: false,
          name: 'Unit Circle'
        }
      ],
      layout: {
        title: {
          text: 'Reflection Coefficient Phasor Diagram',
          font: { size: 18, color: 'white' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(15,23,42,0.8)',
        font: { color: 'white' },
        xaxis: {
          title: 'Real part',
          range: [-1.2, 1.2],
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'white',
          zerolinewidth: 2
        },
        yaxis: {
          title: 'Imaginary part',
          range: [-1.2, 1.2],
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'white',
          zerolinewidth: 2,
          scaleanchor: 'x',
          scaleratio: 1
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
            y: 1.95,
            xref: 'paper',
            yref: 'paper',
            text: 'Hover Γ: Visual representation of reflection coefficient in complex plane.',
            showarrow: false,
            font: { color: 'white', size: 11 },
            bgcolor: 'rgba(59,130,246,0.9)',
            bordercolor: 'rgba(255,255,255,0.3)',
            borderwidth: 1
          },
          {
            x: 0.98,
            y: 0.02,
            xref: 'paper',
            yref: 'paper',
            text: `VSWR: ${metrics.vswr === Infinity ? '∞' : metrics.vswr.toFixed(2)} | RL: ${metrics.returnLoss === Infinity ? '∞' : metrics.returnLoss.toFixed(1)} dB`,
            showarrow: false,
            font: { color: 'white', size: 12 },
            bgcolor: 'rgba(0,0,0,0.7)',
            bordercolor: 'rgba(255,255,255,0.2)',
            borderwidth: 1
          }
        ]
      },
      config: {
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
      }
    })
  }, [metrics])
  
  return (
    <div className="h-96" title="Shows magnitude and phase of reflection in the complex plane.">
      {metrics ? (
        <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <div className="h-full flex items-center justify-center glass-card p-8">
          <div className="text-white/50 text-center">
            <div className="text-4xl mb-4">🎛️</div>
            <p>Waiting for calculation...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhasorPlot

