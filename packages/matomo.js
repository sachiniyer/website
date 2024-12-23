var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "//track.sachiniyer.com/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0],
    timeout = setTimeout(function () {
      console.warn("Matomo script loading timed out.");
      if (g && g.parentNode) {
        g.parentNode.removeChild(g);
      }
    }, 1000); // 1 second timeout

  g.async = true;
  g.src = u + "matomo.js";

  g.onload = function () {
    clearTimeout(timeout); // Clear the timeout if the script loads successfully
  };

  g.onerror = function () {
    clearTimeout(timeout);
    console.error("Matomo script failed to load.");
  };

  s.parentNode.insertBefore(g, s);
})();
