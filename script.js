function filterGallery(category) {

    const items = document.querySelectorAll(".gallery-item");
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    items.forEach(item => {

        if (category === "all" || item.dataset.category === category) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }

    });

}
// --- APPOINTMENT SYSTEM MOTOR ENGINES ---

// 1. Toggles Open or Closed State of the Modal Chassis
function toggleModal() {
    const modal = document.getElementById('appointmentModal');
    const successCard = document.getElementById('formSuccessCard');
    const bookingForm = document.getElementById('realBookingForm');
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        // Reset statuses for next execution loop cleanly
        setTimeout(() => {
            successCard.classList.remove('triggered');
            bookingForm.reset();
        }, 400);
    } else {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        restrictPastDates(); // Auto-locks yesterday's date criteria
    }
}

// 2. Form Past Date Boundary Lock Control
function restrictPastDates() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    // Formatting constraints to structure valid min tags
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    
    const minDateValue = `${year}-${month}-${day}`;
    dateInput.setAttribute('min', minDateValue);
}

// 3. Asynchronous Form Delivery Submission Capture
document.getElementById('realBookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents old-school messy browser redirection page jumps
    
    const form = this;
    const submitBtn = form.querySelector('.btn-submit-booking');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const successCard = document.getElementById('formSuccessCard');
    
    // UI Loading state transformations
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'block';
    
    // Package and dispatch the dataset over networks
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            // Trigger beautiful interactive success panel state
            successCard.classList.add('triggered');
        } else {
            alert("Something went wrong with submission processing. Please connect with clinic directly via phone.");
        }
    })
    .catch(error => {
        alert("Network communication interrupt detected. Please verify internet configurations.");
    })
    .finally(() => {
        // Clear background processing mechanics safely
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
    });
});

// 4. Secure Global Event Listener to close open modals using standard ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && document.getElementById('appointmentModal').classList.contains('active')) {
        toggleModal();
    }
});
