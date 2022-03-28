export default class Api {
  /**
   *
   * @param url {string}
   * @param id {number}
   * @param param {string}
   * @return {Promise<object>}
   */
  static async get(url, id = NaN, param = '') {
    if (!url || typeof url !== 'string') return

    const baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_WP_DOMAIN : process.env.REACT_APP_DEV_WP_DOMAIN
    let response, data, extension = ''

    const storedToken = window.localStorage.getItem('wgb-jwt')

    /* check if token is present in localStorage else return an empty object*/
    if (storedToken === null) {
      return {msg: 'no jwt'}
    }
    
    if (!Number.isNaN(id) && typeof id === 'number') {
      extension = `${id}/${param}`
    }

    try {
      response = await fetch(`${baseURL}/wp-json/${url}/${extension}`, {
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
