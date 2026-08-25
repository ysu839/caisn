/**
 * Shared garment model — the contract between commerce data, the
 * interactive viewer, and the exploded/unboxing sequence. Both
 * experiences read the SAME node list and the SAME normalized
 * `explosionProgress` (0 = assembled, 1 = fully decomposed).
 *
 * ── REAL ASSET REPLACEMENT ──────────────────────────────────────
 * Today every node is `render: "procedural"` — a stylized primitive
 * standing in for garment geometry. A production glTF only needs to:
 *   1. Ship one mesh/group per node, named to match `gltfNodeName`.
 *   2. Keep the same `part` classification (shell/structure/interior/
 *      hardware) so stage timing and annotations stay correct.
 *   3. Provide its own rest position/rotation/scale for `assembled`
 *      (the "exploded" offsets can stay app-authored, or the asset
 *      can supply them too via the same shape).
 * Then set `render: "gltf"` + `gltfNodeName` per node — nothing in
 * GarmentScene, the camera rig, or the scroll orchestration changes.
 * ─────────────────────────────────────────────────────────────────
 */

export type Transform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type GarmentPart = "shell" | "structure" | "interior" | "hardware";

export type GarmentNode = {
  id: string;
  part: GarmentPart;
  /** [start, end] window within explosionProgress where this node animates. */
  stageWindow: [number, number];
  assembled: Transform;
  exploded: Transform;
  render: "procedural";
  proceduralGeometry:
    | { kind: "panel"; width: number; height: number; depth: number }
    | { kind: "frame"; width: number; height: number; depth: number }
    | { kind: "plate"; width: number; height: number; depth: number }
    | { kind: "hardware"; radius: number; length: number };
  /** CAISN technical annotation, shown once this node's stage is reached. */
  label: string;
  spec: string;
};

/** Conceptual milestones — used for annotation gating and QA, not separate timelines. */
export const STAGES = [
  { id: 0, name: "ASSEMBLED", at: 0 },
  { id: 1, name: "SHELL", at: 0.15 },
  { id: 2, name: "STRUCTURE", at: 0.35 },
  { id: 3, name: "INTERIOR", at: 0.5 },
  { id: 4, name: "HARDWARE", at: 0.65 },
  { id: 5, name: "FULL DECONSTRUCTION", at: 0.95 },
] as const;

const identity: Transform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

/**
 * The single shared archetype used across all products until real
 * per-product garment scans exist. Product spec text (from commerce
 * data) is layered on top as annotation copy, not baked into geometry.
 *
 * ── EXPLODED COMPOSITION ─────────────────────────────────────────
 * Nodes are arranged as a technical exploded drawing, not scattered
 * debris: each node sits on one shared diagonal "assembly axis" at
 * an integer layer index (-2..+2), matching real construction order
 * front-to-back (shell / structure / lining anchor / hardware /
 * shell). Exploding moves each layer a fixed distance along that
 * SAME axis, scaled by |layerIndex| — so spacing stays proportional
 * and nothing needs to fly further than its neighbor to stay clear
 * of it. The interior lining sits at layer 0 and barely moves,
 * acting as a visual anchor the rest of the drawing fans out from.
 * ─────────────────────────────────────────────────────────────────
 */
const AXIS = { x: 0.6, y: 0.42, z: 1.1 }; // per-layer step along the shared diagonal

function layerOffset(layer: number, lateral = 0): [number, number, number] {
  return [layer * AXIS.x + lateral, layer * AXIS.y, layer * AXIS.z];
}

export function buildGarmentNodes(spec: string): GarmentNode[] {
  return [
    {
      id: "shell-front",
      part: "shell",
      stageWindow: [0.15, 0.38],
      assembled: { ...identity, position: [0, 0, 0.06] },
      // hinges open like a door rather than translating flat-on — cuts its
      // projected footprint so deeper layers stay readable through the gap.
      exploded: { position: layerOffset(2), rotation: [0, 0.55, 0], scale: [1, 1, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "panel", width: 1.6, height: 2.1, depth: 0.03 },
      label: "SHELL / FRONT",
      spec,
    },
    {
      id: "structure-frame",
      part: "structure",
      stageWindow: [0.3, 0.55],
      assembled: { ...identity, position: [0, 0, 0] },
      exploded: { position: layerOffset(1), rotation: [0, 0.3, 0], scale: [1, 1, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "frame", width: 1.5, height: 2, depth: 0.4 },
      label: "SEAM / DOUBLE-STITCH",
      spec: "STRUCTURAL FRAME",
    },
    {
      id: "interior-lining",
      part: "interior",
      stageWindow: [0.45, 0.68],
      assembled: { ...identity, position: [0, 0, 0.01], scale: [0.94, 0.94, 1] },
      exploded: { position: layerOffset(0), rotation: [0, 0, 0], scale: [0.94, 0.94, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "plate", width: 1.5, height: 1.95, depth: 0.02 },
      label: "LINING / 01",
      spec: "INTERIOR LAYER",
    },
    {
      id: "hardware-01",
      part: "hardware",
      stageWindow: [0.6, 0.85],
      assembled: { position: [0.5, 0.7, 0.08], rotation: [1.57, 0, 0], scale: [1, 1, 1] },
      exploded: { position: layerOffset(-1, 0.22), rotation: [1.57, 0.3, 0], scale: [1, 1, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "hardware", radius: 0.05, length: 0.12 },
      label: "HARDWARE / 12MM",
      spec: "SOLID BRASS",
    },
    {
      id: "hardware-02",
      part: "hardware",
      stageWindow: [0.63, 0.88],
      assembled: { position: [0.5, -0.5, 0.08], rotation: [1.57, 0, 0], scale: [1, 1, 1] },
      exploded: { position: layerOffset(-1, -0.22), rotation: [1.57, -0.3, 0], scale: [1, 1, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "hardware", radius: 0.05, length: 0.12 },
      label: "HARDWARE / 12MM",
      spec: "SOLID BRASS",
    },
    {
      id: "shell-back",
      part: "shell",
      stageWindow: [0.15, 0.38],
      assembled: { ...identity, position: [0, 0, -0.06] },
      exploded: { position: layerOffset(-2), rotation: [0, -0.55, 0], scale: [1, 1, 1] },
      render: "procedural",
      proceduralGeometry: { kind: "panel", width: 1.6, height: 2.1, depth: 0.03 },
      label: "SHELL / BACK",
      spec,
    },
  ];
}

/** Remap explosionProgress (0-1) into a node's local, eased 0-1 window. */
export function nodeLocalProgress(progress: number, [start, end]: [number, number]): number {
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  // easeInOutCubic — matches the "drift" motion language, no linear snaps.
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const MAX_VISIBLE_ANNOTATIONS = 3;

/**
 * Nodes whose stage has been reached at the current progress —
 * surfaced as a DOM annotation panel rather than floating 3D labels
 * (which collide unreadably under projection and read as generic
 * WebGL-demo clutter, not CAISN's editorial voice). Capped to the
 * most recently revealed nodes so the panel never accumulates into
 * a wall of text by the end of the sequence.
 */
export function activeAnnotations(nodes: GarmentNode[], progress: number): GarmentNode[] {
  return nodes
    .filter((n) => nodeLocalProgress(progress, n.stageWindow) > 0.1)
    .sort((a, b) => b.stageWindow[0] - a.stageWindow[0])
    .slice(0, MAX_VISIBLE_ANNOTATIONS)
    .sort((a, b) => a.stageWindow[0] - b.stageWindow[0]);
}

export function lerpTransform(a: Transform, b: Transform, t: number): Transform {
  const lerp3 = (u: [number, number, number], v: [number, number, number]): [number, number, number] => [
    u[0] + (v[0] - u[0]) * t,
    u[1] + (v[1] - u[1]) * t,
    u[2] + (v[2] - u[2]) * t,
  ];
  return {
    position: lerp3(a.position, b.position),
    rotation: lerp3(a.rotation, b.rotation),
    scale: lerp3(a.scale, b.scale),
  };
}
