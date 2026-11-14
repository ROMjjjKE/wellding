(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;

  function openD() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true');
    document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a,button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false');
    document.body.classList.remove('is-locked');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
    else if (lastFocus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', function () { drawer.getAttribute('data-open') === 'true' ? closeD() : openD(); });
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    drawer.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a) closeD(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('data-open') === 'true') { closeD(); return; }
    if (e.key === 'Tab' && drawer && drawer.getAttribute('data-open') === 'true') {
      var f = drawer.querySelectorAll('a[href],button'); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && drawer && drawer.getAttribute('data-open') === 'true') closeD(); });

  /* FAQ */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq__i');
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', open ? 'false' : 'true');
      q.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* галерея по группам */
  var tabs = document.querySelectorAll('[data-gal]');
  if (tabs.length) {
    tabs.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var g = t.getAttribute('data-gal');
        tabs.forEach(function (x) { x.setAttribute('aria-current', x === t ? 'true' : 'false'); });
        document.querySelectorAll('[data-g]').forEach(function (fig) {
          var show = g === 'all' || fig.getAttribute('data-g') === g;
          fig.hidden = !show;
        });
      });
    });
  }

  /* выбор элемента: что делаем */
  var WELD = {
    porog: { t: 'Порог', s: ['Простукиваем и снимаем краску, чтобы увидеть границу гнили', 'Вырезаем до чистого металла, а не закрашиваем сверху', 'Гнём ремонтную вставку по месту, подгоняем по зазорам', 'Ввариваем: сплошной шов по наружной части, точки по тонкому металлу', 'Зачищаем шов, наносим герметик и антикор в скрытую полость', 'Грунт, покраска, лак — в цвет кузова'], n: 'Меняем порог целиком, если гниль подошла к поддомкратнику: иначе он сложится под домкратом.' },
    arka: { t: 'Арка', s: ['Размечаем вырезку по шаблону колеса', 'Вырезаем, обрабатываем кромку', 'Изготавливаем ремонтную арку из металла 0,8–1,0 мм', 'Ввариваем, шов герметизируем', 'Антигравий и антикор по внутренней стороне', 'Покраска и полировка перехода'], n: 'Арку не «шпаклюем по ржавчине»: под шпаклёвкой гниль продолжается и вылезает через сезон.' },
    domkrat: { t: 'Поддомкратник', s: ['Проверяем силовой усилитель и соседние точки', 'Вырезаем деформированный металл', 'Восстанавливаем профиль и усилитель', 'Ввариваем усилитель, затем наружный лист', 'Антикор и защита днища', 'Проверяем домкратом под нагрузкой'], n: 'Поддомкратник — несущая точка. Если он сгнил, страдает не только порог, но и стойка.' },
    dnishche: { t: 'Днище', s: ['Поднимаем на подъёмнике, ищем сквозные и поверхностные очаги', 'Зачищаем, вырезаем сквозную коррозию', 'Ввариваем латки, шов провариваем', 'Наносим герметик по заводским швам', 'Антикоррозийная обработка снаружи и внутри', 'Виброизоляция по желанию'], n: 'Скрытые полости обрабатываем отдельно: без этого коррозия возвращается изнутри.' },
    lonzheron: { t: 'Лонжерон', s: ['Оцениваем деформацию и необходимость правки геометрии', 'Фиксируем кузов по контрольным точкам', 'Вырезаем повреждённый участок, готовим усилитель', 'Ввариваем с усилением и проверкой диагоналей', 'Антикор и защита сварного шва', 'Контроль зазоров и геометрии перед покраской'], n: 'Лонжерон — силовой элемент: после сварки обязательно проверяем геометрию кузова, иначе уводит углы и шины.' }
  };
  var wOut = $('wOut');
  if (wOut) {
    var btns = document.querySelectorAll('[data-weld]');
    function paintW(k) {
      var d = WELD[k]; if (!d) return;
      btns.forEach(function (b) { b.setAttribute('aria-current', b.getAttribute('data-weld') === k ? 'true' : 'false'); });
      wOut.innerHTML = '<h3>' + d.t + '</h3><ol class="steps">' + d.s.map(function (x, i) {
        return '<li class="step"><span class="step__n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span><p>' + x + '</p></li>';
      }).join('') + '</ol><p class="calc__note">' + d.n + '</p>';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { paintW(b.getAttribute('data-weld')); }); });
    paintW(btns.length ? btns[0].getAttribute('data-weld') : 'porog');
  }

  /* форма */
  if ($('sendForm')) {
    var g = function (n) { var el = document.querySelector('[name=' + n + ']'); return el ? el.value.trim() : ''; };
    $('sendForm').addEventListener('click', function (e) {
      e.preventDefault();
      var msg = 'Заявка с сайта Wellding: ' + g('name') + ' · ' + g('tel') + ' · авто: ' + g('car') + ' · задача: ' + g('task');
      $('formout').textContent = 'Открываю WhatsApp с готовым сообщением.';
      window.open('https://wa.me/375291414842?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
