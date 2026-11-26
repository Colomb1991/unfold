// I filmati che partono da soli (senza audio). Se il telefono non li lascia partire, per esempio
// in risparmio energetico, compaiono i comandi: basta un tocco.
(function () {
  'use strict';
  Array.prototype.forEach.call(document.querySelectorAll('video[data-parte-da-solo]'), function (v) {
    v.muted = true;
    var mostraComandi = function () { v.setAttribute('controls', ''); };
    try {
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(mostraComandi);
    } catch (e) { mostraComandi(); }
  });
})();
