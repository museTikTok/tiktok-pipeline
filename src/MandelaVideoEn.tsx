import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	OffthreadVideo,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {KaraokeLine, SfxCue, Word} from './CaptionVideo';

export type MandelaVideoEnProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";

// ---------------------------------------------------------------------------
// REAL VIDEO CLIPS ONLY (Axel, 2026-11-07): no still images — a video made of
// stills looks like a PowerPoint. Every shot is a moving clip, pre-converted
// to 30fps CFR (minterpolate blend) before Remotion.
// Sources: Wikimedia Commons + Archive.org (Mandela archive), TikTok/IG/FB
// reposts of TikTok archive compilations, Tenor meme GIFs (mp4), Mixkit B-roll.
// ---------------------------------------------------------------------------
const CLIP_HOOK_FIRE = 'batch6/clips/hook-fire30.mp4'; // fire/explosion, shock hook
const CLIP_MANDELA_WHAT = 'batch6/clips/mandela-what30.mp4'; // Mandela interview close-up (BBC archive, 1990)
const CLIP_CROWD_CON = 'batch6/clips/crowd-dragoncon30.mp4'; // convention crowd — Dragon Con
const CLIP_PRISON = 'batch6/clips/prison-bars30.mp4'; // hand on prison bars
const CLIP_NEWS = 'batch6/clips/news-deklerk30.mp4'; // de Klerk, parliament 2 Feb 1990 (TikTok compilation)
const CLIP_RELEASE = 'batch6/clips/release-walk30.mp4'; // Mandela walking out with Winnie, 1990 (BBC archive)
const CLIP_CROWD = 'batch6/clips/crowd-thousands30.mp4'; // crowd gathering, 1990 (BBC archive)
const CLIP_TYPING = 'batch6/clips/typing-web30.mp4'; // hands typing on a laptop
const CLIP_MONOPOLY = 'batch6/clips/monopoly-dice30.mp4'; // poker chips + dice
const CLIP_PIKACHU = 'batch6/clips/pikachu-ball30.mp4'; // TikTok creator holding a Pokéball
const CLIP_BOOK = 'batch6/clips/book-bears30.mp4'; // hands on an old book
const CLIP_SPACE = 'batch6/clips/space-vader30.mp4'; // nebula / space
const CLIP_PHONE = 'batch6/clips/phone-spread30.mp4'; // hand scrolling a phone
const CLIP_CONFUSED = 'batch6/clips/confused-why30.mp4'; // confused man shrugging
const CLIP_LAB = 'batch6/clips/lab-chicago30.mp4'; // laboratory corridor
const CLIP_VOTE = 'batch6/clips/voting-pick30.mp4'; // man casting a vote
const CLIP_BRAIN = 'batch6/clips/brain-scan30.mp4'; // doctor pointing at a brain scan
const CLIP_MONKEY = 'batch6/clips/monkey-tail30.mp4'; // monkey eating
const CLIP_TWIST = 'batch6/clips/mandela-twist30.mp4'; // Mandela at the White House, June 1990
const CLIP_FIRE_END = 'batch6/clips/fire-endcard30.mp4'; // fire, end-card background

// Meme VIDEO clips (Tenor GIFs as mp4), each used EXACTLY ONCE (Axel's rule).
const MEME_MINDBLOWN = 'batch6/clips/meme-mindblown30.mp4'; // Tim & Eric "mind blown"
const MEME_PIKACHU = 'batch6/clips/meme-pikachu30.mp4'; // Surprised Pikachu
const MEME_DICAPRIO = 'batch6/clips/meme-dicaprio30.mp4'; // DiCaprio pointing
const MEME_FINE = 'batch6/clips/meme-fine30.mp4'; // "This Is Fine" dog
const MEME_GALAXY = 'batch6/clips/meme-galaxy30.mp4'; // glowing brain / galaxy brain

// Archive photos used ONLY as small captioned paper insets (never full-screen).
const PHOTO_CELL = 'batch6/mandela-cell.jpg'; // Robben Island cell

const NIGHT = '#0b1116';
const DEEP = '#12202b';
const RED = '#c0392b';
const AMBER = '#f5b301';
const FOAM = '#eaf4fa';
const PAPER = '#f5ecd7';
const PAPER_INK = '#2b2620';

// Animated film grain — cinema look + prevents compression identical frames.
// seed changes EVERY frame (not every 2) to guarantee zero duplicated frames.
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="mandela-grain-v2" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#mandela-grain-v2)" />
			</svg>
		</div>
	);
};

// ---------------------------------------------------------------------------
// DYNAMIC MOTION (Axel, 2026-11-07): nothing static, everything moves.
// PopIn: spring scale (overshoot) + slide up + slight rotation settle.
// NOTE: useCurrentFrame() is RELATIVE to the parent <Sequence>.
// ---------------------------------------------------------------------------
const PopIn: React.FC<{children: React.ReactNode; delayFrames?: number; slide?: number}> = ({
	children,
	delayFrames = 0,
	slide = 46,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f = Math.max(0, frame - delayFrames);
	const scale = spring({frame: f, fps, config: {damping: 11, mass: 0.7}});
	const y = interpolate(f, [0, 14], [slide, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const rot = interpolate(f, [0, 16], [-4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const opacity = interpolate(f, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				opacity,
				transform: `translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
			}}
		>
			{children}
		</div>
	);
};

// Continuous motion wrapper — Ken Burns zoom + drift/pan on the VIDEO clip.
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
		{sub ? (
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
		) : null}
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

// ---------------------------------------------------------------------------
// PAPER EDITING (Axel, 2026-11-07): archive documents as REAL info, not decor.
// Torn-edge paper card with a date/fact — the paper carries concrete details
// (dates, quotes, study references) into the video.
// ---------------------------------------------------------------------------
const TORN_EDGE =
	'polygon(0% 3%, 4% 0%, 9% 2%, 15% 0%, 22% 3%, 30% 1%, 38% 3%, 46% 0%, 54% 2%, 62% 0%, 70% 3%, 78% 1%, 86% 3%, 93% 0%, 100% 2%, 99% 12%, 100% 25%, 98% 40%, 100% 55%, 99% 70%, 100% 85%, 98% 97%, 92% 100%, 84% 98%, 76% 100%, 68% 97%, 60% 100%, 52% 98%, 44% 100%, 36% 97%, 28% 100%, 20% 98%, 12% 100%, 5% 97%, 0% 100%, 1% 88%, 0% 75%, 2% 60%, 0% 45%, 1% 30%, 0% 15%)';

type PaperCardProps = {
	header: string;
	lines: string[];
	sub?: string;
	top?: number;
	rotate?: number;
	width?: number;
};
const PaperCard: React.FC<PaperCardProps> = ({header, lines, sub, top = 1080, rotate = -2, width = 860}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left: '50%',
			marginLeft: -width / 2,
			width,
			zIndex: 8,
			transform: `rotate(${rotate}deg)`,
		}}
	>
		{/* tape strip */}
		<div
			style={{
				position: 'absolute',
				top: -16,
				left: '50%',
				marginLeft: -70,
				width: 140,
				height: 34,
				backgroundColor: 'rgba(230,220,190,0.75)',
				transform: 'rotate(-1.5deg)',
				boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
				zIndex: 2,
			}}
		/>
		<div
			style={{
				clipPath: TORN_EDGE,
				backgroundColor: PAPER,
				padding: '26px 34px 30px',
				boxShadow: '0 14px 44px rgba(0,0,0,0.65)',
			}}
		>
			<div
				style={{
					fontFamily: SERIF,
					fontSize: 26,
					fontWeight: 700,
					letterSpacing: 4,
					color: '#8a2f23',
					textTransform: 'uppercase',
				}}
			>
				{header}
			</div>
			<div style={{height: 2, backgroundColor: '#8a2f23', opacity: 0.55, margin: '10px 0 12px'}} />
			{lines.map((line, i) => (
				<div
					key={i}
					style={{
						fontFamily: SERIF,
						fontSize: 34,
						lineHeight: 1.35,
						color: PAPER_INK,
					}}
				>
					{line}
				</div>
			))}
			{sub ? (
				<div style={{fontFamily: SERIF, fontSize: 26, fontStyle: 'italic', color: '#6b5d4f', marginTop: 10}}>
					{sub}
				</div>
			) : null}
		</div>
	</div>
);

// Captioned archive photo — small paper-framed inset (never full-screen).
const PaperPhoto: React.FC<{img: string; caption: string; top?: number; right?: number; rotate?: number; width?: number}> = ({
	img,
	caption,
	top = 700,
	right = 56,
	rotate = 3,
	width = 400,
}) => (
	<div
		style={{
			position: 'absolute',
			top,
			right,
			width,
			zIndex: 8,
			transform: `rotate(${rotate}deg)`,
			backgroundColor: '#fdfaf2',
			padding: '14px 14px 10px',
			boxShadow: '0 14px 40px rgba(0,0,0,0.7)',
		}}
	>
		<Img src={staticFile(img)} style={{width: '100%', display: 'block', filter: 'sepia(0.25) contrast(1.05)'}} />
		<div
			style={{
				fontFamily: SERIF,
				fontSize: 25,
				fontStyle: 'italic',
				color: '#4a4238',
				textAlign: 'center',
				marginTop: 10,
				lineHeight: 1.25,
			}}
		>
			{caption}
		</div>
	</div>
);

// --- Generic VIDEO shot: moving clip + Ken Burns + optional name card / chip / paper ---
// HARD CUTS only (@our.planet.decoded style) — no fade-in at shot starts.
type ShotDef = {
	clip: string;
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
	paperCard?: PaperCardProps;
	paperPhoto?: {img: string; caption: string};
};

const Shot: React.FC<{shot: ShotDef; durationInFrames: number}> = ({shot, durationInFrames}) => {
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir={shot.dir ?? 'in'} maxZoom={shot.zoom ?? 1.15}>
				<OffthreadVideo
					muted
					src={staticFile(shot.clip)}
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
				<PopIn>
					<NameCard name={shot.name} sub={shot.sub ?? ''} subColor={shot.subColor} />
				</PopIn>
			)}
			{shot.chip && (
				<PopIn delayFrames={10}>
					<Chip text={shot.chip} top={shot.chipTop ?? 980} bg={shot.chipBg} />
				</PopIn>
			)}
			{shot.paperCard && (
				<PopIn delayFrames={16} slide={60}>
					<PaperCard {...shot.paperCard} />
				</PopIn>
			)}
			{shot.paperPhoto && (
				<PopIn delayFrames={14} slide={60}>
					<PaperPhoto img={shot.paperPhoto.img} caption={shot.paperPhoto.caption} />
				</PopIn>
			)}
		</AbsoluteFill>
	);
};

// --- Meme VIDEO clip: a moving meme that pops in large, centered, framed ---
// timed to the narrator's shock line. The base clip keeps playing underneath.
// `top` is chosen per meme so it NEVER covers the shot's Chip (chips sit at
// y≈980): chip-only shots get the meme in the free middle band (y≈380–940).
const MemeClip: React.FC<{clip: string; durationInFrames: number; width?: number; top?: number}> = ({
	clip,
	durationInFrames,
	width = 680,
	top = 620,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scale = spring({frame, fps, config: {damping: 10, mass: 0.6}});
	const tilt = interpolate(frame, [0, 18], [-7, -3], {extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top,
				marginLeft: -width / 2,
				width,
				zIndex: 20,
				transform: `scale(${scale}) rotate(${tilt}deg)`,
			}}
		>
			<OffthreadVideo
				muted
				src={staticFile(clip)}
				style={{
					width: '100%',
					borderRadius: 18,
					border: '8px solid #fff',
					boxShadow: '0 18px 60px rgba(0,0,0,0.85)',
					display: 'block',
					backgroundColor: '#000',
				}}
			/>
		</div>
	);
};

// --- Brand watermark: "@brainfeeder_uk" top-left, whole video ---
// Axel's branding: NEON, SMALL, slightly TRANSPARENT — marks his videos.
// Monoton = neon-tube font (distinct from the Titan One subtitles).
const BRAND_HANDLE = '@brainfeeder_uk';
const BrandWatermark: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			top: 54,
			left: 48,
			zIndex: 60,
			opacity: 0.78,
			fontFamily: '"Monoton", sans-serif',
			fontSize: 38,
			letterSpacing: 2,
			color: '#eafcff',
			textShadow:
				'0 0 6px #00e5ff, 0 0 12px #00e5ff, 0 0 24px #00b8d4, 0 0 40px #00e5ff',
			pointerEvents: 'none',
		}}
	>
		{BRAND_HANDLE}
	</div>
);

// --- Hook scene (0–3.36s): fire clip + white pill title + emoji ---
// 3-second hook, @our.planet.decoded style — a moving shock clip, not a still.
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const emojiScale = spring({frame, fps, config: {damping: 9}});
	const pillScale = spring({frame: Math.max(0, frame - 3), fps, config: {damping: 10}});
	return (
		<AbsoluteFill style={{backgroundColor: DEEP, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir="in" maxZoom={1.25}>
				<OffthreadVideo
					muted
					src={staticFile(CLIP_HOOK_FIRE)}
					style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)'}}
				/>
			</KenBurns>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 30%, rgba(11,17,22,0.8) 100%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 400,
					left: 0,
					right: 0,
					textAlign: 'center',
					transform: `scale(${emojiScale})`,
					zIndex: 5,
				}}
			>
				<div style={{fontSize: 130, lineHeight: 1}}>🤯</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 580,
					left: 0,
					right: 0,
					textAlign: 'center',
					transform: `scale(${pillScale})`,
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
					YOUR MEMORY IS
					<br />
					LYING TO YOU
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- End card CTA (76.7–82.1s): moving fire background, darkened ---
// NOTE: the absolutely-positioned wrapper MUST sit outside <PopIn> — PopIn's
// transform makes it a containing block, and a %-top inside it would resolve
// against its 0 height (the title would land at the very top, over the brand).
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.035 * Math.sin((frame / 30) * Math.PI * 2 * 1.3);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<KenBurns durationInFrames={durationInFrames} dir="in" maxZoom={1.18}>
				<OffthreadVideo
					muted
					src={staticFile(CLIP_FIRE_END)}
					style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)'}}
				/>
			</KenBurns>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at center, rgba(39,75,95,0.55) 0%, rgba(11,17,22,0.9) 80%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 560,
					left: 0,
					right: 0,
					textAlign: 'center',
				}}
			>
				<PopIn>
					<div
						style={{
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
							WHICH ONE TRICKED YOU?
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
							✍ TELL ME IN THE COMMENTS!
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
							Follow for more mind-blowing facts!
						</div>
					</div>
				</PopIn>
			</div>
		</AbsoluteFill>
	);
};

// Shot list — visual change every ~3s (Axel: MORE animation, dynamic).
// Times follow the narration boundaries (mandela-words-fixed.json).
// EVERY shot is a real moving video clip — no still images.
const SHOTS: ShotDef[] = [
	// What it is (3.36–8.5s) — Mandela interview close-up, BBC archive
	{
		clip: CLIP_MANDELA_WHAT, from: 3.36, to: 8.5,
		name: 'THE MANDELA EFFECT', sub: 'FALSE SHARED MEMORIES', subColor: RED,
		dir: 'in', zoom: 1.12, objectPosition: '50% 30%', filter: 'brightness(0.82)',
	},
	// Origin (8.5–29.76s)
	{
		clip: CLIP_CROWD_CON, from: 8.5, to: 12.6,
		name: 'FIONA BROOME', sub: 'PARANORMAL RESEARCHER', subColor: RED,
		chip: '📍 2009 · DRAGON CON, ATLANTA', chipTop: 700,
		dir: 'in', zoom: 1.12, objectPosition: '50% 40%', filter: 'brightness(0.82)',
		paperCard: {
			header: 'Archive note · 2009',
			lines: ['She discovers others share', 'her memory of Mandela dying.'],
			sub: 'Dragon Con, Atlanta — where it all started',
			top: 1150, rotate: -2,
		},
	},
	{
		clip: CLIP_PRISON, from: 12.6, to: 15.6,
		name: 'DIED IN PRISON?', sub: 'IN THE 1980s', subColor: RED,
		dir: 'out', zoom: 1.14, objectPosition: '70% 50%', filter: 'brightness(0.8)',
		paperPhoto: {img: PHOTO_CELL, caption: 'Robben Island — Mandela’s cell'},
	},
	{
		clip: CLIP_NEWS, from: 15.6, to: 18.7,
		chip: '📰 SHE REMEMBERED THE NEWS — THE FUNERAL', dir: 'panR', zoom: 1.14,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_RELEASE, from: 18.7, to: 23.56,
		name: 'BUT IT NEVER HAPPENED', sub: '', subColor: RED,
		chip: 'RELEASED 1990 · PRESIDENT 1994 · DIED 2013', chipTop: 700,
		dir: 'in', zoom: 1.1, objectPosition: '50% 50%', filter: 'brightness(0.85)',
		paperCard: {
			header: 'The real timeline',
			lines: [
				'11 FEB 1990 — Released after 27 years',
				'1994 — First Black president',
				'5 DEC 2013 — Died, aged 95',
			],
			top: 1150, rotate: 1.5,
		},
	},
	{
		clip: CLIP_CROWD, from: 23.56, to: 26.0,
		chip: '🤯 THOUSANDS REMEMBERED THE SAME THING', dir: 'out', zoom: 1.1,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_TYPING, from: 26.0, to: 29.76,
		name: 'SHE NAMED IT', sub: 'THE MANDELA EFFECT', subColor: RED,
		chip: '🌐 MANDELAEFFECT.COM', chipTop: 700,
		dir: 'in', zoom: 1.14, objectPosition: '50% 50%', filter: 'brightness(0.82)',
	},
	// Examples (29.76–51.31s)
	{
		clip: CLIP_MONOPOLY, from: 29.76, to: 34.72,
		name: 'THE MONOPOLY MAN', sub: 'MILLIONS PICTURE A MONOCLE', subColor: RED,
		dir: 'in', zoom: 1.14, objectPosition: '50% 50%', filter: 'brightness(0.82)',
	},
	{
		clip: CLIP_PIKACHU, from: 34.72, to: 40.16,
		chip: '🐭 PIKACHU’S TAIL — A BLACK TIP, RIGHT?', dir: 'in', zoom: 1.16,
		objectPosition: '50% 40%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_BOOK, from: 40.16, to: 45.72,
		chip: '📚 YOU REMEMBER “BERENSTEIN”', dir: 'in', zoom: 1.14,
		objectPosition: '50% 45%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_SPACE, from: 45.72, to: 51.31,
		chip: '🌌 DARTH VADER: “LUKE, I AM YOUR FATHER”', dir: 'in', zoom: 1.16,
		objectPosition: '50% 50%', filter: 'brightness(0.82)',
	},
	// Spread (51.31–58.49s)
	{
		clip: CLIP_PHONE, from: 51.31, to: 56.63,
		chip: '💥 2012 · ONE POST MADE IT EXPLODE', dir: 'panL', zoom: 1.14,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_CONFUSED, from: 56.63, to: 58.49,
		chip: '🤔 SO WHY THE SAME MISTAKE?', dir: 'in', zoom: 1.16,
		objectPosition: '50% 40%', filter: 'brightness(0.85)',
	},
	// Science (58.49–73.32s)
	{
		clip: CLIP_LAB, from: 58.49, to: 61.37,
		name: '2022 · CHICAGO', sub: 'SCIENTISTS TESTED IT', subColor: RED,
		dir: 'in', zoom: 1.16, objectPosition: '50% 50%', filter: 'brightness(0.88)',
		paperCard: {
			header: 'Study · 2022',
			lines: ['Univ. of Chicago —', 'Prasad & Bainbridge'],
			sub: 'Psychological Science, 33(12)',
			top: 1150, rotate: -1.5,
		},
	},
	{
		clip: CLIP_VOTE, from: 61.37, to: 64.63,
		chip: '🎯 THEY ALL PICKED THE SAME WRONG VERSION', dir: 'out', zoom: 1.18,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_BRAIN, from: 64.63, to: 69.57,
		name: 'YOUR BRAIN IS NOT A CAMERA', sub: 'IT REBUILDS MEMORIES', subColor: RED,
		dir: 'panL', zoom: 1.16, objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	{
		clip: CLIP_MONKEY, from: 69.57, to: 73.32,
		chip: '🧠 YOUR BRAIN ADDS THEM', dir: 'in', zoom: 1.18,
		objectPosition: '50% 50%', filter: 'brightness(0.85)',
	},
	// Twist (73.32–76.7s)
	{
		clip: CLIP_TWIST, from: 73.32, to: 76.7,
		name: 'YOUR MEMORIES FEEL REAL', sub: 'EVEN WHEN THEY ARE FALSE', subColor: RED,
		dir: 'in', zoom: 1.12, objectPosition: '50% 50%', filter: 'brightness(0.82)',
	},
];

// Meme VIDEO clips — WELL-KNOWN meme templates, each used EXACTLY ONCE (Axel's rule).
// Timed to the narrator's shock lines (memes sync with words). Large framed
// insets over the base clip, which keeps playing underneath.
// [clip, from, to, width, top] — `top` keeps the meme clear of the shot's Chip.
const MEMES: {clip: string; from: number; to: number; width?: number; top?: number}[] = [
	{clip: MEME_MINDBLOWN, from: 32.84, to: 34.72, width: 620, top: 620}, // S12 "He never had one. Not once." (name+sub shot, no chip)
	{clip: MEME_PIKACHU, from: 37.52, to: 40.16, width: 520, top: 400}, // S14 "Wrong. It has always been completely yellow." (chip shot)
	{clip: MEME_DICAPRIO, from: 43.34, to: 45.72, width: 520, top: 380}, // S16 "It has always been Berenstain, with an A." (chip shot)
	{clip: MEME_FINE, from: 48.2, to: 51.31, width: 560, top: 420}, // S18 "He never said it. The line is: No, I am your father." (chip shot)
	{clip: MEME_GALAXY, from: 66.0, to: 69.0, width: 680, top: 620}, // S24 "It rebuilds them, filling the gaps" — glowing brain (name+sub shot, no chip)
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const MandelaVideoEn: React.FC<MandelaVideoEnProps> = ({
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
			{/* Hook — 3 seconds, @our.planet.decoded style (moving shock clip) */}
			<Sequence from={0} durationInFrames={Math.round(3.36 * fps)} name="hook">
				<SceneHook durationInFrames={Math.round(3.36 * fps)} />
			</Sequence>

			{/* Video shots — HARD CUTS, no fades */}
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

			{/* Meme video clips (reaction memes, synced to shock lines) */}
			{MEMES.map((meme, i) => {
				const fromF = Math.round(meme.from * fps);
				const toF = Math.round(meme.to * fps);
				const len = toF - fromF;
				return (
					<Sequence key={`meme-${i}`} from={fromF} durationInFrames={len} name={`meme-${i}`}>
						<MemeClip clip={meme.clip} durationInFrames={len} width={meme.width} top={meme.top} />
					</Sequence>
				);
			})}

			{/* End card */}
			<Sequence from={Math.round(76.7 * fps)} durationInFrames={durationInFrames - Math.round(76.7 * fps)} name="endcard">
				<SceneEndCard durationInFrames={durationInFrames - Math.round(76.7 * fps)} />
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

			{/* Brand watermark — top-left, whole video (Axel's branding) */}
			<BrandWatermark />

			{/* Audio — voiceover ONLY, no background music (Axel adds it on TikTok) */}
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
