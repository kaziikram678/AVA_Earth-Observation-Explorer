import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, getDisplayLayer, confidenceForScore, nextStep, safeIndex, buildReport } from './analysis.js';
import { events } from '../data/events.js';

test('clamping and index guards keep replay in range', () => {
  assert.equal(clamp(-1, 0, 6), 0);
  assert.equal(safeIndex(99, 7), 6);
  assert.equal(safeIndex(NaN, 7), 0);
  assert.equal(nextStep(6, 7), 0);
});
test('automatic radar fallback on cloudy frames', () => {
  assert.equal(getDisplayLayer({ clouds: true }, 'auto'), 'radar');
  assert.equal(getDisplayLayer({ clouds: false }, 'auto'), 'optical');
  assert.equal(getDisplayLayer({ clouds: true }, 'optical'), 'optical');
});
test('score wording never implies disaster forecast probability', () => {
  assert.equal(confidenceForScore(80), 'Elevated pattern');
  assert.equal(confidenceForScore(20), 'Quieter pattern');
});
test('events have seven chronological demonstration stages and traceable evidence entries', () => {
  for (const event of events) {
    assert.equal(event.series.length, 7);
    assert.equal(event.series.filter(x => x.period === 'DURING').length, 1);
    assert.deepEqual([...event.series].map(x => x.fullDate).sort(), event.series.map(x => x.fullDate));
    assert.ok(event.evidence.every(x => ['High', 'Medium', 'Low'].includes(x.confidence)));
    assert.ok(buildReport(event).disclaimer.includes('ILLUSTRATIVE'));
  }
});
