/* BhumiOS Agro — static demo interactions (no backend) */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Footer year
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    // Mobile menu
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth anchor scroll (capture phase, with header offset handled by scroll-mt)
    document.addEventListener(
        'click',
        function (e) {
            var anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            var hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;
            var target = document.querySelector(hash);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            history.replaceState(null, '', hash);
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        },
        true
    );

    // Scroll reveal
    var revealEls = document.querySelectorAll('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) {
            el.classList.add('visible');
        });
    } else {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
        );
        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    }

    // Auto-slide tab groups: [data-autotabs] > [data-tab-btn] + [data-tab-panel]
    document.querySelectorAll('[data-autotabs]').forEach(function (group) {
        var btns = Array.prototype.slice.call(group.querySelectorAll('[data-tab-btn]'));
        var panels = Array.prototype.slice.call(group.querySelectorAll('[data-tab-panel]'));
        var dots = Array.prototype.slice.call(group.querySelectorAll('[data-tab-dot]'));
        if (!btns.length || !panels.length) return;

        var active = 0;
        var paused = false;
        var interval = parseInt(group.getAttribute('data-interval') || '6000', 10);
        var activeBg = group.getAttribute('data-active-bg') || '#16a34a';

        function render() {
            btns.forEach(function (btn, i) {
                var on = i === active;
                btn.setAttribute('aria-selected', on ? 'true' : 'false');
                if (on) {
                    btn.style.backgroundColor = activeBg;
                    btn.style.borderColor = activeBg;
                    btn.style.color = '#fff';
                    btn.classList.add('shadow-lg');
                } else {
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.classList.remove('shadow-lg');
                }
            });
            panels.forEach(function (panel, i) {
                panel.classList.toggle('hidden', i !== active);
            });
            dots.forEach(function (dot, i) {
                var on = i === active;
                dot.style.width = on ? '2rem' : '0.5rem';
                dot.style.backgroundColor = on ? activeBg : 'rgba(255,255,255,0.2)';
            });
        }

        btns.forEach(function (btn, i) {
            btn.addEventListener('click', function () {
                active = i;
                render();
                restart();
            });
        });

        var timer = null;
        function restart() {
            if (timer) clearInterval(timer);
            timer = null;
            if (reducedMotion || paused || btns.length < 2) return;
            timer = setInterval(function () {
                active = (active + 1) % btns.length;
                render();
            }, interval);
        }

        group.addEventListener('mouseenter', function () {
            paused = true;
            if (timer) clearInterval(timer);
            timer = null;
        });
        group.addEventListener('mouseleave', function () {
            paused = false;
            restart();
        });
        group.addEventListener('focusin', function () {
            paused = true;
            if (timer) clearInterval(timer);
            timer = null;
        });
        group.addEventListener('focusout', function () {
            paused = false;
            restart();
        });

        render();
        restart();
    });

    // Firefly particles: [data-particles] containers get deterministic
    // pseudo-random blinking dots (position/size/timing all vary).
    document.querySelectorAll('[data-particles]').forEach(function (box) {
        if (reducedMotion) return;
        var count = parseInt(box.getAttribute('data-particles') || '24', 10);
        for (var i = 0; i < count; i++) {
            var dot = document.createElement('div');
            var size = [4, 6, 8][i % 3];
            dot.style.cssText =
                'position:absolute;border-radius:9999px;background:#fff;' +
                'box-shadow:0 0 10px 2px rgba(255,255,255,0.55);' +
                'top:' + (((i * 37.7 + 11) % 100).toFixed(1)) + '%;' +
                'left:' + (((i * 53.3 + 7) % 100).toFixed(1)) + '%;' +
                'width:' + size + 'px;height:' + size + 'px;' +
                'opacity:' + [1, 0.8, 0.55][i % 3] + ';' +
                'animation:ping-soft ' + (2 + ((i * 0.53) % 2.5)).toFixed(2) + 's cubic-bezier(0,0,.2,1) infinite;' +
                'animation-delay:' + ((i * 0.37) % 2.4).toFixed(2) + 's;';
            box.appendChild(dot);
        }
    });

    // Demo forms (login/register): UI only, no backend
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var toast = document.getElementById('demo-toast');
            if (toast) {
                toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                setTimeout(function () {
                    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                }, 3500);
            }
        });
    });
})();
