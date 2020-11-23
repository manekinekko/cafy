import { BeverageTasteValue } from "./BeverageTasteValue";
import { ParameterModel } from "./ParameterModel";

export class RecipeData {
  id: number;
  milkQty: number;
  coffeeQty: number;
  taste: number;
  ingredients: ParameterModel[];
  constructor(i: number) {
    this.id = i;
    this.milkQty = 0;
    this.coffeeQty = 0;
    this.taste = BeverageTasteValue.NORMAL;
    this.ingredients = [];
  }

  setIngredients(arrayList: ParameterModel[]) {
    this.ingredients = arrayList;
  }
}
