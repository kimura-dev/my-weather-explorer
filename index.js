'use strict';

$('#info').hide();
$('#map').hide();
$('.whole-box').hide();

function initMap(){
	openApp();
}
initMap();
/*----------------------------------------------*/
	/*// CALLS SEARCHIPSTACK() OUTPUTS DATA */
/*-----------------------------------------------*/
function openApp(){
	$('#startAppBtn').click(function(){
		$('header').hide();
		$('#map').show();
		$('form').show();
		$('#info').show();
		$('#instruction').html('<p class="col span-1-of-2">Explore anywhere on the map, then <strong>Click</strong> and get the locations weather listed below.</p>');
		$('#info').html(`
			<div id="location-box" class="col span-1-of-2" aria-live="polite">
				<div>
					<p><span>Your Location</span></p>
					<p><span id="flag"></span></p>
				</div>

				<div><p>
					<span id="state"></span></p>
				</div>

				<div><p>
					<span id="city"></span></p>
				</div>
			</div>`);
	searchIpStack();
	})
}

/*-------------------------------------------*/
	/* GEOLOCATES & CALLS GETGOOGLEMAP() 
/*-------------------------------------------*/
function searchIpStack(){

	$.getJSON("https://api.ipstack.com/check?access_key=c6ee8187642a24e73533d2395851c34c", function(data){
		let country = data.country_name;
		let ip = data.ip;
		let lat = data.latitude;
		let long = data.longitude;
		let state = data.region_name;
	    let city = data.city;
		let countryCode = "flag-icon flag-icon-"+data.country_code.toLowerCase();
		
		getGoogleMaps(lat,long);

		$('#state').html(state);
		$('#city').html(city);
		$('#flag').addClass(countryCode);

	}).fail(function(){
		alert('Weather Coordinates Application will be back shortly!')

	})
	
}
/*---------------------------------------------*/
	/* Gets Google Map & ADDS EVENT LISTENER
/*---------------------------------------------*/
function getGoogleMaps(lat,long){
	let yourPosition = new google.maps.LatLng(lat, long);
	let mapOptions = {
		zoom: 10,
		center: yourPosition,
		minZoom: 1,
		maxZoom: 20,
		mapTypeControl:true,
		mapTypeControlOptions: {
			style:google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			mapTypeIds:['roadmap','terrain','satellite','hybrid'],
			position: google.maps.ControlPosition.TOP_RIGHT
		},
	}
	let map = new google.maps.Map(document.getElementById('map'), mapOptions);
/*------------------------------------------------*/
	/* Displays weather info on the maps click
/*------------------------------------------------*/
	map.addListener('click', function(e) {
      	placeMarkerAndPanTo(e.latLng, map);
    });
  
	function placeMarkerAndPanTo(latLng, map) {
		var marker = new google.maps.Marker({
	  	position: latLng,
	  	map: map
	});
	    map.panTo(latLng);
	    lat = latLng.lat();
	    long = latLng.lng();
		getWeatherResults(lat,long);		
	}
}
/*------------------------------------------------*/
	/* Retrieves and outputs openweather map api  */
/*------------------------------------------------*/
function getWeatherResults(lat,long){
	$.ajax({
		url: 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units=imperial&APPID=a30e90ff71187c10af9d6d60fdda44bd',
		type:'GET',
		dataType: 'jsonp',
		success:function(data){
			showResults(data);
		}
	}).fail(function(){
		alert('Weather API will be back shortly!');
	})
}
	
function showResults(data){
	let newCity =  data.name;
	let newCountryCode = "flag-icon flag-icon-"+data.sys.country.toLowerCase();
	$('#weather-info').html(`<div id="weather-results" class="col span 1-of-2"><h3 class="curr">Current weather for <span id="newFlag" class="${newCountryCode}"></span>${newCity}, ${data.sys.country} </h3>
		<hr>
		<div role="status">
			<div aria-live="polite">
				<ul>
					<li class="top-space"><p>Weather:<span>${data.weather[0].main}</span></p></li>
					<li><p>Description:<span><img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">${data.weather[0].description}</span><p></li>
					<li><p>Temperature:<span>${data.main.temp}&#8457</span></p></li>
					<li><p>Pressure:<span>${data.main.pressure}<span>hpa</span></span></p></li>
					<li><p>Humidity:<span>${data.main.humidity}%</span></p></li>
					<li><p>Min-Temp:<span>${data.main.temp_min}&#8457</span></p></li>
					<li><p>Max-Temp:<span>${data.main.temp_max}&#8457</span></p></li>
					<li><p>Wind Speed:<span>${data.wind.speed} m/s</span></p></li>
					<li><p>Wind Direction:<span>${data.wind.deg}&deg</span></p></li>
					<li><p>Visibliity:<span>${data.visibility}</span></p></li>
					<li><p>Clouds:<span>${data.clouds.all} okta</span></p></li>
				</ul>
			</div>
		</div>`);
};

