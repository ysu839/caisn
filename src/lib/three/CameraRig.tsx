"use client";
/* eslint-disable react-hooks/immutability -- idiomatic r3f: the camera object from
   useThree() is a mutable Three.js instance meant to be driven imperatively per-frame. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Keyframe = { at: number; position: [number, number, number]; fov: number };

/**
 * Camera choreography for the exploded sequence — subtle, intentional
 * moves keyed to the same `progress` value driving the garment nodes.
 * The garment nodes fan out along one shared diagonal axis (see
 * garmentModel's layerOffset); the camera drifts up and to the side
 * along a roughly parallel arc so that diagonal spread reads as
 * staggered depth rather than head-on overlap, and never dollies in
 * tight enough to crop the layers it's meant to be revealing.
 */
const KEYFRAMES: Keyframe[] = [
  { at: 0, position: [0, 0, 5.5], fov: 32 },
  { at: 0.2, position: [0.35, 0.15, 5.2], fov: 31 },
  { at: 0.4, position: [0.75, 0.4, 4.8], fov: 30 },
  { at: 0.6, position: [1.05, 0.6, 4.6], fov: 29 },
  { at: 0.8, position: [1.0, 0.75, 5.4], fov: 31 },
  { at: 1, position: [0.55, 0.95, 7.2], fov: 34 },
];

function sampleKeyframes(progress: number): { position: THREE.Vector3; fov: number } {
  const p = Math.min(1, Math.max(0, progress));
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].at && p <= KEYFRAMES[i + 1].at) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const span = b.at - a.at || 1;
  const t = (p - a.at) / span;
  return {
    position: new THREE.Vector3(
      a.position[0] + (b.position[0] - a.position[0]) * t,
      a.position[1] + (b.position[1] - a.position[1]) * t,
      a.position[2] + (b.position[2] - a.position[2]) * t
    ),
    fov: a.fov + (b.fov - a.fov) * t,
  };
}

export function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const targetFov = useRef(32);

  useFrame(() => {
    const sample = sampleKeyframes(progress);
    target.current.copy(sample.position);
    targetFov.current = sample.fov;

    camera.position.lerp(target.current, 0.08);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (targetFov.current - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
