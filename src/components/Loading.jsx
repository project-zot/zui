import React from 'react';
import {makeStyles} from '@material-ui/core';
import logo from "../assets/zot_1T.png";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
        paddingRight: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
}));

const Loading = () => {
    const classes = useStyles();

    return (
        <div className={classes.wrapper}><img src={logo} className="App-logo Loading" alt="logo" /></div>
    );
};

export default Loading;
