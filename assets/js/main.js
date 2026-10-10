(function () {
  // Header: border on scroll + mobile menu
  var header = document.getElementById('site-header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Reveal on scroll
  var revealables = document.querySelectorAll('.section-head, .product, .category, .steps li, .quotes blockquote, .split > *');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  // Animated counters
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, start = performance.now();
        (function tick(now) {
          var t = Math.min((now - start) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - t, 3)));
          el.textContent = v.toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: .4 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // Catalogue filtering
  var grid = document.getElementById('product-grid');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.product'));
    var chips = document.querySelectorAll('.chip');
    var search = document.getElementById('search');
    var count = document.getElementById('count');
    var empty = document.getElementById('empty');
    var params = new URLSearchParams(location.search);
    var category = params.get('category') || 'all';

    var apply = function () {
      var q = search.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var ok = (category === 'all' || c.dataset.category === category) && (!q || c.dataset.search.indexOf(q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      chips.forEach(function (ch) { ch.classList.toggle('is-active', ch.dataset.filter === category); });
      count.textContent = shown;
      empty.hidden = shown !== 0;
      var url = new URL(location.href);
      if (category === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', category);
      history.replaceState(null, '', url);
    };

    chips.forEach(function (ch) { ch.addEventListener('click', function () { category = ch.dataset.filter; apply(); }); });
    search.addEventListener('input', apply);
    document.getElementById('clear').addEventListener('click', function () { category = 'all'; search.value = ''; apply(); });
    apply();
  }

  // Quote form
  var form = document.getElementById('quote-form');
  if (form) {
    var status = document.getElementById('form-status');
    var product = new URLSearchParams(location.search).get('product');
    if (product) form.elements.product.value = product;

    var setStatus = function (msg, ok) { status.textContent = msg; status.className = 'form__status ' + (ok ? 'is-ok' : 'is-err'); };

    var compose = function () {
      var f = form.elements, lines = ['Hello Al Asmat, I would like a quote.', ''];
      [['Name', 'name'], ['Company', 'company'], ['Email', 'email'], ['Phone', 'phone'], ['Business type', 'business_type'],
       ['Country', 'country'], ['Product', 'product'], ['Quantity', 'quantity']].forEach(function (p) {
        if (f[p[1]].value.trim()) lines.push(p[0] + ': ' + f[p[1]].value.trim());
      });
      if (f.message.value.trim()) lines.push('', f.message.value.trim());
      lines.push('', 'Please share OEM / private-label pricing.');
      return lines.join('\n');
    };

    var sendVia = function (channel) {
      if (!form.reportValidity()) return;
      var text = compose();
      if (channel === 'whatsapp') {
        window.open('https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        setStatus('Opening WhatsApp with your request…', true);
      } else {
        var subject = 'Quote request – ' + (form.elements.company.value || form.elements.name.value);
        location.href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
        setStatus('Opening your email app with your request…', true);
      }
    };

    form.querySelector('[data-send="whatsapp"]').addEventListener('click', function () { sendVia('whatsapp'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.action || form.getAttribute('action') === null) { sendVia('email'); return; }
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          setStatus("Thank you — your request was sent. We'll reply within 24 hours.", true);
        })
        .catch(function () { setStatus('Something went wrong. Please try WhatsApp or email us directly.', false); })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
