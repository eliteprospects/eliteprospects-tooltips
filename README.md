# Eliteprospects Tooltips [![Dependency Status](https://gemnasium.com/menmo/eliteprospects-tooltips.svg)](https://gemnasium.com/menmo/eliteprospects-tooltips)

Show detailed information about hockey players directly on your site.

## Usage

Check out this page: [http://menmo.github.io/eliteprospects-tooltips](http://menmo.github.io/eliteprospects-tooltips)

The data is fetched from the [Eliteprospects API](https://github.com/menmo/eliteprospects-api-documentation).

This script can be used in conjunction with our [Wordpress plugin](https://github.com/menmo/eliteprospects-wordpress-player-link) that generate links.

## Develop

### Requirements (install globally)

* node
* bower
* gulp

### Install

    npm install
    bower install

### Build release version

    gulp bundle

### Deploy

Bump version, type can be `major`, `minor` or default `patch`

    gulp bump --type=minor

Deploy to `gh-pages`

    gulp deploy

Tag version before pushing to Git

    gulp tag
