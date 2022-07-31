import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation} from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination'
import useStyles from './styles'

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
  
    const handleKeyPress = (e) => {
        if(e.keyCode === 13){
            searchPost()
        }
    }

    const handleAdd = (tag) => setTags([...tags, tag])

    const handleDelete = (tagToDel) => setTags(tags.filter((tag)=> tag !== tagToDel))

    const searchPost = () => {
        if(search.trim() || tags){
            dispatch(getPostsBySearch({ search: search, tags: tags.join(',') }));
            history(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
        } else {
            history('/');
        }
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
            <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppBar className={classes.appBarSearch} position="static" color='inherit'>
                        <TextField naem='search' variant='outlined' onKeyDown={handleKeyPress} label='Search Memories' fullWidth value={search} onChange={(e)=> setSearch(e.target.value)}/>
                        <ChipInput
                            style={{margin: '10px 0'}}
                            value={tags}
                            onAdd={handleAdd}
                            onDelete={handleDelete}
                            label='Search Tags'
                            variant='outlined'
                        />
                        <Button onClick={searchPost} className={classes.searchButton} variant='contained' color='primary'>Search</Button>
                    </AppBar>
                    <Form currentId={currentId} setCurrentId={setCurrentId} />
                    {(!searchQuery && !tags.length) && (
                        <Paper elevation={6} className={classes.pagination}>
                            <Pagination page={page}/>
                        </Paper>
                    )}
                </Grid>
            </Grid>
            </Container>
        </Grow>
    )
}

export default Home