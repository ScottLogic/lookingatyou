import {
    applyMiddleware,
    createStore as createReduxStore,
    Middleware,
    Store,
} from 'redux';
import { load, save } from 'redux-localstorage-simple';
import thunk from 'redux-thunk';
import { IConfigState } from './actions/config/types';
import { initialState } from './reducers/configReducer';
import reducer, { IRootStore } from './reducers/rootReducer';

const states = ['configStore'];
const middleware: Middleware[] = [thunk, save({ states })];

export function createStore() {
    const savedState: object | undefined = load({ states });
    let savedStateIsValid;
    if (savedState.hasOwnProperty('configStore')) {
        const previousConfigState: IConfigState = (savedState as {
            configStore: IConfigState;
        }).configStore;
        savedStateIsValid = hasKeysOfInitialConfigState(previousConfigState);
    } else {
        savedStateIsValid = false;
    }

    return createReduxStore(
        reducer,
        savedStateIsValid ? savedState : undefined,
        applyMiddleware(...middleware),
    );
}

export function hasKeysOfInitialConfigState(objToCheck: object) {
    return hasKeysOf(objToCheck, initialState);
}

export function hasKeysOf(objToCheck: object, objToMatch: object): boolean {
    const propsToCheck = Object.keys(objToCheck);
    const propsToMatch = Object.keys(objToMatch);
    return (
        typeof objToCheck === 'string' ||
        typeof objToMatch === 'string' || // prevents infinite recursion
        propsToMatch.every(prop => {
            return (
                propsToCheck.indexOf(prop) >= 0 &&
                hasKeysOf(
                    (objToCheck as { [prop: string]: object })[prop],
                    (objToMatch as { [prop: string]: object })[prop],
                )
            );
        })
    );
}

export type AppStore = Store<IRootStore>;
