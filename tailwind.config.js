module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        'gray/100': '#f4f4f5',
        'gray/200': '#e4e4e7',
        'gray/500': '#71717a',
      },
      fontFamily: {
        'helvetica-neue': 'Helvetica Neue',
      },
      boxShadow: {
        menu: '20px 20px 40px rgba(0, 0, 0, 0.25)',
      },
      fontSize: {
        '14px': ['14px', '14px'],
        '16px': ['16px', '16px'],
        '18px': ['18px', '18px'],
        '20px': ['20px', '20px'],
        '30px': ['30px', '30px'],
        '50px': ['50px', '50px'],
        '60px': ['60px', '60px'],
        '64px': ['64px', '64px'],
      },
      width: {
        '20px': '20px',
        '30px': '30px',
        '50px': '50px',
        '60px': '60px',
        '90px': '90px',
        '120px': '120px',
        '580px': '580px',
        '600px': '600px',
        '850px': '850px',
      },
      height: {
        '20px': '20px',
        '30px': '30px',
        '50px': '50px',
        '60px': '60px',
        '90px': '90px',
        '120px': '120px',
        '580px': '580px',
        '600px': '600px',
        '850px': '850px',
      },
      margin: {
        '15px': '15px',
        '20px': '20px',
        '50px': '50px',
      },
      padding: {
        '15px': '15px',
        '20px': '20px',
        '50px': '50px',
      },
    },
  },
};
