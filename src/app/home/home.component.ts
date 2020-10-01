import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProductService } from '../shared/product.service'
import { ProductSearch } from './product-search';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private productService: ProductService) { }
  productForm: FormGroup;
  products: any = [];
  maxPrice: number;
  errorMsg : string="";
  ngOnInit() {
    this.productForm = new FormGroup({
      maxPrice: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.required])
    });
    this.products = this.filterByColor();
  }

  productsToCompare: any = [];
  compareOrRemove: string = "Compare";
  enoughProductsToCompare: boolean = false;

  compare(inputProduct) {
    inputProduct.compareOrRemove = inputProduct.compareOrRemove === "Compare" ? "Remove" : "Compare";
    if (this.checkProduct(inputProduct, this.productsToCompare)) {
      this.productsToCompare = this.removeProduct(this.productsToCompare, inputProduct);
      if (this.productsToCompare.length < 2) {
        this.enoughProductsToCompare = false;
        this.productsToCompare.map(product => product.compareOrRemove = "Compare");
        this.productsToCompare = [];
      }
    } else {
      this.addProduct(this.productsToCompare, inputProduct);
      if (this.productsToCompare.length >= 2) {
        this.enoughProductsToCompare = true;
      }
    }
  }

  // check if product is in product compare array
  checkProduct(product, products) {
    for (let i = 0; i < products.length; i++) {
      // product id match
      if (products[i].id === product.id) {
        return true;
      }
    }
  }

  // To delete product from product compare array
  removeProduct(products, product) {
    products = products.filter(item => JSON.stringify(item) !== JSON.stringify(product))
    console.log(products);
    return products;
  }

  // To add product to product compare array
  addProduct(products, product) {
    return products.push(product);
  }

  //filter by colour setting default to blue as it was what was asked for in this demo
  filterByColor(color: string = "blue")
  {
    return this.productService.getProducts().filter(p=> p.colors.filter(c=> c.toLowerCase().match(color)).length > 0)
  }

  //filter products by max price entered by user
  onSubmit()
  {
    if(this.productForm.valid)
    {
      this.products = this.filterByColor().filter(p => Number(p.price.replace("$","")) <= new ProductSearch(this.productForm.value).maxPrice);
      this.productForm.reset();
    }else{
      this.errorMsg = "Must be a valid number";
    }
  }
}
