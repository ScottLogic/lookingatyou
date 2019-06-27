import { createStore } from 'redux';
import reducer, { IRootStore } from './reducers/rootReducer';

const store = createStore(reducer);

export default store;
