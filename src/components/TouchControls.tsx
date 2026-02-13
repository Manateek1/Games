import type { InputAction, InputManager } from "../engine/input";

interface TouchControlsProps {
  input: InputManager;
  onPause: () => void;
  mode?: "default" | "pong-duel";
}

const pointerBind = (
  input: InputManager,
  action: InputAction,
): {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
} => ({
  onPointerDown: () => input.setVirtual(action, true),
  onPointerUp: () => input.setVirtual(action, false),
  onPointerCancel: () => input.setVirtual(action, false),
  onPointerLeave: () => input.setVirtual(action, false),
});

export const TouchControls = ({ input, onPause, mode = "default" }: TouchControlsProps): React.JSX.Element => {
  if (mode === "pong-duel") {
    return (
      <div className="mt-3 grid gap-2 md:hidden">
        <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.2em] text-cyan-100">
          <button type="button" className="touch-btn" {...pointerBind(input, "up")}>P1 Up</button>
          <button type="button" className="touch-btn" {...pointerBind(input, "action")}>P2 Up</button>
          <button type="button" className="touch-btn" {...pointerBind(input, "down")}>P1 Down</button>
          <button type="button" className="touch-btn" {...pointerBind(input, "action2")}>P2 Down</button>
        </div>
        <button type="button" className="touch-btn" onClick={onPause}>Pause</button>
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-3 md:hidden">
      <div className="grid grid-cols-[1fr,1fr] gap-3">
        <div className="grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.2em] text-cyan-100">
          <div />
          <button type="button" className="touch-btn" {...pointerBind(input, "up")}>Up</button>
          <div />
          <button type="button" className="touch-btn" {...pointerBind(input, "left")}>Left</button>
          <div className="touch-btn pointer-events-none opacity-50">Move</div>
          <button type="button" className="touch-btn" {...pointerBind(input, "right")}>Right</button>
          <div />
          <button type="button" className="touch-btn" {...pointerBind(input, "down")}>Down</button>
          <div />
        </div>

        <div className="grid grid-rows-3 gap-2 text-xs uppercase tracking-[0.2em] text-cyan-100">
          <button type="button" className="touch-btn" {...pointerBind(input, "action")}>Action</button>
          <button type="button" className="touch-btn" {...pointerBind(input, "action2")}>Alt</button>
          <button type="button" className="touch-btn" onClick={onPause}>Pause</button>
        </div>
      </div>
    </div>
  );
};
