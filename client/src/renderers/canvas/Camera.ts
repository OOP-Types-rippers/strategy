export class Camera {
  public offsetX: number = 0;
  public offsetY: number = 0;

  public zoom: number = 0.25;
  public minZoom: number = 0.25;
  public maxZoom: number = 4;

  public applyTransformations(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.zoom, this.zoom);
  }

  public screenToGrid(screenX: number, screenY: number, tileSize: number) {
    const x = Math.floor((screenX - this.offsetX) / (this.zoom * tileSize));
    const y = Math.floor((screenY - this.offsetY) / (this.zoom * tileSize));
    return { x, y };
  }

  // returns true if zoom has changed (prevents unnecessary re-renders)
  public setZoom(
    newZoom: number,
    viewportWidth: number,
    viewportHeight: number,
    mapWidthTiles: number,
    mapHeightTiles: number,
    tileSize: number
  ): boolean {
    const oldZoom = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(newZoom, this.maxZoom));

    this.clamp(viewportWidth, viewportHeight, mapWidthTiles, mapHeightTiles, tileSize);

    return oldZoom !== this.zoom;
  }

  // returns true if position has changed
  public move(
    moveX: number,
    moveY: number,
    viewportWidth: number,
    viewportHeight: number,
    mapWidthTiles: number,
    mapHeightTiles: number,
    tileSize: number
  ): boolean {
    const oldX = this.offsetX;
    const oldY = this.offsetY;

    this.offsetX += moveX;
    this.offsetY += moveY;

    this.clamp(viewportWidth, viewportHeight, mapWidthTiles, mapHeightTiles, tileSize);

    return oldX !== this.offsetX || oldY !== this.offsetY;
  }

  public clamp(viewportWidth: number, viewportHeight: number, mapWidthTiles: number, mapHeightTiles: number, tileSize: number) {
    const scaledMapWidth = mapWidthTiles * tileSize * this.zoom;
    const scaledMapHeight = mapHeightTiles * tileSize * this.zoom;

    // Clamp X axis or center if map is smaller than viewport
    if (scaledMapWidth <= viewportWidth) {
      this.offsetX = (viewportWidth - scaledMapWidth) / 2;
    } else {
      this.offsetX = Math.max(viewportWidth - scaledMapWidth, Math.min(0, this.offsetX));
    }

    // Clamp Y axis or center if map is smaller than viewport
    if (scaledMapHeight <= viewportHeight) {
      this.offsetY = (viewportHeight - scaledMapHeight) / 2;
    } else {
      this.offsetY = Math.max(viewportHeight - scaledMapHeight, Math.min(0, this.offsetY));
    }
  }
}