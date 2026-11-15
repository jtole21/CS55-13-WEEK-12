Next.js app for CS55.13 Week 12. The home page and dynamic post pages load JSON with the `got` module from the WordPress site at https://dev-cs-5513-week-11.pantheonsite.io/.

`lib/data.js` exports `getAllIds()`, `getSortedList()`, and `getData()`. Each one reads the custom route `twentytwentyone-child/v1/latest-posts/1`. If that route is not registered, the same functions read the site's core posts endpoint.
