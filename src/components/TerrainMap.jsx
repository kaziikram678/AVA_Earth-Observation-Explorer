import React from 'react';
import { Crosshair, Eye, Radio, Waves } from 'lucide-react';

function TerrainArtwork({ event, stepIndex, layer }) {
  const isWater = event.id === 'delta';
  const isForest = event.id === 'forest';
  return (
    <svg className={`terrain-art terrain-${event.id} terrain-${layer}`} viewBox="0 0 800 480" role="img" aria-label={`Illustrative topographic drawing for ${event.name}, ${layer} layer` } preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mountainBase" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isWater ? '#174447' : isForest ? '#224036' : '#294c51'} />
          <stop offset=".55" stopColor={isWater ? '#0a2c3b' : isForest ? '#162c35' : '#14313a'} />
          <stop offset="1" stopColor="#081820" />
        </linearGradient>
        <linearGradient id="ridge" x1="0" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor={isWater ? '#2e7977' : '#92a29a'} stopOpacity=".76" />
          <stop offset=".45" stopColor={isWater ? '#245e67' : isForest ? '#417660' : '#566d70'} stopOpacity=".55" />
          <stop offset="1" stopColor="#14333b" stopOpacity=".1" />
        </linearGradient>
        <radialGradient id="focusGlow"><stop stopColor="#a8f169" stopOpacity=".32"/><stop offset=".4" stopColor="#8bef8a" stopOpacity=".12"/><stop offset="1" stopColor="#8bef8a" stopOpacity="0"/></radialGradient>
        <pattern id="surveyGrid" width="47" height="47" patternUnits="userSpaceOnUse"><path d="M 47 0 L 0 0 0 47" fill="none" stroke="#bad4c4" strokeWidth=".6" strokeOpacity=".09" /></pattern>
        <filter id="topoNoise"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="5" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/></filter>
      </defs>
      <rect width="800" height="480" fill="url(#mountainBase)" />
      <path d="M-25 95 L90 20 185 96 271 -23 345 38 414 -20 534 121 655 -42 825 39 850 197 764 184 651 206 557 134 494 242 396 170 275 259 153 170 66 228 -25 198Z" fill="url(#ridge)" opacity={isWater ? '.4' : '.94'}/>
      <path d="M-40 290 80 202 170 245 261 133 353 239 460 88 527 155 651 81 768 211 847 175 847 490 -35 489Z" fill="#315962" opacity=".55" />
      <path d="M-30 410 105 278 205 308 340 187 439 300 588 201 698 326 825 243 835 491 -20 491Z" fill="#0c303d" opacity=".81" />
      <path d="M-40 492 C115 357 144 398 222 314S342 253 412 292 530 377 624 323 716 359 842 243" fill="none" stroke={isWater ? '#5cdbcf' : '#68b9c2'} strokeWidth={isWater ? '29' : '10'} opacity=".44" />
      <path d="M-40 492 C115 357 144 398 222 314S342 253 412 292 530 377 624 323 716 359 842 243" fill="none" stroke="#a2eef1" strokeWidth={isWater ? '6' : '2'} opacity=".53" />
      {Array.from({length: 23}, (_,i) => (
        <path key={i} d={`M${-110 + i*35} ${-80+i*3} C${90+i*19} ${47+i*10}, ${35+i*21} ${178+i*4}, ${215+i*14} ${203+i*5} S${565+i*4} ${377-i*9}, 850 ${275+i*11}`} fill="none" stroke={i%3===0 ? '#c0e3d5' : '#b6d0c8'} strokeWidth={i%4===0 ? 1.1 : .65} opacity={isWater ? '.11' : '.22'} />
      ))}
      {Array.from({length: 9}, (_,i) => <ellipse key={`ell${i}`} cx={isWater ? 320 : 450} cy={isWater ? 260 : 192} rx={95+i*23} ry={22+i*17} fill="none" stroke="#aecfc8" strokeWidth=".8" opacity=".13" transform="rotate(-17 450 192)" />)}
      <rect width="800" height="480" fill="url(#surveyGrid)" />
      {layer==='radar' && <g opacity=".48"><path d="M0 0 800 0 800 480 0 480Z" fill="#0b3a39" opacity=".24"/>{Array.from({length: 35},(_,i)=><path key={`r${i}`} d={`M${i*25-35} 0  ${i*25+160} 480`} stroke="#87e5b6" strokeWidth="1" opacity={i%4===0 ? .27 : .07}/>)}</g>}
      {isForest && Array.from({length: 23},(_,i)=><circle key={`t${i}`} cx={85+(i*83)%660} cy={115+(i*47)%265} r={7+i%6} fill="#78b28c" opacity=".14"/>)}
      <circle cx={isWater ? 392 : isForest ? 479 : 431} cy={isWater ? 254 : isForest ? 246 : 224} r="174" fill="url(#focusGlow)" />
      <circle cx={isWater ? 392 : isForest ? 479 : 431} cy={isWater ? 254 : isForest ? 246 : 224} r="94" fill="none" stroke="#c2f880" strokeWidth="1" opacity=".37" strokeDasharray="5 9" />
      <circle cx={isWater ? 392 : isForest ? 479 : 431} cy={isWater ? 254 : isForest ? 246 : 224} r="54" fill="none" stroke="#b7fc83" strokeWidth="1.4" opacity=".67" />
      <path d={`M${isWater ? 392 : isForest ? 479 : 431} ${isWater ? 192 : isForest ? 184 : 162}v124 M${isWater ? 330 : isForest ? 417 : 369} ${isWater ? 254 : isForest ? 246 : 224}h124`} stroke="#d1f9a0" strokeWidth="1" opacity=".62" />
      <circle cx={isWater ? 392 : isForest ? 479 : 431} cy={isWater ? 254 : isForest ? 246 : 224} r="8" fill="#b6f679" stroke="#0a2724" strokeWidth="4" />
      {stepIndex >= 3 && <g transform={`translate(${isWater ? 392 : isForest ? 479 : 431}, ${isWater ? 254 : isForest ? 246 : 224})`}><circle r="119" stroke="#c7f593" strokeWidth="1" fill="none" strokeDasharray="2 12" opacity=".65"/><circle r="11" fill="#b9ef8d" opacity=".2"/></g>}
      <g fontFamily="monospace" fill="#e7fcdb" fontSize="11" letterSpacing="2"><text x="42" y="44">28° 12′ N</text><text x="656" y="450">ELEV. CONTOURS</text></g>
    </svg>
  );
}

export default function TerrainMap({ event, step, stepIndex, layer, preference, onPreferenceChange }) {
  const radarFallback = preference === 'auto' && step.clouds;
  return (
    <div className="scene-map-shell">
      <div className="scene-map">
        <TerrainArtwork event={event} stepIndex={stepIndex} layer={layer} />
        <div className="map-tint" />
        <div className="map-top-left"><span className="live-dot" /> SATELLITE STORY VIEW <span className="map-pipe">/</span> ILLUSTRATIVE</div>
        <div className="map-scale-top">{event.imageTag} <span>•</span> FRAME {String(stepIndex + 1).padStart(2,'0')}</div>
        <div className="map-crosshair"><Crosshair size={12}/> POINT OF INTEREST</div>
        <div className="map-bottom-left"><span className="map-caption-kicker">CURRENT SCENE</span><strong>{event.name}</strong><span>{event.coordinates}</span></div>
        <div className="map-north">N <span>↑</span></div>
        <div className="map-scale">0 <div className="map-scale-line" /> 5 km <span>(illustrative scale)</span></div>
        <div className={`sensor-banner ${radarFallback?'visible':''}`}><Radio size={15} /> Cloud obstruction — radar illustration activated</div>
      </div>
      <div className="map-toolbar">
        <div className="map-toolbar-title"><Eye size={15} /><span>Observation layer</span></div>
        <div className="layer-switch" role="group" aria-label="Select observation layer">
          {[['auto','Auto'],['optical','Optical'],['radar','Radar']].map(([value,label])=><button key={value} className={preference===value?'selected':''} aria-pressed={preference===value} onClick={()=>onPreferenceChange(value)}>{label}</button>)}
        </div>
        <span className="actual-layer">{layer==='radar' ? <Radio size={14}/>:<Waves size={14}/>} {layer === 'radar' ? 'Radar view' : 'Optical view'}</span>
      </div>
    </div>
  );
}
