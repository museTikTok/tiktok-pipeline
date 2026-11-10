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

export type TanzplageVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

// Real archive images (Wikimedia Commons, public domain / CC) — ZERO AI images
const HONDIUS = 'batch5/tanzplage-hondius.jpg'; // Hondius 1642 after Brueghel 1564 — the iconic dancing-plague engraving (Rijksmuseum RP-P-1904-526)
const BRUEGHEL = 'batch5/tanzplage-brueghel.jpg'; // Brueghel the Elder, The Dancing Mania, Molenbeek 1564
const STRASSBURG = 'batch5/tanzplage-strassburg1493.png'; // Schedel, Nuremberg Chronicle — Strasbourg (Argentina), 1493
const MUSIKER = 'batch5/tanzplage-musiker.jpg'; // Two bagpipers, Hondius/Breughel Molenbeek series (RP-P-OB-75.242)
const ROGGEN = 'batch5/tanzplage-roggen.jpg'; // Rye field (ergot theory) — geograph.org.uk, CC BY
const BRANT = 'batch5/tanzplage-brant.jpg'; // Dance ban of Strasbourg, 2 Aug 1518, signed Sebastian Brant

const OCRE = '#d9c08a';
const OCRELIGHT = '#efe3c2';
const INK = '#1a1a1a';
const INKDARK = '#241a12';
const BLOOD = '#8b1e1e';
const BLOODBRIGHT = '#b3271e';
const PARCH = '#efe3c2';

// Animated film grain — cinema look + prevents compression identical frames
// NOTE: seed changes EVERY frame (not every 2) to guarantee zero duplicated frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="tanzplage-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#tanzplage-grain)" />
			</svg>
		</div>
	);
};

// Continuous motion wrapper — no static scene (Axel retention rule)
// NOTE: useCurrentFrame() is RELATIVE to the parent <Sequence> — no offset subtraction
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

// --- SVG Strasbourg cathedral silhouette (scene 8) ---
// Simplified spire + towers + rose window, ochre on ink
const CathedralSilhouette: React.FC = () => {
	const frame = useCurrentFrame();
	const rise = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
	const glow = 0.5 + 0.3 * Math.sin((frame / 30) * Math.PI * 2 * 0.8);
	return (
		<svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
			{/* moon */}
			<circle cx="830" cy="300" r="90" fill={OCRE} opacity={0.25 + 0.1 * glow} />
			<circle cx="830" cy="300" r="60" fill={OCRE} opacity="0.35" />
			{/* ground */}
			<rect x="0" y="1560" width="1080" height="360" fill="#0d0d0d" />
			{/* cathedral */}
			<g transform={`translate(0,${(1 - rise) * 120})`} opacity={rise}>
				{/* main spire */}
				<polygon points="540,180 470,700 610,700" fill={OCRE} />
				<polygon points="540,180 540,700 610,700" fill={OCRELIGHT} opacity="0.55" />
				{/* spire tip cross */}
				<rect x="534" y="120" width="12" height="70" fill={OCRE} />
				<rect x="512" y="140" width="56" height="12" fill={OCRE} />
				{/* left tower */}
				<rect x="330" y="700" width="140" height="860" fill={OCRE} />
				<polygon points="330,700 400,560 470,700" fill={OCRE} />
				{/* right tower */}
				<rect x="610" y="700" width="140" height="860" fill={OCRE} />
				<polygon points="610,700 680,560 750,700" fill={OCRE} />
				{/* nave */}
				<rect x="300" y="1150" width="480" height="410" fill={OCRE} />
				{/* rose window */}
				<circle cx="540" cy="950" r="110" fill={INK} />
				<circle cx="540" cy="950" r="82" fill="none" stroke={OCRE} strokeWidth="10" />
				<circle cx="540" cy="950" r="34" fill="none" stroke={OCRE} strokeWidth="8" />
				{[0, 45, 90, 135].map((a) => (
					<line key={a} x1="540" y1="868" x2="540" y2="1032" stroke={OCRE} strokeWidth="8"
						transform={`rotate(${a} 540 950)`} />
				))}
				{/* arched windows */}
				{[380, 540, 700].map((x) => (
					<path key={x} d={`M${x - 32},1560 L${x - 32},1330 Q${x},1270 ${x + 32},1330 L${x + 32},1560 Z`}
						fill={INK} />
				))}
			</g>
			{/* stars */}
			{[[180, 240], [300, 140], [920, 520], [120, 700], [980, 180], [60, 420]].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r="5" fill={OCRE}
					opacity={0.3 + 0.5 * Math.abs(Math.sin((frame + i * 17) / 14))} />
			))}
		</svg>
	);
};

// --- Scene 1: Hook (0–3.16s) — Hondius engraving + title ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const titleIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [40, 58], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(HONDIUS)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 35%', filter: 'brightness(0.78) sepia(0.35)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.78), transparent 35%, transparent 55%, rgba(26,26,26,0.88))'}} />
			<div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', opacity: titleIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 96, color: '#fff', letterSpacing: 2, lineHeight: 1.12,
					textShadow: '0 0 44px rgba(217,192,138,0.55), 0 8px 28px rgba(0,0,0,0.95)'}}>
					EINE STADT<br />TANZTE
				</div>
			</div>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', opacity: subIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(139,30,30,0.94)', padding: '16px 44px', borderRadius: 10, letterSpacing: 2}}>
					UND KONNTE NICHT AUFHÖREN?!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 2: Strasbourg 1518 (3.16–7.94s) — Schedel view ---
const SceneStrassburg: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.16}>
				<Img src={staticFile(STRASSBURG)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '72% 42%', filter: 'brightness(0.92) sepia(0.25)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.62), transparent 40%, transparent 60%, rgba(26,26,26,0.82))'}} />
			<div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 132, color: OCRELIGHT, letterSpacing: 6,
					textShadow: '0 0 50px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					JULI 1518
				</div>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 46, color: '#fff',
					backgroundColor: 'rgba(26,26,26,0.9)', border: `3px solid ${OCRE}`,
					padding: '14px 44px', borderRadius: 10, letterSpacing: 4, marginTop: 18}}>
					STRASSBURG
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 3: The first dancer (7.94–11.44s) — Brueghel drawing ---
const SceneFirstDancer: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [22, 42], [0, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [52, 70], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.2}>
				<Img src={staticFile(BRUEGHEL)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 45%', filter: 'brightness(0.9) sepia(0.3)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.58), transparent 40%, transparent 58%, rgba(26,26,26,0.82))'}} />
			<div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 80, color: '#fff', letterSpacing: 3,
					textShadow: '0 0 44px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					OHNE MUSIK.
				</div>
				<div style={{fontFamily: SERIF, fontSize: 46, fontStyle: 'italic', color: OCRELIGHT, marginTop: 16,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)', opacity: subIn}}>
					tagelang — bis sie vor Erschöpfung<br />zusammenbrach
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 4: It spreads — 400 (11.44–16.28s) — Hondius tight crop + counter ---
const SceneSpreads: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [16, 36], [0, 1], {extrapolateRight: 'clamp'});
	// VO: "400" spoken 14.34s -> scene-relative 2.90s = frame 87
	const numIn = interpolate(frame, [80, 92], [0, 1], {extrapolateRight: 'clamp'});
	const numScale = interpolate(frame, [80, 92], [1.6, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [96, 112], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.32}>
				<Img src={staticFile(HONDIUS)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '28% 82%', filter: 'brightness(0.82) sepia(0.3)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.6), transparent 38%, transparent 55%, rgba(26,26,26,0.85))'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 58, color: '#fff', letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					DOCH ES HÖRTE NICHT AUF
				</div>
			</div>
			<div style={{position: 'absolute', top: 460, left: 0, right: 0, textAlign: 'center',
				opacity: numIn, transform: `scale(${numScale})`}}>
				<div style={{fontFamily: TITAN, fontSize: 44, color: OCRELIGHT, letterSpacing: 4,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)'}}>
					ANGEBLICH BIS ZU
				</div>
				<div style={{fontFamily: TITAN, fontSize: 220, color: BLOODBRIGHT, letterSpacing: 2, lineHeight: 1,
					textShadow: '0 0 60px rgba(179,39,30,0.7), 0 6px 0 rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.95)'}}>
					400
				</div>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(26,26,26,0.9)', border: `3px solid ${OCRE}`,
					padding: '14px 40px', borderRadius: 10, letterSpacing: 2, marginTop: 10, opacity: subIn}}>
					MENSCHEN — TAG UND NACHT
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 5: The city sends musicians (16.28–20.08s) — bagpipers + floating notes ---
const SceneMusicians: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [18, 38], [0, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [48, 66], [0, 1], {extrapolateRight: 'clamp'});
	const notes = [
		{x: 180, delay: 0, size: 64}, {x: 420, delay: 12, size: 84},
		{x: 660, delay: 24, size: 64}, {x: 900, delay: 6, size: 92},
	];
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.15}>
				<Img src={staticFile(MUSIKER)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 38%', filter: 'brightness(0.9) sepia(0.28)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.58), transparent 40%, transparent 58%, rgba(26,26,26,0.82))'}} />
			{/* floating music notes */}
			{notes.map((n, i) => {
				const t = ((frame + n.delay * 2) % 90) / 90;
				const y = 1150 - t * 700;
				const sway = Math.sin((frame / 30) * Math.PI * 2 * 0.7 + i) * 22;
				return (
					<div key={i} style={{position: 'absolute', left: n.x + sway, top: y,
						fontFamily: SERIF, fontSize: n.size, color: OCRELIGHT,
						opacity: 0.85 * (1 - t), textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>
						♪
					</div>
				);
			})}
			<div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 62, color: '#fff', letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					DIE STADT SCHICKTE<br />SOGAR MUSIKER
				</div>
				<div style={{fontFamily: SERIF, fontSize: 42, fontStyle: 'italic', color: OCRELIGHT, marginTop: 16,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)', opacity: subIn}}>
					in der Hoffnung, das Tanzen würde sie heilen
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 6: The chronicles (20.08–25.88s) — Brant 1518 document ---
const SceneChronicles: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [14, 34], [0, 1], {extrapolateRight: 'clamp'});
	// VO: "doch die Akten" 22.66s -> rel 2.58s = frame 77; "nennen keine einzige" 24.56s -> rel 4.48s = frame 134
	const chipIn = interpolate(frame, [72, 88], [0, 1], {extrapolateRight: 'clamp'});
	const bigIn = interpolate(frame, [128, 144], [0, 1], {extrapolateRight: 'clamp'});
	const bigScale = interpolate(frame, [128, 144], [1.4, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(BRANT)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 18%', filter: 'brightness(0.88) sepia(0.35)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.62), transparent 38%, transparent 55%, rgba(26,26,26,0.85))'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 54, color: '#fff', letterSpacing: 2, lineHeight: 1.3,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					SPÄTERE CHRONIKEN<br />BERICHTEN VON TOTEN
				</div>
			</div>
			<div style={{position: 'absolute', top: 520, left: 0, right: 0, textAlign: 'center', opacity: chipIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 42, color: '#fff',
					backgroundColor: 'rgba(26,26,26,0.92)', border: `3px solid ${OCRE}`,
					padding: '14px 38px', borderRadius: 10, letterSpacing: 2}}>
					DOCH DIE AKTEN VON 1518 …
				</div>
			</div>
			<div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center',
				opacity: bigIn, transform: `scale(${bigScale})`}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 64, color: '#fff',
					backgroundColor: 'rgba(139,30,30,0.95)', padding: '20px 46px', borderRadius: 10, letterSpacing: 2,
					textShadow: '0 4px 18px rgba(0,0,0,0.6)'}}>
					KEINE EINZIGE ✗
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 7: Three theories (25.88–29.44s) — rye field + chips ---
const SceneTheories: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	// VO: "Pilz" 26.26 -> rel 0.38s = f11; "Massenhysterie" 27.24 -> rel 1.36s = f41; "Fluch" 28.36 -> rel 2.48s = f74
	const c1 = interpolate(frame, [10, 22], [0, 1], {extrapolateRight: 'clamp'});
	const c2 = interpolate(frame, [40, 52], [0, 1], {extrapolateRight: 'clamp'});
	const c3 = interpolate(frame, [72, 84], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INKDARK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.2}>
				<Img src={staticFile(ROGGEN)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 62%', filter: 'brightness(0.82) sepia(0.35)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(26,26,26,0.55), transparent 40%, rgba(26,26,26,0.7))'}} />
			<div style={{position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITAN, fontSize: 58, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					WAR ES …
				</div>
			</div>
			<div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 52, color: INK,
					backgroundColor: OCRE, padding: '18px 46px', borderRadius: 10, letterSpacing: 2, opacity: c1}}>
					🍄 EIN PILZ IM BROT?
				</div>
				<div style={{marginTop: 22, display: 'inline-block', fontFamily: TITAN, fontSize: 52, color: INK,
					backgroundColor: OCRE, padding: '18px 46px', borderRadius: 10, letterSpacing: 2, opacity: c2}}>
					😵 MASSENHYSTERIE?
				</div>
				<div style={{marginTop: 22, display: 'inline-block', fontFamily: TITAN, fontSize: 52, color: INK,
					backgroundColor: OCRE, padding: '18px 46px', borderRadius: 10, letterSpacing: 2, opacity: c3}}>
					⛪ FLUCH DES HEILIGEN VITUS?
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 8: Still unknown (29.44–31.26s) — cathedral silhouette ---
const SceneUnknown: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [8, 26], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<CathedralSilhouette />
			<div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', opacity: textIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 72, color: '#fff', letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					BIS HEUTE<br />WEISS ES NIEMAND.
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 9: Question (31.26–33.26s) — parchment card ---
const SceneQuestion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [6, 22], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.05 * Math.sin((frame / 30) * Math.PI * 2 * 1.6);
	return (
		<AbsoluteFill style={{backgroundColor: OCRE, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 28, border: `4px solid ${INK}`, borderRadius: 4}} />
			<div style={{position: 'absolute', inset: 44, border: `2px solid ${INK}`, borderRadius: 2, opacity: 0.5}} />
			<div style={{position: 'absolute', top: '32%', left: 0, right: 0, textAlign: 'center',
				opacity: textIn, transform: `scale(${pulse})`}}>
				<div style={{fontFamily: TITAN, fontSize: 92, color: INK, letterSpacing: 2, lineHeight: 1.15}}>
					WAS GLAUBST<br />DU?
				</div>
				<div style={{fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', color: BLOOD, marginTop: 28}}>
					Schreib es in die Kommentare!
				</div>
			</div>
			{/* floating question marks */}
			{[[140, 300, 90], [880, 420, 70], [200, 1250, 76], [860, 1300, 96]].map(([x, y, s], i) => (
				<div key={i} style={{position: 'absolute', left: x, top: y + Math.sin((frame + i * 20) / 12) * 16,
					fontFamily: TITAN, fontSize: s, color: INK, opacity: 0.16}}>
					?
				</div>
			))}
		</AbsoluteFill>
	);
};

// --- Scene 10: End card CTA (33.26–37.4s) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [8, 28], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2 * 1.4);
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(139,30,30,0.5) 0%, rgba(26,26,26,0.95) 80%)'}} />
			<div style={{position: 'absolute', top: '34%', left: 0, right: 0, textAlign: 'center',
				opacity: textIn, transform: `scale(${pulse})`}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 46, color: INK,
					backgroundColor: OCRE, padding: '18px 44px', borderRadius: 10, letterSpacing: 2}}>
					✍ SCHREIB ES IN DIE KOMMENTARE!
				</div>
				<div style={{fontFamily: TITAN, fontSize: 66, color: '#fff', letterSpacing: 2, marginTop: 44,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: OCRE}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 38, fontStyle: 'italic', color: PARCH, marginTop: 16}}>
					für mehr verbotene Wahrheiten
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration (VO 35.9s, last word ends 35.9s)
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.16, render: SceneHook},
	{from: 3.16, to: 7.94, render: SceneStrassburg},
	{from: 7.94, to: 11.44, render: SceneFirstDancer},
	{from: 11.44, to: 16.28, render: SceneSpreads},
	{from: 16.28, to: 20.08, render: SceneMusicians},
	{from: 20.08, to: 25.88, render: SceneChronicles},
	{from: 25.88, to: 29.44, render: SceneTheories},
	{from: 29.44, to: 31.26, render: SceneUnknown},
	{from: 31.26, to: 33.26, render: SceneQuestion},
	{from: 33.26, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const TanzplageVideo: React.FC<TanzplageVideoProps> = ({
	words,
	voiceover,
	music,
	musicVolume = 0.07,
	sfx = [],
	wordsPerLine = 3,
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
		<AbsoluteFill style={{backgroundColor: INKDARK}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`tanzplage-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(26,26,26,0.6) 100%)'}} />

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
