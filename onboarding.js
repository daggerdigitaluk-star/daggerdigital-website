/* One-question-at-a-time onboarding form. Without JavaScript the form shows every question as a normal page. */
(function () {
  var form = document.getElementById('wiz');
  if (!form) return;
  document.documentElement.classList.add('wiz-on');
  form.noValidate = true;

  var steps = Array.prototype.slice.call(form.querySelectorAll('.wiz-step'));
  var bar = document.getElementById('wiz-bar');
  var progress = form.querySelector('.wiz-progress');
  var count = document.getElementById('wiz-count');
  var back = document.getElementById('wiz-back');
  var next = document.getElementById('wiz-next');
  var enterHint = document.getElementById('wiz-enter');
  var review = document.getElementById('wiz-review');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  var last = steps.length - 1;
  var questions = last - 1; // welcome and review screens are not questions

  function fields(step) {
    return Array.prototype.slice.call(step.querySelectorAll('input, select, textarea')).filter(function (el) {
      return el.type !== 'hidden' && !el.closest('.wiz-if[hidden]');
    });
  }

  function isEmpty(step) {
    return fields(step).every(function (el) {
      if (el.type === 'radio' || el.type === 'checkbox') return !el.checked;
      if (el.type === 'file') return !el.files || !el.files.length;
      return !el.value.trim();
    });
  }

  function validate(step) {
    var list = fields(step);
    for (var k = 0; k < list.length; k++) {
      if (!list[k].checkValidity()) {
        list[k].reportValidity();
        step.classList.remove('wiz-shake');
        void step.offsetWidth;
        step.classList.add('wiz-shake');
        return false;
      }
    }
    return true;
  }

  function personalise() {
    var name = (form.elements['Client Name'].value || '').trim().split(/\s+/)[0];
    var biz = (form.elements['Business Name'].value || '').trim();
    form.querySelectorAll('[data-first-name]').forEach(function (el) { el.textContent = name || 'there'; });
    form.querySelectorAll('[data-biz]').forEach(function (el) { el.textContent = biz || 'your business'; });
  }

  function updateConditionals() {
    form.querySelectorAll('.wiz-if').forEach(function (box) {
      var rule = box.getAttribute('data-if').split('=');
      var picked = form.querySelector('input[name="' + rule[0] + '"]:checked');
      box.hidden = !(picked && picked.value === rule[1]);
    });
  }

  function buildReview() {
    review.innerHTML = '';
    steps.forEach(function (step, idx) {
      if (idx === 0 || idx === last) return;
      fields(step).forEach(function (el) {
        var label = el.closest('label');
        var title = el.name;
        var value = '';
        if (el.type === 'radio') { if (!el.checked) return; value = el.value; }
        else if (el.type === 'checkbox') { value = el.checked ? 'Yes' : 'No'; title = 'Permission to use content'; }
        else if (el.type === 'file') { value = el.files && el.files.length ? el.files[0].name : ''; }
        else value = el.value.trim();
        if (!value) return;
        var row = document.createElement('div');
        var dt = document.createElement('dt');
        var dd = document.createElement('dd');
        var edit = document.createElement('button');
        dt.textContent = title === 'email' ? 'Email' : title;
        edit.type = 'button';
        edit.className = 'wiz-edit';
        edit.textContent = value;
        edit.setAttribute('aria-label', 'Change ' + dt.textContent);
        edit.addEventListener('click', function () { go(idx); });
        dd.appendChild(edit);
        row.appendChild(dt);
        row.appendChild(dd);
        review.appendChild(row);
      });
    });
  }

  function updateNav() {
    var step = steps[current];
    var pct = Math.round((current / last) * 100);
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', pct);
    back.hidden = current === 0;
    count.textContent = current === 0 ? '' : current === last ? 'Ready to send' : 'Question ' + current + ' of ' + questions;
    if (current === 0) next.textContent = "Let's go";
    else if (current === last) next.textContent = 'Send my project details';
    else if (!step.hasAttribute('data-required') && isEmpty(step)) next.textContent = 'Skip';
    else next.textContent = 'OK';
    enterHint.hidden = current === last || !!step.querySelector('textarea');
  }

  function go(idx) {
    if (idx < 0 || idx > last) return;
    var from = steps[current];
    var forward = idx > current;
    from.classList.remove('is-active', 'from-back');
    current = idx;
    var step = steps[current];
    personalise();
    updateConditionals();
    if (current === last) buildReview();
    step.classList.toggle('from-back', !forward);
    step.classList.add('is-active');
    updateNav();
    var first = step.querySelector('input:not([type=hidden]):not([type=radio]):not([type=file]), textarea, input[type=radio]:checked');
    if (first && !('ontouchstart' in window)) first.focus({ preventScroll: true });
    var top = form.getBoundingClientRect().top + window.pageYOffset - 90;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  function forward() {
    if (current === last) {
      next.disabled = true;
      next.textContent = 'Sending...';
      if (form.requestSubmit) form.requestSubmit(); else form.submit();
      return;
    }
    if (current > 0 && !validate(steps[current])) return;
    go(current + 1);
  }

  next.addEventListener('click', forward);
  back.addEventListener('click', function () { go(current - 1); });

  form.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.shiftKey) return;
    var t = e.target;
    if (t.tagName === 'TEXTAREA' && !(e.ctrlKey || e.metaKey)) return;
    if (t.tagName === 'BUTTON' || (t.tagName === 'A')) return;
    e.preventDefault();
    forward();
  });

  form.addEventListener('input', updateNav);
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.type === 'file') {
      var label = form.querySelector('[data-file-for="' + t.id + '"]');
      if (label) label.textContent = t.files && t.files.length ? t.files[0].name : 'Tap to choose a file';
      t.closest('.wiz-drop').classList.toggle('has-file', !!(t.files && t.files.length));
    }
    if (t.type === 'radio') {
      updateConditionals();
      var step = t.closest('.wiz-step');
      var hasFollowUp = step.querySelector('.wiz-if:not([hidden])');
      if (step.hasAttribute('data-auto') || (!hasFollowUp && step.querySelector('.wiz-if'))) {
        setTimeout(function () { if (steps[current] === step) forward(); }, reduce ? 0 : 280);
      }
    }
    updateNav();
  });

  form.addEventListener('submit', function (e) {
    // Every question has already been checked step by step; this stops the browser
    // blocking the send because a required field sits on a hidden step.
    for (var k = 1; k < last; k++) {
      if (!validate(steps[k])) { e.preventDefault(); next.disabled = false; go(k); validate(steps[k]); return; }
    }
  });

  steps[0].classList.add('is-active');
  updateNav();
})();
