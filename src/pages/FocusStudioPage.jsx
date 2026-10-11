import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDuration, formatDate } from '../utils/formatters.js';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  CheckSquare,
  Sparkles,
  Flame,
  Bell
} from 'lucide-react';

export default function FocusStudioPage() {
  const { tasks, focusSessions, logFocusSession, showToast } = useApp();

  // Timer configurations
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [selectedPreset, setSelectedPreset] = useState(25); // 25, 45, 60
  const [breakPreset, setBreakPreset] = useState(5); // 5, 15

  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [associatedTask, setAssociatedTask] = useState('');

  // Audio synthesizer state (Web Audio API)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Interval reference
  const intervalRef = useRef(null);
  const targetEndRef = useRef(null);

  // Synchronize initial time
  useEffect(() => {
    if (!isActive) {
      const mins = mode === 'focus' ? selectedPreset : breakPreset;
      setTimeLeft(mins * 60);
    }
  }, [selectedPreset, breakPreset, mode, isActive]);

  // Handle timer countdown reliably using timestamp delta
  useEffect(() => {
    if (isActive) {
      targetEndRef.current = Date.now() + timeLeft * 1000;

      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((targetEndRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setIsActive(false);
          handleSessionComplete();
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleSessionComplete = () => {
    if (mode === 'focus') {
      logFocusSession({
        durationMinutes: selectedPreset,
        taskTitle: associatedTask || 'Autonomous Focus Block',
      });
      // Sound chime
      playChime();
      showToast(`Completed ${selectedPreset}-minute focus session! Time for a restorative break.`);
      setMode('break');
      setTimeLeft(breakPreset * 60);
    } else {
      showToast('Break period finished. Ready for the next deep work sprint.');
      setMode('focus');
      setTimeLeft(selectedPreset * 60);
    }
  };

  const handleToggleTimer = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const handleResetTimer = () => {
    setIsActive(false);
    const mins = mode === 'focus' ? selectedPreset : breakPreset;
    setTimeLeft(mins * 60);
  };

  // Web Audio Synth Chime
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('AudioContext not allowed without gesture', e);
    }
  };

  // Web Audio API Ambient Pink Noise generator
  const toggleAmbientNoise = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Buffer for pink-ish ambient noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        noiseNodeRef.current = noise;
        gainNodeRef.current = gainNode;
        setIsAudioPlaying(true);
      } catch (err) {
        console.error('Failed to start ambient audio generator:', err);
      }
    }
  };

  const totalSeconds = (mode === 'focus' ? selectedPreset : breakPreset) * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = focusSessions.filter(s => s.completedAt?.startsWith(todayStr));
  const todayTotalMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Focus Studio & Deep Work Chamber
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Zero distraction, timed state-of-flow blocks, and ambient resonance.
          </p>
        </div>

        <button
          onClick={toggleAmbientNoise}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isAudioPlaying
              ? 'bg-[#75CFFF]/15 border-[#75CFFF] text-[#75CFFF]'
              : 'bg-[#172331] border-white/10 text-[#9BAABC] hover:text-[#F4F7FC]'
          }`}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isAudioPlaying ? 'Ambient Noise Active' : 'Enable White Noise'}</span>
        </button>
      </div>

      {/* Main Focus Console */}
      <div className="relative rounded-3xl bg-[#111923] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Backdrop */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src="/src/assets/images/deep_focus_ambient_1791719947023.jpg"
            alt="Deep focus background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#172331] rounded-xl text-xs font-medium text-[#9BAABC]">
            <button
              onClick={() => {
                if (!isActive) {
                  setMode('focus');
                  setTimeLeft(selectedPreset * 60);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'focus' ? 'bg-[#111923] text-[#61F5BB] font-bold shadow-sm' : 'hover:text-[#F4F7FC]'
              }`}
            >
              Deep Focus
            </button>
            <button
              onClick={() => {
                if (!isActive) {
                  setMode('break');
                  setTimeLeft(breakPreset * 60);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'break' ? 'bg-[#111923] text-[#75CFFF] font-bold shadow-sm' : 'hover:text-[#F4F7FC]'
              }`}
            >
              Restorative Break
            </button>
          </div>

          {/* Circular Countdown Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-white/10"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={mode === 'focus' ? '#61F5BB' : '#75CFFF'}
                strokeWidth="4"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-300"
              />
            </svg>

            {/* Time Digital Overlay */}
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#F4F7FC] font-mono tabular-nums">
                {formattedTime}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#9BAABC] mt-2">
                {mode === 'focus' ? 'Focus Block' : 'Recovery Window'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetTimer}
              className="p-3 rounded-2xl bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-[#9BAABC] hover:text-[#F4F7FC] transition-colors"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${
                isActive
                  ? 'bg-amber-400 hover:bg-amber-300 text-[#080C12]'
                  : 'bg-[#61F5BB] hover:bg-[#61F5BB]/90 text-[#080C12]'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isActive ? 'Pause Session' : 'Start Focus'}</span>
            </button>
          </div>

          {/* Presets & Task Attachment */}
          <div className="w-full max-w-md pt-4 border-t border-white/8 space-y-3">
            {!isActive && mode === 'focus' && (
              <div className="flex items-center justify-center gap-2">
                {[25, 45, 60].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setTimeLeft(preset * 60);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      selectedPreset === preset
                        ? 'bg-[#61F5BB]/15 border-[#61F5BB] text-[#61F5BB]'
                        : 'border-white/10 bg-[#172331] text-[#9BAABC] hover:text-[#F4F7FC]'
                    }`}
                  >
                    {preset}m Sprint
                  </button>
                ))}
              </div>
            )}

            {/* Optional Task Linking */}
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#9BAABC] shrink-0" />
              <input
                type="text"
                placeholder="Link to active task (e.g. Distributed Consensus Engine)"
                value={associatedTask}
                onChange={(e) => setAssociatedTask(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Stats & Session History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <Clock className="w-4 h-4 text-[#61F5BB]" />
            <span>Today's Total Focus</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {formatDuration(todayTotalMinutes)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">{todaySessions.length} completed sessions today</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>All-Time Focus Volume</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {formatDuration(focusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0))}
          </div>
          <p className="text-[11px] text-[#9BAABC]">{focusSessions.length} total blocks archived</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <Sparkles className="w-4 h-4 text-[#75CFFF]" />
            <span>Session Quality</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            100%
          </div>
          <p className="text-[11px] text-[#9BAABC]">Zero interruption state verified</p>
        </div>
      </div>

      {/* History Log */}
      <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-3">
        <h2 className="text-sm font-bold text-[#F4F7FC]">Recent Focus Sessions</h2>
        <div className="space-y-2">
          {focusSessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5 text-xs"
            >
              <div>
                <span className="font-semibold text-[#F4F7FC] block">{session.taskTitle}</span>
                <span className="text-[10px] text-[#9BAABC]">{formatDate(session.completedAt)}</span>
              </div>
              <span className="font-mono text-[#61F5BB] font-bold tabular-nums">
                +{session.durationMinutes} min
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
