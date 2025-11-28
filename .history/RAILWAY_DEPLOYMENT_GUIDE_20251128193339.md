# 🚀 Elecro.Mart - Railway Deployment Guide

## Prerequisites

Before deploying to Railway, make sure you have:

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your project should be in a GitHub repository
3. **Google Gemini API Key**: Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Step-by-Step Deployment

### 1. Push to GitHub
Make sure your project is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Create New Project on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your Elecro.Mart repository
5. Click **"Deploy Now"**

### 3. Configure Environment Variables

1. In your Railway dashboard, go to your project
2. Click on the **"Variables"** tab
3. Add the following environment variable:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   ⚠️ **Important**: Use your real Gemini API key, not the placeholder

### 4. Deploy

Railway will automatically:
- Detect it's a Node.js project
- Run `npm install`
- Run `npm run build`
- Start the server with `npm run preview`

### 5. Access Your Live Site

1. After deployment completes, Railway will provide a URL
2. Your site will be available at: `https://your-project-name.railway.app`

## 🔧 Configuration Files Created

The following files have been added for Railway deployment:

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `.env.example`
```env
# Google Gemini AI API Key (required for product image generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Node Environment
NODE_ENV=production
```

## 📁 Project Structure

Your deployed project will include:

```
├── dist/                 # Built files (generated on deploy)
├── public/
│   └── images/
│       └── products/     # Your product images
├── src/                  # Source code
├── package.json          # Dependencies and scripts
├── railway.json          # Railway configuration
└── .env.example          # Environment variables template
```

## 🌟 Features Included

✅ **Production Build**: Optimized for performance  
✅ **Local Product Images**: Professional product photos  
✅ **Black Friday Carousel**: Enhanced with your images  
✅ **AI Fallbacks**: Gemini integration for dynamic images  
✅ **Responsive Design**: Works on all devices  
✅ **Fast Loading**: Optimized assets and caching  

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure your code compiles without errors locally
- Verify environment variables are set correctly

### Images Not Loading
- Make sure product images are in `public/images/products/`
- Check that image paths start with `/images/products/`

### API Errors
- Verify your Gemini API key is valid
- Check Railway logs for detailed error messages

## 📊 Performance

Your deployed site will include:
- **Gzipped Assets**: Reduced file sizes
- **CDN Delivery**: Fast global loading
- **Optimized Images**: WebP format support
- **Caching**: Browser and server-side caching

## 🔒 Security

- Environment variables are securely stored
- No sensitive data in client-side code
- HTTPS enabled by default

## 📞 Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify environment variables
3. Test locally with `npm run build` and `npm run preview`

---

**Ready to deploy!** 🚀 Your Elecro.Mart e-commerce platform will be live on Railway with all features working perfectly.