import {
    applyMiddleware,
    createStore as createReduxStore,
    Middleware,
    Store,
} from 'redux';
import { load, save } from 'redux-localstorage-simple';
import thunk from 'redux-thunk';
import reducer, { IRootStore } from './reducers/rootReducer';

const states = ['configStore'];
const middleware: Middleware[] = [thunk, save({ states })];

export function createStore() {
    return createReduxStore(
        reducer,
        load({ states }),
        applyMiddleware(...middleware),
    );
}

export type AppStore = Store<IRootStore>;
