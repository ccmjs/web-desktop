'use strict';

/**
 * @overview <i>ccmjs</i>-based web component for a draggable app window.
 * @author André Kless <andre.kless@web.de> 2024
 * @license The MIT License (MIT)
 */

ccm.files[ 'ccm.window.js' ] = {
  name: 'window',
  ccm: '././libs/ccm/ccm.js',
  config: {
    "app": ["ccm.start", "././folder/ccm.folder.js"],
    "context": "././libs/context/ccm.context.js",
    "css": ["ccm.load", "././window/resources/styles.css"],
    "handover_app": "././libs/handover_app/ccm.handover_app.js",
    "html": {
      "inner": [
        {
          "tag": "header",
          "class": "draggable",
          "inner": [
            {"inner": "%title%"},
            {
              "tag": "nav",
              "inner": [
                {
                  "tag": "img",
                  "id": "context",
                  "src": "././window/resources/icons/context.svg",
                  "onclick": "%onContext%",
                },
                {
                  "tag": "img",
                  "id": "data",
                  "src": "././window/resources/icons/data.svg",
                  "onclick": "%onData%",
                },
                {
                  "tag": "img",
                  "id": "edit",
                  "src": "././window/resources/icons/edit.svg",
                  "onclick": "%onEdit%",
                },
                {
                  "tag": "img",
                  "id": "info",
                  "src": "././window/resources/icons/info.svg",
                  "onclick": "%onInfo%",
                },
                {
                  "tag": "img",
                  "id": "share",
                  "src": "././window/resources/icons/share.svg",
                  "onclick": "%onShare%",
                },
                {
                  "tag": "img",
                  "src": "././window/resources/icons/close.svg",
                  "onclick": "%onClose%",
                },
              ]
            },
          ]
        },
        {"tag": "main"},
      ]
    },
    "libs": ["ccm.load", "././libs/moveable/moveable.js"],
    "title": "App Window",
  },
  Instance: function () {

    let meta, component;

    /**
     * starts the app
     * @returns {Promise<void>}
     */
    this.start = async () => {

      // get meta data of app from DMS
      meta = this.app.ignore?.meta && await ccm.helper.solveDependency(this.app.ignore.meta);
      console.log(meta);

      // get component data of app from DMS
      component = meta && await ccm.get({name: 'dms2-components', url: 'https://ccm2.inf.h-brs.de'}, meta.component);
      console.log(component);

      // render main HTML structure
      this.element.innerHTML = '';
      this.element.appendChild(this.ccm.helper.html(this.html, {title: meta || component ? (component?.title || meta.component.toUpperCase()) + " | " + meta.title : this.title || "", ...this.events}));

      // render app in window
      this.element.querySelector('main').appendChild(this.app.root);

      // app is context app? => remove context button
      if (this.app.component.url === this.context)
        this.element.querySelector('#context').parentElement.removeChild(this.element.querySelector('#context'));

      // no app component data? => remove edit button
      !component && this.element.querySelector('#edit').parentElement.removeChild(this.element.querySelector('#edit'));

      // no app metadata? => remove data, info and share button
      if (!meta) {
        this.element.querySelector('#data').parentElement.removeChild(this.element.querySelector('#data'));
        this.element.querySelector('#info').parentElement.removeChild(this.element.querySelector('#info'));
        this.element.querySelector('#share').parentElement.removeChild(this.element.querySelector('#share'));
      }

      // make window draggable and resizable
      new Moveable( document.body, {
        target: this.element,
        //dragTarget: this.element.querySelector( '.draggable' ),
        draggable: true,
        resizable: true,
        hideDefaultLines: true,
        origin: false,
        renderDirections: [ 'e' ]
      } ).on( 'drag', ( { target, left, top } ) => {
        target.style.left = `${ left }px`;
        target.style.top = `${ top }px`;
      } ).on( 'resize', ( { target, width, height, delta } ) => {
        delta[ 0 ] && ( target.style.width = `${ width }px` );
        delta[ 1 ] && ( target.style.height = `${ height }px` );
      } );
    }

    /**
     * contains all event handlers
     * @type {Object.<string,Function>}
     */
    this.events = {

      /** when the context button is clicked */
      onContext: async () => this.open(this.context, { instance: this.app }),

      /** when the data button is clicked */
      onData: () => {

      },

      /** when the edit button is clicked */
      onEdit: () => component?.ignore?.editors && this.open(component.ignore.editors[0].app[1], component.ignore.editors[0].app[2]),

      /** when the info button is clicked */
      onInfo: () => {

      },

      /** when the share button is clicked */
      onShare: () => meta && this.open(this.handover_app, { tool: this.app.component.url, ignore: { config: { store: meta.ignore.config[1], key: meta.ignore.config[2]} } }),

      /** when the close button is clicked */
      onClose: () => {
        this.root.parentElement.removeChild(this.root);
        document.body.querySelectorAll('.moveable-control-box').forEach(element => element.parentElement.removeChild(element));
      },

    };

    /**
     * opens an app in a new window
     * @param {string} component - app component URL
     * @param {Object} [config] - app configuration
     * @returns {Promise<void>}
     */
    this.open = async (component, config) => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      await this.component.start({app: ["ccm.start", component, config], root: element});
    };
  }
};