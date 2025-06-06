# Change history for ui-plugin-find-authority

## [5.0.1] (https://github.com/folio-org/ui-plugin-find-authority/tree/v5.0.1) (2025-06-03)

* [UIPFAUTH-110](https://issues.folio.org/browse/UIPFAUTH-110) Find Authority > Authority View - show Last updated by date from mod-search metadata.

## [5.0.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v5.0.0) (2025-03-13)

* [UIPFAUTH-106](https://issues.folio.org/browse/UIPFAUTH-106) *BREAKING* migrate stripes dependencies to their Sunflower versions
* [UIPFAUTH-107](https://issues.folio.org/browse/UIPFAUTH-107) *BREAKING* migrate react-intl to v7
* [UIPFAUTH-95](https://issues.folio.org/browse/UIPFAUTH-95) React v19: refactor away from default props for functional components.

## [4.1.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v4.1.0) (2024-11-01)

* [UIPFAUTH-96](https://issues.folio.org/browse/UIPFAUTH-96) Pass the record search error to the `SearchResultsList` component.
* [UIPFAUTH-100](https://issues.folio.org/browse/UIPFAUTH-100) Migrate to shared CI workflows.
* [UIPFAUTH-104](https://issues.folio.org/browse/UIPFAUTH-104) Pass `firstPageQuery` to `<AuthoritiesSearchPane>` to include query in facets request.

## [4.0.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v4.0.0) (2024-03-21)

* [UIPFAUTH-85](https://issues.folio.org/browse/UIPFAUTH-85) *BREAKING* Import MarcView from stripes-marc-components.
* [UIPFAUTH-86](https://issues.folio.org/browse/UIPFAUTH-86) Add new column called Authority source for the browse and search results.
* [UIPFAUTH-72](https://issues.folio.org/browse/UIPFAUTH-72) Remove eslint deps that are already listed in eslint-config-stripes.
* [UIPFAUTH-92](https://issues.folio.org/browse/UIPFAUTH-92) Use `null` for empty value of tenantId instead of empty string.

## [3.0.2] (https://github.com/folio-org/ui-plugin-find-authority/tree/v3.0.2) (2023-11-30)

* [UIPFAUTH-87](https://issues.folio.org/browse/UIPFAUTH-87) Use first page Browse query for facet requests.

## [3.0.1] (https://github.com/folio-org/ui-plugin-find-authority/tree/v3.0.1) (2023-11-20)

* [UIPFAUTH-83](https://issues.folio.org/browse/UIPFAUTH-83) Resolve circular dependency with ui-quick-marc. Clone QuickMarcView component from `ui-quick-marc`.

## [3.0.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v3.0.0) (2023-10-13)

* [UIPFAUTH-44](https://issues.folio.org/browse/UIPFAUTH-44) Show an error message in modal after linking.
* [UIPFAUTH-56](https://issues.folio.org/browse/UIPFAUTH-56) Avoid private paths in stripes-core imports.
* [UIPFAUTH-57](https://issues.folio.org/browse/UIPFAUTH-57) Added stripes-authority-components to stripesDeps.
* [UIPFAUTH-59](https://issues.folio.org/browse/UIPFAUTH-59) Browse: Fix Space at the begining and end of query string.
* [UIPFAUTH-60](https://issues.folio.org/browse/UIPFAUTH-60) Display link button when open Authorized or Reference.
* [UIPFAUTH-62](https://issues.folio.org/browse/UIPFAUTH-62) "Month" dropdown is Not displayed in date picker element opened in modal window
* [UIPFAUTH-61](https://issues.folio.org/browse/UIPFAUTH-61) Retain `Search` and `Browse` search terms.
* [UIPFAUTH-67](https://issues.folio.org/browse/UIPFAUTH-67) Update markHighlightedFields function with authority Mapping Rules
* [UIPFAUTH-121](https://issues.folio.org/browse/UIPFAUTH-121) *BREAKING* Bump `react` to `v18`.
* [UIPFAUTH-70](https://issues.folio.org/browse/UIPFAUTH-70) Update Node.js to v18 in GitHub Actions.
* [UIPFAUTH-73](https://issues.folio.org/browse/UIPFAUTH-73) Add "Local" or "Shared" to flag MARC authorities.
* [UIPFAUTH-74](https://issues.folio.org/browse/UIPFAUTH-74) Add Shared icon to MARC authority search results.
* [UIPFAUTH-75](https://issues.folio.org/browse/UIPFAUTH-75) Change tenant id to central when opening details of Shared Authority.
* [UIPFAUTH-76](https://issues.folio.org/browse/UIPFAUTH-76) Link Shared/Local MARC bib record to Shared/Local Authority record.
* [UIPFAUTH-77](https://issues.folio.org/browse/UIPFAUTH-77) Hide the Shared facet in the plugin for the shared bib record.
* [UIPFAUTH-79](https://issues.folio.org/browse/UIPFAUTH-79) *BREAKING* bump `react-intl` to `v6.4.4`.
* [UIPFAUTH-80](https://issues.folio.org/browse/UIPFAUTH-80) Don't clear previous Search/Browse results to highlight the edited record.
* [UIPFAUTH-81](https://issues.folio.org/browse/UIPFAUTH-81) Remove unnecessary pagingOffset prop.

## [2.0.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v2.0.0) (2023-02-24)

* [UIPFAUTH-34](https://issues.folio.org/browse/UIPFAUTH-34) The pagination buttons are missing when the user changes the scale of the screen
* [UIPFAUTH-36](https://issues.folio.org/browse/UIPFAUTH-36) Default search/browse option and Authority source file selections based on MARC bib field to be linked
* [UIPFAUTH-37](https://issues.folio.org/browse/UIPFAUTH-37) bump stripes to 8.0.0 for Orchid/2023-R1
* [UIPFAUTH-47](https://issues.folio.org/browse/UIPFAUTH-47) Show References filter.

## [1.0.1] (https://github.com/folio-org/ui-plugin-find-authority/tree/v1.0.1) (2022-11-28)

* [UIPFAUTH-37](https://issues.folio.org/browse/UIPFAUTH-37) Error appears when the user executes search in "MARC Authority" app

## [1.0.0] (https://github.com/folio-org/ui-plugin-find-authority/tree/v1.0.0) (2022-10-25)

* [UIPFAUTH-7](https://issues.folio.org/browse/UIPFAUTH-7) Create an empty modal window for find Authorities plugin
* [UIPFAUTH-1](https://issues.folio.org/browse/UIPFAUTH-1) Select a MARC authority record modal > Search MARC authority records
* [UIPFAUTH-3](https://issues.folio.org/browse/UIPFAUTH-3) Select a MARC authority record modal > Results list - Search
* [UIPFAUTH-4](https://issues.folio.org/browse/UIPFAUTH-4) Select a MARC authority record modal > Results list - Browse
* [UIPFAUTH-9](https://issues.folio.org/browse/UIPFAUTH-9) move stripes-authority-components to peerDependencies
* [UIPFAUTH-5](https://issues.folio.org/browse/UIPFAUTH-5) Select a MARC authority record modal > View a MARC authority detail record
* [UIPFAUTH-15](https://issues.folio.org/browse/UIPFAUTH-15) Browse: Long heading ref values in results list are not aligned to the left
* [UIPFAUTH-11](https://issues.folio.org/browse/UIPFAUTH-11) Default search query change to return - authRefType=Authorized
* [UIPFAUTH-19](https://issues.folio.org/browse/UIPFAUTH-19) The counters at Browse authority pane and "Type of heading" facet options don't match
* [UIPFAUTH-16](https://issues.folio.org/browse/UIPFAUTH-16) Add the Expand the Search & filter pane option
* [UIPFAUTH-14](https://issues.folio.org/browse/UIPFAUTH-14) Detail Record : Click Link button to select a MARC authority record
* [UIPFAUTH-13](https://issues.folio.org/browse/UIPFAUTH-13) Results List : Click Link icon/button to select a MARC authority record
* [UIPFAUTH-21](https://issues.folio.org/browse/UIPFAUTH-21) The error "Something went wrong" appears when search by same search option and updated query
* [UIPFAUTH-26](https://issues.folio.org/browse/UIPFAUTH-26) The pane size of the "Search & filter" pane changes when user changes scale of the screen
* [UIPFAUTH-28](https://issues.folio.org/browse/UIPFAUTH-28) Browse: Remove the link action on a placeholder row
* [UIPFAUTH-32](https://issues.folio.org/browse/UIPFAUTH-32) Added aria-label to modal
* [UIPFAUTH-31](https://issues.folio.org/browse/UIPFAUTH-31) Results List | Heading Type column is cutoff
* [UIPFAUTH-29](https://issues.folio.org/browse/UIPFAUTH-29) Find Authority plugin: Add a11y tests

## [0.1.0](https://github.com/folio-org/ui-plugin-find-authority/tree/v0.1.0) (2022-10-04)

 - New plugin created

