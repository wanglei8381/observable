import { mergeMapOperator } from './mergeMap'

export function concatMap (project, resultSelector) {
  return mergeMapOperator(project, resultSelector, 1)
}
