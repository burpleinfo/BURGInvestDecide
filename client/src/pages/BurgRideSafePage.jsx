import rideSafeHtml from '../../burg-ridesafe-website.html?raw';

function BurgRideSafePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <iframe
        title="BURG RideSafe"
        srcDoc={rideSafeHtml}
        className="w-full h-screen border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

export default BurgRideSafePage;
