import { VirtualComponent } from "./VirtualComponent";
class ButtomInteractor {
  public static init(xiaohei: Interactable, heixiu: Interactable): void {
    document.getElementById("RotateLeft").onclick = () => {
      xiaohei.rotateLeft();
    };
    document.getElementById("RotateRight").onclick = () => {
      xiaohei.rotateRight();
    };
    document.getElementById("Forward").onclick = () => {
      xiaohei.walkForward();
    };
    document.getElementById("Backward").onclick = () => {
      xiaohei.walkBackward();
    };
    document.getElementById("RotateLeft1").onclick = () => {
      heixiu.rotateLeft();
    };
    document.getElementById("RotateRight1").onclick = () => {
      heixiu.rotateRight();
    };
    document.getElementById("Forward1").onclick = () => {
      heixiu.walkForward();
    };
    document.getElementById("Backward1").onclick = () => {
      heixiu.walkBackward();
    };
  }
}
