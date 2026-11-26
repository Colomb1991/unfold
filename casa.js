// Pagina di una casa: la visita 3D si carica solo quando la si chiede (pesa circa 2 MB e
// prepara la scena sul dispositivo), poi i pulsanti per mandare il link.
(function () {
  'use strict';
  var box = document.getElementById('visita');
  var indirizzo = location.href.split('#')[0].split('?')[0];

  function apri(variante) {
    var f = document.createElement('iframe');
    f.title = 'Visita 3D della casa';
    f.allow = 'fullscreen';
    f.src = 'visita.html?variante=' + encodeURIComponent(variante) + '&modo=vista&luce=giorno';
    box.textContent = '';
    box.appendChild(f);
    f.focus();
  }
  if (box) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-apri]') : null;
      if (b) apri(b.getAttribute('data-apri'));
    });
  }

  var wa = document.getElementById('whatsapp');
  if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(document.title.split(' · ')[0] + ': guarda la casa in 3D, vuota e arredata. ' + indirizzo);

  var copia = document.getElementById('copia');
  if (copia) {
    copia.addEventListener('click', function () {
      var fatto = function () {
        var prima = copia.textContent;
        copia.textContent = 'Link copiato';
        setTimeout(function () { copia.textContent = prima; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(indirizzo).then(fatto, function () { prompt('Copia il link:', indirizzo); });
      else prompt('Copia il link:', indirizzo);
    });
  }
})();
