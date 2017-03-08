import * as request from 'request-promise';
import { BaseElastic } from './base-elastic';
import { join } from 'bluebird';

export class BasicSearch extends BaseElastic {
    run() {
        this.recreateIndex(this.getMapping())
            .then(() => this.indexDocuments(this.getDocuments()));
    }

    private getMapping() {
        return {
            properties: {
                description: { type: "text" }
            }
        };
    }

    private getDocuments() {
        return [
            { description: 'dog' },
            { description: 'dog dog' },
            { description: 'dog dog dog' },
            { description: 'dog dog dog dog' },
            { description: 'dog cat' }
        ];
    }
}