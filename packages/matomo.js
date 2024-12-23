var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "//track.sachiniyer.com/";

  fetch(u + "matomo.php", { method: "HEAD" })
    .then(function (response) {
      if (response.ok) {
        console.log("Matomo server is reachable. Loading script.");
        _paq.push(["setTrackerUrl", u + "matomo.php"]);
        _paq.push(["setSiteId", "1"]);
        var d = document,
          g = d.createElement("script"),
          s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = u + "matomo.js";
        s.parentNode.insertBefore(g, s);
      } else {
        console.warn("Matomo server is unreachable. Script not loaded.");
      }
    })
    .catch(function (error) {
      console.error("Error reaching Matomo server:", error);
    });
})();
