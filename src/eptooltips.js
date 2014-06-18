// Regex for finding player links.
var playerLinkPattern = /http:\/\/www\.eliteprospects\.com\/player\.php\?player=(\d+)/;

// Endpoint to get data about the player, [playerId] is replaced with the actual id.
var playerApiEndpoint = 'http://api.eliteprospects.com/beta/players/[playerId]';

// Override setContent since we fetch JSON instead of presentation ready HTML.
// Convert the JSON into HTML with a handlebars template.
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

// Style for tooltip.
Opentip.styles.ep = {
    extends: 'glass',
    className: 'ep',
    tipJoint: 'left'
};

// Find all links on the page and attach a tooltip.
var links = document.getElementsByTagName('a');
var match;
for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (match = playerLinkPattern.exec(a.href)) {
        new Opentip(a, { style: 'ep', ajax: playerApiEndpoint.replace('[playerId]', match[1]) });
    }
}