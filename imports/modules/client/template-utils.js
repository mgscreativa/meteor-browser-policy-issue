import $ from 'jquery';
import { Meteor } from 'meteor/meteor';

export const initializePxNav = (selector) => {
  const navElement = $(selector);

  if (navElement.length > 0) {
    navElement.pxNav();
  }
};

export const initializePxNavbar = (selector) => {
  const navBarElement = $(selector);

  if (navBarElement.length > 0) {
    navBarElement.pxNavbar();
  }
};

export const initializeTooltips = () => {
  const tooltipEnabledElements = $('[data-toggle="tooltip"]');

  if (tooltipEnabledElements.length > 0) {
    tooltipEnabledElements.tooltip();
  }
};

export const initializePopovers = () => {
  const popoverEnabledElements = $('[data-toggle="popover"]');

  if (popoverEnabledElements.length > 0) {
    popoverEnabledElements.popover();
  }
};

export const initializeResponsiveBg = () => {
  const backgrounds = [
    '/images/backgrounds/1.jpg',
    '/images/backgrounds/2.jpg',
    '/images/backgrounds/3.jpg',
    '/images/backgrounds/4.jpg',
    '/images/backgrounds/5.jpg',
    '/images/backgrounds/6.jpg',
    '/images/backgrounds/7.jpg',
    '/images/backgrounds/8.jpg',
    '/images/backgrounds/9.jpg',
    '/images/backgrounds/10.jpg',
    '/images/backgrounds/11.jpg',
    '/images/backgrounds/12.jpg',
  ];

  const background = Meteor.settings.public.backgroundIndex ?
    backgrounds[Meteor.settings.public.backgroundIndex]
    : backgrounds[Math.floor((Math.random() * backgrounds.length))];

  $('body').pxResponsiveBg({
    backgroundImage: background,
    overlay: '#000',
  });
};

export const destroyResponsiveBg = () => {
  $('body').pxResponsiveBg('destroy', true);
};
