const API_Key = '19ffda1a93323f52e689caab91528bf8';
let units = 'metric';

const btn = document.querySelector('.btn');
const degree = document.querySelector('.degree');
const place = document.querySelector('#place');
const weatherState = document.querySelector('.weather-state');
const image = document.querySelector('.main-img');
const cards = document.querySelectorAll('.card');
const modal = document.getElementById("myModal");

let weather = {};

const modalShow = (text) => {
  modal.style.display = 'block';
  modal.firstElementChild.firstElementChild.textContent = text;
}

const getWeather = async (coords) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly,alerts&appid=${API_Key}&units=${units}`);
  if (!response.ok) {
    throw new Error('Failed to fetch coordinates. Please try again!')
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }
  return data;
}

const render = () => {
  degree.textContent = Math.round(weather.current.temp) + '°';
  weatherState.textContent = weather.current.weather[0].description[0].toUpperCase() + weather.current.weather[0].description.slice(1);
  image.src = `http://openweathermap.org/img/w/${weather.current.weather[0].icon}.png`;

  for (let i = 0; i < cards.length; i++) {
    const date = new Date(weather.daily[i].dt * 1000).toDateString();
    cards[i].querySelector('.date').textContent = date.slice(0, 3) + date.slice(7, 10);
    cards[i].querySelector('img').src = `http://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png`;
    cards[i].querySelector('.degree').textContent = Math.round(weather.daily[i].temp.max) + '°';
    cards[i].querySelector('.text').textContent = weather.daily[i].weather[0].description[0].toUpperCase() + weather.daily[i].weather[0].description.slice(1);
  }
}

const refresh = () => {
  modalShow('Please wait...');
  navigator.geolocation.getCurrentPosition(
    async (successResult) => {
      const coordinates = {
        lat: successResult.coords.latitude,
        lon: successResult.coords.longitude
      }
      weather = await getWeather(coordinates);
      render();
      modal.style.display = 'none';
    },
    error => {
      modalShow('Error! ' + error.message);
    }
  );
}

refresh();
btn.addEventListener('click', refresh);