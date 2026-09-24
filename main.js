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
    const query = q.toLowerCase();

    // 1. SOILS & SOIL HEALTH
    if (query.includes('soil') || query.includes('soils') || query.includes('matti') || query.includes('ph') || query.includes('clay') || query.includes('sandy') || query.includes('loam') || query.includes('alluvial') || query.includes('black soil') || query.includes('red soil') || query.includes('humus')) {
        if (query.includes('test') || query.includes('card')) {
            return `🌱 <strong>Soil Testing & Health Card Guide:</strong><br>
• <strong>Why Test Soil?</strong> Determines exact NPK deficiency, micro-nutrients (Zinc, Iron, Boron), and pH level to prevent over-fertilization.<br>
• <strong>Sampling Method:</strong> Collect soil samples from 5-8 spots per acre at a depth of 15 cm in a V-shaped cut. Mix thoroughly and dry in shade.<br>
• <strong>Soil Health Card Scheme:</strong> Get your soil tested at government KVK laboratories for under ₹50 to get crop-wise fertilizer recommendations!`;
        }
        return `🪴 <strong>Soil Types & Soil Health Management:</strong><br>
• <strong>Alluvial Soil:</strong> Highly fertile, ideal for Wheat, Paddy, Sugarcane, and Pulses. Retains moisture well.<br>
• <strong>Black Cotton Soil (Regur):</strong> Rich in clay, lime, iron, and magnesium. Excellent water holding capacity; optimal for Cotton, Soybean, and Groundnut.<br>
• <strong>Loam Soil (Sandy Loam):</strong> The ideal soil balance (40% Sand, 40% Silt, 20% Clay). Excellent aeration and drainage for Vegetables, Mustard, and Corn.<br>
• <strong>Optimal Soil pH Range:</strong> <strong>6.0 to 7.5</strong> for maximum nutrient absorption.<br>
• <strong>Soil Health Boosters:</strong><br>
  1. Apply <strong>Farmyard Manure (FYM)</strong> @ 8-10 Tonnes/acre.<br>
  2. Sow Green Manure crops like <strong>Dhaincha</strong> or <strong>Sunn Hemp</strong> before sowing main crops.<br>
  3. Apply <strong>Gypsum</strong> @ 200 kg/acre for alkaline soils or <strong>Lime</strong> for acidic soils.`;
    }

    // 2. FERTILIZERS & NPK DOSAGE
    if (query.includes('fertilizer') || query.includes('fertiliser') || query.includes('npk') || query.includes('urea') || query.includes('dap') || query.includes('mop') || query.includes('nitrogen') || query.includes('phosphorus') || query.includes('potassium') || query.includes('zinc') || query.includes('khaad')) {
        return `🧪 <strong>Balanced Fertilizer & NPK Application Guide:</strong><br>
• <strong>Recommended N-P-K Ratios:</strong><br>
  - Cereals (Wheat/Rice): <strong>4 : 2 : 1</strong> (e.g., 120 kg N : 60 kg P : 40 kg K per hectare)<br>
  - Pulses (Gram/Lentil): <strong>1 : 2 : 1</strong> (Requires less Nitrogen due to root Rhizobium)<br>
  - Oilseeds (Mustard/Soybean): <strong>3 : 2 : 1 + 20 kg Sulphur</strong><br>
• <strong>Standard Dosage per Acre (Wheat/Paddy):</strong><br>
  - <strong>Basal Dose (At Sowing):</strong> 1 Bag DAP (50kg) + 1/2 Bag MOP (25kg) + 10kg Zinc Sulphate 21%.<br>
  - <strong>Top Dressing (First & Second Waterings):</strong> 1 Bag Urea (45kg) per watering.<br>
• <strong>Pro Tip:</strong> Mix Neem-coated Urea to slow down Nitrogen loss and increase efficiency by 15-20%.`;
    }

    // 3. IRRIGATION & WATER MANAGEMENT
    if (query.includes('irrigation') || query.includes('water') || query.includes('drip') || query.includes('sprinkler') || query.includes('borewell') || query.includes('fertigation')) {
        return `💧 <strong>Smart Irrigation & Water Management:</strong><br>
• <strong>Drip Irrigation:</strong> Saves 40-50% water, delivers water directly to root zones, and boosts yield by up to 30%.<br>
• <strong>Sprinkler Irrigation:</strong> Best for closely sown crops like Wheat, Mustard, Pulses, and sandy undulating fields.<br>
• <strong>Critical Irrigation Stages:</strong><br>
  - <strong>Wheat:</strong> Crown Root Initiation (CRI) stage (21 days after sowing) is most critical!<br>
  - <strong>Paddy:</strong> Panicle initiation and flowering stages require continuous 2-5cm standing water.<br>
  - <strong>Cotton:</strong> Flowering and boll formation stages.<br>
• <strong>Government Support:</strong> PMKSY provides up to <strong>80% subsidy</strong> for micro-irrigation installation!`;
    }

    // 4. CROPS & CULTIVATION GUIDES
    if (query.includes('wheat') || query.includes('gehun')) {
        return `🌾 <strong>Wheat (Gehun) Cultivation Package of Practices:</strong><br>
• <strong>Best Sowing Window:</strong> Nov 1 to Nov 20.<br>
• <strong>Seed Rate:</strong> 40 kg/acre (treated with Trichoderma @ 5g/kg seed).<br>
• <strong>Top High-Yield Varieties:</strong> HD 2967, DBW 187 (Karan Vandana), PBW 725, HD 3086.<br>
• <strong>Fertilizer per Acre:</strong> 1 Bag DAP + 1.5 Bags Urea + 25kg Potash + 10kg Zinc.<br>
• <strong>Irrigation:</strong> 5-6 waterings at 21-day intervals (CRI, Tillering, Jointing, Flowering, Milk stage).<br>
• <strong>Expected Yield:</strong> 20 - 25 Quintal / Acre.`;
    }

    if (query.includes('rice') || query.includes('paddy') || query.includes('dhan') || query.includes('basmati')) {
        return `🌾 <strong>Paddy / Basmati Cultivation Guide:</strong><br>
• <strong>Nursery Sowing:</strong> May 15 to June 15.<br>
• <strong>Transplanting:</strong> 25-30 days old seedlings; 2-3 seedlings per hill at 20x15cm spacing.<br>
• <strong>Top Varieties:</strong> Pusa Basmati 1121, Pusa Basmati 1509, PR 126, MTU 1010.<br>
• <strong>Weed Control:</strong> Apply Pretilachlor 50% EC @ 600ml/acre within 3 days of transplanting in standing water.<br>
• <strong>Expected Yield:</strong> 22 - 30 Quintal / Acre.`;
    }

    if (query.includes('mustard') || query.includes('sarson')) {
        return `🟡 <strong>Mustard (Sarson) High-Yield Guide:</strong><br>
• <strong>Sowing Window:</strong> Oct 25 to Nov 10.<br>
• <strong>Seed Rate:</strong> 1.5 to 2.0 kg/acre.<br>
• <strong>Top Varieties:</strong> RH 749, Pioneer 45S46, Giriraj, Pusa Mustard 30.<br>
• <strong>Key Nutrient:</strong> Apply <strong>Bentonite Sulphur @ 10kg/acre</strong> at sowing to increase oil content up to 42%.<br>
• <strong>Irrigation:</strong> 2 waterings (30 days after sowing & flowering stage).`;
    }

    if (query.includes('cotton') || query.includes('kapas')) {
        return `⚪ <strong>Cotton (Kapas) Farming Guide:</strong><br>
• <strong>Sowing Season:</strong> April to May (Kharif).<br>
• <strong>Seed Rate:</strong> 1.5 to 2 packets Bt Cotton per acre (Spacing 3x1.5 feet).<br>
• <strong>Pest Management:</strong> Install 5 Pheromone Traps/acre for Pink Bollworm monitoring.<br>
• <strong>Spray:</strong> Spray Neem Oil (10,000 ppm) @ 3ml/L or Flonicamid 50% WG @ 60g/acre for Whitefly.`;
    }

    if (query.includes('tomato') || query.includes('tamatar')) {
        return `🍅 <strong>Tomato Cultivation & Protection Guide:</strong><br>
• <strong>Soil & Climate:</strong> Well-drained sandy loam soil with pH 6.0-7.0.<br>
• <strong>Staking:</strong> Support plants with bamboo sticks and wire after 30 days for 40% higher marketable yield.<br>
• <strong>Blight Control:</strong> Spray Mancozeb 75% WP @ 2.5g/Liter or Copper Oxychloride @ 3g/Liter.<br>
• <strong>Yield:</strong> 15 - 25 Tonnes / Acre.`;
    }

    // 5. PEST & DISEASE DOCTOR
    if (query.includes('disease') || query.includes('pest') || query.includes('fungus') || query.includes('bacterial') || query.includes('rust') || query.includes('blight') || query.includes('yellowing') || query.includes('whitefly') || query.includes('caterpillar') || query.includes('neem oil') || query.includes('spray') || query.includes('pesticide')) {
        return `🐛 <strong>Integrated Pest & Disease Management (IPM):</strong><br>
• <strong>Yellow Rust / Leaf Blight:</strong> Spray Propiconazole 25% EC @ 1ml / Liter water.<br>
• <strong>Sucking Pests (Whitefly, Aphid, Thrips):</strong> Spray Imidacloprid 17.8% SL @ 0.5ml/L or Acetamiprid 20% SP @ 0.5g/L.<br>
• <strong>Organic Remedy:</strong> Spray <strong>Neem Oil 10,000 PPM @ 3ml/Liter water</strong> + 1ml liquid soap.<br>
• <strong>Physical Traps:</strong> Hang 10 Yellow & Blue Sticky Traps per acre to control flying insects naturally.<br>
👉 Scan leaf photos with our <a href="crop-doctor.html" style="color:#2E7D32; font-weight:700;">AI Crop Doctor Tool →</a>`;
    }

    // 6. ORGANIC FARMING & JAIVIK KHETI
    if (query.includes('organic') || query.includes('jaivik') || query.includes('vermicompost') || query.includes('jeevamrut') || query.includes('panchagavya') || query.includes('natural farming')) {
        return `🌿 <strong>Organic Farming & Natural Inputs Guide:</strong><br>
• <strong>Jeevamrut Recipe:</strong> Mix 10kg Cow Dung + 10L Cow Urine + 2kg Jaggery + 2kg Pulse Flour + 1 handful farm soil in 200L water. Ferment for 48 hours. Apply via irrigation.<br>
• <strong>Vermicompost:</strong> Prepared using <em>Eisenia fetida</em> earthworms. Apply 2-3 Tonnes/acre for rich humus.<br>
• <strong>Organic Certification:</strong> Register on the government <strong>Jaivik Kheti Portal (jaivikkheti.in)</strong> for PKVY scheme benefits and direct customer sales!`;
    }

    // 7. GOVT SCHEMES & SUBSIDIES
    if (query.includes('scheme') || query.includes('subsidy') || query.includes('pm') || query.includes('kisan') || query.includes('kusum') || query.includes('pmksy') || query.includes('kcc') || query.includes('pmfby') || query.includes('grant') || query.includes('gov') || query.includes('sarkar')) {
        return `🏛️ <strong>Top Government Agriculture Schemes:</strong><br>
1. <strong>PM-KISAN:</strong> ₹6,000 / year direct bank transfer in 3 equal installments of ₹2,000.<br>
2. <strong>Kisan Credit Card (KCC):</strong> Concessional farm loan up to ₹3 Lakh at an effective interest rate of just <strong>4%</strong>.<br>
3. <strong>PM-KUSUM:</strong> <strong>90% combined subsidy</strong> for standalone solar agricultural water pumps.<br>
4. <strong>PMKSY Micro-Irrigation:</strong> 80% grant for drip & sprinkler systems.<br>
5. <strong>PMFBY:</strong> Crop Insurance at low premiums (1.5% Rabi, 2% Kharif).<br>
👉 <a href="learning.html" style="color:#2E7D32; font-weight:700;">Explore All Government Schemes & Forms →</a>`;
    }

    // 8. MANDI PRICES & MARKET
    if (query.includes('mandi') || query.includes('rate') || query.includes('price') || query.includes('market') || query.includes('msp') || query.includes('bhav') || query.includes('cost')) {
        const ca = window.cropsAnalytics;
        const wRate = ca && ca.wheat ? ca.wheat.modalRate : 2285;
        const mRate = ca && ca.mustard ? ca.mustard.modalRate : 5850;
        const pRate = ca && ca.paddy ? ca.paddy.modalRate : 4500;

        return `📈 <strong>Live Mandi Rates & MSP Summary:</strong><br>
• <strong>Wheat (Gehun):</strong> ₹ ${wRate.toLocaleString()} / Quintal (MSP ₹2,275)<br>
• <strong>Mustard (Sarson):</strong> ₹ ${mRate.toLocaleString()} / Quintal (MSP ₹5,650)<br>
• <strong>Paddy (Basmati):</strong> ₹ ${pRate.toLocaleString()} / Quintal<br>
• <strong>Cotton (Kapas):</strong> ₹ 7,150 / Quintal (MSP ₹7,020)<br>
👉 <a href="market.html" style="color:#2E7D32; font-weight:700;">View Live Mandi Prices & Market Trends →</a>`;
    }

    // 9. WEATHER & SEASONS
    if (query.includes('weather') || query.includes('rain') || query.includes('temperature') || query.includes('forecast') || query.includes('season') || query.includes('kharif') || query.includes('rabi') || query.includes('zaid')) {
        return `🌤️ <strong>Seasonal Farming Calendar & Advisory:</strong><br>
• <strong>Kharif Season (Monsoon, June-Oct):</strong> Paddy, Cotton, Soybean, Maize, Groundnut.<br>
• <strong>Rabi Season (Winter, Oct-March):</strong> Wheat, Mustard, Gram, Barley, Peas.<br>
• <strong>Zaid Season (Summer, March-June):</strong> Watermelon, Muskmelon, Cucumber, Fodder.<br>
👉 <a href="weather.html" style="color:#2E7D32; font-weight:700;">Check Your District Weather Advisory →</a>`;
    }

    // 10. FARM MACHINERY & DRONES
    if (query.includes('machinery') || query.includes('tractor') || query.includes('drone') || query.includes('harvester') || query.includes('plow') || query.includes('seeder') || query.includes('equipment')) {
        return `🚜 <strong>Farm Machinery & Drone Technology:</strong><br>
• <strong>SMAM Scheme:</strong> 40% to 50% subsidy on Tractors, Rotavators, Happy Seeders, and Laser Land Levelers.<br>
• <strong>Agri Drones:</strong> Spray 1 acre of crop in just 7-10 minutes with 90% water saving and zero chemical contact.<br>
• <strong>Custom Hiring Centers (CHC):</strong> Rent modern farm equipment at low hourly rates via the CHC Farm Machinery App.`;
    }

    // 11. WEED CONTROL (KHARPATAWAR)
    if (query.includes('weed') || query.includes('weeds') || query.includes('herbicide') || query.includes('kharpatawar') || query.includes('glyphosate')) {
        return `🌿 <strong>Effective Weed Management:</strong><br>
• <strong>Pre-Emergence (Within 3 days of sowing):</strong> Apply Pendimethalin 30% EC @ 1.0 - 1.25 Liter/acre in 200L water.<br>
• <strong>Post-Emergence in Wheat (Broadleaf weeds):</strong> Spray 2,4-D Ethyl Ester 38% EC @ 400ml/acre 30-35 days after sowing.<br>
• <strong>Grassy Weeds in Wheat (Phalaris minor / Gulli Danda):</strong> Spray Clodinafop-propargyl 15% WP @ 160g/acre.`;
    }

    // 12. POST-HARVEST STORAGE
    if (query.includes('storage') || query.includes('godown') || query.includes('warehouse') || query.includes('silo') || query.includes('moisture')) {
        return `📦 <strong>Post-Harvest Crop Storage Rules:</strong><br>
• <strong>Moisture Level:</strong> Dry grains thoroughly in sunlight until moisture content drops below <strong>12%</strong> before bag filling.<br>
• <strong>Weevil & Insect Control:</strong> Mix dried Neem leaves or apply Aluminum Phosphide tablets (Celphos) strictly under sealed conditions.<br>
• <strong>Warehouse Subsidy:</strong> Register on WDRA portal to get negotiable warehouse receipts (NWR) for easy bank loans against stored produce!`;
    }

    // 13. COMPREHENSIVE GENERAL AGRICULTURAL FALLBACK
    return `🌾 <strong>Kisan Mitra Agriculture Advisory:</strong><br>
Thank you for your question about <em>"${escapeHTML(q)}"</em>.<br><br>
I am trained on complete agricultural practices! Here are key recommendations:<br>
• <strong>Soil & Fertilizers:</strong> Maintain balanced NPK (4:2:1) and add organic FYM @ 8-10 Tonnes/acre.<br>
• <strong>Crop Protection:</strong> Spray Neem Oil (10,000 ppm) for early pest prevention.<br>
• <strong>Government Help:</strong> Apply for PM-KISAN, KCC (4% farm loan), or PMKSY drip subsidy.<br><br>
💡 <em>Tip: You can ask specific questions like <strong>"soil health"</strong>, <strong>"fertilizer dosage"</strong>, <strong>"wheat mandi rate"</strong>, or <strong>"PM-KISAN"</strong> for detailed step-by-step guides!</em>`;
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
