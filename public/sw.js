if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),u={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>u[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"e780e4d3159e6c7df176ac6585ce8889"},{url:"/_next/static/chunks/123-5bf3ea66dc6cfda6.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/123-5bf3ea66dc6cfda6.js.map",revision:"d6cfb412f6494d7e4ba576f1d3d96187"},{url:"/_next/static/chunks/131-3acbfc41d524a0b0.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/131-3acbfc41d524a0b0.js.map",revision:"53bb5670e8734d87a5038b15eb74d886"},{url:"/_next/static/chunks/141-b5d96993ffaaa3cc.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/141-b5d96993ffaaa3cc.js.map",revision:"54e132e34c94b38f0a241cfeb8fe793b"},{url:"/_next/static/chunks/169-a7baa33ab2eb64a3.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/169-a7baa33ab2eb64a3.js.map",revision:"36efce06fe498598cb762c3875fa54d0"},{url:"/_next/static/chunks/192-85a620929463717b.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/192-85a620929463717b.js.map",revision:"c24c3717b2f7943adb610241b905532b"},{url:"/_next/static/chunks/213-0381bfbb6994094b.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/213-0381bfbb6994094b.js.map",revision:"c2b913e20e7bc58d6026d0e19e1ca5a3"},{url:"/_next/static/chunks/249-1f607d2b3bf6d0a7.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/249-1f607d2b3bf6d0a7.js.map",revision:"7af9de30b2e9cc368297cd870f95be70"},{url:"/_next/static/chunks/361-92ced9650ebe1570.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/361-92ced9650ebe1570.js.map",revision:"c872bad8d8af4a09b1a810132541aca4"},{url:"/_next/static/chunks/37-d55f849a5c25bccf.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/37-d55f849a5c25bccf.js.map",revision:"89777e8745cb81d2f69f17d39c82abf4"},{url:"/_next/static/chunks/390-89095edbb08ad41f.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/390-89095edbb08ad41f.js.map",revision:"1bc4c9ebcb51822982d4f4fc34e4ec61"},{url:"/_next/static/chunks/425-a0516fdcddf5f1c3.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/425-a0516fdcddf5f1c3.js.map",revision:"f83427e8b429b7f2f0b2f0825bf01f33"},{url:"/_next/static/chunks/428-018870eda7f737f7.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/428-018870eda7f737f7.js.map",revision:"1cbf51735ff7e131c1eee7dc9e7d911f"},{url:"/_next/static/chunks/448-d8ca1bd8f53a54fd.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/448-d8ca1bd8f53a54fd.js.map",revision:"25192729ae7516fafb6e0b384ab3b069"},{url:"/_next/static/chunks/52774a7f-36c9d9090c331819.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/52774a7f-36c9d9090c331819.js.map",revision:"018683f48ce57a2a231bd2cac6cb0d7a"},{url:"/_next/static/chunks/621-2ff9f56e0955acbc.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/621-2ff9f56e0955acbc.js.map",revision:"ad7d8375d418735c596137f92f5e0713"},{url:"/_next/static/chunks/690-aa6b1b01caab4197.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/690-aa6b1b01caab4197.js.map",revision:"57c4186cf10a1e7bf7070810982eebbc"},{url:"/_next/static/chunks/app/(app)/analytics/pwa/page-8a03640adf001d50.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(app)/analytics/pwa/page-8a03640adf001d50.js.map",revision:"75f55a93441984580386c61a7d6cbaa4"},{url:"/_next/static/chunks/app/(app)/dashboard/page-143ee863b61327c3.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(app)/dashboard/page-143ee863b61327c3.js.map",revision:"982fa11aa75a598900517f316d429484"},{url:"/_next/static/chunks/app/(app)/layout-7edd1f0e1528adc9.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(app)/layout-7edd1f0e1528adc9.js.map",revision:"7101a1657e95d3d19986c4fc7b606878"},{url:"/_next/static/chunks/app/(app)/reports/page-5c4ead860a727e3b.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(app)/reports/page-5c4ead860a727e3b.js.map",revision:"c5fdab23c75ce853804b7498ee4767e2"},{url:"/_next/static/chunks/app/(app)/settings/page-b1f5bd784193b6ca.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(app)/settings/page-b1f5bd784193b6ca.js.map",revision:"34e426c9174c6a2b5c3e7e3972da3337"},{url:"/_next/static/chunks/app/(auth)/layout-f05c41d5f022ed37.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(auth)/sign-in/%5B%5B...sign-in%5D%5D/page-1f71e7611c71d91d.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(auth)/sign-in/%5B%5B...sign-in%5D%5D/page-1f71e7611c71d91d.js.map",revision:"636d13bda737bcd46b336f8cda315bf0"},{url:"/_next/static/chunks/app/(auth)/sign-up/%5B%5B...sign-up%5D%5D/page-d3453a072745b17d.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(auth)/sign-up/%5B%5B...sign-up%5D%5D/page-d3453a072745b17d.js.map",revision:"b81ac56774936c7d67da2c5efc1db896"},{url:"/_next/static/chunks/app/(landing)/layout-d5f6530b64ed6dd1.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(landing)/layout-d5f6530b64ed6dd1.js.map",revision:"85928e4314d7bdb80d718c95e17dac2a"},{url:"/_next/static/chunks/app/(landing)/page-143efe410b873496.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/(landing)/page-143efe410b873496.js.map",revision:"54a8f4da0f42b1229752ee4043d5f45c"},{url:"/_next/static/chunks/app/_not-found/page-3adcd70f225cac4d.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/_not-found/page-3adcd70f225cac4d.js.map",revision:"400033150140b2a1138d734de46b9304"},{url:"/_next/static/chunks/app/global-error-84ed9722babc2199.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/global-error-84ed9722babc2199.js.map",revision:"77ffc5e6467d3cd03b172c9bd89732d1"},{url:"/_next/static/chunks/app/layout-970bbca789dd85b5.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/layout-970bbca789dd85b5.js.map",revision:"5bb409e4200aa00f89c961ab232e64b2"},{url:"/_next/static/chunks/app/sentry-example-page/page-c832bc3c1b294f7c.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/sentry-example-page/page-c832bc3c1b294f7c.js.map",revision:"ee5f677239f03f0055cee644e10899f3"},{url:"/_next/static/chunks/app/unauthorized/page-aae955966ab07799.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/app/unauthorized/page-aae955966ab07799.js.map",revision:"6bec4c006d7d9919dabaf04fd0b20b76"},{url:"/_next/static/chunks/fd9d1056-04f9912f669fc06d.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/fd9d1056-04f9912f669fc06d.js.map",revision:"a58c7ff5c23201c3ab57bee458ce4595"},{url:"/_next/static/chunks/framework-d4fe9202d25e6211.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/framework-d4fe9202d25e6211.js.map",revision:"11f2c1945d36911a3608154940491b20"},{url:"/_next/static/chunks/main-8444c00a5cb26e48.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/main-8444c00a5cb26e48.js.map",revision:"322adfbc80a3e1aaaa88bc5daf864cbb"},{url:"/_next/static/chunks/main-app-9fc4c615fc7955e2.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/main-app-9fc4c615fc7955e2.js.map",revision:"8927e7f4cc7ae9767986132fc1864516"},{url:"/_next/static/chunks/pages/_app-8b34c5f53dd3dc4d.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/pages/_app-8b34c5f53dd3dc4d.js.map",revision:"09939fc9bac17c3f399720d18f97901f"},{url:"/_next/static/chunks/pages/_error-f907e58eeb1e5b29.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/pages/_error-f907e58eeb1e5b29.js.map",revision:"8660deee362d0aa2c8f7865a9f977936"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-462e8fdf0e8a166b.js",revision:"ue-4GVS0-8xPzg5IIVXeh"},{url:"/_next/static/chunks/webpack-462e8fdf0e8a166b.js.map",revision:"f72297d148492e63f1964b09f9f59869"},{url:"/_next/static/css/6a35dec771b8c111.css",revision:"6a35dec771b8c111"},{url:"/_next/static/css/6a35dec771b8c111.css.map",revision:"0102f95265dea11a090472b746c06a20"},{url:"/_next/static/css/6d6037b640c1c23b.css",revision:"6d6037b640c1c23b"},{url:"/_next/static/css/6d6037b640c1c23b.css.map",revision:"e118b630ac863dd834903a649233f810"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/_next/static/ue-4GVS0-8xPzg5IIVXeh/_buildManifest.js",revision:"a6cc4535bd26157062e127c24720c419"},{url:"/_next/static/ue-4GVS0-8xPzg5IIVXeh/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/assets/icons/Logo.ico",revision:"1f5265da0bcebf6150cffe0f16a9bdf2"},{url:"/assets/icons/Logo.png",revision:"593c36b76f085e0116355777dc02ce93"},{url:"/assets/icons/feedback-icon.png",revision:"4ae427f768c31c0264748278d5a37881"},{url:"/assets/icons/icon-192x192.png",revision:"435e027247a06e7dde0e806edb89460e"},{url:"/assets/icons/icon-256x256.png",revision:"7bb99cdc4a3db854b2c11d09b1437a6f"},{url:"/assets/icons/icon-384x384.png",revision:"1cee811b58dac6f7486303fe4b5dda66"},{url:"/assets/icons/icon-512x512.png",revision:"710f968c648e651b34489d701f73fc09"},{url:"/assets/icons/report-icon.png",revision:"82113864e8725dd4c599a808e60374a6"},{url:"/assets/icons/settings-icon.png",revision:"f214c8a4bf5845b6cdb43bb09336ee4d"},{url:"/assets/images/Logo.png",revision:"6bf57092b2024cbc32b075fdba552759"},{url:"/assets/images/Logo.psd",revision:"21f70429f9fb278d92ecee005703b293"},{url:"/assets/images/Logo.svg",revision:"0635876a34cff5a9bb67ee6d8ffd0ed6"},{url:"/assets/images/LogoHorizontal.png",revision:"bbb014d92fb781d72606061d6054f45d"},{url:"/assets/images/LogoHorizontal.svg",revision:"50722fffffac8f2940ca9bfd66b7a4c5"},{url:"/assets/images/LogoMonochrome.svg",revision:"626d7e216ba6a712c1233e949175afc4"},{url:"/assets/images/rotate_device.svg",revision:"e2c714012f9a64f217dd46cec7870410"},{url:"/manifest.json",revision:"324d1504c969db49355f64572c4e56fc"},{url:"/service-worker.js",revision:"d41d8cd98f00b204e9800998ecf8427e"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
