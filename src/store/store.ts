import {
    applyMiddleware,
    createStore as createReduxStore,
    Middleware,
} from 'redux';
import { load, save } from 'redux-localstorage-simple';
import reducer from './reducers/rootReducer';

const states = ['configStore'];
const middleware: Middleware[] = [save({ states })];

export function createStore() {
    return createReduxStore(
        reducer,
        load({ states }),
        applyMiddleware(...middleware),
    );
}
