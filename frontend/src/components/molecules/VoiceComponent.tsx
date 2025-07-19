// VoiceCommand.tsx
import React, { useState } from 'react';

const TILES_CONFIG = {
    DIFFICULTIES: {
        easy: { width: 3, height: 4 },
        medium: { width: 4, height: 4 },
        hard: { width: 4, height: 6 },
    },
};


export function VoiceCommand({
    tiles,
    difficulty,
    handleTileClick,
}: {
    tiles: any[];
    difficulty: 'easy' | 'medium' | 'hard';
    handleTileClick: (index: number) => boolean;
}) {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const speak = (text: string) => {
        const u = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(u);
    };

    const parseVoiceCommand = (t: string): string | null => {
        const m = t.match(/([a-z])\s*(\d+)/i);
        console.log(m)
        return m ? `${m[1].toUpperCase()}${m[2]}` : null;
    };

    const chessToIndex = (coord: string) => {
        const { width, height } = TILES_CONFIG.DIFFICULTIES[difficulty];
        const col = coord.charCodeAt(0) - 65;
        const row = parseInt(coord.slice(1), 10);
        if (col < 0 || col >= width || row < 1 || row > height) return null;
        return (row - 1) * width + col;
    };

    const handleAudio = async (blob: Blob) => {
        try {

            const formData = new FormData();
            formData.append("file", blob, "recording.webm");
            const res = await fetch("http://localhost:8000/audio", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            const text = data.text;
            console.log(text)
            const coord = parseVoiceCommand(text);
            if (!coord) return speak("I didn't catch a tile.");
            const idx = chessToIndex(coord);
            if (idx == null || idx >= tiles.length) return speak("That's out of range.");
            const ok = handleTileClick(idx);
            const tile = tiles[idx];
            if (ok) speak(`Tile ${coord} is ${tile.symbolName}`);
            else speak(`Tile ${coord} can't be flipped.`);
        } catch {
            speak("Error understanding speech.");
        }
    };

    const toggleRecord = async () => {
        if (isRecording) {
            mediaRecorder!.stop();
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            const chunks: BlobPart[] = [];
            mr.ondataavailable = e => chunks.push(e.data);
            mr.onstop = () => handleAudio(new Blob(chunks, { type: 'audio/webm' }));
            mr.start();
            setMediaRecorder(mr);
        }
        setIsRecording(!isRecording);
    };

    return (
        <div>
            <button onClick={toggleRecord}>
                {isRecording ? 'Stop' : 'Speak'}
            </button>
        </div>
    );
}
