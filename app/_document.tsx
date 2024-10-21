import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Basic SEO metatags */}
          <meta name="title" content="MoodMeter - Instant Mood Tracking and Feedback Analysis" />
          <meta name="description" content="MoodMeter helps organizations gather anonymous feedback to track mood trends and improve experiences. Boost satisfaction and engagement with real-time insights." />
          <meta name="keywords" content="mood tracking, employee feedback, customer satisfaction, anonymous feedback, experience improvement, engagement analytics" />
          <meta name="robots" content="index, follow" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta name="author" content="Your Company Name" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.moodmeter.co.uk/" />
          <meta property="og:title" content="MoodMeter - Enhance Experiences with Real-time Mood Insights" />
          <meta property="og:description" content="Empower your audience to share their experiences anonymously. Use real-time feedback to create better environments and boost satisfaction." />
          <meta property="og:image" content="https://www.moodmeter.co.uk/og-image.jpg" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.moodmeter.co.uk/" />
          <meta property="twitter:title" content="MoodMeter - Transform Feedback into Action" />
          <meta property="twitter:description" content="Instant mood tracking and analysis tool. Understand and enhance experiences in real-time with MoodMeter." />
          <meta property="twitter:image" content="https://www.moodmeter.co.uk/twitter-image.jpg" />

          {/* App-specific metatags */}
          <meta name="application-name" content="MoodMeter" />
          <meta name="apple-mobile-web-app-title" content="MoodMeter" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="theme-color" content="#4CAF50" />

          {/* Favicon */}
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Manifest file for PWA */}
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument