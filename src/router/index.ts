import { createRouter, createWebHistory } from 'vue-router'
import Home from '@views/Home.vue'
import SpendingForm from '@views/SpendingForm.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            children: [
                {
                    path: 'new',
                    name: 'new-spending',
                    component: SpendingForm,
                },
                {
                    path: 'edit/:id',
                    name: 'edit-spending',
                    component: SpendingForm,
                },
            ],
        },
    ],
})

export default router
