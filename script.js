// Day 1: Setup
console.log("JavaScript features initialized!");

// When the DOM is fully loaded, start applying our functionality
document.addEventListener("DOMContentLoaded", () => {
    // ---- DOM Elements Selection ----
    const greetingTitle = document.getElementById("greeting-title");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;
    const currentYearSpan = document.getElementById("current-year");

    // Gallery Elements
    const mainImage = document.getElementById("main-image");
    const imageCaption = document.getElementById("image-caption");
    const thumbnails = document.querySelectorAll(".thumbnail");

    // Form Elements
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const charCountdown = document.getElementById("char-countdown");
    const successMsg = document.getElementById("form-success-msg");
    const submitBtn = document.getElementById("submit-btn");

    // ==========================================
    // Feature 1: Dynamic Greeting & Content (DOM Manipulation)
    // ==========================================
    const updateTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        let greeting = "Welcome!";
        if (hour < 12) greeting = "Good Morning!";
        else if (hour < 18) greeting = "Good Afternoon!";
        else greeting = "Good Evening!";
        
        greetingTitle.textContent = greeting;
        currentYearSpan.textContent = new Date().getFullYear();
    };

    updateTimeBasedGreeting();

    // ==========================================
    // Feature 2: Dark Mode with LocalStorage
    // ==========================================
    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeIcon.textContent = "☀️";
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            themeIcon.textContent = "🌙";
        }
    };

    // Day 6: Check local storage on initial load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // Toggle event listener
    themeToggleBtn.addEventListener("click", () => {
        const isCurrentlyDark = body.classList.contains("dark-mode");
        const willBeDark = !isCurrentlyDark;
        
        applyTheme(willBeDark);
        
        // Save preference to LocalStorage
        localStorage.setItem("theme", willBeDark ? "dark" : "light");
    });

    // ==========================================
    // Feature 3: Interactive Image Gallery
    // ==========================================
    // Setup hover and click functionality for dynamic interaction
    thumbnails.forEach(thumbnail => {
        // Event Handling: Click Event
        thumbnail.addEventListener("click", function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove("active"));
            
            // Add active class to clicked thumbnail
            this.classList.add("active");
            
            // Update Main Image source and caption using dataset attributes
            const fullImageUrl = this.getAttribute("data-full");
            const newCaption = this.getAttribute("data-caption");
            
            // Fade out effect
            mainImage.style.opacity = 0;
            setTimeout(() => {
                mainImage.src = fullImageUrl;
                imageCaption.textContent = newCaption;
                // Fade back in
                mainImage.style.opacity = 1;
            }, 300); // 300ms transition time matching CSS
        });
        
        // Event Handling: Mouseenter (Hover effect log/interactivity)
        thumbnail.addEventListener("mouseenter", () => {
            thumbnail.style.transform = "scale(1.05)";
        });

        thumbnail.addEventListener("mouseleave", () => {
            // Reset to default on leave (CSS transition handles smoothness)
            if(!thumbnail.classList.contains("active")) {
                thumbnail.style.transform = "scale(1)";
            }
        });
    });

    // ==========================================
    // Feature 4: Form Validation with Real-time Feedback
    // ==========================================
    const maxChars = 250;

    // Reusable function for Field Validation
    const validateField = (input, regex, errorMessageElementId, errorText) => {
        const value = input.value.trim();
        const errorElement = document.getElementById(errorMessageElementId);
        
        if (value === "") {
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorElement.textContent = "This field is required.";
            errorElement.classList.add("show");
            return false;
        } else if (regex && !regex.test(value)) {
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorElement.textContent = errorText;
            errorElement.classList.add("show");
            return false;
        } else {
            input.classList.remove("invalid");
            input.classList.add("valid");
            errorElement.classList.remove("show");
            return true;
        }
    };

    // Validation Regex Rules
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time Validation Event Listeners (blur or input)
    nameInput.addEventListener("input", () => validateField(nameInput, nameRegex, "name-error", "Name must be at least 2 alphabetic characters."));
    emailInput.addEventListener("input", () => validateField(emailInput, emailRegex, "email-error", "Please enter a valid email address."));
    
    // Message Textarea - Character Countdown UI update (DOM Manipulation)
    messageInput.addEventListener("input", () => {
        const currentLength = messageInput.value.length;
        const remainingChars = maxChars - currentLength;
        
        charCountdown.textContent = `${remainingChars} characters remaining`;
        
        if (remainingChars < 0) {
            charCountdown.style.color = "var(--error-color)";
        } else if (remainingChars < 20) {
            charCountdown.style.color = "orange";
        } else {
            charCountdown.style.color = "gray";
        }
        
        validateField(messageInput, null, "message-error", ""); // Re-validate on input
    });

    // Event Handling: Form Submit Interception
    form.addEventListener("submit", (e) => {
        // Prevent default submission
        e.preventDefault();
        
        successMsg.classList.add("hidden");
        
        // Validate all fields
        const isNameValid = validateField(nameInput, nameRegex, "name-error", "Name must be at least 2 alphabetic characters.");
        const isEmailValid = validateField(emailInput, emailRegex, "email-error", "Please enter a valid email address.");
        const isMessageValid = validateField(messageInput, null, "message-error", "");
        
        // Extra check for max char limit on message
        let isMessageLengthValid = true;
        if (messageInput.value.length > maxChars) {
            const errEl = document.getElementById("message-error");
            errEl.textContent = `Message exceeds limit by ${messageInput.value.length - maxChars} characters.`;
            errEl.classList.add("show");
            messageInput.classList.add("invalid");
            isMessageLengthValid = false;
        }

        // Final check
        if (isNameValid && isEmailValid && isMessageValid && isMessageLengthValid) {
            // Day 7: Testing & debugging simulated success
            console.log("Form successfully validated and simulated submission!");
            
            // Show Success Message
            successMsg.classList.remove("hidden");
            
            // Reset form fields
            form.reset();
            
            // Remove valid classes visually
            [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove("valid"));
            charCountdown.textContent = `${maxChars} characters remaining`;
            charCountdown.style.color = "gray";

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMsg.classList.add("hidden");
            }, 5000);
        } else {
            console.log("Form validation failed.");
            // Shake effect on submit button for fun interaction
            submitBtn.style.transform = "translateX(-10px)";
            setTimeout(() => submitBtn.style.transform = "translateX(10px)", 100);
            setTimeout(() => submitBtn.style.transform = "translateX(-10px)", 200);
            setTimeout(() => submitBtn.style.transform = "translateX(0)", 300);
        }
    });

});
