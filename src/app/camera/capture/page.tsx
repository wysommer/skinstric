'use client';
import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CameraCapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captured, setCaptured] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices && videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
    }
    setupCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
        setCaptured(true);
        setShowModal(true);
      }
    }
  };

  const handleProceed = async () => {
    setLoading(true);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      try {
        const res = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        });
        const result = await res.json();
        localStorage.setItem('skinstric-demographics', JSON.stringify(result.data));
        router.push('/summary');
      } catch (e) {
        alert('Failed to process image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="camera-capture-bg">
      <Header />
      <video ref={videoRef} autoPlay playsInline className="camera-capture-video-bg" style={{ display: captured ? 'none' : 'block' }} />
      <canvas ref={canvasRef} className="camera-capture-canvas-bg" style={{ display: captured ? 'block' : 'none' }} />
      <div className="camera-capture-overlay">
        {!captured && (
          <button className="camera-capture-btn" onClick={handleCapture} aria-label="Take Picture">
            <Image src="/images/camera.png" alt="Take Picture" width={48} height={48} />
            <span className="camera-capture-btn-text">TAKE PICTURE</span>
          </button>
        )}
        {showModal && (
          <div className="camera-capture-modal">
            <div className="camera-capture-modal-content">
              <div className="camera-capture-modal-title">GREAT SHOT</div>
              <div className="camera-capture-modal-desc">PROCEED FOR SUMMARY</div>
              <button className="camera-capture-proceed-btn animate-slide-in" onClick={handleProceed} disabled={loading}>
                PROCEED
              </button>
            </div>
          </div>
        )}
        <div className="camera-capture-bottom">
          <div className="instructions-title white">TO GET BETTER RESULTS MAKE SURE TO HAVE</div>
          <div className="instructions-row white">
            <span className="diamond white" /> NEUTRAL EXPRESSION
            <span className="mx-4"><span className="diamond white" /> FRONTAL POSE</span>
            <span className="diamond white" /> ADEQUATE LIGHTING
          </div>
        </div>
        <div className="camera-capture-back">
          <BackButton />
        </div>
      </div>
      <style jsx global>{`
        .camera-capture-bg {
          min-height: 100vh;
          min-width: 100vw;
          background: #000;
          position: relative;
          overflow: hidden;
          color: #fff;
        }
        .camera-capture-video-bg, .camera-capture-canvas-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 1;
          background: #222;
        }
        .camera-capture-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2;
          pointer-events: none;
        }
        .camera-capture-btn {
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.12);
          border: 2px solid #fff;
          border-radius: 50%;
          width: 72px;
          height: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          pointer-events: auto;
          padding: 0;
        }
        .camera-capture-btn img {
          width: 32px;
          height: 32px;
          margin: 0;
          padding: 0;
        }
        .camera-capture-btn-text {
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 0.9rem;
          color: #fff;
          margin: 0;
        }
        .camera-capture-modal {
          position: fixed;
          inset: 0;
          background: rgba(30,30,30,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          pointer-events: auto;
        }
        .camera-capture-modal-content {
          background: rgba(0,0,0,0.85);
          border-radius: 18px;
          padding: 48px 40px 36px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .camera-capture-modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .camera-capture-modal-desc {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 32px;
        }
        .camera-capture-proceed-btn {
          background: #fff;
          color: #222;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 12px 36px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: background 0.2s;
        }
        .camera-capture-proceed-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .camera-capture-bottom {
          position: absolute;
          bottom: 32px;
          left: 0;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          pointer-events: auto;
        }
        .instructions-title.white, .instructions-row.white, .diamond.white {
          color: #fff !important;
          border-color: #fff !important;
        }
        .camera-capture-back {
          position: absolute;
          bottom: 32px;
          left: 32px;
          z-index: 10;
          pointer-events: auto;
        }
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(-50vw);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
        .camera-capture-bg .text-black, .camera-capture-bg .border-black, .camera-capture-bg .text-gray-500 {
          color: #fff !important;
          border-color: #fff !important;
        }
        .camera-capture-bg .border-black {
          border-color: #fff !important;
        }
        .camera-capture-bg .bg-black {
          background: rgba(0,0,0,0.7) !important;
        }
        .diamond {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 8px;
          transform: rotate(45deg);
          border: 2px solid currentColor;
        }
        .diamond.white {
          border-color: #fff;
        }
      `}</style>
    </div>
  );
} 