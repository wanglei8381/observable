import { Observable } from '../../Observable'
import { DeferObservable } from '../../observables/defer'
Observable.defer = DeferObservable.create
