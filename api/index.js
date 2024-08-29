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
            let airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, isSunUp, latitude, longitude, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, time, timezone, uvIndex, visibility, windDirection, windSpeed;

            airQualityIndex = parseInt(htmlDocument.window.document.querySelector("[data-testid='AirQualityCard']").querySelector("[data-testid='DonutChartValue']").innerHTML, 10);

            // today's details WeatherDetailsLabels
            const todaysDetailsLabels = htmlDocument.window.document.querySelector("[data-testid='TodaysDetailsModule']").querySelectorAll("[data-testid='WeatherDetailsLabel']");

            // loop through labels
            for (let i = 0; i < todaysDetailsLabels.length; i++) {
                // get sibling wxdata element
                let valueElement = todaysDetailsLabels[i].parentNode.querySelector("[data-testid='wxData']");

                switch (todaysDetailsLabels[i].innerText) {
                    case "Wind":

                        break;

                    case "Humidity":

                        break;

                    case "Dew Point":

                        break;

                    case "Pressure":

                        break;

                    case "UV Index":

                        break;

                    case "Visibility":
                        visibility = parseInt(valueElement.innerText);
                        break;

                    case "Moon Phase":
                        moonPhase = valueElement.innerText;
                        break;
                }
            }

            // send response json
            res.status(200).json({ airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, isSunUp, latitude, longitude, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, time, timezone, uvIndex, visibility, windDirection, windSpeed });
        });
}