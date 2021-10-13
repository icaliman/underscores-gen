# Generator based on [_s theme](https://github.com/automattic/_s)


Hi. Want to develop a WordPress theme and are looking for a good starter theme? That's what I'm here for. I'm a generator for the starter theme called `_s`, or `underscores`, if you like.

Installation
---------------

### Requirements

`_s` requires the following dependencies:

- [Node.js](https://nodejs.org/)
- [Composer](https://getcomposer.org/)

### Quick Start

#### 1 - Generate
Open the Terminal inside the WordPress `themes` directory and run the folowing commands:

```sh
$ cd /path/to/wp-content/themes
$ npx underscores-gen
```

You will be prompted to enter the theme name, slug and path.

#### 2 - Setup
To start using all the tools that come with `_s`  you need to install the necessary Node.js and Composer dependencies:

```sh
$ cd theme-dir
$ composer install
$ npm install
```

### Available CLI commands

`_s` comes packed with CLI commands tailored for WordPress theme development :

- `composer lint:wpcs` : checks all PHP files against [PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/).
- `composer lint:php` : checks all PHP files for syntax errors.
- `composer make-pot` : generates a .pot file in the `languages/` directory.
- `npm run compile:css` : compiles SASS files to css.
- `npm run compile:rtl` : generates an RTL stylesheet.
- `npm run watch` : watches all SASS files and recompiles them to css when they change.
- `npm run lint:scss` : checks all SASS files against [CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/).
- `npm run lint:js` : checks all JavaScript files against [JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/).
- `npm run bundle` : generates a .zip archive for distribution, excluding development and system files.

### Setup Visual Studio Code

1. Open Visual Studio Code.
2. Press `Ctrl+P` on Windows or `Cmd+P` on Mac to open the Quick Open dialog.
3. Type `ext install phpsab` to find the extension.
4. Press Enter or click the cloud icon to install it.
5. Restart Visual Studio Code!

Now you're ready to go! The next step is easy to say, but harder to do: make an awesome WordPress theme. :)