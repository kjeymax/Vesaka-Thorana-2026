"use client";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { createThoranaEngine } from "@/lib/thoranaEngine";

const PandalCanvas = forwardRef(({ currentPattern, patternSpeed, isLightsOn, performanceMode, onPanelClick }, ref) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    launchFirework: () => {
      if (engineRef.current && engineRef.current.launchFirework) {
        engineRef.current.launchFirework();
      }
    },
    captureScreenshot: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL("image/jpeg", 0.9);
      }
      return null;
    },
    setCustomColors: (colors) => {
      if (engineRef.current && engineRef.current.setCustomColors) {
        engineRef.current.setCustomColors(colors);
      }
    },
    setAudioEnergy: (energy) => {
      if (engineRef.current && engineRef.current.setAudioEnergy) {
        engineRef.current.setAudioEnergy(energy);
      }
    },
    spawnLamp: () => {
      if (engineRef.current && engineRef.current.spawnLamp) {
        engineRef.current.spawnLamp();
      }
    },
    spawnLotus: (color) => {
      if (engineRef.current && engineRef.current.spawnLotus) {
        engineRef.current.spawnLotus(color);
      }
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize the engine with the canvas and click callback
    engineRef.current = createThoranaEngine(canvasRef.current, onPanelClick);
    engineRef.current.init();

    return () => {
      if (engineRef.current && engineRef.current.destroy) {
        engineRef.current.destroy();
      }
    };
  }, []); // <-- Removed onPanelClick from dependencies to prevent engine re-initialization

  useEffect(() => {
    if (engineRef.current && engineRef.current.setPattern) {
      engineRef.current.setPattern(currentPattern);
    }
  }, [currentPattern]);

  useEffect(() => {
    if (engineRef.current && engineRef.current.setSpeed) {
      engineRef.current.setSpeed(patternSpeed);
    }
  }, [patternSpeed]);

  useEffect(() => {
    if (engineRef.current && engineRef.current.setLightsStatus) {
      engineRef.current.setLightsStatus(isLightsOn);
    }
  }, [isLightsOn]);

  useEffect(() => {
    if (engineRef.current && engineRef.current.setPerformanceMode) {
      engineRef.current.setPerformanceMode(performanceMode);
    }
  }, [performanceMode]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="block bg-transparent cursor-pointer w-full h-full object-contain"
      />
    </div>
  );
});

export default PandalCanvas;
