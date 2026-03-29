# VNA Reflection & VSWR Simulator

Professional web-based simulator for Vector Network Analyzer (VNA) reflection coefficient (Γ) and Voltage Standing Wave Ratio (VSWR) calculations.

## ✨ Features

- Real-time Γ, VSWR, Return Loss calculations using exact RF formulas
- Complex impedance support (Z0, Zl with real/imaginary parts)
- Interactive sliders + numeric inputs
- Professional Plotly visualizations (waveforms + phasor diagram)
- Preset scenarios (Matched, Open, Short)
- Modern dark-themed UI with Tailwind CSS
- Color-coded performance indicators
- Handles edge cases (division by zero, infinite impedance)

## 🚀 Quick Start

```bash
cd vna-vswr-simulator
npm install
npm run dev
```

Open http://localhost:5173

## 📐 Formulas Implemented

```
Γ = (Zl - Z0) / (Zl + Z0)
VSWR = (1 + |Γ|) / (1 - |Γ|)
Return Loss (dB) = -20 * log10(|Γ|)
Power Delivered = Pin * (1 - |Γ|²)
```

## 🧪 Validation Cases

| Scenario | ZL | Expected |
|----------|----|----------|
| Matched | 50+0j | VSWR=1, RL=∞ |
| Open | ∞ | VSWR=∞, RL=-∞ |
| Short | 0 | VSWR=∞, RL=-∞ |

## 🛠️ Tech Stack

- React 18 + Vite
- Tailwind CSS (dark mode)
- Plotly.js (interactive plots)
- math.js (complex math)

## 📁 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── Controls.jsx
│   │   ├── Dashboard.jsx
│   │   ├── WavePlot.jsx
│   │   ├── PhasorPlot.jsx
│   ├── utils/
│   │   └── rfCalculations.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

## 🔮 Future Features

- Transmission line effects
- Smith Chart
- S-parameter export
- Multiple frequency points
