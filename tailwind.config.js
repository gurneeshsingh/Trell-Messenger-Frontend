module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'dancingScript': ['Dancing Script', 'cursive'],
        'nunito': ['Nunito', 'sans-serif']
      }
    
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  
}
