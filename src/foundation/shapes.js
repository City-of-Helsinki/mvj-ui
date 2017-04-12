import {PropTypes} from 'react';

export const revealContextShape = PropTypes.shape({
  openReveal: PropTypes.func.isRequired,
  closeReveal: PropTypes.func.isRequired,
  getRevealState: PropTypes.func.isRequired,
});
