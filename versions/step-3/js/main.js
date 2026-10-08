/* =========================================================
   Lusion 风格复刻 · 脚本
   Step 3：标题逐字母滚动结构 + 卡片滚动入场
   ========================================================= */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* 调试：#static 时跳过所有动效（也用于截图验证） */
  var staticMode = window.location.hash === "#static";
  if (staticMode) document.documentElement.classList.add("no-anim");

  var reducedMotion =
    staticMode ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 标题逐字母拆分：每个字母 4 份拷贝（供 hover 滚动） ---- */
  document.querySelectorAll(".card-title").forEach(function (title) {
    var text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.textContent = "";

    var frag = document.createDocumentFragment();
    var i = 0;
    Array.from(text).forEach(function (ch) {
      if (ch === " ") {
        frag.append(document.createTextNode(" "));
        return;
      }
      var roll = document.createElement("span");
      roll.className = "roll";
      roll.style.setProperty("--i", i++);
      roll.setAttribute("aria-hidden", "true");

      var track = document.createElement("span");
      track.className = "roll-track";
      for (var c = 0; c < 4; c++) {
        var copy = document.createElement("span");
        copy.className = "roll-copy";
        copy.textContent = ch;
        track.append(copy);
      }
      roll.append(track);
      frag.append(roll);
    });
    title.append(frag);
  });

  /* ---- 滚动入场：直接检测（卡片数量少，无需 rAF 节流） ---- */
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".card")
  );

  if (reducedMotion) {
    cards.forEach(function (card) { card.classList.add("is-inview"); });
    return;
  }

  function reveal() {
    var limit = window.innerHeight * 0.92;
    cards = cards.filter(function (card) {
      if (card.getBoundingClientRect().top < limit) {
        card.classList.add("is-inview");
        return false;
      }
      return true;
    });
  }

  window.addEventListener("scroll", reveal, { passive: true });
  window.addEventListener("resize", reveal, { passive: true });
  document.addEventListener("visibilitychange", reveal);
  reveal();
})();
