import React, { useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import { isEmpty } from 'lodash';
import { getStrongestSignature } from 'utilities/vulnerabilityAndSignatureCheck';

function SignatureTooltip({ signatureInfo }) {
  const strongestSignature = useMemo(() => getStrongestSignature(signatureInfo));

  return isEmpty(strongestSignature) ? (
    'Not signed'
  ) : (
    <Stack direction="column">
      <Typography>Tool: {strongestSignature?.tool || 'Unknown'}</Typography>
      <Typography>Author: {strongestSignature?.author || 'Unknown'}</Typography>
    </Stack>
  );
}

export default SignatureTooltip;
