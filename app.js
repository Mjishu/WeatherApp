
const holder = document.getElementById("holder");
const mainTemp = document.getElementById("mainTemp");
const cloudImg = document.getElementById("cloudImg");
let unitHolder;
let unit = 'c';
let unitWind = "kph"

let temperatureLocaiton = 'jacksonville';

const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

async function getDayForecast(){
    const weatherLocationApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=efc06b8840d54d3d941183403230512&q=${temperatureLocaiton}`, {mode:'cors'});
    if(weatherLocationApi.ok){
        const weatherData = await weatherLocationApi.json();

        console.log(weatherData)
        roundedCurrentTemp = Math.round(weatherData.current[`temp_${unit}`])
        

        const localTimeStr = weatherData.location.localtime;
        const localTimeDate = new Date(localTimeStr);
        const timeFormat = Intl.DateTimeFormat('en-US',options).format(localTimeDate);

        cloudImg.src = weatherData.current.condition.icon;
        holder.innerHTML = `${weatherData.location.name}, ${weatherData.location.region}<br>${timeFormat}`;
        mainTemp.innerHTML = roundedCurrentTemp + "°" + unit.toUpperCase();
        mainTemp.className = "mainTemp"
        
        
        
    }
    else{
        console.error(`Error: ${weatherLocationApi.status} - ${weatherLocationApi.statusText}`)
    }
}

async function getDailyForecast(){
    const weatherLocationApi = await fetch (`http://api.weatherapi.com/v1/forecast.json?key=efc06b8840d54d3d941183403230512&q=${temperatureLocaiton}&days=7`, {mode:'cors'})
    const dailyData =await weatherLocationApi.json();

    console.log(dailyData)
    
    
    const dailyContainer = document.getElementById("dailyContainer");
    dailyContainer.innerHTML = "";
    for(let i =0; i<7;i++){
        const avgRoundedTemp = Math.floor(dailyData.forecast.forecastday[i].day[`avgtemp_${unit}`])
        const minRoundedTemp = Math.floor(dailyData.forecast.forecastday[i].day[`mintemp_${unit}`])
        const dailyForecast = document.createElement("div");
        dailyForecast.className = "dailyForecast";
        dailyForecast.setAttribute("id", 'day'+ (i+1));
        dailyForecast.innerHTML = `${dailyData.forecast.forecastday[i].date} <br>${avgRoundedTemp}° ${unit.toUpperCase()} <br><span class="minTemp">${minRoundedTemp}° ${unit.toUpperCase()}</span>`
        
        const dailyImg = document.createElement("img");
        dailyImg.src = dailyData.forecast.forecastday[i].day.condition.icon;

        dailyForecast.appendChild(dailyImg);
        dailyContainer.appendChild(dailyForecast);
        const feelslikeRoundedTemp = Math.floor(dailyData.current[`feelslike_${unit}`])

        const extraTemp = document.getElementById("extraTemp");
        extraTemp.innerHTML = `<span class='spanEx'><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdklEQVR4nO2XsUoDQRRFD4F0QUitraWKoBJF8Q9ik2/SKqB22mqhRT4gP6IhVtooSEBjoSjsysII4TKJOxJ8Y5wDt8nMhfv2zTwykEgkpski0AGGQC4qfrsE5ok4/MATXPUYaxGdEuG/dEGEDAMKeCJCclHoujmpAGtmrgN5oMxJBVgzcx1QoguspAKs+XcdyGMrKBVgzZ/uwPoPCig8UbA75jWm6HrhKbymLHge8h9A27O37dZG9w6sH/hdCXQP7EzYX6w9iKeLEasS5B3YLuFrAG/iXcOAUwlx8kveqXEjITYDvFvi7WOAHoN6gLcu3lcM0NFZC/DOifcZA3oSYiPA2xBvDwPOJcRhgPdYvGcY0PKc46USvhXP/WlhQNVNj9Egt98UsQzceSZQFSP2gEwCFV/3yJ3zmlPDHRv98hnQxJiDEn+Vx2mfCKi4INqJScqcp0JEND13wqd+DMdmHFU3UYoRew28OF25UdmyvLCJRCLB1PkEBvCEH+c7OMEAAAAASUVORK5CYII="> ${feelslikeRoundedTemp} ${unit.toUpperCase()} </span><br> <span class='spanEx'>        <img width="30" height="30" src="https://img.icons8.com/material-rounded/24/humidity.png" alt="humidity"/>
        ${dailyData.current.humidity}% </span><br><span class='spanEx'>  <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/wind--v1.png" alt="wind--v1"/> ${dailyData.current[`wind_${unitWind}`]} ${unitWind} </span><br> <span class='spanEx'> <img width="50" height="50" src="https://img.icons8.com/ios/50/heavy-rain.png" alt="heavy-rain"/> ${dailyData.forecast.forecastday[i].hour[12].chance_of_rain}%</span>`

    }
    const tempConvert = document.getElementById("converter");
    tempConvert.innerHTML = `Display °${unit.toUpperCase()}`
}

getDayForecast();
getDailyForecast();



function searchEnter(element){
    if(event.key === 'Enter'){
        console.log(element.value);
        temperatureLocaiton = element.value;
        getDayForecast();
        getDailyForecast();
        element.value = "";
        
    }
}

function changeUnit(){
    if(unitHolder){
        unit = 'c';
        unitWind = "kph"
        unitHolder = false;
    }else if (!unitHolder){
        unit = 'f';
        unitWind = 'mph'
        unitHolder = true
    }
    console.log(unit)
    getDayForecast();
    getDailyForecast();

}


//todo: figure out how to make date look prettier
//todo: need to add error handler