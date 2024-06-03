import { error } from '@sveltejs/kit'
import { CategoryService } from '$lib/services'

export const fetchHome = async ({
    origin, storeId, pageId = 'home', server = false, sid = null
  }: any) => {

  try {
    let res: any = {}

    const topCategories = await CategoryService.fetchAllCategories({
      origin
    })

    res = {
      page: {
        name: 'Home',
        // sliderBanners: {
        //   title: '',
        //   isScroll: false,
        //   cols: 3,
        //   banners: [
        //     {
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/1.jpg',
        //       link: '',
        //       _id: '64f75e367b63e9599d66ab8b'
        //     },
        //     {
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/2.jpg',
        //       link: '',
        //       _id: '64f75eccc99ed399d6de7b40'
        //     },        		{
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/3.jpg',
        //       link: '',
        //       _id: '64f75eccc99ed399d6de7b41'
        //     }
        //   ],
        //   bannersMobile: [
        //     {
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/1.jpg',
        //       _id: '64f75f1d8efd842c7290a431'
        //     },
        //     {
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/2.jpg',
        //       _id: '64f75f2cab313ebe612e8ec6'
        //     },
        //     {
        //       sort: 0,
        //       img: '/pxc/prodexa-img/documents/welcome/3.jpg',
        //       _id: '64f75f2cab313ebe612e8ec7'
        //     }
        //   ]
        // },
        // heroBanners: {
        // 	title: '',
        // 	isScroll: false,
        // 	cols: 3,
        // 	banners: [
        // ...
        // 	]
        // },
        store: 'prodexa',
        active: true,
        // pickedBanners: [
        // 	{
        // 		title: 'Jewellary Corner',
        // 		isScroll: false,
        // 		cols: 3,
        // 		banners: [
        // ...
        // 		],
        // 		_id: '64f754447b63e9599d66a962'
        // 	},
        // 	{
        // 		title: 'Fashion Corner',
        // 		isScroll: false,
        // 		cols: 3,
        // 		banners: [
        // ...
        // 		],
        // 		_id: '64f7554f7b63e9599d66a9e8'
        // 	},
        // 	{
        // 		title: 'Furniture Corner',
        // 		isScroll: false,
        // 		cols: 3,
        // 		banners: [
        // ...
        // 		],
        // 		_id: '64f755ceab313ebe612e8d7f'
        // 	}
        // ],
        slug: 'pxc/home',
        keywords: '',
        metaDescription: '',
        title: '',
        banners: []
      },
      brands: null,
      categories: topCategories.data,
      html: null,
      trending: null,
      youMayLike: null
    }

    return res
  } catch (e) {
    error(e.status, e.message || e)
  }
}

export declare const fetchCategoriesProducts: ({ categories, origin, sid, storeId }: {
	categories: any;
	origin: any;
	sid?: any;
	storeId: any;
}) => Promise<any>
