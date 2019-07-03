import { applyMiddleware, createStore } from 'redux';
import { load, save } from 'redux-localstorage-simple';
import reducer from './reducers/rootReducer';

const store = createStore(
    reducer,
    load({ states: ['configStore'] }),
    applyMiddleware(save({ states: ['configStore'] })),
);

export default store;
