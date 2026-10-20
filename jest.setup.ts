import '@testing-library/jest-dom'
import { deserialize, serialize } from 'node:v8'

// jsdom does not expose structuredClone, which the in-memory repositories rely on.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => deserialize(serialize(value))
}
