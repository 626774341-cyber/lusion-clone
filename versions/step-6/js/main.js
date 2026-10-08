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
  document.querySelectorAll(".card-title, .cta-link").forEach(function (title) {
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

  /* ---- 滚动入场：直接检测（元素数量少，无需 rAF 节流） ---- */
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".card, [data-reveal]")
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

  /* ---- 全屏菜单开合（Step 6） ---- */
  var menuBtn = document.getElementById("menu-btn");
  var menuOverlay = document.getElementById("menu-overlay");

  function setMenu(open) {
    document.documentElement.classList.toggle("menu-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open));
    if (menuOverlay) menuOverlay.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = menuOverlay && menuOverlay.querySelector(".menu-link");
      if (first) first.focus();
    } else if (menuBtn) {
      menuBtn.focus();
    }
  }

  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener("click", function () {
      setMenu(!document.documentElement.classList.contains("menu-open"));
    });
    menuOverlay.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false); // 点链接后先收起菜单再跳锚点
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.documentElement.classList.contains("menu-open")) {
        setMenu(false);
      }
    });
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
      var intensity = Math.min(Math.abs(v) / 16, 1); // 平滑滚动下单帧位移较小，阈值相应调低
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

  /* ---- 订阅表单（Step 5/6，纯演示无后端；页脚与菜单各一份） ---- */
  document.querySelectorAll(".news-form").forEach(function (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = newsForm.querySelector("input");
      var btn = newsForm.querySelector("button");
      if (!input.value || !input.checkValidity()) {
        input.focus();
        return;
      }
      input.disabled = true;
      btn.disabled = true;
      btn.textContent = "\u2713";
      btn.style.fontSize = "18px";
      var note = newsForm.parentElement.querySelector(".news-note");
      if (note) note.textContent = "Thanks — you're on the list. (demo, no backend)";
    });
  });

  /* ---- 平滑滚动（Step 6）：滚轮 → lerp 目标，键盘/锚点仍走原生 ---- */
  var isCoarse = window.matchMedia("(pointer: coarse)").matches;
  if (!reducedMotion && !isCoarse) {
    var sTarget = window.scrollY;
    var sCurrent = window.scrollY;
    var sActive = false;
    var sLoopOn = false;

    function maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }

    function sLoop() {
      sCurrent += (sTarget - sCurrent) * 0.095;
      window.scrollTo(0, sCurrent);
      if (Math.abs(sTarget - sCurrent) < 0.5) {
        window.scrollTo(0, sTarget);
        sCurrent = sTarget;
        sActive = false;
        sLoopOn = false;
        return;
      }
      requestAnimationFrame(sLoop);
    }

    function startLoop() {
      if (!sLoopOn) {
        sLoopOn = true;
        requestAnimationFrame(sLoop);
      }
    }

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) return; // 保留缩放
      e.preventDefault();
      if (!sActive) {
        sActive = true;
        sCurrent = window.scrollY;
        sTarget = sCurrent;
      }
      sTarget = Math.max(0, Math.min(sTarget + e.deltaY, maxScroll()));
      startLoop();
    }, { passive: false });

    // 非平滑滚动期间（滚动条拖动、键盘、锚点）同步目标，避免跳回
    window.addEventListener("scroll", function () {
      if (!sActive) {
        sTarget = sCurrent = window.scrollY;
      }
    }, { passive: true });
  }
})();
