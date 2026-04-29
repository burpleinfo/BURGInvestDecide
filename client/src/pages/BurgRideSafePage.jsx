import rideSafeHtml from '../../burg-ridesafe-website.html?raw';
import Footer from '../widgets/Footer/Footer';

function BurgRideSafePage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <iframe
        title="BURG RideSafe"
        srcDoc={rideSafeHtml}
        className="w-full flex-1 border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      <Footer />
    </div>
  );
}

export default BurgRideSafePage;
