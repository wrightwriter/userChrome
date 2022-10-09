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
    pointer-events: none;
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
    pointer-events: none;
    z-index: 1;
  }
`;
const TST_STR_OFF = ` `;

UC.TSTHack = {
  ENABLED: 'userChromeJS.tst.enabled',
  STYLE: undefined,
  
  tstCallback: function (e) {
    if(e.key == "F1"){
      let enabled = xPref.get(this.ENABLED);
      xPref.set(
        this.ENABLED,
        !enabled
      );

      this.setStyle( );  
    } 
  },

  init: function () {
    xPref.set(this.ENABLED, true, true);

    this.setStyle(  );  
    

    // CustomizableUI.registerArea('status-bar', {});
    // Services.obs.addObserver(this, 'browser-delayed-startup-finished');
    
    Services.obs.addObserver(this, 'UCJS:WebExtLoaded')
  },

  exec: function (win) {
    let document = win.document;
    let StatusPanel = win.StatusPanel;

    // alert("aaaa")
    win.addEventListener(
      "keydown",
      // this.tstCallback
      (e)=>{
        if(e.key == "F1"){
          let enabled = xPref.get(this.ENABLED);
          xPref.set(
            this.ENABLED,
            !enabled
          );
    
          this.setStyle( );  
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


  setStyle: function () {
    let on = xPref.get(this.ENABLED);

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

    if(this.STYLE){
      _uc.sss.unregisterSheet(this.STYLE.url, this.STYLE.type);
    }
    
    _uc.windows((doc, win) => {
      win.removeEventListener(
        "keydown",
        this.tstCallback
        ,true
      );
    });

    Services.obs.removeObserver(this, 'UCJS:WebExtLoaded');
    // this.webExts.forEach(id => {
    //   UC.webExts.get(id)?.messageManager.sendAsyncMessage('UCJS:MGest', 'destroy');
    // });

    delete UC.TSTHack;
  }
}

UC.TSTHack.init();
