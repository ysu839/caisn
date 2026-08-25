"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  GarmentNode,
  buildGarmentNodes,
  lerpTransform,
  nodeLocalProgress,
} from "@/lib/three/garmentModel";
import { CaisnLighting } from "@/lib/three/CaisnLighting";

const PART_COLOR: Record<GarmentNode["part"], string> = {
  shell: "#0a0a0a",
  structure: "#4a4a46",
  interior: "#d8d6d0",
  hardware: "#b5651d",
};

function NodeGeometry({ node }: { node: GarmentNode }) {
  const g = node.proceduralGeometry;
  if (g.kind === "hardware") {
    return <cylinderGeometry args={[g.radius, g.radius, g.length, 20]} />;
  }
  if (g.kind === "frame") {
    return <boxGeometry args={[g.width, g.height, g.depth]} />;
  }
  return <boxGeometry args={[g.width, g.height, g.depth]} />;
}

function GarmentNodeMesh({ node, progress }: { node: GarmentNode; progress: number }) {
  const t = nodeLocalProgress(progress, node.stageWindow);
  const transform = useMemo(() => lerpTransform(node.assembled, node.exploded, t), [node, t]);
  const isFrame = node.proceduralGeometry.kind === "frame";
  const isHardware = node.proceduralGeometry.kind === "hardware";

  return (
    <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <mesh>
        <NodeGeometry node={node} />
        <meshStandardMaterial
          color={PART_COLOR[node.part]}
          roughness={isHardware ? 0.45 : 0.85}
          metalness={isHardware ? 0.6 : 0.05}
          wireframe={isFrame}
          transparent={node.part === "interior"}
          opacity={node.part === "interior" ? 0.85 : 1}
        />
      </mesh>
    </group>
  );
}

/**
 * The one shared scene both ProductViewer (assembled, orbit-only) and
 * the exploded/unboxing sequence (scroll-driven progress) render.
 * `progress` is the single source of truth — no per-component timelines.
 */
export function GarmentScene({
  spec,
  progress,
  rotation,
}: {
  spec: string;
  progress: number;
  rotation: { x: number; y: number };
}) {
  const nodes = useMemo(() => buildGarmentNodes(spec), [spec]);
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} rotation={[rotation.x, rotation.y, 0]}>
      <CaisnLighting />
      {nodes.map((node) => (
        <GarmentNodeMesh key={node.id} node={node} progress={progress} />
      ))}
    </group>
  );
}
