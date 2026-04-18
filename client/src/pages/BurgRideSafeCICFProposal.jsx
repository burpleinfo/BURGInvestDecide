import React from 'react';
import cicfProposalHtml from '../../burg-ridesafe-cicf-proposal.html?raw';

const BurgRideSafeCICFProposal = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        srcDoc={cicfProposalHtml}
        title="BURG RideSafe x Christ University - CICF Proposal"
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default BurgRideSafeCICFProposal;
