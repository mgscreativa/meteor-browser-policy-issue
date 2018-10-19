const cdnStyles = [
  '//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,600,700,300&subset=latin',
  '//cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/2.6.95/css/materialdesignicons.min.css',
  '//unpkg.com/leaflet@1.3.4/dist/leaflet.css',
];

const headFirstChild = document.querySelector('head').firstChild;

for (let i = 0; i < cdnStyles.length; i++) {
  let style = document.createElement('link');
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', cdnStyles[i]);
  document.querySelector('head').insertBefore(style, headFirstChild);
}
