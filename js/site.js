window.portfolioAnimations = {

    // Scroll-reveal for .reveal elements.
    initReveal: function () {
        var els = document.querySelectorAll('.reveal:not(.observed)');
        if (!('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('in-view'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        els.forEach(function (el, i) {
            el.classList.add('observed');
            el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms';
            observer.observe(el);
        });
    },

    // Active nav-link highlight while scrolling through sections.
    initScrollSpy: function () {
        var sections = document.querySelectorAll('main section[id]');
        var links = document.querySelectorAll('.nav-links a[href*="#"]');
        if (!sections.length || !('IntersectionObserver' in window)) return;

        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    links.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href').endsWith('#' + entry.target.id));
                    });
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px' });

        sections.forEach(function (s) { spy.observe(s); });
    },

    // Nav gets a shadow + darkens slightly once the page scrolls.
    initNavScroll: function () {
        var nav = document.getElementById('siteNav');
        if (!nav) return;
        var onScroll = function () {
            nav.classList.toggle('scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    },

    // Typewriter effect for the hero name + role line.
    initHeroTyping: function () {
        var nameEl = document.getElementById('heroName');
        var roleEl = document.getElementById('heroRole');
        if (!nameEl || !roleEl) return;

        var nameTarget = 'Chetan Pattan ,';
        var roleTarget = 'Software Engineer — .NET / ASP.NET Core Web API';

        var i = 0;
        function typeName() {
            if (i <= nameTarget.length) {
                nameEl.textContent = nameTarget.slice(0, i);
                i++;
                setTimeout(typeName, 55);
            } else {
                setTimeout(typeRole, 250);
            }
        }
        var j = 0;
        function typeRole() {
            if (j <= roleTarget.length) {
                roleEl.textContent = roleTarget.slice(0, j);
                j++;
                setTimeout(typeRole, 20);
            }
        }
        setTimeout(typeName, 350);
    },

    // The hero's signature element: the resume served as an API, with
    // tabs for profile / auth+security / webhook integrations. Typed out
    // like a live terminal session, auto-cycles, and is click-switchable.
    initResumeConsole: function () {
        var reqEl = document.getElementById('consoleReq');
        var jsonEl = document.getElementById('consoleJson');
        var statusEl = document.getElementById('consoleStatus');
        var tabBtns = document.querySelectorAll('#consoleTabs .console-tab');
        if (!reqEl || !jsonEl || !statusEl || !tabBtns.length) return;

        //var tabs = [
        //    {
        //        req: 'GET /api/v1/profile',
        //        status: 'verified · open to work',
        //        json: '{\n  "name": "Chetan Pattan",\n  "role": "Software Engineer — .NET Developer",\n  "company": "Krtiva Technologies",\n  "client": "SBI Factors (SBI subsidiary)",\n  "experience_years": 2,\n  "stack": ["ASP.NET Core", "C#", "Laravel", "SQL Server", "EF"],\n  "open_to_work": true\n}'
        //    },
        //    {
        //        req: 'POST /api/v1/auth/token',
        //        status: 'verified & encrypted',
        //        json: '{\n  "grant_type": "client_credentials",\n  "encryption": "RSA-2048",\n  "auth": "JWT Bearer",\n  "client": "los-lms-core"\n}\n\n200 OK\n{\n  "authenticated": true,\n  "ip_whitelisted": true\n}'
        //    },
        //    {
        //        req: 'POST /webhook/loan-status',
        //        status: 'delivered to LMS core',
        //        json: '{\n  "event": "loan.application.approved",\n  "source": "SBI Factors LMS",\n  "integrations": [\n    "Karza", "Accumn", "CRIF", "Cygnet", "Doqfy",\n    "YONO Banking", "SBI Payment APIs",\n    "M1xchange", "InvoiceMart", "RXIL"\n  ],\n  "processed_by": "chetan.api",\n  "status": 200\n}'
        //    }
        //];

        var tabs = [
            {
                req: 'GET /api/v1/profile',
                status: 'verified · open to work',
                json: '{\n  "name": "Chetan Pattan",\n  "role": "Software Engineer — .NET / Backend Developer",\n  "company": "Krtiva Technologies",\n  "client": "SBI Factors (SBI subsidiary)",\n  "experience_years": 2,\n  "stack": ["ASP.NET Core", "C#", "Laravel", "SQL Server", "Oracle", "EF Core"],\n  "open_to_work": true\n}'
            },
            {
                req: 'POST /api/v1/auth/secure-token',
                status: 'verified & encrypted · banking standard',
                json: '{\n  "grant_type": "client_credentials",\n  "client_key": "sec_key_****************",\n  "authentication": "JWT Bearer & Refresh Tokens",\n  "payload_encryption": "RSA-2048 Asymmetric",\n  "secure_transmission": "TLS 1.3 Strict",\n  "ip_whitelisted": true,\n  "status": "200 OK — Payload Decrypted"\n}'
            },
            {
                req: 'POST /api/v1/integrations/gateway',
                status: 'delivered · 3rd party processing',
                json: '{\n  "event": "third_party.integration.sync",\n  "source": "SBI Factors LMS / LOS Core",\n  "integrations": [\n    "E-Way Bill & E-Invoice Gateways",\n    "Karza", "CRIF", "Cygnet", "Doqfy",\n    "YONO Banking", "SBI Payment APIs",\n    "M1xchange", "InvoiceMart", "RXIL"\n  ],\n  "processed_by": "chetan.api",\n  "status": 200\n}'
            }
        ];
        var typingTimer = null;
        var autoTimer = null;
        var current = 0;

        function typeTab(index) {
            clearTimeout(typingTimer);
            var t = tabs[index];
            reqEl.textContent = t.req;
            jsonEl.textContent = '';
            statusEl.textContent = '';
            var pos = 0;
            function step() {
                pos += 2;
                jsonEl.textContent = t.json.slice(0, pos);
                if (pos < t.json.length) {
                    typingTimer = setTimeout(step, 10);
                } else {
                    statusEl.textContent = t.status;
                }
            }
            step();
        }

        function activate(index) {
            current = index;
            tabBtns.forEach(function (b, i) {
                b.classList.toggle('active', i === index);
            });
            typeTab(index);
        }

        tabBtns.forEach(function (btn, i) {
            btn.addEventListener('click', function () {
                clearInterval(autoTimer);
                activate(i);
                autoTimer = setInterval(function () {
                    activate((current + 1) % tabs.length);
                }, 6000);
            });
        });

        activate(0);
        autoTimer = setInterval(function () {
            activate((current + 1) % tabs.length);
        }, 6000);
    },

    // Count-up animation for the hero stat numbers (data-count-to="10").
    initCountUp: function () {
        var stats = document.querySelectorAll('[data-count-to]');
        if (!stats.length) return;
        stats.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
            var suffix = el.getAttribute('data-count-suffix') || '';
            var duration = 900;
            var startTime = null;

            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            if ('IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            requestAnimationFrame(step);
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.4 });
                obs.observe(el);
            } else {
                el.textContent = target + suffix;
            }
        });
    },

    // Ripple effect on buttons (contact submit, resume download, etc.)
    initButtonRipple: function () {
        document.querySelectorAll('.btn:not(.rippled)').forEach(function (btn) {
            btn.classList.add('rippled');
            btn.addEventListener('click', function (e) {
                var rect = btn.getBoundingClientRect();
                var ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                btn.appendChild(ripple);
                ripple.addEventListener('animationend', function () { ripple.remove(); });
            });
        });
    },

    initAll: function () {
        this.initReveal();
        this.initScrollSpy();
        this.initNavScroll();
        this.initHeroTyping();
        this.initResumeConsole();
        this.initCountUp();
        this.initButtonRipple();
    }
};
