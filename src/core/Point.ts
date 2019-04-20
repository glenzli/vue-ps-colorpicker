export interface PointObject {
  x: number,
  y: number,
}

export function Point(x: number, y: number) {
  return { x, y }
}
