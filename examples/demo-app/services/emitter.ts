import { createEmitter } from "@codesuma/baseline";
import { AppEventMap } from "../interfaces/app-events";

export const emitter = createEmitter<AppEventMap>();