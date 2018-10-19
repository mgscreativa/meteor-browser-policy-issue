import bootbox from 'bootbox';

const confirmDelete = (message, callback, title = 'Cuidado!') => {
  bootbox.dialog({
    title: '<div class="modal-header"><i class="mdi mdi-alert"></i></div>',
    message: `<h4>${title}</h4><p>${message}</p>`,
    className: 'modal-alert modal-warning',
    backdrop: true,
    closeButton: false,
    buttons: {
      cancel: {
        label: '<i class="mdi mdi-close"></i> Cancelar',
      },
      confirm: {
        label: '<i class="mdi mdi-delete"></i> Eliminar',
        className: 'btn-danger',
        callback,
      },
    },
  });
};

const popupWithContent = (content, title = '', callback = null, buttonLabels = null) => {
  const newButtonLabels = {};

  newButtonLabels.confirmLabel = (buttonLabels && buttonLabels.confirmLabel) ? buttonLabels.confirmLabel : 'Cerrar';

  bootbox.dialog({
    // title: '<div class="modal-header"><i class="mdi mdi-alert"></i></div>',
    message: `<h4>${title}</h4><p>${content}</p>`,
    className: 'modal-popup-with-content',
    backdrop: true,
    closeButton: false,
    buttons: {
      confirm: {
        label: newButtonLabels.confirmLabel,
        className: 'btn-success',
        callback,
      },
    },
  });
};

export {
  confirmDelete,
  popupWithContent,
};
