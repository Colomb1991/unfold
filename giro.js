// "Gira la casa": la casa vista da piu' angoli, vuota e arredata, fatta di immagini gia' pronte.
// Non c'e' niente da calcolare sul telefono: si apre subito e non puo' bloccarsi.
// Si trascina col dito (o col mouse) per girarla; i due pulsanti cambiano vuota / arredata
// tenendo lo stesso angolo.
(function () {
  'use strict';
  var fermo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('.giro'), function (box) {
    var img = box.querySelector('.giro__img');
    var n = Number(box.getAttribute('data-n')) || 0;
    var base = box.getAttribute('data-base') || '';
    if (!img || n < 2) return;
    var variante = box.getAttribute('data-variante') || 'arredata';
    var angolo = 0, toccato = false, pronte = {};
    var indirizzo = function (v, k) { return base + v + '-' + k + '.jpg'; };

    // Si caricano prima le immagini della variante in vista, poi le altre: la prima e' gia' nella pagina.
    var carica = function (v) {
      for (var k = 0; k < n; k++) {
        (function (chiave, url) {
          if (pronte[chiave]) return;
          var im = new Image();
          im.decoding = 'async';
          im.src = url;
          pronte[chiave] = im;
        })(v + '-' + k, indirizzo(v, k));
      }
    };
    var mostra = function () {
      img.src = indirizzo(variante, ((angolo % n) + n) % n);
    };
    carica(variante);
    setTimeout(function () { carica(variante === 'arredata' ? 'vuota' : 'arredata'); }, 1200);

    // Trascinare in orizzontale gira la casa; in verticale la pagina scorre come sempre.
    var da = null, passo = 46;
    box.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('button')) return;
      da = e.clientX; toccato = true;
      box.classList.add('giro--presa');
    });
    window.addEventListener('pointermove', function (e) {
      if (da === null) return;
      var d = e.clientX - da;
      if (Math.abs(d) < passo) return;
      var scatti = d > 0 ? Math.floor(d / passo) : Math.ceil(d / passo);
      angolo -= scatti; da += scatti * passo;
      mostra();
    });
    var lascia = function () { da = null; box.classList.remove('giro--presa'); };
    window.addEventListener('pointerup', lascia);
    window.addEventListener('pointercancel', lascia);

    Array.prototype.forEach.call(box.querySelectorAll('[data-variante-scelta]'), function (b) {
      b.addEventListener('click', function () {
        toccato = true;
        variante = b.getAttribute('data-variante-scelta');
        Array.prototype.forEach.call(box.querySelectorAll('[data-variante-scelta]'), function (x) {
          x.setAttribute('aria-pressed', String(x === b));
        });
        carica(variante);
        mostra();
      });
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-gira]'), function (b) {
      b.addEventListener('click', function () {
        toccato = true;
        angolo += Number(b.getAttribute('data-gira'));
        mostra();
      });
    });

    // La prima volta che entra nello schermo fa un giro da sola, per far capire che si gira.
    if (fermo || !('IntersectionObserver' in window)) return;
    var visto = new IntersectionObserver(function (voci) {
      if (!voci[0].isIntersecting) return;
      visto.disconnect();
      var fatti = 0;
      var gira = function () {
        if (toccato || fatti >= n) return;
        angolo += 1; fatti += 1; mostra();
        setTimeout(gira, 420);
      };
      setTimeout(gira, 900);
    }, { threshold: 0.6 });
    visto.observe(box);
  });
})();
