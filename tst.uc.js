// ==UserScript==
// @name            TST
// @author          wrighter
// @include         main
// @startup         UC.TSTHack.exec(win);
// @shutdown        UC.TSTHack.destroy();
// @onlyonce
// ==/UserScript==

const { CustomizableUI, StatusPanel } = window;

const TST_STR_ON = `
  #sidebar-box[sidebarcommand="treestyletab_piro_sakura_ne_jp-sidebar-action"]{
    min-width: 40px !important;
    max-width: 40px !important;
    width: 40px !important;
    transition: all 0.2s ease;
  }
  #sidebar-box[sidebarcommand="treestyletab_piro_sakura_ne_jp-sidebar-action"]:hover
  /*
  #sidebar-box[sidebarcommand="treestyletab_piro_sakura_ne_jp-sidebar-action"] #sidebar
  */
  {
    min-width: 160px !important;
    max-width: 160px !important;
    width: 160px !important;
    transition: all 0.2s ease;
    z-index: 1;
  }
`;
const TST_STR_OFF = ` `;

UC.TSTHack = {
  ENABLED: 'userChromeJS.tst.enabled',

  init: function () {

    // this.setStyle( true);  
    xPref.set(this.ENABLED, true, true);
    // this.enabledListener = xPref.addListener(this.PREF_ENABLED, (isEnabled) => {
    //   CustomizableUI.getWidget('status-dummybar').instances.forEach(dummyBar => {
    //     dummyBar.node.setAttribute('collapsed', !isEnabled);
    //   });
    // });
    
    // -------- LISTEN FOR STATUS -------- // 
    // this.textListener = xPref.addListener(this.PREF_STATUSTEXT, (isEnabled) => {
    //   if (!UC.statusBar.enabled)
    //     return;

    //   _uc.windows((doc, win) => {
    //     let StatusPanel = win.StatusPanel;
    //     if (isEnabled)
    //       win.statusbar.textNode.appendChild(StatusPanel._labelElement);
    //     else
    //       StatusPanel.panel.appendChild(StatusPanel._labelElement);
    //   });
    // });

    this.setStyle( xPref.get(this.ENABLED) );  
    

    // CustomizableUI.registerArea('status-bar', {});

    // Services.obs.addObserver(this, 'browser-delayed-startup-finished');
    
    Services.obs.addObserver(this, 'UCJS:WebExtLoaded')
  },

  exec: function (win) {
    // alert("amogus");
    let document = win.document;
    let StatusPanel = win.StatusPanel;

    document.addEventListener(
      "keydown",
      (e)=>{
        // if(e.key = "F1"){
        // if(true){
          // alert("aaa")
        // if(e.key = "F1"){
        if(e.key == "F1"){
          let enabled = xPref.get(this.ENABLED);
          xPref.set(
            this.ENABLED,
            !enabled
          );

          this.setStyle( enabled );  
        } 
      } 
      ,true
    );

    // if (!this.enabled)
    //   bottomBox.collapsed = true;

    // bottomBox.appendChild(win.statusbar.node);

    // _uc.
    // if (document.readyState === 'complete')
    //   this.observe(win);
  },

  // observe: function (win) {
  //   CustomizableUI.registerToolbarNode(win.statusbar.node);
  // },

  // orig: Object.getOwnPropertyDescriptor(StatusPanel, '_label').set.toString(),


  setStyle: function (
    on 
  ) {
    if(this.STYLE){
      _uc.sss.unregisterSheet(this.STYLE.url, this.STYLE.type);
    }

    let str = ``
    if(on){
      str = TST_STR_ON
    } else {
      str = TST_STR_OFF
    }

    this.STYLE = {
      url: Services.io.newURI('data:text/css;charset=UTF-8,' + encodeURIComponent(`
        @-moz-document url('${_uc.BROWSERCHROME}') {
          ` + str + `
        }
      `)),
      type: _uc.sss.USER_SHEET
    }
    _uc.sss.loadAndRegisterSheet(this.STYLE.url, this.STYLE.type);
  },
  
  destroy: function () {
    // const { CustomizableUI } = Services.wm.getMostRecentBrowserWindow();

    // xPref.removeListener(this.enabledListener);
    // xPref.removeListener(this.textListener);
    // CustomizableUI.unregisterArea('status-bar');
    // _uc.sss.unregisterSheet(this.STYLE.url, this.STYLE.type);
    // _uc.windows((doc, win) => {
    //   const { eval, statusbar, StatusPanel } = win;
    //   eval('Object.defineProperty(StatusPanel, "_label", {' + this.orig.replace(/^set _label/, 'set') + ', enumerable: true, configurable: true});');
    //   StatusPanel.panel.appendChild(StatusPanel._labelElement);
    //   doc.getElementById('status-dummybar').remove();
    //   statusbar.node.remove();
    // });
    // Services.obs.removeObserver(this, 'browser-delayed-startup-finished');
    
    _uc.windows((doc, win) => {
      const { customElements } = win;

      doc.removeEventListener('mousemove', this, false);
      doc.documentElement.removeEventListener('mouseleave', this, false);

      Object.defineProperty(customElements.get('tabbrowser-tab').prototype, '_selected', {
        set: win.orig_selected,
        configurable: true
      });

      win.removeEventListener('AppCommand', win.HandleAppCommandEvent, true);
      win.HandleAppCommandEvent = win._HandleAppCommandEvent;
      delete win._HandleAppCommandEvent;
      win.addEventListener('AppCommand', win.HandleAppCommandEvent, true);

      delete win.orig_selected;
    });

    delete UC.TSTHack;
  }
}

UC.TSTHack.init();
