"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var request = require("request-promise");
var base_elastic_1 = require("./base-elastic");
var BasicSearch = (function (_super) {
    __extends(BasicSearch, _super);
    function BasicSearch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BasicSearch.prototype.run = function () {
        this.deleteIndex();
        this.createIndex();
    };
    BasicSearch.prototype.deleteIndex = function () {
        this.execute('delete index', request["delete"](this.indexUrl));
    };
    BasicSearch.prototype.createIndex = function () {
        this.execute('create index', request.put(this.indexUrl, {
            json: {
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                mappings: {
                    event: {
                        properties: {
                            description: { type: "text" }
                        }
                    }
                }
            }
        }));
    };
    return BasicSearch;
}(base_elastic_1.BaseElastic));
exports.BasicSearch = BasicSearch;
