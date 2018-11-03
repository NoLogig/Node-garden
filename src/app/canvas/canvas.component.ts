import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ICircleShape, IPoint } from '../interfaces/imath';
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
  c_Width: number;
  c_Height: number;

  nodeCounter: number;
  maxConnectDist: number;
  nodes: ICircleShape[];

  constructor(public ngZone: NgZone) { }

  ngOnInit(): void {

    this.canvas = this.geoCanvas.nativeElement;
    this.ctx = this.geoCanvas.nativeElement.getContext('2d');

    this.c_Width = this.canvas.width = window.innerWidth;
    this.c_Height = this.canvas.height = window.innerHeight;

    this.ctx.strokeStyle = 'rgba(0, 255, 255, .9)';
    this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';

    this.maxConnectDist = 150;
    this.nodeCounter = 300;

    this.nodes = this.createRndShapes(this.nodeCounter, this.c_Width, this.c_Height);

    // Prevent memory leak
    this.ngZone.runOutsideAngular(this.render);
  }

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

  drawCircle(ctx: CanvasRenderingContext2D, { x, y, r }: ICircleShape): void {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.29);
    return ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, p1: IPoint, p2: IPoint): void {

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    return ctx.stroke();
  }

  // Update & draw shapes
  updateNodes(nodes: ICircleShape[]): void {

    for (let i = 0, limit = nodes.length; i < limit; i++) {

      let node = nodes[i];

      node.x = maths.lock(node.x + node.vx, 0, this.c_Width);
      node.y = maths.lock(node.y + node.vy, 0, this.c_Height);

      this.drawCircle(this.ctx, node);

      this.connectNodes(this.nodes, i, this.maxConnectDist);
    }
  }

  // Draw lines between nodes if in range
  connectNodes(nodes: ICircleShape[], currentIndex: number, maxDist: number): void {

    let node = nodes[currentIndex];

    for (let i = currentIndex + 1, limit = nodes.length; i < limit; i++) {

      let _node = nodes[i],
        dx = _node.x - node.x,
        dy = _node.y - node.y,
        dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (dist < maxDist) {

        this.ctx.lineWidth = 1 - dist / maxDist;
        this.drawLine(this.ctx, node, _node);
      }
    }
  }

  render = (): void => {

    this.ctx.clearRect(0, 0, this.c_Width, this.c_Height);
    this.updateNodes(this.nodes);

    // this.updateStrokes(this.nodes);
    requestAnimationFrame(this.render);
  }

}
