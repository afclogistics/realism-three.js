import { MOVEMENT } from './movement';

export class HeadBob {
  private timer = 0;
  private strideLength = 0;

  update(delta: number, isMoving: boolean, isSprinting: boolean) {
    if (!isMoving) {
      this.timer = 0;
      this.strideLength = 0;
      return 0;
    }

    const bobSpeed = MOVEMENT.BOB_SPEED * (isSprinting ? 1.5 : 1);
    this.timer += delta * bobSpeed;

    // Reduce the bob amplitude for less intensity
    const reducedAmplitudeFactor = 0.5; // Use a value < 1 for less intense bob
    this.strideLength = Math.sin(this.timer) * MOVEMENT.BOB_AMPLITUDE * reducedAmplitudeFactor;

    return this.strideLength;
  }
}
