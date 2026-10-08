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

  if (reducedMotion) {
    cards.forEach(function (card) { card.classList.add("is-inview"); });
  } else {
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal, { passive: true });
    document.addEventListener("visibilitychange", reveal);
    reveal();
  }

  /* ---- 页面整体内收（Step 4 重做）----
     滚动速度越快，整个 <main> 向视口中心收缩越多（最大约 4.5%），
     停止滚动后回弹到 1。变换原点始终跟随视口中心（--oy），
   因此任意滚动位置看到的都是整页向当前视野中心收拢。 */
  if (!reducedMotion) {
    var main = document.querySelector("main");
    var pageScale = 1;
    var lastY = window.scrollY;
    var rafId = null;

    function pageLoop() {
      var y = window.scrollY;
      var v = y - lastY; // 本帧滚动距离（带方向）
      lastY = y;
      var intensity = Math.min(Math.abs(v) / 60, 1);
      var target = 1 - 0.045 * intensity;
      pageScale += (target - pageScale) * 0.12;
      main.style.setProperty("--ps", pageScale.toFixed(4));
      main.style.setProperty("--oy", y + window.innerHeight / 2 + "px");
      if (intensity === 0 && Math.abs(pageScale - 1) < 0.0005) {
        main.style.setProperty("--ps", "1");
        rafId = null; // 完全回弹后停帧，下次滚动事件再启动
        return;
      }
      rafId = requestAnimationFrame(pageLoop);
    }

    function kickPage() {
      if (rafId === null) rafId = requestAnimationFrame(pageLoop);
    }

    window.addEventListener("scroll", kickPage, { passive: true });
    window.addEventListener("resize", kickPage);
    document.addEventListener("visibilitychange", kickPage);
    kickPage();
  }
})();
