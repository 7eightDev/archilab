import '@testing-library/jest-dom'
import { deserialize, serialize } from 'node:v8'

// jsdom does not expose structuredClone, which the in-memory repositories rely on.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => deserialize(serialize(value))
}

// jsdom does not expose PointerEvent, which Base UI dispatches when a label toggles a switch.
if (typeof globalThis.MouseEvent === 'function' && typeof globalThis.PointerEvent !== 'function') {
  globalThis.PointerEvent = MouseEvent as typeof PointerEvent
}
