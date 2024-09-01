const { JSDOM } = require("jsdom");
const WeatherData = require("./WeatherData");

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

            response.text();
        }).then((rawHtml) => {
            // parse html
            const htmlDocument = new JSDOM(rawHtml);

            // declare variables
            // TODO: finish getting all of these variables from scraping data
            let airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, uvIndex, visibility, windDirection, windSpeed;

            // helper functions for getting elements
            const getElementFromTestId = (testId, parent) => {
                parent ??= htmlDocument.window.document;

                return parent.querySelector(`[data-testid="${testId}"]`);
            }

            const getAllElementsFromTestId = (testId, parent) => {
                parent ??= htmlDocument.window.document;
                return parent.querySelectorAll(`[data-testid="${testId}"]`);
            }

            // air quality index
            airQualityIndex = parseInt(getElementFromTestId("DonutChartValue", getElementFromTestId("AirQualityCard")).innerHTML, 10);

            // city
            city = getElementFromTestId("CurrentConditionsContainer").getElementsByTagName("h1")[0].innerText;

            // description
            description = getElementFromTestId("wxPhrase").innerText;

            // feels like
            description = parseInt(getElementFromTestId("TemperatureValue", getElementFromTestId("FeelsLikeSection")).innerText, 10);

            // rain chance
            rainChance = parseInt(getElementFromTestId("SegmentPrecipPercentage", getElementFromTestId("DailyWeatherModule")).innerText.split("\n")[1], 10) / 100;

            // sunrise
            sunrise = getElementFromTestId("SunriseValue").innerText;

            // sunset
            sunset = getElementFromTestId("SunsetValue").innerText;

            // temperature, high, low
            let temperatureElements = getAllElementsFromTestId("TemperatureValue", getElementFromTestId("CurrentConditionsContainer"));

            temperature = parseInt(temperatureElements[0].innerText);
            high = parseInt(temperatureElements[1].innerText);
            low = parseInt(temperatureElements[2].innerText);

            // today's details WeatherDetailsLabels
            const todaysDetailsLabels = getAllElementsFromTestId("WeatherDetailsLabel", getElementFromTestId("TodaysDetailsModule"));

            // loop through labels
            for (let i = 0; i < todaysDetailsLabels.length; i++) {
                // get sibling wxdata element
                const valueElement = getElementFromTestId("wxData", todaysDetailsLabels[i].parentNode);

                switch (todaysDetailsLabels[i].innerText) {
                    case "Humidity": {

                        humidity = parseInt(valueElement.innerText, 10) / 100;
                        break;
                    }

                    case "Pressure": {
                        pressure = parseFloat(valueElement.innerText, 10)
                        break;
                    }

                    case "Visibility": {
                        visibility = parseInt(valueElement.innerText, 10);
                        break;
                    }

                    case "Wind": {
                        // wind speed
                        windSpeed = parseInt(valueElement.innerText, 10);

                        // wind direction
                        windDirectionElement = getElementFromTestId("Icon", valueElement);
                        windDirection = parseFloat(windDirectionElement.style.transform.substring(7));
                        break;
                    }

                    case "Dew Point": {
                        dewPoint = parseInt(valueElement.innerText, 10);
                        break;
                    }

                    case "UV Index": {
                        uvIndex = parseInt(valueElement.innerText, 10)
                        break;
                    }

                    case "Moon Phase": {
                        moonPhase = valueElement.innerText;
                        break;
                    }
                }
            }

            // send response json
            res.status(200).json({ airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, latitude, longitude, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, uvIndex, visibility, windDirection, windSpeed });
        });
}