/* ==========================================
   GROW PLATFORM - AUTHENTICATION MODULE
========================================== */

export function initAuth() {
    console.log("GROW Auth Module Initialized");
    
    // Inject Auth Modal into DOM if missing
    if (!document.getElementById('auth-modal')) {
        const modalHTML = `
        <div class="modal-overlay" id="auth-modal">
            <div class="modal-box">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div style="text-align:center; margin-bottom: 24px;">
                    <div class="logo-icon" style="margin: 0 auto 12px; width: 56px; height: 56px; font-size: 28px;">
                        <i class="fa-solid fa-seedling"></i>
                    </div>
                    <h2 style="font-family:'Poppins', sans-serif; font-size: 24px; color: var(--text-primary);">Welcome to GROW</h2>
                    <p style="color: var(--text-secondary); font-size: 14px;">Log in or create an account to access smart farming tools</p>
                </div>
                
                <form id="auth-form" onsubmit="event.preventDefault(); handleAuthSubmit();">
                    <div class="form-group">
                        <label for="auth-email">Email or Phone Number</label>
                        <input type="text" id="auth-email" class="form-control" placeholder="farmer@grow.org or +91 9876543210" required>
                    </div>
                    <div class="form-group">
                        <label for="auth-pass">Password</label>
                        <input type="password" id="auth-pass" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="primary-btn" style="width: 100%; justify-content: center; margin-top: 10px;">
                        <i class="fa-solid fa-right-to-bracket"></i> Sign In / Register
                    </button>
                </form>
                
                <div style="margin-top: 20px; text-align: center; font-size: 13px; color: var(--text-muted);">
                    By signing in, you agree to GROW's Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

window.handleAuthSubmit = function() {
    const email = document.getElementById('auth-email').value;
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
    
    // Save state in localStorage
    localStorage.setItem('grow_user', JSON.stringify({ email: email, name: email.split('@')[0] }));
    
    if (typeof showToast === 'function') {
        showToast(`Welcome back, ${email.split('@')[0]}! Successfully logged in.`, 'fa-user-check');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});
