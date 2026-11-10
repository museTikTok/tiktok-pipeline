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

export type PsychologieVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';

// Images — ALL REAL PHOTOS (Wikimedia Commons, libre de droits). No illustrations, no AI.
// Hook: real shocked face (B&W, dramatic). Maps: REAL maps matching the subject
// (Paris = Turgot map of Paris 1739, Germany = general map of Germany).
const HOOK_SHOCK = 'batch6/v2-hook-shock.jpg';
const BRAIN_CT = 'batch6/v2-brain.jpg';
const MONOPOLY = 'batch6/v2-monopoly.jpg';
const PIKACHU = 'batch6/v2-pikachu.jpg';
const VADER = 'batch6/v2-vader.jpg';
const ILLUSION = 'batch6/v2-illusion.jpg';
const EIFFEL = 'batch6/v2-eiffel.jpg';
const PARIS_STREET = 'batch6/v2-paris-street.jpg';
const MAP_PARIS = 'batch6/v2-map-paris.jpg';
const MAP_GERMANY = 'batch6/v2-map-germany.jpg';
const TRAFFIC = 'batch6/v2-traffic.jpg';
const DOOR = 'batch6/v2-door.jpg';
const MEME_SHOCKED = 'batch6/v2-meme-shocked.png';
const MEME_SURPRISE = 'batch6/v2-meme-surprise.jpg';

const NIGHT = '#0b1116';
const DEEP = '#12202b';
const RED = '#c0392b';
const AMBER = '#f5b301';
const FOAM = '#eaf4fa';

// Animated film grain — cinema look + prevents compression identical frames
// seed changes EVERY frame (not every 2) to guarantee zero duplicated frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="psycho-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#psycho-grain)" />
			</svg>
		</div>
	);
};

// Continuous motion wrapper — Ken Burns zoom + drift/pan, never static.
// NOTE: useCurrentFrame() is RELATIVE to the parent <Sequence>.
type KenBurnsDir = 'in' | 'out' | 'panL' | 'panR';
const KenBurns: React.FC<{
	durationInFrames: number;
	children: React.ReactNode;
	dir?: KenBurnsDir;
	maxZoom?: number;
}> = ({durationInFrames, children, dir = 'in', maxZoom = 1.15}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(Math.max(frame / durationInFrames, 0), 1);
	const zoomIn = interpolate(progress, [0, 1], [1.0, maxZoom]);
	const zoomOut = interpolate(progress, [0, 1], [maxZoom, 1.0]);
	const scale = dir === 'out' ? zoomOut : zoomIn;
	const panX =
		dir === 'panL'
			? interpolate(progress, [0, 1], [28, -28])
			: dir === 'panR'
				? interpolate(progress, [0, 1], [-28, 28])
				: 0;
	const driftY = Math.sin((frame / 30) * Math.PI * 2 * 0.07) * 12;
	return (
		<div
			style={{
				position: 'absolute',
				inset: -70,
				transform: `scale(${scale}) translate(${panX}px, ${driftY}px)`,
			}}
		>
			{children}
		</div>
	);
};

// --- Shared overlay pieces ---
const NameCard: React.FC<{name: string; sub: string; subColor?: string}> = ({
	name,
	sub,
	subColor = RED,
}) => (
	<div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
		<div
			style={{
				fontFamily: TITAN,
				fontSize: 88,
				color: '#fff',
				letterSpacing: 2,
				lineHeight: 1.05,
				textShadow: '0 0 44px rgba(0,0,0,0.9), 0 8px 28px rgba(0,0,0,0.95)',
			}}
		>
			{name}
		</div>
		<div
			style={{
				display: 'inline-block',
				fontFamily: TITAN,
				fontSize: 42,
				color: '#fff',
				backgroundColor: subColor,
				padding: '12px 40px',
				borderRadius: 10,
				letterSpacing: 3,
				marginTop: 16,
				boxShadow: '0 8px 28px rgba(0,0,0,0.6)',
			}}
		>
			{sub}
		</div>
	</div>
);

const Chip: React.FC<{text: string; top?: number; bg?: string}> = ({
	text,
	top = 980,
	bg = 'rgba(11,17,22,0.88)',
}) => (
	<div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
		<div
			style={{
				display: 'inline-block',
				fontFamily: TITAN,
				fontSize: 44,
				color: '#fff',
				backgroundColor: bg,
				border: '3px solid rgba(255,255,255,0.85)',
				padding: '14px 38px',
				borderRadius: 12,
				letterSpacing: 2,
				boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
			}}
		>
			{text}
		</div>
	</div>
);

// --- Generic image shot: photo + Ken Burns + optional name card / chip ---
type ShotDef = {
	img: string;
	from: number;
	to: number;
	name?: string;
	sub?: string;
	subColor?: string;
	chip?: string;
	chipTop?: number;
	chipBg?: string;
	dir?: KenBurnsDir;
	zoom?: number;
	filter?: string;
	objectPosition?: string;
};

const Shot: React.FC<{shot: ShotDef; durationInFrames: number}> = ({shot, durationInFrames}) => {
	const frame = useCurrentFrame();
	const labelIn = interpolate(frame, [14, 32], [0, 1], {extrapolateRight: 'clamp'});
	const chipIn = interpolate(frame, [26, 44], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir={shot.dir ?? 'in'} maxZoom={shot.zoom ?? 1.15}>
				<Img
					src={staticFile(shot.img)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: shot.objectPosition ?? '50% 50%',
						filter: shot.filter ?? 'brightness(0.85)',
					}}
				/>
			</KenBurns>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(to bottom, rgba(11,17,22,0.72), transparent 32%, transparent 58%, rgba(11,17,22,0.88))',
				}}
			/>
			{shot.name && (
				<div style={{opacity: labelIn}}>
					<NameCard name={shot.name} sub={shot.sub ?? ''} subColor={shot.subColor} />
				</div>
			)}
			{shot.chip && (
				<div style={{opacity: chipIn}}>
					<Chip text={shot.chip} top={shot.chipTop ?? 980} bg={shot.chipBg} />
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Meme pop-in: a reaction-meme photo that pops in (scale bounce + slight tilt)
// timed to the narrator's shock line. Shown as a framed inset, bottom-right.
// NOTE: useCurrentFrame() is RELATIVE to the parent <Sequence>.
const MemePop: React.FC<{img: string; durationInFrames: number; size?: number}> = ({
	img,
	durationInFrames,
	size = 460,
}) => {
	const frame = useCurrentFrame();
	const pop = interpolate(frame, [0, 8, 14], [0, 1.12, 1], {extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const tilt = interpolate(frame, [0, 20], [-6, -3], {extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				right: 70,
				bottom: 560,
				width: size,
				zIndex: 20,
				opacity: fadeOut,
				transform: `scale(${pop}) rotate(${tilt}deg)`,
			}}
		>
			<Img
				src={staticFile(img)}
				style={{
					width: '100%',
					borderRadius: 18,
					border: '6px solid #fff',
					boxShadow: '0 18px 60px rgba(0,0,0,0.85)',
					display: 'block',
				}}
			/>
		</div>
	);
};

// --- Hook scene (0–2.1s): white pill title card + emoji over the shocked face ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const emojiIn = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
	const pillIn = interpolate(frame, [3, 12], [0, 1], {extrapolateRight: 'clamp'});
	const pillPop = interpolate(frame, [3, 12], [0.92, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir="in" maxZoom={1.2}>
				<Img
					src={staticFile(HOOK_SHOCK)}
					style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.62)'}}
				/>
			</KenBurns>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 30%, rgba(11,17,22,0.8) 100%)',
				}}
			/>
			<div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center', opacity: emojiIn, zIndex: 5}}>
				<div style={{fontSize: 130, lineHeight: 1}}>🤯</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 580,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: pillIn,
					transform: `scale(${pillPop})`,
					zIndex: 5,
				}}
			>
				<div
					style={{
						display: 'inline-block',
						fontFamily: TITAN,
						fontSize: 66,
						color: '#111',
						backgroundColor: '#fff',
						padding: '30px 54px',
						borderRadius: 60,
						letterSpacing: 1,
						lineHeight: 1.25,
						boxShadow: '0 12px 44px rgba(0,0,0,0.65)',
					}}
				>
					4 MAL TRICKST DICH
					<br />
					DEIN GEHIRN AUS!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- End card CTA (75.66–81.08s) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [6, 24], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.035 * Math.sin((frame / 30) * Math.PI * 2 * 1.3);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at center, rgba(39,75,95,0.6) 0%, rgba(11,17,22,0.97) 80%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '30%',
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: textIn,
					transform: `scale(${pulse})`,
				}}
			>
				<div
					style={{
						fontFamily: TITAN,
						fontSize: 64,
						color: '#fff',
						letterSpacing: 2,
						lineHeight: 1.25,
						textShadow: '0 4px 24px rgba(0,0,0,0.9)',
						padding: '0 60px',
					}}
				>
					WELCHER TRICK HAT DICH AM MEISTEN ERWISCHT?
				</div>
				<div
					style={{
						display: 'inline-block',
						fontFamily: TITAN,
						fontSize: 46,
						color: '#111',
						backgroundColor: AMBER,
						padding: '18px 44px',
						borderRadius: 12,
						letterSpacing: 2,
						marginTop: 48,
					}}
				>
					✍ SCHREIB ES IN DIE KOMMENTARE!
				</div>
				<div
					style={{
						fontFamily: TITAN,
						fontSize: 44,
						color: FOAM,
						letterSpacing: 2,
						marginTop: 44,
						textShadow: '0 4px 20px rgba(0,0,0,0.9)',
						padding: '0 60px',
					}}
				>
					Folge für mehr Psychologie-Fakten!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Shot list — visual change every ~3s (Axel: MORE animation, dynamic).
// Times follow the narration boundaries (v2-words-fixed.json).
const SHOTS: ShotDef[] = [
	// Mandela-Effekt (2.1–26.4s)
	{
		img: MONOPOLY, from: 2.1, to: 5.5,
		name: 'MANDELA-EFFEKT', sub: 'FALSCHE ERINNERUNG', subColor: RED,
		dir: 'in', zoom: 1.18, objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: MONOPOLY, from: 5.5, to: 9.2,
		chip: '⛔ KEIN MONOKEL!', chipTop: 700, dir: 'out', zoom: 1.2,
		objectPosition: '50% 65%', filter: 'brightness(0.8)',
	},
	{
		img: PIKACHU, from: 9.2, to: 12.0,
		chip: '🐭 SCHWANZ: IMMER GELB', dir: 'panR', zoom: 1.16,
		objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		img: PIKACHU, from: 12.0, to: 14.2,
		chip: '⚡ NUR DIE OHREN SIND SCHWARZ', dir: 'in', zoom: 1.22,
		objectPosition: '50% 30%', filter: 'brightness(0.88)',
	},
	{
		img: VADER, from: 14.2, to: 17.6,
		chip: '🌌 DARTH VADER', dir: 'in', zoom: 1.16,
		objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: VADER, from: 17.6, to: 20.1,
		chip: '❌ NIE GESAGT: „LUKE...“', dir: 'out', zoom: 1.2,
		objectPosition: '50% 60%', filter: 'brightness(0.8)',
	},
	{
		img: ILLUSION, from: 20.1, to: 23.9,
		chip: '🧠 STUDIE CHICAGO 2022', dir: 'panL', zoom: 1.16,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		img: ILLUSION, from: 23.9, to: 26.4,
		chip: '🤯 MILLIONEN LÜGEN GLEICH', chipTop: 700, dir: 'in', zoom: 1.2,
		objectPosition: '50% 35%', filter: 'brightness(0.82)',
	},
	// Paris-Syndrom (26.4–49.5s)
	{
		img: EIFFEL, from: 26.4, to: 28.4,
		name: 'PARIS-SYNDROM', sub: 'TRAUM vs. REALITÄT', subColor: RED,
		dir: 'in', zoom: 1.18, objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: PARIS_STREET, from: 28.4, to: 31.1,
		chip: '😢 ZUSAMMENBRUCH IN PARIS', dir: 'panR', zoom: 1.16,
		objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		img: EIFFEL, from: 31.1, to: 34.5,
		chip: '💭 TRAUM: ROMANTISCH & PERFEKT', dir: 'out', zoom: 1.2,
		objectPosition: '50% 60%', filter: 'brightness(0.8)',
	},
	{
		img: MAP_PARIS, from: 34.5, to: 37.3,
		chip: '🗺️ DIE ECHTE STADT: PARIS 1739', dir: 'in', zoom: 1.18,
		objectPosition: '50% 50%', filter: 'brightness(0.88)',
	},
	{
		img: MAP_PARIS, from: 37.3, to: 41.2,
		chip: '😱 TRAUM vs. REALITÄT', dir: 'panL', zoom: 1.16,
		objectPosition: '50% 30%', filter: 'brightness(0.85)',
	},
	{
		img: EIFFEL, from: 41.2, to: 44.9,
		chip: '⚠️ HALLUZINATIONEN & ANGST', chipTop: 700, dir: 'in', zoom: 1.2,
		objectPosition: '50% 55%', filter: 'brightness(0.8)',
	},
	{
		img: PARIS_STREET, from: 44.9, to: 49.5,
		chip: '🏥 CA. 12 PRO JAHR', dir: 'out', zoom: 1.16,
		objectPosition: '50% 40%', filter: 'brightness(0.85)',
	},
	// Baader-Meinhof (49.5–62.5s)
	{
		img: MAP_GERMANY, from: 49.5, to: 51.8,
		name: 'BAADER-MEINHOF', sub: 'FREQUENCY ILLUSION', subColor: RED,
		dir: 'in', zoom: 1.18, objectPosition: '50% 50%', filter: 'brightness(0.88)',
	},
	{
		img: TRAFFIC, from: 51.8, to: 54.5,
		chip: '👀 PLÖTZLICH ÜBERALL', dir: 'panR', zoom: 1.16,
		objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		img: TRAFFIC, from: 54.5, to: 56.9,
		chip: '🚗 JEDER FÄHRT ES', dir: 'in', zoom: 1.2,
		objectPosition: '50% 60%', filter: 'brightness(0.8)',
	},
	{
		img: BRAIN_CT, from: 56.9, to: 59.3,
		chip: '🧠 NUR DEINE AUFMERKSAMKEIT', dir: 'out', zoom: 1.16,
		objectPosition: '50% 50%', filter: 'brightness(0.88)',
	},
	{
		img: BRAIN_CT, from: 59.3, to: 62.5,
		chip: '🔍 DEIN FILTER LÜGT', dir: 'in', zoom: 1.2,
		objectPosition: '50% 35%', filter: 'brightness(0.85)',
	},
	// Tür-Effekt (62.5–75.0s)
	{
		img: DOOR, from: 62.5, to: 64.5,
		name: 'TÜR-EFFEKT', sub: 'VERGESSEN', subColor: RED,
		dir: 'in', zoom: 1.18, objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: DOOR, from: 64.5, to: 66.5,
		chip: '🚪 WARUM BIN ICH HIER?', chipTop: 700, dir: 'panL', zoom: 1.16,
		objectPosition: '50% 55%', filter: 'brightness(0.85)',
	},
	{
		img: DOOR, from: 66.5, to: 70.1,
		chip: '📖 KAPITEL GESCHLOSSEN', dir: 'out', zoom: 1.2,
		objectPosition: '50% 30%', filter: 'brightness(0.8)',
	},
	{
		img: BRAIN_CT, from: 70.1, to: 75.0,
		chip: '🧠 NEUES KAPITEL — ALTES WEG', dir: 'in', zoom: 1.18,
		objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
];

// Meme insets — timed to the narrator's shock lines (Axel: memes sync with words).
// [img, from, to]
const MEMES: {img: string; from: number; to: number; size?: number}[] = [
	{img: MEME_SHOCKED, from: 8.0, to: 10.2, size: 440}, // S05 "Falsch — er hatte nie eins."
	{img: MEME_SHOCKED, from: 24.2, to: 26.4, size: 480}, // S11 "Dein Gedächtnis lügt"
	{img: MEME_SURPRISE, from: 41.5, to: 44.9, size: 460}, // S17 Symptome: Halluzinationen...
	{img: HOOK_SHOCK, from: 64.8, to: 66.5, size: 440}, // S25 "Du gehst in ein Zimmer — und vergisst, warum."
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const PsychologieVideo: React.FC<PsychologieVideoProps> = ({
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
			{/* Hook */}
			<Sequence from={0} durationInFrames={Math.round(2.1 * fps)} name="hook">
				<SceneHook durationInFrames={Math.round(2.1 * fps)} />
			</Sequence>

			{/* Image shots */}
			{SHOTS.map((shot, i) => {
				const fromF = Math.round(shot.from * fps);
				const toF = Math.round(shot.to * fps);
				const len = toF - fromF;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`shot-${i}`}>
						<Shot shot={shot} durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* Meme insets (reaction images, synced to shock lines) */}
			{MEMES.map((meme, i) => {
				const fromF = Math.round(meme.from * fps);
				const toF = Math.round(meme.to * fps);
				const len = toF - fromF;
				return (
					<Sequence key={`meme-${i}`} from={fromF} durationInFrames={len} name={`meme-${i}`}>
						<MemePop img={meme.img} durationInFrames={len} size={meme.size} />
					</Sequence>
				);
			})}

			{/* End card */}
			<Sequence from={Math.round(75.66 * fps)} durationInFrames={durationInFrames - Math.round(75.66 * fps)} name="endcard">
				<SceneEndCard durationInFrames={durationInFrames - Math.round(75.66 * fps)} />
			</Sequence>

			{/* cinematic vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(11,17,22,0.6) 100%)',
				}}
			/>

			{/* film grain */}
			<FilmGrain />

			{/* Karaoke captions (Titan One yellow, @raya.swift style), lower third */}
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
				<Sequence
					key={`sfx-${i}`}
					from={Math.round(cue.start * fps)}
					durationInFrames={durationInFrames}
					name={`sfx-${i}`}
				>
					<Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.4} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
