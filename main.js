/* ==========================================
   GROW PLATFORM - CORE JAVASCRIPT
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Dark/Light Theme System & Multi-Language Switcher
    initThemeSwitcher();
    initLanguageSwitcher();
    initGlobalSearchEngine();

    // 1. Highlight Current Active Page Link in Navigation
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Mobile Menu Toggle & Explicit Close Button
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');

    if (navMenu && !navMenu.querySelector('.mobile-menu-header-item')) {
        const menuHeader = document.createElement('li');
        menuHeader.className = 'mobile-menu-header-item';
        menuHeader.innerHTML = `
            <div class="mobile-menu-header">
                <span class="mobile-menu-title"><i class="fa-solid fa-seedling"></i> GROW Navigation</span>
                <button class="nav-close-btn" aria-label="Close menu">
                    <i class="fa-solid fa-xmark"></i> Close
                </button>
            </div>
        `;
        navMenu.insertBefore(menuHeader, navMenu.firstChild);
    }

    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileBtn) {
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    }

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });

        // Close button inside menu drawer
        const closeBtn = navMenu.querySelector('.nav-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMobileMenu();
            });
        }

        // Close menu when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu when clicking a link
        const allNavLinks = navMenu.querySelectorAll('a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    // 3. Global Intelligent Search Engine Initialization
    // Handled by initGlobalSearchEngine() below


    // 4. Modal Triggers & Close
    const closeModalBtns = document.querySelectorAll('.modal-close, [data-close-modal]');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // 5. FAQ Accordion Toggle (if on Contact page)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 6. Initialize Global Kisan Mitra AI Chatbot Widget
    initGrowAIChatbot();
});

// Toast notification utility
function showToast(message, iconClass = 'fa-circle-check') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Global modal opener helper
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/* ==========================================
   KISAN MITRA AI ASSISTANT (GLOBAL CHATBOT)
========================================== */
function initGrowAIChatbot() {
    if (document.getElementById('grow-chat-widget')) return;

    const widgetHTML = `
        <div id="grow-chat-widget" class="grow-chat-widget">
            <button id="grow-chat-toggle" class="grow-chat-toggle-btn" aria-label="Open Kisan AI Assistant">
                <i class="fa-solid fa-headset"></i>
                <span>Ask Kisan AI</span>
                <span class="grow-chat-unread-dot"></span>
            </button>

            <div id="grow-chat-modal" class="grow-chat-modal">
                <div class="grow-chat-header">
                    <div class="grow-chat-header-info">
                        <div class="grow-chat-avatar">
                            <i class="fa-solid fa-seedling"></i>
                        </div>
                        <div class="grow-chat-title">
                            <h4>Kisan Mitra AI</h4>
                            <div class="grow-chat-status">
                                <span class="grow-chat-status-dot"></span> Online • 24/7 Smart Agriculture Expert
                            </div>
                        </div>
                    </div>
                    <div class="grow-chat-header-actions">
                        <button id="grow-chat-close-btn" aria-label="Close Chat"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>

                <div id="grow-chat-body" class="grow-chat-body">
                    <div class="chat-msg bot-msg">
                        <div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>
                        <div>
                            <div class="chat-msg-bubble">
                                Namaste! 🙏 I am <strong>Kisan Mitra AI</strong>, your 24/7 agricultural expert. How can I help your farm today?
                            </div>
                            <div class="chat-quick-prompts">
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('What are current Mandi rates for Wheat?')">🌾 Wheat Mandi Rates</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('How to apply for PM-KISAN subsidy?')">🏛️ PM-KISAN Subsidy</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('How to treat Yellow Rust in Wheat?')">🐛 Crop Disease Doctor</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('What is the weather forecast today?')">☀️ Weather Advisory</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grow-chat-footer">
                    <input type="text" id="grow-chat-input" placeholder="Ask about crops, pests, market rates, or schemes..." onkeypress="handleChatKeyPress(event)">
                    <button id="grow-chat-send" class="grow-chat-send-btn" onclick="sendChatMessage()">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const toggleBtn = document.getElementById('grow-chat-toggle');
    const modal = document.getElementById('grow-chat-modal');
    const closeBtn = document.getElementById('grow-chat-close-btn');

    toggleBtn.addEventListener('click', () => {
        modal.classList.toggle('active');
        const dot = toggleBtn.querySelector('.grow-chat-unread-dot');
        if (dot) dot.style.display = 'none';
        if (modal.classList.contains('active')) {
            const input = document.getElementById('grow-chat-input');
            if (input) input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

function sendQuickPrompt(promptText) {
    const input = document.getElementById('grow-chat-input');
    if (input) {
        input.value = promptText;
        sendChatMessage();
    }
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

function getCurrentTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendChatMessage() {
    const input = document.getElementById('grow-chat-input');
    const chatBody = document.getElementById('grow-chat-body');
    if (!input || !chatBody) return;

    const query = input.value.trim();
    if (!query) return;

    // 1. Append User Message
    const userMsgHTML = `
        <div class="chat-msg user-msg">
            <div class="chat-msg-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
                <div class="chat-msg-bubble">${escapeHTML(query)}</div>
                <div class="chat-msg-time">${getCurrentTimeStr()}</div>
            </div>
        </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', userMsgHTML);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Append Typing Indicator
    const typingId = 'typing-' + Date.now();
    const typingHTML = `
        <div class="chat-msg bot-msg" id="${typingId}">
            <div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="chat-typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', typingHTML);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3. Process Bot Response with realistic delay
    setTimeout(() => {
        const typingElem = document.getElementById(typingId);
        if (typingElem) typingElem.remove();

        const botReply = generateAIResponse(query);
        const botMsgHTML = `
            <div class="chat-msg bot-msg">
                <div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>
                <div>
                    <div class="chat-msg-bubble">${botReply}</div>
                    <div class="chat-msg-time">${getCurrentTimeStr()}</div>
                </div>
            </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', botMsgHTML);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 650);
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateAIResponse(q) {
    const query = q.toLowerCase();

    // Mandi Rates & Market
    if (query.includes('mandi') || query.includes('rate') || query.includes('price') || query.includes('market') || query.includes('cost')) {
        if (query.includes('wheat') || query.includes('gehun')) {
            return `🌾 <strong>Wheat (Gehun) Mandi Update:</strong><br>• National Modal Rate: <strong>₹ 2,285 / Quintal</strong> (+1.8% today)<br>• Top Mandi: Khanna Mandi, Punjab (₹ 2,320 / Qtl)<br>• MSP Rate: ₹ 2,275 / Qtl.<br><a href="market.html?search=wheat" style="color:#2E7D32; font-weight:700;">View Full Wheat Market Analysis →</a>`;
        }
        if (query.includes('mustard') || query.includes('sarson')) {
            return `🟡 <strong>Mustard (Sarson) Update:</strong><br>• Modal Rate: <strong>₹ 5,850 / Quintal</strong> (+4.2% today)<br>• Top Mandi: Bharatpur, Rajasthan (₹ 5,980 / Qtl)<br>• Trend: Strong buyer demand from oil mills.<br><a href="market.html?search=mustard" style="color:#2E7D32; font-weight:700;">View Mustard Price Details →</a>`;
        }
        if (query.includes('paddy') || query.includes('rice') || query.includes('dhan')) {
            return `🌾 <strong>Paddy / Basmati Update:</strong><br>• Modal Rate: <strong>₹ 4,500 / Quintal</strong> (+2.4% today)<br>• Top Mandi: Karnal, Haryana (₹ 4,650 / Qtl)<br>• High export demand for Basmati 1121 variety.`;
        }
        return `📈 <strong>Live Mandi Summary:</strong><br>• Wheat: ₹ 2,285 / Qtl<br>• Mustard: ₹ 5,850 / Qtl<br>• Paddy/Basmati: ₹ 4,500 / Qtl<br>• Soybean: ₹ 4,620 / Qtl<br>• Cotton: ₹ 7,150 / Qtl<br><br><a href="market.html" style="color:#2E7D32; font-weight:700;">Explore All Mandi Prices →</a>`;
    }

    // Govt Schemes & Subsidies
    if (query.includes('scheme') || query.includes('subsidy') || query.includes('pm') || query.includes('kisan') || query.includes('gov') || query.includes('grant')) {
        if (query.includes('drip') || query.includes('irrigation') || query.includes('pmksy')) {
            return `💧 <strong>PMKSY Drip Irrigation Subsidy:</strong><br>Small and marginal farmers get up to <strong>80% subsidy</strong> on drip & sprinkler micro-irrigation systems.<br><br>👉 <a href="learning.html" style="color:#2E7D32; font-weight:700;">Read PMKSY Application Guide →</a>`;
        }
        if (query.includes('solar') || query.includes('pump') || query.includes('kusum')) {
            return `☀️ <strong>PM-KUSUM Solar Pump Scheme:</strong><br>Get <strong>90% combined subsidy</strong> (30% Central + 30% State + 30% bank loan) for solar agricultural pumps up to 7.5 HP.<br><br>👉 <a href="learning.html" style="color:#2E7D32; font-weight:700;">Read Solar Pump Subsidy Guide →</a>`;
        }
        return `🏛️ <strong>Top Government Schemes for Farmers:</strong><br>1. <strong>PM-KISAN:</strong> ₹6,000/year direct bank transfer<br>2. <strong>PMKSY:</strong> 80% Drip Irrigation Grant<br>3. <strong>PM-KUSUM:</strong> 90% Solar Pump Grant<br>4. <strong>PMFBY:</strong> Crop Insurance Protection<br><br><a href="learning.html" style="color:#2E7D32; font-weight:700;">Browse All Schemes & Portals →</a>`;
    }

    // Pest & Disease Diagnosis
    if (query.includes('disease') || query.includes('pest') || query.includes('yellow') || query.includes('rust') || query.includes('doctor') || query.includes('bug') || query.includes('insect') || query.includes('spot')) {
        return `🐛 <strong>AI Crop Disease Assistant:</strong><br>If your crop leaves show yellow spots, rust, or wilting:<br>• For Wheat Rust: Apply Propiconazole 25% EC @ 1ml/Liter water.<br>• For Organic Remedy: Apply Neem Oil (10,000 ppm) @ 3ml/Liter.<br><br>👉 Use our <a href="crop-doctor.html" style="color:#2E7D32; font-weight:700;">AI Crop Doctor to scan your plant leaf →</a>`;
    }

    // Weather
    if (query.includes('weather') || query.includes('rain') || query.includes('temp') || query.includes('forecast') || query.includes('climate')) {
        return `🌤️ <strong>Weather & Farming Advisory:</strong><br>• Temperature: 28°C - 32°C (Optimal for crop growth)<br>• Humidity: 65%<br>• Advisory: Favorable weather for field spraying and irrigation.<br><br>👉 <a href="weather.html" style="color:#2E7D32; font-weight:700;">Check Your City Live Weather Forecast →</a>`;
    }

    // Yield / Profit Calculator
    if (query.includes('yield') || query.includes('calculate') || query.includes('profit') || query.includes('cost') || query.includes('acre')) {
        return `🧮 <strong>Smart Yield & Profit Estimator:</strong><br>Calculate expected crop tonnage, seed cost, fertilizer expense, and net profit per acre before sowing.<br><br>👉 <a href="yield-calculator.html" style="color:#2E7D32; font-weight:700;">Open Yield Calculator Tool →</a>`;
    }

    // Greetings & General Fallback
    if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('hey')) {
        return `Namaste! 🙏 How can I assist your farm today? You can ask me about Mandi prices, crop diseases, fertilizer calculations, or government schemes!`;
    }

    return `I am here to help you with modern farming knowledge! You can ask me about:<br>• 🌾 Current Mandi Rates (Wheat, Mustard, Paddy, Cotton)<br>• 🏛️ Government Subsidies & Schemes (PM-KISAN, PMKSY, KUSUM)<br>• 🐛 Crop Disease Diagnosis & Remedying<br>• 🌤️ Live Weather Forecasts<br><br>Try asking: <em>"What is the price of Wheat today?"</em> or <em>"How to get solar pump subsidy?"</em>`;
}

/* ==========================================
   GLOBAL DARK / LIGHT THEME SYSTEM
========================================== */
function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('grow_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let actionsWrapper = navbar.querySelector('.nav-actions-wrapper');
        const mobileBtn = navbar.querySelector('.mobile-menu-btn');

        if (!actionsWrapper && mobileBtn) {
            actionsWrapper = document.createElement('div');
            actionsWrapper.className = 'nav-actions-wrapper';
            navbar.insertBefore(actionsWrapper, mobileBtn);
            actionsWrapper.appendChild(mobileBtn);
        }

        if (!document.getElementById('theme-toggle-btn')) {
            const btn = document.createElement('button');
            btn.id = 'theme-toggle-btn';
            btn.className = 'theme-toggle-btn';
            btn.setAttribute('aria-label', 'Toggle Theme');
            btn.setAttribute('title', 'Toggle Dark / Light Mode');
            btn.innerHTML = document.body.classList.contains('dark-theme') 
                ? '<i class="fa-solid fa-sun"></i>' 
                : '<i class="fa-solid fa-moon"></i>';
            
            if (actionsWrapper && mobileBtn) {
                actionsWrapper.insertBefore(btn, mobileBtn);
            } else if (actionsWrapper) {
                actionsWrapper.appendChild(btn);
            } else {
                navbar.appendChild(btn);
            }

            btn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-theme');
                localStorage.setItem('grow_theme', isDark ? 'dark' : 'light');
                btn.innerHTML = isDark 
                    ? '<i class="fa-solid fa-sun"></i>' 
                    : '<i class="fa-solid fa-moon"></i>';
                
                showToast(isDark ? 'Dark Mode Activated 🌙' : 'Light Mode Activated ☀️', isDark ? 'fa-moon' : 'fa-sun');
            });
        }
    }
}

/* ==========================================
   GROW MULTI-LANGUAGE TRANSLATION SYSTEM
========================================== */
const GROW_LANGUAGES = [
    // Regional Indian Languages
    { code: 'en', name: 'English', native: 'English', badge: 'EN', category: 'Regional / Primary' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', badge: 'HI', category: 'Regional / Primary' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', badge: 'PA', category: 'Regional / Primary' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', badge: 'MR', category: 'Regional / Primary' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', badge: 'TE', category: 'Regional / Primary' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', badge: 'TA', category: 'Regional / Primary' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', badge: 'GU', category: 'Regional / Primary' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', badge: 'BN', category: 'Regional / Primary' },
    { code: 'kn', name: 'Kannada', native: 'ਕੱਨੜ', badge: 'KN', category: 'Regional / Primary' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', badge: 'ML', category: 'Regional / Primary' },
    { code: 'ur', name: 'Urdu', native: 'اردو', badge: 'UR', category: 'Regional / Primary' },
    // Global Languages
    { code: 'es', name: 'Spanish', native: 'Español', badge: 'ES', category: 'Global' },
    { code: 'fr', name: 'French', native: 'Français', badge: 'FR', category: 'Global' },
    { code: 'de', name: 'German', native: 'Deutsch', badge: 'DE', category: 'Global' },
    { code: 'zh-CN', name: 'Chinese', native: '中文', badge: 'ZH', category: 'Global' },
    { code: 'ar', name: 'Arabic', native: 'العربية', badge: 'AR', category: 'Global' }
];

function initLanguageSwitcher() {
    // 1. Create hidden google translate element container if not present
    if (!document.getElementById('google_translate_element')) {
        const translateContainer = document.createElement('div');
        translateContainer.id = 'google_translate_element';
        translateContainer.style.display = 'none';
        document.body.appendChild(translateContainer);
    }

    // 2. Load Google Translate script dynamically if not present
    if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: GROW_LANGUAGES.map(l => l.code).join(','),
                autoDisplay: false
            }, 'google_translate_element');
        };

        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    // 3. Current active language
    let currentLangCode = localStorage.getItem('grow_selected_lang') || 'en';
    const currentLangObj = GROW_LANGUAGES.find(l => l.code === currentLangCode) || GROW_LANGUAGES[0];

    // 4. Inject language switcher widget into Desktop Navbar
    const navbar = document.querySelector('.navbar');
    let actionsWrapper = navbar ? navbar.querySelector('.nav-actions-wrapper') : null;

    if (navbar && !actionsWrapper) {
        const mobileBtn = navbar.querySelector('.mobile-menu-btn');
        actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'nav-actions-wrapper';
        actionsWrapper.style.display = 'flex';
        actionsWrapper.style.alignItems = 'center';
        actionsWrapper.style.gap = '10px';
        if (mobileBtn) {
            navbar.insertBefore(actionsWrapper, mobileBtn);
            actionsWrapper.appendChild(mobileBtn);
        } else {
            navbar.appendChild(actionsWrapper);
        }
    }

    if (actionsWrapper && !document.getElementById('lang-switcher-container')) {
        const langContainer = document.createElement('div');
        langContainer.id = 'lang-switcher-container';
        langContainer.className = 'lang-switcher-container';

        const regionalLangs = GROW_LANGUAGES.filter(l => l.category.includes('Regional'));
        const globalLangs = GROW_LANGUAGES.filter(l => l.category === 'Global');

        const renderLangOption = (lang) => `
            <div class="lang-option ${lang.code === currentLangCode ? 'selected' : ''}" data-lang="${lang.code}">
                <div class="lang-option-left">
                    <span class="lang-code-badge">${lang.badge}</span>
                    <span class="lang-name-native">${lang.native}</span>
                    <span class="lang-name-en">(${lang.name})</span>
                </div>
                <i class="fa-solid fa-check lang-check"></i>
            </div>
        `;

        langContainer.innerHTML = `
            <button class="lang-switcher-btn" id="lang-switcher-btn" aria-label="Select Language">
                <i class="fa-solid fa-globe lang-icon"></i>
                <span class="lang-code-badge">${currentLangObj.badge}</span>
                <span class="lang-current-name">${currentLangObj.native}</span>
                <i class="fa-solid fa-chevron-down lang-arrow"></i>
            </button>

            <div class="lang-dropdown-menu" id="lang-dropdown-menu">
                <div class="lang-dropdown-header">
                    <span><i class="fa-solid fa-globe"></i> Select Language</span>
                    <span style="font-size:0.75rem; text-transform:none; color:var(--text-muted);">Regional & Global</span>
                </div>
                <div class="lang-search-wrapper">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="lang-search-input" id="lang-search-input" placeholder="Search language...">
                </div>
                <div class="lang-list" id="lang-list">
                    <div class="lang-category-title">Regional Languages (India)</div>
                    ${regionalLangs.map(renderLangOption).join('')}
                    <div class="lang-category-title">Global Languages</div>
                    ${globalLangs.map(renderLangOption).join('')}
                </div>
            </div>
        `;

        // Insert before theme-toggle-btn or mobileBtn
        const themeBtn = document.getElementById('theme-toggle-btn');
        const mobileBtn = actionsWrapper.querySelector('.mobile-menu-btn');
        if (themeBtn) {
            actionsWrapper.insertBefore(langContainer, themeBtn);
        } else if (mobileBtn) {
            actionsWrapper.insertBefore(langContainer, mobileBtn);
        } else {
            actionsWrapper.appendChild(langContainer);
        }

        // Toggle dropdown open/close
        const switcherBtn = langContainer.querySelector('#lang-switcher-btn');
        const searchInput = langContainer.querySelector('#lang-search-input');

        switcherBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langContainer.classList.toggle('open');
            if (isOpen && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!langContainer.contains(e.target)) {
                langContainer.classList.remove('open');
            }
        });

        // Search filter inside dropdown
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const options = langContainer.querySelectorAll('.lang-option');
                options.forEach(opt => {
                    const langCode = opt.getAttribute('data-lang');
                    const langObj = GROW_LANGUAGES.find(l => l.code === langCode);
                    if (langObj) {
                        const match = langObj.name.toLowerCase().includes(term) || 
                                      langObj.native.toLowerCase().includes(term) ||
                                      langObj.badge.toLowerCase().includes(term) ||
                                      langObj.code.toLowerCase().includes(term);
                        opt.style.display = match ? 'flex' : 'none';
                    }
                });
            });
        }

        // Language selection handler
        const options = langContainer.querySelectorAll('.lang-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const langCode = opt.getAttribute('data-lang');
                changeLanguage(langCode);
                langContainer.classList.remove('open');
            });
        });
    }

    // 5. Inject Language chips in Mobile Drawer Navigation if present
    const navMenu = document.querySelector('.nav-links');
    if (navMenu && !navMenu.querySelector('.mobile-lang-section')) {
        const mobileLangSec = document.createElement('li');
        mobileLangSec.className = 'mobile-lang-section';
        
        const topIndianLangs = ['en', 'hi', 'pa', 'mr', 'te', 'ta', 'gu', 'bn'];
        const chipsHTML = topIndianLangs.map(code => {
            const lang = GROW_LANGUAGES.find(l => l.code === code);
            if (!lang) return '';
            return `
                <div class="mobile-lang-chip ${code === currentLangCode ? 'selected' : ''}" data-lang="${code}">
                    <span class="lang-code-badge">${lang.badge}</span> <span>${lang.native}</span>
                </div>
            `;
        }).join('');

        mobileLangSec.innerHTML = `
            <div class="mobile-lang-title">
                <i class="fa-solid fa-globe"></i> Select Language
            </div>
            <div class="mobile-lang-grid">
                ${chipsHTML}
            </div>
        `;

        navMenu.appendChild(mobileLangSec);

        const chips = mobileLangSec.querySelectorAll('.mobile-lang-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const langCode = chip.getAttribute('data-lang');
                changeLanguage(langCode);
            });
        });
    }

    // 6. Suppress Google Top Banner Bar Continuously
    startGoogleTopBarSuppression();
}

// Function to suppress Google Translate Top Banner and body top displacement
function startGoogleTopBarSuppression() {
    function cleanGoogleElements() {
        document.body.style.top = '0px';
        document.body.style.position = 'static';
        document.body.style.marginTop = '0px';

        // Protect footers from being translated across all pages
        document.querySelectorAll('footer').forEach(footer => {
            if (!footer.classList.contains('notranslate')) {
                footer.classList.add('notranslate');
            }
            if (footer.getAttribute('translate') !== 'no') {
                footer.setAttribute('translate', 'no');
            }
        });

        const googleBannerIframes = document.querySelectorAll('iframe.skiptranslate, iframe.goog-te-banner-frame, .goog-te-banner-frame, .VIpgJd-Z44Wfd-O22pSp, .VIpgJd-Z44Wfd-a91sl-OJu2lb');
        googleBannerIframes.forEach(iframe => {
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';
            iframe.style.opacity = '0';
            iframe.style.height = '0px';
            iframe.style.width = '0px';
            iframe.style.pointerEvents = 'none';
        });
    }

    cleanGoogleElements();
    setInterval(cleanGoogleElements, 250);
}

// Global function to trigger Google Translate switch
function changeLanguage(langCode) {
    const prevLang = localStorage.getItem('grow_selected_lang') || 'en';
    localStorage.setItem('grow_selected_lang', langCode);

    const langObj = GROW_LANGUAGES.find(l => l.code === langCode) || GROW_LANGUAGES[0];

    // Set google translate cookie (googtrans=/en/{code}) across domain root
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Dispatch change event to Google translate hidden select if rendered
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change'));
    }

    // Toast notification
    showToast(`Language set to ${langObj.native} (${langObj.name})`, 'fa-globe');

    // Reload page if cookie set needs fresh render
    if (prevLang !== langCode) {
        setTimeout(() => {
            window.location.reload();
        }, 400);
    }
}

/* ==========================================
   GROW GLOBAL INTELLIGENT SEARCH ENGINE
========================================== */
const GROW_SITE_INDEX = [
    {
        title: "Yield Calculator & Profit Estimator",
        url: "yield-calculator.html",
        icon: "fa-calculator",
        category: "Tool / Calculator",
        description: "Calculate expected crop output, input costs, gross income, and net profit before sowing.",
        keywords: ["yield", "calculator", "profit", "yield calculator", "cost", "income", "acres", "quintal", "harvest", "budget", "expenses", "estimation", "crop output"]
    },
    {
        title: "Weather Forecast & Climate Alerts",
        url: "weather.html",
        icon: "fa-cloud-sun-rain",
        category: "Weather Service",
        description: "Real-time weather updates, rainfall predictions, temperature, wind speed, and spray conditions.",
        keywords: ["weather", "forecast", "rain", "rainfall", "temperature", "humidity", "climate", "wind", "monsoon", "weather alerts", "spray conditions", "cloud", "sun"]
    },
    {
        title: "Crop Doctor & AI Disease Detection",
        url: "crop-doctor.html",
        icon: "fa-user-doctor",
        category: "AI Diagnosis",
        description: "Upload or capture crop images for instant AI disease identification, remedies, and treatment.",
        keywords: ["crop doctor", "disease", "pest", "leaf", "fungus", "infection", "remedy", "fertilizer", "treatment", "doctor", "diagnosis", "plant health", "yellowing", "blight", "rust", "camera", "ai"]
    },
    {
        title: "Market Mandi Prices & Trends",
        url: "market.html",
        icon: "fa-chart-line",
        category: "Market Prices",
        description: "Live APMC mandi rates, daily price trends, market demand, and selling insights for all major crops.",
        keywords: ["market", "mandi", "prices", "rate", "mandi bhav", "crop price", "wheat price", "rice price", "cotton price", "trend", "apmc", "trading", "sell", "rates", "bhav"]
    },
    {
        title: "Learning Hub & Government Schemes",
        url: "learning.html",
        icon: "fa-graduation-cap",
        category: "Education & Schemes",
        description: "Agricultural guides, modern farming techniques, organic methods, and government schemes like PM-Kisan.",
        keywords: ["learning", "courses", "articles", "guides", "education", "farming techniques", "organic farming", "schemes", "pm kisan", "government schemes", "soil health", "drip irrigation", "subsidy", "learn"]
    },
    {
        title: "Contact & Farmer Assistance Helpline",
        url: "contact.html",
        icon: "fa-headset",
        category: "Help & Support",
        description: "Get in touch with agriculture experts, ask questions, or access the GROW Kisan Mitra helpline.",
        keywords: ["contact", "help", "support", "phone", "email", "address", "kisan helpline", "community", "expert assistance", "faq", "customer care", "ask", "location"]
    },
    {
        title: "About GROW Platform",
        url: "about.html",
        icon: "fa-seedling",
        category: "About Us",
        description: "Learn about GROW's mission, vision, smart farming operations, and agricultural technology.",
        keywords: ["about", "about us", "mission", "vision", "team", "grow platform", "company", "story", "platform"]
    },
    {
        title: "Home & Managed Active Farms",
        url: "index.html",
        icon: "fa-house",
        category: "Home Page",
        description: "Explore active managed farms, IoT automation, organic crop rotations, and general GROW overview.",
        keywords: ["home", "grow", "farms", "managed farms", "wheat farm", "cotton farm", "iot sensors", "active management", "overview", "index"]
    }
];

function initGlobalSearchEngine() {
    // Only initialize global site navigation search popup on the Home / Index page
    const pagePath = window.location.pathname.toLowerCase();
    const isHomePage = pagePath.endsWith('index.html') || pagePath === '/' || pagePath.endsWith('/') || (!pagePath.includes('.html') && document.querySelector('.hero'));
    
    if (!isHomePage) return;

    const searchBoxes = document.querySelectorAll('.search-box');
    
    searchBoxes.forEach(box => {
        const input = box.querySelector('input');
        const button = box.querySelector('button');
        if (!input) return;

        // Create autocomplete dropdown overlay if not present
        let overlay = box.querySelector('.search-autocomplete-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'search-autocomplete-overlay';
            box.appendChild(overlay);
        }

        let selectedIndex = -1;

        // Perform search query matching
        function performSearch(query) {
            const cleanQuery = query.toLowerCase().trim();
            if (!cleanQuery) {
                overlay.classList.remove('active');
                overlay.innerHTML = '';
                return;
            }

            // Filter site index
            const matches = GROW_SITE_INDEX.filter(item => {
                const inTitle = item.title.toLowerCase().includes(cleanQuery);
                const inDesc = item.description.toLowerCase().includes(cleanQuery);
                const inCat = item.category.toLowerCase().includes(cleanQuery);
                const inKeywords = item.keywords.some(k => k.toLowerCase().includes(cleanQuery));
                return inTitle || inDesc || inCat || inKeywords;
            });

            if (matches.length > 0) {
                // Render matched search results
                overlay.innerHTML = matches.map(item => `
                    <a href="${item.url}" class="search-result-item" data-url="${item.url}">
                        <div class="search-result-icon">
                            <i class="fa-solid ${item.icon}"></i>
                        </div>
                        <div class="search-result-content">
                            <div class="search-result-header">
                                <span class="search-result-title">${item.title}</span>
                                <span class="search-result-badge">${item.category}</span>
                            </div>
                            <div class="search-result-desc">${item.description}</div>
                        </div>
                    </a>
                `).join('');
                overlay.classList.add('active');
            } else {
                // No results match - display feedback & suggestions
                const popularFeatures = GROW_SITE_INDEX.slice(0, 6);
                overlay.innerHTML = `
                    <div class="search-no-results-card">
                        <div class="search-no-results-icon">
                            <i class="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div class="search-no-results-title">No page found for "${escapeHTML(query)}"</div>
                        <div class="search-no-results-msg">The item or topic you searched is not available on our website.</div>
                        <div class="search-suggestions-title">Try our available features on GROW:</div>
                        <div class="search-suggestions-chips">
                            ${popularFeatures.map(f => `
                                <a href="${f.url}" class="search-chip">
                                    <i class="fa-solid ${f.icon}"></i> ${f.title.split('&')[0].trim()}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
                overlay.classList.add('active');
            }
            selectedIndex = -1;
        }

        // Event handler for typing in search input
        input.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        // Focus event
        input.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                performSearch(e.target.value);
            }
        });

        // Keydown handling for Enter & Arrow Navigation
        input.addEventListener('keydown', (e) => {
            const items = overlay.querySelectorAll('.search-result-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (items.length > 0) {
                    selectedIndex = (selectedIndex + 1) % items.length;
                    updateItemFocus(items);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (items.length > 0) {
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    updateItemFocus(items);
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    window.location.href = items[selectedIndex].getAttribute('data-url');
                } else if (items.length > 0) {
                    // Navigate to top match
                    window.location.href = items[0].getAttribute('data-url');
                } else {
                    performSearch(input.value);
                }
            } else if (e.key === 'Escape') {
                overlay.classList.remove('active');
            }
        });

        function updateItemFocus(items) {
            items.forEach((it, idx) => {
                if (idx === selectedIndex) {
                    it.classList.add('focused');
                    it.scrollIntoView({ block: 'nearest' });
                } else {
                    it.classList.remove('focused');
                }
            });
        }

        // Button click handler
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const query = input.value.trim();
                if (!query) return;
                const matches = GROW_SITE_INDEX.filter(item => {
                    const clean = query.toLowerCase();
                    return item.title.toLowerCase().includes(clean) ||
                           item.description.toLowerCase().includes(clean) ||
                           item.category.toLowerCase().includes(clean) ||
                           item.keywords.some(k => k.toLowerCase().includes(clean));
                });
                if (matches.length > 0) {
                    window.location.href = matches[0].url;
                } else {
                    performSearch(query);
                }
            });
        }

        // Close overlay on outside click
        document.addEventListener('click', (e) => {
            if (!box.contains(e.target)) {
                overlay.classList.remove('active');
            }
        });
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
