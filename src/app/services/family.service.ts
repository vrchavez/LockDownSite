import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class FamilyService {
  baseUrl: string = 'http://localhost:50745';
  //baseUrl: string = 'https://lockdown20200408122040.azurewebsites.net';
  familyId: string = localStorage.getItem("userId");
  constructor(private http: HttpClient, private MyRoute: Router) { }

  postFamily(image, family) {
    const formData: FormData = new FormData();
    formData.append('Image', image, image);
    formData.append('FamilyId', this.familyId);
    formData.append('Name', family.value.Name);
    formData.append('PhoneNumber', family.value.PhoneNumber);
    formData.append('MemberPlace', 'InRoom');
    return this.http.post(this.baseUrl + '/familyMembers', formData);
  }

  postPlaces(family) {
    return this.http.post(this.baseUrl + '/familyPlaces', family);
  }

  updateFamily(image, family) {
    if (image !== null && image !== undefined) {
      const formData: FormData = new FormData();
      formData.append('Image', image, image);
      formData.append('Id', family.value.Id);
      formData.append('FamilyId', this.familyId);
      formData.append('Name', family.value.Name);
      formData.append('PhoneNumber', family.value.PhoneNumber);
      formData.append('MemberPlace', 'InRoom');
      formData.append('ImgRef', family.value.ImgRef);
      return this.http.put(this.baseUrl + '/familyMembers/' + family.value.cookId, formData);
    } else {
      const formData: FormData = new FormData();
      formData.append('Id', family.value.Id);
      formData.append('FamilyId', this.familyId);
      formData.append('Name', family.value.Name);
      formData.append('PhoneNumber', family.value.PhoneNumber);
      formData.append('MemberPlace', 'InRoom');
      formData.append('ImgRef', family.value.ImgRef);
      return this.http.put(this.baseUrl + '/familyMembers/updateNoImage/' + family.value.cookId, formData);
    }

  }

  sendText(textMessage) {
    return this.http.post(this.baseUrl + '/textMessage/', textMessage);
  }

  updatePlace(memberPlace) {
    return this.http.put(this.baseUrl + '/familyMembers/updatePlace/' + memberPlace.Id, memberPlace);
  }

  getFamilyMembers(familyId) {
    return this.http.get(this.baseUrl + '/familyMembers/' + familyId, familyId);
  }

  getFamilyPlaces(familyId) {
    return this.http.get(this.baseUrl + '/familyPlaces/' + familyId);
  }

  postCurrentPlace(member) {
    return this.http.post(this.baseUrl + '/currentPlace', member);
  }

  putCurrentPlace(member) {
    return this.http.put(this.baseUrl + '/currentPlace', member);
  }
}
