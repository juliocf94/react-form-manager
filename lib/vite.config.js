import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: './index.jsx',
            name: 'ReactFormManager',
            fileName: (format) => `react-form-manager.${format}.js`,
            formats: ['es', 'cjs', 'umd']
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'yup', 'prop-types'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    yup: 'yup',
                    'prop-types': 'PropTypes'
                }
            }
        }
    }
});
