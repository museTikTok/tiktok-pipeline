import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {CaptionVideo, CaptionVideoProps} from './CaptionVideo';
import {MysteryVideo, MysteryVideoProps} from './MysteryVideo';
import {VintageAgloe, VintageAgloeProps} from './VintageAgloe';
import {ChinaVideo, ChinaVideoProps} from './ChinaVideo';
import {VoynichVideo, VoynichVideoProps} from './VoynichVideo';
import {DyatlovVideo, DyatlovVideoProps} from './DyatlovVideo';
import {DoggerlandVideo, DoggerlandVideoProps} from './DoggerlandVideo';
import {RoanokeVideo, RoanokeVideoProps} from './RoanokeVideo';
import {TanzplageVideo, TanzplageVideoProps} from './TanzplageVideo';
import {VerboteneOrteVideo, VerboteneOrteVideoProps} from './VerboteneOrteVideo';
import {VerboteneOrteVideoEn, VerboteneOrteVideoEnProps} from './VerboteneOrteVideoEn';
import {PsychologieVideo, PsychologieVideoProps} from './PsychologieVideo';
import {MandelaVideoEn, MandelaVideoEnProps} from './MandelaVideoEn';
import {LustigVideo} from './LustigVideo';
import {LustigVideoEn} from './LustigVideoEn';
import {RipperVideoEn} from './RipperVideoEn';
import {RipperVideoDe} from './RipperVideoDe';
import {TanzplageVideoEn} from './TanzplageVideoEn';
import {HashimaVideoEn} from './HashimaVideoEn';
import {HashimaVideoDe} from './HashimaVideoDe';
import {AntikytheraVideoEn} from './AntikytheraVideoEn';
import {AntikytheraVideoDe} from './AntikytheraVideoDe';
import {EasterIslandVideoEn} from './EasterIslandVideoEn';
import {TanzplageVideoDe} from './TanzplageVideoDe';

// Dynamic duration: voiceover end + 1.5s tail, so videos can exceed 30s
const calculateMetadata: CalculateMetadataFunction<CaptionVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateMysteryMetadata: CalculateMetadataFunction<MysteryVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateVintageMetadata: CalculateMetadataFunction<VintageAgloeProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateChinaMetadata: CalculateMetadataFunction<ChinaVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateVoynichMetadata: CalculateMetadataFunction<VoynichVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateDyatlovMetadata: CalculateMetadataFunction<DyatlovVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateDoggerlandMetadata: CalculateMetadataFunction<DoggerlandVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateRoanokeMetadata: CalculateMetadataFunction<RoanokeVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateTanzplageMetadata: CalculateMetadataFunction<TanzplageVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateVerboteneOrteMetadata: CalculateMetadataFunction<VerboteneOrteVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateVerboteneOrteEnMetadata: CalculateMetadataFunction<VerboteneOrteVideoEnProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculatePsychologieMetadata: CalculateMetadataFunction<PsychologieVideoProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

const calculateMandelaEnMetadata: CalculateMetadataFunction<MandelaVideoEnProps> = ({
	props,
}) => {
	const words = props.words ?? [];
	const lastEnd = words.length > 0 ? words[words.length - 1].end : 28.5;
	const durationInFrames = Math.ceil((lastEnd + 1.5) * 30);
	return {
		durationInFrames,
		props,
	};
};

// Lustig v2 is self-contained (words + VO are loaded inside the component);
// fixed duration 80.07s = 2402 frames (last word 78.56s + 1.5s tail).
const calculateLustigMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2402,
		props,
	};
};

const calculateLustigEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		// EN VO last word end 83.46s + 1.5s tail = 84.96s -> 2549 frames
		durationInFrames: 2549,
		props,
	};
};

// Ripper v4 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 84.78s = 2543 frames (last word 83.28s + 1.5s tail).
const calculateRipperEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2543,
		props,
	};
};

// Ripper v4 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 84.83s = 2545 frames (last word 83.33s + 1.5s tail).
// MAI_03 VO atempo 1.04 (orig 86.71s -> 83.38s) to fit the 70-85s target.
const calculateRipperDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2545,
		props,
	};
};

// Tanzplage v5 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 79.9s = 2397 frames (last word 78.36s + 1.5s tail).
const calculateTanzplageEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2397,
		props,
	};
};

// Tanzplage v5 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 80.8s = 2424 frames (last word 79.32s + 1.5s tail).
// Subtitles raised into the TikTok safe zone (bottom: 360).
const calculateTanzplageDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2424,
		props,
	};
};

// Hashima v6 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 82.66s = 2480 frames (last word 81.16s + 1.5s tail).
// Subtitles in the TikTok safe zone (bottom: 360), like the German Tanzplage.
const calculateHashimaEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2480,
		props,
	};
};

// Hashima v6 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 83.86s = 2516 frames (last word 82.36s + 1.5s tail).
// MAI_03 VO, subtitles in the TikTok safe zone (bottom: 360), like the German Tanzplage.
const calculateHashimaDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2516,
		props,
	};
};

// Antikythera v7 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 83.21s = 2496 frames (last word 81.36s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO, subtitles in the TikTok safe zone (bottom: 360).
const calculateAntikytheraEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2496,
		props,
	};
};

// Antikythera v7 DE is self-contained (words + VO+music mix are loaded inside the component);
// fixed duration 85.64s = 2569 frames (last word 84.14s + 1.5s tail).
// Kokoro dm_martin speed 1.3 VO + "In Essence (Slowed)" Ka$tro pre-mixed at -18 dB (Axel request,
// DE only), subtitles in the TikTok safe zone (bottom: 360).
const calculateAntikytheraDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2569,
		props,
	};
};

// Easter Island v8 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 68.47s = 2054 frames (last word 66.94s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO, subtitles in the TikTok safe zone (bottom: 360).
// Hook image provided by Axel (plan 1 + thumbnail).
const calculateEasterIslandEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2054,
		props,
	};
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="CaptionVideo"
				component={CaptionVideo as React.FC<unknown>}
				durationInFrames={900}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as CaptionVideoProps}
				calculateMetadata={calculateMetadata}
			/>
			<Composition
				id="MysteryVideo"
				component={MysteryVideo as React.FC<unknown>}
				durationInFrames={1050}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as MysteryVideoProps}
				calculateMetadata={calculateMysteryMetadata}
			/>
			<Composition
				id="VintageAgloe"
				component={VintageAgloe as React.FC<unknown>}
				durationInFrames={1110}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as VintageAgloeProps}
				calculateMetadata={calculateVintageMetadata}
			/>
			<Composition
				id="ChinaVideo"
				component={ChinaVideo as React.FC<unknown>}
				durationInFrames={1000}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as ChinaVideoProps}
				calculateMetadata={calculateChinaMetadata}
			/>
			<Composition
				id="VoynichVideo"
				component={VoynichVideo as React.FC<unknown>}
				durationInFrames={1100}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as VoynichVideoProps}
				calculateMetadata={calculateVoynichMetadata}
			/>
			<Composition
				id="DyatlovVideo"
				component={DyatlovVideo as React.FC<unknown>}
				durationInFrames={1050}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as DyatlovVideoProps}
				calculateMetadata={calculateDyatlovMetadata}
			/>
			<Composition
				id="DoggerlandVideo"
				component={DoggerlandVideo as React.FC<unknown>}
				durationInFrames={1170}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as DoggerlandVideoProps}
				calculateMetadata={calculateDoggerlandMetadata}
			/>
			<Composition
				id="RoanokeVideo"
				component={RoanokeVideo as React.FC<unknown>}
				durationInFrames={1240}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as RoanokeVideoProps}
				calculateMetadata={calculateRoanokeMetadata}
			/>
			<Composition
				id="TanzplageVideo"
				component={TanzplageVideo as React.FC<unknown>}
				durationInFrames={1122}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as TanzplageVideoProps}
				calculateMetadata={calculateTanzplageMetadata}
			/>
			<Composition
				id="VerboteneOrteVideo"
				component={VerboteneOrteVideo as React.FC<unknown>}
				durationInFrames={2315}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as VerboteneOrteVideoProps}
				calculateMetadata={calculateVerboteneOrteMetadata}
			/>
			<Composition
				id="VerboteneOrteVideoEn"
				component={VerboteneOrteVideoEn as React.FC<unknown>}
				durationInFrames={2400}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as VerboteneOrteVideoEnProps}
				calculateMetadata={calculateVerboteneOrteEnMetadata}
			/>
			<Composition
				id="PsychologieVideo"
				component={PsychologieVideo as React.FC<unknown>}
				durationInFrames={2433}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as PsychologieVideoProps}
				calculateMetadata={calculatePsychologieMetadata}
			/>
			<Composition
				id="MandelaVideoEn"
				component={MandelaVideoEn as React.FC<unknown>}
				durationInFrames={2463}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{} as MandelaVideoEnProps}
				calculateMetadata={calculateMandelaEnMetadata}
			/>
			<Composition
				id="LustigVideo"
				component={LustigVideo as React.FC<unknown>}
				durationInFrames={2402}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateLustigMetadata}
			/>
			<Composition
				id="LustigVideoEn"
				component={LustigVideoEn as React.FC<unknown>}
				durationInFrames={2549}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateLustigEnMetadata}
			/>
			<Composition
				id="RipperVideoEn"
				component={RipperVideoEn as React.FC<unknown>}
				durationInFrames={2543}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateRipperEnMetadata}
			/>
			<Composition
				id="RipperVideoDe"
				component={RipperVideoDe as React.FC<unknown>}
				durationInFrames={2545}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateRipperDeMetadata}
			/>
			<Composition
				id="TanzplageVideoEn"
				component={TanzplageVideoEn as React.FC<unknown>}
				durationInFrames={2397}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateTanzplageEnMetadata}
			/>
			<Composition
				id="TanzplageVideoDe"
				component={TanzplageVideoDe as React.FC<unknown>}
				durationInFrames={2424}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateTanzplageDeMetadata}
			/>
			<Composition
				id="HashimaVideoEn"
				component={HashimaVideoEn as React.FC<unknown>}
				durationInFrames={2480}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateHashimaEnMetadata}
			/>
			<Composition
				id="HashimaVideoDe"
				component={HashimaVideoDe as React.FC<unknown>}
				durationInFrames={2516}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateHashimaDeMetadata}
			/>
			<Composition
				id="AntikytheraVideoEn"
				component={AntikytheraVideoEn as React.FC<unknown>}
				durationInFrames={2496}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateAntikytheraEnMetadata}
			/>
			<Composition
				id="AntikytheraVideoDe"
				component={AntikytheraVideoDe as React.FC<unknown>}
				durationInFrames={2569}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateAntikytheraDeMetadata}
			/>
			<Composition
				id="EasterIslandVideoEn"
				component={EasterIslandVideoEn as React.FC<unknown>}
				durationInFrames={2054}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateEasterIslandEnMetadata}
			/>
		</>
	);
};
