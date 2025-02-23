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

document.addEventListener('DOMContentLoaded', function() {
    // Update UTC time
    function updateTime() {
        const now = new Date();
        const utcString = now.toISOString().replace('T', ' ').substr(0, 19);
        document.getElementById('current-time').textContent = `UTC: ${utcString}`;
    }
    
    setInterval(updateTime, 1000);
    updateTime();

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

    // Load saved files from localStorage
    function loadSavedFiles() {
        const mcbFiles = JSON.parse(localStorage.getItem('mcbFiles') || '[]');
        const cartonFiles = JSON.parse(localStorage.getItem('cartonFiles') || '[]');

        const mcbTableBody = document.querySelector('#mcb-files-table tbody');
        const cartonTableBody = document.querySelector('#carton-files-table tbody');

        if (mcbTableBody) populateFileTable(mcbTableBody, mcbFiles);
        if (cartonTableBody) populateFileTable(cartonTableBody, cartonFiles);
    }

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

    // File operations
    window.downloadFile = function(fileName) {
        // In a real application, this would trigger a server request
        alert(`Downloading file: ${fileName}`);
    }

    window.deleteFile = function(fileName, button) {
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            const row = button.closest('tr');
            const table = row.closest('table');
            const fileType = table.id === 'mcb-files-table' ? 'mcbFiles' : 'cartonFiles';
            
            // Remove from localStorage
            let files = JSON.parse(localStorage.getItem(fileType) || '[]');
            files = files.filter(file => file.name !== fileName);
            localStorage.setItem(fileType, JSON.stringify(files));
            
            // Remove from UI
            row.remove();
        }
    }

    // Add file to table
    window.addFileToTable = function(fileName, fileType) {
        const now = new Date();
        const fileData = {
            name: fileName,
            date: now.toISOString().replace('T', ' ').substr(0, 19),
            createdBy: 'krushnaharde123'
        };

        // Save to localStorage
        const storageKey = fileType === 'mcb' ? 'mcbFiles' : 'cartonFiles';
        let files = JSON.parse(localStorage.getItem(storageKey) || '[]');
        files.push(fileData);
        localStorage.setItem(storageKey, JSON.stringify(files));

        // Update UI if on physical counting page
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

    // Initialize
    loadSavedFiles();
});
