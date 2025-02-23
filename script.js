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

    // Initialize
    updateTime();
    setCurrentUser();
    setInterval(updateTime, 1000);

    // Carton Entry page logic
    const cartonMasterFileInput = document.getElementById('carton-master-file');
    const materialDescriptionInput = document.getElementById('material-description');
    const materialNumberInput = document.getElementById('material-number');
    const cartonEntryTableBody = document.getElementById('carton-entry-table').querySelector('tbody');

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
                masterData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                populateMaterialList(masterData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function populateMaterialList(data) {
        const materialList = document.getElementById('material-list');
        materialList.innerHTML = '';
        data.forEach((item, index) => {
            if (index === 0) return; // Skip header row
            const option = document.createElement('option');
            option.value = item[0]; // Description
            materialList.appendChild(option);
        });
    }

    materialDescriptionInput.addEventListener('input', (event) => {
        const description = event.target.value;
        const material = masterData.find(item => item[0] === description);
        if (material) {
            materialNumberInput.value = material[1]; // Material Number
        } else {
            materialNumberInput.value = '';
        }
    });

    document.getElementById('add-carton-entry').addEventListener('click', () => {
        const description = materialDescriptionInput.value;
        const materialNumber = materialNumberInput.value;
        const quantity = document.getElementById('carton-quantity').value;
        const location = document.getElementById('carton-location').value;

        if (!description || !materialNumber || !quantity || !location) {
            alert('Please fill in all required fields.');
            return;
        }

        const row = cartonEntryTableBody.insertRow();
        row.innerHTML = `
            <td>${description}</td>
            <td>${materialNumber}</td>
            <td>${quantity}</td>
            <td>${location}</td>
            <td><button type="button" class="edit-button">Edit</button></td>
        `;

        // Clear input fields
        materialDescriptionInput.value = '';
        materialNumberInput.value = '';
        document.getElementById('carton-quantity').value = '';
        document.getElementById('carton-location').value = '';

        // Add edit functionality
        row.querySelector('.edit-button').addEventListener('click', () => {
            materialDescriptionInput.value = description;
            materialNumberInput.value = materialNumber;
            document.getElementById('carton-quantity').value = quantity;
            document.getElementById('carton-location').value = location;
            cartonEntryTableBody.deleteRow(row.rowIndex - 1);
        });
    });

    // MCB Entry page logic
    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');
    const mcbEntryTableBody = document.getElementById('entry-table').querySelector('tbody');

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

    document.getElementById('add-entry').addEventListener('click', () => {
        const polarity = document.getElementById('polarity').value;
        const rating = document.getElementById('rating').value;
        const productFamily = productFamilySelect.value;
        const breakingCapacity = breakingCapacitySelect.value;
        const quantity = document.getElementById('quantity').value;
        const location = document.getElementById('location').value;

        if (!polarity || !rating || !productFamily || !breakingCapacity || !quantity || !location) {
            alert('Please fill in all required fields.');
            return;
        }

        const row = mcbEntryTableBody.insertRow();
        row.innerHTML = `
            <td>${polarity}</td>
            <td>${rating}</td>
            <td>${productFamily}</td>
            <td>${breakingCapacity}</td>
            <td>${quantity}</td>
            <td>${location}</td>
            <td><button type="button" class="edit-button">Edit</button></td>
        `;

        // Clear input fields
        document.getElementById('polarity').value = '';
        document.getElementById('rating').value = '';
        productFamilySelect.value = '';
        breakingCapacitySelect.innerHTML = '';
        document.getElementById('quantity').value = '';
        document.getElementById('location').value = '';

        // Add edit functionality
        row.querySelector('.edit-button').addEventListener('click', () => {
            document.getElementById('polarity').value = polarity;
            document.getElementById('rating').value = rating;
            productFamilySelect.value = productFamily;
            populateBreakingCapacity(breakingCapacities[productFamily]);
            breakingCapacitySelect.value = breakingCapacity;
            document.getElementById('quantity').value = quantity;
            document.getElementById('location').value = location;
            mcbEntryTableBody.deleteRow(row.rowIndex - 1);
        });
    });

    // Physical Counting page logic
    const physicalMasterFileInput = document.getElementById('physical-master-file');
    const countDescriptionInput = document.getElementById('count-description');
    const countNumberInput = document.getElementById('count-number');
    const countEntryTableBody = document.getElementById('count-entry-table').querySelector('tbody');

    let countData = [];

    physicalMasterFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                countData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                populateCountList(countData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function populateCountList(data) {
        const countList = document.getElementById('count-list');
        countList.innerHTML = '';
        data.forEach((item, index) => {
            if (index === 0) return; // Skip header row
            const option = document.createElement('option');
            option.value = item[0]; // Description
            countList.appendChild(option);
        });
    }

    countDescriptionInput.addEventListener('input', (event) => {
        const description = event.target.value;
        const count = countData.find(item => item[0] === description);
        if (count) {
            countNumberInput.value = count[1]; // Count Number
        } else {
            countNumberInput.value = '';
        }
    });

    document.getElementById('add-count-entry').addEventListener('click', () => {
        const description = countDescriptionInput.value;
        const countNumber = countNumberInput.value;
        const quantity = document.getElementById('count-quantity').value;
        const location = document.getElementById('count-location').value;

        if (!description || !countNumber || !quantity || !location) {
            alert('Please fill in all required fields.');
            return;
        }

        const row = countEntryTableBody.insertRow();
        row.innerHTML = `
            <td>${description}</td>
            <td>${countNumber}</td>
            <td>${quantity}</td>
            <td>${location}</td>
            <td><button type="button" class="edit-button">Edit</button></td>
        `;

        // Clear input fields
        countDescriptionInput.value = '';
        countNumberInput.value = '';
        document.getElementById('count-quantity').value = '';
        document.getElementById('count-location').value = '';

        // Add edit functionality
        row.querySelector('.edit-button').addEventListener('click', () => {
            countDescriptionInput.value = description;
            countNumberInput.value = countNumber;
            document.getElementById('count-quantity').value = quantity;
            document.getElementById('count-location').value = location;
            countEntryTableBody.deleteRow(row.rowIndex - 1);
        });
    });
});
