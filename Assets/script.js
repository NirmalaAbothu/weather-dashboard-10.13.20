//DOM reference variables
console.log("connected to script file");
submitEl = $("#button");
inputEL = $("#txtSearch");
messageEL = $("#msg");
listEL = $(".list-group");

const cityEl = $(".city");
const windEl = $(".wind");
const humidityEl = $(".humidity");
const tempEl = $(".temp");
const uvindexEL = $(".uvindex")
var $currentDay = $("#currentDay");
var currentDate = moment().format('l');;
var resultEL = $(".temperature");
var forecastELs = document.querySelectorAll(".forecast");


//declare array
var cityList = JSON.parse(localStorage.getItem("cities")) || [];
function displayMessage(type,message)
{
    messageEL.text(message);
    messageEL.attr("class",type);

}
function rendercities(){
    console.log("render function called");
    
listEL.empty();
// var cityList = JSON.parse(localStorage.getItem("cities"));
if(JSON.parse(localStorage.getItem("cities")))
    

{
//looping thru the city array to display each city
for(var i=0;i<cityList.length;i++)
{
    var button = $("<button>");
    button.addClass("city")
    button.attr("data-name",cityList[i]);
button.text(cityList[i]);
listEL.append(button);
}
}

}
//function get uvindex
function getUVIndex(lat,lon)
{

uvindexEL.empty();
    
    var queryURL ="https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + 
    "&lon=" + lon + "&appid=00ca04ab09444ea47ef6c4428f3606b7&cnt=1";
    lat+"&lon="+lon;
   
    $.ajax({
        url: queryURL,
        method: 'GET'        
    }).then(function(response){
console.log(response[0].value);
var result=response;
console.log(result);
// uvindexEL.innerHTML = "UV Index:"+ response[0].value;
// uvindexEL.text("UV Index: "+response[0].value);
// modified

var uvindex = response[0].value;
            var bgcolor;
            if (uvindex <= 3) {
                bgcolor = "green";
            }
            
            else {
                bgcolor = "red";
            }
            var uvdisp = $("<p>").attr("class", "card-text").text("UV Index: ");
            uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
            uvindexEL.append(uvdisp);
            

    })
}
// function 
function getFiveDayForecastWeather(city)
{
    console.log(city);
    var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q="+city+
    "&appid=00ca04ab09444ea47ef6c4428f3606b7";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
        for(var i=0;i<forecastELs.length;i++)
        {
            forecastELs[i].innerHTML="";
            const forecastIndex = i*8 + 4;
            const forecastdateEL = $("<P>");
           forecastdateEL.text(moment(response.list[i].dt_txt, "X").format("MMM Do"))
            forecastELs[i].append(forecastdateEL)
            console.log(forecastdateEL);
            const forecastWeatherImg = $("<img>");
            forecastWeatherImg.attr("src","https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"); 
            forecastELs[i].append(forecastWeatherImg);
            console.log(forecastWeatherImg);
            const forecastWeatherTempEL = $("<P>");
            forecastWeatherTempEL.innerHTML = "Temp: "+convertKtoF(parseFloat(response.list[i].main.temp)) + "&deg;F";
            forecastELs[i].append(forecastWeatherTempEL);
            const forecastWeatherHumidityEL = $("<P>");
            // var reult = JSON.stringify(response.list[i].main.temp);
            // forecastWeatherHumidityEL.text(result);
            forecastWeatherHumidityEL.text("Temp: "+response.list[i].main.temp + "%");
            forecastELs[i].append(forecastWeatherHumidityEL);
        }
    })
}
//function 
var displayWeather = function(data){
    console.log(data);
    cityEl.text(data.name);
    
    cityEl.append($currentDay.text(currentDate));
    $currentDay.text(currentDate)
    windEl.text("Wind Speed: "+data.wind.speed + "MPH");
    // windEl.innerHTML="Wind Speed:"+data.wind.speed + "m/s";
    humidityEl.text("Humidity: "+data.main.humidity + "%");
    tempEl.html("Temperature: "+
         convertKtoF(parseFloat(data.main.temp)) + "&deg;F"
    );
    var long = data.coord.lon;
    console.log(long);   
    var lat = data.coord.lat;
    console.log(lat);
    getUVIndex(lat,long);
    var city = data.name;
    getFiveDayForecastWeather(city);
    console.log(data.sys.id);
}

    

    //function
    function convertKtoF(tempInKelvin) {
        // (360K − 273.15) × 9/5 + 32 = 188.33°F
        return ((tempInKelvin - 273.15) * 9) / 5 + 32;
   }


//function 
var getWeather = function(city){
    
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=00ca04ab09444ea47ef6c4428f3606b7";
    $.ajax({
url: queryURL,
method: "GET"
    }).then(function(response){
        console.log(response);
        var data = response;
        displayWeather(data);
});
}

    submitEl.on("click",function(event){
        console.log("button clicked");
        event.preventDefault();
        var city = inputEL.val().trim();
        if(city === "")
        {
            displayMessage("error","please enter city name");
            
    
        }
        
        if(city != "")
        {
        cityList.push(city);
        messageEL.addClass("hide");
        localStorage.setItem("cities",JSON.stringify(cityList));
        getWeather(city);
        inputEL.val("");
        rendercities();
        }
    });
    //function 
    function displayCityForecast()
    {
        var city = $(this).attr("data-name");
        getWeather(city);


    }
    // function to display city forecast
    $(document).on("click",".city",displayCityForecast)
    rendercities();
    if(cityList.length>0)
    {
        getWeather(cityList[cityList.length-1]);
    }


