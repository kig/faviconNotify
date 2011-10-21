// Adapted from dynamic favicons
// By Mike Mahemoff
// http://softwareas.com/dynamic-favicons

FaviconNotify = {
  change: function(iconURL) {
    if (arguments.length==2) {
      document.title = optionalDocTitle;
    }
    this.addLink(iconURL, "icon");
    this.addLink(iconURL, "shortcut icon");
  },
  addLink: function(iconURL, relValue) {
    var link = document.createElement("link");
    link.type = 'image/png';
    link.rel = relValue;
    link.href = iconURL;
    this.removeLinkIfExists(relValue);
    this.docHead.appendChild(link);
    return link;
  },
  removeLinkIfExists: function(relValue) {
    var links = this.docHead.getElementsByTagName("link");
    for (var i=0; i<links .length; i++) {
      var link = links[i];
      if (link.rel==relValue) {
	this.docHead.removeChild(link);
	return; // Assuming only one match at most.
      }
    }
  },
  docHead:document.getElementsByTagName("head")[0],

  init : function(callback) {
    if (!this.originalIcon) {
      this.workCanvas = document.createElement('canvas');
      this.workCanvas.width = 16;
      this.workCanvas.height = 16;
      this.ctx = this.workCanvas.getContext('2d');
      this.readBackLink(callback);
    } else {
      callback.call(this);
    }
  },

  readBackLink : function(callback) {
    var c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    var link = document.querySelector('link[rel=icon]');
    this.originalIcon = c;
    if (link) {
      var img = new Image();
      var self = this;
      img.onload = function() {
        c.getContext('2d').drawImage(this, 0,0,16,16);
        callback.call(self);
      };
      img.src = link.href;
    } else {
      callback.call(this);
    }
  },

  updateIcon : function() {
    var d = this.workCanvas.toDataURL();
    this.change(d);
  },

  set : function(n) {
    this.init(function() {
      this.ctx.clearRect(0,0,16,16);
      this.ctx.drawImage(this.originalIcon, 0, 0);
      this.ctx.font = '9px Monospace';
      var w = this.ctx.measureText(n.toString()).width;
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(16-w-3,0,w+3,8);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(n.toString(), 16-w-1, 7);
      this.updateIcon();
    });
  },

  clear : function() {
    this.init(function() {
      this.ctx.clearRect(0,0,16,16);
      this.ctx.drawImage(this.originalIcon, 0, 0);
      this.updateIcon();
    });
  }
  
};
