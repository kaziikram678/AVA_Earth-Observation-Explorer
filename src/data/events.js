/**
 * IMPORTANT: Every value below is hand-authored illustrative demo data.
 * No live NASA API, historical Earth observation service, or scientifically
 * validated precursor-score model is connected. Dates and source names label
 * a presentation scenario; they are NOT verified observations or citations.
 */
const mountainSeries = [
  { date: 'Jul 01', fullDate: '2026-07-01', title: 'A quieter baseline', period: 'BEFORE', caption: 'Start with the landscape before conditions begin to change. Compare multiple observations, not a single image.', rain: 27, temp: 0.2, snow: 78, soil: 30, score: 15, clouds: false },
  { date: 'Jul 28', fullDate: '2026-07-28', title: 'Rainfall begins to rise', period: 'BEFORE', caption: 'The rainfall signal rises in our demonstration. A higher value is a clue to investigate, not a prediction.', rain: 62, temp: 0.6, snow: 70, soil: 43, score: 31, clouds: false },
  { date: 'Aug 09', fullDate: '2026-08-09', title: 'Multiple signals change', period: 'BEFORE', caption: 'Warming, reduced snow coverage and wetter soil appear together. We can describe co-occurrence without claiming cause.', rain: 83, temp: 1.5, snow: 57, soil: 57, score: 52, clouds: true },
  { date: 'Aug 22', fullDate: '2026-08-22', title: 'An unusual combination', period: 'BEFORE', caption: 'A higher illustrative score brings several anomalies into one view. Satellite cloud obstruction triggers the radar demonstration.', rain: 95, temp: 2.1, snow: 40, soil: 76, score: 79, clouds: true },
  { date: 'Aug 26', fullDate: '2026-08-26', title: 'The reported change', period: 'DURING', caption: 'The reference script describes a glacier collapse in northern Nepal. This animation is conceptual and does not verify that event.', rain: 72, temp: 1.8, snow: 36, soil: 83, score: 88, clouds: true },
  { date: 'Sep 02', fullDate: '2026-09-02', title: 'Tracing the aftermath', period: 'AFTER', caption: 'Post-event observations can help characterize change. Verification would require georeferenced imagery and expert review.', rain: 38, temp: 1.0, snow: 33, soil: 63, score: 55, clouds: false },
  { date: 'Sep 12', fullDate: '2026-09-12', title: 'Reviewing what we know', period: 'AFTER', caption: 'Now compare the evidence, inspect uncertainties and identify what has not been established.', rain: 19, temp: 0.5, snow: 42, soil: 47, score: 29, clouds: false }
];
const floodSeries = [
  { date: 'Jun 09', fullDate: '2026-06-09', title: 'Seasonal starting point', period: 'BEFORE', caption: 'Review ordinary seasonal conditions as the reference for interpreting changes.', rain: 31, temp: 0.3, snow: 0, soil: 34, score: 17, clouds: false },
  { date: 'Jun 21', fullDate: '2026-06-21', title: 'Rainfall accumulation', period: 'BEFORE', caption: 'Rain observations suggest a wetter illustrative period.', rain: 55, temp: 0.4, snow: 0, soil: 46, score: 29, clouds: false },
  { date: 'Jul 02', fullDate: '2026-07-02', title: 'Water on the landscape', period: 'BEFORE', caption: 'Soil moisture and rainfall are viewed on a shared timeline.', rain: 78, temp: 0.6, snow: 0, soil: 67, score: 57, clouds: true },
  { date: 'Jul 13', fullDate: '2026-07-13', title: 'Persistent cloud coverage', period: 'BEFORE', caption: 'A radar product can sometimes provide information despite optical clouds.', rain: 93, temp: 0.7, snow: 0, soil: 79, score: 74, clouds: true },
  { date: 'Jul 16', fullDate: '2026-07-16', title: 'Scenario flood peak', period: 'DURING', caption: 'This is a fictional teaching scenario, not a verified real flood.', rain: 100, temp: 0.8, snow: 0, soil: 90, score: 91, clouds: true },
  { date: 'Jul 20', fullDate: '2026-07-20', title: 'Water begins to recede', period: 'AFTER', caption: 'Examine the change without inferring a single certain cause.', rain: 43, temp: 0.5, snow: 0, soil: 72, score: 58, clouds: true },
  { date: 'Aug 02', fullDate: '2026-08-02', title: 'Comparing recovery', period: 'AFTER', caption: 'Researchers could compare scenes before and after to validate mapped impacts.', rain: 24, temp: 0.2, snow: 0, soil: 54, score: 31, clouds: false }
];
const fireSeries = [
  { date: 'Mar 04', fullDate: '2026-03-04', title: 'Forest baseline', period: 'BEFORE', caption: 'Begin by reviewing a historical seasonal reference.', rain: 44, temp: 0.2, snow: 0, soil: 70, score: 14, clouds: false },
  { date: 'Mar 15', fullDate: '2026-03-15', title: 'A drier interval', period: 'BEFORE', caption: 'Dryness can matter, but cannot establish an ignition cause.', rain: 29, temp: 0.8, snow: 0, soil: 58, score: 26, clouds: false },
  { date: 'Mar 24', fullDate: '2026-03-24', title: 'Heat anomaly appears', period: 'BEFORE', caption: 'The temperature anomaly is compared with moisture signals.', rain: 20, temp: 1.4, snow: 0, soil: 46, score: 47, clouds: false },
  { date: 'Apr 04', fullDate: '2026-04-04', title: 'Hotter, drier conditions', period: 'BEFORE', caption: 'A combination of illustrative dry and warm conditions deserves attention.', rain: 12, temp: 2.1, snow: 0, soil: 31, score: 78, clouds: false },
  { date: 'Apr 08', fullDate: '2026-04-08', title: 'Scenario fire day', period: 'DURING', caption: 'This event is fictional, and its cause is not established.', rain: 8, temp: 2.5, snow: 0, soil: 24, score: 89, clouds: true },
  { date: 'Apr 12', fullDate: '2026-04-12', title: 'Surface changes', period: 'AFTER', caption: 'Earth observations can map changes to surface reflectance or vegetation after a fire.', rain: 16, temp: 1.2, snow: 0, soil: 27, score: 60, clouds: false },
  { date: 'Apr 24', fullDate: '2026-04-24', title: 'Evidence review', period: 'AFTER', caption: 'Independent source verification is necessary before reporting affected area.', rain: 26, temp: 0.7, snow: 0, soil: 38, score: 33, clouds: false }
];
const sources = [
  { name: 'GPM IMERG', type: 'Precipitation', icon: 'rain', description: 'Rainfall timing and intensity', detail: 'NASA Global Precipitation Measurement' },
  { name: 'Landsat', type: 'Optical imagery', icon: 'image', description: 'Visible landscape change', detail: 'NASA / USGS Landsat mission' },
  { name: 'MODIS Snow', type: 'Snow cover', icon: 'snow', description: 'Snow and seasonal variation', detail: 'NASA MODIS snow product' },
  { name: 'SMAP', type: 'Soil moisture', icon: 'soil', description: 'Moisture conditions at the surface', detail: 'NASA Soil Moisture Active Passive mission' },
  { name: 'SRTM', type: 'Terrain', icon: 'terrain', description: 'Elevation and slope context', detail: 'NASA Shuttle Radar Topography Mission' },
  { name: 'SAR / radar', type: 'Radar imagery', icon: 'radar', description: 'Cloud-tolerant sensing where coverage exists', detail: 'Radar coverage must be independently verified' }
];
const cardsFor = (series, kind) => [
  { id: 'imerg', source: sources[0], date: series[3].fullDate, confidence: 'Medium', summary: kind === 'Wildfire' ? 'Drier conditions in the example timeline.' : 'Elevated recent precipitation in the example timeline.', finding: 'Illustrative values are not observed measurements. A future implementation would fetch precipitation rasters, apply quality flags and calculate a local anomaly.' },
  { id: 'landsat', source: sources[1], date: series[4].fullDate, confidence: 'Low', summary: 'Optical interpretation is limited by sample cloud coverage.', finding: 'An optical scene cannot support conclusions where clouds conceal the ground. This card demonstrates the need for a cloud mask and fallback evidence.' },
  { id: 'smap', source: sources[3], date: series[3].fullDate, confidence: 'Medium', summary: 'Surface moisture changes can be compared with other indicators.', finding: 'For real analysis, spatial resolution and uncertainty must be considered; surface moisture cannot identify a collapse mechanism alone.' },
  { id: 'terrain', source: sources[4], date: series[0].fullDate, confidence: 'High', summary: 'Elevation provides a useful static geographic context.', finding: 'High confidence here represents an illustrative classification for a stable terrain reference, not independently evaluated geolocation accuracy.' },
  { id: 'snow', source: sources[2], date: series[2].fullDate, confidence: 'Low', summary: kind === 'Glacier change' ? 'Snow cover change is a potential contextual clue.' : 'Snow may not be relevant to this scenario.', finding: 'Seasonality, resolution and cloud conditions complicate interpretation. The relative importance of snow must be established for a real event.' },
  { id: 'radar', source: sources[5], date: series[4].fullDate, confidence: 'Low', summary: 'Radar is suggested where optical views are blocked.', finding: 'The radar view in AVA is illustrative artwork, not a processed SAR acquisition. Orbit, acquisition date and geographic coverage would need confirmation.' }
];

export const events = [
  { id: 'langtang', name: 'Langtang Valley', region: 'Bagmati, Nepal', coordinates: '28.21° N, 85.56° E', type: 'Glacier change', date: '26 Aug 2026', label: 'Primary concept scenario', headline: 'What happened in Langtang?', description: 'Follow the clues before, during and after the reported glacier-change scenario in the original AVA presentation.', accent: '#b0f26b', series: mountainSeries, evidence: cardsFor(mountainSeries, 'Glacier change'), imageTag: 'HIMALAYAN TERRAIN' },
  { id: 'delta', name: 'Coastal Delta', region: 'South Asia · conceptual', coordinates: 'Location intentionally unspecified', type: 'Flood', date: '16 Jul 2026', label: 'Fictional teaching scenario', headline: 'When the water rises', description: 'Follow a purely fictional flood sequence to see how rainfall, soil moisture and radar evidence could work together.', accent: '#64dfd0', series: floodSeries, evidence: cardsFor(floodSeries, 'Flood'), imageTag: 'COASTAL WATERSHED' },
  { id: 'forest', name: 'Forest Highlands', region: 'Conceptual example · no real site', coordinates: 'Location intentionally unspecified', type: 'Wildfire', date: '08 Apr 2026', label: 'Fictional teaching scenario', headline: 'Reading a changing forest', description: 'Explore a hypothetical wildfire timeline, where heat and dryness are clues but not proof of ignition.', accent: '#ffc480', series: fireSeries, evidence: cardsFor(fireSeries, 'Wildfire'), imageTag: 'FOREST LANDSCAPE' }
];

export const team = [
  { name: 'Md Kazi Ikram Uddin', role: 'Research & Team Lead' },
  { name: 'Abonti Barua Chowdhury', role: 'NASA Data & Analysis' },
  { name: 'Fariha Hannan Niga', role: 'AI & Data Processing' },
  { name: 'Rownok Jahan Nigar', role: 'Frontend Development' },
  { name: 'Sharjil Bin Rashed', role: 'UI/UX & Visualization' },
  { name: 'MD Tazdik Ayub Sazil', role: 'Storytelling & Presentation' }
];
export const confidenceOptions = ['All', 'High', 'Medium', 'Low'];
