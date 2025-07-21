document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const loading = document.querySelector(".loading");
    const errorMessage = document.querySelector(".error-message");
    const sentMessage = document.querySelector(".sent-message");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Show loading message
        loading.style.display = "block";
        errorMessage.style.display = "none";
        sentMessage.style.display = "none";

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                sentMessage.innerHTML = result.message;
                sentMessage.style.display = "block";
                contactForm.reset();
            } else {
                // Show error message
                errorMessage.innerHTML = result.message;
                errorMessage.style.display = "block";
            }
        } catch (error) {
            // Show error message
            errorMessage.innerHTML = "An error occurred while sending your message. Please try again later.";
            errorMessage.style.display = "block";
        } finally {
            // Hide loading message
            loading.style.display = "none";
        }
    });
});