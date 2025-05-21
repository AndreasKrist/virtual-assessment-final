import { AssessmentProvider } from '../contexts/AssessmentContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AssessmentProvider>
      <Component {...pageProps} />
    </AssessmentProvider>
  );
}

export default MyApp;