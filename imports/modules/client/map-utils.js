import React from 'react';
import { Meteor } from 'meteor/meteor';
import MapViewOSM from '../../client/ui/components/delete/MapViewOSM';
import MapView from '../../client/ui/components/delete/MapView';

const appSettings = Meteor.settings.public;

export const getMap = (location, mapHeight, dragMarker, getMarkerPos) => {
  if (location) {
    return React.createElement(
      appSettings.mapProvider === 'osm' ? MapViewOSM : MapView,
      {
        lat: location.lat,
        lng: location.lng,
        appSettings,
        mapHeight,
        dragMarker,
        getMarkerPos,
      },
    );
  }

  return (
    <div className="text-muted text-xs-center">
      <span className="valign-middle">No hay datos para crear el mapa</span>
    </div>
  );
};
