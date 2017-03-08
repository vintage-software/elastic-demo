import { BaseElastic } from './base-elastic';

export class TermsAggs extends BaseElastic {
    run() {
        this.recreateIndex(this.getMapping())
            .then(() => this.indexDocuments(this.getDocuments())
                .then(() => this.search(this.getQuery())
                    .then(response => this.printResults(response))));
    }

    private getMapping() {
        return {
            properties: {
                description: { type: 'text' },
                tags: { type: 'keyword' },
                categories: { type: 'long' }
            }
        };
    }

    private getDocuments() {
        return [
            {
                description: 'dog 1',
                tags: ['a', 'b', 'c'],
                categories: [1, 2, 3]
            },
            {
                description: 'dog 2',
                tags: ['a', 'b', 'd'],
                categories: [1, 2, 4]
            },
            {
                description: 'dog 3',
                tags: ['a'],
                categories: [1]
            },
            {
                description: 'cat 1',
                tags: ['d', 'f', 'g'],
                categories: [4, 6, 7]
            },
            {
                description: 'cat 2',
                tags: ['d', 'f', 'h'],
                categories: [4, 6, 8]
            },
            {
                description: 'cat 3',
                tags: ['d', 'e', 'a'],
                categories: [4, 5, 1]
            }
        ];
    }

    private getQuery() {
        return {
            query: {
                multi_match: {
                    query: 'dog',
                    fields: ['description']
                }
            },
            aggs: {
                tags: {
                    terms: {
                        field: 'tags',
                        size: 2
                    }
                },
                categories: {
                    terms: {
                        field: 'categories',
                        size: 2
                    }
                }
            }
        }
    }
}