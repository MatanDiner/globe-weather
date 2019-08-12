import React from 'react'
import classes from './Spinner.css'

const spinner = (props) => {

    let spinnerClass =  classes.Loader_Dark ;
    if(!props.screenMode)
    spinnerClass =  classes.Loader_Light ;

    return <div className={spinnerClass}>Loading...</div>
};


export default spinner;
