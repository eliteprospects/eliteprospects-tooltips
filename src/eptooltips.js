// Regex for finding player links.
var apiKey = 'd8b49aaee3f180db0ca351f547f4e1e8';
var types = [{
        pattern: /https?:\/\/www\.eliteprospects\.com\/player(?:\.php\?player=|\/)(\d+)/,
        endpoint: 'https://api.eliteprospects.com/v1/players/[id]?apiKey=[apiKey]&fields=[fields]',
        fields: [
            'firstName',
            'lastName',
            'dateOfBirth',
            'placeOfBirth',
            'youthTeam',
            'status',
            'position',
            'shoots',
            'imageUrl',
            'nationality.name',
            'nationality.flagUrl.small',
            'latestStats.team.name'
        ],
        template: 'player',
        format: function(data) {
            data.isActive = data.status == 'ACTIVE';
            data.status = capitalize(data.status);
            data.isPlayer = data.position != 'GOALIE';
            data.position = capitalize(data.position.replace('_', ' '));
            data.shoots = capitalize(data.shoots);
            data.age = calcAge(data.dateOfBirth);
            return data;
        }
    }, {
        pattern: /https?:\/\/www\.eliteprospects\.com\/staff(?:\.php\?staff=|\/)(\d+)/,
        endpoint: 'https://api.eliteprospects.com/v1/staff/[id]?apiKey=[apiKey]&fields=[fields]',
        fields: [
            'firstName',
            'lastName',
            'dateOfBirth',
            'placeOfBirth',
            'imageUrl',
            'nationality.name',
            'nationality.flagUrl.small',
            'latestStats.team.name',
            'latestStats.league.name',
            'latestStats.season.slug',
            'latestStats.role'
        ],
        template: 'staff',
        format: function(data) {
            data.age = calcAge(data.dateOfBirth);
            return data;
        }
}];

var capitalize = function (s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
};

var calcAge = function (birthday) {
    if(birthday) {
        var diff = Date.now() - new Date(birthday).getTime();
        return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    }
};

var findTypeOfLink = function(link) {
    for(var j = 0; j < types.length; j++) {
        var type = types[j];
        if (match = type.pattern.exec(link)) {
            return type;
        }
    }
};

// Custom helper for printing default value if empty
Handlebars.registerHelper('ifnotempty', function (prop) {
    return prop ? prop : '-';
});

// Override setContent since we fetch JSON instead of presentation ready HTML.
// Convert the JSON into HTML with a handlebars template.
Opentip.prototype.setContent = function (content) {
    if (content[0] == '{') {
        var type = findTypeOfLink(this.triggerElement[0].href);
        if(type) {
            var template = Handlebars.getTemplate(type.template);
            var data = JSON.parse(content).data;
            this.content = template(type.format(data));
        }
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
    shadowOffset: [0, 4],
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowBlur: 25
};

var createTooltip = function(a) {
    for(var j = 0; j < types.length; j++) {
        var type = types[j];
        var match = type.pattern.exec(a.href);
        if (match) {
           new Opentip(a, {
                style: 'ep',
                ajax: type.endpoint
                    .replace('[id]', match[1])
                    .replace('[apiKey]', apiKey)
                    .replace('[fields]', type.fields)
            });
        }
    }
}

// Find all links on the page and attach a tooltip.
var links = document.getElementsByTagName('a');

for (var i = 0; i < links.length; i++) {
    createTooltip(links[i]);
}

window.epTooltip = createTooltip;