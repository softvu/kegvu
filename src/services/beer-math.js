const PULSES_PER_LITER = 450;
const LITERS_PER_KEG = 18.9271;
const PINTS_PER_LITER = 2.11338;
// const LITERS_PER_PINT = 0.473176;

export const FULL_KEG_PULSES = PULSES_PER_LITER * LITERS_PER_KEG;

export const pulsesToLiters = (pulses) => pulses / PULSES_PER_LITER;

export const pulsesToKegFillRatio = (pulses) => pulses / PULSES_PER_LITER / LITERS_PER_KEG;

export const pulsesToPints = (pulses) => pulses / PULSES_PER_LITER / PINTS_PER_LITER;

export const kegFillRatioToPints = (ratio) => ratio * LITERS_PER_KEG * PINTS_PER_LITER;