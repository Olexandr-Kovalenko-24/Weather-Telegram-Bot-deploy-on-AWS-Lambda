const axios = require('axios');
const { Telegraf } = require('telegraf');
const token = '5926403640:AAEFrUMbmqs-Vl-v_j_C85i9F8tuK-z2SoQ';
const getCurrentWeather = require('./currentWeather');

const bot = new Telegraf(token);

const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const API_KEY = '474a73c5782c46a96eef17232c65eeb1';


bot.on('text', async ctx => {
    let chatId = ctx.update.message.chat.id;
    let text = ctx.update.message.text;
    console.log(ctx);

    if (text === '/start') {
        await ctx.telegram.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9d4/44b/9d444bb6-d895-3ddc-9d38-44981f03bc65/192/5.webp')
        return ctx.telegram.sendMessage(chatId, 'Welcome to the weather bot :) \n\nTo learn how to use the bot click info \u{1F447}')
    }
    if (text === '/info') {
        return ctx.telegram.sendMessage(chatId, `This bot help you get the current weather ${ctx.from.first_name} \u{1F609} \n\nType your city (English language) or send the current location to know the weather \u{1F64C}`)
    }
    // if (ctx.message.location) {
    //     try {
    //         const weatherAPIUrl = `${API_BASE}?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${API_KEY}&units=metric`;
    //         const { data: weatherData } = await axios.get(weatherAPIUrl);
    //         getCurrentWeather(weatherData, bot, chatId);
    //     } catch (error) {
    //         await ctx.telegram.sendMessage(chatId, 'Sorry, cannot get the weather, try one more time')
    //     }
    // }
    if (text) {
        try {
            const weatherAPIUrl = `${API_BASE}?q=${text}&appid=${API_KEY}&units=metric`;
            const { data: weatherData } = await axios.get(weatherAPIUrl);
            getCurrentWeather(weatherData, ctx, chatId);
        } catch (error) {
            await ctx.telegram.sendMessage(chatId, 'I don`t understand. Please write your city one more time')
        }
    }
})
// bot.launch();

exports.handler = (event, context, callback) => {
    const answer = JSON.parse(event.body);
    bot.handleUpdate(answer);
    return callback(null, {
        statusCode: 200,
        body: '',
    });
}