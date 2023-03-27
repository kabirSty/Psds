/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
==========================================================================================*/


export default [
  {
    url: '/dashboard',
    name: "Dashboard",
    slug: "dashboard",
    icon: "HomeIcon",
    i18n: "Dashboard",
  },
  {
    url: '/users',
    name: "Users",
    slug: "users",
    icon: "UsersIcon",
    i18n: "Users",
  },
  // {
  //   url: '/categories',
  //   name: "Categories",
  //   slug: "categories",
  //   icon: "LayersIcon",
  //   i18n: "Categories",
  // },
  {
    url: null,
    name: "Places",
    icon: "MapPinIcon",
    i18n: "Places",
    submenu: [
      {
        url: '/places/add',
        name: "Add Module",
        slug: "packages-add",
        i18n: "AddPlaces",
      },
      {
        url: '/places',
        name: "All Places",
        slug: "packages-list",
        i18n: "AllPlaces",
      },
      {
        url: '/categories',
        name: "Categories",
        slug: "categories",
        icon: "LayersIcon",
        i18n: "Categories",
      },
      {
        url: '/groups',
        name: "Groups",
        slug: "groups",
        icon: "LayersIcon",
        i18n: "Groups",
      },
      {
        url: '/filters',
        name: "Filters",
        slug: "filters",
        icon: "LayersIcon",
        i18n: "Filters",
      },
    ]
  },
  // {
  //   url: '/filters',
  //   name: "Filters",
  //   slug: "filters",
  //   icon: "LayersIcon",
  //   i18n: "Filters",
  // },
  {
    url: '/contacts',
    name: "Contacts",
    slug: "contacts",
    icon: "PhoneCallIcon",
    i18n: "Contacts",
  },
  {
    url: '/apps',
    name: "Recommended Apps",
    slug: "apps",
    icon: "SmartphoneIcon",
    i18n: "RecommendedApps",
  },
  {
    url: '/translations',
    name: "Translations",
    slug: "translations",
    icon: "ShuffleIcon",
    i18n: "Translations",
  },
  {
    url: '/terms',
    name: "Terms",
    slug: "terms",
    icon: "CheckCircleIcon",
    i18n: "Terms",
  },
  
  {
    url: '/languages',
    slug: 'languages',
    name: "Languages",
    icon: "ItalicIcon",
    i18n: "Languages",
  },
  {
    url: '/settings',
    slug: 'settings',
    name: "Settings",
    icon: "SettingsIcon",
    i18n: "Settings",
  },
]

