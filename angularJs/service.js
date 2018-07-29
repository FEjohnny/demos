angular.module('service',[])
    .factory('currencyConverter',function () {
        var currenceies = ['USD', 'EUR', 'CNY'];
        var usdToforeignRates = {
            USD: 1,
            EUR: 0.74,
            CNY: 6.09
        };

        function conver(amount, inCurr, outCurr) {
            return amount * usdToforeignRates[outCurr] * 1 / usdToforeignRates[inCurr];
        }

        return {
            currenceies: currenceies,
            conver: conver
        }
    })