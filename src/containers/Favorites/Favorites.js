import React, { useState, useEffect, useContext } from 'react';
import FavoritesList from '../FavoritesList/FavoritesList';
import { getFavoritesList, getFavoriteListByDegreeType } from '../../services/weather';
import HeaderButtonsContext from '../../Contexts/headerButtonsContext';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Favorites.css';

import {getFilteredSearchList} from '../../services/search';
import Search from '../../components/Search/Search';

const Favorites = props => {

    const context = useContext(HeaderButtonsContext);

    const [favoritesState, setFavoritesState] = useState({
        favoritesList: null,
    })

    const [errorState, setErrorState] = useState({
        error: false,
        errorMassage: ""
    })

    const [searchState,setSearchState] = useState({
        searchList:null
    })

    useEffect(() => {
        if (!props.favorites)
            props.getFavorites();
    }, [])

    useEffect(() => {
        if (props.favorites) {
            getFavoritesList(context.degrreMode, props.favorites)
                .then(favorites => {
                    setFavoritesState({
                        favoritesList: favorites,
                    })
                })
                .catch(err => {
                    setErrorState({
                        error: true,
                        errorMassage: `An error occurred while trying to get Your favorits List.`
                    })
                })
        }
    }, [props.favorites])


    useEffect(() => {
        if (favoritesState.favoritesList) {
            const favoritesList = getFavoriteListByDegreeType(context.degrreMode, favoritesState.favoritesList);
            setFavoritesState({
                favoritesList
            })
        }
    }, [context.degrreMode])


    const modalClosed = () => {
        setErrorState({
            error: false,
            errorMassage: ""
        })
    }

    const removeFromFavorite = id => {
        props.removeFromFavorites(id);
    }

    const setSearchResult = value =>{
        if(favoritesState.favoritesList){
        const searchList = getFilteredSearchList(value,favoritesState.favoritesList,"name");
        setSearchState({
            searchList
        })
        }
    }

    let errorMassage = null;
    if (errorState.error) {
        errorMassage = <Modal show={errorState.error}
            modalClosed={() => modalClosed()} >
            {errorState.errorMassage}</Modal>
    }

    let favoriteList = <Spinner />
    if (favoritesState.favoritesList) {
        favoriteList = <FavoritesList
            favoritesList={searchState.searchList || favoritesState.favoritesList}
            removeFromFavorite={removeFromFavorite}
        />
    }

    let searchClasses = [classes.Search,classes.DarkSearch];
    if(!context.screenMode){
        searchClasses = [classes.Search,classes.LightSearch]
    } 

    return (

        <div className={classes.Favorites}>
            {errorMassage}
            <div className={searchClasses.join(" ")}>
                <Search screenMode={context.screenMode} setSearchResult={setSearchResult}/>
            </div>
            <div className={classes.favoriteList}>
                {favoriteList}
            </div>
        </div>

    )

}


export default Favorites;