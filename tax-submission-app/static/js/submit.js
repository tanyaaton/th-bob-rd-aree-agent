// Step navigation
let currentStep = 1;

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Show the target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        targetStep.classList.add('active');
    }
    
    currentStep = stepNumber;
}

// Validate user credentials (Step 1)
async function validateUser() {
    const nationalId = document.getElementById('national_id').value.trim();
    
    if (!nationalId) {
        alert('Please enter National ID / กรุณากรอกเลขบัตรประชาชน');
        return;
    }
    
    try {
        const response = await fetch('/api/validate-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ national_id: nationalId })
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            // Populate user info from database response
            document.getElementById('name').value = data.user.name || '';
            const birthdayField = document.getElementById('birthday');
            if (birthdayField) {
                birthdayField.value = data.user.birthday || '';
            }
            
            // Store user info for submission
            sessionStorage.setItem('userName', data.user.name || '');
            sessionStorage.setItem('userNationalId', nationalId);
            sessionStorage.setItem('userBirthday', data.user.birthday || '');
            
            // Move to step 2
            showStep(2);
        } else {
            alert(data.message || 'Invalid user credentials / ข้อมูลผู้ใช้ไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Error validating user:', error);
        alert('Error validating user. Please try again. / เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
    }
}

// Toggle income fields visibility
function toggleIncomeFields(checkbox) {
    const incomeItem = checkbox.closest('.income-item');
    const fields = incomeItem.querySelector('.income-fields');
    
    if (checkbox.checked) {
        fields.classList.add('active');
        // Make fields required when checked
        fields.querySelectorAll('input').forEach(input => {
            input.required = true;
        });
    } else {
        fields.classList.remove('active');
        // Clear and make fields optional when unchecked
        fields.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.required = false;
        });
    }
}

// Collect income data from form
function collectIncomeData() {
    const incomeData = [];
    
    document.querySelectorAll('.income-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
        const incomeItem = checkbox.closest('.income-item');
        const incomeType = parseInt(checkbox.value, 10);
        const amountInput = incomeItem.querySelector('input[type="number"]');
        const detailsInput = incomeItem.querySelector('textarea');
        
        const amount = amountInput ? parseFloat(amountInput.value) : 0;
        const details = detailsInput ? detailsInput.value.trim() : '';
        
        if (amount > 0) {
            incomeData.push({
                type: incomeType,
                amount: amount,
                details: details
            });
        }
    });
    
    return incomeData;
}

// Submit tax form
async function submitTaxForm() {
    const incomeData = collectIncomeData();
    
    if (incomeData.length === 0) {
        alert('Please select at least one income type and enter the amount / กรุณาเลือกประเภทรายได้อย่างน้อย 1 ประเภท');
        return;
    }
    
    // Validate all selected income types have amounts
    let hasError = false;
    document.querySelectorAll('.income-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
        const incomeItem = checkbox.closest('.income-item');
        const amountInput = incomeItem.querySelector('input[type="number"]');
        
        if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
            hasError = true;
            amountInput.style.borderColor = 'red';
        } else {
            amountInput.style.borderColor = '';
        }
    });
    
    if (hasError) {
        alert('Please enter valid amounts for all selected income types / กรุณากรอกจำนวนเงินที่ถูกต้องสำหรับทุกประเภทที่เลือก');
        return;
    }
    
    const name = sessionStorage.getItem('userName');
    const nationalId = sessionStorage.getItem('userNationalId');
    
    if (!name || !nationalId) {
        alert('Session expired. Please start over. / เซสชันหมดอายุ กรุณาเริ่มใหม่');
        showStep(1);
        return;
    }
    
    try {
        const response = await fetch('/api/submit-tax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                national_id: nationalId,
                income_data: incomeData
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Tax form submitted successfully! / ยื่นแบบภาษีสำเร็จ!\n\nSubmission ID: ' + data.submission_id);
            
            // Clear session storage
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userNationalId');
            
            // Redirect to history page
            window.location.href = '/history';
        } else {
            alert(data.message || 'Error submitting tax form / เกิดข้อผิดพลาดในการยื่นแบบภาษี');
        }
    } catch (error) {
        console.error('Error submitting tax form:', error);
        alert('Error submitting tax form. Please try again. / เกิดข้อผิดพลาดในการยื่นแบบภาษี');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show step 1 by default
    showStep(1);
    
    // Add event listeners to all checkboxes
    document.querySelectorAll('.income-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleIncomeFields(this);
        });
    });
});

// Made with Bob
