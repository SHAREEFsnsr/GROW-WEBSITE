/* ==========================================
   GROW PLATFORM - CORE JAVASCRIPT
========================================== */

document.addEventListener('DOMContentLoaded', () => {
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

    // 3. Search Box Interactivity (Home & Header)
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    window.location.href = `crops.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });

    const searchBtns = document.querySelectorAll('.search-box button');
    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input && input.value.trim()) {
                window.location.href = `crops.html?search=${encodeURIComponent(input.value.trim())}`;
            }
        });
    });

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
