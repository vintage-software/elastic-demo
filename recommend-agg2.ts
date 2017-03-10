import { BaseElastic } from './base-elastic';

export class RecommendAgg2 extends BaseElastic {
    run() {
        this.recreateIndex(this.getMapping())
            .then(() => this.indexDocuments(this.getDocuments())
                .then(() => this.search(this.getQuery())
                    .then(response => this.printResults(response))));
    }

    private getMapping() {
        return {
            properties: {
                userId: { type: 'long' },
                item: { type: 'keyword' }
            }
        };
    }

    private getDocuments() {
        let items = [];
        [
            {
                items: ['a', 'b', 'c', 'e', 'g']
            },
            {
                items: ['a', 'f']
            },
            {
                items: ['a', 'b', 'e']
            },
            {
                items: ['a', 'b', 'e']
            },
            {
                items: ['a', 'c', 'g']
            },
            {
                items: ['a', 'h', 'i']
            }
        ].forEach((user, index) => user.items.map(item => { items.push({ userId: index + 1, item }); }));
        return items;
    }

    private getQuery() {
        return {
            query: {
                constant_score: {
                    filter: {
                        terms: {
                            userId: [1, 3, 4]
                        }
                    }
                }
            },
            aggs: {
                recommended: {
                    significant_terms: {
                        field: 'items',
                        min_doc_count: 1
                    }
                }
            }
        }
    }
}