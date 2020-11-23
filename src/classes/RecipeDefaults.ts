import { ParameterModel } from "./ParameterModel";

export class RecipeDefaults {
  id: number;
  coffeeQty: number;
  milkQty: number;
  taste: number;
  minCoffee: number;
  maxCoffee: number;
  minMilk: number;
  maxMilk: number;
  ingredients: any[];
  isForCustomUsage: boolean;
  constructor(
    i: number,
    i2: number,
    i3: number,
    i4: number,
    i5: number,
    i6: number,
    i7: number,
    i8: number,
    arrayList: ParameterModel[],
    z: boolean
  ) {
    this.id = i;
    this.coffeeQty = i2;
    this.milkQty = i3;
    this.taste = i4;
    this.minCoffee = i5;
    this.maxCoffee = i6;
    this.minMilk = i7;
    this.maxMilk = i8;
    this.ingredients = arrayList;
    this.isForCustomUsage = z;
  }
}
