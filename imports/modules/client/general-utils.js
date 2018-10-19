export const translateIntensity = intensity => {
  switch (intensity) {
    case 'low':
      return 'Baja';
    case 'medium':
      return 'Media';
    case 'high':
      return 'Alta';
    default:
      return 'Alta';
  }
};

export const translateState = state => {
  switch (state) {
    case -1:
      return 'Eliminado';
    case 0:
      return 'Despublicado';
    case 1:
      return 'Publicado';
  }
};

export const getStateColor = state => {
  switch (state) {
    case -1:
      return '#8f979f';
    case 0:
      return '#e46050';
    case 1:
      return '#58b75d';
  }
};
