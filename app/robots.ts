import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/booking/success', // Example of a page we might want to hide from crawlers
        },
        sitemap: 'https://nawi.experience/sitemap.xml',
    };
}
