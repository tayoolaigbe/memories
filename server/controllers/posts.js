import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
	const {page} = req.query
	try {
		const LIMIT = 8
		const startIndex = (Number(page) - 1) * LIMIT //get starting index of every pager
		const total = await PostMessage.countDocuments({})

		const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex)

		res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total /LIMIT)});
	} catch (error) {
		res.status(404).json(error.message);
	}
};

// QUERY => /posts?page=1 => page = 1 query
// PARAMS => /posts/:id => post/123 => id = 123 params

export const getPostsBySearch = async (req, res) => {
	const {searchQuery, tags} = req.query


	try {
		const title = new RegExp(searchQuery, 'i')

		const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',')}}]})

		res.json({data: posts})
	} catch (error) {
		res.status(404).json({ message: error.message});
	}
}

export const createPost = async (req, res) => {
	const post = req.body;

	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	});
	try {
		await newPost.save();

		res.status(201).json(newPost);
	} catch (error) {
		res.status(409).json(error.message);
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const { title, message, creator, name, likes, selectedFile, tags } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No Post with that Id`);

	try {
		const updatedPost = {
			creator,
			title,
			name,
			message,
			likes,
			tags,
			selectedFile,
			_id: id,
		};

		await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		console.log(error.message);
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No Post with that Id`);

	try {
		await PostMessage.findByIdAndRemove(id);

		res.json('Post deleted Successfully');
	} catch (error) {
		console.log(error);
	}
};

export const likePost = async (req, res) => {
	const { id } = req.params;

	try {
		if (!req.userId) return res.json({ message: 'Unauthenticated' });

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).send(`No Post with that Id`);

		const post = await PostMessage.findById(id);

		const index = post.likes.findIndex(id => id === String(req.userId));

		if (index === -1) {
			post.likes.push(req.userId);
		} else {
			post.likes = post.likes.filter(id => id !== String(req.userId));
		}

		const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
			new: true,
		});

		res.json(updatedPost);
	} catch (error) {
		console.log(error);
	}
};
