const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'http://api.geonames.org';
const tripDateInput = document.getElementById('trip-date');
const countdownText = document.getElementById('countdown-text');
const pixabay = process.env.pixabay;
const APIKey = process.env.APIKey;
const endDateInput = document.getElementById('end-date');

function getUsername() {
  return axios.get(`${baseUrl}/username`)
    .then(response => {
      console.log('Username retrieved:', response.data.username);
      return response.data.username;
    })
    .catch(error => {
      console.log('Error:', error);
      return null;
    });
}

function handleSubmit(event) {
  console.log('handleSubmit called');
  event.preventDefault();

  const city = document.getElementById('city-input').value;
  const country = document.getElementById('country-input').value;
  const startDateString = tripDateInput.value;
  const endDateString = endDateInput.value;
  const selectedStartDate = new Date(startDateString);
  const selectedEndDate = new Date(endDateString);
  const timeDifference = selectedEndDate.getTime() - selectedStartDate.getTime();
  const tripLength = Math.ceil(timeDifference / (1000  *3600*  24));

  const url = `${baseUrl}/searchJSON?username=${encodeURIComponent(process.env.username)}&q=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;

  axios.post(url)
    .then(response => {
      const data = response.data;
      const latitude = data.geonames[0].lat;
      const longitude = data.geonames[0].lng;
      const cityName = data.geonames[0].name;

      const weatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=ce8421489e904ff4b766eeed679730b0`;

      axios.get(weatherbitUrl)
      .then(weatherResponse => {
        const weatherData = weatherResponse.data;
    
        const highTemperature = weatherData.data[0].high_temp;
        const lowTemperature = weatherData.data[0].low_temp;
        const cloudiness = weatherData.data[0].clouds;
    
        console.log('High Temperature:', highTemperature);
        console.log('Low Temperature:', lowTemperature);
        console.log('Cloudiness:', cloudiness);
    
        // Creating a data object with the retrieved information
        const geonamesData = {
          city: cityName,
          country: country,
          highTemperature: highTemperature,
          lowTemperature: lowTemperature,
          cloudiness: cloudiness,
          countdown: countdownText.textContent,
    tripLength: tripLength,
        };

        axios.get(`https://pixabay.com/api/?key=39732215-6403c46006d7aa7727b77eb88&q=${encodeURIComponent(cityName)}&image_type=photo`)
    .then(pixabayResponse => {
      const pixabayData = pixabayResponse.data;
      if (pixabayData.hits.length > 0) {
        const imageUrl = pixabayData.hits[0].webformatURL;
        console.log('Image URL:', imageUrl);
        // Updating the UI with the image URL
        geonamesData.imageUrl = imageUrl; // Adding the imageUrl property to the geonamesData object
        updateUI(geonamesData, weatherData.clouds);
      } else {
        console.log('No image found');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });

      })
      .catch(error => {
        console.log('Error:', error);
      });

      const endDateInput = document.getElementById('end-date');

endDateInput.addEventListener('change', () => {
  const selectedEndDate = new Date(endDateInput.value);
  const currentDate = new Date();
  const timeDifference = selectedEndDate.getTime() - currentDate.getTime();
  const tripLength = Math.ceil(timeDifference / (1000  *3600*  24));

  console.log('Trip Length:', tripLength);
});

      function updateUI(data, cloudiness) {
        const cloudinessText = getCloudinessText(cloudiness);
        const resultElement = document.getElementById('results');
        const imageElement = document.getElementById('image');
        if (resultElement && imageElement) {
          imageElement.src = data.imageUrl;
          resultElement.innerHTML = `My trip to ${data.city}, ${data.country}<br>High: ${data.highTemperature}<br>Low: ${data.lowTemperature}<br>Cloudiness: ${cloudinessText}<br>Countdown: ${data.countdown}<br>Trip Length: ${data.tripLength} days<br><br><img src="${data.imageUrl}" alt="City Image">`;
        } else {
          console.log('Error: result element not found');
        }
      
        console.log('Data:', data);
        document.getElementById('cityName').textContent = data.city;
        document.getElementById('highTemperature').textContent = data.highTemperature;
        document.getElementById('lowTemperature').textContent = data.lowTemperature;
        document.getElementById('cloudiness').textContent = cloudinessText;
        console.log('Response data:', data);
        document.getElementById('results').innerHTML = data.message;
      }

      function getCloudinessText(cloudiness) {
        if (cloudiness <= 20) {
          return 'Clear sky';
        } else if (cloudiness <= 50) {
          return 'Partly cloudy';
        } else if (cloudiness <= 80) {
          return 'Mostly cloudy';
        } else {
          return 'Cloudy';
        }
        
      }

      // Using the geonamesData object as needed
      console.log(geonamesData);
    })
    .catch(error => {
      console.log('Error:', error);
    });
    
}

document.addEventListener('DOMContentLoaded', function() {
  getUsername().then(username => {
    document.getElementById('myForm').addEventListener('submit', handleSubmit);
  });

  tripDateInput.addEventListener('change', () => {
    const selectedDate = new Date(tripDateInput.value);
    const currentDate = new Date();
    const timeDifference = selectedDate.getTime() - currentDate.getTime();
    const remainingDays = Math.ceil(timeDifference / (1000  *3600*  24));
  
    countdownText.textContent = `Your trip is in ${remainingDays} days!`;
  });
});

const date = new Date(); // Get the current date
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed

const formattedDate = `${year}-${month}-${day}`;

module.exports = {
  handleSubmit,
  getUsername,
};


