// // services.js
import { env } from '$env/dynamic/public'
// import * as Litekart from './litekart'
import { services as Litekart } from '@misiki/litekart-utils'
import * as Prodexa from './prodexa'
// import * as Shopify from './shopify'
// import * as Woocommerce from './woocommerce'
// import * as MedusaJs from './medusa'
// import * as BigCommerce from './bigcommerce'

export function getSelectedService(serviceName: string) {
	switch (serviceName) {
		case 'LITEKART':
			return Litekart
		case 'PRODEXA':
			return Prodexa
		case 'SHOPIFY':
		// 	return Shopify
		// case 'WOOCOMERCE':
		// 	return Woocommerce
		// case 'MEDUSAJS':
		// 	return MedusaJs
		// case 'BIGCOMMERCE':
		// 	return BigCommerce
		default:
			throw new Error(`Invalid service name: ${serviceName}`)
	}
}

const selectedServiceName = env.PUBLIC_SELECTED_SERVICE || 'LITEKART'

const selectedService = getSelectedService(selectedServiceName)

export const {
	AddressService,
	AutocompleteService,
	BannersService,
	BlogService,
	BrandService,
	CartService,
	CategoryService,
	ChatService,
	CollectionService,
	ContactService,
	CountryService,
	CouponService,
	DealsService,
	DemoRequestService,
	DiscountService,
	FaqService,
	FeedbackService,
	GalleryService,
	HokodoService,
	HomeService,
	InitService,
	InvoiceService,
	MenuService,
	OrdersService,
	PageService,
	PaymentMethodService,
	PopularityService,
	PopularSearchService,
	ProductService,
	ReelService,
	ReturnService,
	ReviewService,
	StoreService,
	UserService,
	VendorService,
	WishlistService,
	ZipService
} = selectedService
