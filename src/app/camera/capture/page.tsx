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
        // Set canvas dimensions to match video's display size
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        const aspectRatio = videoWidth / videoHeight;
        
        // Calculate dimensions to maintain aspect ratio while filling the viewport
        let drawWidth = window.innerWidth;
        let drawHeight = window.innerHeight;
        
        if (drawWidth / drawHeight > aspectRatio) {
          drawWidth = drawHeight * aspectRatio;
        } else {
          drawHeight = drawWidth / aspectRatio;
        }
        
        // Set canvas size to match video's display size
        canvasRef.current.width = drawWidth;
        canvasRef.current.height = drawHeight;
        
        // Draw the video frame maintaining aspect ratio
        ctx.drawImage(
          videoRef.current,
          0, 0, videoWidth, videoHeight,
          0, 0, drawWidth, drawHeight
        );
        
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
      {captured && (
        <div className="camera-capture-proceed-container">
          <button
            className="camera-capture-proceed-btn"
            onClick={handleProceed}
            disabled={loading}
            aria-label="Proceed to next step"
          >
            PROCEED
            <div className="proceed-arrow">
              <div className="proceed-square" />
              <svg
                viewBox="0 0 16 16"
                className="proceed-triangle"
                width={24}
                height={24}
                fill="none"
              >
                <polygon points="5,3 12,8 5,13" fill="#fff" />
              </svg>
            </div>
          </button>
        </div>
      )}
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
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 1;
          background: #222;
        }
        .camera-capture-canvas-bg {
          object-fit: contain;
        }
        .camera-capture-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2;
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
          background: rgba(30,30,30,0.25);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
          z-index: 90;
          pointer-events: none;
        }
        .camera-capture-modal-content {
          background: rgba(47, 47, 47, 0.27);
          border-radius: 18px;
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          position: relative;
          z-index: 91;
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
        }
        .camera-capture-bottom {
          position: absolute;
          bottom: 32px;
          left: 0;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 100;
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
          z-index: 100;
          pointer-events: auto;
        }
        .camera-capture-proceed-container {
          position: fixed;
          right: 32px;
          bottom: 32px;
          z-index: 100;
        }
        .camera-capture-proceed-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          background: none;
          border: none;
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          white-space: nowrap;
          position: relative;
          z-index: 101;
        }
        .camera-capture-proceed-btn:hover {
          text-decoration: underline;
        }
        .camera-capture-proceed-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .proceed-arrow {
          position: relative;
          width: 40px;
          height: 40px;
          margin-left: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .proceed-square {
          position: absolute;
          inset: 0;
          border: 1px solid #fff;
          transform: rotate(45deg);
        }
        .proceed-triangle {
          position: relative;
          z-index: 1;
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