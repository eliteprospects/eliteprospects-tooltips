# Eliteprospects Tooltips [![Dependency Status](https://gemnasium.com/menmo/eliteprospects-tooltips.svg)](https://gemnasium.com/menmo/eliteprospects-tooltips)

Show detailed information about hockey players directly on your site.

## Usage

Check out this page: [http://menmo.github.io/eliteprospects-tooltips](http://menmo.github.io/eliteprospects-tooltips)

The data is fetched from the [Eliteprospects API](https://github.com/menmo/eliteprospects-api-documentation).

This script can be used in conjunction with our [Wordpress plugin](https://github.com/menmo/eliteprospects-wordpress-player-link) that generate links.

## Develop

### Requirements

* node

### Install

    npm install
    
### Run

Point a webserver at the project root, for example.

    http-server
    
Open in browser.
    
    http://localhost:8080/dev.html

### Build release version

    gulp bundle

### Deploy

Bump version, type can be `major`, `minor` or default `patch`

    gulp bump --type=minor

Deploy to `gh-pages`

    gulp deploy
    
Commit changes and then tag version

    gulp tag
