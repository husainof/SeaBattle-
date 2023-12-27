import Shot from "../Shot";
import ShotResponse from "../ShotResponse";

export default interface IEnemy {
  doShot: (x: number, y: number) => Shot;
  takeShot: (shot: Shot) => ShotResponse;
}
