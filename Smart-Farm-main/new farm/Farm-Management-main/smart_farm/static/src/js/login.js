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

    // Real Smart Farm Sign Up handler
    window.sfHandleSignUp = function () {
        var nameInput = document.getElementById('sf-signup-name');
        var emailInput = document.getElementById('sf-signup-email');
        var passwordInput = document.getElementById('sf-signup-password');
        var alertBox = document.getElementById('sf-signup-alert');
        var container = document.getElementById('sf-auth-container');
        var submitBtn = document.getElementById('sf-btn-signup-submit');

        if (!nameInput || !emailInput || !passwordInput) return;

        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        var password = passwordInput.value;

        function showAlert(msg, type) {
            if (!alertBox) return;
            alertBox.className = 'sf-auth-alert sf-alert-' + type;
            alertBox.innerHTML = (type === 'success' ? '<i class="fa fa-check-circle me-1"></i> ' : '<i class="fa fa-exclamation-circle me-1"></i> ') + msg;
            alertBox.style.display = 'block';
        }

        if (!name) {
            showAlert('Vui lòng điền họ và tên của bạn!', 'danger');
            nameInput.focus();
            return;
        }

        if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            showAlert('Vui lòng nhập địa chỉ email hợp lệ!', 'danger');
            emailInput.focus();
            return;
        }

        if (!password || password.length < 6) {
            showAlert('Mật khẩu phải có độ dài tối thiểu 6 ký tự!', 'danger');
            passwordInput.focus();
            return;
        }

        // Disable button & show spinner
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> Đang tạo tài khoản...';
        }

        fetch('/smart_farm/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    name: name,
                    email: email,
                    password: password
                }
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (resData) {
            var result = resData.result || {};
            if (result.success) {
                showAlert('Đăng ký thành công! Đang chuyển sang đăng nhập...', 'success');

                // Tự động điền email và password vào form Sign In
                var loginInput = document.getElementById('login');
                var passInput = document.getElementById('password');
                if (loginInput) loginInput.value = email;
                if (passInput) passInput.value = password;

                // Xóa trống form đăng ký
                nameInput.value = '';
                emailInput.value = '';
                passwordInput.value = '';

                setTimeout(function () {
                    // Trượt panel về bên Sign In
                    if (container) {
                        container.classList.remove('right-panel-active');
                    }
                    if (alertBox) {
                        alertBox.style.display = 'none';
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'SIGN UP';
                    }

                    // Tự động submit form đăng nhập để vào thẳng Dashboard
                    var signInForm = document.querySelector('.oe_login_form');
                    var signInBtn = document.getElementById('sf-btn-signin-submit');
                    if (signInBtn) {
                        signInBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> Đang đăng nhập...';
                    }
                    if (signInForm) {
                        signInForm.submit();
                    }
                }, 1000);
            } else {
                showAlert(result.error || 'Đăng ký không thành công. Vui lòng thử lại!', 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'SIGN UP';
                }
            }
        })
        .catch(function (err) {
            console.error('Signup error:', err);
            showAlert('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền!', 'danger');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'SIGN UP';
            }
        });
    };

    // Backward-compatible alias
    window.sfHandleSignUpDemo = window.sfHandleSignUp;

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
