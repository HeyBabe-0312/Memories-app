import React, {useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import {useDispatch} from 'react-redux'
import {useNavigate } from 'react-router-dom'
import { signin, signup} from '../../actions/auth'

import Input from './Input'

import useStyles from './styles'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const [showP, setShowP] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useNavigate();
    const handleShowPassword = () => setShowP((prevShowPassword)=> !prevShowPassword);
    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup){
            if(formData.confirmPassword===formData.password) dispatch(signup(formData, history));
            else window.alert("Passwords dont't match.");
        } else {
            dispatch(signin(formData, history))
        }
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const switchMode = () => {
        setIsSignup((prevIsSignup)=> !prevIsSignup);
        setShowP(false);
    }
    const googleSuccess = (jwtCode) => {
        const result = jwt_decode(jwtCode);
        try {
            dispatch({type: 'AUTH', data: {result, token: jwtCode}});

            history('/');
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>{isSignup ? 'Sign Up': 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                                <Input name='firstName' label='First Name' autoComplete='additional-name' handleChange={handleChange} autoFocus half/>
                                <Input name='lastName' label='Last Name' autoComplete='family-name' handleChange={handleChange} half/>
                            </>
                        )}
                        <Input name='email' label='Email Address' autoComplete='username' handleChange={handleChange} autoFocus={isSignup ? false : true} type='email'/>
                        <Input name='password' label='Password' autoComplete='current-password' handleChange={handleChange} type={showP ? 'text' : 'password'} handleShowPassword={handleShowPassword}/>
                        {isSignup && <Input name='confirmPassword' autoComplete='current-password' label='Repeat Password' handleChange={handleChange} type="password"/>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <Button className={classes.googleButton} color='inherit' fullWidth variant='contained'>
                    <GoogleLogin
                        width='350px'
                        onSuccess={credentialResponse => {
                           googleSuccess(credentialResponse.credential);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                    </Button>
                    <div class="g-signin2" data-onsuccess="onSignIn"></div>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode} >
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth