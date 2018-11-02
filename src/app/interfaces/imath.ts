
export interface ICircle {
    r: number;
}
export interface IRectangle {
    w: number;
    h: number;
}
export interface IPoint {
    x: number;
    y: number;
}

export interface ICirclePoint extends IPoint, ICircle { }
export interface IRectPoint extends IPoint, IRectangle { }

export interface IParticle extends IPoint {
    vx: number;
    vy: number;
}
export interface IParticlePhysics {
    mass?: number;
    bounce?: number;
    friction?: number;
    gravity?: number;
    springs?: ISpring[];
    gravitations?: IPoint[];
}

export interface ICircleShape extends IParticle, ICircle { }
export interface ICircleParticle extends ICircleShape, IParticlePhysics { }

export interface IRectShape extends IParticle, IRectangle { }
export interface IRectParticle extends IRectShape, IParticlePhysics { }

export interface IVector extends IPoint {

    getX(): number;
    setX(n: number): void;
    getY(): number;
    setY(n: number): void;
    getZ(): number;
    setZ(n: number): void;

    getAngle(): number;
    setAngle(angle: number): void;

    getLength(): number;
    setLength(length: number): void;

    addTo(v2: number);
    subtractFrom(v2: number);
    multiplyBy(v2: number);
    divideBy(v2: number);
}

export interface ISpring {
    point: IPoint;
    k: number;
    length: number;
}
