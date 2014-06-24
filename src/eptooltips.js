// Regex for finding player links.
var playerLinkPattern = /http:\/\/www\.eliteprospects\.com\/player\.php\?player=(\d+)/;

// Endpoint to get data about the player, [playerId] is replaced with the actual id.
var playerFields = 'firstName,lastName,dateOfBirth,birthPlace,clubOfOrigin,height,weight,playerStatus,playerPosition,shoots,imageUrl,country,latestPlayerStats';
var playerApiEndpoint = 'http://api.eliteprospects.com/beta/players/[playerId]?fields='+playerFields;

var capitalize = function(s) {
    if(s) {
        s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }
    return s;
};

// Custom helper for printing default value if empty
Handlebars.registerHelper('ifnotempty', function(prop) {
    return prop ? prop : '-';
});

// Override setContent since we fetch JSON instead of presentation ready HTML.
// Convert the JSON into HTML with a handlebars template.
Opentip.prototype.setContent = function(content) {
    if(content) {
        var template = Handlebars.getTemplate('player');
        var player = JSON.parse(content).data;
        player.isActive = player.playerStatus == 'ACTIVE';
        player.status = capitalize(player.playerStatus);
        player.isPlayer = player.playerPosition != 'GOALIE';
        player.position = capitalize(player.playerPosition);
        player.shoots = capitalize(player.shoots);
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
    tipJoint: 'left',
    background: '#ffffff',
    borderRadius: 3,
    borderWidth: 0,
    shadowOffset: [0,4],
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowBlur: 25
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