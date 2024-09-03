const { JSDOM } = require("jsdom");

export default async function getWeather(req, res) {
	const { searchParams } = new URL(process.env.NEXT_PUBLIC_PROCESSING_SERVER + req.url);

	const latitude = searchParams.get("latitude");
	const longitude = searchParams.get("longitude");

	if (!latitude || !longitude) {
		res.status(400).send("Latitude and longitude not included or not formatted correctly.");
	}

	await fetch(`https://weather.com/weather/today/l/${latitude},${longitude}`)
		.then((response) => {
			if (!response.ok) {
				res.status(502).send("Bad gateway. Error reaching weather servers.");
				return;
			}

			return response.text();
		}).then((rawHtml) => {
			// parse html
			const htmlDocument = new JSDOM(rawHtml);

			// declare variables
			// TODO: finish getting all of these variables from scraping data
			let airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, timeUpdated, timezone, uvIndex, visibility, windDirection, windSpeed;

			// helper functions for getting elements
			const getElementFromTestId = (testId, parent = htmlDocument.window.document) => {
				return parent.querySelector(`[data-testid="${testId}"]`);
			};

			const getAllElementsFromTestId = (testId, parent = htmlDocument.window.document) => {
				return parent.querySelectorAll(`[data-testid="${testId}"]`);
			};

			// air quality index
			airQualityIndex = parseInt(getElementFromTestId("DonutChartValue", getElementFromTestId("AirQualityCard")).textContent, 10);

			// city
			city = getElementFromTestId("CurrentConditionsContainer").getElementsByTagName("h1")[0].textContent;

			// description
			description = getElementFromTestId("wxPhrase").textContent;

			// feels like
			feelsLike = parseInt(getElementFromTestId("TemperatureValue", getElementFromTestId("FeelsLikeSection")).textContent, 10);

			// rain chance

			// get first rain chance element
			const firstRainElement = getElementFromTestId("SegmentPrecipPercentage", getElementFromTestId("DailyWeatherModule"));

			// extract number, parse, and convert from percentage to decimal
			rainChance = parseInt(firstRainElement.textContent.match(/\d+/)[0], 10) / 100;

			// date stuff
			const timeStringToDate = (timeString) => {
				return new Date(new Date().toDateString() + " " + timeString);
			};

			// time updated and timezone
			const timeUpdatedString = getElementFromTestId("CurrentConditionsContainer").getElementsByTagName("span")[0].textContent;
			const splitTimeUpdatedString = timeUpdatedString.split(" ");

			timezone = splitTimeUpdatedString[splitTimeUpdatedString.length - 1];
			timeUpdated = timeStringToDate(timeUpdatedString.split("As of ")[1]).toISOString();

			// sunrise
			sunrise = timeStringToDate(getElementFromTestId("SunriseValue").textContent.substring(8) + " " + timezone).toISOString();

			// sunset
			sunset = timeStringToDate(getElementFromTestId("SunsetValue").textContent.substring(6) + " " + timezone).toISOString();

			// temperature, high, low
			const temperatureElements = getAllElementsFromTestId("TemperatureValue", getElementFromTestId("CurrentConditionsContainer"));

			temperature = parseInt(temperatureElements[0].textContent);
			high = parseInt(temperatureElements[1].textContent);
			low = parseInt(temperatureElements[2].textContent);

			// today's details WeatherDetailsLabels
			const todaysDetailsLabels = getAllElementsFromTestId("WeatherDetailsLabel", getElementFromTestId("TodaysDetailsModule"));

			// loop through labels
			for (let i = 0; i < todaysDetailsLabels.length; i++) {
				// get sibling wxdata element
				const valueElement = getElementFromTestId("wxData", todaysDetailsLabels[i].parentNode);

				switch (todaysDetailsLabels[i].textContent) {
					case "Humidity": {

						humidity = parseInt(valueElement.textContent, 10) / 100;
						break;
					}

					case "Pressure": {
						pressure = parseFloat(valueElement.textContent.substring(8), 10);
						break;
					}

					case "Visibility": {
						visibility = parseInt(valueElement.textContent, 10);
						break;
					}

					case "Wind": {
						// wind speed
						windSpeed = parseInt(valueElement.textContent.substring(14), 10);

						// wind direction
						let windDirectionElement = getElementFromTestId("Icon", valueElement);
						windDirection = parseFloat(windDirectionElement.style.transform.substring(7));
						break;
					}

					case "Dew Point": {
						dewPoint = parseInt(valueElement.textContent, 10);
						break;
					}

					case "UV Index": {
						uvIndex = parseInt(valueElement.textContent, 10)
						break;
					}

					case "Moon Phase": {
						moonPhase = valueElement.textContent;
						break;
					}
				}
			}

			// send response json
			res.status(200).json({ airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, latitude, longitude, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, timeUpdated, timezone, uvIndex, visibility, windDirection, windSpeed });
		});
}