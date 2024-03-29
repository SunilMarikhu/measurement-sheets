const SUB_RECORD_NUM = "sub-record-num";

let recordsCount = 0;

document.getElementById("addRecordBtn").addEventListener("click", function () {
  recordsCount++;
  // Prompt the user for record name and details
  let recordName = prompt("Enter Record Name:");

  if (!recordName) {
    alert("Record Name cannot be empty. Please try again.");
    return;
  }
  // let recordName = "ProjectName";

  // Create a new div element
  let newDiv = document.createElement("div");

  newDiv.id = `project-${recordsCount}`; // You can assign an ID to the div

  //Create a add sub record button
  let addSubRecordBtn = document.createElement("button");
  addSubRecordBtn.textContent = 'Add Measurement';
  addSubRecordBtn.classList.add("addSubRecordBtn");

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
  '<select name="measurementUnit">' +
  '<option value="sq-ft">Sq. Ft.</option>' +
  '<option value="sq-m">Sq. M</option>' +
  '<option value="cu-ft">Cu. ft</option>' +
  '<option value="cu-m">Cu. M</option>' +
  '<option value="centimeters">R. Ft</option>' +
  '<option value="centimeters">R. M</option>' +
  '</select>',
  '<input value="0" type="number" name="number" placeholder="No.s" class="numberInput" onkeyup="updateTotal(this)">',
  '<input value="1" type="number" name="length" placeholder="Length" class="lengthInput" onkeyup="updateTotal(this)">',
  '<input value="1" type="number" name="width" placeholder="Width" class="widthInput" onkeyup="updateTotal(this)">',
  '<input value="1" type="number" name="height" placeholder="Height" class="heightInput" onkeyup="updateTotal(this)">',
  '0',
];

function addSubRecord(element, recordTable, isLessRecord, targetRowIndex = undefined) {
  let subRecordCount = recordTable.querySelectorAll(".serialNumber").length
  let subRecordNum = subRecordCount;
  let rowIndex = targetRowIndex || recordTable.querySelector(".table-footer").rowIndex;

  if (isLessRecord) {
    subRecordNum = element.closest("tr").getAttribute(SUB_RECORD_NUM);
  }
  // Create a new row for a sub-record within the same record table at specified index
  let subRecordRow = recordTable.insertRow(rowIndex);
  subRecordRow.setAttribute(SUB_RECORD_NUM, subRecordNum);
  subRecordRow.classList.add(isLessRecord ? "innerRecord" : "subRecord");

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
    cell0.classList.add("serialNumber");
    lastCell.innerHTML = '<button class="addInnerRecordBtn"> + Less</button>';
  } else {
    cell0.textContent = "-";
  }

  lastCell.innerHTML += '<button class="deleteSubRecordBtn"><img src="icons/trash_icon.svg" class="icons delete"></button>';
  lastCell.classList.add("lastCol");

  subRecordRow
    .querySelector(".addInnerRecordBtn")
    ?.addEventListener("click", function () {
      addSubRecord(this, recordTable, true, getNewRowIndex(this.closest("tr")));
    });

  subRecordRow
    .querySelector(".deleteSubRecordBtn")
    .addEventListener("click", function () {
      deleteConfirmation = confirm("Are you sure to delete this record?");
      if (deleteConfirmation) {
        removeRow(this.closest("tr"));
      }
    });

  subRecordRow
    .querySelector('input[name="height"]')
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        // Check if the Enter key was pressed
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
        addSubRecord(this, recordTable, isLessRecord, getNewRowIndex(this.closest("tr"))); // Call your addSubRecord function here
      }
    });

  subRecordRow.querySelector('input[name="description"]').focus();
  if (targetRowIndex !== undefined && !isLessRecord) updateSerialNum(recordTable);
}

function removeRow(row) {
  let table = row.closest("table");
  let subRecordNum = row.getAttribute(SUB_RECORD_NUM);
  if (row.classList.contains("subRecord")) {
    table
      .querySelectorAll(`tr[${SUB_RECORD_NUM}="${subRecordNum}"]`)
      .forEach((element) => element.remove());
  } else {
    row.remove();
  }
  updateSubTotal(table);
  updateSerialNum(table);
}

function getNewRowIndex(row) {
  let table = row.closest("table");
  let relatedRows = table.querySelectorAll(`tr[${SUB_RECORD_NUM}="${row.getAttribute(SUB_RECORD_NUM)}"]`);
  return relatedRows[relatedRows.length - 1].rowIndex + 1;
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

    let table = row.closest("table");
    updateSubTotal(table);
  }
}

function updateSubTotal(table) {
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

function updateSerialNum(table) {
  console.log('SN updated!');
  let serialNumCells = table.querySelectorAll(".serialNumber");
  serialNumCells.forEach((cell, i) => {
    cell.textContent = `${i + 1}.`;
  });
}

const headers = [
  'SN',
  'Description',
  'No.s',
  'Length',
  'Width',
  'Height',
  'Quantity',
  'Unit'
];

document.getElementById("exportCsvBtn").addEventListener("click", function () {
  exportCsv();
});

function exportCsv() {
  let mergedRow = '';
  let tables = document.querySelectorAll('table');

  let projectName = document.querySelector('input[name="projectName"]').value.trim() || 'New_Project'
  mergedRow += ['', projectName, '\n'].join(',');
  mergedRow += ['', document.querySelector('textArea[name="projectDetails"]').value, '\n\n'].join(',');

  tables.forEach((table) => {
    // Add Record title
    mergedRow += ['', table.querySelector('tr.table-header td').textContent, '\n'].join(',');

    // Add headers for Record
    mergedRow += headers.join(',') + '\n';
    let unit;
    let subRecords = table.querySelectorAll('tr.subRecord, tr.innerRecord');
    subRecords.forEach((subRecord) => {
      let cells = subRecord.children;
      let sn = cells[0].textContent;
      let description = cells[1].firstChild.value;
      let nos = cells[3].firstChild.value;
      let length = cells[4].firstChild.value;
      let width = cells[5].firstChild.value;
      let height = cells[6].firstChild.value;
      let quantity = (subRecord.classList.contains('innerRecord') ? '-' : '') + cells[7].textContent;
      unit = cells[2].firstChild.value;

      mergedRow += [sn, description, nos, length, width, height, quantity, unit, '\n'].join(',');
    });

    let subTotal = table.querySelector('td.recordTotal').textContent;
    mergedRow += [...Array(5), 'Sub-Total', subTotal, unit, '\n\n'].join(',');

  });

  // Create a Blob object with the merged row
  const blob = new Blob([mergedRow], { type: 'text/csv;charset=utf-8;' });

  // Create a download link for the Blob
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);


  link.download = `${projectName}_Measurement_Sheet.csv`;
  document.body.appendChild(link);
  link.click();
}