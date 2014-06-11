var playerLinkPattern = /http:\/\/www\.eliteprospects\.com\/player\.php\?player=(\d+)/;
var playerApiEndpoint = 'http://api.eliteprospects.com/beta/players/[playerId]';

Opentip.prototype.setContent = function(content) {
    if(content) {
        var source = document.getElementById("player-template").innerHTML;
        var template = Handlebars.compile(source);
        this.content = template(JSON.parse(content).data);
    }
    this._newContent = true;
    if (this.visible) {
        return this._updateElementContent();
    }
};

var links = document.getElementsByTagName('a');
var match;
for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (match = playerLinkPattern.exec(a.href)) {
        var tip = new Opentip(a, { target: a, ajax: playerApiEndpoint.replace('[playerId]', match[1]) });
    }
}