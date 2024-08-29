class WeatherData {
    constructor(
        airQualityIndex, city, description, dewPoint, feelsLike, high, humidity, isSunUp,
        latitude, longitude, low, moonPhase, pressure, rainChance, sunrise, sunset, temperature, time, timezone,
        uvIndex, visibility, windDirection, windSpeed
    ) {
        this.airQualityIndex = airQualityIndex;
        this.city = city
        this.description = description;
        this.dewPoint = dewPoint;
        this.feelsLike = feelsLike;
        this.high = high;
        this.humidity = humidity;
        this.isSunUp = isSunUp;
        this.latitude = latitude;
        this.longitude = longitude;
        this.low = low;
        this.moonPhase = moonPhase;
        this.pressure = pressure;
        this.rainChance = rainChance;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.temperature = temperature;
        this.time = time;
        this.timezone = timezone;
        this.uvIndex = uvIndex;
        this.visibility = visibility;
        this.windDirection = windDirection;
        this.windSpeed = windSpeed;
    }
}

module.exports = WeatherData