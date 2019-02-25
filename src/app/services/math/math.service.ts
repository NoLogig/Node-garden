import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

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
let m = new MathService();
export default m;
