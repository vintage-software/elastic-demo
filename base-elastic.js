"use strict";
exports.__esModule = true;
var BaseElastic = (function () {
    function BaseElastic() {
        this.baseUrl = 'http://localhost:9200/';
        this.indexUrl = this.baseUrl + "test";
    }
    BaseElastic.prototype.execute = function (message, request) {
        request
            .then(function () { return console.log(message + ": success"); })["catch"](function () { return console.log(message + ": failed"); });
    };
    return BaseElastic;
}());
exports.BaseElastic = BaseElastic;
