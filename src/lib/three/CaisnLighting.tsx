"use client";

/**
 * One shared CAISN lighting rig, reused across every product — soft,
 * directional, architectural. Readability comes from geometry and
 * light, not reflections: no environment maps, no glossy materials.
 */
export function CaisnLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#f6f5f2" />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.1}
        color="#ffffff"
        castShadow={false}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#d8d6d0" />
      <hemisphereLight args={["#f6f5f2", "#0a0a0a", 0.25]} />
    </>
  );
}
