
export interface IPoint {
    x: number;
    y: number;
}

export interface IParticle extends IPoint {
    vx: number;
    vy: number;
}

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

export interface IParticlePhysics {
    mass?: number;
    bounce?: number;
    friction?: number;
    gravity?: number;
    springs?: ISpring[];
    gravitations?: IPoint[];
}

export interface ISpring {
    point: IPoint;
    k: number;
    length: number;
}

export interface ICircleShape extends IParticle {
    r: number;
}

export interface IRectShape extends IParticle {
    w: number;
    h: number;
}

export interface IPolygonShape extends IParticle {
    p: number[];
}

export interface ICircleParticle extends ICircleShape, IParticlePhysics  { }
