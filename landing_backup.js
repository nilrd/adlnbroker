// Landing Page JavaScript
document.addEventListener("DOMContentLoaded", function() {
    // Market data simulation - matching dashboard data
    const marketData = [
        { symbol: "PETR4", name: "Petrobras PN", price: 28.50, change: 2.15 },
        { symbol: "VALE3", name: "Vale ON", price: 72.30, change: 1.87 },
        { symbol: "ITUB4", name: "Itaú Unibanco PN", price: 31.20, change: -0.45 },
        { symbol: "BBDC4", name: "Bradesco PN", price: 27.80, change: 3.12 },
        { symbol: "ABEV3", name: "Ambev ON", price: 14.25, change: 1.23 },
        { symbol: "MGLU3", name: "Magazine Luiza ON", price: 3.45, change: 0.89 }
    ];

    // Update market prices with animation
    function updateMarketPrices() {
        const marketItems = document.querySelectorAll(".market-item");
        
        marketItems.forEach((item, index) => {
            if (marketData[index]) {
                const data = marketData[index];
                
                // Simulate price fluctuation
                const fluctuation = (Math.random() - 0.5) * 0.5;
                data.price += fluctuation;
                data.change += (Math.random() - 0.5) * 0.2;
                
                // Update price display
                const priceElement = item.querySelector(".price");
                const changeElement = item.querySelector(".change");
                
                if (priceElement) {
                    priceElement.textContent = `R$ ${data.price.toFixed(2)}`;
                }
                
                if (changeElement) {
                    const changeText = `${data.change >= 0 ? "+" : ""}${data.change.toFixed(2)}%`;
                    changeElement.textContent = changeText;
                    
                    // Update color based on change
                    changeElement.className = `change ${data.change >= 0 ? "positive" : "negative"}`;
                }
                
                // Add flash effect on price update
                priceElement.style.transform = "scale(1.05)";
                setTimeout(() => {
                    priceElement.style.transform = "scale(1)";
                }, 200);
            }
        });
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            // Add active class to clicked tab
            this.classList.add("active");
            
            // Here you could implement different market data based on tab
            console.log("Tab switched to:", this.textContent);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            if (this.getAttribute("href").startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector(".header");
    
    window.addEventListener("scroll", function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = "translateY(-100%)";
        } else {
            // Scrolling up
            header.style.transform = "translateY(0)";
        }
        
        lastScrollTop = scrollTop;
    });

    // Add transition to header
    header.style.transition = "transform 0.3s ease-in-out";

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(".hero-content, .market-section, .trust-indicators");
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });

    // Button click analytics (placeholder)
    const ctaButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
    ctaButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            // Add click effect
            this.style.transform = "scale(0.98)";
            setTimeout(() => {
                this.style.transform = "";
            }, 150);
            
            console.log("CTA button clicked:", this.textContent.trim());
        });
    });

    // Start market price updates
    updateMarketPrices();
    setInterval(updateMarketPrices, 5000); // Update every 5 seconds

    // Initialize animations
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    }, 300);

    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", function() {
            const navMenu = document.querySelector(".nav-menu");
            navMenu.classList.toggle("active");
        });
    }

    // Typing effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = "";
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Add loading state management
    window.addEventListener("load", function() {
        document.body.classList.add("loaded");
        
        // Remove any loading indicators
        const loader = document.querySelector(".loader");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => loader.remove(), 500);
        }
    });
});

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

function formatPercentage(value) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

// Export functions for potential use in other scripts
window.LandingPage = {
    formatCurrency,
    formatPercentage
};

// Modal functionality
document.addEventListener("DOMContentLoaded", function() {
    // Get modal elements
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const welcomeModal = document.getElementById("welcomeModal");

    // Get buttons that open modals
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const btnLoginHero = document.getElementById("btn-login-hero");
    const btnRegisterHero = document.getElementById("btn-register-hero");

    // Get close buttons
    const closeLoginModal = document.getElementById("close-login-modal");
    const closeRegisterModal = document.getElementById("close-register-modal");
    const closeWelcomeModal = document.getElementById("close-welcome-modal");

    // Get forms
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Utility functions for formatting and validation
    function formatCPF(value) {
        // Remove tudo que não é dígito
        value = value.replace(/\D/g, "");
        
        // Aplica a máscara
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        
        return value;
    }
    
    function formatPhone(value) {
        // Remove tudo que não é dígito
        value = value.replace(/\D/g, "");
        
        // Aplica a máscara
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{1,2})/, "($1");
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{1,5})/, "($1) $2");
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
            }
        }
        
        return value;
    }
    
    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false; // Todos os dígitos iguais
        
        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, "");
        
        // Deve ter 10 ou 11 dígitos (DDD + número)
        if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;
        
        // Verificar se o DDD é válido (11 a 99)
        const ddd = parseInt(cleanPhone.substring(0, 2));
        if (ddd < 11 || ddd > 99) return false;
        
        return true;
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateName(name) {
        // Apenas letras, espaços e acentos, mínimo 3 caracteres
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
        return nameRegex.test(name.trim());
    }
    
    function validatePassword(password) {
        // Mínimo 8 caracteres, pelo menos 1 maiúscula e 1 número
        return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    }
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + "Error");
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add("error");
        }
    }
    
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + "Error");
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = "";
        }
        if (inputElement) {
            inputElement.classList.remove("error");
        }
    }
    
    function clearAllErrors(formType) {
        if (formType === "login") {
            clearError("loginCpf");
            clearError("loginPassword");
            clearError("loginGeneral");
        } else if (formType === "register") {
            clearError("registerName");
            clearError("registerCpf");
            clearError("registerEmail");
            clearError("registerPhone");
            clearError("registerPassword");
            clearError("registerConfirmPassword");
            clearError("registerGeneral");
        }
    }
    
    // Add formatting to CPF fields
    const loginCpfField = document.getElementById("loginCpf");
    const registerCpfField = document.getElementById("registerCpf");
    const registerPhoneField = document.getElementById("registerPhone");
    
    if (loginCpfField) {
        loginCpfField.addEventListener("input", function(e) {
            e.target.value = formatCPF(e.target.value);
            clearError("loginCpf");
        });
    }
    
    if (registerCpfField) {
        registerCpfField.addEventListener("input", function(e) {
            e.target.value = formatCPF(e.target.value);
            clearError("registerCpf");
        });
    }
    
    if (registerPhoneField) {
        registerPhoneField.addEventListener("input", function(e) {
            e.target.value = formatPhone(e.target.value);
            clearError("registerPhone");
        });
    }

    // When the user clicks the login button, open the login modal
    if (btnLogin) {
        btnLogin.onclick = function() {
            openModal(loginModal);
        }
    }

    if (btnLoginHero) {
        btnLoginHero.onclick = function() {
            openModal(loginModal);
        }
    }

    // When the user clicks the register button, open the register modal
    if (btnRegister) {
        btnRegister.onclick = function() {
            openModal(registerModal);
        }
    }

    if (btnRegisterHero) {
        btnRegisterHero.onclick = function() {
            openModal(registerModal);
        }
    }

    // When the user clicks on <span> (x), close the modal
    if (closeLoginModal) {
        closeLoginModal.onclick = function() {
            closeModal(loginModal);
        }
    }

    if (closeRegisterModal) {
        closeRegisterModal.onclick = function() {
            closeModal(registerModal);
        }
    }

    if (closeWelcomeModal) {
        closeWelcomeModal.onclick = function() {
            closeModal(welcomeModal);
        }
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == loginModal) {
            closeModal(loginModal);
        }
        if (event.target == registerModal) {
            closeModal(registerModal);
        }
        if (event.target == welcomeModal) {
            closeModal(welcomeModal);
        }
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            clearAllErrors("login");

            const cpf = document.getElementById("loginCpf").value;
            const password = document.getElementById("loginPassword").value;

            let isValid = true;

            if (!validateCPF(cpf)) {
                showError("loginCpf", "CPF inválido.");
                isValid = false;
            }
            if (password.length < 1) {
                showError("loginPassword", "Senha é obrigatória.");
                isValid = false;
            }

            if (isValid) {
                // Authenticate user
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(u => u.cpf === cpf && u.password === password);

                if (user) {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    closeModal(loginModal);
                    document.getElementById("welcomeUserName").textContent = user.name.split(" ")[0];
                    openModal(welcomeModal);
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 3000); // Redirect after 3 seconds
                } else {
                    showError("loginGeneral", "CPF ou senha incorretos.");
                }
            }
        });
    }

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            clearAllErrors("register");

            const name = document.getElementById("registerName").value;
            const cpf = document.getElementById("registerCpf").value;
            const email = document.getElementById("registerEmail").value;
            const phone = document.getElementById("registerPhone").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("registerConfirmPassword").value;

            let isValid = true;

            if (!validateName(name)) {
                showError("registerName", "Nome inválido (apenas letras, min. 3 caracteres).");
                isValid = false;
            }
            if (!validateCPF(cpf)) {
                showError("registerCpf", "CPF inválido.");
                isValid = false;
            }
            if (!validateEmail(email)) {
                showError("registerEmail", "E-mail inválido.");
                isValid = false;
            }
            if (!validatePhone(phone)) {
                showError("registerPhone", "Telefone inválido (DDD + 8/9 dígitos).");
                isValid = false;
            }
            if (!validatePassword(password)) {
                showError("registerPassword", "Senha inválida (min. 8 caracteres, 1 maiúscula, 1 número).");
                isValid = false;
            }
            if (password !== confirmPassword) {
                showError("registerConfirmPassword", "As senhas não coincidem.");
                isValid = false;
            }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem("users")) || [];
                if (users.some(u => u.cpf === cpf)) {
                    showError("registerCpf", "CPF já cadastrado.");
                    return;
                }
                if (users.some(u => u.email === email)) {
                    showError("registerEmail", "E-mail já cadastrado.");
                    return;
                }

                const newUser = {
                    name: name,
                    cpf: cpf,
                    email: email,
                    phone: phone,
                    password: password,
                    balance: 100000 // Initial balance
                };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(newUser));

                closeModal(registerModal);
                document.getElementById("welcomeUserName").textContent = newUser.name.split(" ")[0];
                openModal(welcomeModal);
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 3000); // Redirect after 3 seconds
            }
        });
    }
});

