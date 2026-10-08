/* =========================================================
   Lusion 风格复刻 · 脚本
   Step 1：目前交互由 CSS 动画承担，这里先预留初始化入口，
   后续步骤将加入：菜单开合、卡片标题滚动动画、平滑滚动等。
   ========================================================= */

(function () {
  "use strict";

  // 菜单按钮（Step 5 将加入全屏菜单开合，此处先占位）
  const menuBtn = document.getElementById("menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
    });
  }
})();
