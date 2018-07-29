angular.module('invoice1',[])
    .controller('InvoceController',function () {
        this.qty=1;
        this.cost=2;
        this.inCurr='CNY';
        this.currenceies=['USD','EUR','CNY'];
        this.usdToForeignRates = {
            USD:1,
            EUR:0.74,
            CNY:6.09
        };
        this.total = function total(outCurr) {
            return this.converCurrency(this.qty * this.cost, this.inCurr, outCurr);
        }
        this.converCurrency = function converCurrency(amount,inCurr,outCurr) {
            return amount * this.usdToForeignRates[outCurr]*1/this.usdToForeignRates[inCurr];
        }
        this.pay = function pay() {
            window.alert('thanks!');
        }
    })