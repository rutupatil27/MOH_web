"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * One palette for every instrument in the site's 3D scenes, so a drum kit and
 * a guitar look like they were photographed in the same room.
 */
export function useInstrumentMaterials() {
  const mats = useMemo(() => {
    const lacquer = new THREE.MeshPhysicalMaterial({
      color: "#17130e",
      metalness: 0.55,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.22,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#e8bb70",
      metalness: 1,
      roughness: 0.24,
      emissive: new THREE.Color("#4a3313"),
      emissiveIntensity: 0.5,
    });
    const brushedGold = new THREE.MeshStandardMaterial({
      color: "#c99752",
      metalness: 1,
      roughness: 0.42,
    });
    const ebony = new THREE.MeshStandardMaterial({
      color: "#0a0908",
      metalness: 0.3,
      roughness: 0.55,
    });
    const ivory = new THREE.MeshStandardMaterial({
      color: "#f5f1e8",
      metalness: 0.05,
      roughness: 0.42,
    });
    const skin = new THREE.MeshStandardMaterial({
      color: "#e6ded0",
      metalness: 0.02,
      roughness: 0.72,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: "#6f6a63",
      metalness: 1,
      roughness: 0.3,
    });
    return { lacquer, gold, brushedGold, ebony, ivory, skin, chrome };
  }, []);

  useEffect(
    () => () => Object.values(mats).forEach((m) => m.dispose()),
    [mats]
  );

  return mats;
}

export type InstrumentMaterials = ReturnType<typeof useInstrumentMaterials>;
