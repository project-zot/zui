import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Stack } from '@mui/material';
import { isEmpty } from 'lodash';
import { getStrongestSignature, getAllAuthorsOfSignatures } from 'utilities/vulnerabilityAndSignatureCheck';

function SignatureTooltip({ signatureInfo }) {
  const strongestSignature = useMemo(() => getStrongestSignature(signatureInfo));
  const { t } = useTranslation();

  return isEmpty(strongestSignature) ? (
    <Typography>{t('signatureTooltip.notSigned')}</Typography>
  ) : (
    <Stack direction="column">
      <Typography>
        {t('signatureTooltip.tool')}: {strongestSignature?.tool || t('main.unknown')}
      </Typography>
      <Typography>
        {t('signatureTooltip.signedBy')}: {getAllAuthorsOfSignatures(signatureInfo) || t('main.unknown')}
      </Typography>
    </Stack>
  );
}

export default SignatureTooltip;
