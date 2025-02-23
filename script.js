// Data for breaking capacities per product family
const breakingCapacityData = {
  '5SL1': ['3KA'],
  '5SJ': ['6KA'],
  'Mexico': ['4.5/6KA'],
  '5SL6': ['7.5KA'],
  '5SL4': ['10KA'],
  'ELSA-2': ['10kA/15kA/20kA'],
  'ELSA-1': ['6KA'],
  '5SL7': ['15KA'],
  'K': ['15KA'],
  'MB': ['7.5KA/10KA'],
  'MB Europe': ['7.5KA/10KA'],
  '5SL7-K': ['15KA']
};

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hide');
      content.classList.toggle('sidebar-shift');
    });
  }

  // MCB Entry Page Logic
  const productFamilySelect = document.getElementById('product-family');
  const breakingCapacitySelect = document.getElementById('breaking-capacity');
  const identificationSpan = document.getElementById('identification');
  if (productFamilySelect) {
    productFamilySelect.addEventListener('change', () => {
      const selectedFamily = productFamilySelect.value;
      updateBreakingCapacity(selectedFamily);
      identificationSpan.textContent = selectedFamily;
    });
  }

  function updateBreakingCapacity(family) {
    breakingCapacitySelect.innerHTML = '';
    const options = breakingCapacityData[family] || [];
    options.forEach(capacity => {
      const opt = document.createElement('option');
      opt.value = capacity;
      opt.textContent = capacity;
      breakingCapacitySelect.appendChild(opt);
    });
  }

  // MCB form validation and entry addition
  const mcbForm = document.getElementById('inventory-entry-form');
  const mcbError = document.getElementById('mcb-error');
  const addEntryButton = document.getElementById('add-entry');
  if (addEntryButton) {
    addEntryButton.addEventListener('click', () => {
      // Validate required fields
      if (
        !document.getElementById('polarity').value ||
        !document.getElementById('rating').value ||
        !document.getElementById('product-family').value ||
        !document.getElementById('breaking-capacity').value ||
        !document.getElementById('quantity').value ||
        !document.getElementById('location').value
      ) {
        mcbError.textContent = "Please fill in all required fields.";
        return;
      }
      mcbError.textContent = "";
      addMCBEntry();
    });
  }

  function addMCBEntry() {
    const polarity = document.getElementById('polarity').value;
    const rating = document.getElementById('rating').value;
    const family = document.getElementById('product-family').value;
    const breakingCapacity = document.getElementById('breaking-capacity').value;
    const quantity = document.getElementById('quantity').value;
    const location = document.getElementById('location').value;
    const tableBody = document.querySelector('#entry-table tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${polarity}</td>
      <td>${rating}</td>
      <td>${family}</td>
      <td>${breakingCapacity}</td>
      <td>${quantity}</td>
      <td>${location}</td>
    `;
    tableBody.appendChild(row);
    mcbForm.reset();
    identificationSpan.textContent = "";
  }

  // Carton Entry Page Logic
  let uploadedMaterials = []; // Will hold objects { materialNumber, materialDescription }
  const masterFileInput = document.getElementById('carton-master-file');
  if (masterFileInput) {
    masterFileInput.addEventListener('change', handleMasterFileUpload);
  }

  function handleMasterFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Parse Excel file assuming column A = material number, B = material description
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
      uploadedMaterials = [];
      jsonData.forEach((row, index) => {
        if (index === 0) return; // skip header if exists
        if(row[0] && row[1]){
          uploadedMaterials.push({
            materialNumber: row[0].toString(),
            materialDescription: row[1].toString()
          });
        }
      });
      populateMaterialDropdown();
    };
    reader.readAsArrayBuffer(file);
  }

  function populateMaterialDropdown() {
    const datalist = document.getElementById('material-list');
    datalist.innerHTML = "";
    uploadedMaterials.forEach(material => {
      const option = document.createElement('option');
      option.value = material.materialDescription;
      datalist.appendChild(option);
    });
  }

  const materialDescInput = document.getElementById('material-description');
  if (materialDescInput) {
    materialDescInput.addEventListener('change', () => {
      const selectedDesc = materialDescInput.value;
      const found = uploadedMaterials.find(m => m.materialDescription === selectedDesc);
      document.getElementById('material-number').value = found ? found.materialNumber : "";
    });
  }

  // Carton Entry addition logic with edit (simulate saving previous entries in backend)
  let lastCartonEntry = null;
  const addCartonEntryButton = document.getElementById('add-carton-entry');
  if (addCartonEntryButton) {
    addCartonEntryButton.addEventListener('click', () => {
      if (!materialDescInput.value || !document.getElementById('carton-location').value) {
        alert("Please fill in Material Description and Location.");
        return;
      }
      addCartonEntry();
    });
  }

  function addCartonEntry() {
    const materialDesc = document.getElementById('material-description').value;
    const materialNum = document.getElementById('material-number').value;
    const location = document.getElementById('carton-location').value;
    // Save previous entry (simulate backend storing – here using localStorage)
    if (lastCartonEntry) {
      let previousEntries = JSON.parse(localStorage.getItem('cartonEntries') || "[]");
      previousEntries.push(lastCartonEntry);
      localStorage.setItem('cartonEntries', JSON.stringify(previousEntries));
    }
    lastCartonEntry = { materialDesc, materialNum, location };

    renderCartonEntryTable();
    // Clear manual entries but leave the dropdown for convenience
    document.getElementById('carton-location').value = "";
  }

  function renderCartonEntryTable() {
    const tbody = document.querySelector('#carton-entry-table tbody');
    tbody.innerHTML = "";
    if (lastCartonEntry) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${lastCartonEntry.materialDesc}</td>
        <td>${lastCartonEntry.materialNum}</td>
        <td>${lastCartonEntry.location}</td>
        <td><button class="edit-btn">Edit</button></td>
      `;
      tbody.appendChild(row);
      // Edit button logic – reload the last entry into the fields for editing.
      row.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('material-description').value = lastCartonEntry.materialDesc;
        document.getElementById('material-number').value = lastCartonEntry.materialNum;
        document.getElementById('carton-location').value = lastCartonEntry.location;
        lastCartonEntry = null;
        tbody.innerHTML = "";
      });
    }
  }

  // Carton file preview and generation using XLSX
  const previewCartonFileButton = document.getElementById('preview-carton-file');
  const generateCartonFileButton = document.getElementById('generate-carton-file');
  if (previewCartonFileButton) {
    previewCartonFileButton.addEventListener('click', () => {
      generateCartonFileButton.style.display = 'inline-block';
    });
  }
  if (generateCartonFileButton) {
    generateCartonFileButton.addEventListener('click', generateCartonFile);
  }
  function generateCartonFile() {
    const table = document.getElementById('carton-entry-table');
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, 'CartonEntries');
    XLSX.writeFile(wb, 'CartonEntries.xlsx');
    addFileToPhysicalCounting('CartonEntries.xlsx', 'carton');
  }

  // Functions to add files to Physical Counting page sub-tabs
  function addFileToPhysicalCounting(fileName, type) {
    const tableId = type === 'carton' ? 'carton-files-table' : 'mcb-files-table';
    const tbody = document.querySelector(`#${tableId} tbody`);
    const row = document.createElement('tr');
    row.innerHTML = `<td>${fileName}</td><td></td>`;
    const actionCell = row.cells[1];

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.className = 'download-file';
    downloadBtn.addEventListener('click', () => downloadFile(fileName));
    actionCell.appendChild(downloadBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-file';
    deleteBtn.addEventListener('click', () => row.remove());
    actionCell.appendChild(deleteBtn);

    tbody.appendChild(row);
  }

  function downloadFile(fileName) {
    // Placeholder for download functionality.
    alert("Download functionality is not implemented in this demo.");
  }

  // Tab Interface for Physical Counting page
  window.openTab = function (evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
      content.style.display = "none";
    }
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let btn of tabButtons) {
      btn.className = btn.className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  };
});