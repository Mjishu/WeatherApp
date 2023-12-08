
const holder = document.getElementById("holder");
const mainTemp = document.getElementById("mainTemp");
const cloudImg = document.getElementById("cloudImg");
let unitHolder;
let unit = 'c';
let unitWind = "kph"

let temperatureLocaiton = 'jacksonville';

async function getDayForecast(){
    const weatherLocationApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=efc06b8840d54d3d941183403230512&q=${temperatureLocaiton}`, {mode:'cors'});
    if(weatherLocationApi.ok){
        const weatherData = await weatherLocationApi.json();

        console.log(weatherData)
        roundedCurrentTemp = Math.round(weatherData.current[`temp_${unit}`])
    
        holder.innerHTML = `Weather in ${weatherData.location.name}, ${weatherData.location.region} is ${roundedCurrentTemp}° ${unit.toUpperCase()} <br> Local Time is ${weatherData.location.localtime}`;
        mainTemp.innerHTML = roundedCurrentTemp + "°" + unit.toUpperCase();
        cloudImg.src = weatherData.current.condition.icon;
        
        
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
        dailyForecast.innerHTML = `${dailyData.forecast.forecastday[i].date} Temp ${avgRoundedTemp}° ${unit.toUpperCase()} <span class="minTemp">${minRoundedTemp}° ${unit.toUpperCase()}</span>`
        
        const dailyImg = document.createElement("img");
        dailyImg.src = dailyData.forecast.forecastday[i].day.condition.icon;

        dailyForecast.appendChild(dailyImg);
        dailyContainer.appendChild(dailyForecast);
        const feelslikeRoundedTemp = Math.floor(dailyData.current[`feelslike_${unit}`])

        const extraTemp = document.getElementById("extraTemp");
        extraTemp.innerHTML = `<span>Feels ${feelslikeRoundedTemp} ${unit.toUpperCase()} </span><br> <span>Humidity ${dailyData.current.humidity}% </span><br><span> Wind ${dailyData.current[`wind_${unitWind}`]} ${unitWind} </span><br> <span>Chance of Rain ${dailyData.forecast.forecastday[i].hour[12].chance_of_rain}%</span>`

    }
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
//todo: if value = true then temperature = celsius, if false temperature = farenheit