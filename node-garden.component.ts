import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';

export interface ICircle {
  r: number;
}
export interface IPoint {
  x: number;
  y: number;
}
export interface IParticle extends IPoint {
  vx: number;
  vy: number;
}
export interface ICircleParticle extends IParticle, ICircle { }

@Component({
  selector: 'nlg-node-garden',
  templateUrl: './node-garden.component.html',
  styleUrls: ['./node-garden.component.scss']
})
export class NodeGardenComponent implements OnInit, OnDestroy {

  @ViewChild('nodeGarden', { static: true }) nodeCanvas: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cWidth: number;
  cHeight: number;

  nodeCounter: number;
  maxConnectDist: number;
  nodes: ICircleParticle[];

  raf: number;

  constructor(public ngZone: NgZone) { }

  /* ************************************
   *  Livecycle Hooks
   */

  ngOnInit(): void {

    this.canvas = this.nodeCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.cWidth = this.canvas.width = window.innerWidth;
    this.cHeight = this.canvas.height = window.innerHeight;

    this.ctx.strokeStyle = 'rgba(0, 255, 255, .9)';
    this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';

    this.maxConnectDist = 120;
    this.nodeCounter = 300;

    this.nodes = this.createRndShapes(this.nodeCounter, this.cWidth, this.cHeight);

    // Prevent memory leak
    this.ngZone.runOutsideAngular(this.render);
  }

  ngOnDestroy(): void {

    this.ngZone.run(() => {
      cancelAnimationFrame(this.raf);
    });
    cancelAnimationFrame(this.raf);
  }

  /* ************************************
   *  Canvas
   */

  createRndShapes(n: number, x_Max = 50, y_Max = 50, r_Max = 8, vx_Max = 4, vy_Max = 4): ICircleParticle[] {

    let tmp_shapes: ICircleParticle[] = [];

    for (let i = 0, len = n - 1; i < len; i++) {

      tmp_shapes.push({
        x: Math.random() * x_Max,
        y: Math.random() * y_Max,
        r: Math.random() * r_Max + 2,
        vx: Math.random() * vx_Max - vx_Max * .5,
        vy: Math.random() * vy_Max - vy_Max * .5,
      });
    }

    return tmp_shapes;
  }

  drawCircle(ctx: CanvasRenderingContext2D, shape: ICircleParticle): void {

    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.r, 0, 6.29);
    ctx.fill();
    return;
  }

  drawLine(ctx: CanvasRenderingContext2D, p1: IPoint, p2: IPoint): void {

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    return;
  }

  // Update & draw shapes
  updateNodes(nodes: ICircleParticle[]): void {

    for (let i = 0, limit = nodes.length; i < limit; i++) {

      let node = nodes[i];

      node.x = this.lock(node.x + node.vx, 0, this.cWidth);
      node.y = this.lock(node.y + node.vy, 0, this.cHeight);

      this.drawCircle(this.ctx, node);

      this.connectAllNodes(this.nodes, i, this.maxConnectDist);
    }
    return;
  }

  // Draw line between nodes if in range
  connectAllNodes(nodes: ICircleParticle[], currentIndex: number, maxDist: number): void {

    let node = nodes[currentIndex];

    for (let i = currentIndex + 1, limit = nodes.length; i < limit; i++) {

      let tmp_node = nodes[i],
             dx = tmp_node.x - node.x,
             dy = tmp_node.y - node.y,
             dist = Math.sqrt((dx ** 2) + (dy ** 2));

      if (dist < maxDist) {

        this.ctx.lineWidth = 1 - dist / maxDist;
        this.drawLine(this.ctx, node, tmp_node);
      }
    }
    return;
  }
  
  render = (): void => {

    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    this.updateNodes(this.nodes);

    this.raf = requestAnimationFrame(this.render);
  }

  
  /* ************************************
   *  Helpers
   */

  /**
   * Lock a value to Min/Max.
   * @description Checks whether a value has gone off Min/Max range (canvas edges).
   *     If so, it makes the value wrap around to the opposite.
   * @example:   Min  Val   Max
   *             -5    x    23
   *       Max ←|____|____|→ Min
   */
  lock(n: number, min: number, max: number): number {
    if (n < min) { return max; }
    if (n > max) { return min; }
    return n;
  }

}
