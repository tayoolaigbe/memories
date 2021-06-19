import jwt from 'jsonwebtoken';

// User wants to like a post
// click the like button => auth middleware (next) => like controller.....
// router.patch('/:id/likePost', auth, likePost);

const auth = async (req, res, next) => {
	console.log('*******************');
	console.log(req.headers);

	try {
		const token = req.headers.authorization.split(' ')[1];
		const isCustomAuth = token.length < 500;

		let decodeData;
		if (token && isCustomAuth) {
			decodeData = jwt.verify(token, 'test');

			req.userId = decodeData?.id;
		} else {
			decodeData = jwt.decode(token);

			req.userId = decodeData?.sub;
		}

		next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;
