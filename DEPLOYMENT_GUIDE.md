# MockInt Production Deployment Guide for Render.com

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster (free tier available)
3. **Render Account**: Create a free account at [render.com](https://render.com)

## Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Backend Environment Variables (Required):
```env
MONGOURI=mongodb+srv://username:password@cluster.mongodb.net/mockint?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
SESSION_SECRET=another-random-secret-for-passport-sessions
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-app-name.onrender.com
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-app-name.onrender.com/auth/google/callback
```

#### Frontend Environment Variables (Required):
```env
VITE_API_BASE_URL=https://your-backend-app-name.onrender.com
VITE_OAUTH_REDIRECT_URL=https://your-frontend-app-name.onrender.com/oauth-success
VITE_APP_NAME=MockInt
VITE_APP_VERSION=1.0.0
VITE_ADMIN_MODE=true
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist Render's IP ranges or use `0.0.0.0/0` (allow all IPs)
5. Get your connection string and replace `<username>`, `<password>`, and `<database>`

## Deployment Methods

### Option 1: Using Render Dashboard (Recommended for Beginners)

#### Deploy Backend:
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" -> "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mockint-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables (from Backend list above)
6. Click "Create Web Service"

#### Deploy Frontend:
1. Click "New +" -> "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mockint-frontend`
   - **Branch**: `main`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables (from Frontend list above)
5. Click "Create Static Site"

### Option 2: Using render.yaml (Infrastructure as Code)

1. Use the provided `render.yaml` in the root directory
2. Push to GitHub
3. Go to Render Dashboard -> "New +" -> "Blueprint"
4. Connect repository and select the `render.yaml` file
5. Configure environment variables in the Render dashboard

## Post-Deployment Setup

### 1. Database Seeding

After backend deployment, seed your database:

1. Go to your backend service in Render dashboard
2. Go to "Shell" tab
3. Run: `npm run seed`

### 2. Create Admin Account

1. In the backend shell, run: `npm run create-admin`
2. Follow the prompts to create an admin account

### 3. Update CORS Settings

1. Update the `FRONTEND_URL` environment variable in your backend service
2. Use the exact URL provided by Render for your frontend (e.g., `https://mockint-frontend.onrender.com`)

### 4. Configure Google OAuth

1. Create a Google Cloud project and OAuth consent screen
2. Add **Authorized JavaScript origin**: `https://your-frontend-app-name.onrender.com`
3. Add **Authorized redirect URI**: `https://your-backend-app-name.onrender.com/auth/google/callback`
4. Copy the generated client ID/secret into the backend environment variables listed above

### 5. Test Deployment

1. Visit your frontend URL
2. Test email/password login and Google OAuth
3. Test admin login with created credentials
4. Verify test functionality works end-to-end

## Important Notes

### Free Tier Limitations

- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep takes 30-60 seconds
- **Build Time**: 10 minutes maximum build time
- **Bandwidth**: 100GB/month

### Performance Optimization

1. **Keep Services Warm**: Set up a cron job to ping your services every 10-15 minutes
2. **CDN**: Render automatically provides CDN for static sites
3. **Caching**: Implemented in nginx configuration for static assets

### Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Properly configured for your frontend domain
3. **Rate Limiting**: Implemented in backend
4. **Security Headers**: Configured in nginx and Express

### Monitoring and Logs

1. **Logs**: Available in Render dashboard under "Logs" tab
2. **Metrics**: Basic metrics available in dashboard
3. **Health Checks**: Implemented for both services
4. **Alerts**: Configure in Render dashboard

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL` is correctly set in backend
2. **Database Connection**: Verify MongoDB connection string and IP whitelist
3. **Build Failures**: Check logs for missing dependencies or build errors
4. **404 Errors**: For SPA routing, ensure proper redirect rules in nginx.conf

### Environment Variable Problems:

1. Ensure all required variables are set
2. Use Render's "Environment" tab to verify values
3. Restart services after changing environment variables

### Service Communication:

1. Backend URL should be the full Render URL (e.g., `https://mockint-backend.onrender.com`)
2. Frontend should use the backend URL without trailing slash
3. Ensure both services are in the same region for better performance

## Upgrade to Paid Plans

For production use, consider upgrading to paid plans for:
- No sleep mode
- Faster builds
- More resources
- Better support
- Custom domains
- SSL certificates

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/node-version)
- [Static Sites on Render](https://render.com/docs/static-sites)
- [Environment Variables](https://render.com/docs/environment-variables)

## Support

If you encounter issues:
1. Check the Render documentation
2. Review service logs in the dashboard
3. Contact Render support for platform-specific issues
4. Check MongoDB Atlas logs for database issues









