// Confronto vuota / arredata: il cursore invisibile sopra le due immagini sposta il taglio.
// Al primo ingresso nello schermo il taglio si muove da solo una volta, per far capire che si trascina.
(function () {
  'use strict';
  var fermo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('.confronto'), function (box) {
    var input = box.querySelector('input');
    if (!input) return;
    var toccato = false;
    var metti = function (v) { box.style.setProperty('--taglio', v + '%'); };
    input.addEventListener('input', function () { toccato = true; metti(input.value); });
    metti(input.value);
    if (fermo || !('IntersectionObserver' in window)) return;
    var visto = new IntersectionObserver(function (voci) {
      if (!voci[0].isIntersecting) return;
      visto.disconnect();
      var inizio = null, da = 50, tappe = [50, 16, 78, 50], durata = 2600;
      var passo = function (t) {
        if (toccato) return;
        if (inizio === null) inizio = t;
        var k = Math.min(1, (t - inizio) / durata), n = tappe.length - 1;
        var i = Math.min(n - 1, Math.floor(k * n)), f = k * n - i;
        var morbido = f * f * (3 - 2 * f);
        var v = tappe[i] + (tappe[i + 1] - tappe[i]) * morbido;
        input.value = v; metti(v);
        if (k < 1) requestAnimationFrame(passo);
      };
      setTimeout(function () { requestAnimationFrame(passo); }, 500);
    }, { threshold: 0.5 });
    visto.observe(box);
  });
})();
