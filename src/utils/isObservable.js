import { Observable } from '../Observable'
export const isObservable = val => {
  return val != null && val instanceof Observable
}
