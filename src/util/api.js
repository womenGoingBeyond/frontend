export default class Api {
  static baseURL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  /**
   *
   * @param endpoint {string}
   * @param param {string}
   * @return {Promise<object>}
   */
  static async get(endpoint, param = '') {
    if (!endpoint || typeof endpoint !== 'string') return

    let response, data
    const storedToken = window.localStorage.getItem('wgb-jwt')

    /* check if token is present in localStorage else return an empty object*/
    if (storedToken === null) {
      return {msg: 'no jwt'}
    }

    try {
      response = await fetch(`${this.baseURL}/${endpoint}/${param}`, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        })
      })
      data = await response.json()
    } catch (e) {
      console.error(e)
    }

    return data
  }

  static async set() {
    console.log('set')
  }
}
