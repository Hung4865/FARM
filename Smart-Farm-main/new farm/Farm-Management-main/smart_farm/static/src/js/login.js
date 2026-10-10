/**
 * Smart Farm - Modern Animated Sliding Auth Screen Interaction
 * Handles smooth 0.6s sliding transitions between Sign In and Sign Up modes.
 */

(function () {
    'use strict';

    function initSlidingAuth() {
        var container = document.getElementById('sf-auth-container');
        if (!container) return;

        var btnToSignUp = document.getElementById('sf-btn-to-signup');
        var btnToSignIn = document.getElementById('sf-btn-to-signin');
        var mobileToSignUp = document.getElementById('sf-mobile-to-signup');
        var mobileToSignIn = document.getElementById('sf-mobile-to-signin');

        // 1. Desktop Overlay Buttons
        if (btnToSignUp) {
            btnToSignUp.addEventListener('click', function (e) {
                e.preventDefault();
                container.classList.add('right-panel-active');
            });
        }

        if (btnToSignIn) {
            btnToSignIn.addEventListener('click', function (e) {
                e.preventDefault();
                container.classList.remove('right-panel-active');
            });
        }

        // 2. Mobile Switch Links
        if (mobileToSignUp) {
            mobileToSignUp.addEventListener('click', function (e) {
                e.preventDefault();
                container.classList.add('right-panel-active');
            });
        }

        if (mobileToSignIn) {
            mobileToSignIn.addEventListener('click', function (e) {
                e.preventDefault();
                container.classList.remove('right-panel-active');
            });
        }

        // 3. Auto-detect URL parameters (e.g. /web/login?mode=signup)
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'signup' || window.location.hash === '#signup') {
            container.classList.add('right-panel-active');
        }
    }

    // Demo Sign Up handler
    window.sfHandleSignUpDemo = function () {
        var nameInput = document.getElementById('sf-signup-name');
        var emailInput = document.getElementById('sf-signup-email');
        var passwordInput = document.getElementById('sf-signup-password');
        var alertBox = document.getElementById('sf-signup-alert');
        var container = document.getElementById('sf-auth-container');

        if (!nameInput || !emailInput || !passwordInput) return;

        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        var password = passwordInput.value;

        if (!name || !email || !password) {
            if (alertBox) {
                alertBox.className = 'sf-auth-alert sf-alert-danger';
                alertBox.innerText = 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!';
                alertBox.style.display = 'block';
            }
            return;
        }

        if (alertBox) {
            alertBox.className = 'sf-auth-alert sf-alert-success';
            alertBox.innerHTML = '<i class="fa fa-check-circle"></i> Đăng ký thành công! Đang chuyển sang Đăng nhập...';
            alertBox.style.display = 'block';
        }

        setTimeout(function () {
            // Fill login form and slide back to Sign In
            var loginInput = document.getElementById('login');
            if (loginInput) {
                loginInput.value = email;
            }
            if (container) {
                container.classList.remove('right-panel-active');
            }
            if (alertBox) {
                alertBox.style.display = 'none';
            }
        }, 1200);
    };

    // Forgot Password modal / notification
    window.sfShowForgotPasswordModal = function () {
        alert('Khôi phục mật khẩu:\nVui lòng liên hệ Quản trị viên nông trại qua email: admin123@gmail.com để được đặt lại mật khẩu truy cập!');
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlidingAuth);
    } else {
        initSlidingAuth();
    }
})();
