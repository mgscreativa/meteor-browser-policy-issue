import { WebApp } from 'meteor/webapp';
import helmet from 'helmet';

WebApp.connectHandlers.use(helmet.noSniff());
WebApp.connectHandlers.use(helmet.frameguard({ action: 'deny' }));

WebApp.connectHandlers.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'maps.googleapis.com'],
      connectSrc: ['*'],
      imgSrc: [
        "'self'",
        'data:',
        'unpkg.com',
        'a.tile.openstreetmap.org',
        'b.tile.openstreetmap.org',
        'c.tile.openstreetmap.org',
        'maps.gstatic.com',
        'maps.googleapis.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'fonts.googleapis.com',
        'cdnjs.cloudflare.com',
        'unpkg.com',
      ],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
    },
    browserSniff: false,
  }),
);
