const axios = require('axios');
const TelegramApi = require('node-telegram-bot-api');
const token = '5926403640:AAEFrUMbmqs-Vl-v_j_C85i9F8tuK-z2SoQ';

const bot = new TelegramApi(token, { polling: true });

const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const API_KEY = '474a73c5782c46a96eef17232c65eeb1';

const getCurrentWeather = async (weatherData, chatId) => {

    let temp = Math.round(weatherData.main.temp_min);
    let pressure = Math.round(weatherData.main.pressure / 1.333);
    let rise = new Date(parseInt(weatherData.sys.sunrise) * 1000);
    let set = new Date(parseInt(weatherData.sys.sunset) * 1000);

    return bot.sendMessage(chatId, '**** '
        + weatherData.name + ' ****\nTemperature: '
        + String(temp) + '°C\nHumidity: ' +
        weatherData.main.humidity + ' %\nWeather: '
        + weatherData.weather[0].description +
        '\nWind speed: ' + weatherData.wind.speed + 'm/sec' +
        '\nPressure: ' + String(pressure)
        + ' mmhg\nSunrise: ' +
        rise.toLocaleTimeString() +
        ' \nSunset: ' +
        set.toLocaleTimeString() +
        '\nCountry: ' + weatherData.sys.country)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start page in weather bot' },
        { command: '/info', description: 'How to use the bot' }
    ])

    bot.on('message', async msg => {
        let chatId = msg.chat.id;
        let text = msg.text;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9d4/44b/9d444bb6-d895-3ddc-9d38-44981f03bc65/192/5.webp')
            return bot.sendMessage(chatId, 'Welcome to the weather bot :) \n\nTo learn how to use the bot click info \u{1F447}')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `This bot help you get the current weather ${msg.from.first_name} \u{1F609} \n\nType your city (English language) or send the current location to know the weather \u{1F64C}`)
        }
        if (msg.location) {
            try {
                const weatherAPIUrl = `${API_BASE}?lat=${msg.location.latitude}&lon=${msg.location.longitude}&appid=${API_KEY}&units=metric`;
                const { data: weatherData } = await axios.get(weatherAPIUrl);
                getCurrentWeather(weatherData, chatId);
            } catch (error) {
                return bot.sendMessage(chatId, 'Sorry, cannot get the weather, try one more time')
            }
        }
        if (text) {
            try {
                const weatherAPIUrl = `${API_BASE}?q=${text}&appid=${API_KEY}&units=metric`;
                const { data: weatherData } = await axios.get(weatherAPIUrl);
                getCurrentWeather(weatherData, chatId);
            } catch (error) {
                return bot.sendMessage(chatId, 'I don`t understand. Please write your city one more time')
            }
        }
    })
}

start();
