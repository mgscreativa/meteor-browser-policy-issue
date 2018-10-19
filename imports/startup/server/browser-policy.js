import _ from 'lodash';
import { BrowserPolicy } from 'meteor/browser-policy-common';

BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.disallowEval();
// BrowserPolicy.content.allowEval();
// BrowserPolicy.content.allowFontDataUrl();

const trusted = [
  'localhost',
  'maps.googleapis.com',
  'maps.gstatic.com',
  'csi.gstatic.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'a.tile.openstreetmap.org',
  'b.tile.openstreetmap.org',
  'c.tile.openstreetmap.org',
  'blob:',
];

_.map(trusted, origin => BrowserPolicy.content.allowOriginForAll(origin));
