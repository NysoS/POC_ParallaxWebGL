import { Vector2 } from "./Vector.js";

export default class MouseParallax {
  #origin = null;
  #moveDistance = null;

  constructor(canvasSize, moveDistance) {
    this.#origin = new Vector2(canvasSize.x / 2, canvasSize.y / 2);
    this.#moveDistance = moveDistance;
  }

  getPosition(mouseEvent) {
    console.log(this.#moveDistance);

    return new Vector2(
      (mouseEvent.x - this.#origin.x) / this.#moveDistance,
      ((mouseEvent.y - this.#origin.y) / this.#moveDistance) * -1
    );
  }

  getPositionSerialized(mouseEvent) {
    let pos = this.getPosition(mouseEvent);
    return new Vector2(pos.x / this.#origin.x, pos.y / this.#origin.y);
  }

  getOrigin() {
    return this.#origin;
  }
}
