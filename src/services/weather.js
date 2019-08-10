import * as Resources from '../Resources/Resources';

export const getLocations = async (value) => {

    const response = await fetch(`${Resources.AutocompleteUrl}?apikey=${Resources.apiKey}&q=${value}`);
    const data = await response.json();
    return data;
}


export const getCuurentConditions = async (degreeType, locationKey) => {

    const response = await fetch(`${Resources.CurrentConditionsUrl}/${locationKey}?apikey=${Resources.apiKey}`);
    const data = await response.json();
    const { Value, Unit } = degreeType ? data["0"]["Temperature"]["Metric"] : data["0"]["Temperature"]["Imperial"];
    const WeatherText = data["0"]["WeatherText"];
    return { Value, Unit, WeatherText }
}

export async function getFavoritesList(degreeType, favorites) {

    const arr = [];
    for (let fav of favorites) {
        const cuurentConditions = await getCuurentConditions(degreeType, fav.id);
        arr.push({
            id: fav.id,
            name: fav.name,
            temp: cuurentConditions.Value,
            weatherText: cuurentConditions.WeatherText,
            unit: cuurentConditions.Unit
        })
    }
    return arr;
}


export const getFiveDayForecast = async (degreeType, locationKey) => {

    const response = await fetch(`${Resources.five_Days_Daily_Forecasts_Url}/${locationKey}?apikey=${Resources.apiKey}`);
    const data = await response.json();
    const { DailyForecasts } = data;
    const daysForecast = getForecasts(degreeType, DailyForecasts);
    return daysForecast;
}


function getForecasts(degreeType, DailyForecasts) {
    let day = null, dayForecast = null, nightForecast = null;
    const daysArr = [];
    DailyForecasts.forEach(function (df) {
        daysArr.push({
            dayName: getDayName(df.Date),
            day: {
                temp: degreeType ? fToC(df.Temperature.Maximum.Value) : df.Temperature.Maximum.Value,
                weatherText: df.Day.IconPhrase
            },
            night: {
                temp: degreeType ? fToC(df.Temperature.Minimum.Value) : df.Temperature.Minimum.Value,
                weatherText: df.Night.IconPhrase
            },
            unit: degreeType ? 'C' : 'F'
        })
    })
    return daysArr;
}


function getDayName(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    return dayName;
}


export function getFiveDayForecastByDegreeType(degreeType, forecasts) {
    const arr = [...forecasts];
    for (let i = 0; i < arr.length; i++) {
        arr[i].day.temp = degreeType ? fToC(arr[i].day.temp) : cToF((arr[i].day.temp));
        arr[i].night.temp = degreeType ? fToC(arr[i].night.temp) : cToF((arr[i].night.temp));
        arr[i].unit = degreeType ? 'C' : 'F'
    }
    return arr;
}

export function getFavoriteListByDegreeType(degreeType,favorites){
    const arr = [...favorites];
    for (let i = 0; i < arr.length; i++) {
        arr[i].temp =  degreeType ? fToC(arr[i].temp ) : cToF(arr[i].temp );
        arr[i].unit = degreeType ? 'C' : 'F';
    }
    return arr;
}

export function getCuurentConditionsByDegreeType(degreeType, currentCondions) {
    const obj = { ...currentCondions };
    obj.Value = degreeType ? fToC(obj.Value) : cToF(obj.Value);
    obj.Unit = degreeType ? 'C' : 'F';
    return obj;
}

function cToF(celsius) {
    const cTemp = celsius;
    const cToFahr = cTemp * 9 / 5 + 32;
    return Math.floor(cToFahr);
}

function fToC(fahrenheit) {
    const fTemp = fahrenheit;
    const fToCel = (fTemp - 32) * 5 / 9;
    return Math.floor(fToCel);
}


