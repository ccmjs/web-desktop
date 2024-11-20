'use strict';

/**
 * @overview <i>ccmjs</i>-based web component for an app folder.
 * @author André Kless <andre.kless@web.de> 2024
 * @license The MIT License (MIT)
 */

ccm.files[ 'ccm.folder.js' ] = {
  name: 'folder',
  ccm: '././libs/ccm/ccm.js',
  config: {
    "apps": [
      ["ccm.start", "././folder/ccm.folder.js", {
        apps: [
          ["ccm.start", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js"],
          ["ccm.start", "https://ccmjs.github.io/akless-components/blank_blank/ccm.blank_blank.js"],
        ],
        title: "Unterordner",
        ignore: {
          meta: {
            icon: "././folder/resources/icons/folder.png",
            title: "Unterordner",
            component: "Folder"
          }
        }
      }],
      ["ccm.start", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js"],
      ["ccm.start", "https://ccmjs.github.io/akless-components/blank_blank/ccm.blank_blank.js"],
      ["ccm.start", "https://ccmjs.github.io/akless-components/quiz/ccm.quiz.min.js", ["ccm.get", { "name": "dms2-configs", "url": "https://ccm2.inf.h-brs.de" }, ["quiz", "1581493641369X7741789624303226"]]],
    ],
    "css": [ "ccm.load", "././folder/resources/styles.css" ],
    "helper": [ "ccm.load", { "url": "././libs/ccm/helper.js", "type": "module" } ],
    "html": {
      "inner": [
        /*
        {
          "tag": "h1",
          "inner": "%title%"
        },
         */
        { "tag": "main" },
      ]
    },
    "title": "Web-Desktop",
    "window": ["ccm.component", "././window/ccm.window.js"],
  },
  Instance: function () {

    let meta, component;

    /**
     * starts the app
     * @returns {Promise<void>}
     */
    this.start = async () => {

      // render main HTML structure
      this.element.innerHTML = '';
      this.element.appendChild(this.ccm.helper.html(this.html, {title: this.title}));
      const $main = this.element.querySelector('main');

      // list apps in folder
      for (let i = 0; i < this.apps.length; i++) {
        const meta = this.apps[i].ignore?.meta && await ccm.helper.solveDependency(this.apps[i].ignore.meta);
        const element = document.createElement('div');
        element.classList.add('app');
        element.innerHTML = `
          <img src="${meta?.icon || '././folder/resources/icons/app.svg'}">
          <div>${meta?.title || this.apps[i].component.name || "App"}</div>
        `;
        $main.appendChild(element);
        element.addEventListener('click', () => this.open(this.apps[i].component.url, JSON.parse(this.apps[i].config)));
      }
    }

    /**
     * opens an app in a new window
     * @param {string} component - app component URL
     * @param {Object} [config] - app configuration
     * @returns {Promise<void>}
     */
    this.open = async (component, config) => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      await this.window.start({app: ["ccm.start", component, config], root: element});
    };
  }
};