export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export function getDisplayLayer(step, layerPreference = 'auto') {
  if (layerPreference === 'radar') return 'radar';
  if (layerPreference === 'optical') return 'optical';
  return step?.clouds ? 'radar' : 'optical';
}
export function confidenceForScore(score) {
  // UI illustration only. The score is NOT a probability or a confidence estimate.
  if (score >= 70) return 'Elevated pattern';
  if (score >= 40) return 'Changing pattern';
  return 'Quieter pattern';
}
export function nextStep(index, count) { return count > 0 ? (index + 1) % count : 0; }
export function safeIndex(index, count) { return clamp(Number.isFinite(index) ? index : 0, 0, Math.max(0, count - 1)); }
export function buildReport(event) {
  return {
    title: `AVA demonstration — ${event.name}`,
    disclaimer: 'ILLUSTRATIVE PRESENTATION DATA ONLY. Not NASA observations, a forecast or validated causal evidence.',
    location: event.region,
    scenarioDate: event.date,
    stages: event.series,
    evidence: event.evidence.map(({ id, source, ...rest }) => ({ id, dataset: source.name, ...rest })),
    notes: 'Real integration needs source URLs, acquisition timestamps, grids, cloud masks, quality checks, historical baselines, backtesting and expert validation.'
  };
}
