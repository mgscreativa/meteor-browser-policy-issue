import toastr from 'toastr';

const alertBox = (message, title = '', type = 'success') => {
  if (!/^(?:warning|success|error)$/.test(type)) {
    console.log(`[alertBox] Type ${type} not supported`);
    return;
  }

  toastr[type](message, title, {
    positionClass: 'toast-bottom-right',
    closeButton: true,
    progressBar: true,
    preventDuplicates: true,
    newestOnTop: true,
    timeOut: 3000,
    extendedTimeOut: 1000,
    showDuration: 300,
    hideDuration: 500,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning',
    },
  });
};

export default alertBox;
