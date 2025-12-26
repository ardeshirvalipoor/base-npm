import { createEmitter } from "../baseline/utils/emitter";
import { AppEventMap } from "../interfaces/app-events";

export const emitter = createEmitter<AppEventMap>();