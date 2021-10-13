#!/usr/bin/env node
"use strict";

const prompt = require("prompts");
const download = require("download");
const unzipper = require("unzipper");
const etl = require("etl");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");

let url = "https://github.com/Automattic/_s/archive/refs/heads/master.zip";

(async function () {
  const questions = [
    {
      type: "text",
      name: "theme_name",
      message: `What's your theme name?`,
      initial: `My Theme`,
    },
    {
      type: "text",
      name: "theme_slug",
      message: `What's the theme slug?`,
      initial: (prev) => slugify(prev, { replacement: "-", lower: true }),
      validate: (value) =>
        !value.match(/^[a-z](-?[a-z])*$/)
          ? `1) Use only lowercase letters and hyphens;\n2) Begin and end with a lowercase letter;\n3) Don't use consecutive hyphens;`
          : true,
    },
    {
      type: "text",
      name: "root_dir",
      message: "Where do you want to save the theme?",
      initial: (prev) => "./" + prev,
      validate: (value) =>
        fs.existsSync(value) ? `Sorry, this directory already exists.` : true,
    },
  ];

  const { root_dir, theme_name, theme_slug } = await prompt(questions, {
    onCancel: () => process.exit(),
  });

  const theme_prefix = theme_slug.replace(/-/g, "_") + "_";
  const doc_blocks = slugify(theme_name, { replacement: "_", lower: false });
  const prefixes = theme_slug + "-";
  const constants = theme_prefix.toUpperCase();

  download(url)
    .pipe(unzipper.Parse())
    .pipe(
      etl.map(async (entry) => {
        let entry_path = entry.path.replace("_s-master", root_dir);

        if ("Directory" === entry.type) {
          await fs.promises.mkdir(entry_path);
        } else {
          let content = await entry.buffer();
          content = content.toString();

          // 1 - Search for '_s' (inside single quotations) to capture the text domain and replace with: 'megatherium-is-awesome'.
          content = content.replace(/'_s'/g, `'${theme_slug}'`);

          // 2 - Search for _s_ to capture all the functions names and replace with: megatherium_is_awesome_.
          content = content.replace(/_s_/g, theme_prefix);

          // 3 - Search for Text Domain: _s in style.css and replace with: Text Domain: megatherium-is-awesome.
          content = content.replace(
            /Text Domain: _s/g,
            "Text Domain: " + theme_slug
          );

          // 4 - Search for  _s (with a space before it) to capture DocBlocks and replace with:  Megatherium_is_Awesome.
          content = content.replace(/ _s/g, " " + doc_blocks);

          // 5 - Search for _s- to capture prefixed handles and replace with: megatherium-is-awesome-.
          content = content.replace(/_s-/g, prefixes);

          // 6 - Search for _S_ (in uppercase) to capture constants and replace with: MEGATHERIUM_IS_AWESOME_.
          content = content.replace(/_S_/g, constants);

          // Replace personal information
          content = content.replace(
            /Theme Name: _s/g,
            "Theme Name: " + theme_name
          );

          // Rename _s.pot from languages folder to use the theme's slug
          if (entry_path.endsWith("_s.pot")) {
            entry_path = entry_path.replace("_s.pot", theme_slug + ".pot");
          }
          if (entry_path.endsWith("composer.json")) {
            content = content.replace("_s.pot", theme_slug + ".pot");
          }

          // Replacements inside PHPCS
          if (entry_path.endsWith("phpcs.xml.dist")) {
            content = content.replace(
              'name="text_domain" type="array" value="_s"',
              `name="text_domain" type="array" value="${theme_slug}"`
            );
            content = content.replace(
              'name="prefixes" type="array" value="_s"',
              `name="prefixes" type="array" value="${theme_prefix}"`
            );
          }

          await fs.promises.writeFile(entry_path, content);
        }

        //   entry.autodrain();
      })
    );
})();
