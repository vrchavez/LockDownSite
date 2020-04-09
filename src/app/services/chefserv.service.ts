import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ChefservService {
  baseUrl: string = 'http://localhost:50025/api';
  //baseUrl: string = 'https://lockdown20200408122040.azurewebsites.net';
  constructor(private http: HttpClient) { }

  addFood(food) {
    return this.http.post(this.baseUrl + '/food', food);
  }

  getAllOrdersByCookId(cookId) {
    return this.http.get(this.baseUrl + '/order/getBycook/' + cookId, cookId);
  }

  getCookCompany(cookId) {
    return this.http.get(this.baseUrl + '/cookCompany/' + cookId, cookId);
  }

  getByFoodId(foodId) {
    return this.http.get(this.baseUrl + '/food/getFoodDisplayFoodId/' + foodId, foodId);
  }

  postCompany(image, company) {
    const formData: FormData = new FormData();
    formData.append('Image', image, image);
    formData.append('CookId', company.value.cookId);
    formData.append('CompanyName', company.value.companyName);
    formData.append('Type', company.value.type);
    formData.append('Pricing', company.value.price);
    formData.append('Address', company.value.address);
    formData.append('OperationHours', company.value.operationHours);
    return this.http.post(this.baseUrl +'/cookCompany', formData);
  }

  updateCompany(image, company) {
    if (image !== null && image !== undefined) {
      const formData: FormData = new FormData();
      formData.append('Image', image, image);
      formData.append('CookId', company.value.cookId);
      formData.append('CompanyName', company.value.companyName);
      formData.append('Type', company.value.type);
      formData.append('Pricing', company.value.price);
      formData.append('Address', company.value.address);
      formData.append('OperationHours', company.value.operationHours);
      formData.append('FoodImgRef', company.value.foodImgRef);
      return this.http.put(this.baseUrl + '/cookCompany/' + company.value.cookId, formData);
    } else {
      const formData: FormData = new FormData();
      formData.append('CookId', company.value.cookId);
      formData.append('CompanyName', company.value.companyName);
      formData.append('Type', company.value.type);
      formData.append('Pricing', company.value.price);
      formData.append('Address', company.value.address);
      formData.append('OperationHours', company.value.operationHours);
      formData.append('FoodImgRef', company.value.foodImgRef);
      return this.http.put(this.baseUrl + '/cookCompany/updateNoImage/' + company.value.cookId, formData);
    }

  }

  uploadImage(foodId, image) {
    const formData: FormData = new FormData();
    formData.append('Image', image, image.name);
    formData.append('FoodId', foodId);
    return this.http.post(this.baseUrl +'/foodImage/upload', formData);
  }

  updateImage(foodId, image, foodImgRef) {
    const formData: FormData = new FormData();
    var newFoodImgRef = foodImgRef.split('/')
    formData.append('Image', image, image.name);
    formData.append('FoodId', foodId);
    formData.append('FoodImgRef', newFoodImgRef[newFoodImgRef.length-1]);
    return this.http.put(this.baseUrl +'/foodImage/upload/update', formData);
  }

  updateFood(foodItem) {
    return this.http.put(this.baseUrl + '/food/' + foodItem.Id, foodItem);
  }

  getCookFoods(cookId) {
    return this.http.get(this.baseUrl + '/food/getFoodDisplay/' + cookId, cookId);
  }

  deleteFoodImage(foodImgRef) {
    return this.http.delete(this.baseUrl + '/foodImage/deleteImage?imgRef=' + foodImgRef);
  }

  deleteCookFood(foodItem) {
    console.log(foodItem);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        foodId: foodItem.foodId,
        foodRef: foodItem.foodImgRef
      }
    }
    return this.http.delete(this.baseUrl + '/food/deleteFromAzure', options);
  }
}
