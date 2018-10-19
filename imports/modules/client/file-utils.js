import { Meteor } from 'meteor/meteor';
import Files from '../../api/Files/Files';
import { getFileTypeFromMime } from '../string-utils';

const { debug } = Meteor.settings.public;

const uploadFile = ({
  fileObject = null,
  base64DataURI = null,
  uploadFolder,
  fileType,
  serverParams,
  shouldResize = false,
  onEnd = null,
}) => {
  if (fileType !== getFileTypeFromMime(fileObject.type)) {
    {
      if (debug) {
        console.log('File upload denied, wrong format', fileType);
      }

      return;
    }
  }

  if (fileObject && uploadFolder) {
    let file = null;

    if (fileObject && !base64DataURI) {
      file = {
        file: fileObject,
        fileName: fileObject.name,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: { uploadFolder, fileType, shouldResize },
        allowWebWorkers: true,
      };
    } else if (!fileObject && base64DataURI) {
      let extension = '';

      switch (base64DataURI.match(/[^,]*$/)[0].charAt(0)) {
        case '/':
          extension = 'jpg';
          break;
        case 'i':
          extension = 'png';
          break;
        case 'R':
          extension = 'gif';
          break;
      }

      file = {
        file: base64DataURI,
        isBase64: true,
        fileName: `report.${extension}`,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: { uploadFolder, fileType, shouldResize },
        allowWebWorkers: true,
      };
    } else {
      if (debug) {
        console.log(
          'File upload failed, nothing to upload, no fileObject or base64str provided',
        );
      }

      return;
    }

    return Files.insert(file, false)
      .on('end', (error, result) => {
        if (error) {
          if (debug) {
            console.log('Error during upload:', error);
          }

          return;
        }

        if (serverParams.methodToCall) {
          const { methodToCall, methodParams } = serverParams;

          Meteor.call(
            methodToCall,
            {
              ...methodParams,
              fileId: result._id,
            },
            (error, result) => {
              if (error) {
                if (debug) {
                  console.log(`Error in ${methodToCall}: ${error}`);
                }
              }

              if (debug) {
                console.log('uploadFile result:', result);
              }

              if (onEnd) {
                onEnd(error, result);
              }

              return;
            },
          );
        }
      })
      .start();
  }
};

export { uploadFile };
