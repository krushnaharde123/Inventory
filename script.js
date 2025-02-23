document.addEventListener('DOMContentLoaded', function() {
    // Function to update UTC time
    function updateTime() {
        const now = new Date();
        const utcString = now.toISOString().replace('T', ' ').substr(0, 19);
        document.getElementById('current-time').textContent = `UTC: ${utcString}`;
    }

    // Function to get the current user
    function getCurrentUser() {
        return 'krushnaharde123';
    }

    // Function to set the current user in the UI
    function setCurrentUser() {
        const userLoginSpan = document.getElementById('user-login');
        if (userLoginSpan) {
            userLoginSpan.textContent = `User: ${getCurrentUser()}`;
        }
    }

    // Function to load saved files from localStorage
    function loadSavedFiles() {
        const mcbFiles = JSON.parse(localStorage.getItem('mcbFiles') || '[]');
        const cartonFiles = JSON.parse(localStorage.getItem('cartonFiles') || '[]');

        const mcbTableBody = document.querySelector('#mcb-files-table tbody');
        const cartonTableBody = document.querySelector('#carton-files-table tbody');

        if (mcbTableBody) populateFileTable(mcbTableBody, mcbFiles);
        if (cartonTableBody) populateFileTable(cartonTableBody, cartonFiles);
    }

    // Function to populate the file table
    function populateFileTable(tableBody, files) {
        tableBody.innerHTML = '';
        files.forEach(file => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${file.name}</td>
                <td>${file.date}</td>
                <td>${file.createdBy}</td>
                <td>
                    <button class="download-button" onclick="downloadFile('${file.name}')">Download</button>
                    <button class="delete-button" onclick="deleteFile('${file.name}', this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to handle file download
    window.downloadFile = function(fileName) {
        alert(`Downloading file: ${fileName}`);
    }

    // Function to handle file deletion
    window.deleteFile = function(fileName, button) {
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            const row = button.closest('tr');
            const table = row.closest('table');
            const fileType = table.id === 'mcb-files-table' ? 'mcbFiles' : 'cartonFiles';

            let files = JSON.parse(localStorage.getItem(fileType) || '[]');
            files = files.filter(file => file.name !== fileName);
            localStorage.setItem(fileType, JSON.stringify(files));

            row.remove();
        }
    }

    // Function to add file to table
    window.addFileToTable = function(fileName, fileType) {
        const now = new Date();
        const fileData = {
            name: fileName,
            date: now.toISOString().replace('T', ' ').substr(0, 19),
            createdBy: getCurrentUser()
        };

        const storageKey = fileType === 'mcb' ? 'mcbFiles' : 'cartonFiles';
        let files = JSON.parse(localStorage.getItem(storageKey) || '[]');
        files.push(fileData);
        localStorage.setItem(storageKey, JSON.stringify(files));

        const tableId = fileType === 'mcb' ? 'mcb-files-table' : 'carton-files-table';
        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (tableBody) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fileData.name}</td>
                <td>${fileData.date}</td>
                <td>${fileData.createdBy}</td>
                <td>
                    <button class="download-button" onclick="downloadFile('${fileData.name}')">Download</button>
                    <button class="delete-button" onclick="deleteFile('${fileData.name}', this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Sidebar functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }

    // Tab functionality
    window.openTab = function(evt, tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (let content of tabContents) {
            content.style.display = 'none';
        }

        const tabButtons = document.getElementsByClassName('tab-button');
        for (let button of tabButtons) {
            button.classList.remove('active');
        }

        document.getElementById(tabName).style.display = 'block';
        evt.currentTarget.classList.add('active');
    }

    // Initialize
    updateTime();
    setCurrentUser();
    setInterval(updateTime, 1000);
    loadSavedFiles();

    // Carton Entry page logic
    const cartonMasterFileInput = document.getElementById('carton-master-file');
    const materialDescriptionInput = document.getElementById('material-description');
    const materialNumberInput = document.getElementById('material-number');

    let masterData = [];

    cartonMasterFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                masterData = XLSX.utils.sheet_to_json(worksheet);
                populateMaterialList(masterData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function populateMaterialList(data) {
        const materialList = document.getElementById('material-list');
        materialList.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item['Material Description'];
            materialList.appendChild(option);
        });
    }

    materialDescriptionInput.addEventListener('input', (event) => {
        const description = event.target.value;
        const material = masterData.find(item => item['Material Description'] === description);
        if (material) {
            materialNumberInput.value = material['Material Number'];
        } else {
            materialNumberInput.value = '';
        }
    });

    // MCB Entry page logic
    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');

    const breakingCapacities = {
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

    productFamilySelect.addEventListener('change', (event) => {
        const family = event.target.value;
        const capacities = breakingCapacities[family] || [];
        populateBreakingCapacity(capacities);
    });

    function populateBreakingCapacity(capacities) {
        breakingCapacitySelect.innerHTML = '';
        capacities.forEach(capacity => {
            const option = document.createElement('option');
            option.value = capacity;
            option.textContent = capacity;
            breakingCapacitySelect.appendChild(option);
        });
    }
});
