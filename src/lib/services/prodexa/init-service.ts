import Logo from './prodexa-logo.png'
import { IMAGE_CDN_URL } from '$lib/config'

export const fetchInit = async () => {
	return {
		storeOne: {
			id: 'prodexa',
			_id: 'prodexa',
			logo: Logo,
			favicon: 'prodexa-favicon.ico',
			domain: 'prodexa.com',
      websiteEmail: 'info@prodexa.com',
			websiteLegalName: 'prodexa Gmbh',
			websiteName: 'prodexa PXC',
			saasName: 'prodexa PXC',
			saasDomain: 'https://prodexa.com',
			IMAGE_CDN_URL,
			imageCdn: {
				url: { val: IMAGE_CDN_URL },
				provider: { val: 'thumbor' }
			},
			GOOGLE_ANALYTICS_ID: '123',
      phone: '+49 (0) 231 226158 00',
      address: 'Rheinische Straße 171, 44147 Dortmund',
		}
	}
}
