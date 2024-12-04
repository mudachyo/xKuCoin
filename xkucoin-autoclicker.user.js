// ==UserScript==
// @name         xKuCoin Autoclicker
// @version      1.3
// @author       mudachyo
// @match        *://www.kucoin.com/*
// @icon         https://assets.staticimg.com/cms/media/3gfl2DgVUqjJ8FnkC7QxhvPmXmPgpt42FrAqklVMr.png
// @downloadURL  https://github.com/mudachyo/xKuCoin/raw/main/xkucoin-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/xKuCoin/raw/main/xkucoin-autoclicker.user.js
// @homepage     https://github.com/mudachyo/xKuCoin
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let autoClickerRunning = false;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clickRandomInsideElement(element) {
        const rect = element.getBoundingClientRect();
        const x = getRandomInt(rect.left, rect.right);
        const y = getRandomInt(rect.top, rect.bottom);

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        element.dispatchEvent(clickEvent);
    }

    function getCurrentEnergy() {
        const energyElement = document.querySelector('.process--W73kB');
        if (!energyElement) return null;

        const currentEnergy = parseInt(energyElement.querySelector('span').textContent, 10);
        return isNaN(currentEnergy) ? null : currentEnergy;
    }

    function findTargetElement() {
        return document.querySelector('#root > div.container--WYn0q.feedContainer--pPRP_.feedContainer > div.mainTouch--h_jfA > div.frog--XPwQb');
    }

    function startAutoClicker() {
        const element = findTargetElement();

        if (!element) {
            console.log('Элемент не найден, повторяю попытку...');
            setTimeout(startAutoClicker, 1000);
            return;
        }

        const currentEnergy = getCurrentEnergy();

        if (currentEnergy === 0) {
            const pauseDuration = getRandomInt(30000, 60000);
            console.log(`Энергия на нуле, пауза на ${pauseDuration / 1000} секунд`);
            setTimeout(startAutoClicker, pauseDuration);
        } else {
            clickRandomInsideElement(element);
            const clickInterval = getRandomInt(100, 250);
            setTimeout(startAutoClicker, clickInterval);
        }
    }

    function initializeAutoClicker() {
        if (!autoClickerRunning && window.location.href.includes('/miniapp/tap-game')) {
            console.log('Инициализация автокликера...');
            autoClickerRunning = true;
            setTimeout(startAutoClicker, 5000);
        }
    }

    initializeAutoClicker();

    const observer = new MutationObserver(() => {
        initializeAutoClicker();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();