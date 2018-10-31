import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MathService } from '../services/math/math.service';

@Component({
  selector: 'nlg-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: [MathService]
})
export class CanvasComponent implements OnInit {

  @ViewChild('geoCanvas') geoCanvas: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    this.canvas = this.geoCanvas.nativeElement;
    this.ctx = this.geoCanvas.nativeElement.getContext('2d');

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx.strokeStyle = 'rgba(0, 255, 255, .9)';
    this.ctx.fillStyle = 'rgba(0, 0, 0, .6)';

  }

}
