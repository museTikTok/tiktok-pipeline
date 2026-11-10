import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {KaraokeLine, SfxCue, Word} from './CaptionVideo';

export type DoggerlandVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

// Visuals: 2 AI-generated + 1 real museum photo (Univ. Liège, prehistory collection)
const FOREST = 'batch5/doggerland-forest.jpg';
const HUNTERS = 'batch5/doggerland-hunters.jpg';
const TOOLS = 'batch5/doggerland-tools.jpg';

const DEEP = '#06283f';
const SEA = '#0a3a5c';
const SAND = '#d9c08a';
const SANDDARK = '#8a6f3f';
const FOAM = '#eaf4fa';
const LAND = '#6f7d5a';
const RED = '#c0392b';
const NIGHT = '#04121f';

// Animated film grain — cinema look + prevents compression identical frames
// NOTE: seed changes EVERY frame (not every 2) to guarantee zero duplicated frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="doggerland-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#doggerland-grain)" />
			</svg>
		</div>
	);
};

// Continuous motion wrapper — no static scene (Axel retention rule)
const LivingBg: React.FC<{durationInFrames: number; children: React.ReactNode; maxZoom?: number}> = ({
	durationInFrames, children, maxZoom = 1.14,
}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.0, maxZoom]);
	const drift = Math.sin((frame / 30) * Math.PI * 2 * 0.08) * 14;
	return (
		<div style={{position: 'absolute', inset: -60, transform: `scale(${scale}) translateY(${drift}px)`}}>
			{children}
		</div>
	);
};

// --- Stylised North Sea map (SVG, drawn in-code — no image cost) ---
// viewBox 0 0 900 1250. Land: Britain left, Norway top-right, Denmark,
// mainland bottom-right. Doggerland: sand blob in the middle of the sea.
const DOGGERLAND_PTS = '330,470 470,430 580,470 600,560 540,650 420,680 340,620 310,540';
const BRITAIN_PTS = '150,180 230,140 280,220 260,340 230,470 190,560 150,480 120,330';
const NORWAY_PTS = '560,60 860,90 880,240 760,300 640,240 580,140';
const DENMARK_PTS = '620,420 690,400 700,470 650,500 610,470';
const MAINLAND_PTS = '540,680 620,620 760,600 880,560 880,1250 540,1250';
const FRANCE_PTS = '60,1250 60,980 180,940 260,1020 240,1250';

const NorthSeaMap: React.FC<{
	reveal?: number; // 0..1 — Doggerland emerging (hook)
	flood?: number; // 0..1 — water rising over Doggerland (sea-rise scene)
	storegga?: number; // 0..1 — red slide arrow progress
	bank?: boolean; // highlight Dogger Bank
	showLabels?: boolean;
}> = ({reveal = 1, flood = 0, storegga = 0, bank = false, showLabels = true}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.25 * Math.sin((frame / 30) * Math.PI * 2 * 1.6);
	const waterCover = 1 - reveal; // blue overlay hiding Doggerland while it emerges
	// Fragmenting islands shrink as the flood rises
	const islandScale = (offset: number) =>
		Math.max(0, 1 - Math.max(0, flood - offset) * 2.2);
	return (
		<svg viewBox="0 0 900 1250" style={{width: '100%', height: '100%', display: 'block'}}>
			{/* sea */}
			<rect x="0" y="0" width="900" height="1250" fill={SEA} />
			{/* subtle wave lines */}
			{[300, 700, 1000].map((y) => (
				<path key={y} d={`M0,${y} Q112,${y - 18} 225,${y} T450,${y} T675,${y} T900,${y}`}
					fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="4" />
			))}
			{/* modern land */}
			<polygon points={BRITAIN_PTS} fill={LAND} stroke="#3d4a33" strokeWidth="3" />
			<polygon points={NORWAY_PTS} fill={LAND} stroke="#3d4a33" strokeWidth="3" />
			<polygon points={DENMARK_PTS} fill={LAND} stroke="#3d4a33" strokeWidth="3" />
			<polygon points={MAINLAND_PTS} fill={LAND} stroke="#3d4a33" strokeWidth="3" />
			<polygon points={FRANCE_PTS} fill={LAND} stroke="#3d4a33" strokeWidth="3" />
			{/* Doggerland */}
			<g opacity={reveal} transform={`translate(455,555) scale(${0.7 + 0.3 * reveal}) translate(-455,-555)`}>
				<polygon points={DOGGERLAND_PTS} fill={SAND} stroke={SANDDARK} strokeWidth="4" />
			</g>
			{/* flood: water swallowing Doggerland from below */}
			{flood > 0 && (
				<g>
					<rect x="280" y={430 + (1 - flood) * 260} width="360" height={flood * 260 + 10}
						fill={SEA} opacity="0.92" />
					{/* surviving island fragments */}
					<ellipse cx="360" cy="510" rx={46 * islandScale(0)} ry={26 * islandScale(0)} fill={SAND} />
					<ellipse cx="480" cy="570" rx={56 * islandScale(0.25)} ry={30 * islandScale(0.25)} fill={SAND} />
					<ellipse cx="560" cy="490" rx={40 * islandScale(0.5)} ry={22 * islandScale(0.5)} fill={SAND} />
				</g>
			)}
			{/* water still covering Doggerland during the hook reveal */}
			{waterCover > 0.02 && (
				<rect x="290" y="420" width="340" height="270" fill={SEA} opacity={waterCover * 0.95} rx="20" />
			)}
			{/* Storegga slide: red pulse off Norway's south coast + arrow down to Doggerland */}
			{storegga > 0 && (
				<g>
					<circle cx="610" cy="320" r={26 * pulse} fill="none" stroke={RED} strokeWidth="6" />
					<circle cx="610" cy="320" r="10" fill={RED} />
					<line x1="610" y1="320" x2="610" y2="530" stroke={RED} strokeWidth="10" strokeLinecap="round"
						strokeDasharray="210" strokeDashoffset={210 * (1 - storegga)}
						transform="rotate(31 610 320)" />
					<polygon points="482,488 522,488 502,525" fill={RED} opacity={storegga} />
				</g>
			)}
			{/* Dogger Bank highlight */}
			{bank && (
				<g>
					<ellipse cx="455" cy="555" rx={150 * pulse} ry={72 * pulse} fill="none"
						stroke={FOAM} strokeWidth="7" strokeDasharray="20 14" />
					<ellipse cx="455" cy="555" rx="130" ry="58" fill={RED} opacity="0.3" />
					<text x="455" y="705" fontFamily={TITAN} fontSize="34" letterSpacing="3"
						fill={FOAM} textAnchor="middle">DOGGER BANK</text>
				</g>
			)}
			{/* labels */}
			{showLabels && (
				<g fontFamily={TITAN} fill={FOAM} textAnchor="middle">
					<text x="195" y="360" fontSize="34" letterSpacing="3">ENGLAND</text>
					<text x="710" y="185" fontSize="32" letterSpacing="3">NORWEGEN</text>
					<text x="655" y="455" fontSize="26" letterSpacing="2">DÄNEMARK</text>
					<text x="455" y="720" fontSize="36" letterSpacing="3" fill={SAND}>DOGGERLAND</text>
					<text x="455" y="900" fontSize="40" letterSpacing="8" opacity="0.75">NORDSEE</text>
					<text x="710" y="950" fontSize="30" letterSpacing="3">EUROPA</text>
				</g>
			)}
		</svg>
	);
};

// --- Scene 1: Hook (0–3.7s) — map, water recedes, Doggerland appears ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const reveal = interpolate(frame, [6, durationInFrames - 6], [0, 1], {extrapolateRight: 'clamp'});
	const titleIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [34, 52], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: titleIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 76, color: '#fff', letterSpacing: 2, lineHeight: 1.15,
					textShadow: '0 0 40px rgba(217,192,138,0.5), 0 8px 28px rgba(0,0,0,0.9)'}}>
					VON ENGLAND NACH<br />EUROPA — ZU FUSS?!
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 1250}}>
				<NorthSeaMap reveal={reveal} />
			</div>
			<div style={{position: 'absolute', bottom: 340, left: 0, right: 0, textAlign: 'center', opacity: subIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 40, color: SAND,
					backgroundColor: 'rgba(4,18,31,0.85)', border: `3px solid ${SAND}`,
					padding: '14px 40px', borderRadius: 10, letterSpacing: 2}}>
					BIS DAS MEER ALLES VERSCHLUCKT HAT
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 2: Mesolithic forest (3.7–8.5s) ---
const SceneForest: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [24, 44], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.16}>
				<Img src={staticFile(FOREST)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(4,18,31,0.5), transparent 40%, transparent 60%, rgba(4,18,31,0.7))'}} />
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 84, color: '#fff', letterSpacing: 3,
					textShadow: '0 0 44px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					VOR 10.000 JAHREN
				</div>
				<div style={{fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', color: FOAM, marginTop: 18,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					hier, wo heute die Nordsee ist…
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 3: Hunters (8.5–11.0s) ---
const SceneHunters: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [18, 38], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(HUNTERS)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(4,18,31,0.45), transparent 45%, rgba(4,18,31,0.75))'}} />
			<div style={{position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 68, color: SAND, letterSpacing: 3, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					WÄLDER • FLÜSSE • JÄGER
				</div>
				<div style={{fontFamily: TITAN, fontSize: 46, color: '#fff', marginTop: 14, letterSpacing: 2,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)'}}>
					SO GROSS WIE ENGLAND
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 4: Sea-level rise (11.0–14.7s) — Doggerland fragments into islands ---
const SceneSeaRise: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const flood = interpolate(frame, [8, durationInFrames - 4], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 62, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 36px rgba(10,58,92,0.8), 0 8px 24px rgba(0,0,0,0.9)'}}>
					DAS MEER STIEG…
				</div>
				<div style={{fontFamily: TITAN, fontSize: 44, color: SAND, marginTop: 10, letterSpacing: 2}}>
					METER FÜR METER
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 1250}}>
				<NorthSeaMap flood={flood} showLabels={false} />
			</div>
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: labelIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: FOAM,
					backgroundColor: 'rgba(4,18,31,0.85)', border: `3px solid ${SAND}`,
					padding: '14px 40px', borderRadius: 10, letterSpacing: 2}}>
					DAS LAND ZERFIEL IN INSELN
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 5: Seismic map (14.7–17.2s) ---
const SceneSeismic: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const scanY = interpolate(frame, [0, durationInFrames], [-40, 1250]);
	const labelIn = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp'});
	const palette = ['#0a3a5c', '#0d4a6e', '#125a80', '#1a6b8f', '#0e5566', '#2e7d6b', '#4a9e7f'];
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			{/* seismic survey grid */}
			<div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 1250}}>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(13, 1fr)',
					width: '100%', height: '100%'}}>
					{[...Array(117)].map((_, i) => {
						const shade = palette[(i * 37 + Math.floor(i / 9) * 11) % palette.length];
						return <div key={i} style={{backgroundColor: shade, opacity: 0.75 + ((i * 13) % 4) * 0.06,
							border: '1px solid rgba(4,18,31,0.6)'}} />;
					})}
				</div>
				{/* Doggerland outline on the seismic data */}
				<svg viewBox="0 0 900 1250" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
					<polygon points={DOGGERLAND_PTS} fill="rgba(217,192,138,0.25)" stroke={SAND} strokeWidth="7" />
					<text x="455" y="565" fontFamily={TITAN} fontSize="36" letterSpacing="3"
						fill={SAND} textAnchor="middle">DOGGERLAND</text>
				</svg>
				{/* scanline */}
				<div style={{position: 'absolute', left: 0, right: 0, top: scanY, height: 10,
					backgroundColor: SAND, boxShadow: '0 0 30px rgba(217,192,138,0.9)', opacity: 0.9}} />
			</div>
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 58, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 36px rgba(10,58,92,0.8), 0 8px 24px rgba(0,0,0,0.9)'}}>
					SEISMISCHE KARTE
				</div>
				<div style={{fontFamily: SERIF, fontSize: 40, fontStyle: 'italic', color: FOAM, marginTop: 12}}>
					188.000 km² Meeresboden kartiert
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 6: Storegga slide (17.2–20.9s) ---
const SceneStoregga: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const prog = interpolate(frame, [10, durationInFrames - 10], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [24, 44], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 64, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 36px rgba(192,57,43,0.6), 0 8px 24px rgba(0,0,0,0.9)'}}>
					STOREGGA — 6200 v. Chr.
				</div>
				<div style={{fontFamily: TITAN, fontSize: 40, color: '#ff8a7a', marginTop: 10, letterSpacing: 2}}>
					3.500 km³ MEERESBODEN RUTSCHEN AB
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 1250}}>
				<NorthSeaMap storegga={prog} showLabels={false} />
			</div>
			<div style={{position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center', opacity: labelIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 42, color: '#fff',
					backgroundColor: 'rgba(192,57,43,0.9)', padding: '14px 40px', borderRadius: 10, letterSpacing: 2}}>
					VOR NORWEGEN — SO GROSS WIE SCHOTTLAND
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 7: Tsunami wave (20.9–23.0s) ---
const SceneTsunami: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const sweepX = interpolate(frame, [0, durationInFrames], [-260, 1340]);
	const chip1 = interpolate(frame, [14, 30], [0, 1], {extrapolateRight: 'clamp'});
	const chip2 = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});
	const waveShift = (frame * 9) % 270;
	const waveShift2 = (frame * 14) % 270;
	return (
		<AbsoluteFill style={{backgroundColor: '#03101d', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, #03101d 0%, #06283f 45%, #0a3a5c 100%)'}} />
			{/* layered animated waves — raised, taller crests */}
			<svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
				<g transform={`translate(${-waveShift},0)`} opacity="0.55">
					<path d="M0,850 Q135,770 270,850 T540,850 T810,850 T1080,850 T1350,850 L1350,1920 L0,1920 Z"
						fill="#0d4a6e" />
					<path d="M0,850 Q135,770 270,850 T540,850 T810,850 T1080,850 T1350,850"
						fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="6" />
				</g>
				<g transform={`translate(${-waveShift2},0)`} opacity="0.85">
					<path d="M0,1080 Q135,1010 270,1080 T540,1080 T810,1080 T1080,1080 T1350,1080 L1350,1920 L0,1920 Z"
						fill="#125a80" />
					<path d="M0,1080 Q135,1010 270,1080 T540,1080 T810,1080 T1080,1080 T1350,1080"
						fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="8" />
				</g>
				{/* sweeping foam front */}
				<rect x={sweepX} y="0" width="70" height="1920" fill={FOAM} opacity="0.15" />
				<rect x={sweepX + 70} y="0" width="18" height="1920" fill="#ffffff" opacity="0.35" />
			</svg>
			<div style={{position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITAN, fontSize: 150, color: '#fff', letterSpacing: 8,
					textShadow: '0 0 70px rgba(234,244,250,0.7), 0 10px 34px rgba(0,0,0,0.9)'}}>
					TSUNAMI
				</div>
			</div>
			<div style={{position: 'absolute', top: 480, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 48, color: NIGHT,
					backgroundColor: FOAM, padding: '16px 44px', borderRadius: 10, letterSpacing: 2,
					opacity: chip1, marginRight: 20}}>
					≈10 m — NORWEGEN
				</div>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 48, color: '#fff',
					backgroundColor: RED, padding: '16px 44px', borderRadius: 10, letterSpacing: 2,
					opacity: chip2}}>
					3–6 m — DOGGERLAND
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 8: Tools & bones from the deep (23.0–29.2s) ---
const SceneTools: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const gaugeFill = interpolate(frame, [10, durationInFrames - 10], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [26, 46], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.12}>
				<Img src={staticFile(TOOLS)} style={{width: '100%', height: '100%', objectFit: 'cover',
					filter: 'brightness(0.85) contrast(1.05)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(4,18,31,0.35)'}} />
			{/* depth gauge */}
			<div style={{position: 'absolute', left: 90, top: 420, zIndex: 5}}>
				<div style={{width: 80, height: 760, borderRadius: 40, border: `7px solid ${FOAM}`,
					backgroundColor: 'rgba(6,40,63,0.75)', position: 'relative', overflow: 'hidden'}}>
					<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: `${gaugeFill * 100}%`,
						background: 'linear-gradient(to top, #125a80, #0a3a5c)'}} />
					<div style={{position: 'absolute', bottom: '50%', left: 0, right: 0, height: '50%',
						backgroundColor: 'rgba(217,192,138,0.35)', borderTop: `4px dashed ${SAND}`}} />
				</div>
				<div style={{textAlign: 'center', marginTop: 20, fontFamily: TITAN, fontSize: 64, color: SAND,
					textShadow: '0 0 30px rgba(0,0,0,0.9)'}}>
					15–30 m
				</div>
			</div>
			<div style={{position: 'absolute', right: 70, top: 500, width: 560, opacity: labelIn, zIndex: 5}}>
				<div style={{backgroundColor: 'rgba(4,18,31,0.9)', border: `4px solid ${SAND}`, borderRadius: 16,
					padding: '44px 34px', textAlign: 'center'}}>
					<div style={{fontSize: 90}}>⚒️</div>
					<div style={{fontFamily: TITAN, fontSize: 46, color: SAND, marginTop: 16, lineHeight: 1.3,
						letterSpacing: 1}}>
						FISCHER HOLEN<br />IMMER NOCH<br />KNOCHEN &amp;<br />WERKZEUGE<br />AUS DER TIEFE
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 9: Final map + question (29.2–37.4s) ---
const SceneFinal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const qIn = interpolate(frame, [10, 30], [0, 1], {extrapolateRight: 'clamp'});
	const ctaIn = interpolate(frame, [70, 95], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', opacity: qIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 60, color: '#fff', letterSpacing: 2, lineHeight: 1.2,
					textShadow: '0 0 40px rgba(217,192,138,0.5), 0 8px 28px rgba(0,0,0,0.9)'}}>
					WELCHE VERSUNKENE WELT<br />ENTDECKEN WIR ALS NÄCHSTES?
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, top: 400, width: 900, height: 1250}}>
				<NorthSeaMap bank showLabels={false} />
			</div>
			<div style={{position: 'absolute', top: 315, left: 0, right: 0, textAlign: 'center', opacity: ctaIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 42, color: NIGHT,
					backgroundColor: SAND, padding: '16px 44px', borderRadius: 10, letterSpacing: 2}}>
					✍ SCHREIB ES IN DIE KOMMENTARE!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 10: End card CTA (37.4s–end) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [8, 28], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2 * 1.4);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(10,58,92,0.55) 0%, rgba(4,18,31,0.95) 80%)'}} />
			<div style={{position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center',
				opacity: textIn, transform: `scale(${pulse})`}}>
				<div style={{fontFamily: TITAN, fontSize: 66, color: '#fff', letterSpacing: 2,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: SAND}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 38, fontStyle: 'italic', color: FOAM, marginTop: 16}}>
					für mehr verbotene Wahrheiten
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration (VO 37.4s)
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.7, render: SceneHook},
	{from: 3.7, to: 8.5, render: SceneForest},
	{from: 8.5, to: 11.0, render: SceneHunters},
	{from: 11.0, to: 14.7, render: SceneSeaRise},
	{from: 14.7, to: 17.2, render: SceneSeismic},
	{from: 17.2, to: 20.9, render: SceneStoregga},
	{from: 20.9, to: 23.0, render: SceneTsunami},
	{from: 23.0, to: 29.2, render: SceneTools},
	{from: 29.2, to: 37.4, render: SceneFinal},
	{from: 37.4, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const DoggerlandVideo: React.FC<DoggerlandVideoProps> = ({
	words,
	voiceover,
	music,
	musicVolume = 0.08,
	sfx = [],
	wordsPerLine = 4,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const time = frame / fps;

	const lines = useMemo(() => groupWords(words, wordsPerLine), [words, wordsPerLine]);
	const {activeLineIndex, lineAgeFrames} = useMemo(() => {
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length === 0) continue;
			const start = line[0].start;
			const end = line[line.length - 1].end;
			if (time >= start - 0.35 && time < end + 0.6) {
				return {
					activeLineIndex: i,
					lineAgeFrames: Math.max(0, Math.round((time - (start - 0.35)) * fps)),
				};
			}
		}
		return {activeLineIndex: -1, lineAgeFrames: 0};
	}, [lines, time, fps]);

	return (
		<AbsoluteFill style={{backgroundColor: DEEP}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`doggerland-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(4,18,31,0.6) 100%)'}} />

			{/* film grain */}
			<FilmGrain />

			{/* Karaoke captions, lower third */}
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320}}>
				{activeLineIndex >= 0 && (
					<KaraokeLine
						key={activeLineIndex}
						line={lines[activeLineIndex]}
						time={time}
						lineAge={lineAgeFrames}
					/>
				)}
			</AbsoluteFill>

			{/* Audio */}
			<Audio src={staticFile(voiceover)} />
			{music && <Audio src={staticFile(music)} volume={musicVolume} />}
			{sfx.map((cue, i) => (
				<Sequence key={`sfx-${i}`} from={Math.round(cue.start * fps)}
					durationInFrames={durationInFrames} name={`sfx-${i}`}>
					<Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.4} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
