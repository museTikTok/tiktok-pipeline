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
import {HardingVideoEn} from './HardingVideoEn';
import {TsunamiVideoEn} from './TsunamiVideoEn';
import {TsunamiVideoDe} from './TsunamiVideoDe';
import {PompeiiVideoEn} from './PompeiiVideoEn';
import {PompeiiVideoDe} from './PompeiiVideoDe';
import {TickleVideoEn} from './TickleVideoEn';
import {EarthStopsVideoEn} from './EarthStopsVideoEn';
import {EarthStopsVideoDe} from './EarthStopsVideoDe';
import {TanzplageVideoDe} from './TanzplageVideoDe';
import {Gta6EditEn} from './Gta6EditEn';
import {Gta6Script9En} from './Gta6Script9En';
import {Gta6ExtendedLookEn} from './Gta6ExtendedLookEn';
import {BoxJellyfishVideoEn} from './BoxJellyfishVideoEn';
import {BoxJellyfishVideoDe} from './BoxJellyfishVideoDe';
import {SmogVideoEn} from './SmogVideoEn';
import {SmogVideoDe} from './SmogVideoDe';
import {MaltaVideoEn} from './MaltaVideoEn';
import {MaltaVideoDe} from './MaltaVideoDe';
import {MothmanVideoEn} from './MothmanVideoEn';
import {HessdalenVideoEn} from './HessdalenVideoEn';
import {Gta6PcVideoEn} from './Gta6PcVideoEn';
import {Gta6WweMemeEn} from './Gta6WweMemeEn';
import {Gta6Script2En} from './Gta6Script2En';
import {Gta5LastRideEn} from './Gta5LastRideEn';
import {Gta6FirstLookEn} from './Gta6FirstLookEn';
import {Gta6GlitchesEn} from './Gta6GlitchesEn';
import {Gta6GlitchesPart2En} from './Gta6GlitchesPart2En';
import {Gta6PcRumorsEn} from './Gta6PcRumorsEn';
import {Gta6Top5WtfEn} from './Gta6Top5WtfEn';
import {Gta6Top5WtfV3En} from './Gta6Top5WtfV3En';
import {Gta6Top5WtfV7En} from './Gta6Top5WtfV7En';
import {HaboobVideoEn} from './HaboobVideoEn';

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

// Harding v15 EN is self-contained (words + VO + looped drone are loaded
// inside the component); fixed duration 67.23s = 2017 frames (VO 67.23s:
// narration 64.24s + 0.6s silence + CTA 2.39s from 64.84s).
// Kokoro bm_george speed 1.15 (narration) / 1.3 (CTA, enthusiastic).
// Crime dossier style (v12): hook = real arrest photo + giant phrase,
// tabloid collage, detective board, ONE glissée transition (EncroChat
// revelation, S10), real arrest clip as landscape insert (S16),
// CTA card at 64.84s (no subscriber count), drone -11 dB under the VO.
// EN ONLY (Axel decision 2026-11-14, like v12).
const calculateHardingEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2017,
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

// Pompeii v14 EN is self-contained (phrases + VO are loaded inside the
// component); fixed duration 39.42s = 1183 frames (last word 37.92s + 1.5s tail).
// GRAVE subject — @cursednature1 system (see TsunamiVideoEn): hook = real
// plaster cast from t=0 + white flash, punch-out at ~2.84s, 1 sentence
// = 1 shot cut on the VO pause, 2 giant overlays ("33 KM",
// "100 000× HIROSHIMA"), archive audio under the VO, bookend on the hook
// cast, CTA card (Axel exception, S11). White bold phrase subtitles 60px;
// NO branding on the hook (handle from 3 s); Kokoro bm_george speed 1.0;
// VO boosted +3.5 dB to -21.4 dB (v13 precedent), mix target ~-20 dB.
// Max 40 s constraint (Axel 2026-11-15).
const calculatePompeiiEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1183,
		props,
	};
};

// Pompeii v14 DE is self-contained (phrases + VO are loaded inside the
// component); fixed duration 39.94s = 1198 frames (last word 38.44s + 1.5s tail).
// Same @cursednature1 system as the EN version. White bold phrase subtitles
// 50px / maxWidth 840 (long-word rule: "fünfzehnhundert" = 470.6 px);
// overlays "33 KM" and "100.000× HIROSHIMA". Kokoro dm_martin speed 1.0;
// VO boosted +3.5 dB to -21.4 dB. Max 40 s constraint.
const calculatePompeiiDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1198,
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

// Gta6EditEn — GTA 6 hype edit, EN ONLY (Axel 2026-11-15).
// Fixed duration 35.00s = 1050 frames. NO voiceover: launch-trailer music
// (T3 audio 50-85s, loudnormed) + real trailer footage cut on the beat
// (123 BPM). Hook = GTA VI logo over the sunset skyline + "4 DAYS LEFT".
const calculateGta6EditEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1050,
		props,
	};
};

// Gta6Script9En — GTA 6 edit, script 9 "He typed his code live. A viewer
// stole it." (Axel 2026-11-16). Fixed duration 34.00s = 1020 frames.
// EN ONLY, no voiceover: Kreepa "Oh No" 0-10s + Justice "Flower in a
// Hurricane" from the drop (0:48 of the single) 10-34s. Real streamer
// live + Lucia prison release (trailer 2, complete 16:9 on blurred fill,
// no crop) + meme reaction cards (green-screen templates keyed onto
// black in ffmpeg). NO handle anywhere (v3 rule).
const calculateGta6Script9EnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1020,
		props,
	};
};


// Gta6ExtendedLookEn — GTA 6 edit #2 "Extended Look" (Axel 2026-11-16).
// Fixed duration 44.40s = 1332 frames (91 beats at 123 BPM).
// EN ONLY, no voiceover: official Extended Look gameplay cut on the
// Justice drop (47.7-92.1 s of the single) + logo end card.
const calculateGta6ExtendedLookEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1332,
		props,
	};
};


// BoxJellyfishVideoEn — video 16, EN (Axel 2026-11-16).
// Self-contained (words + VO + CTA audio are loaded inside the component);
// fixed duration 61.83s = 1855 frames (narration 58.76s + 0.6s silence +
// CTA 2.47s from 59.36s). Kokoro bm_george speed 1.15 (narration) / 1.3
// (CTA, enthusiastic). Standard documentary series: Titan One yellow
// word-by-word subtitles (EN fontSize 62), neon branding @brainfeeder_uk
// after 3 s, real clips only, red danger annotations (motivated only).
const calculateBoxJellyfishEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1855,
		props,
	};
};

// BoxJellyfishVideoDe — video 16, DE (parallel with EN).
// Fixed duration 61.65s = 1850 frames (narration 57.95s + 0.6s silence +
// CTA 3.10s from 58.55s). Kokoro dm_martin speed 1.15 / 1.3 (CTA).
// German subtitles fontSize 50 / maxWidth 840 (long-word rule:
// "Irukandji-Qualle" = 449 px < 840 px). Branding @brainfeeder_de.
const calculateBoxJellyfishDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1850,
		props,
	};
};

// SmogVideoEn — video 17, The Great Smog of London, Dec 1952 (Axel 2026-11-17).
// Self-contained (phrases + VO + CTA audio are loaded inside the component);
// fixed duration 66.26s = 1988 frames (narration 62.67s + 0.6s silence +
// CTA 2.99s from 63.27s). Kokoro bm_george speed 1.0 (narration) / 1.3
// (CTA, enthusiastic). GRAVE subject — @cursednature1 system (v13/v14):
// hook = real 1952 Nelson's Column photo + giant phrase, punch-out ~2.3s,
// 1 sentence = 1 shot cut on the VO pause, 2 giant overlays ("1,000 TONNES",
// "12,000"), bookend on the hook photo, CTA card (no subscriber count).
// White bold phrase subtitles 60px; NO branding on the hook (handle from
// 3 s); VO ONLY — no music, no drone, no archive audio (both archive audios
// rejected after verification: Pathé = narration, Guardian = unconfirmed
// rumble). PLEIN CADRE: every visual full frame on a blurred fill, no crop.
// VO -21.8 dB boosted +0.5 dB (~-21.3 dB mix).
const calculateSmogEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1988,
		props,
	};
};

// SmogVideoDe — video 17, DE (parallel with EN).
// Fixed duration 65.80s = 1974 frames (narration 61.92s + 0.6s silence +
// CTA 3.28s from 62.52s). Kokoro dm_martin speed 1.0 / 1.3 (CTA).
// German subtitles fontSize 50 / maxWidth 840 (long-word rule:
// "Großbritannien" = 431 px < 840 px). Branding @brainfeeder_de.
// Overlays "1.000 TONNEN" and "12.000".
const calculateSmogDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1974,
		props,
	};
};

// MaltaVideoEn — video 18, Malta fireworks factory explosion, 1 June 2026
// (Axel 2026-11-17). Self-contained (words + VO + CTA audio are loaded
// inside the component); fixed duration 69.58s = 2087 frames (narration
// 62.54s + 0.6s silence + CTA 2.44s from 66.14s; tail 1.0s after last word).
// Kokoro bm_george speed 1.15 (narration) / 1.3 (CTA, enthusiastic).
// HOOK (Axel 2026-11-17): explosion in motion 0-3s, no text/branding;
// hook phrase on shot 2. Standard BrainFeeder system: Titan One yellow
// word-by-word subtitles (EN fontSize 62), neon branding @brainfeeder_uk
// after 3 s, real Guardian + Al Jazeera clips only, map rendered from
// Natural Earth 10m. Subtitles RAISED to bottom:700 during the AJ shots
// (baked archive captions below). Real boom audio 0-3s.
const calculateMaltaEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2087,
		props,
	};
};

// MaltaVideoDe — video 18, DE (parallel with EN).
// Fixed duration 69.32s = 2080 frames (narration 61.90s + 0.6s silence +
// CTA 2.82s from 65.50s). Kokoro dm_martin speed 1.15 / 1.3 (CTA).
// German subtitles fontSize 50 / maxWidth 840 (long-word rule:
// "Lourdes-Feuerwerksfabrik" = 751 px < 840 px). Branding @brainfeeder_de.
const calculateMaltaDeMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2080,
		props,
	};
};

// MothmanVideoEn — video 19, Mothman, Point Pleasant WV 1966-1967
// (Axel 2026-11-23). ENGLISH ONLY — Axel 2026-11-23 01:14: "Arrête les
// versions DE jusqu'à nouvel ordre" (no DE version of v19).
// Self-contained (phrases + VO + CTA audio are loaded inside the component);
// fixed duration 69.31s = 2080 frames (narration 65.72s + 0.6s silence +
// CTA 2.99s from 66.32s). Kokoro bm_george speed 1.0 (narration) / 1.3
// (CTA, enthusiastic). GRAVE subject — @cursednature1 system (v13/v17):
// hook = real 2025 statue photo + giant phrase, 1 sentence = 1 shot cut
// on the VO pause, 2 giant overlays ("100+", "46"), bookend on the hook
// photo, CTA card (no subscriber count). White bold phrase subtitles 60px;
// NO branding on the hook (handle from 3 s); grave drone at 0.15 under
// S8-S11 only; VO ONLY otherwise. PLEIN CADRE: every visual full frame on
// a blurred fill, no crop. VO -24.9 dB boosted +3.6 dB (~-21.3 dB mix).
const calculateMothmanEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 2080,
		props,
	};
};

// HessdalenVideoEn — video 22, The Hessdalen Lights, Norway 1981–today
// (Axel 2026-11-24, pick #2). ENGLISH ONLY — DE versions suspended until
// further order (no DE version of v22). Standard system (NOT grave-topic):
// Titan One yellow word-by-word subtitles (EN fontSize 62), hook = real
// 1982 three-lights photo + giant phrase, 1 sentence = 1 shot cut on the
// VO pause, 2 giant overlays ("188", "8 OUT OF 9"), no separate follow CTA
// (S11 is the comment question). Kokoro bm_george speed 1.15, VO 57.76 s,
// -24.4 dB (no gain). Fixed duration 59.26s = 1778 frames (VO + 1.84s tail).
// The Hauge 2007 spectrum photo (CC BY-NC-SA) is deliberately NOT used
// (monetisation); all visuals are Project Hessdalen archive material.
const calculateHessdalenEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1778,
		props,
	};
};

// Gta6PcVideoEn — GTA 6 sur PC, vidéo informative (script 1 redirigé, Axel 2026-11-17).
// Fixed duration 65.63s = 1969 frames (narration 63.37s + 0.6s silence +
// CTA 1.66s from 63.97s). Kokoro bm_george speed 1.15 (narration) / 1.3
// (CTA, enthusiastic). Titan One yellow word-by-word subtitles (EN fontSize
// 62, bottom 360). Music: "Love Is a Long Road" — Tom Petty (intro GTA 6,
// extracted from trailer 1) under the VO, ~-18 dB under the voice.
// Memes FULL SCREEN (doubt, scam, bruh, facepalm). NO handle anywhere.
// Q1 2027 = REPORT GamesBeat, never "PC confirmed".
const calculateGta6PcEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1969,
		props,
	};
};

// Gta6WweMemeEn — remake du meme WWE "gf/wife vs GTA 6" (Axel 2026-11-17).
// Fixed duration 17.50s = 525 frames (4 clips WWE à vitesse naturelle +
// carte de fin 2s — comme la référence, 17s). EN ONLY, no voiceover, no
// music: audio WWE original (Jey au micro, foule, commentateurs).
// PLEIN CADRE sur fond flouté uniquement, JAMAIS de crop 9:16 centré
// (les lutteurs sont aux bords du cadre) ; JAMAIS de zoom sur l'homme au
// tapis (la victime du superkick est Roman Reigns, pas Jimmy).
// AUCUN handle dans la vidéo.
const calculateGta6WweMemeEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 525,
		props,
	};
};

// Gta6Script2En — GTA 6 « 4 numbers before Thursday » (script 2, Axel GO 2026-11-18).
// Fixed duration 33.17s = 995 frames (68 beats at 123 BPM, 1 beat = 0.4878 s).
// EN ONLY, no voiceover: Justice « Flower in a Hurricane » (drop cut, already on
// disk from edit n°2) + 15 fresh clips validated by Axel 2026-11-18, cut on the
// beat, one number = one downbeat. NO handle anywhere. End: « 0 MICROTRANSACTIONS
// IN THE STORY. THURSDAY. MIDNIGHT. » + FOLLOW.
const calculateGta6Script2EnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 995,
		props,
	};
};

// Gta5LastRideEn — GTA 5 « The Last Ride » (Axel GO 2026-11-18 15:03).
// Fixed duration 53.33s = 1600 frames (104 beats at 117.45 BPM, 1 beat =
// 0.5108 s). EN ONLY, no voiceover: Tom Petty « Love Is a Long Road » (GTA 6
// trailer 1, already on disk) + 17 shots from the 29 Last Ride clips, cut on
// the beat. Every on-screen text is illustrated by its clip (Axel's rule).
// NO handle anywhere. End: « SEE YOU IN VICE CITY. TOMORROW. »
const calculateGta5LastRideEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1600,
		props,
	};
};

// Gta6FirstLookEn — « First Look of GTA 6 » (Axel, 2026-11-18 soir).
// Fixed duration 47 s = 1410 frames (5 clips exacts de StiM971, timecodes
// d'Axel : 9+8+10+10+10 s). EN ONLY, no voiceover: Tom Petty « Love Is a
// Long Road » + 5 shots, plein cadre + fond flouté (AUCUN recadrage, règle
// durcie Last Ride v2). NO handle anywhere. End: « GTA 6. TOMORROW. » + FOLLOW.
const calculateGta6FirstLookEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1410,
		props,
	};
};

// Gta6GlitchesEn — « GTA 6 launch-day glitches » (Axel, 2026-11-19).
// Fixed duration 48 s = 1440 frames (6 reels Instagram vérifiés + bookend g1).
// EN ONLY, no voiceover: Tom Petty « Love Is a Long Road » + 7 shots, plein
// cadre + fond flouté (AUCUN recadrage 9:16, règle durcie Last Ride v2).
// Exception vérifiée : g4 recadré à la bande gameplay seule (facecam retirée).
// NO handle anywhere. End: « GTA 6. OUT NOW. » + FOLLOW (bookend camion).
const calculateGta6GlitchesEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1440,
		props,
	};
};

// Gta6GlitchesPart2En — « GTA 6 glitches PART 2 — IT GETS WORSE » (Axel, 2026-11-20).
// Fixed duration 61.3 s = 1839 frames (5 glitchs + 6 memes réaction plein
// écran + bookend chien). EN ONLY, no voiceover: Tom Petty « Love Is a Long
// Road » + 12 shots, plein cadre + fond flouté (AUCUN recadrage 9:16, règle
// durcie Last Ride v2). Exceptions vérifiées : p3 recadré à la bande
// gameplay seule (facecam retirée), r4 recadré-centré sur Travolta.
// NO handle anywhere. End: « GTA 6. OUT NOW. » + FOLLOW (bookend chien).
const calculateGta6GlitchesPart2EnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1839,
		props,
	};
};

// Gta6PcRumorsEn — « GTA 6 on PC? The rumors » (Axel, 2026-11-22 19:00).
// Fixed duration 59.54 s = 1786 frames (narration 57.04 s + 2.5 s tail
// for the FOLLOW end card). Kokoro bm_george speed 1.15. NO music, NO
// handle, NO CTA voiceover. RUMOR (GamesBeat Q1 2027) vs CONFIRMED
// (Nov 19 PS5+Xbox only, Zelnick quotes) vs FAKE (joke-video spec sheet,
// malware downloads) distinguished on screen with colour-coded pills.
const calculateGta6PcRumorsEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1786,
		props,
	};
};

// Gta6Top5WtfEn — « TOP 5 WTF GTA 6 MOMENTS » (Axel, 2026-11-23).
// Fixed duration 60.0 s = 1800 frames (HARD CAP Axel : 1 minute max).
// EN ONLY, @raya.swift, countdown 5 -> 1, style Vice Clips.
const calculateGta6Top5WtfEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1800,
		props,
	};
};

// Gta6Top5WtfV3En — « TOP 5 WTF GTA 6 MOMENTS » v3 (Axel, 2026-11-23).
// 5 moments FRAIS (shark / tim tase x3 / summit FLIP / crash moto Axel /
// jerma train), VO Gemini Rasalgethi, #3 flip mis en avant
// (« Surtout le flip »). #2 = reel IG DgEuD9TE_u5 envoye par Axel,
// avec zoom dynamique sur le ralenti d'ejection (ordre Axel).
// Sortie v6 (v5 pris par un fichier SUPERSEDED aux anciens clips).
const calculateGta6Top5WtfV3EnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1800,
		props,
	};
};

// Gta6Top5WtfV7En — « TOP 5 WTF GTA 6 MOMENTS » v7 (Axel, 2026-11-23).
// v7 = v6 avec les CLIPS ENTIERS (118.0 s) — la regle 60 s ne s'applique
// pas quand elle massacre les clips. Sortie v7.
const calculateGta6Top5WtfV7EnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 3540,
		props,
	};
};

// HaboobVideoEn — Facebook Reel "The dust wall that swallowed a city",
// Phoenix haboob 5 July 2011 (EN ONLY, no series number, no DE version).
// Fixed duration 50.0 s = 1500 frames (VO 47.50 s + 2.5 s tail).
// Kokoro bm_george speed 1.0. Real clips/photos of THIS event only;
// S5 mechanism is a labelled Remotion diagram (no thunderstorm footage
// of this event exists). NO branding/handle anywhere (brief). White Titan
// One subtitles, selective yellow key words. Music bed: CC0 Real SFX
// drone + self-generated wind swell (Pixabay blocked on this VM).
const calculateHaboobEnMetadata: CalculateMetadataFunction<Record<string, never>> = ({
	props,
}) => {
	return {
		durationInFrames: 1500,
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
				id="HardingVideoEn"
				component={HardingVideoEn as React.FC<unknown>}
				durationInFrames={2017}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateHardingEnMetadata}
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
				id="PompeiiVideoEn"
				component={PompeiiVideoEn as React.FC<unknown>}
				durationInFrames={1183}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculatePompeiiEnMetadata}
			/>
			<Composition
				id="PompeiiVideoDe"
				component={PompeiiVideoDe as React.FC<unknown>}
				durationInFrames={1198}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculatePompeiiDeMetadata}
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
			<Composition
				id="Gta6EditEn"
				component={Gta6EditEn as React.FC<unknown>}
				durationInFrames={1050}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6EditEnMetadata}
			/>
			<Composition
				id="Gta6Script9En"
				component={Gta6Script9En as React.FC<unknown>}
				durationInFrames={1020}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6Script9EnMetadata}
			/>

			<Composition
				id="Gta6ExtendedLookEn"
				component={Gta6ExtendedLookEn as React.FC<unknown>}
				durationInFrames={1332}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6ExtendedLookEnMetadata}
			/>
			<Composition
				id="BoxJellyfishVideoEn"
				component={BoxJellyfishVideoEn as React.FC<unknown>}
				durationInFrames={1855}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateBoxJellyfishEnMetadata}
			/>
			<Composition
				id="BoxJellyfishVideoDe"
				component={BoxJellyfishVideoDe as React.FC<unknown>}
				durationInFrames={1850}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateBoxJellyfishDeMetadata}
			/>
			<Composition
				id="SmogVideoEn"
				component={SmogVideoEn as React.FC<unknown>}
				durationInFrames={1988}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateSmogEnMetadata}
			/>
			<Composition
				id="SmogVideoDe"
				component={SmogVideoDe as React.FC<unknown>}
				durationInFrames={1974}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateSmogDeMetadata}
			/>
			<Composition
				id="MaltaVideoEn"
				component={MaltaVideoEn as React.FC<unknown>}
				durationInFrames={2087}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateMaltaEnMetadata}
			/>
			<Composition
				id="MaltaVideoDe"
				component={MaltaVideoDe as React.FC<unknown>}
				durationInFrames={2080}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateMaltaDeMetadata}
			/>
			<Composition
				id="MothmanVideoEn"
				component={MothmanVideoEn as React.FC<unknown>}
				durationInFrames={2080}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateMothmanEnMetadata}
			/>
			<Composition
				id="HessdalenVideoEn"
				component={HessdalenVideoEn as React.FC<unknown>}
				durationInFrames={1778}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateHessdalenEnMetadata}
			/>
			<Composition
				id="Gta6PcVideoEn"
				component={Gta6PcVideoEn as React.FC<unknown>}
				durationInFrames={1969}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6PcEnMetadata}
			/>
			<Composition
				id="Gta6WweMemeEn"
				component={Gta6WweMemeEn as React.FC<unknown>}
				durationInFrames={525}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6WweMemeEnMetadata}
			/>
			<Composition
				id="Gta6Script2En"
				component={Gta6Script2En as React.FC<unknown>}
				durationInFrames={995}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6Script2EnMetadata}
			/>
			<Composition
				id="Gta5LastRideEn"
				component={Gta5LastRideEn as React.FC<unknown>}
				durationInFrames={1600}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta5LastRideEnMetadata}
			/>
			<Composition
				id="Gta6FirstLookEn"
				component={Gta6FirstLookEn as React.FC<unknown>}
				durationInFrames={1410}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6FirstLookEnMetadata}
			/>
			<Composition
				id="Gta6GlitchesEn"
				component={Gta6GlitchesEn as React.FC<unknown>}
				durationInFrames={1440}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6GlitchesEnMetadata}
			/>
			<Composition
				id="Gta6GlitchesPart2En"
				component={Gta6GlitchesPart2En as React.FC<unknown>}
				durationInFrames={1839}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6GlitchesPart2EnMetadata}
			/>
			<Composition
				id="Gta6PcRumorsEn"
				component={Gta6PcRumorsEn as React.FC<unknown>}
				durationInFrames={1786}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6PcRumorsEnMetadata}
			/>
			<Composition
				id="Gta6Top5WtfEn"
				component={Gta6Top5WtfEn as React.FC<unknown>}
				durationInFrames={1800}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6Top5WtfEnMetadata}
			/>
			<Composition
				id="Gta6Top5WtfV3En"
				component={Gta6Top5WtfV3En as React.FC<unknown>}
				durationInFrames={1800}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6Top5WtfV3EnMetadata}
			/>
			<Composition
				id="Gta6Top5WtfV7En"
				component={Gta6Top5WtfV7En as React.FC<unknown>}
				durationInFrames={3540}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateGta6Top5WtfV7EnMetadata}
			/>
			<Composition
				id="HaboobVideoEn"
				component={HaboobVideoEn as React.FC<unknown>}
				durationInFrames={1500}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
				calculateMetadata={calculateHaboobEnMetadata}
			/>
		</>
	);
};
