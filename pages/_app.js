import { ThemeProvider } from 'next-themes';
import { AssessmentProvider } from '../contexts/AssessmentContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AssessmentProvider>
        <Component {...pageProps} />
      </AssessmentProvider>
    </ThemeProvider>
  );
}

export default MyApp;