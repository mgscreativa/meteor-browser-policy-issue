import Login from '../../client/ui/pages/Login/index';

import IndexPage from '../../client/ui/pages/IndexPage/index';

const routesData = [
  {
    private: false,
    path: '/login',
    component: Login,
  },

  {
    private: true,
    path: '/',
    component: IndexPage,
    title: 'Inicio',
    icon: 'mdi mdi-home',
  },
];

export default routesData;
