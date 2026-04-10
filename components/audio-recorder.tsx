"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface AudioRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

type RecordingState = "idle" | "recording" | "recorded" | "transcribing";

export default function AudioRecorder({ onTranscript, disabled }: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioBlob = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        audioBlob.current = blob;
        setAudioUrl(URL.createObjectURL(blob));
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.current = recorder;
      recorder.start();
      setState("recording");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorder.current?.stop();
  }, []);

  const discardRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlob.current = null;
    setElapsed(0);
    setState("idle");
  }, [audioUrl]);

  const submitRecording = useCallback(async () => {
    if (!audioBlob.current) return;
    setState("transcribing");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob.current, "recording.webm");

      const res = await fetch("/api/speaking/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onTranscript(data.text);
      // Reset after successful transcription
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioBlob.current = null;
      setElapsed(0);
      setState("idle");
    } catch (err) {
      console.error("Transcription failed:", err);
      setState("recorded"); // Go back so user can retry
    }
  }, [audioUrl, onTranscript]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (disabled) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Idle state - show record button */}
      {state === "idle" && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg active:scale-95"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          Record
        </button>
      )}

      {/* Recording state - show pulsing indicator + timer + stop */}
      {state === "recording" && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium text-red-600">
              Recording {formatTime(elapsed)}
            </span>
          </div>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-full bg-gray-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-900 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop
          </button>
        </div>
      )}

      {/* Recorded state - show playback + submit/discard */}
      {state === "recorded" && audioUrl && (
        <div className="flex flex-col items-center gap-3">
          <audio src={audioUrl} controls className="h-10" />
          <div className="flex gap-2">
            <button
              onClick={discardRecording}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              onClick={submitRecording}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Transcribe & Submit
            </button>
          </div>
        </div>
      )}

      {/* Transcribing state */}
      {state === "transcribing" && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" className="opacity-75" />
          </svg>
          Transcribing...
        </div>
      )}
    </div>
  );
}
