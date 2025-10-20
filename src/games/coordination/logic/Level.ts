export type ShapeType = "circle" | "square" | "triangle" | "star" | "rectangle";

export interface ShapeSpec {
  type: ShapeType;
  color: number; // hex color
}

export default class CoordinationLevel {
  private shapes: ShapeSpec[];
  private name: string;
  private radius?: number;
  private gap?: number;

  constructor(
    name: string,
    shapes: ShapeSpec[],
    opts?: { radius?: number; gap?: number },
  ) {
    this.name = name;
    this.shapes = shapes;
    this.radius = opts?.radius;
    this.gap = opts?.gap;
  }

  getName() {
    return this.name;
  }

  getShapes(): ShapeSpec[] {
    return this.shapes;
  }

  getRadius(defaultValue = 50) {
    return this.radius ?? defaultValue;
  }

  getGap(defaultValue = 40) {
    return this.gap ?? defaultValue;
  }
}
