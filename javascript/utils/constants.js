export const SUB_RECORD_NUM = "sub-record-num";

export const cellLabels = [
  "SN",
  "Description",
  "No.s",
  "Dimensions",
  "Quantity",
  "Actions",
];

export const dimensionCellLabels = ["Length", "Witdth", "Height"];

export const cellContents = [
  '<input type="text" name="description" placeholder="Description" class="descInput">',
  '<input value="0" type="number" name="number" placeholder="No.s" class="numberInput">',
  '<input type="number" name="length" placeholder="Length" class="lengthInput">',
  '<input type="number" name="width" placeholder="Width" class="widthInput">',
  '<input type="number" name="height" placeholder="Height" class="heightInput">',
  '0',
];

export const headers = [
  'SN',
  'Description',
  'No.s',
  'Length',
  'Width',
  'Height',
  'Quantity'
];

export const unitOptions = [
  { value: 'sq-ft', label: 'Sq. Ft.' },
  { value: 'sq-m', label: 'Sq. m' },
  { value: 'cu-ft', label: 'Cu. Ft.' },
  { value: 'cu-m', label: 'Cu. m' },
  { value: 'r-ft', label: 'R. Ft' },
  { value: 'r-m', label: 'R. m' },
]; 