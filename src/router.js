import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

        {
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            children: [
                {
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('./views/apps/dashboard/Dashboard.vue'),
                    meta: {
                        needAuth: true,
                        pageTitle: 'Dashboard',
                        roles: ['developer', 'admin'],
                        permissions: ['*'],
                    },
                },
                {
                    path: '/roles',
                    name: 'Roles',
                    component: () => import('./views/apps/role/Role.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Roles', active: true },
                        ],
                        pageTitle: 'Roles',
                        rule: 'admin',
                        permissions: ['update-role', 'assign-permission', 'detach-permission'],
                        roles: ['developer'],
                    },
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: () => import('./views/apps/user/User.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Users', active: true },
                        ],
                        pageTitle: 'Users',
                        rule: 'admin',
                        permissions: ['view-user'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/users/:userId',
                    name: 'UsersEdit',
                    component: () => import('./views/apps/user/UserEdit.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Users', url: '/users' },
                            { title: 'Edit User', active: true },
                        ],
                        pageTitle: 'Edit User',
                        rule: 'admin',
                        permissions: ['view-user' , 'update-user'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/categories',
                    name: 'Categories',
                    component: () => import('./views/apps/category/Category.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Categories', active: true },
                        ],
                        pageTitle: 'Categories',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/groups',
                    name: 'Groups',
                    component: () => import('./views/apps/group/Group.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Groups', active: true },
                        ],
                        pageTitle: 'Groups',
                        rule: 'admin',
                        permissions: ['read-group', 'create-group', 'update-group', 'delete-group'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/filters',
                    name: 'Filters',
                    component: () => import('./views/apps/filter/Filter.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Filters', active: true },
                        ],
                        pageTitle: 'Filters',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/contacts',
                    name: 'Contacts',
                    component: () => import('./views/apps/contact/Contacts.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Contacts', active: true },
                        ],
                        pageTitle: 'Contacts',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/apps',
                    name: 'Recommended apps',
                    component: () => import('./views/apps/app/Apps.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Recommended apps', active: true },
                        ],
                        pageTitle: 'Recommended apps',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/translations',
                    name: 'Translations',
                    component: () => import('./views/apps/translation/Translations.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Translations', active: true },
                        ],
                        pageTitle: 'Translations',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/terms',
                    name: 'Terms',
                    component: () => import('./views/apps/term/Term.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Terms & Conditions', active: true },
                        ],
                        pageTitle: 'Terms & Conditions',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/languages',
                    name: 'Languages',
                    component: () => import('./views/apps/language/Languages.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Languages', active: true },
                        ],
                        pageTitle: 'Languages',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/places',
                    name: 'Places',
                    component: () => import('./views/apps/place/AllPlaces.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Places', active: true },
                        ],
                        pageTitle: 'Places',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/places/add',
                    name: 'AddPlace',
                    component: () => import('./views/apps/place/AddPlace.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Places', url: '/places' },
                            { title: 'Add a Place', active: true },
                        ],
                        pageTitle: 'Add a Place',
                        rule: 'admin',
                        permissions: ['read-category', 'create-category', 'update-category', 'delete-category'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/places/:placeId',
                    name: 'EditPlace',
                    component: () => import('./views/apps/place/PlaceEdit.vue'),
                    meta: {
                        needAuth: true,
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Places', url: '/places' },
                            { title: 'Edit Place', active: true },
                        ],
                        pageTitle: 'Edit Place',
                        rule: 'admin',
                        permissions: ['view-user' , 'update-user'],
                        roles: ['developer', 'admin'],
                    },
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/views/apps/setting/UserSettings.vue'),
                    meta: {
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Settings', active: true },
                        ],
                        needAuth: true,
                        pageTitle: 'Settings',
                        rule: 'admin',
                        permissions: ['*'],
                        roles: ['*'],
                    },
                },
            ],
        },
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
               
                {
                    path: '/login',
                    name: 'page-login',
                    component: () => import('@/views/apps/auth/Login.vue'),
                    meta: {

                    }
                },
                // {
                //     path: '/register',
                //     name: 'page-register',
                //     component: () => import('@/views/apps/auth/Register.vue'),
                //     meta: {

                //     }
                // },
                {
                    path: '/forgot-password',
                    name: 'page-forgot-password',
                    component: () => import('@/views/apps/auth/ForgotPassword.vue'),
                    meta: {

                    }
                },
                {
                    path: '/resetpassword/:token',
                    name: 'page-reset-password',
                    component: () => import('@/views/apps/auth/ResetPassword.vue'),
                    meta: {

                    }
                },
                {
                    path: '/error-404',
                    name: 'page-error-404',
                    component: () => import('@/views/apps/auth/Error404.vue'),
                    meta: {
   
                    }
                },
                {
                    path: '/not-authorized',
                    name: 'page-not-authorized',
                    component: () => import('@/views/apps/auth/NotAuthorized.vue'),
                    meta: {
           
                    }
                },
            ]
        },
        {
            path: '*',
            redirect: '/error-404'
        }
    ],
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    const needAuth = to.meta.needAuth ? to.meta.needAuth : false;

    if(needAuth) {
        if(to.meta.permissions && to.meta.permissions.length && user){
            let response = false
            let returnResponse = false
            let roles = to.meta.roles
            let permissions = to.meta.permissions
            
            for (var index = 0; index < roles.length; ++index) {
                if(user.roles_array){
                    if(user.roles_array.includes(roles[index]) || roles[index] == '*'){
                        returnResponse = true;
                    }
                }
                else return next({ path: '/login' });
            }

            for (var index = 0; index < permissions.length; ++index) {
                if(user.permissions_array){
                    if(user.permissions_array.includes(permissions[index]) || permissions[index] == '*'){
                        returnResponse = true;
                    }
                }
                else return next({ path: '/login' });
            }
            
            if(returnResponse) next()
            else return next({ path: '/not-authorized' });
        }
        else next({ path: '/login' });
    }

    next()
})

router.afterEach(() => {
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router

