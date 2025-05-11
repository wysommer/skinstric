'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './camera.css';
import Image from 'next/image';

export default function CameraLoadingPage() {
  const router = useRouter();

  // Simulate loading before navigating to /camera/capture
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/camera/capture');
    }, 2000); // 2 seconds loading
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="camera-loading-container">
      <div className="rotating-squares">
        <div className="square square1" />
        <div className="square square2" />
        <div className="square square3" />
        <div className="square square4" />
        <div className="camera-icon">
          <Image src="/images/camera.png" alt="Camera" width={80} height={80} />
        </div>
      </div>
      <div className="setup-text">SETTING UP CAMERA ...</div>
      <div className="instructions-title">TO GET BETTER RESULTS MAKE SURE TO HAVE</div>
      <div className="instructions-row">
        <span className="diamond" /> NEUTRAL EXPRESSION
        <span className="diamond" /> FRONTAL POSE
        <span className="diamond" /> ADEQUATE LIGHTING
      </div>
    </div>
  );
} 