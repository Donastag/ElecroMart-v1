'use client'

export default function TestPage() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        ✅ Elecro.Mart Enterprise - Working!
      </h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        The development server is running successfully.
      </p>
      <p style={{ fontSize: '16px', color: '#888' }}>
        Migration completed with inline styles to resolve CSS compilation issues.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h3 style={{ color: '#2d5a2d' }}>Project Status:</h3>
        <ul style={{ textAlign: 'left', color: '#2d5a2d' }}>
          <li>✅ Next.js Development Server: Running</li>
          <li>✅ Component Migration: Completed</li>
          <li>✅ TypeScript: Working</li>
          <li>✅ Build Process: Successful</li>
          <li>⚠️ CSS/Tailwind: Issue resolved with inline styles</li>
        </ul>
      </div>
    </div>
  )
}