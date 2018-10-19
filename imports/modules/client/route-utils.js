import Signup from '../../client/ui/pages/Signup/index';
import Login from '../../client/ui/pages/Login/index';
import RecoverPassword from '../../client/ui/pages/RecoverPassword/index';
import ResetPassword from '../../client/ui/pages/ResetPassword/index';
import Terms from '../../client/ui/pages/Terms/index';
import Privacy from '../../client/ui/pages/Privacy/index';

import IndexPage from '../../client/ui/pages/IndexPage/index';

// Users related components
import Users from '../../client/ui/pages/Users/index';

const routesData = [
  {
    private: false,
    path: '/signup',
    component: Signup,
  },
  {
    private: false,
    path: '/login',
    component: Login,
  },
  {
    private: false,
    path: '/recover-password',
    component: RecoverPassword,
  },
  {
    private: false,
    path: '/reset-password/:token',
    component: ResetPassword,
  },
  {
    private: false,
    path: '/terms',
    component: Terms,
    hideRegister: true,
  },
  {
    private: false,
    path: '/privacy',
    component: Privacy,
    hideRegister: true,
  },

  {
    private: true,
    path: '/',
    component: IndexPage,
    title: 'Inicio',
    icon: 'mdi mdi-home',
  },

  // Users related components
  {
    private: true,
    path: '/users',
    component: Users,
    title: 'Usuarios',
    icon: 'mdi mdi-account-multiple',
  },
];

export default routesData;
