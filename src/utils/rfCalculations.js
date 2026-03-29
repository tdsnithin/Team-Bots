import { complex, abs, arg } from 'mathjs'

/**
 * Calculate RF metrics from impedance parameters
 * @param {Object} params - {z0Real, z0Imag, zlReal, zlImag}
 * @returns {Object} metrics
 */
export function calculateMetrics(params) {
  try {
    // Parse complex impedances
    const Z0 = complex(params.z0Real, params.z0Imag)
    const Zl = complex(params.zlReal, params.zlImag)
    
    // Reflection coefficient Γ = (Zl - Z0) / (Zl + Z0)
    const gamma = Zl.sub(Z0).div(Zl.add(Z0))
    
    // Safe VSWR calculation (avoid div by zero)
    const gammaMag = abs(gamma)
    let vswr = 1
    if (gammaMag < 1) {
      vswr = (1 + gammaMag) / (1 - gammaMag)
    } else if (gammaMag > 1 - 1e-10) {
      vswr = Infinity
    }
    
    // Return Loss: RL = -20 * log10(|Γ|)
    const returnLoss = gammaMag > 0 ? -20 * Math.log10(gammaMag) : Infinity
    
    // Power delivered ratio
    const powerDelivered = 1 - gammaMag * gammaMag
    
    // Transmission coefficient τ = 1 + Γ
    const tau = complex(1, 0).add(gamma)
    
    return {
      gamma: gamma,           // Complex Γ
      gammaMag: gammaMag,     // |Γ|
      gammaPhaseDeg: arg(gamma) * 180 / Math.PI,  // ∠Γ (degrees)
      vswr: vswr,
      returnLoss: returnLoss,
      powerDelivered: powerDelivered,
      tau: tau,
      performance: getPerformanceLevel(gammaMag)
    }
  } catch (error) {
    console.error('Calculation error:', error)
    return null
  }
}

function getPerformanceLevel(gammaMag) {
  if (gammaMag < 0.1) return 'good'
  if (gammaMag < 0.3) return 'moderate'
  return 'poor'
}

/**
 * Preset configurations
 */
export const PRESETS = {
  matched: { z0Real: 50, z0Imag: 0, zlReal: 50, zlImag: 0 },
  open: { z0Real: 50, z0Imag: 0, zlReal: 99999, zlImag: 0 },
  short: { z0Real: 50, z0Imag: 0, zlReal: 0, zlImag: 0 }
}
