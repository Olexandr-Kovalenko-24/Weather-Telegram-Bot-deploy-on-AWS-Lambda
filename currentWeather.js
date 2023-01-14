const getCurrentWeather = async (weatherData, ctx, chatId) => {

    let temp = Math.round(weatherData.main.temp_min);
    let pressure = Math.round(weatherData.main.pressure / 1.333);
    let rise = new Date(parseInt(weatherData.sys.sunrise) * 1000);
    let set = new Date(parseInt(weatherData.sys.sunset) * 1000);

    await ctx.telegram.sendMessage(chatId, '**** '
        + weatherData.name + ' ****\nTemperature: '
        + String(temp) + '°C\nHumidity: ' +
        weatherData.main.humidity + ' %\nWeather: '
        + weatherData.weather[0].description +
        '\nWind speed: ' + weatherData.wind.speed + ' m/sec' +
        '\nPressure: ' + String(pressure)
        + ' mmhg\nSunrise: ' +
        rise.toLocaleTimeString() +
        ' \nSunset: ' +
        set.toLocaleTimeString() +
        '\nCountry: ' + weatherData.sys.country)
}

module.exports = getCurrentWeather;