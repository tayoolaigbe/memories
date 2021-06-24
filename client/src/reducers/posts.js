import {
	FETCH_ALL,
	CREATE,
	UPDATE,
	DELETE,
	LIKE,
	FETCH_BY_SEARCH
} from '../constants/actionTypes';
const posts = (posts = [], action) => {
	switch (action.type) {
		case CREATE:
			return [...posts, action.payload];
		case FETCH_BY_SEARCH:
			return action.payload;
		case DELETE:
			return posts.filter(post => post._id !== action.payload);
		case FETCH_ALL:
			return action.payload;
		case UPDATE:
		case LIKE:
			return posts.map(post =>
				post._id === action.payload._id ? action.payload : post
			);
		default:
			return posts;
	}
};

export default posts;
