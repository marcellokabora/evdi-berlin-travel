import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';



interface Tour {
  title: string
  price: number
  currency: string
  rating: number
  isSpecialOffer: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tours: Tour[] = []

  search: string = ''
  specialOffer: boolean = false

  ratings = this._formBuilder.group({
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
  })
  minrate = 1
  maxrate = 5

  pricing = this._formBuilder.group({
    price1: false,
    price2: false,
    price3: false,
    price4: false,
    price5: false,
  })
  minprice = 0
  maxprice = 1000

  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder
  ) {

    this.http.get("./assets/data.json").subscribe((data: any) => {
      this.tours = data.tours
    })

    this.ratings.valueChanges.subscribe(values => {
      const rating = []
      if (values.star1) {
        rating.push(1)
      }
      if (values.star2) {
        rating.push(2)
      }
      if (values.star3) {
        rating.push(3)
      }
      if (values.star4) {
        rating.push(4)
      }
      if (values.star5) {
        rating.push(5)
      }
      this.minrate = rating[0] ? rating[0] : 1
      this.maxrate = rating[rating.length - 1] ? rating[rating.length - 1] + .9 : 5
    })

    this.pricing.valueChanges.subscribe(values => {
      const pricing = []
      if (values.price1) {
        pricing.push(0, 10)
      }
      if (values.price2) {
        pricing.push(10, 20)
      }
      if (values.price3) {
        pricing.push(20, 50)
      }
      if (values.price4) {
        pricing.push(50, 100)
      }
      if (values.price5) {
        pricing.push(1000)
      }
      this.minprice = pricing[0] ? pricing[0] : 0
      this.maxprice = pricing[pricing.length - 1] ? pricing[pricing.length - 1] : 1000
    })

  }

}

@Pipe({ name: 'rating' })
export class pipeRating implements PipeTransform {
  transform(items: Tour[], min: number, max: number): Tour[] {
    return items.filter((item: Tour) => item.rating >= min && item.rating <= max)
  }
}
@Pipe({ name: 'pricing' })
export class pipePricing implements PipeTransform {
  transform(items: Tour[], min: number, max: number): Tour[] {
    return items.filter((item: Tour) => item.price >= min && item.price <= max)
  }
}
@Pipe({ name: 'searching' })
export class pipeSearching implements PipeTransform {
  transform(items: Tour[], search: string): Tour[] {
    return items.filter((item: Tour) => item.title.toUpperCase().indexOf(search.toUpperCase()) > -1)
  }
}
@Pipe({ name: 'pipespecial' })
export class pipeSpecial implements PipeTransform {
  transform(items: Tour[], special: boolean): Tour[] {
    return items.filter((item: Tour) => special ? item.isSpecialOffer === true : true)
  }
}
