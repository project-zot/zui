import React, { useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import { isEmpty } from 'lodash';
import { getStrongestSignature, getAllAuthorsOfSignatures } from 'utilities/vulnerabilityAndSignatureCheck';

function SignatureTooltip({ signatureInfo }) {
  const strongestSignature = useMemo(() => getStrongestSignature(signatureInfo));

  return isEmpty(strongestSignature) ? (
    <Typography>Not signed</Typography>
  ) : (
    <Stack direction="column">
      <Typography>Tool: {strongestSignature?.tool || 'Unknown'}</Typography>
      <Typography>Signed-by: {getAllAuthorsOfSignatures(signatureInfo) || 'Unknown'}</Typography>
    </Stack>
  );
}

export default SignatureTooltip;
