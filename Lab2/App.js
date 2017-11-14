var TIMER_ID = -1;
var RENDER_RATE = 100;

function App(ch, lh, dh) {
  this.loadHook = lh;
  this.drawHook = dh;
  this.init = function(dh, lh) {
    this.drawHook = dh;
    this.loadHook = lh;
  };
  this.run = function() {
    this.loadHook();
    TIMER_ID = setInterval(this.drawHook, RENDER_RATE);
  };
  this.refresh = function() {
    if (this.drawHook) this.drawHook();
  };
}
