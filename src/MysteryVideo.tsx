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

export type MysteryMarker = {
	x: number; // percent 0-100
	y: number; // percent 0-100
	label: string;
};

export type AnimArrow = {
	x1: number; // percent 0-100
	y1: number;
	x2: number;
	y2: number;
	color?: string;
	label?: string;
};

export type ShipAnim = {
	x1: number; // percent 0-100 start
	y1: number;
	x2: number; // percent 0-100 end
	y2: number;
};

export type MysteryScene = {
	img: string; // filename in public/
	marker?: MysteryMarker;
	rings?: boolean; // expanding sonar rings from marker
	tag?: string; // top label e.g. "1997 • SÜDPAZIFIK"
	tagSub?: string;
	// --- dynamic animation overlays (Sandy Island and beyond) ---
	arrows?: AnimArrow[]; // SVG arrows that draw themselves
	ship?: ShipAnim; // traveling dot with wake trail
	gaugeDepth?: number; // animated depth gauge, fills to this many meters
	bigX?: boolean; // big red X drawing over the scene ("never existed")
	stamps?: string[]; // rubber-stamp texts popping in sequence
	gmaps?: boolean; // fake Google Maps UI overlay (search bar + pin)
	zoomStyle?: 'in' | 'out' | 'panL' | 'panR' | 'fastIn';
	weight?: number; // relative scene duration weight
	darkFilter?: number; // 0-1 extra darkening of the image (for light maps)
};

export type MysteryVideoProps = {
	words: Word[];
	scenes: MysteryScene[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const FONT_FAMILY = '"Titan One", sans-serif';

// Pulsing location marker with expanding sonar rings (AkteErde signature)
const MapMarker: React.FC<{marker: MysteryMarker; rings: boolean}> = ({
	marker,
	rings,
}) => {
	const frame = useCurrentFrame();
	// Smooth pulse via sine — deterministic, no stutter
	const pulse = 1 + 0.18 * Math.sin((frame / 30) * Math.PI * 2 * 1.2);
	return (
		<div
			style={{
				position: 'absolute',
				left: `${marker.x}%`,
				top: `${marker.y}%`,
				transform: 'translate(-50%, -50%)',
				zIndex: 5,
			}}
		>
			{rings &&
				[0, 1, 2].map((i) => {
					const local = (frame + i * 20) % 60;
					const rScale = interpolate(local, [0, 60], [0.6, 3.2]);
					const rOpacity = interpolate(local, [0, 60], [0.85, 0]);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								width: 90,
								height: 90,
								border: '5px solid #FF3B30',
								borderRadius: '50%',
								transform: `translate(-50%, -50%) scale(${rScale})`,
								opacity: rOpacity,
							}}
						/>
					);
				})}
			{/* Marker dot */}
			<div
				style={{
					width: 44 * pulse,
					height: 44 * pulse,
					backgroundColor: '#FF3B30',
					borderRadius: '50%',
					border: '6px solid white',
					boxShadow: '0 0 30px rgba(255,59,48,0.9)',
					position: 'relative',
					zIndex: 2,
				}}
			/>
			{/* Label */}
			<div
				style={{
					position: 'absolute',
					top: 56,
					left: '50%',
					transform: 'translateX(-50%)',
					whiteSpace: 'nowrap',
					fontFamily: FONT_FAMILY,
					fontSize: 40,
					color: 'white',
					backgroundColor: 'rgba(180,20,20,0.92)',
					padding: '10px 26px',
					borderRadius: 14,
					border: '3px solid white',
					textShadow: '2px 2px 0 #000',
					zIndex: 3,
				}}
			>
				{marker.label}
			</div>
		</div>
	);
};

// --- DYNAMIC OVERLAYS (retention: something always moves) ---

// SVG arrow that draws itself across the scene
const DrawArrow: React.FC<{arrow: AnimArrow; durationInFrames: number; delay?: number}> = ({
	arrow,
	durationInFrames,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const local = Math.max(0, frame - delay);
	// Draw over middle 60% of the scene, then hold
	const drawEnd = durationInFrames * 0.6;
	const t = interpolate(local, [0, drawEnd], [0, 1], {extrapolateRight: 'clamp'});
	const W = 1080;
	const H = 1920;
	const x1 = (arrow.x1 / 100) * W;
	const y1 = (arrow.y1 / 100) * H;
	const x2 = (arrow.x2 / 100) * W;
	const y2 = (arrow.y2 / 100) * H;
	const len = Math.hypot(x2 - x1, y2 - y1);
	const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
	const color = arrow.color ?? '#FF3B30';
	if (t <= 0) return null;
	return (
		<svg
			style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5}}
			viewBox={`0 0 ${W} ${H}`}
		>
			<g opacity={interpolate(local, [0, 8], [0, 1], {extrapolateRight: 'clamp'})}>
				<line
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					stroke={color}
					strokeWidth={14}
					strokeLinecap="round"
					strokeDasharray={len}
					strokeDashoffset={len * (1 - t)}
				/>
				{/* arrowhead */}
				<g
					transform={`translate(${x2},${y2}) rotate(${ang})`}
					opacity={t > 0.92 ? interpolate(t, [0.92, 1], [0, 1]) : 0}
				>
					<polygon points="0,-26 44,0 0,26" fill={color} />
				</g>
			</g>
			{arrow.label && t > 0.5 && (
				<text
					x={(x1 + x2) / 2}
					y={(y1 + y2) / 2 - 34}
					textAnchor="middle"
					fill="white"
					fontSize={38}
					fontFamily={FONT_FAMILY}
					stroke="black"
					strokeWidth={8}
					paintOrder="stroke"
					opacity={interpolate(t, [0.5, 0.7], [0, 1])}
				>
					{arrow.label}
				</text>
			)}
		</svg>
	);
};

// Traveling ship dot with wake trail (expedition scene)
const ShipTravel: React.FC<{ship: ShipAnim; durationInFrames: number}> = ({
	ship,
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	// Travel during first 70%, then pulse at destination
	const travelEnd = durationInFrames * 0.7;
	const t = interpolate(frame, [0, travelEnd], [0, 1], {extrapolateRight: 'clamp'});
	const W = 1080;
	const H = 1920;
	const x = ((ship.x1 + (ship.x2 - ship.x1) * t) / 100) * W;
	const y = ((ship.y1 + (ship.y2 - ship.y1) * t) / 100) * H;
	const x1 = (ship.x1 / 100) * W;
	const y1 = (ship.y1 / 100) * H;
	const x2 = (ship.x2 / 100) * W;
	const y2 = (ship.y2 / 100) * H;
	const len = Math.hypot(x2 - x1, y2 - y1);
	const arrivedPulse = 1 + (frame > travelEnd ? 0.15 * Math.sin(((frame - travelEnd) / 30) * Math.PI * 2 * 2) : 0);
	return (
		<svg
			style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5}}
			viewBox={`0 0 ${W} ${H}`}
		>
			{/* traveled trail */}
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke="#FFD500"
				strokeWidth={8}
				strokeLinecap="round"
				strokeDasharray={len}
				strokeDashoffset={len * (1 - t)}
				opacity={0.85}
			/>
			{/* ship dot */}
			<g transform={`translate(${x},${y}) scale(${arrivedPulse})`}>
				<circle r={26} fill="#FFD500" stroke="black" strokeWidth={6} />
				<circle r={26} fill="none" stroke="#FFD500" strokeWidth={4} opacity={0.5}>
					<animate attributeName="r" values="26;44" dur="1.2s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.5;0" dur="1.2s" repeatCount="indefinite" />
				</circle>
			</g>
		</svg>
	);
};

// Animated depth gauge (fills to target meters with live counter)
const DepthGauge: React.FC<{depth: number; durationInFrames: number}> = ({
	depth,
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, durationInFrames * 0.75], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const current = Math.round(depth * t);
	const barH = 900;
	return (
		<div
			style={{
				position: 'absolute',
				right: 90,
				top: '50%',
				transform: 'translateY(-50%)',
				zIndex: 6,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					fontFamily: FONT_FAMILY,
					fontSize: 54,
					color: '#FFD500',
					textShadow: '3px 3px 0 #000',
					marginBottom: 16,
					backgroundColor: 'rgba(0,0,0,0.72)',
					padding: '10px 24px',
					borderRadius: 12,
					border: '3px solid #FFD500',
				}}
			>
				{current.toLocaleString('de-DE')} m
			</div>
			<div
				style={{
					width: 70,
					height: barH,
					backgroundColor: 'rgba(0,0,0,0.6)',
					borderRadius: 35,
					border: '4px solid rgba(255,255,255,0.7)',
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: `${t * 100}%`,
						background: 'linear-gradient(to top, #1E90FF, #00BFFF)',
					}}
				/>
			</div>
			<div
				style={{
					fontFamily: FONT_FAMILY,
					fontSize: 34,
					color: 'white',
					textShadow: '2px 2px 0 #000',
					marginTop: 12,
				}}
			>
				TIEFE
			</div>
		</div>
	);
};

// Big red X drawing itself ("never existed")
const BigX: React.FC<{durationInFrames: number; delay?: number}> = ({
	durationInFrames,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const local = Math.max(0, frame - delay);
	const drawFrames = Math.min(24, durationInFrames * 0.3);
	const t1 = interpolate(local, [0, drawFrames], [0, 1], {extrapolateRight: 'clamp'});
	const t2 = interpolate(local, [drawFrames * 0.6, drawFrames * 1.6], [0, 1], {
		extrapolateRight: 'clamp',
	});
	if (local <= 0) return null;
	const cx = 540;
	const cy = 760;
	const r = 200;
	const W = 1080;
	const H = 1920;
	const segLen = Math.hypot(2 * r, 2 * r);
	return (
		<svg
			style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 7}}
			viewBox={`0 0 ${W} ${H}`}
		>
			<line
				x1={cx - r}
				y1={cy - r}
				x2={cx + r}
				y2={cy + r}
				stroke="#FF3B30"
				strokeWidth={46}
				strokeLinecap="round"
				strokeDasharray={segLen}
				strokeDashoffset={segLen * (1 - t1)}
			/>
			<line
				x1={cx + r}
				y1={cy - r}
				x2={cx - r}
				y2={cy + r}
				stroke="#FF3B30"
				strokeWidth={46}
				strokeLinecap="round"
				strokeDasharray={segLen}
				strokeDashoffset={segLen * (1 - t2)}
			/>
		</svg>
	);
};

// Rubber stamps popping in sequence (copy-paste metaphor)
const StampPops: React.FC<{stamps: string[]; durationInFrames: number}> = ({
	stamps,
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	const slots = [
		{top: '22%', left: '12%', rotate: -12},
		{top: '42%', left: '52%', rotate: 8},
		{top: '62%', left: '18%', rotate: -6},
		{top: '30%', left: '58%', rotate: 12},
	];
	return (
		<>
			{stamps.map((text, i) => {
				const start = (i / stamps.length) * durationInFrames * 0.7;
				const age = frame - start;
				if (age < 0) return null;
				// springy pop: overshoot then settle
				const pop = interpolate(age, [0, 6, 12], [0.3, 1.25, 1], {
					extrapolateRight: 'clamp',
				});
				const op = interpolate(age, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
				const slot = slots[i % slots.length];
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: slot.top,
							left: slot.left,
							zIndex: 6,
							opacity: op,
							transform: `rotate(${slot.rotate}deg) scale(${pop})`,
						}}
					>
						<div
							style={{
								fontFamily: FONT_FAMILY,
								fontSize: 44,
								color: '#FF3B30',
								border: '6px solid #FF3B30',
								borderRadius: 12,
								padding: '12px 26px',
								backgroundColor: 'rgba(255,255,255,0.88)',
								letterSpacing: 2,
								whiteSpace: 'nowrap',
							}}
						>
							{text}
						</div>
					</div>
				);
			})}
		</>
	);
};

// Fake Google Maps UI overlay
const GmapsUI: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const barIn = interpolate(frame, [0, 14], [-140, 0], {extrapolateRight: 'clamp'});
	const pinScale = interpolate(frame, [10, 18, 24], [0, 1.3, 1], {
		extrapolateRight: 'clamp',
	});
	return (
		<>
			{/* search bar */}
			<div
				style={{
					position: 'absolute',
					top: 100 + barIn,
					left: 60,
					right: 60,
					zIndex: 8,
				}}
			>
				<div
					style={{
						backgroundColor: 'white',
						borderRadius: 40,
						padding: '22px 40px',
						display: 'flex',
						alignItems: 'center',
						boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
					}}
				>
					<div style={{fontSize: 44, marginRight: 20}}>🔍</div>
					<div style={{fontFamily: FONT_FAMILY, fontSize: 40, color: '#333'}}>
						Sandy Island
					</div>
				</div>
			</div>
			{/* black polygon = the phantom island as drawn on Google Maps */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '52%',
					transform: 'translate(-50%, -50%)',
					zIndex: 5,
				}}
			>
				<div
					style={{
						width: 210 * pinScale,
						height: 150 * pinScale,
						backgroundColor: '#111',
						borderRadius: '38% 62% 55% 45% / 50% 40% 60% 50%',
						border: '5px solid #FF3B30',
						opacity: 0.92,
					}}
				/>
			</div>
			{/* red pin */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '38%',
					transform: `translate(-50%, -100%) scale(${pinScale})`,
					zIndex: 9,
					fontSize: 110,
					filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))',
				}}
			>
				📍
			</div>
		</>
	);
};

// One scene: still image, slow Ken Burns zoom, dark mystery grade, overlays
const MysterySceneView: React.FC<{
	scene: MysteryScene;
	durationInFrames: number;
}> = ({scene, durationInFrames}) => {
	// NOTE: useCurrentFrame() is relative to the parent <Sequence>, so `frame`
	// is already 0-based within this scene. Do NOT subtract `from` again.
	const frame = useCurrentFrame();
	const progress = Math.min(Math.max(frame / durationInFrames, 0), 1);
	// Varied camera moves per scene (retention: never the same motion twice)
	let scale: number;
	let panX: number;
	switch (scene.zoomStyle ?? 'in') {
		case 'out':
			scale = interpolate(progress, [0, 1], [1.28, 1.02]);
			panX = interpolate(progress, [0, 1], [14, -14]);
			break;
		case 'panL':
			scale = 1.18;
			panX = interpolate(progress, [0, 1], [70, -70]);
			break;
		case 'panR':
			scale = 1.18;
			panX = interpolate(progress, [0, 1], [-70, 70]);
			break;
		case 'fastIn':
			scale = interpolate(progress, [0, 1], [1.0, 1.38]);
			panX = interpolate(progress, [0, 1], [-10, 26]);
			break;
		default:
			scale = interpolate(progress, [0, 1], [1.0, 1.24]);
			panX = interpolate(progress, [0, 1], [-18, 18]);
			break;
	}
	const tagOpacity = interpolate(frame, [0, 12], [0, 1], {
		extrapolateRight: 'clamp',
	});
	return (
		<div style={{width: '100%', height: '100%', overflow: 'hidden', position: 'relative'}}>
			<Img
				src={staticFile(scene.img)}
				style={{
					width: '112%',
					height: '112%',
					objectFit: 'cover',
					transform: `scale(${scale}) translateX(${panX}px)`,
					marginLeft: '-6%',
					marginTop: '-6%',
					filter: scene.darkFilter ? `brightness(${1 - scene.darkFilter * 0.55}) saturate(0.85)` : undefined,
				}}
			/>
			{/* Dark mystery grade */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
			{scene.marker && (
				<MapMarker marker={scene.marker} rings={scene.rings ?? false} />
			)}
			{scene.bigX && <BigX durationInFrames={durationInFrames} delay={Math.round(durationInFrames * 0.45)} />}
			{scene.arrows?.map((a, i) => (
				<DrawArrow key={i} arrow={a} durationInFrames={durationInFrames} delay={i * 12} />
			))}
			{scene.ship && <ShipTravel ship={scene.ship} durationInFrames={durationInFrames} />}
			{scene.gaugeDepth && <DepthGauge depth={scene.gaugeDepth} durationInFrames={durationInFrames} />}
			{scene.stamps && <StampPops stamps={scene.stamps} durationInFrames={durationInFrames} />}
			{scene.gmaps && <GmapsUI durationInFrames={durationInFrames} />}
			{scene.tag && (
				<div
					style={{
						position: 'absolute',
						top: 120,
						left: 0,
						right: 0,
						textAlign: 'center',
						opacity: tagOpacity,
						zIndex: 6,
					}}
				>
					<div
						style={{
							display: 'inline-block',
							fontFamily: FONT_FAMILY,
							fontSize: 52,
							color: '#FFD500',
							backgroundColor: 'rgba(0,0,0,0.72)',
							padding: '14px 34px',
							borderRadius: 16,
							border: '3px solid #FFD500',
							textShadow: '3px 3px 0 #000',
							letterSpacing: 2,
						}}
					>
						{scene.tag}
					</div>
					{scene.tagSub && (
						<div
							style={{
								marginTop: 12,
								display: 'inline-block',
								fontFamily: FONT_FAMILY,
								fontSize: 36,
								color: 'white',
								backgroundColor: 'rgba(0,0,0,0.72)',
								padding: '10px 26px',
								borderRadius: 12,
								textShadow: '2px 2px 0 #000',
							}}
						>
							{scene.tagSub}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const MysteryVideo: React.FC<MysteryVideoProps> = ({
	words,
	scenes,
	voiceover,
	music,
	musicVolume = 0.12,
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

	const sceneCount = scenes.length;
	// Weighted scene durations: each scene can specify `weight` (default 1);
	// frames are distributed proportionally so visuals sync with narration beats.
	const totalWeight = scenes.reduce((s, sc) => s + (sc.weight ?? 1), 0);
	let acc = 0;
	const sceneRanges = scenes.map((sc) => {
		const w = sc.weight ?? 1;
		const from = Math.round((acc / totalWeight) * durationInFrames);
		acc += w;
		const to = Math.round((acc / totalWeight) * durationInFrames);
		return {from, len: to - from};
	});

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{scenes.map((scene, i) => (
				<Sequence
					key={i}
					from={sceneRanges[i].from}
					durationInFrames={sceneRanges[i].len}
					name={`scene-${i}`}
				>
					<MysterySceneView
						scene={scene}
						durationInFrames={sceneRanges[i].len}
					/>
				</Sequence>
			))}

			{/* Cinematic vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
				}}
			/>

			{/* Karaoke captions, lower third */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 320,
				}}
			>
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
