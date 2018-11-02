import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ICircleParticle, ICircleShape, IPoint, ICirclePoint } from '../interfaces/imath';
import maths from '../services/math/math.service';

@Component({
  selector: 'nlg-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: []
})
export class CanvasComponent implements OnInit {

  @ViewChild('geoCanvas') geoCanvas: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cWidth: number;
  cHeight: number;

  eleCounter: number;
  maxConnectDist: number;
  nodes: ICircleShape[];
  particles: ICircleParticle[];

  constructor() { }

  ngOnInit() {

    this.canvas = this.geoCanvas.nativeElement;
    this.ctx = this.geoCanvas.nativeElement.getContext('2d');

    this.cWidth = this.canvas.width = window.innerWidth;
    this.cHeight = this.canvas.height = window.innerHeight;

    this.ctx.strokeStyle = 'rgba(0, 255, 255, .9)';
    this.ctx.fillStyle = 'rgba(0, 255, 255, .6)';

    this.maxConnectDist = 150;
    this.eleCounter = 200;

    this.nodes = this.createRndShapes(this.eleCounter, this.cWidth, this.cHeight);

    this.render();
  }

  createShape(x: number, y: number, r: number, vx: number, vy: number) {  return this.nodes.push({ x, y, r, vx, vy }); }

  createRndShapes(n: number, x_Max = 50, y_Max = 50, r_Max = 8, vx_Max = 4, vy_Max = 4): ICircleShape[] {

    let _shapes: ICircleShape[] = [];

    for (let i = 0; i < n - 1; i++) {
      _shapes.push({
        x: Math.random() * x_Max,
        y: Math.random() * y_Max,
        r: Math.random() * r_Max + 2,
        vx: Math.random() * vx_Max - vx_Max * .5,
        vy: Math.random() * vy_Max - vy_Max * .5,
      });
    }
    return _shapes;
  }

  addParticle(p: ICircleParticle) { return this.particles.push(p); }

  drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r = 8) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.29);
    ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, p1: IPoint, p2: IPoint) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  updateNodes(nodes: ICircleShape[]) {
    // Update & draw points
    for (let i = 0, limit = nodes.length; i < limit; i++) {

      let node = nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      node.x = maths.lock(node.x, 0, this.canvas.width);
      node.y = maths.lock(node.y, 0, this.canvas.height);

      nodes[i] = node;

      this.drawCircle(this.ctx, node.x, node.y, node.r);

      // Draw strokes between points if in range
      for (let j = i + 1; j < limit; j++) {

        let node2 = nodes[j],
          dx = node2.x - node.x,
          dy = node2.y - node.y,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (dist < this.maxConnectDist) {
          this.ctx.lineWidth = 1 - dist / this.maxConnectDist;

          this.drawLine(this.ctx, node, node2);
        }
      }
    }
  }

  updateStrokes(nodes: ICircleShape[]) {

    // Draw strokes between points if in range
    for (let i = 0, limit = nodes.length; i < limit; i++) {

      let node = nodes[i];

      for (let j = i + 1; j < limit; j++) {

        let node2 = nodes[j],
          dx = node2.x - node.x,
          dy = node2.y - node.y,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (dist < this.maxConnectDist) {
          this.ctx.lineWidth = 1 - dist / this.maxConnectDist;

          this.drawLine(this.ctx, node, node2);
        }
      }
    }
  }

  render = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateNodes(this.nodes);
    // this.updateStrokes(this.nodes);

    requestAnimationFrame(this.render);
  }

}
