angular.module('invoice2',['service'])
    .controller('InvoceController',['currencyConverter', function (currencyConverter) {
        this.qty = 1;
        this.cost = 2;
        this.inCurr = 'EUR';
        this.currenceies = currencyConverter.currenceies;

        this.total = function total(outCurr) {
            return currencyConverter.conver(this.qty * this.cost, this.inCurr, outCurr);
        }

        this.pay = function pay() {
            window.alert('thanks!');
        }
    }]);