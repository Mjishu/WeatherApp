
const holder = document.getElementById("holder");
const mainTemp = document.getElementById("mainTemp");
const cloudImg = document.getElementById("cloudImg")

let temperatureLocaiton = 'kathmandu';

async function getApi(){
    const weatherLocationApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=efc06b8840d54d3d941183403230512&q=${temperatureLocaiton}`, {mode:'cors'});
    if(weatherLocationApi.ok){
        const weatherData = await weatherLocationApi.json();

        console.log(weatherData)
    
        
        holder.innerHTML = `Weather in ${weatherData.location.name} is ${weatherData.current.temp_c} C <br> Local Time is ${weatherData.location.localtime}`;
        mainTemp.innerHTML = weatherData.current.temp_c + " C";
        cloudImg.src = weatherData.current.condition.icon;
    }
    else{
        console.error(`Error: ${weatherLocationApi.status} - ${weatherLocationApi.statusText}`)
    }
}

getApi();

function searchEnter(element){
    if(event.key === 'Enter'){
        console.log(element.value);
        temperatureLocaiton = element.value;
        getApi();
        element.value = "";
    }
}

//todo: figure out how to make date look prettier