export interface ShapeConfig {
  type: "circle" | "square" | "triangle" | "rectangle" | "star";
  size: number;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelData {
  id: number;
  shape: ShapeConfig;
  start: Position;
  target: Position;
  walls: Wall[];
}

export default class MazeLevel {
  private data: LevelData;

  constructor(data: LevelData) {
    this.data = data;
  }

  getId(): number {
    return this.data.id;
  }

  getShape(): ShapeConfig {
    return this.data.shape;
  }

  getStartPosition(): Position {
    return this.data.start;
  }

  getTargetPosition(): Position {
    return this.data.target;
  }

  getWalls(): Wall[] {
    return this.data.walls;
  }
}
