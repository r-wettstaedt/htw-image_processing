import { createStore } from 'redux';
import reducers from './reducers';
import * as actions from './actions'

export const store = createStore(reducers)

export const initStore = () => {
    // store.subscribe(() =>
    //     console.log(store.getState().controls)
    // )
}
