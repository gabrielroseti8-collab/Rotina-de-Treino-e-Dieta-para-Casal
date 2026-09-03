import React from 'react';

export type ExerciseAnimationKey =
  | 'squat'
  | 'bench_press'
  | 'chest_fly'
  | 'overhead_press'
  | 'lateral_raise'
  | 'lat_pulldown'
  | 'barbell_row'
  | 'bicep_curl'
  | 'tricep_pushdown'
  | 'hip_thrust'
  | 'bulgarian_squat'
  | 'stiff'
  | 'leg_extension'
  | 'leg_press'
  | 'calf_raise'
  | 'lying_leg_curl'
  | 'hip_abduction'
  | 'plank'
  | 'crunches'
  | 'burpee'
  | 'running'
  | 'spinning'
  | 'walking'
  | 'general';

interface ExerciseCartoonProps {
  exerciseKey: ExerciseAnimationKey;
  speed?: number; // 0.5, 1, 1.5
  isPaused?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gender?: 'male' | 'female' | 'neutral';
  highlightMuscles?: boolean;
  className?: string;
}

export function detectExerciseKey(name: string, muscleGroup: string = ''): ExerciseAnimationKey {
  const n = (name + ' ' + muscleGroup).toLowerCase();

  if (n.includes('pélvica') || n.includes('pelvica') || n.includes('hip thrust')) return 'hip_thrust';
  if (n.includes('búlgar') || n.includes('bulgar')) return 'bulgarian_squat';
  if (n.includes('agachamento') || n.includes('sumô') || n.includes('sumo')) return 'squat';
  if (n.includes('leg press')) return 'leg_press';
  if (n.includes('extensora')) return 'leg_extension';
  if (n.includes('flexora')) return 'lying_leg_curl';
  if (n.includes('abdutora')) return 'hip_abduction';
  if (n.includes('stiff') || n.includes('terra')) return 'stiff';
  if (n.includes('panturrilha') || n.includes('gêmeos') || n.includes('gemeos')) return 'calf_raise';
  if (n.includes('passada') || n.includes('avanço') || n.includes('avanco')) return 'bulgarian_squat';

  if (n.includes('supino')) return 'bench_press';
  if (n.includes('crucifixo') || n.includes('crossover')) return 'chest_fly';
  if (n.includes('desenvolvimento') || n.includes('militar')) return 'overhead_press';
  if (n.includes('lateral')) return 'lateral_raise';
  if (n.includes('puxada')) return 'lat_pulldown';
  if (n.includes('remada')) return 'barbell_row';
  if (n.includes('rosca') || n.includes('bíceps') || n.includes('biceps')) return 'bicep_curl';
  if (n.includes('tríceps') || n.includes('triceps') || n.includes('mergulho')) return 'tricep_pushdown';

  if (n.includes('prancha')) return 'plank';
  if (n.includes('abdominal') || n.includes('infra') || n.includes('supra') || n.includes('core')) return 'crunches';
  if (n.includes('burpee') || n.includes('funcional')) return 'burpee';
  if (n.includes('bike') || n.includes('spinning') || n.includes('pedalar')) return 'spinning';
  if (n.includes('corrida') || n.includes('tiro') || n.includes('esteira')) return 'running';
  if (n.includes('caminhada') || n.includes('andar') || n.includes('passos')) return 'walking';

  return 'general';
}

export const ExerciseCartoon: React.FC<ExerciseCartoonProps> = ({
  exerciseKey,
  speed = 1,
  isPaused = false,
  size = 'md',
  gender = 'neutral',
  highlightMuscles = true,
  className = '',
}) => {
  const duration = (2.6 / speed).toFixed(2) + 's';
  const playState = isPaused ? 'paused' : 'running';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-64 h-64 sm:w-72 sm:h-72',
  }[size];

  // Character theme colors
  const skinColor = '#FCD34D'; // warm cartoon skin
  const hairColor = gender === 'female' ? '#B45309' : '#1E293B';
  const shirtColor = gender === 'female' ? '#F43F5E' : '#0284C7';
  const shortsColor = '#0F172A';
  const shoeColor = '#38BDF8';
  const weightColor = '#475569';
  const plateColor = '#EF4444';
  const benchColor = '#1E293B';
  const muscleGlowColor = highlightMuscles ? '#10B981' : 'transparent';

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-inner ${sizeClasses} ${className}`}
      style={
        {
          '--anim-duration': duration,
          '--anim-state': playState,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes cartoon-squat-torso {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(24px); }
        }
        @keyframes cartoon-squat-femur-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(50deg); }
        }
        @keyframes cartoon-squat-femur-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-50deg); }
        }
        @keyframes cartoon-bench-arms {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(20px) scaleY(0.65); }
        }
        @keyframes cartoon-overhead-press {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(22px); }
        }
        @keyframes cartoon-lateral-raise-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-75deg); }
        }
        @keyframes cartoon-lateral-raise-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(75deg); }
        }
        @keyframes cartoon-lat-pulldown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(26px); }
        }
        @keyframes cartoon-bicep-forearm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-105deg); }
        }
        @keyframes cartoon-hip-thrust {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
        }
        @keyframes cartoon-stiff-hinge {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes cartoon-leg-extension {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-65deg); }
        }
        @keyframes cartoon-plank-breathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes cartoon-crunch {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes cartoon-walk-leg-l {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes cartoon-walk-leg-r {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes cartoon-walk-arm-l {
          0%, 100% { transform: rotate(30deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes cartoon-walk-arm-r {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(30deg); }
        }
        @keyframes cartoon-running-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes cartoon-bar-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes cartoon-pedal-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-squat {
          animation: cartoon-squat-torso var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-bench {
          animation: cartoon-bench-arms var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-overhead {
          animation: cartoon-overhead-press var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-lat-raise-l {
          transform-origin: 40px 48px;
          animation: cartoon-lateral-raise-l var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-lat-raise-r {
          transform-origin: 60px 48px;
          animation: cartoon-lateral-raise-r var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-lat-pulldown {
          animation: cartoon-lat-pulldown var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-bicep {
          transform-origin: 52px 65px;
          animation: cartoon-bicep-forearm var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-hip-thrust {
          animation: cartoon-hip-thrust var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-stiff {
          transform-origin: 50px 72px;
          animation: cartoon-stiff-hinge var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-leg-ext {
          transform-origin: 62px 72px;
          animation: cartoon-leg-extension var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-plank {
          animation: cartoon-plank-breathe var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-crunch {
          transform-origin: 40px 75px;
          animation: cartoon-crunch var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-walk-leg-1 {
          transform-origin: 50px 65px;
          animation: cartoon-walk-leg-l var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-walk-leg-2 {
          transform-origin: 50px 65px;
          animation: cartoon-walk-leg-r var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-walk-arm-1 {
          transform-origin: 50px 45px;
          animation: cartoon-walk-arm-l var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-walk-arm-2 {
          transform-origin: 50px 45px;
          animation: cartoon-walk-arm-r var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
        .anim-run-bounce {
          animation: cartoon-running-bounce calc(var(--anim-duration) * 0.5) ease-in-out infinite var(--anim-state);
        }
        .anim-pedal {
          transform-origin: 50px 70px;
          animation: cartoon-pedal-spin var(--anim-duration) linear infinite var(--anim-state);
        }
        .anim-glow {
          animation: cartoon-bar-glow var(--anim-duration) ease-in-out infinite var(--anim-state);
        }
      `}</style>

      {/* SVG Viewport */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle floor shadow / guide line */}
        <ellipse cx="50" cy="92" rx="36" ry="4" fill="#0284C7" fillOpacity="0.12" />
        <line x1="12" y1="92" x2="88" y2="92" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* 1. SQUAT */}
        {(exerciseKey === 'squat' || exerciseKey === 'bulgarian_squat') && (
          <g>
            {/* Motion guide arrows */}
            <path d="M78 40 L78 68 M78 68 L74 62 M78 68 L82 62" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <path d="M22 68 L22 40 M22 40 L18 46 M22 40 L26 46" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />

            {/* Static Lower Shins and Feet */}
            <rect x="36" y="76" width="6" height="15" rx="3" fill={skinColor} />
            <rect x="58" y="76" width="6" height="15" rx="3" fill={skinColor} />
            <ellipse cx="38" cy="91" rx="6" ry="2.5" fill={shoeColor} />
            <ellipse cx="62" cy="91" rx="6" ry="2.5" fill={shoeColor} />

            {/* Moving Torso, Hips & Barbell */}
            <g className="anim-squat">
              {/* Thighs */}
              <rect x="34" y="58" width="8" height="20" rx="4" fill={shortsColor} />
              <rect x="58" y="58" width="8" height="20" rx="4" fill={shortsColor} />
              
              {/* Muscle glow on quads */}
              {highlightMuscles && (
                <>
                  <circle cx="38" cy="68" r="4" fill={muscleGlowColor} fillOpacity="0.4" className="anim-glow" />
                  <circle cx="62" cy="68" r="4" fill={muscleGlowColor} fillOpacity="0.4" className="anim-glow" />
                </>
              )}

              {/* Hips / Shorts */}
              <path d="M32 54 C32 50 68 50 68 54 L66 64 C66 65 34 65 34 64 Z" fill={shortsColor} />

              {/* Torso */}
              <rect x="38" y="32" width="24" height="24" rx="6" fill={shirtColor} />
              {/* Head */}
              <circle cx="50" cy="22" r="8" fill={skinColor} />
              {/* Hair */}
              <path d="M42 20 C42 14 58 14 58 20 C56 16 44 16 42 20 Z" fill={hairColor} />
              {/* Cute Eyes & Smile */}
              <circle cx="47" cy="22" r="1" fill="#0F172A" />
              <circle cx="53" cy="22" r="1" fill="#0F172A" />
              <path d="M48 25 Q50 27 52 25" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />

              {/* Barbell across shoulders */}
              <line x1="14" y1="30" x2="86" y2="30" stroke={weightColor} strokeWidth="3.5" strokeLinecap="round" />
              {/* Weight Plates */}
              <rect x="18" y="20" width="5" height="20" rx="2" fill={plateColor} />
              <rect x="23" y="22" width="3" height="16" rx="1.5" fill="#F59E0B" />
              <rect x="77" y="20" width="5" height="20" rx="2" fill={plateColor} />
              <rect x="74" y="22" width="3" height="16" rx="1.5" fill="#F59E0B" />

              {/* Hands grasping barbell */}
              <circle cx="30" cy="30" r="3" fill={skinColor} />
              <circle cx="70" cy="30" r="3" fill={skinColor} />
            </g>
          </g>
        )}

        {/* 2. BENCH PRESS */}
        {(exerciseKey === 'bench_press' || exerciseKey === 'chest_fly') && (
          <g>
            {/* Gym Flat Bench */}
            <rect x="18" y="66" width="64" height="7" rx="3.5" fill={benchColor} stroke="#334155" strokeWidth="1" />
            <rect x="26" y="73" width="6" height="18" rx="2" fill="#334155" />
            <rect x="68" y="73" width="6" height="18" rx="2" fill="#334155" />

            {/* Athlete lying on bench */}
            {/* Head on bench */}
            <circle cx="28" cy="62" r="7" fill={skinColor} />
            <path d="M22 62 C22 56 32 56 34 62 Z" fill={hairColor} />
            {/* Torso lying flat */}
            <rect x="34" y="58" width="30" height="12" rx="4" fill={shirtColor} />
            {/* Chest muscle highlight */}
            {highlightMuscles && (
              <ellipse cx="46" cy="63" rx="7" ry="4" fill={muscleGlowColor} fillOpacity="0.45" className="anim-glow" />
            )}
            {/* Bent Legs / Feet on Floor */}
            <path d="M64 64 L74 68 L76 90" stroke={shortsColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="77" cy="91" rx="5" ry="2.5" fill={shoeColor} />

            {/* Moving Arms & Barbell */}
            <g className="anim-bench">
              {/* Arms extending up */}
              <line x1="42" y1="62" x2="42" y2="34" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />
              <line x1="52" y1="62" x2="52" y2="34" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />

              {/* Barbell */}
              <line x1="16" y1="34" x2="84" y2="34" stroke={weightColor} strokeWidth="3.5" strokeLinecap="round" />
              <rect x="20" y="24" width="5" height="20" rx="2" fill={plateColor} />
              <rect x="25" y="26" width="3" height="16" rx="1.5" fill="#F59E0B" />
              <rect x="75" y="24" width="5" height="20" rx="2" fill={plateColor} />
              <rect x="72" y="26" width="3" height="16" rx="1.5" fill="#F59E0B" />

              {/* Hands */}
              <circle cx="42" cy="34" r="3" fill={skinColor} />
              <circle cx="52" cy="34" r="3" fill={skinColor} />
            </g>
          </g>
        )}

        {/* 3. OVERHEAD / MILITARY PRESS */}
        {exerciseKey === 'overhead_press' && (
          <g>
            {/* Legs and Feet standing strong */}
            <rect x="40" y="66" width="7" height="25" rx="3.5" fill={shortsColor} />
            <rect x="53" y="66" width="7" height="25" rx="3.5" fill={shortsColor} />
            <ellipse cx="43" cy="91" rx="5" ry="2" fill={shoeColor} />
            <ellipse cx="57" cy="91" rx="5" ry="2" fill={shoeColor} />

            {/* Torso & Head */}
            <rect x="38" y="42" width="24" height="26" rx="5" fill={shirtColor} />
            <circle cx="50" cy="32" r="8" fill={skinColor} />
            <path d="M42 30 C42 24 58 24 58 30 Z" fill={hairColor} />
            {/* Eyes */}
            <circle cx="47" cy="32" r="1" fill="#0F172A" />
            <circle cx="53" cy="32" r="1" fill="#0F172A" />

            {/* Shoulder Muscle Glow */}
            {highlightMuscles && (
              <>
                <circle cx="38" cy="45" r="4" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
                <circle cx="62" cy="45" r="4" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
              </>
            )}

            {/* Overhead Moving Arms & Barbell */}
            <g className="anim-overhead">
              <line x1="38" y1="44" x2="34" y2="18" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="62" y1="44" x2="66" y2="18" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />

              <line x1="16" y1="18" x2="84" y2="18" stroke={weightColor} strokeWidth="3" strokeLinecap="round" />
              <rect x="20" y="10" width="5" height="16" rx="2" fill={plateColor} />
              <rect x="75" y="10" width="5" height="16" rx="2" fill={plateColor} />

              <circle cx="34" cy="18" r="3" fill={skinColor} />
              <circle cx="66" cy="18" r="3" fill={skinColor} />
            </g>
          </g>
        )}

        {/* 4. LATERAL RAISE */}
        {exerciseKey === 'lateral_raise' && (
          <g>
            {/* Static Body */}
            <rect x="42" y="66" width="6" height="25" rx="3" fill={shortsColor} />
            <rect x="52" y="66" width="6" height="25" rx="3" fill={shortsColor} />
            <ellipse cx="45" cy="91" rx="4.5" ry="2" fill={shoeColor} />
            <ellipse cx="55" cy="91" rx="4.5" ry="2" fill={shoeColor} />

            <rect x="40" y="44" width="20" height="24" rx="5" fill={shirtColor} />
            <circle cx="50" cy="34" r="7.5" fill={skinColor} />
            <path d="M43 33 C43 27 57 27 57 33 Z" fill={hairColor} />

            {/* Left Arm with Dumbbell */}
            <g className="anim-lat-raise-l">
              <line x1="40" y1="48" x2="28" y2="70" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              {/* Dumbbell */}
              <circle cx="28" cy="70" r="2.5" fill={skinColor} />
              <rect x="22" y="68" width="12" height="4" rx="2" fill={weightColor} />
              <circle cx="22" cy="70" r="4" fill="#38BDF8" />
              <circle cx="34" cy="70" r="4" fill="#38BDF8" />
            </g>

            {/* Right Arm with Dumbbell */}
            <g className="anim-lat-raise-r">
              <line x1="60" y1="48" x2="72" y2="70" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              {/* Dumbbell */}
              <circle cx="72" cy="70" r="2.5" fill={skinColor} />
              <rect x="66" y="68" width="12" height="4" rx="2" fill={weightColor} />
              <circle cx="66" cy="70" r="4" fill="#38BDF8" />
              <circle cx="78" cy="70" r="4" fill="#38BDF8" />
            </g>

            {/* Shoulder Highlights */}
            {highlightMuscles && (
              <>
                <circle cx="39" cy="48" r="4" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
                <circle cx="61" cy="48" r="4" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
              </>
            )}
          </g>
        )}

        {/* 5. LAT PULLDOWN */}
        {exerciseKey === 'lat_pulldown' && (
          <g>
            {/* Cable Machine Top Frame & Pulley */}
            <line x1="20" y1="12" x2="80" y2="12" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="12" r="5" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            {/* Cable down to bar */}
            <line x1="50" y1="14" x2="50" y2="28" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Lat Machine Seat */}
            <rect x="36" y="70" width="28" height="6" rx="3" fill={benchColor} />
            <rect x="47" y="76" width="6" height="16" rx="2" fill="#334155" />

            {/* Seated Athlete */}
            <rect x="42" y="52" width="16" height="20" rx="4" fill={shortsColor} />
            <rect x="38" y="44" width="24" height="22" rx="5" fill={shirtColor} />
            {/* Lats glow */}
            {highlightMuscles && (
              <ellipse cx="50" cy="52" rx="10" ry="6" fill={muscleGlowColor} fillOpacity="0.45" className="anim-glow" />
            )}

            <circle cx="50" cy="34" r="7" fill={skinColor} />
            <path d="M43 33 C43 27 57 27 57 33 Z" fill={hairColor} />

            {/* Thigh pad */}
            <rect x="34" y="66" width="32" height="4" rx="2" fill="#475569" />

            {/* Moving Lat Bar & Arms */}
            <g className="anim-lat-pulldown">
              {/* Wide Grip Lat Bar with Curved Ends */}
              <path d="M18 32 Q50 26 82 32" stroke={weightColor} strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="20" cy="32" r="3" fill={skinColor} />
              <circle cx="80" cy="32" r="3" fill={skinColor} />

              {/* Arms pulling down */}
              <line x1="38" y1="46" x2="22" y2="32" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="62" y1="46" x2="78" y2="32" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 6. BICEP CURL */}
        {exerciseKey === 'bicep_curl' && (
          <g>
            {/* Static Body */}
            <rect x="42" y="65" width="6" height="26" rx="3" fill={shortsColor} />
            <rect x="52" y="65" width="6" height="26" rx="3" fill={shortsColor} />
            <ellipse cx="45" cy="91" rx="4.5" ry="2" fill={shoeColor} />
            <ellipse cx="55" cy="91" rx="4.5" ry="2" fill={shoeColor} />

            <rect x="40" y="42" width="20" height="25" rx="5" fill={shirtColor} />
            <circle cx="50" cy="32" r="7.5" fill={skinColor} />
            <path d="M43 31 C43 25 57 25 57 31 Z" fill={hairColor} />

            {/* Left arm resting / stabilizing */}
            <line x1="40" y1="46" x2="36" y2="68" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="36" cy="68" r="3" fill={skinColor} />

            {/* Right Bicep Upper Arm (Pinned at side) */}
            <line x1="56" y1="46" x2="52" y2="65" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />
            {/* Bicep Glow */}
            {highlightMuscles && (
              <circle cx="54" cy="54" r="4.5" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
            )}

            {/* Forearm Curling Up */}
            <g className="anim-bicep">
              <line x1="52" y1="65" x2="52" y2="82" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="52" cy="82" r="3" fill={skinColor} />

              {/* Dumbbell */}
              <rect x="44" y="80" width="16" height="4" rx="2" fill={weightColor} />
              <circle cx="44" cy="82" r="4" fill="#F59E0B" />
              <circle cx="60" cy="82" r="4" fill="#F59E0B" />
            </g>
          </g>
        )}

        {/* 7. HIP THRUST / ELEVAÇÃO PÉLVICA */}
        {exerciseKey === 'hip_thrust' && (
          <g>
            {/* Bench on the left supporting upper back */}
            <rect x="14" y="60" width="20" height="14" rx="3" fill={benchColor} stroke="#334155" strokeWidth="1" />
            <rect x="18" y="74" width="5" height="18" rx="2" fill="#334155" />

            {/* Static feet on ground */}
            <ellipse cx="78" cy="91" rx="6" ry="2.5" fill={shoeColor} />
            <line x1="78" y1="91" x2="78" y2="70" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />

            {/* Head resting on bench */}
            <circle cx="20" cy="54" r="7" fill={skinColor} />
            <path d="M14 54 C14 48 24 48 26 54 Z" fill={hairColor} />

            {/* Moving Hips, Torso & Barbell */}
            <g className="anim-hip-thrust">
              {/* Torso bridged to hips */}
              <line x1="26" y1="60" x2="55" y2="68" stroke={shirtColor} strokeWidth="12" strokeLinecap="round" />
              {/* Thighs from hips to knees */}
              <line x1="55" y1="68" x2="78" y2="70" stroke={shortsColor} strokeWidth="8" strokeLinecap="round" />

              {/* Glute Muscle Peak Glow */}
              {highlightMuscles && (
                <circle cx="56" cy="68" r="6" fill={muscleGlowColor} fillOpacity="0.55" className="anim-glow" />
              )}

              {/* Barbell on Hips */}
              <line x1="55" y1="46" x2="55" y2="90" stroke={weightColor} strokeWidth="3.5" strokeLinecap="round" />
              <rect x="53" y="44" width="4" height="14" rx="1.5" fill={plateColor} />
              <rect x="53" y="78" width="4" height="14" rx="1.5" fill={plateColor} />

              {/* Hands holding bar */}
              <circle cx="55" cy="60" r="3" fill={skinColor} />
              <circle cx="55" cy="74" r="3" fill={skinColor} />
            </g>
          </g>
        )}

        {/* 8. STIFF / DEADLIFT */}
        {exerciseKey === 'stiff' && (
          <g>
            {/* Straight Legs with soft knees */}
            <rect x="42" y="70" width="7" height="21" rx="3.5" fill={shortsColor} />
            <rect x="52" y="70" width="7" height="21" rx="3.5" fill={shortsColor} />
            <ellipse cx="45" cy="91" rx="5" ry="2" fill={shoeColor} />
            <ellipse cx="56" cy="91" rx="5" ry="2" fill={shoeColor} />

            {/* Hamstrings glow */}
            {highlightMuscles && (
              <ellipse cx="50" cy="76" rx="6" ry="8" fill={muscleGlowColor} fillOpacity="0.45" className="anim-glow" />
            )}

            {/* Hips and Hinging Torso */}
            <g className="anim-stiff">
              <rect x="40" y="48" width="20" height="24" rx="5" fill={shirtColor} />
              <circle cx="50" cy="38" r="7.5" fill={skinColor} />
              <path d="M43 37 C43 31 57 31 57 37 Z" fill={hairColor} />

              {/* Arms hanging straight down with dumbbells */}
              <line x1="44" y1="52" x2="44" y2="78" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="52" x2="56" y2="78" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />

              {/* Dumbbells along shins */}
              <rect x="36" y="76" width="16" height="4" rx="2" fill={weightColor} />
              <circle cx="36" cy="78" r="3.5" fill="#EF4444" />
              <circle cx="52" cy="78" r="3.5" fill="#EF4444" />

              <rect x="48" y="76" width="16" height="4" rx="2" fill={weightColor} />
              <circle cx="48" cy="78" r="3.5" fill="#EF4444" />
              <circle cx="64" cy="78" r="3.5" fill="#EF4444" />
            </g>
          </g>
        )}

        {/* 9. LEG EXTENSION / CADEIRA EXTENSORA */}
        {exerciseKey === 'leg_extension' && (
          <g>
            {/* Machine Chair */}
            <rect x="24" y="44" width="8" height="34" rx="4" fill={benchColor} />
            <rect x="28" y="70" width="34" height="8" rx="4" fill={benchColor} />
            <rect x="30" y="78" width="6" height="14" rx="2" fill="#334155" />

            {/* Seated Torso & Head */}
            <rect x="30" y="46" width="18" height="24" rx="4" fill={shirtColor} />
            <circle cx="39" cy="36" r="7" fill={skinColor} />
            <path d="M33 35 C33 29 45 29 45 35 Z" fill={hairColor} />

            {/* Upper Thighs on seat */}
            <rect x="32" y="68" width="30" height="8" rx="4" fill={shortsColor} />

            {/* Quad Glow */}
            {highlightMuscles && (
              <ellipse cx="48" cy="72" rx="7" ry="3.5" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
            )}

            {/* Lower Leg Kicking Out */}
            <g className="anim-leg-ext">
              <line x1="62" y1="72" x2="62" y2="88" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="64" cy="90" rx="5" ry="2.5" fill={shoeColor} />

              {/* Machine Roller Pad */}
              <circle cx="62" cy="85" r="4.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* 10. PLANK / PRANCHA */}
        {exerciseKey === 'plank' && (
          <g>
            {/* Forearm and Toes on Ground */}
            <ellipse cx="76" cy="76" rx="5" ry="2" fill={shoeColor} />
            <line x1="28" y1="75" x2="38" y2="75" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />

            {/* Animated Plank Body */}
            <g className="anim-plank">
              {/* Straight Torso line */}
              <line x1="28" y1="62" x2="74" y2="74" stroke={shortsColor} strokeWidth="10" strokeLinecap="round" />
              {/* Upper Body / Shirt */}
              <line x1="28" y1="62" x2="52" y2="67" stroke={shirtColor} strokeWidth="12" strokeLinecap="round" />

              {/* Head */}
              <circle cx="20" cy="58" r="6.5" fill={skinColor} />
              <path d="M15 57 C15 51 25 51 25 57 Z" fill={hairColor} />

              {/* Arm supporting upper body */}
              <line x1="26" y1="64" x2="32" y2="75" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />

              {/* Core Strength Aura / Glow */}
              {highlightMuscles && (
                <ellipse cx="48" cy="67" rx="12" ry="5" fill={muscleGlowColor} fillOpacity="0.45" className="anim-glow" />
              )}
            </g>
          </g>
        )}

        {/* 11. CRUNCHES / ABDOMINAL */}
        {exerciseKey === 'crunches' && (
          <g>
            {/* Lying on floor with bent knees */}
            <ellipse cx="76" cy="90" rx="5" ry="2" fill={shoeColor} />
            <line x1="60" y1="78" x2="76" y2="88" stroke={shortsColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="45" y1="84" x2="60" y2="78" stroke={shortsColor} strokeWidth="7" strokeLinecap="round" />

            {/* Torso Crunching Up */}
            <g className="anim-crunch">
              <rect x="24" y="74" width="22" height="10" rx="4" fill={shirtColor} />
              <circle cx="18" cy="74" r="6.5" fill={skinColor} />
              <path d="M13 73 C13 67 23 67 23 73 Z" fill={hairColor} />

              {/* Hands behind head */}
              <circle cx="16" cy="71" r="2.5" fill={skinColor} />

              {/* Abdominal muscle highlight */}
              {highlightMuscles && (
                <circle cx="35" cy="78" r="5" fill={muscleGlowColor} fillOpacity="0.5" className="anim-glow" />
              )}
            </g>
          </g>
        )}

        {/* 12. RUNNING / TIRO / CARDIO */}
        {exerciseKey === 'running' && (
          <g className="anim-run-bounce">
            {/* Motion speed dashes behind */}
            <line x1="10" y1="40" x2="22" y2="40" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="6" y1="52" x2="18" y2="52" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="12" y1="64" x2="24" y2="64" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

            {/* Torso slightly leaned forward */}
            <rect x="42" y="38" width="18" height="24" rx="5" fill={shirtColor} transform="rotate(10 51 50)" />
            <circle cx="56" cy="28" r="7.5" fill={skinColor} />
            <path d="M50 26 C50 20 64 20 64 26 Z" fill={hairColor} />

            {/* Pumping Running Legs */}
            <g className="anim-walk-leg-1">
              <line x1="48" y1="60" x2="38" y2="76" stroke={shortsColor} strokeWidth="6" strokeLinecap="round" />
              <line x1="38" y1="76" x2="32" y2="88" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="32" cy="89" rx="5" ry="2.5" fill={shoeColor} />
            </g>

            <g className="anim-walk-leg-2">
              <line x1="54" y1="60" x2="68" y2="74" stroke={shortsColor} strokeWidth="6" strokeLinecap="round" />
              <line x1="68" y1="74" x2="62" y2="87" stroke={skinColor} strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="62" cy="88" rx="5" ry="2.5" fill={shoeColor} />
            </g>

            {/* Running Arms */}
            <g className="anim-walk-arm-1">
              <line x1="46" y1="44" x2="36" y2="56" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="36" y1="56" x2="44" y2="62" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
            </g>
            <g className="anim-walk-arm-2">
              <line x1="56" y1="44" x2="68" y2="54" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="68" y1="54" x2="60" y2="62" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 13. WALKING / CAMINHADA */}
        {exerciseKey === 'walking' && (
          <g>
            {/* Couple walking path with subtle stones */}
            <circle cx="25" cy="92" r="1.5" fill="#64748B" />
            <circle cx="48" cy="92" r="1.5" fill="#64748B" />
            <circle cx="75" cy="92" r="1.5" fill="#64748B" />

            {/* Friendly Breeze Clouds */}
            <path d="M12 28 Q18 25 24 28" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M16 33 Q22 30 28 33" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

            {/* Upright Relaxed Torso */}
            <rect x="42" y="38" width="18" height="25" rx="5" fill={shirtColor} />
            <circle cx="51" cy="28" r="7.5" fill={skinColor} />
            <path d="M44 26 C44 20 58 20 58 26 Z" fill={hairColor} />
            {/* Friendly Smile */}
            <circle cx="49" cy="28" r="1" fill="#0F172A" />
            <circle cx="54" cy="28" r="1" fill="#0F172A" />
            <path d="M50 31 Q52 33 54 31" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />

            {/* Walking Legs */}
            <g className="anim-walk-leg-1">
              <line x1="47" y1="62" x2="42" y2="76" stroke={shortsColor} strokeWidth="5.5" strokeLinecap="round" />
              <line x1="42" y1="76" x2="38" y2="90" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <ellipse cx="38" cy="91" rx="5" ry="2.2" fill={shoeColor} />
            </g>

            <g className="anim-walk-leg-2">
              <line x1="53" y1="62" x2="58" y2="76" stroke={shortsColor} strokeWidth="5.5" strokeLinecap="round" />
              <line x1="58" y1="76" x2="64" y2="90" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <ellipse cx="64" cy="91" rx="5" ry="2.2" fill={shoeColor} />
            </g>

            {/* Natural Swinging Arms */}
            <g className="anim-walk-arm-1">
              <line x1="44" y1="44" x2="36" y2="60" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="36" cy="61" r="2.5" fill={skinColor} />
            </g>
            <g className="anim-walk-arm-2">
              <line x1="58" y1="44" x2="66" y2="60" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="66" cy="61" r="2.5" fill={skinColor} />
            </g>
          </g>
        )}

        {/* 14. SPINNING / BIKE */}
        {exerciseKey === 'spinning' && (
          <g>
            {/* Bike Frame */}
            <line x1="28" y1="72" x2="50" y2="72" stroke="#64748B" strokeWidth="3" />
            <line x1="50" y1="72" x2="68" y2="52" stroke="#64748B" strokeWidth="3" />
            <line x1="50" y1="72" x2="38" y2="54" stroke="#64748B" strokeWidth="3" />
            <line x1="38" y1="54" x2="68" y2="52" stroke="#64748B" strokeWidth="3" />

            {/* Flywheel & Rear Wheel */}
            <circle cx="70" cy="72" r="14" stroke="#38BDF8" strokeWidth="3" fill="#0F172A" />
            <circle cx="28" cy="72" r="10" stroke="#475569" strokeWidth="2" fill="#0F172A" />

            {/* Saddle & Handlebar */}
            <rect x="34" y="52" width="10" height="3" rx="1.5" fill={benchColor} />
            <path d="M66 52 L72 44 L76 44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Rider */}
            <rect x="42" y="38" width="16" height="20" rx="4" fill={shirtColor} transform="rotate(25 50 48)" />
            <circle cx="58" cy="30" r="7" fill={skinColor} />
            <path d="M52 28 C52 22 64 22 64 28 Z" fill={hairColor} />

            {/* Arms to handlebar */}
            <line x1="54" y1="42" x2="72" y2="44" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />

            {/* Spinning Pedals & Legs */}
            <g className="anim-pedal">
              <circle cx="50" cy="72" r="5" fill="#F59E0B" />
              <line x1="50" y1="72" x2="50" y2="60" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="60" r="2.5" fill={shoeColor} />
            </g>
          </g>
        )}

        {/* 15. FALLBACK / GENERAL / CALF / ROW */}
        {(exerciseKey === 'general' || exerciseKey === 'barbell_row' || exerciseKey === 'tricep_pushdown' || exerciseKey === 'calf_raise' || exerciseKey === 'lying_leg_curl' || exerciseKey === 'hip_abduction' || exerciseKey === 'burpee') && (
          <g>
            {/* Dynamic athletic cartoon posture */}
            <rect x="40" y="66" width="7" height="24" rx="3.5" fill={shortsColor} />
            <rect x="53" y="66" width="7" height="24" rx="3.5" fill={shortsColor} />
            <ellipse cx="43.5" cy="91" rx="5" ry="2" fill={shoeColor} />
            <ellipse cx="56.5" cy="91" rx="5" ry="2" fill={shoeColor} />

            <g className="anim-squat">
              <rect x="38" y="38" width="24" height="26" rx="5" fill={shirtColor} />
              <circle cx="50" cy="28" r="8" fill={skinColor} />
              <path d="M42 26 C42 20 58 20 58 26 Z" fill={hairColor} />

              {/* Athletic pose arms holding dumbbells */}
              <line x1="38" y1="44" x2="30" y2="58" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="62" y1="44" x2="70" y2="58" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />

              <rect x="24" y="56" width="12" height="4" rx="2" fill={weightColor} />
              <circle cx="24" cy="58" r="3.5" fill="#38BDF8" />
              <circle cx="36" cy="58" r="3.5" fill="#38BDF8" />

              <rect x="64" y="56" width="12" height="4" rx="2" fill={weightColor} />
              <circle cx="64" cy="58" r="3.5" fill="#38BDF8" />
              <circle cx="76" cy="58" r="3.5" fill="#38BDF8" />

              {highlightMuscles && (
                <circle cx="50" cy="50" r="6" fill={muscleGlowColor} fillOpacity="0.45" className="anim-glow" />
              )}
            </g>
          </g>
        )}
      </svg>

      {/* Mini Animation Badge */}
      <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-sky-300 border border-slate-700/80 pointer-events-none select-none">
        {isPaused ? 'Pausa' : `${speed}x`}
      </span>
    </div>
  );
};
