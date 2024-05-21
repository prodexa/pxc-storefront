import Logo from './prodexa-logo.png'

export const fetchInit = async (host) => {
  return {
    storeOne: {
      id: 'Prodexa',
      _id: 'Prodexa',
      GOOGLE_ANALYTICS_ID: '123',
      logo: Logo,
      domain: 'prodexa.com',
      email: 'admin@prodexa.com',
      websiteLegalName: 'Prodexa Gmbh',
      websiteName: 'prodexa',
      saasName: 'prodexa',
      saasDomain: 'https://prodexa.com',
      IMAGE_CDN_URL: 'http://localhost:8080/pxm/workarea/',  // TODO (gor) env conf
      imageCdn: {
        url: {
          val : 'http://localhost:8080/pxm/workarea/' // TODO (gor) env conf
        },
        provider:{
          val: 'prodexa'
        }
      }
    }
  }
}
