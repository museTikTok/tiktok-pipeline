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

export type VerboteneOrteVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';

// Images (Wikimedia Commons, libre de droits)
const SENTINEL_FLIGHT = 'batch6/sentinel-flight.jpg';
const SENTINEL_SAT = 'batch6/sentinel-sat.jpg';
const SNAKE_AERIAL = 'batch6/snake-aerial.jpg';
const SNAKE_VIPER = 'batch6/snake-viper.jpg';
const SNAKE_LIGHTHOUSE = 'batch6/snake-lighthouse.jpg';
const PRIPYAT_WHEEL = 'batch6/pripyat-wheel.jpg';
const PRIPYAT_BUILDINGS = 'batch6/pripyat-buildings.jpg';
const AREA51_GROOM = 'batch6/area51-groom.jpg';
const AREA51_SIGN = 'batch6/area51-sign.jpg';
const AREA51_SAT = 'batch6/area51-sat.jpg';

const NIGHT = '#0b1116';
const DEEP = '#12202b';
const RED = '#c0392b';
const REDDARK = '#8b2e2e';
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
				<filter id="verbotene-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#verbotene-grain)" />
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
	extra?: React.ReactNode;
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
			{shot.extra}
		</AbsoluteFill>
	);
};

// --- Hook scene (0–2.06s): white pill title card + emoji, @untldfcts style ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const emojiIn = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
	const pillIn = interpolate(frame, [3, 12], [0, 1], {extrapolateRight: 'clamp'});
	const pillPop = interpolate(frame, [3, 12], [0.92, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir="in" maxZoom={1.2}>
				<Img
					src={staticFile(SENTINEL_FLIGHT)}
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
				<div style={{fontSize: 130, lineHeight: 1}}>😳</div>
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
					4 ORTE, DIE DU
					<br />
					NIEMALS BETRETEN
					<br />
					DARFST!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Area 51 sign graphic (68–71.94s): recreated warning sign, the twist visual ---
const SceneSign: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const signIn = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
	const signPop = interpolate(frame, [0, 14], [0.9, 1], {extrapolateRight: 'clamp'});
	const subIn = interpolate(frame, [22, 40], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.03 * Math.sin((frame / 30) * Math.PI * 2 * 1.5);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at center, rgba(60,40,10,0.55) 0%, rgba(11,17,22,0.97) 78%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 560,
					left: 90,
					right: 90,
					textAlign: 'center',
					opacity: signIn,
					transform: `scale(${signPop * pulse})`,
					zIndex: 5,
				}}
			>
				<div
					style={{
						backgroundColor: '#fff',
						border: '10px solid #e67e22',
						borderRadius: 16,
						padding: '36px 30px',
						boxShadow: '0 16px 60px rgba(0,0,0,0.8)',
					}}
				>
					<div style={{fontSize: 84, lineHeight: 1}}>⚠️</div>
					<div
						style={{
							fontFamily: TITAN,
							fontSize: 58,
							color: '#111',
							letterSpacing: 1,
							lineHeight: 1.25,
							marginTop: 12,
						}}
					>
						USE OF DEADLY
						<br />
						FORCE AUTHORIZED
					</div>
					<div
						style={{
							fontFamily: TITAN,
							fontSize: 36,
							color: RED,
							letterSpacing: 2,
							marginTop: 14,
						}}
					>
						TÖDLICHE GEWALT IST ERLAUBT
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', opacity: subIn, zIndex: 5}}>
				<div
					style={{
						fontFamily: TITAN,
						fontSize: 54,
						color: FOAM,
						letterSpacing: 2,
						lineHeight: 1.25,
						textShadow: '0 4px 24px rgba(0,0,0,0.95)',
					}}
				>
					KEIN ZAUN —<br />
					NUR EIN SCHILD.
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- End card CTA (71.94–77.16s) ---
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
					WELCHER ORT SCHOCKIERT DICH AM MEISTEN?
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
						fontSize: 52,
						color: FOAM,
						letterSpacing: 2,
						marginTop: 44,
						textShadow: '0 4px 20px rgba(0,0,0,0.9)',
					}}
				>
					Folge für mehr verbotene Orte!
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Pulsing 5-km exclusion ring over the Sentinel satellite image
const ExclusionRing: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.14 * Math.sin((frame / 30) * Math.PI * 2 * 1.1);
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, zIndex: 4}}>
			<svg viewBox="0 0 1080 1920" style={{width: '100%', height: '100%'}}>
				<circle
					cx="540"
					cy="960"
					r={300 * pulse}
					fill="none"
					stroke={RED}
					strokeWidth="10"
					strokeDasharray="26 18"
					opacity="0.95"
				/>
				<circle cx="540" cy="960" r="16" fill={RED} />
				<text x="540" y="640" fontFamily={TITAN} fontSize="44" fill="#fff" textAnchor="middle" letterSpacing="3">
					⛔ 5 KM — BETRETEN VERBOTEN
				</text>
			</svg>
		</div>
	);
};

// Shot list — visual change every ~4-5s (Axel dynamic rule).
// Times follow the narration boundaries (words-fixed.json).
const SHOTS: ShotDef[] = [
	// Sentinel (2.06–18.04s)
	{
		img: SENTINEL_FLIGHT, from: 2.06, to: 10.0,
		name: 'NORTH SENTINEL', sub: 'INDIEN', subColor: RED,
		chip: '⛔ 5 KM SPERRZONE', dir: 'in', zoom: 1.18,
		objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: SENTINEL_SAT, from: 10.0, to: 18.04,
		chip: '60.000 JAHRE OHNE KONTAKT', chipTop: 1330, dir: 'out', zoom: 1.16,
		objectPosition: '50% 50%', filter: 'brightness(0.9)',
		extra: <ExclusionRing />,
	},
	// Snake Island (18.04–32.54s)
	{
		img: SNAKE_AERIAL, from: 18.04, to: 23.0,
		name: 'SNAKE ISLAND', sub: 'BRASILIEN', subColor: RED,
		dir: 'panR', zoom: 1.16, objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		img: SNAKE_VIPER, from: 23.0, to: 28.0,
		chip: '🐍 GIFT 5× STÄRKER', dir: 'in', zoom: 1.22,
		objectPosition: '50% 50%', filter: 'brightness(0.88)',
	},
	{
		img: SNAKE_LIGHTHOUSE, from: 28.0, to: 32.54,
		chip: '🚫 MARINE-SPERRZONE SEIT 1920', dir: 'panL', zoom: 1.16,
		objectPosition: '50% 55%', filter: 'brightness(0.85)',
	},
	// Prypjat (32.54–51.28s)
	{
		img: PRIPYAT_WHEEL, from: 32.54, to: 37.5,
		name: 'PRYPJAT', sub: 'UKRAINE', subColor: RED,
		chip: '☢️ 26. APRIL 1986', dir: 'in', zoom: 1.16,
		objectPosition: '50% 40%', filter: 'brightness(0.82)',
	},
	{
		img: PRIPYAT_WHEEL, from: 37.5, to: 42.5,
		chip: '49.360 MENSCHEN EVAKUIERT', dir: 'out', zoom: 1.2,
		objectPosition: '50% 65%', filter: 'brightness(0.8)',
	},
	{
		img: PRIPYAT_BUILDINGS, from: 42.5, to: 47.0,
		chip: 'FÜR 3 TAGE — FÜR IMMER', dir: 'panR', zoom: 1.16,
		objectPosition: '50% 45%', filter: 'brightness(0.8)',
	},
	{
		img: PRIPYAT_BUILDINGS, from: 47.0, to: 51.28,
		chip: '🎡 RIESENRAD — NIE BENUTZT', dir: 'in', zoom: 1.2,
		objectPosition: '50% 30%', filter: 'brightness(0.82)',
	},
	// Area 51 (51.28–71.94s)
	{
		img: AREA51_GROOM, from: 51.28, to: 57.0,
		name: 'AREA 51', sub: 'NEVADA, USA', subColor: RED,
		dir: 'in', zoom: 1.16, objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		img: AREA51_SIGN, from: 57.0, to: 62.5,
		chip: '⚠️ USE OF DEADLY FORCE', dir: 'panL', zoom: 1.16,
		objectPosition: '50% 50%', filter: 'brightness(0.88)',
	},
	{
		img: AREA51_SAT, from: 62.5, to: 68.0,
		chip: '✈️ LUFTRAUM GESPERRT', dir: 'out', zoom: 1.18,
		objectPosition: '50% 50%', filter: 'brightness(0.9)',
	},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const VerboteneOrteVideo: React.FC<VerboteneOrteVideoProps> = ({
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
			<Sequence from={0} durationInFrames={Math.round(2.06 * fps)} name="hook">
				<SceneHook durationInFrames={Math.round(2.06 * fps)} />
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

			{/* Deadly Force sign graphic */}
			<Sequence from={Math.round(68.0 * fps)} durationInFrames={Math.round((71.94 - 68.0) * fps)} name="sign">
				<SceneSign durationInFrames={Math.round((71.94 - 68.0) * fps)} />
			</Sequence>

			{/* End card */}
			<Sequence from={Math.round(71.94 * fps)} durationInFrames={durationInFrames - Math.round(71.94 * fps)} name="endcard">
				<SceneEndCard durationInFrames={durationInFrames - Math.round(71.94 * fps)} />
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
