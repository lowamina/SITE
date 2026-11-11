(function () {
    "use strict";
    document.body.classList.remove('no-js');
    var root = document.documentElement;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---- theme toggle ---- */
    var themeBtn = document.getElementById('themeToggle');
    function systemDark() { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
    try {
        var saved = localStorage.getItem('cl-theme');
        if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) { }
    themeBtn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
        var next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('cl-theme', next); } catch (e) { }
    });

    /* ---- mobile nav ---- */
    var header = document.getElementById('siteHeader');
    var burger = document.getElementById('burgerBtn');
    function setMenu(open) {
        header.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    burger.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('click', function (e) {
        if (header.classList.contains('open') && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

    /* ---- scroll spy ---- */
    var navMap = {};
    document.querySelectorAll('.nav-link').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var link = navMap[entry.target.id];
            if (link && entry.isIntersecting) {
                document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

    /* ---- reveal on scroll ---- */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    } else {
        var ro = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('in-view'); ro.unobserve(entry.target); }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { ro.observe(el); });
    }

    /* ---- show more projects (mobile) ---- */
    var grid = document.getElementById('projectGrid');
    var moreBtn = document.getElementById('moreBtn');
    moreBtn.addEventListener('click', function () {
        var collapsed = grid.classList.toggle('collapsed');
        moreBtn.textContent = collapsed ? 'Show all 9 projects' : 'Show fewer';
        moreBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        grid.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in-view'); });
        if (collapsed) document.getElementById('projects').scrollIntoView();
    });

    /* ---- review carousel dots (mobile) ---- */
    var rg = document.getElementById('reviewGrid');
    var hint = document.getElementById('swipeHint');
    var cards = rg.querySelectorAll('.r-card');
    cards.forEach(function () { hint.appendChild(document.createElement('span')); });
    var dots = hint.querySelectorAll('span');
    function updateDots() {
        var w = cards[0].offsetWidth + 14;
        var i = Math.round(rg.scrollLeft / w);
        if (rg.scrollLeft + rg.clientWidth >= rg.scrollWidth - 4) i = cards.length - 1;
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    }
    rg.addEventListener('scroll', updateDots, { passive: true });
    updateDots();

    /* ---- sticky hire bar (mobile) ---- */
    var bar = document.getElementById('hireBar');
    var heroEnd = document.querySelector('#home .hero-cta');
    var contact = document.getElementById('contact');
    var pastHero = false, atContact = false;
    function syncBar() { bar.classList.toggle('show', pastHero && !atContact); }
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; syncBar(); }).observe(heroEnd);
    new IntersectionObserver(function (e) { atContact = e[0].isIntersecting; syncBar(); }, { threshold: 0.15 }).observe(contact);

    /* ---- typing role rotator ---- */
    var roles = ['Front-End Developer', 'Founder of Code.lowa', 'Creative Coder', 'CS Undergraduate at SLIIT'];
    var roleEl = document.getElementById('roleText');
    if (reduced || !roleEl) {
        if (roleEl) roleEl.textContent = '“' + roles[0] + '”';
    } else {
        var ri = 0, ci = roles[0].length, deleting = true;
        function tick() {
            var word = roles[ri];
            if (!deleting) {
                ci++;
                roleEl.textContent = '“' + word.slice(0, ci) + '”';
                if (ci === word.length) { deleting = true; setTimeout(tick, 1600); return; }
            } else {
                ci--;
                roleEl.textContent = '“' + word.slice(0, ci) + '”';
                if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 300); return; }
            }
            setTimeout(tick, deleting ? 35 : 65);
        }
        setTimeout(tick, 1600);
    }
})();
