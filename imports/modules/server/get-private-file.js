import fs from 'fs-extra';

export default path => fs.readFileSync(`assets/app/${path}`, 'utf8');
