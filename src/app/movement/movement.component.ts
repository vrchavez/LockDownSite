// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   FormControl,
//   FormArray
// } from '@angular/forms';


// export class MovementComponent implements OnInit {
//   public memberForm: FormGroup;

//   constructor(private fb: FormBuilder) { }

//   ngOnInit(){
//     this.memberForm = this.fb.group({
//       Name: new FormControl(),
//       PhoneNumber: new FormControl(),
//       Places: new FormControl()
//     });
//   }

//   cancel(event) {
//     event.preventDefault();
//     let element: HTMLElement = document.getElementById("accordionPlus");
//     element.click();
//     this.memberForm.reset();
//   }

//   onSubmit(submitType) {
//     if (submitType === 'add') {
//       console.log('submitted');
//     }
//   }

// }

import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ɵInternalFormsSharedModule
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FamilyService } from './../services/family.service';
import { ChefservService } from './../services/chefserv.service';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.css']
})
export class MovementComponent implements OnInit {
  @ViewChild('modalEdit')
  modalEdit: TemplateRef<any>;
  @ViewChild('modalDelete')
  modalDelete: TemplateRef<any>;

  public memberForm: FormGroup;
  familyId: string = localStorage.getItem('userId');
  familyMembers = [];
  placePost = {};
  personOut: IAmHere;
  placeList = '';
  phoneNumbers = '';
  FoodId: number;
  lastLog: Date = new Date();
  countPlace: number[] = [];
  countNumberIngredients: number = 0;
  cookId: string = localStorage.getItem('userId');
  places = [];
  ingredientList: string[] = [];
  public foodForm: FormGroup;
  file: File;
  textMessage = {};
  fileIdChange: string;
  cookFood: string[] = [];
  foodDisplay = [];
  manipulateFoodDisplay = [];
  row = [];
  modalData: IDisplayFood;
  closeResult: string;
  refresh: Subject<any> = new Subject();
  constructor(private fb: FormBuilder, private router: Router, private service: ChefservService,
    private modal: NgbModal, private famService: FamilyService) { }

  ngOnInit() {
    this.memberForm = this.fb.group({
      Name: new FormControl(),
      PhoneNumber: new FormControl(),
      Places: new FormControl()
    });

    this.foodForm = this.fb.group({
      FamilyId: new FormControl(),
      Places: new FormControl()
    });
    this.famService.getFamilyMembers(this.familyId).subscribe((data: any) => {
      this.showDishes(data);
      return true;
    }, (error) => {
      console.log(error);
    });
    this.famService.getFamilyPlaces(this.familyId).subscribe((data: any) => {
      var splitter = data.places;
      this.places = splitter.split(",");
      return true;
    }, (error) => {
      console.log(error);
    });

  }

  clickDelete(item) {
    this.modalData = item;
    this.modal.open(this.modalDelete, { size: 'lg' }).result.then((result) => {
      if (result === 'ConfirmDelete') {
        var imgArray = this.modalData.foodImgRef.split("/");
        var foodItem = { 'foodId': this.modalData.id, 'foodImgRef': imgArray[imgArray.length - 1] }
        this.service.deleteCookFood(foodItem).subscribe(() => console.log("Food Deleted"));
        this.removeDishes(this.modalData.id);
      }
    });
  }

  //check list of dishes, then remove it and redo list.
  removeDishes(dish) {
    const manipulateData = this.foodDisplay;
    var newIndexStart;
    var smallDisplay;
    for (let x = 0; x < manipulateData.length; x++) {
      var newIndex = manipulateData[x].findIndex(plate => plate.id === dish);
      if (newIndex !== -1) {
        newIndexStart = x;
        var newdisplay = manipulateData[x].splice(newIndex, 1);
        smallDisplay = manipulateData.slice(x);
      }
    }
    for (let w = 0; w < smallDisplay.length; w++) {
      if (w !== smallDisplay.length - 1) {
        var newSplice = smallDisplay[w + 1].splice(0, 1)[0];
        if (newSplice.length !== 0 || newSplice.length !== null || newSplice.length !== undefined) {
          smallDisplay[w].push(newSplice);
        }
        if (smallDisplay[smallDisplay.length - 1].length === 0) {
          smallDisplay.pop();
        }
      }
    }
    this.foodDisplay.splice(newIndexStart, smallDisplay.length + 1);
    for (var i = 0; i < smallDisplay.length; i++) {
      if (smallDisplay[i].length !== 0 || smallDisplay[i] !== null || smallDisplay[i] !== undefined) {
        this.foodDisplay.push(smallDisplay[i]);
      }
    }
  }

  showDishes(data) {
    this.cookFood = data;
    var count = 0;
    for (var i = 0; i < data.length; i += 3) {
      var newRow = [];
      for (var x = 0; x < 3; x++) {
        var value = data[i + x];
        if (!value) {
          break;
        }
        newRow.push(value);
      }
      this.row = newRow;
      this.foodDisplay.push(this.row);
      this.manipulateFoodDisplay.push(this.row);
      count++;
    }
    console.log(this.foodDisplay);
  }

  updateDishes(data) {
    var changed = false;
    for (var i = 0; i < this.foodDisplay.length; i++) {
      if (this.foodDisplay[i].length < 3) {
        this.foodDisplay[i].push(data[data.length - 1]);
        changed = true;
      }
    }
    if (!changed) {
      this.foodDisplay.push([data[data.length - 1]]);
    }
    console.log(this.foodDisplay);
  }



  addNewIngInput(event) {
    this.countPlace.push(this.countNumberIngredients);
    this.countNumberIngredients++;
  }

  clickPlaceChange(place, id, name) {
    this.placePost = {
      'Id': id,
      'MemberPlace': place
    };

    console.log(this.cookFood);
    for (var value of this.cookFood) {
      if(value['id'] !== id) {
        this.phoneNumbers += value['phoneNumber'] + ',';
      }
    }

    this.phoneNumbers = this.phoneNumbers.slice(0, -1);

    var phone = '9093174757';

    this.textMessage = {
      'MemberName': name,
      'Place': place,
      'PhoneNumbers': this.phoneNumbers
    }

    // this.textMessage = {
    //   'MemberName': name,
    //   'Place': place,
    //   'PhoneNumbers': phone
    // }
    console.log(this.textMessage);



    // ===================== Need from here to bottom line ==============================

    this.famService.updatePlace(this.placePost).subscribe((data: any) => {
      this.famService.getFamilyMembers(this.familyId).subscribe((data: any) => {
        this.row = [];
        this.foodDisplay = [];
        this.manipulateFoodDisplay = [];
        this.showDishes(data);
        this.famService.sendText(this.textMessage).subscribe((data)=> {
          console.log(data);
        });
        return true;
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });

    // ===================== Need from here to top line ==============================

    // this.famService.postCurrentPlace(this.placePost).subscribe((data: any) => {
    //   this.personOut = {
    //     id: id,
    //     place: place
    //   }
    //   console.log(this.personOut);
    // }, (error)=> {
    //   console.log(error);
    // });
  }

  changeImage(files: FileList) {
    this.file = files.item(0);
  }

  update(newIngredient) {
    this.ingredientList.push(newIngredient);
    console.log(this.countPlace);
  }

  cancel(event, type) {
    if (type === 'member') {
      event.preventDefault();
      let element: HTMLElement = document.getElementById("accordionPlus");
      element.click();
    } else {
      event.preventDefault();
      let element: HTMLElement = document.getElementById("accordionPlus2");
      element.click();
      this.foodForm.reset();
      this.ingredientList = [];
      this.countPlace = [];
      this.countNumberIngredients = 0;
    }

  }

  deleteNewIng(index) {
    (<FormArray>this.foodForm.get('Ingredients')).removeAt(index);
  }

  clickEdit(foodItem) {
    this.modalData = foodItem;
    console.log(this.modalData);
    this.modal.open(this.modalEdit, { size: 'lg' }).result.then((result) => {
    });
  }

  onSubmit(submitType) {
    if (submitType === 'memberAdd') {
      if (this.memberForm.valid) {
        this.famService.postFamily(this.file, this.memberForm).subscribe((data: any) => {
          this.famService.getFamilyMembers(this.familyId).subscribe((data: any) => {
            this.updateDishes(data);
          }, (error) => {
            console.log(error);
          });
        }, (error) => {
          console.log(error);
        });
      }
    }

    if (submitType === 'placesAdd') {
      this.foodForm.value.FamilyId = this.familyId;
      if (this.foodForm.valid) {
        for (var i = 0; i <= this.countPlace.length - 1; i++) {
          if ((<HTMLInputElement>document.getElementById(i.toString())).value !== null &&
          (<HTMLInputElement>document.getElementById(i.toString())).value !== undefined &&
          (<HTMLInputElement>document.getElementById(i.toString())).value !== '') {
            this.foodForm.value.Places += ',' + (<HTMLInputElement>document.getElementById(i.toString())).value;
          }
        }
        if (this.foodForm.valid) {
          this.famService.postPlaces(this.foodForm.value).subscribe((data: any) => {
            console.log(data);
          },(error)=> {
            console.log(error);
          });
        }
      }
    }

    if (submitType === 'add') {
      this.foodForm.value.CookId = this.cookId;
      if (this.foodForm.valid) {
        for (var i = 0; i <= this.countPlace.length - 1; i++) {
          if ((<HTMLInputElement>document.getElementById(i.toString())).value !== null &&
          (<HTMLInputElement>document.getElementById(i.toString())).value !== undefined &&
          (<HTMLInputElement>document.getElementById(i.toString())).value !== '') {
            this.foodForm.value.Ingredients += ',' + (<HTMLInputElement>document.getElementById(i.toString())).value;
          }
        }
        if (this.foodForm.valid) {
          this.service.addFood(this.foodForm.value).subscribe((data: any) => {
            this.FoodId = data.id;
            this.service.uploadImage(this.FoodId, this.file).subscribe((data: any) => {
              let element: HTMLElement = document.getElementById("accordionPlus");
              element.click();
              this.foodForm.reset();
              this.ingredientList = [];
              this.countPlace = [];
              this.countNumberIngredients = 0;
              this.file = null;
              this.service.getCookFoods(this.cookId).subscribe((data: any) => { this.updateDishes(data); }
                , (error) => { console.log(error.error.message); });
              return true;
            }, (error) => {
              console.log(error.error.message);
            });
          }, (error) => {
            console.log(error.error.message);
          });
        }
      }
    } else if (submitType === 'update') {
      this.foodForm.addControl('Id', new FormControl());
      this.foodForm.value.Id = this.modalData.id;
      this.foodForm.value.CookId = this.cookId;
      for (const property in this.foodForm.value) {
        if (this.foodForm.value[property] === null) {
          switch (property) {
            case 'Name':
              this.foodForm.value.Name = this.modalData.name;
              break;
            case 'Type':
              // code block
              this.foodForm.value.Type = this.modalData.type;
              break;
            case 'Price':
              this.foodForm.value.Price = this.modalData.price;
              break;
            case 'Description':
              // code block
              this.foodForm.value.Description = this.modalData.description;
              break;
            case 'PrepTime':
              this.foodForm.value.PrepTime = this.modalData.prepTime;
              break;
            case 'Ingredients':
              // code block
              this.foodForm.value.Ingredients = this.modalData.ingredients;
              break;
            case 'ServingSize':
              // code block
              this.foodForm.value.ServingSize = this.modalData.servingSize;
              break;
            default:
            // code block
          }
        }
      }
      if (this.foodForm.valid) {
        this.service.updateFood(this.foodForm.value).subscribe((data: any) => {
          if (this.file !== null && this.file !== undefined) {
            this.service.updateImage(this.modalData.id, this.file, this.modalData.foodImgRef).subscribe((data: any) => {
              this.service.getByFoodId(this.modalData.id).subscribe((data: any) => {
                for (let x = 0; x < this.foodDisplay.length; x++) {
                  let newIndex = this.foodDisplay[x].findIndex(plate => plate.id === this.modalData.id);
                  console.log(this.foodDisplay.length);
                  if (newIndex !== -1) {
                    this.foodDisplay[x].splice(newIndex, 1, data);
                  }
                }
                this.foodForm.reset();
                this.file = null;
                return true;
              }, (error) => {
                console.log(error.error.message);
              });
              return true;
            }, (error) => {
              console.log(error.error.message);
            });
          } else {
            this.service.getByFoodId(this.modalData.id).subscribe((data: any) => {
              for (let x = 0; x < this.foodDisplay.length; x++) {
                let newIndex = this.foodDisplay[x].findIndex(plate => plate.id === this.modalData.id);
                if (newIndex !== -1) {
                  this.foodDisplay[x].splice(newIndex, 1, data);
                }
              }
              this.foodForm.reset();
              this.file = null;
              return true;
            }, (error) => {
              console.log(error.error.message);
            });
          }
        }, (error) => {
          console.log(error.error.message);
        });
        this.modal.dismissAll();
      }
    }
  }
}

interface IDisplayFood {
  id: String;
  name: String;
  type: String;
  price:  String;
  cookId: String;
  description: String;
  prepTime: String;
  ingredients: String;
  servingSize: String;
  foodImgRef: String;
}

// interface IFamilyMember {
//   id: String;
//   name: String;

// };

interface IAmHere {
  id: String;
  place: String;
}

