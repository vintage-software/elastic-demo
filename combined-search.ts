import { BaseElastic } from './base-elastic';

export class CombinedSearch extends BaseElastic {
    run() {
        this.recreateIndex(this.getMapping())
            .then(() => this.indexDocuments(this.getDocuments())
                .then(() => this.search(this.getQuery())
                    .then(response => this.printResults(response))));
    }

    private getMapping() {
        return {
            properties: {
                description: { type: 'text' }
            }
        };
    }

    private getDocuments() {
        return [
            { description: 'dog' },
            { description: 'dog dog' },
            { description: 'dog dog dog' },
            { description: 'dog dog dog dog' },
            { description: 'dog cat mouse pig zebra' },
            { description: 'zebra zebra zebra zebra zebra zebra zebra zebra zebra zebra' }
        ];
    }

    private getQuery() {
        const query = 'dog zebra';
        return {
            query: {
                bool: {
                    should: [ this.getStrictQuery(query), this.getLooseQuery(query) ]
                }
            }
        }
    }

    private getLooseQuery(query) {
        return {
            multi_match: {
                query,
                fields: ['description']
            }
        }
    }

    private getStrictQuery(query) {
        return {
            multi_match: {
                type: 'phrase',
                slop: 3,
                query,
                fields: ['description'],
                boost: 100
            }
        };
    }
}