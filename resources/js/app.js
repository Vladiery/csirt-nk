import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
    resolve: () => {
        const pages = import.meta.glob('./pages.jsx', { eager: true });

        return pages['./pages.jsx'];
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            React.createElement(App, props)
        );
    },
});
