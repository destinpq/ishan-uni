# UniTrack - Setup Guide

UniTrack is a comprehensive university application tracker that helps students manage their international university applications in one place.

## Features

- **Easy Application Management**: Create, edit, and delete university applications
- **Global University Hub**: Browse thousands of universities with direct links to their websites
- **Smart Tracking**: Track application status, deadlines, submission dates, decision dates, and scholarship information
- **Secure Authentication**: Email/password login system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Architecture

This is a Next.js 16 frontend application that connects to a NestJS backend API for:
- User authentication
- University data management
- Application CRUD operations

## Environment Setup

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# NestJS Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

If your NestJS backend is deployed elsewhere, update the `NEXT_PUBLIC_API_URL` accordingly.

### 3. Run the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The app expects the following endpoints from your NestJS backend:

### Authentication

- `POST /auth/login` - Login with email and password
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, email, name } }`

- `POST /auth/signup` - Create a new account
  - Request: `{ email: string, password: string, name: string }`
  - Response: `{ token: string, user: { id, email, name } }`

### Universities

- `GET /universities` - Get all universities (supports pagination and search)
  - Query params: `?page=1&search=query`
  - Response: `Array<{ id, name, website, country, description, logo }>`

- `GET /universities/:id` - Get a specific university
  - Response: `{ id, name, website, country, description, logo }`

### Applications

- `GET /applications` - Get user's applications
  - Response: `Array<{ id, universityName, universityWebsite, status, appliedDate, deadline, submissionDate, decisionDate, scholarshipInfo }>`

- `GET /applications/:id` - Get a specific application
  - Response: `{ id, universityName, universityWebsite, status, appliedDate, deadline, submissionDate, decisionDate, scholarshipInfo }`

- `POST /applications` - Create a new application
  - Request: `{ universityName, universityWebsite, status, appliedDate, deadline, submissionDate?, decisionDate?, scholarshipInfo? }`
  - Response: `{ id, ...applicationData }`

- `PUT /applications/:id` - Update an application
  - Request: Same as POST
  - Response: Updated application object

- `DELETE /applications/:id` - Delete an application
  - Response: `{ success: boolean }`

## Project Structure

```
app/
├── layout.tsx              # Root layout with AuthProvider
├── page.tsx                # Landing page
├── auth/
│   ├── layout.tsx          # Auth pages wrapper
│   ├── login/
│   │   └── page.tsx        # Login form
│   └── signup/
│       └── page.tsx        # Signup form
└── dashboard/
    ├── layout.tsx          # Protected dashboard layout
    ├── page.tsx            # Applications dashboard
    ├── universities/
    │   └── page.tsx        # University browse & search
    └── applications/
        ├── new/
        │   └── page.tsx    # Create new application
        └── [id]/
            └── edit/
                └── page.tsx # Edit application

components/
├── ui/
│   └── button.tsx          # Shadcn button component
├── dashboard-nav.tsx       # Navigation bar
├── application-card.tsx    # Application display card
└── university-card.tsx     # University listing card

lib/
├── api.ts                  # API client and endpoints
├── auth-context.tsx        # Auth context and hooks
└── utils.ts                # Utility functions

public/
└── (static assets)

styles/
└── globals.css             # Global styles with design tokens
```

## Key Technologies

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API with custom ApiClient class
- **Authentication**: JWT tokens stored in localStorage

## Authentication Flow

1. User signs up or logs in on the auth pages
2. JWT token received from backend and stored in localStorage
3. Token automatically included in all API requests via `Authorization: Bearer <token>` header
4. On dashboard, auth context checks for stored token and user on mount
5. If no token, user is redirected to login page
6. On logout, token and user data are cleared

## Protected Routes

Dashboard routes are protected by the `DashboardLayout` which:
- Checks if user is authenticated
- Redirects to `/auth/login` if not authenticated
- Shows a loading spinner while checking auth status

## Data Flow

1. **Landing Page**: Public page showcasing features, links to auth and dashboard
2. **Auth Pages**: Email/password login and signup
3. **Dashboard**: Main hub showing user's applications and statistics
4. **Universities Page**: Browse and search universities, quick links to apply
5. **Application Form**: Create and edit application details with all tracking fields
6. **Application Cards**: Visual display of each application with status, dates, and links

## Styling

The app uses a professional blue-based color scheme with:
- **Primary Color**: Blue (`oklch(0.56 0.177 249.38)`)
- **Background**: Off-white (`oklch(0.98 0.001 248.38)`)
- **Accent Colors**: Various shades of blue and neutral grays

Design tokens are centrally defined in `globals.css` for easy theming.

## Deployment

To deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings:
   - `NEXT_PUBLIC_API_URL` - Your deployed NestJS API URL
4. Deploy

## Development Tips

- The app uses Client Components (`'use client'`) for interactive pages
- Server Components are used for layouts where possible
- API calls are made from Client Components using the custom ApiClient
- Form validation is basic - add more robust validation as needed
- Error messages are displayed to users but could be improved with toast notifications

## Troubleshooting

### "useAuth must be used within an AuthProvider" Error
- Make sure `AuthProvider` wraps the component tree in `layout.tsx`
- Client components that use `useAuth()` must be in a client tree under the provider

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Ensure NestJS backend is running and accessible
- Check CORS configuration on backend to allow requests from your frontend URL
- Check browser console for network errors

### Authentication Not Persisting
- Clear localStorage and try logging in again
- Check if tokens are being stored: `localStorage.getItem('authToken')`
- Verify backend is returning token in login/signup response

## Next Steps

1. **Implement NestJS Backend**: Create endpoints matching the API integration requirements
2. **Add Validation**: Enhance form validation with libraries like `react-hook-form` or `zod`
3. **Add Notifications**: Implement toast notifications for user feedback
4. **Improve Error Handling**: Better error messages and error boundaries
5. **Add More Features**: Filters, sorting, export applications, etc.
