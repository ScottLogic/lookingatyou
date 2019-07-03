import { applyMiddleware, createStore } from 'redux';
import { load, save } from 'redux-localstorage-simple';
import reducer from './reducers/rootReducer';

const states = ['configStore'];
const store = createStore(
    reducer,
    load({ states }),
    applyMiddleware(save({ states })),
);

export default store;
