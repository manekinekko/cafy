export class BeanSystem {
  id: number;
  name: string;
  image: string;
  isEnable: boolean;
  isDeleted: boolean;
  grinder: number;
  temperature: number;
  aroma: number;
  optimalId: number;
  constructor(
    i: number,
    str: string,
    str2: string,
    z: boolean,
    z2: boolean,
    i2: number,
    i3: number,
    i4: number,
    i5: number
  ) {
    this.id = i;
    this.name = str;
    this.image = str2;
    this.isEnable = z;
    this.isDeleted = z2;
    this.grinder = i2;
    this.temperature = i3;
    this.aroma = i4;
    this.optimalId = i5;
  }
}
