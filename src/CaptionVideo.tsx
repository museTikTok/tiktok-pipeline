import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Video,
} from 'remotion';

export type Word = {word: string; start: number; end: number};

export type SfxCue = {
	src: string; // filename in public/
	start: number; // seconds
	volume?: number;
};

export type CaptionVideoProps = {
	words: Word[];
	clips: string[]; // filenames in public/
	voiceover: string; // filename in public/
	music?: string; // filename in public/
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const FONT_FAMILY = '"Titan One", "Gas", sans-serif';

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const KaraokeLine: React.FC<{line: Word[]; time: number; lineAge: number}> = ({
	line,
	time,
	lineAge,
}) => {
	// Entrance: quick pop-in on the first 8 frames of the line
	const enterScale = interpolate(lineAge, [0, 8], [0.92, 1], {
		extrapolateRight: 'clamp',
	});
	const enterOpacity = interpolate(lineAge, [0, 6], [0, 1], {
		extrapolateRight: 'clamp',
	});
	return (
		<div
			style={{
				fontFamily: FONT_FAMILY,
				fontSize: 84,
				fontWeight: 900,
				textAlign: 'center',
				lineHeight: 1.25,
				padding: '0 60px',
				transform: `scale(${enterScale})`,
				opacity: enterOpacity,
				// CapCut-style: thick black stroke via text-shadow
				textShadow:
					'-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, -4px 0 0 #000, 4px 0 0 #000, 0 -4px 0 #000, 0 4px 0 #000',
			}}
		>
			{line.map((w, i) => {
				const active = time >= w.start && time < w.end;
				const spoken = time >= w.end;
				return (
					<span
						key={i}
						style={{
							color: active ? '#FFD500' : '#FFFFFF',
							opacity: spoken || active ? 1 : 0.92,
							transform: active ? 'scale(1.08)' : 'scale(1)',
							display: 'inline-block',
							transition: 'transform 0.08s',
						}}
					>
						{w.word}
						{'\u00A0'}
					</span>
				);
			})}
		</div>
	);
};

// Clip with slow Ken Burns zoom for a cinematic, professional feel
const ZoomClip: React.FC<{src: string; from?: number; durationInFrames: number}> = ({
	src,
	durationInFrames,
}) => {
	// NOTE: useCurrentFrame() is RELATIVE to the parent <Sequence>, so `frame`
	// already goes 0..durationInFrames. Do NOT subtract a global offset here —
	// doing so froze the zoom on every clip after the first (bug found 2026-11-02).
	const frame = useCurrentFrame();
	const progress = Math.min(Math.max(frame / durationInFrames, 0), 1);
	const scale = interpolate(progress, [0, 1], [1.0, 1.1]);
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			}}
		>
			<Video
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale})`,
				}}
			/>
		</div>
	);
};

export const CaptionVideo: React.FC<CaptionVideoProps> = ({
	words,
	clips,
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

	// Which line is currently being spoken + how long it has been on screen
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

	// Distribute clips evenly across the duration
	const clipCount = clips.length;
	const framesPerClip = Math.ceil(durationInFrames / clipCount);

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{/* Background clips with Ken Burns zoom */}
			{clips.map((clip, i) => (
				<Sequence
					key={i}
					from={i * framesPerClip}
					durationInFrames={framesPerClip}
					name={`clip-${i}`}
				>
					<ZoomClip
						src={clip}
						durationInFrames={framesPerClip}
					/>
				</Sequence>
			))}

			{/* Cinematic vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
				}}
			/>

			{/* Slight dark gradient for caption readability */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)',
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

			{/* Audio: voiceover + music bed + timed SFX */}
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
