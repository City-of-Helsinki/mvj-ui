import runtime from "offline-plugin/runtime";
runtime.install({
  onUpdateReady() {
    runtime.applyUpdate();
  },

  onUpdated() {
    location.reload();
  }

});