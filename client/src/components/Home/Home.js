import React, { useEffect, useState } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination/Pagination';
import {useHistory, useLocation} from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles'

function useQuery(){
	return new URLSearchParams(useLocation().search)
}


const Home = () => {
	const classes = useStyles();
	const [currentId, setCurrentId] = useState(0);
	const query = useQuery();
	const history = useHistory();
	const dispatch = useDispatch();
	const page = query.get('page') || 1;
	const searchQuery = query.get('searchQuery')
	const [search, setSearch] = useState('')
	const [tags, setTags] = useState([])

	const handleKeyPress = (e) =>{
		if(e.keyCode === 13){
			searchPost()
		}
	}
	const handleAdd = (tag) => {
		setTags([...tags, tag])
	}
	const handleDelete = (tagToDelete) => {
		setTags(tags.filter(tag => tag !== tagToDelete))
	}

	const searchPost = () => {
		if(search.trim() || tags){
			dispatch(getPostsBySearch({search, tags: tags.join(',')}))

			history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
		}else{
			history.push('/');
		}
	}

	useEffect(() => {
		dispatch(getPosts());
	}, [currentId, dispatch]);
	return (
		<Grow in>
			<Container maxWidth='xl'>
				<Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
					<Grid item xs={12} sm={6} md={9}>
						<Posts setCurrentId={setCurrentId} />
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
					<AppBar className={classes.appBarSearch} position="static" color="inherit">
						<TextField name="search" variant="outlined" onKeyPress={handleKeyPress} label="Search Memories" fullwidth  value={search} onChange={(e) => setSearch(e.target.value)} />
						<ChipInput style={{margin: '10px 0'}} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search tags" variant="outlined" />
						<Button className={classes.searchButton} variant="contained" color="primary" onClick={searchPost}>Search</Button>
					</AppBar>
						<Form currentId={currentId} setCurrentId={setCurrentId} />
						<Paper elevation={6}>
							<Pagination />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Grow>
	);
};

export default Home;
