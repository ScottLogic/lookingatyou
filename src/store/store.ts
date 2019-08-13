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
        savedStateIsValid = hasPropertiesOfInitialConfigState(
            previousConfigState,
        );
    } else {
        savedStateIsValid = false;
    }

    return createReduxStore(
        reducer,
        savedStateIsValid ? savedState : undefined,
        applyMiddleware(...middleware),
    );
}

export function hasPropertiesOfInitialConfigState(objToCheck: object) {
    return hasPropertiesOf(objToCheck, initialState);
}

export function hasPropertiesOf(source: unknown, target: unknown): boolean {
    if (typeof target !== 'object') {
        return true;
    } else {
        const requiredProps = Object.getOwnPropertyNames(target);
        if (typeof source !== 'object') {
            return requiredProps.length > 0;
        } else {
            return requiredProps.every(
                prop =>
                    (source as object).hasOwnProperty(prop) &&
                    hasPropertiesOf(
                        (source as { [prop: string]: unknown })[prop],
                        (target as { [prop: string]: unknown })[prop],
                    ),
            );
        }
    }
}

export type AppStore = Store<IRootStore>;
