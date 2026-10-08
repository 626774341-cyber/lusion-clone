/* =========================================================
   Lusion 风格复刻 · 脚本
   Step 3：标题逐字母滚动结构 + 卡片滚动入场
   Step 4：卡片滚动内收（远离视口中心时向内收缩）
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

  /* ---- 滚动内收（Step 4）：卡片离视口中心越远，缩得越小并向中心收 ---- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".card-link")
  );

  function pinch() {
    var half = window.innerHeight / 2;
    links.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) return;
      var off = r.top + r.height / 2 - half;   // 卡片中心相对视口中心的偏移
      var total = half + r.height / 2;
      var p = Math.min(Math.abs(off) / total, 1);
      var eased = p * p * (3 - 2 * p);          // smoothstep，中心不动、边缘收
      el.style.setProperty("--cs", (1 - 0.12 * eased).toFixed(4));   // 缩放：最远收到 0.88
      el.style.setProperty("--cr", (10 * eased).toFixed(2) + "px");  // 圆角随之变圆
      el.style.setProperty("--cy", (-Math.sign(off) * 16 * eased).toFixed(2) + "px"); // 向视口中心收
    });
  }

  if (reducedMotion) {
    cards.forEach(function (card) { card.classList.add("is-inview"); });
  } else {
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal, { passive: true });
    document.addEventListener("visibilitychange", reveal);
    reveal();

    window.addEventListener("scroll", pinch, { passive: true });
    window.addEventListener("resize", pinch, { passive: true });
    document.addEventListener("visibilitychange", pinch);
    pinch();
  }
})();
