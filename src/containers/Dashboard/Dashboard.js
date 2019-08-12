import React, { useState, useEffect, useContext } from 'react';
import CurrentCondition from '../currentCondition/currentCondition';
import AddToFavorites from '../AddToFavorites/AddToFavorites';
import classes from './Dashboard.css';
import { isFavorite } from '../../services/favorites';
import { getCuurentConditions, getFiveDayForecast, getFiveDayForecastByDegreeType, getCuurentConditionsByDegreeType } from '../../services/weather';
import FiveDaysForecast from '../FiveDaysForecast/FiveDaysForecast';
import HeaderButtonsContext from '../../Contexts/headerButtonsContext';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';

const Dashboard = props => {

    const context = useContext(HeaderButtonsContext);

    const [forecastsState, setForecastsState] = useState({
        curentConditions: {},
        fiveDaysForecast: []
    });

    const [isFavoriteState, setIsFavoriteState] = useState({
        isFavorite: null,
    });

    const [errorState, setErrorState] = useState({
        error: false,
        errorMassage: ""
    })


    useEffect(() => {
        props.getFavorites();
    }, [])


    useEffect(() => {
        if (props.locationKey) {
            const promiseArr = [getCuurentConditions(context.degrreMode, props.locationKey), getFiveDayForecast(context.degrreMode, props.locationKey)];
            Promise.all(promiseArr)
                .then(positionData => {
                    setForecastsState({
                        curentConditions: positionData[0],
                        fiveDaysForecast: positionData[1]
                    })
                })
                .catch(error => {
                    setErrorState({
                        error: true,
                        errorMassage: `An error occurred while trying to get location data.`
                    })
                });
        }
    }, [props.locationKey])


    useEffect(() => {
        if (Object.entries(forecastsState.curentConditions).length > 0 && forecastsState.fiveDaysForecast.length > 0) {
            const fiveDaysForecast = getFiveDayForecastByDegreeType(context.degrreMode, forecastsState.fiveDaysForecast);
            const curentConditions = getCuurentConditionsByDegreeType(context.degrreMode, forecastsState.curentConditions);
            setForecastsState({
                curentConditions,
                fiveDaysForecast
            })
        }
    }, [context.degrreMode])



    useEffect(() => {
        if (props.favorites && props.locationKey) {
            const isFav = isFavorite(props.locationKey, props.favorites)
            setIsFavoriteState({
                isFavorite: isFav
            })
        }
    }, [props.locationKey, props.favorites])


    const addToFavoritesToggle = isFavorite => {
        if (!isFavorite) {
            const location = {
                id: props.locationKey,
                name: props.locationName
            }
            props.addFavorites(location);
        }
        else {
            props.removeFromFavorites(props.locationKey)
        }
    }


    const modalClosed = () => {
        setErrorState({
            error: false,
            errorMassage: ""
        })
    }

    let classesArr = [classes.Dashboard, classes.DarkDashboard];
    if (!context.screenMode) {
        classesArr = [classes.Dashboard, classes.LightDashboard];
    }


    let errorMassage = null;
    if (errorState.error) {
        errorMassage = <Modal show={errorState.error}
            modalClosed={modalClosed}>
            {errorState.errorMassage}</Modal>
    }

    let dashboard = <div className={classesArr.join(" ")}><Spinner screenMode = {context.screenMode}/></div>;
    if (Object.entries(forecastsState.curentConditions).length > 0 && forecastsState.fiveDaysForecast.length > 0 && isFavoriteState.isFavorite !== null){
        dashboard = (
            <div className={classesArr.join(" ")}>
            {errorMassage}
            <div className={classes.CurrentCondition}>
                <CurrentCondition
                    name={props.locationName}
                    temp={forecastsState.curentConditions.Value}
                    unit={forecastsState.curentConditions.Unit}
                />
                <AddToFavorites isFavorite={isFavoriteState.isFavorite}
                    locationKey={props.locationKey}
                    addToFavoritesToggle={(isFavorite) => addToFavoritesToggle(isFavorite)}
                />
            </div>
            <div className={classes.WeatherText}>
                <label>{forecastsState.curentConditions.WeatherText}</label>
            </div>
            <div className={classes.FiveDaysForecast}>
                <FiveDaysForecast dark={context.screenMode}
                    fiveDayForecast={forecastsState.fiveDaysForecast} />
            </div>
        </div>
        )
    }

    return dashboard;

}


export default Dashboard;
