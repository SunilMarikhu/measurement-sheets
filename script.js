let recordsCount = 0;

document.getElementById("addRecordBtn").addEventListener("click", function () {
  recordsCount++;
  // Prompt the user for record name and details
  let recordName = prompt("Enter Record Name:");
  let recordDetails = prompt("Enter Record Details:");

  if (!recordName) {
    alert("Record Name cannot be empty. Please try again.");
    return;
  }
  // let recordName = "ProjectName";
  // let recordDetails = "Project Details";

  // Create a new div element
  let newDiv = document.createElement("div");

  // Set some attributes or properties if needed
  newDiv.id = `project-${recordsCount}`; // You can assign an ID to the div
  newDiv.className = "customDiv"; // You can assign a class to the div


  //Create a add sub record button
  let addSubRecordBtn = document.createElement("button");
  addSubRecordBtn.textContent = 'Add Measurement';
  addSubRecordBtn.classList.add("addSubRecordBtn");
  addSubRecordBtn.id = `addSubRecordBtn-${recordsCount}`;

  // Create a new table for a record
  let recordTable = document.createElement("table");
  recordTable.id = `table-${recordsCount}`

  // Add headers to the record table
  let headerRow = recordTable.insertRow();
  headerRow.classList.add("table-header");

  let headerCell1 = headerRow.insertCell(0);
  let headerCell2 = headerRow.insertCell(1);
  let headerCell3 = headerRow.insertCell(2);
  let headerCell4 = headerRow.insertCell(3);

  headerCell1.textContent = recordName;
  headerCell2.textContent = recordDetails;
  headerCell3.textContent = "Sub-Total";
  headerCell4.textContent = "0";
  headerCell4.classList.add("recordTotal");


  headerCell1.colSpan = 5;

  // Add the record table to the container
  let recordTablesContainer = document.getElementById("recordTablesContainer");
  recordTablesContainer.appendChild(newDiv);
  newDiv.appendChild(recordTable);
  newDiv.appendChild(addSubRecordBtn);

  // Create a new row for the record
  let newRow = recordTable.insertRow();

  // Define an array for the cell labels
  let cellLabels = [
    "SN",
    "Unit",
    "No.s",
    "Dimensions",
    "Quantity",
    "Sub-Total",

  ];

  // Loop to create cells and set their text content
  for (let i = 0; i < cellLabels.length; i++) {
    let cell = newRow.insertCell(i);
    cell.textContent = cellLabels[i];
    if (i === 3) {
      cell.colSpan = 3;
    } else {
      cell.rowSpan = 2;
    }

  }

  let row1 = recordTable.insertRow();
  let dimensionCellLabels = ["Length", "Witdth", "Height"]
  for (let i = 0; i < dimensionCellLabels.length; i++) {
    let cell = row1.insertCell(i);
    cell.textContent = dimensionCellLabels[i];
  }


  // Define an array for the cell contents of sub-records
  let cellContents = [
    '<select id="measurementUnit" name="measurementUnit">' +
    '<option value="feet">Feet</option>' +
    '<option value="inches">Inches</option>' +
    '<option value="meters">Meters</option>' +
    '<option value="centimeters">Centimeters</option>' +
    '</select>',
    '<input type="number" name="number" placeholder="No.s" class="numberInput" onkeyup="updateTotal(this)">',
    '<input type="number" name="length" placeholder="Length" class="lengthInput" onkeyup="updateTotal(this)">',
    '<input type="number" name="width" placeholder="Width" class="widthInput" onkeyup="updateTotal(this)">',
    '<input type="number" name="height" placeholder="Height" class="heightInput" onkeyup="updateTotal(this)">',
    '<input type="number" name="quantity" placeholder="Quantity" class="quantityInput" onkeyup="updateTotal(this)">',
    '<span class="subRecordTotal"> 0 </span>',
  ];

  // Add event listener to the new sub-record button
  newDiv
    .querySelector(".addSubRecordBtn")
    .addEventListener("click", function () {
      // Create a new row for a sub-record within the same record table
      let subRecordRow = recordTable.insertRow();

      // Set the first cell content with row index
      let cell = subRecordRow.insertCell(0);
      cell.textContent = `${subRecordRow.rowIndex - 2}.`;

      // Loop through the array and create cells
      for (let i = 0; i < cellContents.length; i++) {
        let cell = subRecordRow.insertCell(i + 1);
        cell.innerHTML = cellContents[i];
      }
    });
});

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
  let quantity = parseFloat(row.querySelector('input[name="quantity"]').value);
  let volume = calculateVolume(length, width, height);
  let total = volume * number * quantity

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
      sum += parseFloat(element.textContent);
    });

    let recordTotal = table.querySelector(".recordTotal");
    recordTotal.textContent = sum;

    let recordTotals = document.querySelectorAll(".recordTotal");
    let grandTotal = 0;

    recordTotals.forEach(function (element) {
      grandTotal += parseFloat(element.textContent);

    });

    let grandTotalText = document.querySelector(".grand-total");
    grandTotalText.textContent = grandTotal;

  }
}
