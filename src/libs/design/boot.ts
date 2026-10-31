import { SETTINGS_STORAGE_KEY } from "@/libs/constants/screens/settings/base"

import { DESIGN } from "./config"

/**
 * Скрипт выполняется в <head> ДО первой отрисовки (синхронно, ~700 байт):
 *  - data-platform="ios"  → включает Liquid Glass чисто через CSS (без JS в компонентах и без «моргания»)
 *  - data-perf="low|high" → слабое устройство: стекло и бесконечные анимации выключаются
 *  - data-accent / density / motion / text-size из кэша настроек (localStorage),
 *    чтобы акцентный цвет не «перескакивал» после гидратации.
 */
export const BOOT_SCRIPT =
	`(function(){try{var d=document.documentElement,n=navigator,c=n.connection||{};
if(/iPhone|iPad|iPod/i.test(n.userAgent)||(n.platform==="MacIntel"&&n.maxTouchPoints>1))d.dataset.platform="ios";
var low=(n.deviceMemory&&n.deviceMemory<${DESIGN.perf.lowMemoryGb})||(n.hardwareConcurrency&&n.hardwareConcurrency<${DESIGN.perf.lowCores})||c.saveData||/(^|-)(2|3)g$/.test(c.effectiveType||"");
d.dataset.perf=low?"low":"high";
var s=JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_STORAGE_KEY)})||"null");
if(s){if(s.accent)d.dataset.accent=s.accent;if(s.density)d.dataset.density=s.density;if(s.animations)d.dataset.motion=s.animations;if(s.textSize)d.dataset.textSize=s.textSize}
else d.dataset.accent="orange"}catch(e){}})();`.replaceAll("\n", "")
