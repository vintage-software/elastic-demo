import { BaseElastic } from './base-elastic';

export class RecommendAgg extends BaseElastic {
    run() {
        this.recreateIndex(this.getMapping())
            .then(() => this.indexDocuments(this.getDocuments())
                .then(() => this.search(this.getQuery())
                    .then(response => this.printResults(response))));
    }

    private getMapping() {
        return {
            properties: {
                items: { type: 'keyword' }
            }
        };
    }

    private getDocuments() {
        return [
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
        ];
    }

    private getQuery() {
        return {
            query: {
                multi_match: {
                    query: 'b',
                    fields: ['items']
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