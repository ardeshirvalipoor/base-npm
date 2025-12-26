// mounter.ts is now deprecated - mounted detection is handled by appender.ts
// This file kept for backward compatibility only

export function initMounter() {
    // No-op - appender handles mounting now
}

export default { observe: initMounter }