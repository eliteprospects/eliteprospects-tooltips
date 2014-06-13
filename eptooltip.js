var playerLinkPattern = /http:\/\/www\.eliteprospects\.com\/player\.php\?player=(\d+)/;
var playerApiEndpoint = 'http://api.eliteprospects.com/beta/players/[playerId]';

Opentip.prototype.setContent = function(content) {
    if(content) {
        var template = Handlebars.getTemplate('player');
        var player = JSON.parse(content).data;
        player.isActive = player.playerStatus == 'ACTIVE';
        this.content = template(player);
    }
    this._newContent = true;
    if (this.visible) {
        return this._updateElementContent();
    }
};

Opentip.styles.ep = {
    extends: 'glass',
//    target: true,
    tipJoint: 'left'
};

var links = document.getElementsByTagName('a');
var match;
for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (match = playerLinkPattern.exec(a.href)) {
        new Opentip(a, { style: 'ep', ajax: playerApiEndpoint.replace('[playerId]', match[1]) });
    }
}