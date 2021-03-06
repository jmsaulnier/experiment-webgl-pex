'use strict';

var domready = require('domready');

var sys = require('pex-sys');
var glu = require('pex-glu');
var materials = require('pex-materials');
var color = require('pex-color');
var gen = require('pex-gen');
var helpers = require('pex-helpers');
var rnd = require('pex-random');
var geom = require('pex-geom');

/**
 * main module.
 * @module main
 */

domready(function () {

  var Plane = gen.Plane;


  sys.Window.create({
    settings: {
      width: 1280,
      height: 720,
      type: '3d',
      fullscreen: sys.Platform.isBrowser ? true : false
    },
    init: function() {

      this.plane = new Plane(20,20,50,50);

      this.terrain = new glu.Mesh(this.plane, new materials.SolidColor({ color: color.Color.Grey }), { lines: true });

      this.camera = new glu.PerspectiveCamera(60, this.width / this.height);
    },
    draw: function() {

      glu.viewport(0, 0, this.width, this.height);
      glu.clearColorAndDepth(color.Color.White);
      glu.enableDepthReadAndWrite(true);

      var plane = this.plane;

      this.terrain.geometry.vertices.forEach(function(v, vi) {
        var n = plane.vertices[vi].dup().normalize()
        var f = 0.01 * rnd.noise3(n.x, n.y, n.z + sys.Time.seconds);
        v.setVec3(plane.vertices[vi]);
        v.add(new geom.Vec3(0, 0, f));
      });

      this.terrain.geometry.vertices.dirty = true;
      this.terrain.geometry.computeNormals();

      this.terrain.draw(this.camera);

    }
  });


});

