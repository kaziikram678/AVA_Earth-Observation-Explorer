import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert,
  Clock3, Cloud, CloudSun, Compass, Crosshair, Database, Download,
  Droplets, ExternalLink, Eye, FileCheck2, FileText, Flame, Globe2, HelpCircle,
  Home, Info, Layers3, Link2, ListFilter, MapPin, Menu, MountainSnow,
  Pause, Play, Radio, Search, SearchX, Share2, ShieldAlert, ShieldCheck,
  Signal, SkipBack, SkipForward, Snowflake, Sparkles, Thermometer, Waves,
  Workflow, X
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import TerrainMap from './components/TerrainMap.jsx';
import { events, team, confidenceOptions } from './data/events.js';
import { buildReport, confidenceForScore, getDisplayLayer, nextStep, safeIndex } from './lib/analysis.js';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'explore', label: 'Explore stories', icon: Compass },
  { id: 'evidence', label: 'Evidence library', icon: Database },
  { id: 'method', label: 'Our method', icon: Workflow },
  { id: 'team', label: 'Meet the team', icon: Globe2 }
];
const sourceLabels = ['Landsat', 'GPM IMERG', 'MODIS', 'SMAP', 'SRTM', 'Radar'];
function pad(n) { return String(n).padStart(2, '0'); }
function iconForEvent(type) { return type === 'Flood' ? Waves : type === 'Wildfire' ? Flame : MountainSnow; }

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="Go to AVA overview"><span className="brand-logo"><svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M6 34 19.6 9h6.4L40 34h-9l-8.2-14.7L14.4 34H6Z" fill="currentColor"/><circle cx="36" cy="9" r="3.3" fill="#53dcca"/></svg></span><span className="brand-text"><strong>AVA<span className="brand-star">.</span></strong><small>EARTH, EXPLAINED</small></span></button>;
}

function Sidebar({ current, onNavigate, opened, onClose }) {
  return <>
    {opened && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation"/>}
    <aside className={`sidebar ${opened ? 'is-open' : ''}`}>
      <Brand onClick={() => onNavigate('overview')}/>
      <div className="side-section-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Primary navigation">{navItems.map(({ id,label,icon:Icon })=><button key={id} onClick={() => onNavigate(id)} className={`side-link ${current===id?'active':''}`} aria-current={current===id?'page':undefined}><Icon size={18} strokeWidth={1.8}/><span>{label}</span>{current===id && <span className="side-active-dot" />}</button>)}</nav>
      <div className="side-section-label side-section-label-2">DATA SOURCES</div>
      <div className="source-nav">{sourceLabels.map((source,i)=><div className="source-nav-item" key={source}><span className={`source-tick source-tick-${i%3}`} />{source}<span className="source-check"><Check size={12}/></span></div>)}</div>
      <div className="sidebar-bottom"><div className="mission-badge"><span className="mission-mini"><Sparkles size={16}/></span><strong>Science made human.</strong><p>Behind every dataset is a story worth understanding.</p></div><div className="sidebar-credit"><span className="team-symbol">VL</span><span><strong>Vantara Lumina</strong><small>Space Apps concept · 2026</small></span></div></div>
    </aside>
  </>;
}

function Topbar({ onMenu, event, onSearchSelect, onHelp, onNavigate }) {
  const [term,setTerm] = useState('');
  const [focused,setFocused] = useState(false);
  const results = events.filter(item => `${item.name} ${item.region} ${item.type}`.toLowerCase().includes(term.trim().toLowerCase()));
  return <header className="topbar">
    <div className="topbar-left"><button onClick={onMenu} className="icon-button menu-trigger" aria-label="Open navigation"><Menu size={20}/></button><span className="bread-muted">Workspace</span><ChevronRight size={15} className="bread-divider"/><span className="bread-current">Earth explorer</span></div>
    <div className="topbar-right">
      <div className="search-container"><Search size={17}/><input type="search" aria-label="Search available demonstration events" placeholder="Search a location or event..." value={term} onChange={e=>{setTerm(e.target.value);setFocused(true)}} onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>setFocused(false),160)}/><kbd>/</kbd>
        {focused && term.trim() && <div className="search-results"><span className="search-results-title">AVAILABLE DEMO STORIES</span>{results.length ? results.map(item=><button key={item.id} onMouseDown={e=>e.preventDefault()} onClick={()=>{onSearchSelect(item.id);setTerm('');setFocused(false)}}><MapPin size={16}/><span><strong>{item.name}</strong><small>{item.region} · {item.type}</small></span><ArrowUpRight size={15}/></button>) : <div className="search-none"><SearchX size={18}/><span>No demo story found. Live geographic search requires a data integration.</span></div>}</div>}
      </div>
      <button className="top-icon icon-button" onClick={onHelp} title="How to use AVA" aria-label="How to use AVA"><HelpCircle size={19}/></button>
      <button className="top-avatar" onClick={()=>onNavigate('team')} title="Meet Team Vantara Lumina" aria-label="Meet Team Vantara Lumina">VL</button>
    </div>
  </header>;
}

function DemoNotice({ small = false }) { return <div className={small ? 'demo-note demo-note-small':'demo-note'}><CircleAlert size={15}/><span><strong>Concept demo</strong> — illustrative data, not verified NASA observations or hazard forecasts.</span></div>; }

function SectionHeading({ eyebrow, title, description, right }) { return <div className="section-heading"><div><div className="mini-eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{right}</div>; }

function SignalCard({ icon:Icon, label, value, unit, trend, className = '' }) {
  return <div className={`signal-card ${className}`}><div className="signal-card-top"><Icon size={16}/><span>{label}</span></div><div className="signal-card-value">{value}<span>{unit}</span></div><div className="signal-card-foot"><span className="signal-dash"/>{trend}</div></div>;
}
function ScoreGauge({ score }) {return <div className="score-gauge" style={{'--score': `${score}%`}} role="img" aria-label={`Illustrative signal score ${score} out of 100`}><div className="gauge-inside"><span>{score}</span><small>/ 100</small></div></div>}

function StageCard({ event, step, stepIndex }) {
  return <div className="stage-panel"><div className="panel-header"><span><span className="small-green-dot"/> ACTIVE STORY</span><span className="panel-number">{pad(stepIndex+1)} / {pad(event.series.length)}</span></div>
    <div className="current-location"><span><MapPin size={14}/> {event.region}</span><span className="location-date">{event.date}</span></div>
    <h2>{event.name}</h2><div className="stage-chips"><span className="chip chip-lime">{event.type}</span><span className="chip">{step.period.toLowerCase()} event</span></div>
    <div className="stage-divider"/><div className="stage-kicker"><span className="tiny-line"/> THE STORY SO FAR</div><h3>{step.title}</h3><p className="stage-paragraph">{step.caption}</p>
    <div className="stage-progress"><span>STORY PROGRESS</span><span>{Math.round(((stepIndex+1)/event.series.length)*100)}%</span></div><div className="stage-progress-track"><span style={{width:`${((stepIndex+1)/event.series.length)*100}%`}}/></div>
    <div className="score-section"><div className="score-copy"><span className="label-upper">PRECURSOR SIGNAL SCORE</span><h4>{confidenceForScore(step.score)}</h4><p>Comparative pattern index for this demonstration only.</p></div><ScoreGauge score={step.score}/></div>
    <div className="stage-alert"><ShieldCheck size={17}/><span>This score is <strong>not</strong> a prediction or likelihood of disaster.</span></div>
  </div>;
}

function ReplayTimeline({ event, index, setIndex, playing, setPlaying }) {
  return <div className="timeline-card panel"><div className="timeline-head"><div><div className="mini-eyebrow">STEP BY STEP</div><h3>Replay the change</h3><p>From early signals to the aftermath.</p></div><div className="timeline-actions"><button className="transport-btn transport-small" onClick={()=>{setPlaying(false);setIndex(i=>(i-1+event.series.length)%event.series.length)}} title="Previous step" aria-label="Previous step"><SkipBack size={18}/></button><button className="transport-btn transport-play" onClick={()=>setPlaying(x=>!x)} aria-label={playing?'Pause replay':'Play replay'}>{playing ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}<span>{playing?'Pause':'Play replay'}</span></button><button className="transport-btn transport-small" onClick={()=>{setPlaying(false);setIndex(i=>nextStep(i,event.series.length))}} title="Next step" aria-label="Next step"><SkipForward size={18}/></button></div></div>
    <div className="timeline-track" role="group" aria-label="Choose a story date">{event.series.map((s,i)=><button key={s.fullDate} className={`timeline-point ${i===index?'selected':''} ${i<index?'passed':''}`} onClick={()=>{setPlaying(false);setIndex(i)}} aria-pressed={i===index} title={`${s.fullDate}: ${s.title}`}><span className="timeline-pin"/><span className="timeline-date">{s.date}</span><span className="timeline-stage">{s.period === 'DURING' ? 'Event' : i===0 ? 'Baseline' : (i===event.series.length-1?'Review':'')}</span></button>)}</div>
    <div className="timeline-foot"><span><span className="timeline-legend-dot before"/> Before</span><span><span className="timeline-legend-dot during"/> During</span><span><span className="timeline-legend-dot after"/> After</span><span className="timeline-foot-right">FRAME {pad(index+1)} OF {pad(event.series.length)}</span></div>
  </div>;
}

function ScoreChart({ event, index }) {
  return <div className="chart-card panel"><div className="chart-header"><div><div className="mini-eyebrow">PATTERN EXPLORER</div><h3>Signal score over time</h3></div><span className="legend-key"><span/> Example index</span></div><div className="chart-content"><ResponsiveContainer width="100%" height={170}><AreaChart data={event.series} margin={{top:15,right:8,left:-27,bottom:0}}><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#adf079" stopOpacity={.24}/><stop offset="95%" stopColor="#adf079" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#28434b" strokeDasharray="3 6"/><XAxis dataKey="date" tick={{fill:'#8a9da4',fontSize:10}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} ticks={[0,25,50,75,100]} tick={{fill:'#708d95',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#162a33',border:'1px solid #36515b',borderRadius:'10px',color:'#ebf4ef'}} formatter={(value)=>[`${value} / 100`, 'Illustrative score']}/><ReferenceLine x={event.series[index].date} stroke="#c4fb8c" strokeOpacity={.58} strokeDasharray="3 4"/><Area type="monotone" dataKey="score" stroke="#b3f58c" strokeWidth={2.5} fill="url(#chartFill)" activeDot={{r:5,fill:'#d4f99b',stroke:'#153329',strokeWidth:3}}/></AreaChart></ResponsiveContainer></div><div className="chart-footer"><Info size={13}/> Example scores are manually authored, not statistically calibrated.</div></div>;
}

function EvidenceCard({ item, expanded, onToggle }) {
  const confidenceClass = item.confidence.toLowerCase();
  return <article className={`evidence-card ${expanded ? 'evidence-expanded' : ''}`}><div className="evidence-top"><span className="evidence-icon">{item.id==='radar'?<Radio size={19}/>:item.id==='imerg'?<Droplets size={19}/>:item.id==='snow'?<Snowflake size={19}/>:item.id==='terrain'?<MountainSnow size={19}/>:item.id==='smap'?<Waves size={19}/>:<Layers3 size={19}/>}</span><span className={`confidence-pill confidence-${confidenceClass}`}><span/> {item.confidence}*</span></div><div className="evidence-source">{item.source.name}</div><div className="evidence-type">{item.source.type}</div><p>{item.summary}</p><div className="evidence-bottom"><span><CalendarDays size={13}/>{item.date}</span><button aria-expanded={expanded} onClick={onToggle}>{expanded?'Hide details':'See evidence'} <ArrowUpRight size={15}/></button></div>{expanded && <div className="evidence-detail"><strong>Interpretation & limits</strong><p>{item.finding}</p><span><Info size={13}/> Source type: {item.source.detail}</span></div>}</article>;
}

function EvidenceGrid({ event, initialLimit = null, standalone = false }) {
  const [filter,setFilter] = useState('All');
  const [expanded,setExpanded] = useState(null);
  useEffect(()=>{setFilter('All');setExpanded(null)},[event.id]);
  const selected = event.evidence.filter(item=>filter==='All'||item.confidence===filter);
  const shown = initialLimit ? selected.slice(0,initialLimit) : selected;
  return <div><div className="evidence-toolbar"><div className="filter-buttons" role="group" aria-label="Filter evidence by confidence">{confidenceOptions.map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>{standalone && <span className="evidence-count">{selected.length} example cards</span>}</div><div className="evidence-grid">{shown.map(item=><EvidenceCard key={item.id} item={item} expanded={expanded===item.id} onToggle={()=>setExpanded(x=>x===item.id?null:item.id)}/>)}</div><div className="evidence-disclaimer"><ShieldAlert size={14}/> * Confidence labels are examples only; they have not been independently assessed.</div></div>;
}

function CauseChain({ event }) {
  const nodes = event.type === 'Wildfire' ? ['Heat anomaly','Drier soils','Vegetation stress','Observed change'] : event.type === 'Flood' ? ['Rainfall','Soil saturation','Surface water','Observed change'] : ['Rainfall','Warming','Snow response','Terrain change'];
  return <section className="cause-card panel"><div className="cause-heading"><div><div className="mini-eyebrow">CONNECTING THE CLUES</div><h3>An evidence-aware cause chain</h3><p>Showing relationships without pretending every link is proven.</p></div><span className="unproven-badge"><ShieldAlert size={15}/> No causal claim</span></div><div className="chain-row">{nodes.map((node,i)=><React.Fragment key={node}><div className={`chain-node ${i===0?'first':''}`}><span className="chain-node-num">0{i+1}</span><strong>{node}</strong><small>{i===0?'Signal':i===3?'Change':'Context'}</small></div>{i<3&&<div className="chain-connector"><span>→</span><small>{i===2?'NOT ESTABLISHED':'POSSIBLE LINK'}</small></div>}</React.Fragment>)}</div><div className="cause-footer"><CircleAlert size={16}/> A signal, or even several signals together, does not establish causation. These links need independent analysis and expert review.</div></section>;
}

function HomeView({ event, setEvent, onNavigate, onExport, onShare }) {
  const [index,setIndex] = useState(0);
  const [playing,setPlaying] = useState(false);
  const [layerPreference,setLayerPreference] = useState('auto');
  useEffect(()=>{setIndex(0);setPlaying(false);setLayerPreference('auto')},[event.id]);
  useEffect(()=>{if(!playing) return; const timer=setInterval(()=>setIndex(i=>nextStep(i,event.series.length)),2400);return()=>clearInterval(timer)},[playing,event.id,event.series.length]);
  const step = event.series[safeIndex(index,event.series.length)];
  const layer = getDisplayLayer(step,layerPreference);
  return <main className="main-section overview-view">
    <div className="intro-block"><div className="intro-top"><div className="eyebrow"><span className="eyebrow-dot"/> THE EARTH IS TELLING A STORY</div><span className="edition-label">VANTARA LUMINA <span>•</span> SPACE APPS CONCEPT</span></div><h1>See the change.<br/><span>Trace the signals.</span></h1><div className="intro-bottom"><p>Explore environmental change through the clues left behind in Earth observation data. Understand not just <em>what</em> happened, but what the evidence can — and cannot — tell us.</p><button className="text-link" onClick={()=>onNavigate('method')}>How AVA works <ArrowUpRight size={17}/></button></div></div>
    <DemoNotice/>
    <div className="explore-strip"><div><span className="mini-eyebrow">CURRENT EXPLORATION</span><strong>{event.name} <ChevronDown size={15}/></strong></div><div className="event-picker" role="group" aria-label="Choose scenario">{events.map(x=><button key={x.id} aria-pressed={x.id===event.id} className={x.id===event.id?'selected':''} onClick={()=>setEvent(x.id)}>{x.id===event.id&&<span className="picker-dot"/>}{x.name}</button>)}</div><button className="strip-more" onClick={()=>onNavigate('explore')}>All stories <ArrowUpRight size={15}/></button></div>
    <div className="exploration-grid"><div className="map-column"><TerrainMap event={event} step={step} stepIndex={index} layer={layer} preference={layerPreference} onPreferenceChange={setLayerPreference}/></div><StageCard event={event} step={step} stepIndex={index}/></div>
    <div className="stat-grid"><SignalCard icon={Droplets} label="RAINFALL PATTERN" value={step.rain} unit="index" trend="Illustrative precipitation"/><SignalCard icon={Thermometer} label="TEMPERATURE ANOMALY" value={`+${step.temp.toFixed(1)}`} unit="°C" trend="Illustrative deviation"/><SignalCard icon={event.type==='Glacier change'?Snowflake:Waves} label={event.type==='Glacier change'?'SNOW COVER':'SOIL MOISTURE'} value={event.type==='Glacier change'?step.snow:step.soil} unit="%" trend="Illustrative observation"/><SignalCard icon={CloudSun} label="CLOUD COVER" value={step.clouds?'High':'Low'} unit="" trend={step.clouds&&layer==='radar'?'Radar illustration active':step.clouds?'Optical view obstructed':'Optical illustration visible'} className="cloud-stat"/></div>
    <div className="data-section-title"><div><div className="mini-eyebrow">FROM SIGNAL TO STORY</div><h2>Watch the evidence unfold.</h2></div><div className="share-actions"><button onClick={onShare}><Share2 size={15}/> Copy link</button><button onClick={()=>onExport(event)}><Download size={15}/> Export demo JSON</button></div></div>
    <div className="replay-grid"><ReplayTimeline event={event} index={index} setIndex={setIndex} playing={playing} setPlaying={setPlaying}/><ScoreChart event={event} index={index}/></div>
    <div className="data-section-title evidence-head"><div><div className="mini-eyebrow">TRANSPARENCY FIRST</div><h2>Every insight needs evidence.</h2><p>Explore the dataset, date and uncertainty behind each example finding.</p></div><button className="view-all" onClick={()=>onNavigate('evidence')}>View all evidence <ArrowUpRight size={17}/></button></div>
    <EvidenceGrid event={event} initialLimit={3}/><CauseChain event={event}/>
    <div className="bottom-cta"><div><span>THIS IS ONLY THE BEGINNING</span><h2>The planet has many stories.<br/><em>Let's learn to read them.</em></h2></div><button onClick={()=>onNavigate('explore')}>Explore scenarios <ArrowRight size={18}/></button></div>
  </main>;
}

function ExploreView({ event, onSelect }) {
  const [query,setQuery] = useState('');
  const filtered = events.filter(e => `${e.name} ${e.region} ${e.type}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="main-section inside-view"><SectionHeading eyebrow="EXPLORE OUR PLANET" title="Every landscape has a story." description="Choose one of the included demonstration scenarios. Geographic search beyond these examples requires a verified data service."/><DemoNotice small/><div className="list-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter by place or event type..." aria-label="Filter scenarios"/></div><div className="scenario-grid">{filtered.map((e,i)=>{const Icon=iconForEvent(e.type);return <button key={e.id} className={`scenario-card scenario-${e.id}`} onClick={()=>onSelect(e.id)}><div className="scenario-art"><div className="scenario-orb"><Icon size={44}/></div><span>0{i+1} / 03</span><span className="scenario-art-label">{e.imageTag}</span></div><div className="scenario-card-body"><div><span className="mini-eyebrow">{e.type.toUpperCase()}</span><h3>{e.name}</h3><p><MapPin size={13}/> {e.region}</p></div><span className="scenario-arrow"><ArrowUpRight size={19}/></span></div><p className="scenario-desc">{e.description}</p><div className="scenario-meta"><span><Clock3 size={14}/> 7 frames</span><span>{e.label}</span></div></button>})}</div>{!filtered.length&&<div className="empty-list"><SearchX size={27}/><h3>No stories found</h3><p>Try “Langtang”, “Flood” or “Wildfire”. Other destinations are not loaded in this offline demo.</p></div>}<div className="integrity-band"><ShieldCheck size={23}/><div><strong>Designed for exploration, not prediction</strong><p>All three examples currently use simulated values. This app does not ingest live satellite images or issue disaster warnings.</p></div></div></main>;
}

function EvidenceView({ event, onChangeEvent }) { return <main className="main-section inside-view"><SectionHeading eyebrow="THE EVIDENCE LIBRARY" title="Don't just trust the story. Trace it." description="Each example finding includes a dataset family, reference date, confidence label and the limitations of its interpretation."/><DemoNotice small/><div className="select-context"><div><div className="mini-eyebrow">DATASET CONTEXT</div><strong>{event.name}</strong></div><div className="simple-select-wrap"><select value={event.id} onChange={e=>onChangeEvent(e.target.value)} aria-label="Select the event whose evidence to view">{events.map(e=><option value={e.id} key={e.id}>{e.name}</option>)}</select><ChevronDown size={17}/></div></div><EvidenceGrid event={event} standalone/><div className="integrity-band"><Info size={22}/><div><strong>How to interpret confidence labels</strong><p>High, Medium and Low are placeholders used to demonstrate transparent communication. They are not derived from actual data-quality assessments. A production version would document quality flags, resolution, coverage and validation.</p></div></div></main>; }

const pipeline = [
  { num:'01', title:'Collect observations', text:'NASA Landsat imagery, precipitation, snow cover, soil moisture and terrain, with radar where coverage allows.', icon:Database, status:'Designed workflow' },
  { num:'02', title:'Clean & align', text:'Bring datasets onto a documented common grid, with acquisition time, resolution, cloud masks and quality flags.', icon:Layers3, status:'Requires data processing' },
  { num:'03', title:'Compare with history', text:'Measure how unusual current conditions are relative to more than 20 years of suitable historical observations.', icon:Activity, status:'Backtesting planned' },
  { num:'04', title:'Connect, but don’t overclaim', text:'Create an interpretable precursor-signal score and a cause chain. Mark unsupported connections “not established”.', icon:Workflow, status:'Scientific validation needed' },
  { num:'05', title:'Tell an honest story', text:'Precompute results so anyone can replay the event, inspect evidence cards and see uncertainty in a fast browser experience.', icon:BookOpen, status:'Interface demo available' }
];
function MethodView() { return <main className="main-section inside-view"><SectionHeading eyebrow="OUR APPROACH" title="Clarity without shortcuts." description="AVA's proposed workflow turns scattered Earth observations into a transparent, understandable environmental story."/><div className="method-hero"><div><span className="mini-eyebrow">THE BIG IDEA</span><h2>From billions of observations to one story people can understand.</h2><p>NASA already has the eyes. The data holds the clues. AVA is a concept for connecting them — with the evidence and uncertainty kept in view.</p></div><div className="method-graphic"><div className="method-orbit orbit-1"/><div className="method-orbit orbit-2"/><div className="method-orbit orbit-3"/><div className="method-middle"><Globe2 size={43}/><span>AVA</span></div><i className="orbit-point point-1"/><i className="orbit-point point-2"/><i className="orbit-point point-3"/></div></div><SectionHeading eyebrow="FROM DATA TO DISCOVERY" title="A five-step evidence pipeline" description="The PDF describes the intended analysis. This demo implements the presentation layer, not the full NASA processing pipeline."/><div className="pipeline-list">{pipeline.map(({num,title,text,icon:Icon,status})=><div className="pipeline-row" key={num}><span className="pipeline-num">{num}</span><span className="pipeline-icon"><Icon size={21}/></span><div><h3>{title}</h3><p>{text}</p></div><span className="pipeline-status">{status}</span></div>)}</div><div className="method-principles"><div><ShieldCheck size={23}/><h3>Show the evidence</h3><p>Source names, date, supporting observations and quality notes should accompany each finding.</p></div><div><CircleAlert size={23}/><h3>Show the uncertainty</h3><p>Correlation is not causation. A precursor score does not make an event predictable.</p></div><div><Eye size={23}/><h3>Make it accessible</h3><p>Guided replay, plain-language captions and precomputed results keep the story understandable.</p></div></div><div className="method-caveat"><ShieldAlert size={21}/><p><strong>Research integrity note:</strong> The example values shown in the app are made up solely for interaction testing. Full data retrieval, grid alignment, anomaly calculation, historical backtesting, real radar acquisition matching and independent scientific verification remain future engineering tasks.</p></div></main>; }

function TeamView() {return <main className="main-section inside-view"><SectionHeading eyebrow="THE PEOPLE BEHIND AVA" title="Six minds. One shared question." description="How do we turn billions of observations into something people can actually understand?"/><div className="team-hero"><div className="team-hero-mark">VL<span>.</span></div><div><div className="mini-eyebrow">TEAM VANTARA LUMINA</div><h2>The story belongs right next to the science.</h2><p>We bring research, NASA data, artificial intelligence, frontend development, UI/UX and storytelling together to explore how environmental change can be understood by everyone.</p></div></div><div className="team-grid">{team.map((member,i)=><div className="team-card" key={member.name}><div className="person-avatar">{member.name.split(' ').filter(Boolean).slice(0,2).map(s=>s[0]).join('')}</div><span className="team-number">0{i+1}</span><h3>{member.name}</h3><p>{member.role}</p></div>)}</div><div className="team-quote"><span>“</span><p>Our goal isn't to tell people what to believe. It's to give them the evidence, show them the uncertainty, and let them discover the story for themselves.</p><strong>— Team Vantara Lumina, AVA concept script</strong></div></main>}

function HelpModal({ onClose }) { return <div className="modal-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget) onClose()}}><section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title"><button className="modal-x" aria-label="Close help" onClick={onClose}><X size={19}/></button><span className="mini-eyebrow">A QUICK START</span><h2 id="help-title">Welcome to AVA.</h2><p>Explore how a future evidence-first Earth-observation application could explain environmental change.</p><div className="help-steps"><div><span>01</span><p><strong>Choose a story.</strong> Pick one of three built-in example scenarios.</p></div><div><span>02</span><p><strong>Replay the change.</strong> Press play or click a date to move through the timeline.</p></div><div><span>03</span><p><strong>Switch sensing views.</strong> Auto mode illustrates a radar fallback when optical scenes are cloudy.</p></div><div><span>04</span><p><strong>Check the evidence.</strong> Expand each card to inspect limitations and uncertainty.</p></div></div><DemoNotice small/><button className="primary-button modal-action" onClick={onClose}>Start exploring <ArrowRight size={17}/></button></section></div> }

export default function App() {
  const initialId = typeof window === 'undefined' ? 'langtang' : new URLSearchParams(window.location.search).get('event');
  const [eventId,setEventId] = useState(events.some(e=>e.id===initialId)?initialId:'langtang');
  const [page,setPage] = useState('overview');
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [helpOpen,setHelpOpen] = useState(false);
  const [toast,setToast] = useState('');
  const event = useMemo(()=>events.find(e=>e.id===eventId)||events[0],[eventId]);
  useEffect(()=>{const url = new URL(window.location.href);url.searchParams.set('event',eventId);window.history.replaceState(null,'',url.toString())},[eventId]);
  useEffect(()=>{const handleKey=e=>{if(e.key==='Escape'){setHelpOpen(false);setSidebarOpen(false)}if(e.key==='/'&&!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)){e.preventDefault();document.querySelector('.search-container input')?.focus()}};window.addEventListener('keydown',handleKey);return()=>window.removeEventListener('keydown',handleKey)},[]);
  useEffect(()=>{if(!toast) return;const id=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(id)},[toast]);
  const navigate = id => {setPage(id);setSidebarOpen(false);window.scrollTo({top:0,behavior:'smooth'})};
  const selectEvent = id => {setEventId(id);navigate('overview')};
  const exportReport = selectedEvent => {const blob=new Blob([JSON.stringify(buildReport(selectedEvent),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`ava-${selectedEvent.id}-demo.json`;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setToast('Demo data exported as JSON')};
  const shareCurrent = async () => {try{await navigator.clipboard.writeText(window.location.href);setToast('Link copied to clipboard')}catch{setToast('Copy the page address to share this view')}};
  return <div className="app-shell"><a href="#main" className="skip-link">Skip to main content</a><Sidebar current={page} onNavigate={navigate} opened={sidebarOpen} onClose={()=>setSidebarOpen(false)}/><div className="app-content"><Topbar onMenu={()=>setSidebarOpen(true)} event={event} onSearchSelect={selectEvent} onHelp={()=>setHelpOpen(true)} onNavigate={navigate}/><div id="main">{page==='overview'&&<HomeView event={event} setEvent={setEventId} onNavigate={navigate} onExport={exportReport} onShare={shareCurrent}/ >}{page==='explore'&&<ExploreView event={event} onSelect={selectEvent}/ >}{page==='evidence'&&<EvidenceView event={event} onChangeEvent={setEventId}/ >}{page==='method'&&<MethodView/>}{page==='team'&&<TeamView/>}</div><footer className="app-footer"><span>© 2026 AVA / Team Vantara Lumina</span><span>See the Change. Trace the Signals. Understand the Story.</span><button onClick={()=>navigate('method')}>Responsible use <ArrowUpRight size={13}/></button></footer></div>{helpOpen&&<HelpModal onClose={()=>setHelpOpen(false)}/ >}{toast&&<div className="toast" role="status"><CheckCircle2 size={16}/>{toast}</div>}</div>;
}
