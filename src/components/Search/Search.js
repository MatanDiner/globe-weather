import React, { useState } from 'react';
import { isEngliseLetter } from '../../services/search';
const Search = props => {

    const [searchValueState, setSearchValueState] = useState({
        searchValue: ""
    })

    const changed = e => {
        const searchValue = e.target.value;
        const isEng = isEngliseLetter(searchValue);
        if (isEng) {
            setSearchValueState({searchValue})
            props.setSearchResult(searchValue);
        }
    }

    return (

        <div>
            <input type="text"
                placeholder="Search..."
                value={searchValueState.searchValue}
                onChange={(event) => changed(event)}
            />
        </div>


    )


}


export default Search;