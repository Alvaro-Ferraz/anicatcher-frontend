import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import linkStartVideo from '../../assets/link-start.mp4';

const VoiceStart: React.FC = () => {
    const [status, setStatus] = useState('Aguardando microfone...');
    const [showVideo, setShowVideo] = useState(false);

    const recognitionRef = useRef<any>(null);
    const detectedRef = useRef(false);
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setStatus('Reconhecimento de voz não suportado.');
            return;
        }

        const rec = new SpeechRecognition();
        recognitionRef.current = rec;

        rec.lang = 'pt-BR';
        rec.interimResults = true;
        rec.continuous = true;

        rec.onstart = () => setStatus('Ouvindo...');
        rec.onerror = () => setStatus('Erro no reconhecimento');

        rec.onresult = (event: any) => {
            if (detectedRef.current) return;

            let full = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                full += event.results[i][0].transcript + ' ';
            }

            const normalize = (s: string) =>
                s
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9 ]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

            const normalized = normalize(full);

            const pattern =
                /\b(link|linki|linkin|linque)\s*(start|starti|starto|starte|starta)\b/;

            if (pattern.test(normalized)) {
                detectedRef.current = true;
                setStatus('Comando detectado');

                try {
                    rec.stop();
                } catch {}

                setShowVideo(true);
            }
        };

        try {
            rec.start();
        } catch {
            setStatus('Permita o microfone.');
        }

        return () => {
            try {
                rec.stop();
            } catch {}
        };
    }, []);

    return (
        <div className="w-screen h-screen bg-[#0d121d]">
            {!showVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <h1 className="text-4xl font-medium text-white">
                            <span className="text-[#bfe7ff]">Link start</span>
                        </h1>
                        <p className="mt-4 text-white/60 text-sm">{status}</p>
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={linkStartVideo}
                    autoPlay
                    playsInline
                    onEnded={() => navigate('/home')}
                />
            )}

            <button
                onClick={() => {
                    detectedRef.current = true;
                    setStatus('Pulando...');
                    try {
                        recognitionRef.current?.stop();
                    } catch {}

                    if (!showVideo) {
                        navigate('/home');
                        return;
                    }

                    try {
                        videoRef.current?.pause();
                    } catch {}

                    navigate('/home');
                }}
                aria-label="Pular etapa"
                className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-[#bfe7ff] text-[#0d121d] rounded-full font-medium shadow-lg"
            >
                Pular
            </button>
        </div>
    );
};

export default VoiceStart;
