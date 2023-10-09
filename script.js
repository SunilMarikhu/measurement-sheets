let recordsCount = 0;
let subRecordCount = 0;

document.getElementById("addRecordBtn").addEventListener("click", function () {
  recordsCount++;
  // Prompt the user for record name and details
  // let recordName = prompt("Enter Record Name:");

  // if (!recordName) {
  //   alert("Record Name cannot be empty. Please try again.");
  //   return;
  // }
  let recordName = "ProjectName";

  // Create a new div element
  let newDiv = document.createElement("div");

  newDiv.id = `project-${recordsCount}`; // You can assign an ID to the div

  //Create a add sub record button
  let addSubRecordBtn = document.createElement("button");
  addSubRecordBtn.textContent = 'Add Measurement';
  addSubRecordBtn.classList.add("addSubRecordBtn");
  addSubRecordBtn.id = `addSubRecordBtn-${recordsCount}`;

  // Define an array for the cell labels
  let cellLabels = [
    "SN",
    "Description",
    "Unit",
    "No.s",
    "Dimensions",
    "Quantity",
    "Actions",
  ];

  // Create a new table for a record
  let recordTable = document.createElement("table");
  recordTable.id = `table-${recordsCount}`

  // Add headers to the record table
  let headerRow = recordTable.insertRow(0);
  headerRow.classList.add("table-header");

  let headerCell1 = headerRow.insertCell(0);
  headerCell1.textContent = recordName;
  headerCell1.colSpan = cellLabels.length + 2;

  // Add the record table to the container
  let recordTablesContainer = document.getElementById("recordTablesContainer");
  recordTablesContainer.appendChild(newDiv);
  newDiv.appendChild(recordTable);
  newDiv.appendChild(addSubRecordBtn);

  // Create a new row for the record
  let newRow = recordTable.insertRow(1);

  // Loop to create cells and set their text content
  for (let i = 0; i < cellLabels.length; i++) {
    let cell = newRow.insertCell(i);
    cell.textContent = cellLabels[i];
    if (cellLabels[i] === "Dimensions") {
      cell.colSpan = 3;
    } else {
      cell.rowSpan = 2;
    }
    if (cellLabels[i] === "Actions")
      cell.classList.add("lastColHeader");

  }

  let dimensionCellLabels = ["Length", "Witdth", "Height"];
  let dimensionRow = recordTable.insertRow(2);
  for (let i = 0; i < dimensionCellLabels.length; i++) {
    let cell = dimensionRow.insertCell(i);
    cell.textContent = dimensionCellLabels[i];
  }

  // Add footers to the record table
  let lastRow = recordTable.insertRow(3);
  lastRow.classList.add("table-footer");

  let lastRowCell1 = lastRow.insertCell(0);
  let lastRowCell2 = lastRow.insertCell(1);

  lastRowCell1.textContent = "Sub-Total";
  lastRowCell2.textContent = "0";

  lastRowCell1.colSpan = cellLabels.indexOf("Quantity") + 2;
  lastRowCell2.classList.add("recordTotal");

  // Add event listener to the new sub-record button
  newDiv
    .querySelector(".addSubRecordBtn")
    .addEventListener("click", function () {
      addSubRecord(this, recordTable, false)
    });
});

// Define an array for the cell contents of sub-records
let cellContents = [
  '<input type="text" name="description" placeholder="Description" class="descInput">',
  '<select id="measurementUnit" name="measurementUnit">' +
  '<option value="sq-ft">Sq. Ft.</option>' +
  '<option value="sq-m">Sq. M</option>' +
  '<option value="cu-ft">Cu. ft</option>' +
  '<option value="cu-m">Cu. M</option>' +
  '<option value="centimeters">R. Ft</option>' +
  '<option value="centimeters">R. M</option>' +
  '</select>',
  '<input type="number" name="number" placeholder="No.s" class="numberInput" onkeyup="updateTotal(this)">',
  '<input type="number" name="length" placeholder="Length" class="lengthInput" onkeyup="updateTotal(this)">',
  '<input type="number" name="width" placeholder="Width" class="widthInput" onkeyup="updateTotal(this)">',
  '<input type="number" name="height" placeholder="Height" class="heightInput" onkeyup="updateTotal(this)">',
  '0',
];

function addSubRecord(element, recordTable, isLessRecord) {
  subRecordCount = recordTable.querySelectorAll(".addInnerRecordBtn").length
  let rowIndex = recordTable.querySelector(".table-footer").rowIndex;
  if (isLessRecord) {
    rowIndex = element.closest("tr").rowIndex + 1;
  }
  // Create a new row for a sub-record within the same record table at specified index
  let subRecordRow = recordTable.insertRow(rowIndex);

  // Set the first cell content with row index
  let cell0 = subRecordRow.insertCell(0);

  // Loop through the array and create cells
  for (let i = 0; i < cellContents.length; i++) {
    let cell = subRecordRow.insertCell(i + 1);
    cell.innerHTML = cellContents[i];
    if (i == cellContents.length - 1) {
      cell.classList.add("subRecordTotal");
      if (isLessRecord)
        cell.classList.add("negativeValue")
    }
  }

  let lastCell = subRecordRow.insertCell(cellContents.length + 1);

  if (!isLessRecord) {
    subRecordCount++;
    cell0.textContent = `${subRecordCount}.`;
    lastCell.innerHTML = '<button class="addInnerRecordBtn"> + Less</button>';
  } else {
    cell0.textContent = "-";
  }
  lastCell.innerHTML += '<button class="deleteSubRecordBtn"><img src="icons/trash_icon.svg" class="icons delete"></button>';
  lastCell.classList.add("lastCol");

  subRecordRow
    .querySelector(".addInnerRecordBtn")
    .addEventListener("click", function () {
      addSubRecord(this, recordTable, true);
    });

  subRecordRow
    .querySelector(".deleteSubRecordBtn")
    .addEventListener("click", function () {
      deleteConfirmation = confirm("Are you sure to delete this record?");
      if (deleteConfirmation){
        alert("Coming Soon...");
      }
    });
}

function calculateVolume(length, width, height) {
  return length * width * height;
}

// Function to calculate and update the total
function updateTotal(input) {
  let row = input.parentElement.parentElement;
  let number = parseFloat(row.querySelector('input[name="number"]').value);
  let length = parseFloat(row.querySelector('input[name="length"]').value);
  let width = parseFloat(row.querySelector('input[name="width"]').value);
  let height = parseFloat(row.querySelector('input[name="height"]').value);
  let volume = calculateVolume(length, width, height);
  let total = volume * number;

  // Update the total field in the same row
  if (!isNaN(total)) {
    row.querySelector('.subRecordTotal').textContent = total;

    let table = row.parentElement.parentElement;
    let subRecordTotals = table.querySelectorAll('.subRecordTotal');

    // Initialize a variable to store the sum
    let sum = 0;

    // Loop through the selected elements and add their values to the sum
    subRecordTotals.forEach(function (element) {
      // Parse the content of each element as a number and add it to the sum
      let multiplier = element.classList.contains("negativeValue") ? -1 : 1;
      sum += parseFloat(element.textContent) * multiplier;
    });

    let recordTotal = table.querySelector(".recordTotal");
    recordTotal.textContent = sum;
  }
}
