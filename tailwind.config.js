export default {
    content: ['./index.html', './src/**/*.{vue,js,ts}'],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light'], // list the ones you want
    },
}