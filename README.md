# Novus API Documentation

Professional API documentation for integrating the Novus API with Make.com HTTP modules.

## 🌐 Live Documentation

Visit the live documentation at: **https://jd-smeltser.github.io/novus-api-docs/**

## 📋 Documentation Sections

- **[Overview](index.html)** - Introduction and quick start guide
- **[Integration Guide](guide.html)** - Step-by-step Make.com setup instructions
- **[API Reference](api-reference.html)** - Complete endpoint documentation

## 🚀 Features

- ✅ **Professional Design** - Stripe-inspired interface with modern styling
- ✅ **Interactive Examples** - Tabbed code examples with copy functionality
- ✅ **Mobile Responsive** - Works seamlessly on all device sizes
- ✅ **Comprehensive Coverage** - Token management, error handling, best practices
- ✅ **Auto-Deploy** - GitHub Actions workflow for seamless publishing

## 🔧 Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jd-smeltser/novus-api-docs.git
   cd novus-api-docs
   ```

2. Open `index.html` in your browser or serve with a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

### Deployment

The documentation automatically deploys to GitHub Pages on every push to the `main` branch via GitHub Actions.

To deploy changes:

1. Make your edits to the HTML, CSS, or JavaScript files
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push origin main
   ```
3. GitHub Actions will automatically build and deploy the site

## 📁 File Structure

```
├── index.html          # Homepage with overview and quick start
├── guide.html          # Make.com integration guide
├── api-reference.html  # Complete API reference
├── styles.css          # Professional CSS styling
├── scripts.js          # Interactive functionality
├── .github/workflows/  # GitHub Actions deployment
└── README.md          # This file
```

## 🛠️ Technology Stack

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript** - Interactive features and smooth navigation
- **Prism.js** - Syntax highlighting for code examples
- **GitHub Actions** - Automated deployment pipeline
- **GitHub Pages** - Static site hosting

## 📝 Content Management

### Adding New Pages

1. Create a new HTML file following the existing structure
2. Include the standard header, navigation, and styling
3. Update navigation links in all existing pages
4. Commit and push - the site will auto-deploy

### Updating API Documentation

1. Edit the relevant HTML files (`api-reference.html` for endpoints, `guide.html` for integration steps)
2. Follow the established patterns for code examples and tabbed content
3. Test locally before pushing changes

### Styling Updates

All styling is contained in `styles.css` using CSS custom properties for easy theming and maintenance.

## 🎯 Integration Focus

This documentation specifically covers:

- **Novus API** authentication and endpoints
- **Make.com HTTP modules** configuration
- **Token management** for 5-minute expiration
- **Error handling** and troubleshooting
- **Best practices** for production deployments

## 📞 Support

For technical support:
- **API Issues**: Contact Novus API technical support
- **Make.com Questions**: Refer to Make.com HTTP module documentation
- **Documentation Issues**: Open an issue in this repository

---

*This documentation was created with [Claude Code](https://claude.ai/code) to provide a professional, comprehensive resource for Novus API integration.*