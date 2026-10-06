/** Go's WebAssembly runtime, defined globally by /startrek/wasm_exec.js. */
declare class Go {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
}

/** Callbacks the Super Star Trek WebAssembly program calls on the page. */
interface StarTrekTerminal {
  write: (text: string) => void;
  requestInput: () => void;
}

interface Window {
  /** Set by the page; the game writes output and asks for input through it. */
  startrekTerminal?: StarTrekTerminal;
  /** Set by the game once it starts; hands it the player's typed line. */
  startrekSubmit?: (line: string) => void;
}
