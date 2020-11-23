export class ParameterModel {
  id = 0;
  length = 0;
  description = "";
  minValue = 0;
  maxValue = 0;
  defValue = 0;
  constructor() {}

  getLength() {
    return this.length;
  }

  setLength(i: number) {
    this.length = i;
  }

  getDescription() {
    return this.description;
  }

  setDescription(str: string) {
    this.description = str;
  }

  getId() {
    return this.id;
  }

  setId(i: number) {
    this.id = i;
  }

  getMinValue() {
    return this.minValue;
  }

  setMinValue(i: number) {
    this.minValue = i;
  }

  getMaxValue() {
    return this.maxValue;
  }

  setMaxValue(i: number) {
    this.maxValue = i;
  }

  getDefValue() {
    return this.defValue;
  }

  setDefValue(i: number) {
    this.defValue = i;
  }
}
