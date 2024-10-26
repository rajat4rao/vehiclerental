module.exports = {
  content: [
    "./index.html",  
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {}, 
    animation: {
      'bounce-delay-100': 'bounce 1s ease-in-out infinite 0.1s',
      'bounce-delay-200': 'bounce 1s ease-in-out infinite 0.2s',
    }
  },
  plugins: [],
};