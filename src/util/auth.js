export default class Auth {
  static baseURL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  /**
   *
   * @param {object} credentials
   * @returns {Promise<{data: any, statusCode: number}>}
   */
  static async login({identifier, password}) {
    const url = `${this.baseURL}/api/auth/local`

    const formData = new FormData()
    formData.append('identifier', identifier)
    formData.append('password', password)

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    const data = await response.json()

    return {
      statusCode: response.statusCode,
      data: data
    }
  }

  /**
   *
   * @returns {boolean}
   */
  static logout() {
    if (window.localStorage.getItem('wgb-jwt') === null) {
      window.localStorage.removeItem('wgb-jwt')
      return true
    }

    return false
  }
}
