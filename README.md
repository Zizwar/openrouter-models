# OpenRouter Models Dashboard 🤖

A modern, multilingual Next.js application for exploring and comparing AI models from OpenRouter. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## ✨ Features

- **🌍 Multilingual Support**: Full Arabic and English localization with RTL support
- **🔍 Smart Search**: Search models by name, ID, or description
- **📊 Comprehensive Model Info**: View detailed specifications, pricing, and capabilities
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📱 Responsive Design**: Works perfectly on all device sizes
- **⚡ Real-time Data**: Fetches live data from OpenRouter API (no API key required)
- **🚀 Fast Performance**: Optimized with Next.js 15 and modern React patterns

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zizwar/openrouter-models.git
   cd openrouter-models
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - English: http://localhost:3000/en
   - Arabic: http://localhost:3000/ar

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Internationalization**: Custom i18n system
- **Data Source**: OpenRouter API

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Models listing page
│   │   │   ├── models/[modelId]/
│   │   │   │   └── page.tsx          # Model details page
│   │   │   └── layout.tsx            # Locale-specific layout
│   │   ├── globals.css               # Global styles
│   │   └── page.tsx                  # Root redirect
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── LanguageSelector.tsx  # Language switcher
│   │   ├── models/
│   │   │   ├── ModelCard.tsx         # Model card component
│   │   │   └── SearchFilter.tsx      # Search input
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── openrouter.ts             # OpenRouter API integration
│   │   ├── i18n.ts                   # Internationalization utilities
│   │   └── utils.ts                  # Utility functions
│   └── middleware.ts                 # Routing middleware
├── messages/
│   ├── en.json                       # English translations
│   └── ar.json                       # Arabic translations
└── components.json                   # shadcn/ui configuration
```

## 🌐 API Integration

This application uses the public OpenRouter Models API:
- **Endpoint**: `https://openrouter.ai/api/v1/models`
- **Authentication**: None required
- **Rate Limits**: Standard public API limits apply

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Card, Button, Badge, Input
- Responsive grid layouts
- Dark/light mode support (via Tailwind)

## 🌍 Internationalization

- **Languages**: English (en), Arabic (ar)
- **RTL Support**: Full right-to-left layout for Arabic
- **Dynamic Switching**: Change language without page reload
- **Custom System**: Lightweight i18n implementation

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid Layouts**: Adaptive columns based on screen size
- **Touch Friendly**: Large tap targets and smooth scrolling

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t openrouter-models .
docker run -p 3000:3000 openrouter-models
```

### Static Export
```bash
npm run build
npm run export
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the models API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons
- [Next.js](https://nextjs.org/) for the framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

<div align="center">
  <p>Built with ❤️ using Next.js and OpenRouter API</p>
  <p>🤖 Generated with <a href="https://claude.ai/code">Claude Code</a></p>
</div>
