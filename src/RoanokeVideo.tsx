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

export type RoanokeVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

// Real archive images (Wikimedia Commons, public domain) + 1 AI image
const MAP = 'batch5/roanoke-map.jpg'; // John White, La Virginea Pars (1590)
const ARRIVAL = 'batch5/roanoke-arrival.jpg'; // de Bry, Englishmen's arrival in Virginia
const VILLAGE = 'batch5/roanoke-village.jpg'; // de Bry, Indian Village of Pomeiooc (1590)
const ARMADA = 'batch5/roanoke-armada.jpg'; // Jan Luyken, Spanish Armada 1588
const BARK = 'batch5/roanoke-bark.jpg'; // red oak bark closeup (for the carved word)
const EMPTY = 'batch5/media-generation-roanoke-empty-settlement-0-801a8090-0506-4ea3-b9c1-f28e36e1e4d1.jpg'; // AI: empty palisade settlement

const PARCHMENT = '#e8d5a3';
const PARCHDARK = '#c9b183';
const INK = '#2b2118';
const ATLANTIC = '#3d5a6c';
const SEA = '#274b5f';
const DEEP = '#1d303c';
const NIGHT = '#0e1e28';
const RED = '#8b2e2e';
const REDBRIGHT = '#c0392b';
const FOAM = '#eaf4fa';

// Animated film grain — cinema look + prevents compression identical frames
// NOTE: seed changes EVERY frame (not every 2) to guarantee zero duplicated frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="roanoke-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#roanoke-grain)" />
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

// --- SVG Atlantic route map: Roanoke -> England (scene 4) ---
// viewBox 1080x1250 (matches its container — no letterbox, no distortion)
// Cubic bezier Roanoke (830,760) -> England (280,360)
const RouteMap: React.FC<{progress: number}> = ({progress}) => {
	const frame = useCurrentFrame();
	const bez = (t: number) => {
		const mt = 1 - t;
		return {
			x: mt * mt * mt * 830 + 3 * mt * mt * t * 560 + 3 * mt * t * t * 420 + t * t * t * 280,
			y: mt * mt * mt * 760 + 3 * mt * mt * t * 520 + 3 * mt * t * t * 420 + t * t * t * 360,
		};
	};
	const ship = bez(Math.min(progress, 1));
	const bob = Math.sin((frame / 30) * Math.PI * 2 * 1.2) * 6;
	return (
		<svg viewBox="0 0 1080 1250" style={{width: '100%', height: '100%', display: 'block'}}>
			<defs>
				<linearGradient id="atlantic-sea" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2e5a74" />
					<stop offset="100%" stopColor="#16303f" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="1080" height="1250" fill="url(#atlantic-sea)" />
			{/* wave lines */}
			{[300, 600, 1000].map((y) => (
				<path key={y} d={`M0,${y} Q135,${y - 18} 270,${y} T540,${y} T810,${y} T1080,${y}`}
					fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="4" />
			))}
			{/* England (top-left) */}
			<polygon points="60,60 260,40 330,160 300,310 210,400 110,360 50,220" fill="#6f7d5a" stroke="#3d4a33" strokeWidth="4" />
			<text x="190" y="220" fontFamily={TITAN} fontSize="40" letterSpacing="3" fill={FOAM} textAnchor="middle">ENGLAND</text>
			<circle cx="280" cy="360" r="12" fill={RED} />
			<circle cx="280" cy="360" r="26" fill="none" stroke={RED} strokeWidth="4" opacity={0.6 + 0.4 * Math.sin(frame / 6)} />
			{/* America coast (right) */}
			<polygon points="880,520 1020,580 1080,720 1080,1250 940,1250 860,1000 830,780 850,620" fill="#6f7d5a" stroke="#3d4a33" strokeWidth="4" />
			<text x="940" y="1000" fontFamily={TITAN} fontSize="40" letterSpacing="3" fill={FOAM} textAnchor="middle" transform="rotate(-90 940 1000)">AMERIKA</text>
			{/* Roanoke Island */}
			<ellipse cx="830" cy="760" rx="42" ry="60" fill={PARCHMENT} stroke={INK} strokeWidth="4" />
			<text x="830" y="900" fontFamily={TITAN} fontSize="36" letterSpacing="2" fill={PARCHMENT} textAnchor="middle">ROANOKE</text>
			<text x="830" y="940" fontFamily={TITAN} fontSize="30" letterSpacing="2" fill={PARCHMENT} textAnchor="middle">ISLAND</text>
			{/* route */}
			<path d="M830,760 C560,520 420,420 280,360" fill="none" stroke={PARCHMENT}
				strokeWidth="7" strokeDasharray="1000" strokeDashoffset={1000 * (1 - progress)}
				pathLength={1000} strokeLinecap="round" />
			{/* ship marker */}
			{progress > 0.02 && (
				<g transform={`translate(${ship.x},${ship.y + bob})`}>
					<polygon points="0,-26 20,14 -20,14" fill={FOAM} stroke={INK} strokeWidth="3" />
					<rect x="-3" y="-52" width="6" height="30" fill={INK} />
					<polygon points="3,-52 26,-34 3,-30" fill={PARCHMENT} />
				</g>
			)}
			<text x="400" y="1150" fontFamily={TITAN} fontSize="44" letterSpacing="8" fill={FOAM} textAnchor="middle" opacity="0.7">ATLANTIK</text>
		</svg>
	);
};

// --- SVG coastal map: Roanoke -> Croatoan / Hatteras (scene 8) ---
// viewBox 1080x1250 (matches its container — no letterbox, no distortion)
const CoastMap: React.FC<{progress: number}> = ({progress}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.2 * Math.sin((frame / 30) * Math.PI * 2 * 1.6);
	return (
		<svg viewBox="0 0 1080 1250" style={{width: '100%', height: '100%', display: 'block'}}>
			{/* parchment map */}
			<rect x="0" y="0" width="1080" height="1250" fill="#d9c08a" />
			<rect x="30" y="30" width="1020" height="1190" fill="none" stroke={INK} strokeWidth="6" />
			<rect x="48" y="48" width="984" height="1154" fill="none" stroke={INK} strokeWidth="2" opacity="0.5" />
			{/* sea (left) */}
			<path d="M48,48 L560,48 C520,260 600,460 540,680 C480,900 580,1080 520,1190 L48,1190 Z"
				fill={SEA} opacity="0.9" />
			{[250, 550, 850, 1080].map((y) => (
				<path key={y} d={`M48,${y} Q150,${y - 16} 260,${y} T470,${y}`}
					fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="3" />
			))}
			<text x="270" y="640" fontFamily={TITAN} fontSize="40" letterSpacing="6" fill={FOAM} textAnchor="middle" transform="rotate(-90 270 640)">ATLANTIK</text>
			{/* coastline */}
			<path d="M560,48 C520,260 600,460 540,680 C480,900 580,1080 520,1190"
				fill="none" stroke={INK} strokeWidth="8" />
			{/* land (right) */}
			<text x="820" y="480" fontFamily={TITAN} fontSize="36" letterSpacing="3" fill={INK} textAnchor="middle" transform="rotate(90 820 480)">FESTLAND</text>
			{/* Roanoke Island */}
			<ellipse cx="640" cy="420" rx="74" ry="80" fill={PARCHMENT} stroke={INK} strokeWidth="5" />
			<text x="640" y="438" fontFamily={TITAN} fontSize="24" letterSpacing="1" fill={INK} textAnchor="middle">ROANOKE</text>
			<circle cx="640" cy="420" r={14 * pulse} fill="none" stroke={RED} strokeWidth="5" />
			{/* Croatoan / Hatteras */}
			<ellipse cx="560" cy="900" rx="74" ry="92" fill={PARCHMENT} stroke={INK} strokeWidth="5" />
			<text x="560" y="918" fontFamily={TITAN} fontSize="22" letterSpacing="1" fill={INK} textAnchor="middle">CROATOAN</text>
			<circle cx="560" cy="900" r={14 * pulse} fill="none" stroke={RED} strokeWidth="5" />
			{/* arrow down the coast */}
			<line x1="640" y1="520" x2="575" y2="800" stroke={RED} strokeWidth="10" strokeLinecap="round"
				strokeDasharray="320" strokeDashoffset={320 * (1 - progress)} />
			<polygon points="545,780 595,780 570,825" fill={RED} opacity={progress} />
			<text x="820" y="680" fontFamily={TITAN} fontSize="34" letterSpacing="2" fill={RED} textAnchor="middle" transform="rotate(90 820 680)">~ 80 KM SÜDLICH</text>
			{/* compass rose */}
			<g transform="translate(880,180)" opacity="0.85">
				<circle r="52" fill="none" stroke={INK} strokeWidth="3" />
				<polygon points="0,-48 10,0 0,48 -10,0" fill={INK} />
				<polygon points="-48,0 0,-10 48,0 0,10" fill={INK} />
				<text y="-64" fontFamily={TITAN} fontSize="30" fill={INK} textAnchor="middle">N</text>
			</g>
		</svg>
	);
};

// --- Scene 1: Hook (0–3.7s) — John White map + title ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const titleIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [40, 58], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(MAP)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 65%', filter: 'brightness(0.75) sepia(0.25)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(14,30,40,0.75), transparent 35%, transparent 55%, rgba(14,30,40,0.85))'}} />
			<div style={{position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center', opacity: titleIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 92, color: '#fff', letterSpacing: 2, lineHeight: 1.12,
					textShadow: '0 0 44px rgba(232,213,163,0.55), 0 8px 28px rgba(0,0,0,0.95)'}}>
					115 MENSCHEN<br />VERSCHWANDEN
				</div>
			</div>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', opacity: subIn, zIndex: 5}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 46, color: '#fff',
					backgroundColor: 'rgba(139,46,46,0.92)', padding: '16px 44px', borderRadius: 10, letterSpacing: 2}}>
					NUR EIN WORT BLIEB!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 2: Landing 1587 (3.7–8.4s) — de Bry arrival engraving ---
const SceneLanding: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.15}>
				<Img src={staticFile(ARRIVAL)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 30%', filter: 'brightness(0.9) sepia(0.2)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(14,30,40,0.6), transparent 40%, transparent 60%, rgba(14,30,40,0.8))'}} />
			<div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 130, color: PARCHMENT, letterSpacing: 6,
					textShadow: '0 0 50px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					1587
				</div>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 42, color: '#fff',
					backgroundColor: 'rgba(14,30,40,0.88)', border: `3px solid ${PARCHMENT}`,
					padding: '14px 40px', borderRadius: 10, letterSpacing: 2, marginTop: 18}}>
					115 SIEDLER LANDEN AUF ROANOKE ISLAND
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 3: Virginia Dare (8.4–12.82s) — Pomeiok village ---
const SceneDare: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [22, 42], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.16}>
				<Img src={staticFile(VILLAGE)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 40%', filter: 'brightness(0.88) sepia(0.2)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(14,30,40,0.55), transparent 40%, transparent 60%, rgba(14,30,40,0.8))'}} />
			<div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 78, color: '#fff', letterSpacing: 3,
					textShadow: '0 0 44px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					VIRGINIA DARE
				</div>
				<div style={{fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', color: PARCHMENT, marginTop: 18,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)'}}>
					das erste englische Kind,<br />das in Amerika geboren wurde
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 4: White sails to England (12.82–16.46s) — animated route map ---
const SceneRoute: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const prog = interpolate(frame, [8, durationInFrames - 6], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [18, 38], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 330, width: 1080, height: 1250}}>
				<RouteMap progress={prog} />
			</div>
			<div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', opacity: labelIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 62, color: '#fff', letterSpacing: 2, lineHeight: 1.2,
					textShadow: '0 0 40px rgba(61,90,108,0.9), 0 8px 24px rgba(0,0,0,0.9)'}}>
					JOHN WHITE SEGELT<br />NACH ENGLAND
				</div>
				<div style={{fontFamily: SERIF, fontSize: 40, fontStyle: 'italic', color: PARCHMENT, marginTop: 12,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					um Nachschub zu holen…
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 5: War with Spain (16.46–18.96s) — Armada engraving ---
const SceneArmada: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [6, 20], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(ARMADA)} style={{width: '100%', height: '100%', objectFit: 'cover',
					objectPosition: '50% 45%', filter: 'brightness(0.85) sepia(0.2)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(14,30,40,0.65), transparent 40%, rgba(14,30,40,0.75))'}} />
			<div style={{position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 72, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					KRIEG MIT SPANIEN
				</div>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(139,46,46,0.92)', padding: '14px 40px', borderRadius: 10,
					letterSpacing: 2, marginTop: 18}}>
					3 JAHRE VERZÖGERT
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 6: Empty settlement 1590 (18.96–23.8s) — AI image + 3 chips ---
const SceneEmpty: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [16, 36], [0, 1], {extrapolateRight: 'clamp'});
	// chips timed to the VO: "Keine Leichen" 21.68, "keine Gräber" 22.36, "kein Kampf" 23.10
	// scene starts at 18.96s -> relative 2.72s / 3.40s / 4.14s
	const chip1 = interpolate(frame, [82, 96], [0, 1], {extrapolateRight: 'clamp'});
	const chip2 = interpolate(frame, [102, 116], [0, 1], {extrapolateRight: 'clamp'});
	const chip3 = interpolate(frame, [124, 138], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.13}>
				<Img src={staticFile(EMPTY)} style={{width: '100%', height: '100%', objectFit: 'cover',
					filter: 'brightness(0.92)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(14,30,40,0.6), transparent 35%, transparent 55%, rgba(14,30,40,0.75))'}} />
			<div style={{position: 'absolute', top: 190, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 76, color: '#fff', letterSpacing: 2,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					1590 — DIE SIEDLUNG<br />IST LEER
				</div>
			</div>
			<div style={{position: 'absolute', top: 480, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(14,30,40,0.88)', border: `3px solid ${PARCHMENT}`,
					padding: '14px 36px', borderRadius: 10, letterSpacing: 2, opacity: chip1}}>
					✗ KEINE LEICHEN
				</div>
				<div style={{marginTop: 18, display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(14,30,40,0.88)', border: `3px solid ${PARCHMENT}`,
					padding: '14px 36px', borderRadius: 10, letterSpacing: 2, opacity: chip2}}>
					✗ KEINE GRÄBER
				</div>
				<div style={{marginTop: 18, display: 'inline-block', fontFamily: TITAN, fontSize: 44, color: '#fff',
					backgroundColor: 'rgba(14,30,40,0.88)', border: `3px solid ${PARCHMENT}`,
					padding: '14px 36px', borderRadius: 10, letterSpacing: 2, opacity: chip3}}>
					✗ KEIN KAMPF
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 7: CROATOAN carved (23.8–29.68s) — bark photo + letters appearing ---
const SceneCarved: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [10, 28], [0, 1], {extrapolateRight: 'clamp'});
	// VO: "CROATOAN" spoken 26.22-26.78 -> scene-relative 2.42s; one letter per ~2 frames
	const letters = 'CROATOAN'.split('');
	const chipIn = interpolate(frame, [104, 120], [0, 1], {extrapolateRight: 'clamp'}); // "Kein Kreuz" at 27.26
	const subIn = interpolate(frame, [136, 152], [0, 1], {extrapolateRight: 'clamp'}); // "vereinbarte Zeichen" at 28.34
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.22}>
				<Img src={staticFile(BARK)} style={{width: '100%', height: '100%', objectFit: 'cover',
					filter: 'brightness(0.8)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 30%, rgba(14,30,40,0.75) 100%)'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 56, color: '#fff', letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.95), 0 8px 28px rgba(0,0,0,0.95)'}}>
					NUR EIN WORT —<br />IN EINEN PFOSTEN GESCHNITZT
				</div>
			</div>
			{/* the carved word, letters appearing one by one */}
			<div style={{position: 'absolute', top: 780, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 148, letterSpacing: 4,
					textShadow: '0 3px 0 rgba(0,0,0,0.85), 0 0 30px rgba(139,46,46,0.8), 0 8px 30px rgba(0,0,0,0.9)'}}>
					{letters.map((ch, i) => {
						const appearAt = Math.round((2.42 + i * 0.07) * 30);
						const op = interpolate(frame, [appearAt, appearAt + 3], [0, 1], {extrapolateRight: 'clamp'});
						return (
							<span key={i} style={{color: REDBRIGHT, opacity: op, display: 'inline-block'}}>
								{ch}
							</span>
						);
					})}
				</div>
			</div>
			<div style={{position: 'absolute', top: 1020, left: 0, right: 0, textAlign: 'center', opacity: chipIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 48, color: '#fff',
					backgroundColor: 'rgba(139,46,46,0.95)', padding: '16px 44px', borderRadius: 10, letterSpacing: 2}}>
					KEIN KREUZ ✗
				</div>
				<div style={{fontFamily: SERIF, fontSize: 40, fontStyle: 'italic', color: PARCHMENT, marginTop: 16,
					textShadow: '0 4px 20px rgba(0,0,0,0.95)', opacity: subIn}}>
					das vereinbarte Zeichen für Gefahr
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 8: Voluntary departure (29.68–33.28s) — coastal map Roanoke -> Croatoan ---
const SceneDeparture: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const prog = interpolate(frame, [10, durationInFrames - 8], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [16, 36], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 330, width: 1080, height: 1250}}>
				<CoastMap progress={prog} />
			</div>
			<div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', opacity: labelIn, zIndex: 5}}>
				<div style={{fontFamily: TITAN, fontSize: 60, color: '#fff', letterSpacing: 2, lineHeight: 1.2,
					textShadow: '0 0 40px rgba(61,90,108,0.9), 0 8px 24px rgba(0,0,0,0.9)'}}>
					OFFENBAR FREIWILLIG<br />AUFGEBROCHEN
				</div>
				<div style={{fontFamily: SERIF, fontSize: 40, fontStyle: 'italic', color: PARCHMENT, marginTop: 12,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					zu einem befreundeten Stamm
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 9: Storm + question (33.28–36.98s) — animated storm sea ---
const SceneStorm: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [8, 24], [0, 1], {extrapolateRight: 'clamp'});
	const qIn = interpolate(frame, [42, 60], [0, 1], {extrapolateRight: 'clamp'}); // "Was ist mit ihnen passiert?" at 34.66
	const waveShift = (frame * 9) % 270;
	const waveShift2 = (frame * 15) % 270;
	const waveShift3 = (frame * 6) % 270;
	return (
		<AbsoluteFill style={{backgroundColor: '#0a1620', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, #0a1620 0%, #1d303c 45%, #274b5f 100%)'}} />
			<svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
				<g transform={`translate(${-waveShift3},0)`} opacity="0.4">
					<path d="M0,700 Q135,600 270,700 T540,700 T810,700 T1080,700 T1350,700 L1350,1920 L0,1920 Z"
						fill="#0f2836" />
					<path d="M0,700 Q135,600 270,700 T540,700 T810,700 T1080,700 T1350,700"
						fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="5" />
				</g>
				<g transform={`translate(${-waveShift},0)`} opacity="0.6">
					<path d="M0,950 Q135,830 270,950 T540,950 T810,950 T1080,950 T1350,950 L1350,1920 L0,1920 Z"
						fill="#16303f" />
					<path d="M0,950 Q135,830 270,950 T540,950 T810,950 T1080,950 T1350,950"
						fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="7" />
				</g>
				<g transform={`translate(${-waveShift2},0)`} opacity="0.9">
					<path d="M0,1250 Q135,1130 270,1250 T540,1250 T810,1250 T1080,1250 T1350,1250 L1350,1920 L0,1920 Z"
						fill="#1d4457" />
					<path d="M0,1250 Q135,1130 270,1250 T540,1250 T810,1250 T1080,1250 T1350,1250"
						fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="10" />
				</g>
				{/* rain streaks */}
				{[...Array(30)].map((_, i) => {
					const x = (i * 53) % 1080;
					const y = ((frame * 34 + i * 173) % 2100) - 100;
					return (
						<line key={i} x1={x} y1={y} x2={x - 26} y2={y + 130}
							stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" />
					);
				})}
			</svg>
			<div style={{position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 62, color: '#fff', letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 40px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)'}}>
					EIN STURM<br />VERHINDERTE DIE SUCHE
				</div>
			</div>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', opacity: qIn}}>
				<div style={{fontFamily: TITAN, fontSize: 64, color: PARCHMENT, letterSpacing: 2, lineHeight: 1.25,
					textShadow: '0 0 44px rgba(232,213,163,0.5), 0 8px 28px rgba(0,0,0,0.95)'}}>
					WAS IST MIT IHNEN<br />PASSIERT?
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 10: End card CTA (36.98–41.12s) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [8, 28], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2 * 1.4);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(61,90,108,0.55) 0%, rgba(14,30,40,0.95) 80%)'}} />
			<div style={{position: 'absolute', top: '34%', left: 0, right: 0, textAlign: 'center',
				opacity: textIn, transform: `scale(${pulse})`}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 46, color: INK,
					backgroundColor: PARCHMENT, padding: '18px 44px', borderRadius: 10, letterSpacing: 2}}>
					✍ SCHREIB ES IN DIE KOMMENTARE!
				</div>
				<div style={{fontFamily: TITAN, fontSize: 66, color: '#fff', letterSpacing: 2, marginTop: 44,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: PARCHMENT}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 38, fontStyle: 'italic', color: FOAM, marginTop: 16}}>
					für mehr verbotene Wahrheiten
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration (VO 39.6s, last word ends 39.62s)
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.7, render: SceneHook},
	{from: 3.7, to: 8.4, render: SceneLanding},
	{from: 8.4, to: 12.82, render: SceneDare},
	{from: 12.82, to: 16.46, render: SceneRoute},
	{from: 16.46, to: 18.96, render: SceneArmada},
	{from: 18.96, to: 23.8, render: SceneEmpty},
	{from: 23.8, to: 29.68, render: SceneCarved},
	{from: 29.68, to: 33.28, render: SceneDeparture},
	{from: 33.28, to: 36.98, render: SceneStorm},
	{from: 36.98, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const RoanokeVideo: React.FC<RoanokeVideoProps> = ({
	words,
	voiceover,
	music,
	musicVolume = 0.08,
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
		<AbsoluteFill style={{backgroundColor: DEEP}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`roanoke-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(14,30,40,0.6) 100%)'}} />

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
