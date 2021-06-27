import {
	FETCH_POST,
	FETCH_ALL,
	CREATE,
	UPDATE,
	DELETE,
	LIKE,
	FETCH_BY_SEARCH,
	START_LOADING,
	END_LOADING,
} from '../constants/actionTypes';
const posts = (state = { isLoading: true, posts: [] }, action) => {
	switch (action.type) {
		case START_LOADING:
			return { ...state, isLoading: true };
		case END_LOADING:
			return { ...state, isLoading: false };
		case CREATE:
			return { ...state, posts: [...state, action.payload] };
		case FETCH_POST:
			return {
				...state,
				post: action.payload,
			};
		case FETCH_BY_SEARCH:
			return {
				...state,
				posts: action.payload,
			};
		case DELETE:
			return {
				...state,
				posts: state.posts.filter(post => post._id !== action.payload),
			};
		case FETCH_ALL:
			return {
				...state,
				posts: action.payload.data,
				currentPage: action.payload.currentPage,
				numberOfPages: action.payload.numberOfPages,
			};
		case UPDATE:
		case LIKE:
			return {
				...state,
				posts: state.posts.map(post =>
					post._id === action.payload._id ? action.payload : post
				),
			};
		default:
			return state;
	}
};

export default posts;
