export const commands = {
  get_parameters: ["0d 08 95 0f 00 d2 01 4d 6d"],
  turn_on: [
    "0d 07 84 0f 02 01 55 12",
    "0d 07 84 0f 02 01 55 12",
    "0d 07 84 0f 02 01 55 12",
    "0d 07 84 0f 02 01 55 12",
    "0d 07 84 0f 02 01 55 12",
    "0d 07 84 0f 02 01 55 12",
  ],
  health_check: ["0d 05 75 0f da 25"],
  machine_status: ["0d 08 95 0f 00 32 01 5d df", "0d 08 95 0f 00 3f 01 2b 83"],

  settings_cup_lighting_on: ["0d 0b 90 0f 00 3f 00 00 00 99 39 22"],
  settings_cup_lighting_off: ["0d 0b 90 0f 00 3f 00 00 00 91 b8 2a"],
  settings_cup_warmer_on: ["0d 0b 90 0f 00 3f 00 00 00 b1 9c 48"],
  settings_cup_warmer_off: ["0d 0b 90 0f 00 3f 00 00 00 91 b8 2a"],
  settings_energy_saving_on: ["0d 0b 90 0f 00 3f 00 00 00 91 b8 2a"],
  settings_energy_saving_off: ["0d 0b 90 0f 00 3f 00 00 00 81 aa 1b"],
  settings_beep_sound_on: ["0d 0b 90 0f 00 3f 00 00 00 91 b8 2a"],
  settings_beep_sound_off: ["0d 0b 90 0f 00 3f 00 00 00 95 f8 ae"],
  settings_show_time: ["0d 08 95 0f 00 5f 03 00 eb"],
  settings_water_hardness_1: ["0d 0b 90 0f 00 32 00 00 00 00 0a c8"],
  settings_water_hardness_2: ["0d 0b 90 0f 00 32 00 00 00 02 2a 8a"],
  settings_water_hardness_3: ["0d 0b 90 0f 00 32 00 00 00 02 2a 8a"],
  settings_water_hardness_4: ["0d 0b 90 0f 00 32 00 00 00 03 3a ab"],

  beverages_setting_a1_q20_t1: [
    "0d 11 83 f0 01 00 01 00 14 02 01 08 00 00 00 05 bb fd",
  ],
  beverages_setting_a2_q20_t1: [
    "0d 11 83 f0 01 00 01 00 14 02 02 08 00 00 00 05 75 1d",
  ],
  beverages_setting_a3_q20_t1: [
    "0d 11 83 f0 01 00 01 00 14 02 03 08 00 00 00 05 30 bd",
  ],
  beverages_setting_a4_q20_t1: [
    "0d 11 83 f0 01 00 01 00 14 02 04 08 00 00 00 05 f8 fc",
  ],
  beverages_setting_a5_q20_t1: [
    "0d 11 83 f0 01 00 01 00 14 02 05 08 00 00 00 05 bd 5c",
  ],

  beverages_setting_a2_q40_t2: [
    "0d 11 83 f0 01 00 01 00 28 02 02 08 00 00 00 05 22 76",
  ],

  beverage_espresso_1_a1_q20_t1: [
    "0d 11 83 f0 01 01 01 00 14 02 01 08 00 00 00 06 53 d7",
    "0d 08 83 f0 01 02 06 9d e1",
  ],

  beverage_espresso_1_a2_q40_t2: [
    "0d 11 83 f0 01 01 01 00 28 02 02 08 00 00 00 06 ca 5c",
    "0d 08 83 f0 01 02 06 9d e1",
  ],
  beverage_espresso_1_a3_q40_t2: [
    "0d 11 83 f0 01 01 01 00 28 02 03 08 00 00 00 06 8f fc",
    "0d 08 83 f0 01 02 06 9d e1",
  ],
  beverage_espresso_2: [
    "0d 11 83 f0 01 01 01 00 28 02 03 08 01 00 00 06 f9 48",
    "0d 08 83 f0 01 02 06 9d e1",
  ],
  beverage_coffee: [
    "0d 0f 83 f0 02 01 01 00 67 02 02 00 00 06 77 ff",
    "0d 08 83 f0 02 02 06 c4 b1",
  ],
  beverage_doppio_plus: [
    "0d 0d 83 f0 05 01 01 00 78 00 00 06 c4 7e",
    "0d 08 83 f0 05 02 06 41 21",
  ],
  beverage_steam: [
    "0d 0d 83 f0 11 01 09 03 84 1c 01 06 c0 7b",
    "0d 08 83 f0 11 02 06 de 82",
  ],
  beverage_hot_water: [
    "0d 0d 83 f0 10 01 0f 00 fa 1c 01 06 04 b4",
    "0d 08 83 f0 10 02 06 e9 b2",
  ],
  beverage_2_espressos: [
    "0d 0f 83 f0 04 01 01 00 28 02 02 00 00 06 ab 53",
    "0d 08 83 f0 04 02 06 76 11",
  ],
  beverage_americano: [
    "0d 12 83 f0 06 01 01 00 28 02 03 0f 00 6e 00 00 06 47 8b",
    "0d 08 83 f0 06 02 06 18 71",
  ],
  beverage_coffee_long: [
    "0d 0f 83 f0 03 01 01 00 a0 02 03 00 00 06 18 7f",
    "0d 08 83 f0 03 02 06 f3 81",
  ],
};
