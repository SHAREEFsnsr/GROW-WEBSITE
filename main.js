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
                                <span class="grow-chat-status-dot"></span> Online • 24/7 Agriculture Expert
                            </div>
                        </div>
                    </div>
                    <div class="grow-chat-header-actions">
                        <button id="grow-chat-close-btn" class="chat-header-btn" aria-label="Close Chat"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>

                <div id="grow-chat-body" class="grow-chat-body">
                    <div class="chat-msg bot-msg">
                        <div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>
                        <div>
                            <div class="chat-msg-bubble">
                                Namaste! 🙏 I am <strong>Kisan Mitra AI</strong>, your 24/7 agriculture expert. Ask me anything about soils, fertilizers, crop cultivation, pest management, weather, government schemes, or Mandi rates!
                            </div>
                            <div class="chat-quick-prompts">
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('Tell me about soils and soil health')">🌱 Soil Health & Types</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('What is optimal NPK fertilizer dosage?')">🧪 Fertilizer & NPK</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('What are current Mandi rates for Wheat?')">🌾 Wheat Mandi Rates</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('How to apply for PM-KISAN subsidy?')">🏛️ PM-KISAN Subsidy</button>
                                <button class="chat-prompt-chip" onclick="sendQuickPrompt('How to treat Yellow Rust in Wheat?')">🐛 Crop Disease Remedy</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grow-chat-footer">
                    <input type="text" id="grow-chat-input" placeholder="Ask any question about agriculture, soils, crops..." onkeypress="handleChatKeyPress(event)">
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

async function sendChatMessage() {
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

    // 3. Process AI Response
    try {
        const botReply = await generateAIResponseAsync(query);
        const typingElem = document.getElementById(typingId);
        if (typingElem) typingElem.remove();

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
    } catch (err) {
        const typingElem = document.getElementById(typingId);
        if (typingElem) typingElem.remove();

        const botReply = localAgriKnowledgeEngine(query);
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
    }
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function generateAIResponseAsync(query) {
    const savedKey = localStorage.getItem('grow_chat_api_key') || '';
    const provider = localStorage.getItem('grow_chat_provider') || 'auto';

    // 1. Try Gemini 1.5 Flash if key provided or selected
    if ((provider === 'gemini' || provider === 'auto') && savedKey.startsWith('AIza')) {
        try {
            const geminiRes = await callGeminiTextAI(query, savedKey);
            if (geminiRes) return geminiRes + `<br><span style="display:inline-block; margin-top:6px; font-size:0.7rem; color:#888; background:#e8f5e9; padding:2px 8px; border-radius:10px;">⚡ Powered by Google Gemini 1.5 AI</span>`;
        } catch (e) {
            console.warn('Gemini AI failed, using fallback:', e);
        }
    }

    // 2. Try Hugging Face Router if key provided or selected
    if ((provider === 'huggingface' || provider === 'auto') && savedKey.startsWith('hf_')) {
        try {
            const hfRes = await callHuggingFaceTextAI(query, savedKey);
            if (hfRes) return hfRes + `<br><span style="display:inline-block; margin-top:6px; font-size:0.7rem; color:#888; background:#e8f5e9; padding:2px 8px; border-radius:10px;">🤗 Powered by Hugging Face AI</span>`;
        } catch (e) {
            console.warn('Hugging Face AI failed, using fallback:', e);
        }
    }

    // 3. High-Performance Local Agriculture Knowledge Engine
    const localRes = localAgriKnowledgeEngine(query);
    return localRes + `<br><span style="display:inline-block; margin-top:6px; font-size:0.7rem; color:#888; background:#e8f5e9; padding:2px 8px; border-radius:10px;">🌾 Powered by GROW Agricultural Knowledge Engine</span>`;
}

async function callGeminiTextAI(userPrompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemInstruction = "You are Kisan Mitra AI, an expert agricultural advisor and agronomist for farmers. Provide concise, clear, practical advice about farming, soil health, fertilizers, crop diseases, pest remedies, mandi prices, weather advisories, irrigation, seed selection, and Indian government agriculture schemes. Use markdown formatting with bullet points and bold text for easy reading.";
    
    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response text from Gemini");

    return formatMarkdownToHTML(text);
}

async function callHuggingFaceTextAI(userPrompt, apiKey) {
    const endpoint = `https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3`;
    const prompt = `<s>[INST] You are Kisan Mitra AI, an expert agricultural advisor. Answer the farmer's question accurately with practical farming advice:\nQuestion: ${userPrompt} [/INST]`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.5 } })
    });

    if (!response.ok) throw new Error(`HF API Error: ${response.status}`);
    const data = await response.json();
    let text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    if (!text) throw new Error("No text from Hugging Face model");

    if (text.includes('[/INST]')) {
        text = text.split('[/INST]')[1].trim();
    }
    return formatMarkdownToHTML(text);
}

function formatMarkdownToHTML(md) {
    let html = md
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gim, '<strong style="color:#1B5E20; display:block; margin-top:6px;">$1</strong>')
        .replace(/^## (.*$)/gim, '<strong style="color:#1B5E20; display:block; margin-top:6px;">$1</strong>')
        .replace(/^\* (.*$)/gim, '• $1')
        .replace(/^- (.*$)/gim, '• $1')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    return html;
}

/* ==========================================
   COMPREHENSIVE LOCAL AGRICULTURAL KNOWLEDGE ENGINE
========================================== */
function localAgriKnowledgeEngine(q) {
    const raw = q.trim();
    const query = raw.toLowerCase();

    // 0. GREETINGS & METADATA
    if (query.match(/^(hi|hello|hey|namaste|ram ram|pranam|good morning|good afternoon|good evening)\b/i) || query === 'hi' || query === 'hello' || query === 'hey' || query === 'namaste') {
        return `🙏 <strong>Namaste! Welcome to Kisan Mitra AI</strong><br><br>` +
            `I am your 24/7 intelligent agriculture assistant. How can I help you today?<br><br>` +
            `• 🌾 <strong>Crop Cultivation:</strong> Wheat, Paddy, Sugarcane, Cotton, Mustard, Tomato, Potato, Onion, etc.<br>` +
            `• 🐛 <strong>Pest & Disease Doctor:</strong> Symptoms, organic remedies, and precise fungicide/insecticide dosages.<br>` +
            `• 🧪 <strong>Soil & Fertilizers:</strong> NPK dosages, soil testing, pH correction & organic manure.<br>` +
            `• 🏛️ <strong>Government Schemes:</strong> PM-KISAN, KCC (4% loan), PM-KUSUM solar pump, PMKSY drip subsidy.<br>` +
            `• 📈 <strong>Mandi Rates:</strong> Live prices and MSP for all major crops.<br><br>` +
            `<em>Ask me any specific question like <strong>"How to treat yellow rust in wheat?"</strong> or <strong>"How to apply for PM-KISAN?"</strong></em>`;
    }

    if (query.includes('who are you') || query.includes('your name') || query.includes('what can you do') || query.includes('about you') || query.includes('kisan ai')) {
        return `🤖 <strong>I am Kisan Mitra AI</strong> — your dedicated 24/7 digital agronomist and farming advisor!<br><br>` +
            `I am trained on extensive agricultural research, agronomy practices, soil chemistry, plant pathology, market pricing, and government schemes.<br><br>` +
            `Feel free to ask me questions in English or simple phrasing about your farm, crops, diseases, fertilizers, or government assistance!`;
    }

    if (query.includes('thank') || query.includes('dhanyawad') || query.includes('shukriya') || query.includes('thanks') || query.includes('great service')) {
        return `💚 <strong>You are very welcome!</strong><br><br>` +
            `Wishing you a bountiful harvest and prosperous farming season! 🌾 Reach out anytime if you have more questions about your crops or farm.`;
    }

    // Helper flags for topic identification
    const isDiseaseQuery = query.includes('disease') || query.includes('pest') || query.includes('fungus') || query.includes('blight') || query.includes('rust') || query.includes('rot') || query.includes('curl') || query.includes('wilt') || query.includes('spot') || query.includes('blast') || query.includes('whitefly') || query.includes('aphid') || query.includes('thrip') || query.includes('worm') || query.includes('borer') || query.includes('insect') || query.includes('caterpillar') || query.includes('spray') || query.includes('pesticide') || query.includes('fungicide') || query.includes('insecticide');
    
    const isFertilizerQuery = query.includes('fertilizer') || query.includes('fertiliser') || query.includes('npk') || query.includes('urea') || query.includes('dap') || query.includes('mop') || query.includes('nitrogen') || query.includes('phosphorus') || query.includes('potassium') || query.includes('zinc') || query.includes('sulphur') || query.includes('khaad') || query.includes('dosage') || query.includes('nutrient');
    
    const isIrrigationQuery = query.includes('water') || query.includes('irrigation') || query.includes('drip') || query.includes('sprinkler') || query.includes('borewell') || query.includes('watering');
    
    const isMandiQuery = query.includes('mandi') || query.includes('price') || query.includes('rate') || query.includes('bhav') || query.includes('msp') || query.includes('market') || query.includes('sell');

    // 1. SPECIFIC GOVERNMENT SCHEMES & SUBSIDIES
    if (query.includes('pm-kisan') || query.includes('pm kisan') || (query.includes('kisan') && query.includes('scheme')) || (query.includes('6000') || query.includes('2000'))) {
        return `🏛️ <strong>PM-KISAN Samman Nidhi Yojana Guide:</strong><br><br>` +
            `• <strong>Financial Benefit:</strong> <strong>₹6,000 per year</strong> provided in 3 equal installments of ₹2,000 directly into the farmer's bank account via DBT.<br>` +
            `• <strong>Eligibility:</strong> All landholding farmer families with cultivable land.<br>` +
            `• <strong>Documents Needed:</strong> Aadhaar Card, Land Record (Khatauni / 7-12), Bank Passbook (linked to Aadhaar), and Mobile Number.<br>` +
            `• <strong>How to Apply:</strong><br>` +
            `  1. Visit the official portal <a href="https://pmkisan.gov.in" target="_blank" style="color:#2E7D32; font-weight:700;">pmkisan.gov.in</a>.<br>` +
            `  2. Click on <strong>'New Farmer Registration'</strong>.<br>` +
            `  3. Complete your mandatory OTP or biometric e-KYC.<br>` +
            `👉 <a href="learning.html" style="color:#2E7D32; font-weight:700;">View Government Subsidies Portal →</a>`;
    }

    if (query.includes('kcc') || query.includes('credit card') || query.includes('loan') || query.includes('interest rate') || query.includes('bank loan')) {
        return `💳 <strong>Kisan Credit Card (KCC) Loan Scheme:</strong><br><br>` +
            `• <strong>Low Interest Rate:</strong> Effective interest rate of just <strong>4% per annum</strong> (Standard 7% minus 3% prompt repayment incentive).<br>` +
            `• <strong>Collateral-Free Limit:</strong> Farm loans up to <strong>₹1.60 Lakh</strong> require NO security/collateral. Maximum credit limit up to ₹3.0 Lakh.<br>` +
            `• <strong>Coverage:</strong> Covers crop cultivation expenses, post-harvest costs, farm maintenance, and allied activities (Dairy/Poultry/Fisheries).<br>` +
            `• <strong>How to Apply:</strong> Submit the 1-page KCC application form at your local commercial bank, RRB, or Co-operative bank along with land records and Aadhaar card.`;
    }

    if (query.includes('kusum') || query.includes('solar') || query.includes('solar pump') || query.includes('pump subsidy')) {
        return `☀️ <strong>PM-KUSUM Solar Water Pump Scheme:</strong><br><br>` +
            `• <strong>Subsidy Percentage:</strong> Combined Government Subsidy up to <strong>90%</strong> (30% Central + 30% State + 30% Bank Loan). The farmer pays only <strong>10% upfront</strong>!<br>` +
            `• <strong>Components:</strong> Standalone Solar Agriculture Pumps (3 HP to 10 HP) and solarization of existing grid-connected pumps.<br>` +
            `• <strong>Extra Income:</strong> Farmers can sell excess solar electricity back to DISCOM power grids for additional annual income.<br>` +
            `• <strong>Application:</strong> Apply through your state energy development agency portal (e.g. HAREDA, MEDA, UPNEDA).`;
    }

    if (query.includes('pmksy') || (query.includes('drip') && query.includes('subsidy')) || (query.includes('sprinkler') && query.includes('subsidy'))) {
        return `💧 <strong>PMKSY Micro-Irrigation Subsidy Scheme:</strong><br><br>` +
            `• <strong>Financial Assistance:</strong> Up to <strong>80% subsidy</strong> for small and marginal farmers (55% Central/State + additional state incentives).<br>` +
            `• <strong>Supported Systems:</strong> Drip Irrigation systems (for Sugarcane, Vegetables, Orchards) and Sprinkler Irrigation systems (for Wheat, Mustard, Pulses).<br>` +
            `• <strong>Benefits:</strong> Saves up to 50% irrigation water, reduces weed growth, and increases crop yield by 20-30%.<br>` +
            `• <strong>Application:</strong> Apply via your District Horticulture / Agriculture Office or state micro-irrigation portal.`;
    }

    if (query.includes('pmfby') || query.includes('insurance') || query.includes('crop insurance') || query.includes('claim')) {
        return `🛡️ <strong>PMFBY (Pradhan Mantri Fasal Bima Yojana) Crop Insurance:</strong><br><br>` +
            `• <strong>Ultra-Low Premium:</strong><br>` +
            `  - Kharif Crops: Only <strong>2.0%</strong> of sum insured.<br>` +
            `  - Rabi Crops: Only <strong>1.5%</strong> of sum insured.<br>` +
            `  - Commercial/Horticulture Crops: Only <strong>5.0%</strong>.<br>` +
            `• <strong>Coverage:</strong> Comprehensive risk cover for unpreventable natural risks (Drought, Flood, Pest attack, Hailstorm, Inundation).<br>` +
            `• <strong>Claim Reporting:</strong> Intimate loss within <strong>72 hours</strong> of localized calamity via PMFBY App or toll-free number 14447.<br>` +
            `👉 <a href="https://pmfby.gov.in" target="_blank" style="color:#2E7D32; font-weight:700;">Visit Official PMFBY Insurance Portal →</a>`;
    }

    if (query.includes('enam') || (query.includes('sell') && query.includes('online')) || query.includes('national agriculture market')) {
        return `🌐 <strong>eNAM (Electronic National Agriculture Market):</strong><br><br>` +
            `• <strong>Direct Mandi Access:</strong> Pan-India electronic trading portal networking over 1,360+ Mandis across India.<br>` +
            `• <strong>Benefits:</strong> Transparent price discovery based on actual quality testing, direct online payment to bank account, zero middleman exploitation.<br>` +
            `• <strong>How to Register:</strong> Register free on <a href="https://www.enam.gov.in" target="_blank" style="color:#2E7D32; font-weight:700;">enam.gov.in</a> or visit your nearest eNAM-linked Mandi with Aadhaar and Bank Passbook.`;
    }

    if (query.includes('scheme') || query.includes('subsidy') || query.includes('gov') || query.includes('sarkar') || query.includes('yojana')) {
        return `🏛️ <strong>Comprehensive Indian Agriculture Schemes Overview:</strong><br><br>` +
            `1. <strong>PM-KISAN:</strong> ₹6,000 / year direct cash transfer in 3 installments.<br>` +
            `2. <strong>Kisan Credit Card (KCC):</strong> Concessional farm loan up to ₹3 Lakh at <strong>4% interest rate</strong>.<br>` +
            `3. <strong>PM-KUSUM:</strong> 90% subsidy on Solar Water Pumps.<br>` +
            `4. <strong>PMKSY:</strong> 80% grant on Drip & Sprinkler Micro-irrigation.<br>` +
            `5. <strong>PMFBY:</strong> Comprehensive Crop Insurance at 1.5% - 2% premium.<br>` +
            `6. <strong>SMAM Scheme:</strong> 40-50% subsidy on Tractors, Drones, & Machinery.<br>` +
            `👉 <a href="learning.html" style="color:#2E7D32; font-weight:700;">Explore All Schemes & Forms on GROW Learning Portal →</a>`;
    }

    // 2. SPECIFIC CROP ADVISORY & TARGETED INTENT

    // WHEAT / GEHUN
    if (query.includes('wheat') || query.includes('gehun') || query.includes('gehu')) {
        if (isDiseaseQuery || query.includes('rust') || query.includes('yellow')) {
            return `🌾 <strong>Wheat Disease & Pest Doctor:</strong><br><br>` +
                `• <strong>Yellow Stripe Rust (Puccinia striiformis):</strong> Bright yellow powder stripes on leaves. Spreads rapidly in cool weather.<br>` +
                `  - <em>Chemical Remedy:</em> Spray <strong>Propiconazole 25% EC @ 1 ml/Liter water</strong> (200 ml/acre) at first sign.<br>` +
                `  - <em>Alternative:</em> Tebuconazole 25.9% EC @ 1 ml/L.<br>` +
                `• <strong>Loose Smut:</strong> Black powdery heads.<br>` +
                `  - <em>Treatment:</em> Seed treatment with Carboxin 75% WP @ 2.5g/kg seed before sowing.<br>` +
                `• <strong>Resistant Varieties:</strong> HD-2967, DBW-187 (Karan Vandana), PBW-725.`;
        }
        if (isFertilizerQuery || query.includes('npk')) {
            return `🌾 <strong>Wheat NPK & Fertilizer Schedule (Per Acre):</strong><br><br>` +
                `• <strong>Basal Dose (At Sowing):</strong> 1 Bag DAP (50kg) + 1/2 Bag MOP (25kg) + 10kg Zinc Sulphate 21%.<br>` +
                `• <strong>First Top Dressing (21 days after sowing - CRI Stage):</strong> 1 Bag Neem Coated Urea (45kg).<br>` +
                `• <strong>Second Top Dressing (40-45 days after sowing):</strong> 1 Bag Neem Coated Urea (45kg).<br>` +
                `• <strong>Foliar Spray (Flowering Stage):</strong> NPK 13-0-45 @ 1kg/acre in 150L water for plumper grains.`;
        }
        if (isMandiQuery) {
            const ca = window.cropsAnalytics;
            const rate = ca && ca.wheat ? ca.wheat.modalRate : 2285;
            return `🌾 <strong>Wheat (Gehun) Mandi Rate & MSP:</strong><br><br>` +
                `• <strong>Current Market Rate:</strong> ₹ <strong>${rate.toLocaleString()}</strong> / Quintal<br>` +
                `• <strong>Government MSP:</strong> ₹ 2,275 / Quintal<br>` +
                `👉 <a href="market.html" style="color:#2E7D32; font-weight:700;">Check Live Mandi Prices & Local Market Trends →</a>`;
        }
        return `🌾 <strong>Wheat (Gehun) Complete Cultivation Practices:</strong><br><br>` +
            `• <strong>Best Sowing Window:</strong> Nov 1 to Nov 20.<br>` +
            `• <strong>Seed Rate:</strong> 40 kg/acre (Treat seed with Trichoderma @ 5g/kg).<br>` +
            `• <strong>Top High-Yield Varieties:</strong> HD 2967, DBW 187 (Karan Vandana), PBW 725, HD 3086.<br>` +
            `• <strong>Irrigation (5-6 Waterings):</strong> Crown Root Initiation (21 days after sowing) is most critical!<br>` +
            `• <strong>Expected Yield:</strong> 20 - 25 Quintal / Acre.`;
    }

    // PADDY / RICE / DHAN / BASMATI
    if (query.includes('rice') || query.includes('paddy') || query.includes('dhan') || query.includes('basmati')) {
        if (isDiseaseQuery || query.includes('blast') || query.includes('blight') || query.includes('borer')) {
            return `🌾 <strong>Paddy Disease & Pest Management:</strong><br><br>` +
                `• <strong>Rice Leaf & Neck Blast (Magnaporthe oryzae):</strong> Spindle-shaped lesions with grey centers.<br>` +
                `  - <em>Remedy:</em> Spray <strong>Tricyclazole 75% WP @ 0.6g/Liter water</strong> or Isoprothiolane 40% EC @ 1.5 ml/L.<br>` +
                `• <strong>Bacterial Leaf Blight:</strong> Yellowish-white waving lesions starting from leaf tips.<br>` +
                `  - <em>Remedy:</em> Spray Streptocycline @ 6g + Copper Oxychloride @ 300g per acre in 150L water.<br>` +
                `• <strong>Stem Borer / Leaf Folder:</strong><br>` +
                `  - <em>Remedy:</em> Apply Cartap Hydrochloride 4G @ 7.5 kg/acre or Chlorantraniliprole 18.5% SC @ 60 ml/acre.`;
        }
        if (isFertilizerQuery) {
            return `🌾 <strong>Paddy / Basmati Fertilizer Schedule (Per Acre):</strong><br><br>` +
                `• <strong>Basal Dose (At Transplanting):</strong> 1 Bag DAP (50kg) + 1/2 Bag MOP (25kg) + 10kg Zinc Sulphate 21%.<br>` +
                `• <strong>1st Top Dress (20 days after transplanting):</strong> 1 Bag Neem Coated Urea (45kg).<br>` +
                `• <strong>2nd Top Dress (40 days after transplanting):</strong> 1 Bag Neem Coated Urea (45kg).<br>` +
                `• <em>Pro Tip: Zinc deficiency causes 'Khaira' disease (brown spots on young leaves). Always apply Zinc Sulphate!</em>`;
        }
        if (isMandiQuery) {
            const ca = window.cropsAnalytics;
            const rate = ca && ca.paddy ? ca.paddy.modalRate : 4500;
            return `🌾 <strong>Paddy / Basmati Mandi Rates:</strong><br><br>` +
                `• <strong>Basmati Rice Rate:</strong> ₹ <strong>${rate.toLocaleString()}</strong> / Quintal<br>` +
                `• <strong>Common Paddy MSP:</strong> ₹ 2,183 / Quintal<br>` +
                `👉 <a href="market.html" style="color:#2E7D32; font-weight:700;">View Real-time Mandi Rates →</a>`;
        }
        return `🌾 <strong>Paddy / Basmati Cultivation Guide:</strong><br><br>` +
            `• <strong>Nursery Sowing:</strong> May 15 to June 15.<br>` +
            `• <strong>Transplanting:</strong> 25-30 days old seedlings (2-3 seedlings per hill at 20x15cm spacing).<br>` +
            `• <strong>Top Varieties:</strong> Pusa Basmati 1121, Pusa Basmati 1509, PR 126, MTU 1010.<br>` +
            `• <strong>Water Management:</strong> Maintain 2-5 cm standing water during tillering and panicle stage.<br>` +
            `• <strong>Expected Yield:</strong> 22 - 30 Quintal / Acre.`;
    }

    // SUGARCANE / GANNA
    if (query.includes('sugarcane') || query.includes('ganna')) {
        if (isDiseaseQuery || query.includes('red rot') || query.includes('borer')) {
            return `🎋 <strong>Sugarcane Disease & Pest Control:</strong><br><br>` +
                `• <strong>Red Rot (Colletotrichum falcatum) - The Cancer of Sugarcane:</strong> Leaves turn yellow, inner stalk shows reddening with white cross bands and sour alcohol smell.<br>` +
                `  - <em>Prevention/Control:</em> Treat seed setts with hot water @ 52°C for 30 mins or moist hot air. Soil drench Trichoderma viride. Remove and burn infected clumps immediately.<br>` +
                `• <strong>Early Shoot Borer / Top Borer:</strong><br>` +
                `  - <em>Remedy:</em> Apply Chlorantraniliprole 0.4% GR @ 7.5 kg/acre or Cartap 4G @ 10 kg/acre at 30-45 days.`;
        }
        return `🎋 <strong>Sugarcane (Ganna) High-Yield Cultivation:</strong><br><br>` +
            `• <strong>Sowing Season:</strong> Autumn (Oct-Nov) or Spring (Feb-March).<br>` +
            `• <strong>Seed Setts Rate:</strong> 35,000 - 40,000 two-budded setts/acre (Spacing 4 feet between trench rows).<br>` +
            `• <strong>Top High Sugar Varieties:</strong> Co 0238, Co 15023, Co 86032, Co 0118.<br>` +
            `• <strong>Fertilizer per Acre:</strong> 2 Bags DAP + 3 Bags Urea (split in 3 doses) + 1 Bag MOP + 20kg Zinc.<br>` +
            `• <strong>Irrigation:</strong> Drip fertigation saves 45% water and increases cane girth and length significantly!`;
    }

    // COTTON / KAPAS
    if (query.includes('cotton') || query.includes('kapas')) {
        if (isDiseaseQuery || query.includes('bollworm') || query.includes('whitefly')) {
            return `⚪ <strong>Cotton Pest Management Guide:</strong><br><br>` +
                `• <strong>Pink Bollworm (Pectinophora gossypiella):</strong> Larvae bore into bolls causing premature opening.<br>` +
                `  - <em>Management:</em> Install 5 Pheromone Traps/acre for monitoring. Spray Profenofos 50% EC @ 2ml/L or Emamectin Benzoate @ 0.4g/L.<br>` +
                `• <strong>Whitefly & Sucking Pests:</strong><br>` +
                `  - <em>Remedy:</em> Spray Flonicamid 50% WG @ 60g/acre or Pyriproxyfen 10% EC @ 2 ml/L. Hang 10 Yellow Sticky Traps/acre.`;
        }
        return `⚪ <strong>Bt Cotton Cultivation Guide:</strong><br><br>` +
            `• <strong>Sowing Season:</strong> April to May (Kharif).<br>` +
            `• <strong>Seed Rate:</strong> 1.5 to 2 packets Bt Cotton per acre (Spacing 3x1.5 feet).<br>` +
            `• <strong>Fertilizer per Acre:</strong> 1 Bag DAP + 2 Bags Urea + 1/2 Bag MOP + 10kg Magnesium Sulphate.<br>` +
            `• <strong>Yield:</strong> 10 - 15 Quintal / Acre.`;
    }

    // MUSTARD / SARSON
    if (query.includes('mustard') || query.includes('sarson')) {
        if (isDiseaseQuery || query.includes('aphid') || query.includes('chepa') || query.includes('blight')) {
            return `🟡 <strong>Mustard Pest & Disease Doctor:</strong><br><br>` +
                `• <strong>Mustard Aphids (Chepa/Mahu):</strong> Small green/black insects sucking sap from flowering buds.<br>` +
                `  - <em>Remedy:</em> Spray Dimethoate 30% EC @ 1.7 ml/L or Imidacloprid 17.8% SL @ 0.5 ml/L during evening.<br>` +
                `• <strong>Alternaria Blight / White Rust:</strong><br>` +
                `  - <em>Remedy:</em> Spray Mancozeb 75% WP @ 2g/L or Copper Oxychloride @ 3g/L.`;
        }
        return `🟡 <strong>Mustard (Sarson) High-Yield Guide:</strong><br><br>` +
            `• <strong>Sowing Window:</strong> Oct 25 to Nov 10.<br>` +
            `• <strong>Seed Rate:</strong> 1.5 to 2.0 kg/acre.<br>` +
            `• <strong>Top Varieties:</strong> RH 749, Pioneer 45S46, Giriraj, Pusa Mustard 30.<br>` +
            `• <strong>Key Oil Secret:</strong> Apply <strong>Bentonite Sulphur @ 10kg/acre</strong> at sowing to boost oil content up to 42%.<br>` +
            `• <strong>Irrigation:</strong> 2 waterings (30 days after sowing & flowering stage).`;
    }

    // TOMATO / TAMATAR
    if (query.includes('tomato') || query.includes('tamatar')) {
        if (isDiseaseQuery || query.includes('blight') || query.includes('curl')) {
            return `🍅 <strong>Tomato Disease Protection:</strong><br><br>` +
                `• <strong>Early & Late Blight (Alternaria / Phytophthora):</strong> Dark brown spots with concentric rings.<br>` +
                `  - <em>Remedy:</em> Spray <strong>Mancozeb 75% WP @ 2.5g/Liter</strong> or Copper Oxychloride @ 3g/L. For severe late blight, use Cymoxanil + Mancozeb @ 2g/L.<br>` +
                `• <strong>Tomato Leaf Curl Virus (spread by Whiteflies):</strong> Stunted leaves curling upwards.<br>` +
                `  - <em>Control Whitefly:</em> Spray Acetamiprid 20% SP @ 0.5g/L + install yellow sticky traps.`;
        }
        return `🍅 <strong>Tomato Cultivation Package of Practices:</strong><br><br>` +
            `• <strong>Soil & Climate:</strong> Well-drained sandy loam soil with pH 6.0 - 7.0.<br>` +
            `• <strong>Top Hybrids:</strong> Arka Rakshak, Abhinav, Heemsena, US-1505.<br>` +
            `• <strong>Staking Practice:</strong> Support plants with bamboo sticks and wire after 30 days for 40% higher marketable yield and clean fruits!<br>` +
            `• <strong>Yield:</strong> 20 - 30 Tonnes / Acre.`;
    }

    // POTATO / AALU
    if (query.includes('potato') || query.includes('aalu') || query.includes('alu')) {
        if (isDiseaseQuery || query.includes('blight')) {
            return `🥔 <strong>Potato Late Blight Emergency Advisory:</strong><br><br>` +
                `• <strong>Late Blight (Phytophthora infestans):</strong> Water-soaked dark lesions on leaf tips turning black rapidly with white mold under humid conditions.<br>` +
                `  - <em>Protective Spray:</em> Mancozeb 75% WP @ 2.5g/L.<br>` +
                `  - <em>Curative Spray:</em> <strong>Cymoxanil 8% + Mancozeb 64% WP @ 2g/L</strong> or Dimethomorph 50% WP @ 1g/L.<br>` +
                `  - <em>Action:</em> Destroy infected haulms 10 days before harvesting.`;
        }
        return `🥔 <strong>Potato Cultivation Guide:</strong><br><br>` +
            `• <strong>Sowing Window:</strong> Oct 15 to Nov 15.<br>` +
            `• <strong>Seed Tuber Rate:</strong> 12 - 15 Quintal tubers/acre (Spacing 50x20 cm).<br>` +
            `• <strong>Top Varieties:</strong> Kufri Pukhraj, Kufri Jyoti, Kufri Bahar, Kufri Chipsona.<br>` +
            `• <strong>Earthing Up:</strong> Perform earthing up 30 days after planting to protect tubers from sunlight and greening.`;
    }

    // ONION / PYAAZ & GARLIC / LAHSUN
    if (query.includes('onion') || query.includes('pyaaz') || query.includes('pyaj') || query.includes('garlic') || query.includes('lahsun')) {
        return `🧅 <strong>Onion & Garlic Cultivation & Protection:</strong><br><br>` +
            `• <strong>Thrips & Purple Blotch Control:</strong><br>` +
            `  - <em>Thrips (Silvery streaks on leaves):</em> Spray Fipronil 5% SC @ 2 ml/L or Cyantraniliprole 10.26% OD @ 1.2 ml/L.<br>` +
            `  - <em>Purple Blotch (Purple lesions):</em> Spray Mancozeb 75% WP @ 2.5g/L + 1 ml liquid sticker.<br>` +
            `• <strong>Fertilizer per Acre:</strong> 1 Bag DAP + 1.5 Bags Urea + 1/2 Bag MOP + 10kg Sulphur.`;
    }

    // MAIZE / CORN / MAKKA
    if (query.includes('maize') || query.includes('corn') || query.includes('makka')) {
        return `🌽 <strong>Maize (Makka) Cultivation & Fall Armyworm Control:</strong><br><br>` +
            `• <strong>Fall Armyworm (FAW) Emergency Control:</strong> Caterpillars feeding inside central leaf whorls.<br>` +
            `  - <em>Remedy:</em> Spray <strong>Emamectin Benzoate 5% SG @ 0.4g/L</strong> or Chlorantraniliprole 18.5% SC @ 0.4ml/L directly into leaf whorls.<br>` +
            `• <strong>High-Yield Hybrids:</strong> Pioneer 3396, Dekalb 9108, Bio 9681.<br>` +
            `• <strong>Fertilizer:</strong> 1 Bag DAP + 2 Bags Urea + 25kg MOP per acre.`;
    }

    // SOYBEAN & PULSES (GRAM/CHANA, LENTIL)
    if (query.includes('soybean') || query.includes('chana') || query.includes('gram') || query.includes('pulse') || query.includes('dal')) {
        return `🫘 <strong>Pulses & Soybean Cultivation Practices:</strong><br><br>` +
            `• <strong>Seed Inoculation:</strong> Treat seeds with <strong>Rhizobium Culture + PSB @ 10g/kg seed</strong> to fix atmospheric Nitrogen naturally.<br>` +
            `• <strong>Fertilizer Balance:</strong> Pulses need lower Nitrogen (1:2:1 ratio). Apply 1 Bag NPK 12:32:16 + 10kg Sulphur per acre.<br>` +
            `• <strong>Pod Borer Control:</strong> Spray Indoxacarb 14.5% SC @ 1 ml/L or Chlorantraniliprole @ 0.3 ml/L at flowering/pod formation.`;
    }

    // OTHER FRUITS (BANANA, MANGO, APPLE, CHILLI)
    if (query.includes('banana') || query.includes('kela') || query.includes('mango') || query.includes('aam') || query.includes('chilli') || query.includes('mirch')) {
        return `🍌🥭 <strong>Horticulture Crops Advisory (Banana / Mango / Chilli):</strong><br><br>` +
            `• <strong>Chilli Leaf Curl (Murda Disease):</strong> Spray Spiromesifen 22.9% SC @ 1ml/L for Mites + Acetamiprid @ 0.5g/L for Thrips.<br>` +
            `• <strong>Banana Panama Wilt & Sigatoka:</strong> Drench soil with Carbendazim 50% WP @ 2g/L. Apply heavy Potash (MOP) during fruit development.<br>` +
            `• <strong>Mango Hopper & Powdery Mildew:</strong> Spray Hexaconazole 5% EC @ 1ml/L + Imidacloprid @ 0.5ml/L during panicle emergence.`;
    }

    // 3. CATEGORY ADVISORY & GENERAL INTENTS

    // SOILS & TESTING
    if (query.includes('soil') || query.includes('soils') || query.includes('matti') || query.includes('ph') || query.includes('clay') || query.includes('sandy') || query.includes('loam')) {
        return `🪴 <strong>Soil Health & Soil Testing Management:</strong><br><br>` +
            `• <strong>Soil Sampling Procedure:</strong> Collect soil samples from 5-8 spots per acre at a depth of 15 cm using a V-shaped cut. Mix thoroughly and dry in shade.<br>` +
            `• <strong>Optimal pH Balance:</strong> <strong>6.0 to 7.5</strong>. Apply <strong>Gypsum @ 200 kg/acre</strong> for alkaline soils (pH > 8) or <strong>Agricultural Lime</strong> for acidic soils (pH < 6).<br>` +
            `• <strong>Organic Matter Boost:</strong> Apply Farmyard Manure (FYM) @ 8-10 Tonnes/acre or green manure (Dhaincha) before main crop.`;
    }

    // FERTILIZERS & NPK
    if (isFertilizerQuery) {
        return `🧪 <strong>Balanced Fertilizer & NPK Application Guide:</strong><br><br>` +
            `• <strong>Recommended N-P-K Ratios:</strong><br>` +
            `  - Cereals (Wheat/Rice): <strong>4 : 2 : 1</strong> (e.g., 120 kg N : 60 kg P : 40 kg K per hectare)<br>` +
            `  - Pulses (Gram/Lentil): <strong>1 : 2 : 1</strong><br>` +
            `  - Oilseeds (Mustard/Soybean): <strong>3 : 2 : 1 + 20 kg Sulphur</strong><br>` +
            `• <strong>Standard Dosage per Acre:</strong> 1 Bag DAP + 1/2 Bag MOP + 10kg Zinc Sulphate at basal sowing, followed by Urea top dressing during waterings.<br>` +
            `• <strong>Neem Coated Urea:</strong> Increases Nitrogen utilization efficiency by 15-20% and reduces leaching loss.`;
    }

    // PEST & DISEASE GENERAL DOCTOR
    if (isDiseaseQuery) {
        return `🐛 <strong>Integrated Pest & Disease Management (IPM):</strong><br><br>` +
            `• <strong>Sucking Pests (Whitefly, Aphids, Thrips):</strong> Spray Imidacloprid 17.8% SL @ 0.5ml/L or Acetamiprid 20% SP @ 0.5g/L.<br>` +
            `• <strong>Caterpillars & Borers:</strong> Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.4g/L.<br>` +
            `• <strong>Fungal Blights & Rusts:</strong> Spray Propiconazole 25% EC @ 1ml/L or Mancozeb 75% WP @ 2.5g/L.<br>` +
            `• <strong>Organic Remedy:</strong> Spray <strong>Neem Oil 10,000 PPM @ 3ml/Liter water</strong> + liquid soap.<br>` +
            `👉 Scan leaf photos with our <a href="crop-doctor.html" style="color:#2E7D32; font-weight:700;">AI Crop Doctor Tool →</a>`;
    }

    // ORGANIC FARMING & NATURAL INPUTS
    if (query.includes('organic') || query.includes('jaivik') || query.includes('vermicompost') || query.includes('jeevamrut') || query.includes('panchagavya')) {
        return `🌿 <strong>Organic Farming & Natural Inputs Guide:</strong><br><br>` +
            `• <strong>Jeevamrut Recipe:</strong> Mix 10kg Fresh Cow Dung + 10L Cow Urine + 2kg Jaggery + 2kg Pulse Flour (Besan) + 1 handful farm soil in 200L water. Ferment for 48 hours in shade. Apply via irrigation.<br>` +
            `• <strong>Beejamrut Seed Treatment:</strong> Mix 5kg Cow Dung + 5L Cow Urine + 50g Lime in 20L water for coating seeds before sowing.<br>` +
            `• <strong>Vermicompost:</strong> Apply 2-3 Tonnes/acre of earthworm castings for rich soil organic carbon.<br>` +
            `• <strong>Jaivik Kheti Portal:</strong> Register on jaivikkheti.in for PKVY organic grants and direct customer sales!`;
    }

    // MANDI RATES & MARKET
    if (isMandiQuery) {
        const ca = window.cropsAnalytics;
        const wRate = ca && ca.wheat ? ca.wheat.modalRate : 2285;
        const mRate = ca && ca.mustard ? ca.mustard.modalRate : 5850;
        const pRate = ca && ca.paddy ? ca.paddy.modalRate : 4500;
        return `📈 <strong>Live Mandi Rates & MSP Summary:</strong><br><br>` +
            `• <strong>Wheat (Gehun):</strong> ₹ ${wRate.toLocaleString()} / Quintal (MSP ₹2,275)<br>` +
            `• <strong>Mustard (Sarson):</strong> ₹ ${mRate.toLocaleString()} / Quintal (MSP ₹5,650)<br>` +
            `• <strong>Paddy (Basmati):</strong> ₹ ${pRate.toLocaleString()} / Quintal<br>` +
            `• <strong>Cotton (Kapas):</strong> ₹ 7,150 / Quintal (MSP ₹7,020)<br>` +
            `👉 <a href="market.html" style="color:#2E7D32; font-weight:700;">View Live Mandi Prices & Market Trends →</a>`;
    }

    // IRRIGATION & WATER
    if (isIrrigationQuery) {
        return `💧 <strong>Smart Irrigation & Water Management:</strong><br><br>` +
            `• <strong>Drip Irrigation:</strong> Saves 40-50% water, delivers water directly to root zones, and boosts yield by up to 30%.<br>` +
            `• <strong>Sprinkler Irrigation:</strong> Best for Wheat, Mustard, Pulses, and undulating sandy fields.<br>` +
            `• <strong>Critical Stages:</strong> Wheat (CRI at 21 days), Paddy (Tillering & Panicle stage), Cotton (Flowering & Boll formation).<br>` +
            `• <strong>Government Subsidy:</strong> PMKSY scheme provides up to <strong>80% subsidy</strong> for micro-irrigation!`;
    }

    // WEED CONTROL
    if (query.includes('weed') || query.includes('herbicide') || query.includes('kharpatawar')) {
        return `🌿 <strong>Effective Weed Management (Kharpatawar Control):</strong><br><br>` +
            `• <strong>Pre-Emergence (Within 3 days of sowing):</strong> Apply Pendimethalin 30% EC @ 1.0 - 1.25 Liter/acre in 200L water.<br>` +
            `• <strong>Post-Emergence Broadleaf Weeds:</strong> Spray 2,4-D Ethyl Ester 38% EC @ 400ml/acre 30-35 days after sowing.<br>` +
            `• <strong>Grassy Weeds in Wheat (Phalaris minor / Gulli Danda):</strong> Spray Clodinafop-propargyl 15% WP @ 160g/acre or Sulfosulfuron 75% WG @ 13.5g/acre.`;
    }

    // FARM MACHINERY & DRONES
    if (query.includes('machinery') || query.includes('tractor') || query.includes('drone') || query.includes('equipment')) {
        return `🚜 <strong>Farm Machinery & Kisan Drones:</strong><br><br>` +
            `• <strong>SMAM Scheme:</strong> 40% to 50% subsidy on Tractors, Rotavators, Happy Seeders, and Laser Land Levelers.<br>` +
            `• <strong>Agri Drones:</strong> Spray 1 acre of crop in just 7-10 minutes with 90% water saving and zero chemical contact.<br>` +
            `• <strong>Custom Hiring Centers (CHC App):</strong> Rent modern farm equipment at low hourly rates.`;
    }

    // WEATHER & SEASONS
    if (query.includes('weather') || query.includes('rain') || query.includes('forecast') || query.includes('season')) {
        return `🌤️ <strong>Seasonal Farming Calendar & Weather Advisory:</strong><br><br>` +
            `• <strong>Kharif Season (Monsoon, June-Oct):</strong> Paddy, Cotton, Soybean, Maize, Groundnut.<br>` +
            `• <strong>Rabi Season (Winter, Oct-March):</strong> Wheat, Mustard, Gram, Barley, Peas.<br>` +
            `• <strong>Zaid Season (Summer, March-June):</strong> Watermelon, Muskmelon, Cucumber, Fodder.<br>` +
            `👉 <a href="weather.html" style="color:#2E7D32; font-weight:700;">Check District Weather & Rain Advisories →</a>`;
    }

    // POST-HARVEST STORAGE
    if (query.includes('storage') || query.includes('godown') || query.includes('warehouse') || query.includes('moisture')) {
        return `📦 <strong>Post-Harvest Crop Storage Rules:</strong><br><br>` +
            `• <strong>Moisture Level:</strong> Dry grains thoroughly in sunlight until moisture content drops below <strong>12%</strong> before bag filling.<br>` +
            `• <strong>Weevil & Insect Control:</strong> Mix dried Neem leaves or apply Aluminum Phosphide tablets (Celphos) strictly under sealed conditions.<br>` +
            `• <strong>WDRA Warehouse Loan:</strong> Get electronic negotiable warehouse receipts (e-NWR) for low-interest bank loans against stored produce!`;
    }

    // 4. INTELLIGENT DYNAMIC KEYWORD SYNTHESIZER (For Any Unmatched / Complex Query)
    const matchedAspects = [];
    if (query.includes('seed') || query.includes('variety') || query.includes('sow')) matchedAspects.push('• <strong>Seed & Sowing:</strong> Use certified high-yielding varieties and treat seeds with Trichoderma (5g/kg) before sowing.');
    if (query.includes('soil') || query.includes('land') || query.includes('ph')) matchedAspects.push('• <strong>Soil Care:</strong> Test soil pH (ideal 6.0-7.5) and add 8-10 tonnes/acre of organic FYM compost.');
    if (query.includes('water') || query.includes('drip') || query.includes('rain')) matchedAspects.push('• <strong>Water Management:</strong> Adopt micro-irrigation (Drip/Sprinkler) to save 40% water under the PMKSY subsidy scheme.');
    if (query.includes('pest') || query.includes('bug') || query.includes('worm') || query.includes('spray') || query.includes('disease')) matchedAspects.push('• <strong>Crop Protection:</strong> Apply Neem Oil 10,000 ppm (3ml/L) as a preventive organic spray or consult our AI Crop Doctor tool.');
    if (query.includes('price') || query.includes('rate') || query.includes('cost') || query.includes('money') || query.includes('sell')) matchedAspects.push('• <strong>Market & Sales:</strong> Check live Mandi rates on GROW Market or register on eNAM (enam.gov.in) for direct buyer sales.');
    if (query.includes('loan') || query.includes('bank') || query.includes('scheme') || query.includes('subsidy')) matchedAspects.push('• <strong>Government Financial Aid:</strong> Apply for Kisan Credit Card (4% interest loan) or PM-KISAN cash support.');

    let dynamicBody = '';
    if (matchedAspects.length > 0) {
        dynamicBody = matchedAspects.join('<br>');
    } else {
        dynamicBody = `• <strong>Balanced Nutrition:</strong> Maintain recommended NPK ratios (4:2:1) and incorporate organic compost.<br>` +
            `• <strong>Integrated Protection:</strong> Monitor crops weekly for early pest detection and use preventive Neem sprays.<br>` +
            `• <strong>Government Schemes:</strong> Benefit from PM-KISAN, KCC (4% interest loan), and PMKSY micro-irrigation grants.`;
    }

    return `🌾 <strong>Kisan Mitra Agriculture Advisory:</strong><br><br>` +
        `Here is expert agricultural guidance regarding <em>"${escapeHTML(raw)}"</em>:<br><br>` +
        `${dynamicBody}<br><br>` +
        `💡 <em>Need more details? Try asking specific questions like <strong>"Wheat yellow rust spray"</strong>, <strong>"PM-KISAN application"</strong>, <strong>"Paddy NPK dosage"</strong>, or <strong>"How to make Jeevamrut"</strong>!</em>`;
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
        window.googleTranslateElementInit = function () {
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
