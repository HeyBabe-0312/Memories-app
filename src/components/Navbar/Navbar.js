import React,{useState,useEffect} from 'react'
import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core'
import useStyles from './styles'
import jwt_decode from "jwt-decode";
import memoriesLogo from '../../assets/memoriesLogo.png';
import memoriesText from '../../assets/memoriesText.png';
import {Link, useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'


const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('profile')));
    const logout = () => {
        dispatch({type: 'LOGOUT'})
        
        setUser(null);

        window.location.reload();

    }
    useEffect(()=>{
        const token = user?.token;

        if (token) {
            const decodedToken = jwt_decode(token);
      
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
          }

        setUser(JSON.parse(localStorage.getItem('profile')));
    },[location])
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to='/' className={classes.brandContainer}>
                <img src={memoriesText} alt="icon" height="45px" />
                <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.picture}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                        <Button className={classes.logout} variant="contained" color="secondary" onClick={logout}>LogOut</Button>
                    </div>
                ): (
                    <Button component={Link} to='/auth' variant="contained" color='primary'>Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar