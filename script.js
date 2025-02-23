document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const MCB_FILES = 'mcbFiles';
    const CARTON_FILES = 'cartonFiles';

    // DOM Elements
    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');
    const polaritySelect = document.getElementById('polarity');
    const ratingSelect = document.getElementById('rating');
    const quantityInput = document.getElementById('quantity');
    const locationInput = document.getElementById('location');
    const entryTableBody = document.getElementById('entry-table').querySelector('tbody');
    const previewEntryFileButton = document.getElementById('preview-entry-file');
    const saveEntryFileButton = document.getElementById('save-entry-file');
    const cartonEntryTableBody = document.getElementById('carton-entry-table').querySelector('tbody');
    const previewCartonFileButton = document.getElementById('preview-carton-file');
    const saveCartonFileButton = document.getElementById('save-carton-file');
    const mcbFilesTableBody = document.getElementById('mcb-files-table').querySelector('tbody');
    const cartonFilesTableBody = document.getElementById('carton-files-table').querySelector('tbody');

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

    let allEntries = [];
    let allCartonEntries = [];

    // Functions
    function updateBreakingCapacities() {
        const selectedFamily = productFamilySelect.value;
        const capacities = breakingCapacities[selectedFamily] || [];
        breakingCapacitySelect.innerHTML = '';
        capacities.forEach(capacity => {
            const option = document.createElement('option');
            option.value = capacity;
            option.textContent = capacity;
            breakingCapacitySelect.appendChild(option);
        });
    }

    function addEntry() {
        const entry = {
            polarity: polaritySelect.value,
            rating: ratingSelect.value,
            productFamily: productFamilySelect.value,
            breakingCapacity: breakingCapacitySelect.value,
            quantity: quantityInput.value,
            location: locationInput.value
        };

        if (Object.values(entry).some(value => !value)) {
            alert('Please fill all fields before adding entry.');
            return;
        }

        allEntries.push(entry);
        displayEntries();
        clearEntryInputs();
    }

    function clearEntryInputs() {
        polaritySelect.value = '';
        ratingSelect.value = '';
        productFamilySelect.value = '';
        breakingCapacitySelect.innerHTML = '';
        quantityInput.value = '';
        locationInput.value = '';
    }

    function displayEntries() {
        entryTableBody.innerHTML = '';
        allEntries.forEach((entry, index) => {
            const row = document.createElement('tr');
            if (index === allEntries.length - 1) row.classList.add('bold');
            row.innerHTML = `<td>${entry.polarity}</td><td>${entry.rating}</td><td>${entry.productFamily}</td><td>${entry.breakingCapacity}</td><td>${entry.quantity}</td><td>${entry.location}</td>`;
            entryTableBody.appendChild(row);
        });
    }

    function previewEntryFile() {
        if (allEntries.length === 0) {
            alert('No entries to preview.');
            return;
        }
        displayEntries();
        saveEntryFileButton.style.display = 'inline-block';
    }

    function saveEntryFile() {
        const fileName = prompt('Enter file name:', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        if (!fileName) return;

        const csvHeader = 'Polarity,Rating,Product Family,Breaking Capacity,Quantity,Location';
        const csvRows = allEntries.map(entry => `${entry.polarity},${entry.rating},${entry.productFamily},${entry.breakingCapacity},${entry.quantity},${entry.location}`);
        const csvContent = `${csvHeader}\n${csvRows.join('\n')}`;
        saveFileToServer(fileName, csvContent, MCB_FILES);
    }

    async function saveFileToServer(fileName, content, type) {
        const response = await fetch('/save-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName, content, type })
        });
        if (response.ok) {
            alert('File saved successfully.');
            renderFiles();
        } else {
            alert('Failed to save file.');
        }
    }

    async function renderFiles() {
        const [mcbFiles, cartonFiles] = await Promise.all([
            fetchFiles(MCB_FILES),
            fetchFiles(CARTON_FILES)
        ]);
        renderFileList(mcbFiles, mcbFilesTableBody);
        renderFileList(cartonFiles, cartonFilesTableBody);
    }

    async function fetchFiles(type) {
        const response = await fetch(`/get-files?type=${type}`);
        return response.ok ? response.json() : [];
    }

    function renderFileList(files, tableBody) {
        tableBody.innerHTML = '';
        files.forEach((file, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${file.name}</td><td><button class="download-file" data-index="${index}" data-type="${file.type}">Download</button> <button class="delete-file" data-index="${index}" data-type="${file.type}">Delete</button></td>`;
            tableBody.appendChild(row);
        });
    }

    async function handleFileActions(event) {
        const index = event.target.getAttribute('data-index');
        const type = event.target.getAttribute('data-type');

        if (event.target.classList.contains('download-file')) {
            const response = await fetch(`/download-file?type=${type}&index=${index}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', response.headers.get('File-Name'));
                document.body.appendChild(link);
                link.click();
            } else {
                alert('Failed to download file.');
            }
        } else if (event.target.classList.contains('delete-file')) {
            const response = await fetch('/delete-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, index })
            });
            if (response.ok) {
                renderFiles();
            } else {
                alert('Failed to delete file.');
            }
        }
    }

    function openTab(event, tabName) {
        document.querySelectorAll('.tab-content').forEach(tabContent => tabContent.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        document.querySelectorAll('.tab-button').forEach(tabButton => tabButton.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    // Event Listeners
    productFamilySelect.addEventListener('change', updateBreakingCapacities);
    document.getElementById('add-entry').addEventListener('click', addEntry);
    previewEntryFileButton.addEventListener('click', previewEntryFile);
    saveEntryFileButton.addEventListener('click', saveEntryFile);
    mcbFilesTableBody.addEventListener('click', handleFileActions);
    cartonFilesTableBody.addEventListener('click', handleFileActions);
    document.addEventListener('DOMContentLoaded', renderFiles);
});
