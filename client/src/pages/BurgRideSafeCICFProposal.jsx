import React from 'react';
import cicfProposalHtml from '../../burg-ridesafe-cicf-proposal.html?raw';
import Footer from '../widgets/Footer/Footer';

const BurgRideSafeCICFProposal = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <iframe
        srcDoc={cicfProposalHtml}
        title="BURG RideSafe x Christ University - CICF Proposal"
        className="w-full flex-1 border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      <Footer />
    </div>
  );
};

export default BurgRideSafeCICFProposal;
