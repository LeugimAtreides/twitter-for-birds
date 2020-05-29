import Cookies from 'js-cookie';

export default class Auth {
  static isLoggedIn() {
    return !!Cookies.get('id_token');
  }
}
