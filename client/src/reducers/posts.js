import {
	FETCH_ALL,
	CREATE,
	UPDATE,
	DELETE,
	LIKE,
	FETCH_BY_SEARCH
} from '../constants/actionTypes';
const posts = (state = [], action) => {
	switch (action.type) {
		case CREATE:
			return [...state, action.payload];
		case FETCH_BY_SEARCH:
			return  {
				...state,
				posts: action.payload,
			}
		case DELETE:
			return state.filter(post => post._id !== action.payload);
		case FETCH_ALL:
			return {
				...state,
				posts: action.payload.data,
				currentPage: action.payload.currentPage,
				numberOfPages: action.payload.numberOfPages
			};
		case UPDATE:
		case LIKE:
			return state.map(post =>
				post._id === action.payload._id ? action.payload : post
			);
		default:
			return state;
	}
};

export default posts;
