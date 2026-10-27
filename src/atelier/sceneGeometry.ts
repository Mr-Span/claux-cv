import * as THREE from "three";

export type AtelierZone = "automation" | "code" | "quadyx";

export const atelierPalette = {
  teal: "#0D4547",
  amber: "#D99A2B",
  parchment: "#F2E2C8",
  cocoa: "#3B2E2A",
  clay: "#A65F45",
  eucalyptus: "#9BB8AD",
} as const;

type Matte = THREE.MeshStandardMaterial;

export interface AtelierModel {
  group: THREE.Group;
  zones: Record<AtelierZone, THREE.Group>;
  hitTargets: THREE.Object3D[];
  update: (
    time: number,
    zone: AtelierZone,
    exception: boolean,
    obstacleIndex: number,
    tested: boolean,
    moving: boolean,
    hover: AtelierZone | null,
  ) => void;
  dispose: () => void;
}

interface BuildOptions {
  compact?: boolean;
  checkpoint?: () => Promise<void>;
}

/** The model is an explanatory miniature, not a hardware specification for S1. */
export async function buildAtelier({
  compact = false,
  checkpoint,
}: BuildOptions = {}): Promise<AtelierModel> {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const sharedGeometry = new Map<string, THREE.BufferGeometry>();
  const sharedGeometrySet = new Set<THREE.BufferGeometry>();
  const geometryFor = (key: string, create: () => THREE.BufferGeometry) => {
    let geometry = sharedGeometry.get(key);
    if (!geometry) {
      geometry = create();
      sharedGeometry.set(key, geometry);
      sharedGeometrySet.add(geometry);
    }
    return geometry;
  };
  const dispose = () => {
    const geometries = new Set(sharedGeometrySet);
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) geometries.add(object.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    group.clear();
  };
  const makeMat = (
    color: string,
    extra: THREE.MeshStandardMaterialParameters = {},
  ) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.86,
      metalness: 0.035,
      ...extra,
    });
    materials.push(material);
    return material;
  };
  const m = {
    teal: makeMat(atelierPalette.teal),
    amber: makeMat(atelierPalette.amber),
    parchment: makeMat(atelierPalette.parchment),
    cocoa: makeMat(atelierPalette.cocoa),
    clay: makeMat(atelierPalette.clay),
    eucalyptus: makeMat(atelierPalette.eucalyptus),
  };
  const screenMaterial = makeMat(atelierPalette.teal, {
    roughness: 1,
    emissive: atelierPalette.teal,
    emissiveIntensity: 0.12,
  });
  const activeMaterials: Record<AtelierZone, Matte> = {
    automation: makeMat(atelierPalette.amber, {
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    }),
    code: makeMat(atelierPalette.amber, {
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    }),
    quadyx: makeMat(atelierPalette.amber, {
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    }),
  };
  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number] = [0, 0, 0],
  ) => {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.castShadow = !compact;
    object.receiveShadow = !compact;
    parent.add(object);
    return object;
  };
  const roundedShape = (width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    const x = -width / 2,
      y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  };
  const box = (
    width: number,
    height: number,
    depth: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
    radius = 0.05,
  ) => {
    const bevel = Math.min(radius * 0.45, depth * 0.2, height * 0.2);
    const geometry = geometryFor(
      `box:${width}:${height}:${depth}:${radius}`,
      () => {
        const result = new THREE.ExtrudeGeometry(
          roundedShape(width - bevel * 2, height - bevel * 2, radius),
          {
            depth: depth - bevel * 2,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: compact ? 2 : 3,
            curveSegments: compact ? 5 : 8,
            steps: 1,
          },
        );
        result.translate(0, 0, -depth / 2 + bevel);
        return result;
      },
    );
    return mesh(geometry, material, parent, position);
  };
  const slab = (
    width: number,
    depth: number,
    height: number,
    radius: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
  ) => {
    const bevel = Math.min(height * 0.15, 0.04);
    const geometry = geometryFor(
      `slab:${width}:${depth}:${height}:${radius}`,
      () => {
        const result = new THREE.ExtrudeGeometry(
          roundedShape(width - 2 * bevel, depth - 2 * bevel, radius),
          {
            depth: height - 2 * bevel,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: compact ? 2 : 3,
            curveSegments: compact ? 8 : 16,
          },
        );
        result.translate(0, 0, -height / 2 + bevel);
        result.rotateX(-Math.PI / 2);
        return result;
      },
    );
    return mesh(geometry, material, parent, position);
  };
  const cylinder = (
    radius: number,
    height: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
    topRadius = radius,
  ) =>
    mesh(
      geometryFor(
        `cylinder:${topRadius}:${radius}:${height}`,
        () =>
          new THREE.CylinderGeometry(
            topRadius,
            radius,
            height,
            compact ? 20 : 32,
          ),
      ),
      material,
      parent,
      position,
    );
  const sphere = (
    radius: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
  ) =>
    mesh(
      geometryFor(
        `sphere:${radius}`,
        () =>
          new THREE.SphereGeometry(
            radius,
            compact ? 14 : 20,
            compact ? 10 : 14,
          ),
      ),
      material,
      parent,
      position,
    );
  const ring = (
    radius: number,
    thickness: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
    horizontal = true,
  ) => {
    const object = mesh(
      geometryFor(
        `ring:${radius}:${thickness}`,
        () =>
          new THREE.TorusGeometry(
            radius,
            thickness,
            compact ? 8 : 10,
            compact ? 32 : 48,
          ),
      ),
      material,
      parent,
      position,
    );
    if (horizontal) object.rotation.x = Math.PI / 2;
    return object;
  };
  const rod = (
    from: THREE.Vector3,
    to: THREE.Vector3,
    radius: number,
    material: THREE.Material,
    parent: THREE.Object3D,
  ) => {
    const vector = new THREE.Vector3().subVectors(to, from);
    const object = cylinder(radius, 1, material, parent, [0, 0, 0]);
    object.scale.y = vector.length();
    object.position.copy(from).addScaledVector(vector, 0.5);
    object.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      vector.normalize(),
    );
    return object;
  };
  const point = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  try {
    // A single broad platform and softly shaded floor unify the three disciplines.
    slab(8.15, 3.75, 0.25, 0.62, m.parchment, group, [0, 0, 0]);
    const ground = compact
      ? mesh(
          new THREE.CircleGeometry(1, 48),
          new THREE.MeshBasicMaterial({
            color: atelierPalette.cocoa,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          }),
          group,
          [0.08, -0.14, -0.02],
        )
      : mesh(
          new THREE.PlaneGeometry(200, 200),
          new THREE.ShadowMaterial({
            color: atelierPalette.cocoa,
            opacity: 0.12,
          }),
          group,
          [0, -0.14, 0],
        );
    materials.push(ground.material);
    ground.rotation.x = -Math.PI / 2;
    ground.castShadow = false;
    if (compact) {
      // A feathered contact shadow anchors the miniature without another render pass.
      const count = ground.geometry.attributes.position.count;
      const colors = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        colors.set([1, 1, 1, i === 0 ? 0.14 : 0], i * 4);
      }
      ground.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 4),
      );
      ground.scale.set(4.65, 2.35, 1);
    }
    const zones: Record<AtelierZone, THREE.Group> = {
      automation: new THREE.Group(),
      code: new THREE.Group(),
      quadyx: new THREE.Group(),
    };
    zones.automation.position.set(-2.55, 0.14, -0.2);
    zones.code.position.set(0, 0.14, -0.2);
    zones.quadyx.position.set(2.5, 0.14, -0.1);
    const hitTargets: THREE.Object3D[] = [];
    for (const zone of Object.keys(zones) as AtelierZone[]) {
      group.add(zones[zone]);
      const glow = ring(
        zone === "code" ? 0.96 : 0.89,
        0.018,
        activeMaterials[zone],
        zones[zone],
        [0, 0.006, 0.05],
      );
      glow.castShadow = false;
      zones[zone].userData.zone = zone;
      hitTargets.push(zones[zone]);
    }
    await checkpoint?.();

    // Robot: layered pedestal, articulated links, rotary joints and a two-finger gripper.
    const robot = zones.automation;
    slab(0.9, 0.85, 0.1, 0.1, m.teal, robot, [-0.15, 0.05, -0.2]);
    cylinder(0.38, 0.12, m.cocoa, robot, [-0.15, 0.15, -0.2]);
    cylinder(0.34, 0.09, m.clay, robot, [-0.15, 0.24, -0.2]);
    cylinder(0.29, 0.13, m.teal, robot, [-0.15, 0.34, -0.2]);
    for (const x of [-0.49, 0.19])
      for (const z of [-0.5, 0.1])
        cylinder(0.035, 0.025, m.cocoa, robot, [x, 0.112, z]);
    const shoulder = new THREE.Group();
    shoulder.position.set(-0.15, 0.42, -0.2);
    robot.add(shoulder);
    const joint = (
      parent: THREE.Group,
      radius: number,
      position: [number, number, number],
    ) => {
      const axle = cylinder(radius, 0.31, m.cocoa, parent, position);
      axle.rotation.x = Math.PI / 2;
      const cover = cylinder(radius * 0.9, 0.075, m.clay, parent, [
        position[0],
        position[1],
        position[2] + 0.18,
      ]);
      cover.rotation.x = Math.PI / 2;
      const bolt = cylinder(radius * 0.38, 0.014, m.clay, parent, [
        position[0],
        position[1],
        position[2] + 0.222,
      ]);
      bolt.rotation.x = Math.PI / 2;
      ring(
        radius * 0.4,
        0.008,
        m.cocoa,
        parent,
        [position[0], position[1], position[2] + 0.23],
        false,
      );
    };
    joint(shoulder, 0.24, [0, 0, 0]);
    const lowerLength = 0.97,
      upperLength = 0.82;
    box(
      0.31,
      lowerLength,
      0.29,
      m.teal,
      shoulder,
      [0, lowerLength / 2, 0],
      0.07,
    );
    box(
      0.2,
      lowerLength * 0.69,
      0.025,
      m.teal,
      shoulder,
      [0, lowerLength / 2, 0.164],
      0.025,
    );
    const elbow = new THREE.Group();
    elbow.position.y = lowerLength;
    shoulder.add(elbow);
    joint(elbow, 0.205, [0, 0, 0]);
    box(0.27, upperLength, 0.26, m.teal, elbow, [0, upperLength / 2, 0], 0.055);
    box(
      0.17,
      upperLength * 0.63,
      0.03,
      m.teal,
      elbow,
      [0, upperLength / 2, 0.15],
      0.02,
    );
    const wrist = new THREE.Group();
    wrist.position.y = upperLength;
    elbow.add(wrist);
    joint(wrist, 0.15, [0, 0, 0]);
    cylinder(0.105, 0.15, m.amber, wrist, [0, -0.12, 0]);
    box(0.3, 0.16, 0.2, m.teal, wrist, [0, -0.23, 0], 0.035);
    const leftFinger = new THREE.Group(),
      rightFinger = new THREE.Group();
    leftFinger.position.set(-0.115, -0.31, 0);
    rightFinger.position.set(0.115, -0.31, 0);
    wrist.add(leftFinger, rightFinger);
    box(0.064, 0.26, 0.075, m.cocoa, leftFinger, [0, -0.1, 0], 0.02);
    box(0.064, 0.26, 0.075, m.cocoa, rightFinger, [0, -0.1, 0], 0.02);
    box(0.1, 0.057, 0.075, m.cocoa, leftFinger, [0.03, -0.21, 0], 0.015);
    box(0.1, 0.057, 0.075, m.cocoa, rightFinger, [-0.03, -0.21, 0], 0.015);
    const cableCurve = new THREE.CatmullRomCurve3([
      point(-0.4, 0.3, -0.32),
      point(-0.72, 0.65, -0.32),
      point(-0.68, 1.13, -0.32),
      point(-0.4, 1.16, -0.32),
    ]);
    mesh(
      new THREE.TubeGeometry(cableCurve, 20, 0.025, 8, false),
      m.cocoa,
      robot,
    );
    await checkpoint?.();

    // The packet lane gives the robot's movements a clear input-to-output direction.
    slab(1.4, 0.4, 0.11, 0.04, m.cocoa, robot, [0.18, 0.1, 0.67]);
    slab(1.3, 0.3, 0.045, 0.02, m.teal, robot, [0.18, 0.178, 0.67]);
    for (let i = 0; i < 8; i++) {
      const roller = cylinder(0.043, 0.32, m.cocoa, robot, [
        -0.39 + i * 0.16,
        0.18,
        0.67,
      ]);
      roller.rotation.x = Math.PI / 2;
    }
    const packets = [
      box(0.2, 0.23, 0.2, m.clay, robot, [-0.33, 0.31, 0.67], 0.025),
      box(0.2, 0.3, 0.2, m.teal, robot, [0.03, 0.35, 0.67], 0.025),
      box(0.2, 0.21, 0.2, m.teal, robot, [0.41, 0.3, 0.67], 0.025),
    ];
    const cargo = box(0.16, 0.18, 0.16, m.amber, robot, [0.7, 1, -0.2], 0.025);
    const reviewMarker = sphere(0.075, m.amber, robot, [0.7, 0.36, 0.67]);
    ring(0.11, 0.011, m.amber, robot, [0.7, 0.23, 0.67]);
    const toolPad = slab(
      0.62,
      0.44,
      0.018,
      0.045,
      m.cocoa,
      robot,
      [-0.78, 0.02, 0.81],
    );
    const screwdriver = new THREE.Group();
    screwdriver.position.set(-0.9, 0.085, 0.76);
    screwdriver.rotation.z = Math.PI / 2;
    screwdriver.rotation.y = -0.25;
    robot.add(screwdriver);
    cylinder(0.04, 0.22, m.amber, screwdriver, [0, 0, 0]);
    cylinder(0.012, 0.19, m.cocoa, screwdriver, [0, 0.18, 0]);
    toolPad.castShadow = false;
    await checkpoint?.();

    // A chunky, tactile coding console: live code strokes map to an actual DOM preview.
    const code = zones.code;
    slab(1.72, 0.76, 0.35, 0.13, m.cocoa, code, [0, 0.195, -0.1]);
    box(0.7, 0.21, 0.01, m.cocoa, code, [-0.4, 0.22, 0.287], 0.035);
    box(0.7, 0.21, 0.01, m.cocoa, code, [0.4, 0.22, 0.287], 0.035);
    box(0.16, 0.035, 0.035, m.amber, code, [-0.4, 0.24, 0.315], 0.01);
    box(0.16, 0.035, 0.035, m.amber, code, [0.4, 0.24, 0.315], 0.01);
    cylinder(0.1, 0.08, m.clay, code, [0, 0.47, -0.23]);
    box(0.24, 0.34, 0.2, m.cocoa, code, [0, 0.55, -0.25], 0.04);
    slab(0.74, 0.4, 0.06, 0.07, m.cocoa, code, [0, 0.392, -0.25]);
    const monitor = new THREE.Group();
    monitor.position.set(0, 1.03, -0.29);
    monitor.rotation.x = -0.08;
    code.add(monitor);
    box(1.65, 1.15, 0.22, m.cocoa, monitor, [0, 0, 0], 0.11);
    box(1.46, 0.94, 0.025, screenMaterial, monitor, [0, 0.035, 0.127], 0.07);
    const display = new THREE.Group();
    display.position.set(-0.63, 0.4, 0.144);
    monitor.add(display);
    const codeRows: THREE.Mesh[] = [];
    const lengths = [0.47, 0.81, 0.61, 0.94, 0.36, 0.75, 0.5, 0.88, 0.43];
    for (let i = 0; i < lengths.length; i++) {
      const row = new THREE.Group();
      row.position.set(i > 1 && i < 7 ? 0.085 : 0, -i * 0.074, 0);
      display.add(row);
      const ink = i === 0 || i === 7 ? m.amber : m.eucalyptus;
      const line = box(
        lengths[i],
        0.018,
        0.006,
        ink,
        row,
        [lengths[i] / 2, 0, 0],
        0.003,
      );
      codeRows.push(line);
      if (i === 2 || i === 3 || i === 5)
        box(
          0.11,
          0.018,
          0.008,
          m.clay,
          row,
          [lengths[i] - 0.15, 0, 0.006],
          0.003,
        );
    }
    cylinder(0.024, 0.021, m.amber, monitor, [0.64, -0.5, 0.14]).rotation.x =
      Math.PI / 2;
    await checkpoint?.();
    const keyGroup = new THREE.Group();
    keyGroup.position.set(0, 0.415, 0.02);
    code.add(keyGroup);
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 10; col++) {
        const key = cylinder(
          0.041,
          0.023,
          col === 0 || col === 9 ? m.clay : m.cocoa,
          keyGroup,
          [-0.57 + col * 0.126, 0.015, -0.16 + row * 0.1],
        );
        key.rotation.z = 0.02;
      }
    box(0.44, 0.035, 0.065, m.cocoa, keyGroup, [0, 0.019, 0.16], 0.015);
    cylinder(0.068, 0.046, m.amber, code, [0.67, 0.438, 0.13]);
    cylinder(0.09, 0.012, m.cocoa, code, [0.67, 0.41, 0.13]);
    const preview = new THREE.Group();
    preview.position.set(0.15, 0.08, 0.84);
    code.add(preview);
    slab(0.62, 0.5, 0.11, 0.06, m.parchment, preview, [0, 0, 0]);
    for (let i = 0; i < 3; i++)
      box(
        0.4 - i * 0.08,
        0.015,
        0.037,
        i === 0 ? m.teal : m.eucalyptus,
        preview,
        [-i * 0.04, 0.069, -0.1 + i * 0.1],
        0.006,
      );
    const testedLight = sphere(0.035, m.amber, preview, [0.23, 0.08, 0.13]);
    testedLight.visible = false;
    const penCup = cylinder(0.08, 0.2, m.cocoa, code, [-0.72, 0.47, -0.38]);
    rod(
      point(-0.73, 0.55, -0.39),
      point(-0.75, 0.8, -0.42),
      0.018,
      m.amber,
      code,
    );
    rod(
      point(-0.68, 0.55, -0.36),
      point(-0.65, 0.73, -0.35),
      0.018,
      m.cocoa,
      code,
    );
    penCup.castShadow = true;
    await checkpoint?.();

    // Drone: four guarded rotors, paired vision lenses, landing struts and a radio station.
    const quad = zones.quadyx;
    const drone = new THREE.Group();
    drone.position.set(0, 1.12, -0.25);
    drone.scale.setScalar(0.77);
    quad.add(drone);
    const fuselage = box(0.68, 0.3, 0.82, m.clay, drone, [0, 0, 0], 0.13);
    fuselage.rotation.x = 0.03;
    box(0.43, 0.17, 0.56, m.cocoa, drone, [0, -0.17, -0.01], 0.09);
    const rotors: THREE.Group[] = [];
    for (const x of [-0.57, 0.57])
      for (const z of [-0.52, 0.52]) {
        rod(
          point(x * 0.33, -0.02, z * 0.36),
          point(x, -0.03, z),
          0.065,
          m.cocoa,
          drone,
        );
        const guard = ring(0.32, 0.025, m.clay, drone, [x, 0.035, z]);
        guard.scale.z = 1.8;
        cylinder(0.064, 0.13, m.cocoa, drone, [x, 0.025, z]);
        cylinder(0.052, 0.025, m.amber, drone, [x, 0.118, z]);
        const rotor = new THREE.Group();
        rotor.position.set(x, 0.1, z);
        drone.add(rotor);
        const blade = box(0.47, 0.016, 0.065, m.cocoa, rotor, [0, 0, 0], 0.03);
        blade.rotation.y = x * z > 0 ? 0.5 : -0.4;
        sphere(0.055, m.cocoa, rotor, [0, 0.012, 0]);
        rotors.push(rotor);
      }
    await checkpoint?.();
    for (const x of [-0.25, 0.25])
      for (const z of [-0.25, 0.25]) {
        rod(
          point(x, -0.15, z),
          point(x * 1.45, -0.51, z * 1.35),
          0.028,
          m.cocoa,
          drone,
        );
        sphere(0.035, m.cocoa, drone, [x * 1.45, -0.51, z * 1.35]);
      }
    for (const [x, radius] of [
      [-0.12, 0.1],
      [0.13, 0.065],
    ]) {
      const housing = cylinder(radius + 0.025, 0.08, m.cocoa, drone, [
        x,
        -0.08,
        0.445,
      ]);
      housing.rotation.x = Math.PI / 2;
      const lens = cylinder(radius * 0.7, 0.087, m.teal, drone, [
        x,
        -0.08,
        0.472,
      ]);
      lens.rotation.x = Math.PI / 2;
      ring(radius, 0.015, m.amber, drone, [x, -0.08, 0.495], false);
    }
    await checkpoint?.();
    const station = new THREE.Group();
    station.position.set(0.15, 0.11, 1.09);
    quad.add(station);
    slab(0.97, 0.56, 0.2, 0.12, m.cocoa, station, [0, 0, 0]);
    box(0.8, 0.11, 0.018, m.teal, station, [0, 0, 0.295], 0.035);
    for (const x of [-0.32, 0.32]) {
      cylinder(0.054, 0.055, m.cocoa, station, [x, 0.127, -0.14]);
      cylinder(0.016, 0.41, m.cocoa, station, [x, 0.35, -0.14], 0.012);
      sphere(0.016, m.cocoa, station, [x, 0.55, -0.14]);
      cylinder(0.06, 0.04, m.amber, station, [x, 0.13, 0.11]);
      cylinder(0.018, 0.02, m.cocoa, station, [x, 0.0, 0.317]).rotation.x =
        Math.PI / 2;
    }
    const stationLight = sphere(0.023, m.amber, station, [-0.2, -0.01, 0.317]);
    slab(0.27, 0.16, 0.025, 0.02, m.teal, station, [0, 0.12, 0.03]);
    const routeGroup = new THREE.Group();
    quad.add(routeGroup);
    const obstacle = box(
      0.24,
      0.84,
      0.29,
      m.clay,
      quad,
      [0.37, 0.42, 0.35],
      0.035,
    );
    const obstacleCap = box(
      0.24,
      0.026,
      0.29,
      m.amber,
      obstacle,
      [0, 0.432, 0],
      0.01,
    );
    obstacleCap.castShadow = false;
    const depthMaterial = makeMat(atelierPalette.eucalyptus, {
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const depthGroup = new THREE.Group();
    quad.add(depthGroup);
    const depthRays: THREE.Mesh[] = [];
    const depthOrigin = new THREE.Vector3();
    const depthEnd = new THREE.Vector3();
    const depthVector = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const signalMaterial = makeMat(atelierPalette.amber, {
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const signalGroup = new THREE.Group();
    quad.add(signalGroup);
    for (let i = 0; i < 3; i++) {
      const arc = ring(
        0.09 + i * 0.09,
        0.006,
        signalMaterial,
        signalGroup,
        [0, 0, 0],
        false,
      );
      arc.castShadow = false;
    }

    let route: THREE.CatmullRomCurve3;
    let oldObstacle = -1;
    const clearGeometry = (target: THREE.Group) => {
      target.traverse((object) => {
        if (
          object instanceof THREE.Mesh &&
          !sharedGeometrySet.has(object.geometry)
        )
          object.geometry.dispose();
      });
      target.clear();
    };
    const placeObstacle = (index: number) => {
      oldObstacle = index;
      clearGeometry(routeGroup);
      clearGeometry(depthGroup);
      const locations = [
        [0.37, 0.35],
        [-0.12, -0.28],
        [0.6, -0.35],
      ];
      const [x, z] = locations[((index % 3) + 3) % 3];
      obstacle.position.set(x, 0.42, z);
      const detourZ = z > 0 ? -0.68 : 0.73;
      route = new THREE.CatmullRomCurve3(
        [
          point(-0.8, 0.034, 0.02),
          point(x - 0.44, 0.034, detourZ),
          point(x + 0.38, 0.034, detourZ),
          point(1.1, 0.034, 0.24),
        ],
        false,
        "catmullrom",
        0.18,
      );
      for (let i = 0; i < 30; i++) {
        const start = route.getPoint(i / 30);
        const end = route.getPoint((i + 0.48) / 30);
        const dash = rod(start, end, 0.013, m.teal, routeGroup);
        dash.castShadow = false;
      }
      for (const t of [0, 1]) {
        const pin = ring(
          0.06,
          0.012,
          m.amber,
          routeGroup,
          route.getPoint(t).toArray() as [number, number, number],
        );
        pin.castShadow = false;
      }
      // The fan represents perception/depth conceptually; it does not imply a sensor model.
      depthRays.length = 0;
      for (let i = 0; i < 9; i++) {
        const ray = cylinder(0.004, 1, depthMaterial, depthGroup, [0, 0, 0]);
        ray.castShadow = false;
        depthRays.push(ray);
      }
    };
    placeObstacle(0);
    await checkpoint?.();

    const screenStatus = box(
      0.075,
      0.075,
      0.006,
      m.amber,
      monitor,
      [0.57, 0.39, 0.16],
      0.02,
    );
    const getGrip = (x: number, y: number) => {
      const distance = Math.min(
        Math.hypot(x, y),
        lowerLength + upperLength - 0.03,
      );
      const shoulderAngle =
        Math.atan2(-x, y) +
        Math.acos(
          THREE.MathUtils.clamp(
            (distance * distance +
              lowerLength * lowerLength -
              upperLength * upperLength) /
              (2 * distance * lowerLength),
            -1,
            1,
          ),
        );
      const elbowAngle = -Math.acos(
        THREE.MathUtils.clamp(
          (distance * distance -
            lowerLength * lowerLength -
            upperLength * upperLength) /
            (2 * lowerLength * upperLength),
          -1,
          1,
        ),
      );
      shoulder.rotation.z = shoulderAngle;
      elbow.rotation.z = elbowAngle;
      wrist.rotation.z = -(shoulderAngle + elbowAngle);
    };
    const update: AtelierModel["update"] = (
      time,
      zone,
      exception,
      obstacleIndex,
      tested,
      moving,
      hover,
    ) => {
      for (const key of Object.keys(activeMaterials) as AtelierZone[]) {
        activeMaterials[key].opacity =
          key === hover ? 0.65 : key === zone ? 0.3 : 0.035;
      }
      if (obstacleIndex !== oldObstacle) placeObstacle(obstacleIndex);
      const robotTime = zone === "automation" ? Math.min(time, 7.2) : 1.4;
      const phase = !exception ? robotTime / 7.2 : 0.22;
      const travel = Math.sin(phase * Math.PI * 2);
      const targetX = exception ? 0.57 : 0.6 + travel * 0.23;
      const targetY = exception
        ? 0.89
        : 1.1 + Math.cos(phase * Math.PI * 2) * 0.17;
      getGrip(targetX, targetY);
      leftFinger.rotation.z = exception ? -0.18 : travel * 0.08;
      rightFinger.rotation.z = exception ? 0.18 : -travel * 0.08;
      cargo.position.set(targetX - 0.15, targetY - 0.04, -0.2);
      cargo.visible = !exception;
      packets[0].material = exception ? m.amber : m.clay;
      reviewMarker.visible = exception;
      for (let i = 0; i < packets.length; i++)
        packets[i].position.y =
          0.28 +
          (i === 1 ? 0.07 : 0) +
          (zone === "automation" && !exception
            ? Math.max(0, Math.sin(robotTime * 1.7 - i)) * 0.015
            : 0);

      const reveal = zone === "code" ? Math.min(1, (time + 2.8) / 6.0) : 1;
      for (let i = 0; i < codeRows.length; i++) {
        const amount = THREE.MathUtils.clamp(
          reveal * codeRows.length - i,
          0.015,
          1,
        );
        codeRows[i].scale.x = amount;
        codeRows[i].position.x = (lengths[i] * amount) / 2;
      }
      screenStatus.material = tested ? m.eucalyptus : m.amber;
      testedLight.visible = tested;
      preview.scale.setScalar(tested ? 1.08 : 1);

      depthGroup.visible = zone === "quadyx";
      routeGroup.visible = zone === "quadyx";
      obstacle.visible = zone === "quadyx";
      signalGroup.visible = zone === "quadyx";
      stationLight.material = obstacleIndex > 0 ? m.eucalyptus : m.amber;
      const dronePhase = zone === "quadyx" ? (time * 0.09) % 2 : 0.52;
      const t = dronePhase > 1 ? 2 - dronePhase : dronePhase;
      const dronePosition = route.getPoint(
        THREE.MathUtils.clamp(t, 0.01, 0.99),
      );
      const tangent = route.getTangent(THREE.MathUtils.clamp(t, 0.01, 0.99));
      if (zone === "quadyx") {
        drone.position.set(
          dronePosition.x,
          0.98 + Math.sin(time * 1.9) * 0.018,
          dronePosition.z,
        );
        drone.rotation.y = Math.atan2(
          tangent.x * (dronePhase > 1 ? -1 : 1),
          tangent.z * (dronePhase > 1 ? -1 : 1),
        );
        drone.rotation.z = Math.sin(time * 1.1) * 0.025;
      } else {
        drone.position.set(0, 1.08, -0.3);
        drone.rotation.set(0, -0.32, 0);
      }
      for (let i = 0; i < rotors.length; i++)
        rotors[i].rotation.y =
          zone === "quadyx" ? time * (i % 2 ? -15 : 15) : i * 0.7;
      depthOrigin
        .set(
          Math.sin(drone.rotation.y) * 0.32,
          -0.06,
          Math.cos(drone.rotation.y) * 0.32,
        )
        .add(drone.position);
      for (let i = 0; i < depthRays.length; i++) {
        depthEnd.set(
          obstacle.position.x + ((i % 3) - 1) * 0.09,
          0.16 + Math.floor(i / 3) * 0.27,
          obstacle.position.z - 0.15,
        );
        depthVector.subVectors(depthEnd, depthOrigin);
        depthRays[i].position
          .copy(depthOrigin)
          .addScaledVector(depthVector, 0.5);
        depthRays[i].scale.y = depthVector.length();
        depthRays[i].quaternion.setFromUnitVectors(up, depthVector.normalize());
      }
      signalGroup.position.set(
        station.position.x,
        0.67,
        station.position.z - 0.1,
      );
      signalGroup.rotation.y = -0.12;
      signalMaterial.opacity = 0.28 + (Math.sin(time * 2.2) + 1) * 0.16;
    };
    update(0, "automation", false, 0, false, false, null);

    return {
      group,
      zones,
      hitTargets,
      update,
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
