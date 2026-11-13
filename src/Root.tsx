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
import {EasterIslandVideoDe} from './EasterIslandVideoDe';
import {ZodiacVideoEn} from './ZodiacVideoEn';
import {ZodiacVideoDe} from './ZodiacVideoDe';
import {MontPeleeVideoEn} from './MontPeleeVideoEn';
import {MontPeleeVideoDe} from './MontPeleeVideoDe';
import {YamaguchiVideoEn} from './YamaguchiVideoEn';
import {YamaguchiVideoDe} from './YamaguchiVideoDe';
import {CrimeWatchVideoEn} from './CrimeWatchVideoEn';
import {TsunamiVideoEn} from './TsunamiVideoEn';
import {TsunamiVideoDe} from './TsunamiVideoDe';
import {TickleVideoEn} from './TickleVideoEn';
import {EarthStopsVideoEn} from './EarthStopsVideoEn';
import {EarthStopsVideoDe} from './EarthStopsVideoDe';
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

// Easter Island v8 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 63.76s = 1913 frames (last word 62.26s + 1.5s tail).
// Kokoro dm_martin speed 1.35 VO, German subtitles fontSize 50 / maxWidth 840
// (long-word rule), safe zone (bottom: 360). Hook image rebuilt in German
// (v8-hook-de.jpg: 'WIE WURDEN SIE GEBAUT... UND WARUM?').
const calculateEasterIslandDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1913,
		props,
	};
};

// Zodiac v9 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 69.96s = 2099 frames (last word 68.46s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO, subtitles in the TikTok safe zone (bottom: 360).
// Hook: the real Z340 cipher card + enlarged hook phrase (plan 1 + thumbnail).
const calculateZodiacEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2099,
		props,
	};
};

// Zodiac v9 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 61.98s = 1859 frames (last word 60.48s + 1.5s tail).
// Kokoro dm_martin speed 1.35 VO, German subtitles fontSize 50 / maxWidth 840
// (long-word rule: "dreihundertvierzig" = 523 px at size 50, limit 840).
const calculateZodiacDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1859,
		props,
	};
};

// Mont Pelée v10 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 67.96s = 2039 frames (last word 66.46s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO, subtitles in the TikTok safe zone (bottom: 360).
// Hook: the real eruption column of 16 July 1902 + enlarged hook phrase (plan 1 + thumbnail).
const calculateMontPeleeEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2039,
		props,
	};
};

// Mont Pelée v10 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 70.66s = 2120 frames (last word 69.16s + 1.5s tail).
// Kokoro dm_martin speed 1.15 VO (1.35 gave only 52.6s — too short, rushed),
// German subtitles fontSize 50 / maxWidth 840
// (long-word rule: "Dreißigtausend" = 432 px at size 50, limit 840).
const calculateMontPeleeDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2120,
		props,
	};
};

// Crime Watch Karim v12 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 69.86s = 2096 frames (last word 68.36s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO (68.64s), subtitles in the TikTok safe zone (bottom: 360).
// Hook: the real police mugshot of Daniel Karim + enlarged hook phrase (plan 1 + thumbnail).
// EN ONLY (Axel decision 2026-11-12, no DE version).
// Dynamic transitions + animation (Axel 2026-11-12): varied shot entrances
// (slide/zoom/fade, not just hard cuts), Ken Burns zooms, floating paper cards,
// motivated chips/circles/arrows, visual change every 3-5 s.
const calculateCrimeWatchEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2096,
		props,
	};
};

// Tsunami 2004 v13 EN is self-contained (phrases + VO are loaded inside the
// component); fixed duration 65.72s = 1972 frames (last word 64.22s + 1.5s tail, hook v2).
// GRAVE subject — @cursednature1 system (see studies in
// ~/workspace/tiktok/reference-videos/study-cursednature1-*.md): hook = real
// shocking archive footage from t=0 + white flash, punch-out at ~3.2s, 1 sentence
// = 1 shot cut on the VO pause, 2 giant overlays ("9.1", "227,898"), archive
// audio under the VO, bookend on the hook footage.
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// NOT Titan One yellow karaoke); NO branding on the hook (handle from 3 s);
// Kokoro bm_george speed 1.0 (solemn); mix ~-20/-21 dB.
const calculateTsunamiEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1972,
		props,
	};
};

// Tsunami 2004 v13 DE is self-contained (phrases + VO are loaded inside the
// component); fixed duration 68.00s = 2040 frames (last word 66.50s + 1.5s tail, hook v2).
// Same @cursednature1 system as the EN version. White bold phrase subtitles
// 56px (German words are longer — longest phrase verified on rendered frames);
// overlays "9,1" and "227.898". Kokoro dm_martin speed 1.0.
const calculateTsunamiDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2040,
		props,
	};
};

// Yamaguchi v11 EN is self-contained (words + VO are loaded inside the component);
// fixed duration 67.04s = 2011 frames (last word 65.54s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO, subtitles in the TikTok safe zone (bottom: 360).
// Hook: the real Nagasaki mushroom cloud (Lt. Charles Levy, 9 Aug 1945) + enlarged hook phrase (plan 1 + thumbnail).
const calculateYamaguchiEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2011,
		props,
	};
};

// Yamaguchi v11 DE is self-contained (words + VO are loaded inside the component);
// fixed duration 65.62s = 1969 frames (last word 64.12s + 1.5s tail).
// Kokoro dm_martin speed 1.15 VO (no deviation needed — 64.50s VO lands in range),
// German subtitles fontSize 50 / maxWidth 840
// (long-word rule: "Doppelüberlebenden" = 562 px at size 50, limit 840).
const calculateYamaguchiDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1969,
		props,
	};
};

// Tickle test (format test "Did you know", EN only, NOT video 11) is
// self-contained (words + VO are loaded inside the component);
// fixed duration 50.80s = 1524 frames (last word 49.30s + 1.5s tail).
// Kokoro bm_george speed 1.0 VO (1.15 ran 44.77s = 214 wpm, rushed;
// 1.0 gives 49.42s = ~195 wpm). Pure 2D/2.5D animation, no clips.
const calculateTickleEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1524,
		props,
	};
};

// EarthStopsVideoEn — "Did you know" format test #2 (Axel 2026-11-11).
// Self-contained (words + VO+music mix are loaded inside the component);
// fixed duration 76.74s = 2303 frames (last word 75.24s + 1.5s tail).
// Kokoro bm_george speed 1.15 VO (1.0 ran 89.0s = ~155 wpm, too slow;
// 1.15 gives 75.44s = ~169 wpm). Clip-based, 13 shots, music under the VO.
const calculateEarthStopsEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2303,
		props,
	};
};

// EarthStopsVideoDe — "Did you know" format test #2, VERSION ALLEMANDE (Axel 2026-11-11).
// Same visuals as the EN v2 (same clips, same corrected hook, same music), German
// voice + subtitles + on-screen text. Fixed duration 81.7s = 2451 frames
// (last word 80.20s + 1.5s tail). Kokoro dm_martin speed 1.15 VO (1.35 ran
// 61.9s = ~230 wpm, too fast; 1.15 gives 80.58s = ~176 wpm, natural band).
const calculateEarthStopsDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2451,
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
			<Composition
				id="EasterIslandVideoDe"
				component={EasterIslandVideoDe as React.FC<unknown>}
				durationInFrames={1913}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateEasterIslandDeMetadata}
			/>
			<Composition
				id="ZodiacVideoEn"
				component={ZodiacVideoEn as React.FC<unknown>}
				durationInFrames={2099}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateZodiacEnMetadata}
			/>
			<Composition
				id="ZodiacVideoDe"
				component={ZodiacVideoDe as React.FC<unknown>}
				durationInFrames={1859}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateZodiacDeMetadata}
			/>
			<Composition
				id="MontPeleeVideoEn"
				component={MontPeleeVideoEn as React.FC<unknown>}
				durationInFrames={2039}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateMontPeleeEnMetadata}
			/>
			<Composition
				id="MontPeleeVideoDe"
				component={MontPeleeVideoDe as React.FC<unknown>}
				durationInFrames={2120}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateMontPeleeDeMetadata}
			/>
			<Composition
				id="YamaguchiVideoEn"
				component={YamaguchiVideoEn as React.FC<unknown>}
				durationInFrames={2011}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateYamaguchiEnMetadata}
			/>
			<Composition
				id="YamaguchiVideoDe"
				component={YamaguchiVideoDe as React.FC<unknown>}
				durationInFrames={1969}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateYamaguchiDeMetadata}
			/>
			<Composition
				id="CrimeWatchVideoEn"
				component={CrimeWatchVideoEn as React.FC<unknown>}
				durationInFrames={2096}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateCrimeWatchEnMetadata}
			/>
			<Composition
				id="TsunamiVideoEn"
				component={TsunamiVideoEn as React.FC<unknown>}
				durationInFrames={1972}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateTsunamiEnMetadata}
			/>
			<Composition
				id="TsunamiVideoDe"
				component={TsunamiVideoDe as React.FC<unknown>}
				durationInFrames={2040}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateTsunamiDeMetadata}
			/>
			<Composition
				id="TickleVideoEn"
				component={TickleVideoEn as React.FC<unknown>}
				durationInFrames={1524}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateTickleEnMetadata}
			/>
			<Composition
				id="EarthStopsVideoEn"
				component={EarthStopsVideoEn as React.FC<unknown>}
				durationInFrames={2303}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateEarthStopsEnMetadata}
			/>
			<Composition
				id="EarthStopsVideoDe"
				component={EarthStopsVideoDe as React.FC<unknown>}
				durationInFrames={2451}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateEarthStopsDeMetadata}
			/>
		</>
	);
};
