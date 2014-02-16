# NuGet Dependants

A Chrome extension for viewing a list of NuGets that are dependant upon the NuGet package you are currently viewing on NuGet.org.

You will see a 'Dependers' (will be renamed soon) heading below the 'Dependencies' heading. This list is all the packages that depend upon the package you are viewing.

The plugin is configured currently to only apply to https://www.nuget.org page requests. Non TLS/SSL requests are not currently configured for use (but can be easily).

### Known problems:

 * Some packages are being duplicated in the listing. I believe this is due to my use of async XMLHttpRequest calls.
 * As the list of dependants can be quite large at times (log4net for example) work needs to be done to allow for selective loading of additional package data.
 * The code has no tests (shame on me).
 * The code is likely not well organized. I'm used to other languages.
 * Naming is not consistent. Dependats vs Dependers. I'm moving toward 'Dependants' but it's late right now. (Thank you @nlindey and @jagthedrummer for the responses concerning the naming)