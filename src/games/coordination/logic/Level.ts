export type ShapeType = "circle" | "square" | "triangle" | "star" | "rectangle";

export interface ShapeSpec {
  type: ShapeType;
  color: number; // hex color
}

export default class CoordinationLevel {
  private shapes: ShapeSpec[];
  private name: string;

  constructor(name: string, shapes: ShapeSpec[]) {
    this.name = name;
    this.shapes = shapes;
  }

  getName() {
    return this.name;
  }

  getShapes(): ShapeSpec[] {
    return this.shapes;
  }
}
