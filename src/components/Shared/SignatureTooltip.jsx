import React from 'react';
import { Typography, Stack } from '@mui/material';

import { isEmpty } from 'lodash';

function SignatureTooltip({ isSigned, signatureInfo }) {
  const { tool, isTrusted, author } = !isEmpty(signatureInfo)
    ? signatureInfo[0]
    : { tool: 'Unknown', isTrusted: 'Unknown', author: 'Unknown' };

  return (
    <Stack direction="column">
      <Typography>{isSigned ? 'Verified Signature' : 'Unverified Signature'}</Typography>
      <Typography>Tool: {tool}</Typography>
      <Typography>Trusted: {!isEmpty(isTrusted) ? isTrusted : 'Unknown'}</Typography>
      <Typography>Author: {!isEmpty(author) ? author : 'Unknown'}</Typography>
    </Stack>
  );
}

export default SignatureTooltip;
