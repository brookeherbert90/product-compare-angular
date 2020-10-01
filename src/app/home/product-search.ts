export class ProductSearch {
    maxPrice: number;
    public constructor(private search : ProductSearch) {
        this.maxPrice = search.maxPrice;
    }
}