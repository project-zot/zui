import React, { useState, useMemo } from 'react';

// components
import { Button, Modal, Typography, Stack, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { api, endpoints } from 'api';
import { host } from 'host';
import ImageSelector from 'components/Tag/Tabs/ImageSelector';
import VulnerabilitiyCard from 'components/Shared/VulnerabilityCard';
import { isEmpty } from 'lodash';
import { mapCVEInfo } from 'utilities/objectModels';

const useStyles = makeStyles(() => ({
  imagesInputBox: {
    padding: '0.5rem',
    marginBottom: '0.5rem'
  },
  input: {
    color: '#464141',
    '&::placeholder': {
      opacity: '1'
    }
  },
  searchInputBase: {
    width: '90%',
    paddingLeft: '1rem',
    border: '1px solid black',
    height: 40,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  compareImagesPopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    border: '2px solid #000',
    padding: '1rem'
  },
  compareButton: {
    paddingLeft: '0.5rem'
  }
}));

function CompareImages({ name, tag, platform }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [minuend, setMinuend] = useState('');
  const [subtrahend, setSubtrahend] = useState('');
  const [cveData, setCVEData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMinuendInput = (value) => {
    setMinuend(value);
  };
  const handleSubtrahendInput = (value) => {
    setSubtrahend(value);
  };
  const abortController = useMemo(() => new AbortController(), []);

  const imageCVECompare = (minuend, subtrahend) => {
    api
      .get(
        `${host()}${endpoints.cveDiffForImages(minuend, subtrahend, { pageNumber: 1, pageSize: 9 })}`,
        abortController.signal
      )
      .then((diffResponse) => {
        const cveListData = mapCVEInfo(diffResponse.data.data.CVEDiffListForImages.CVEList);
        setCVEData(cveListData);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getImageRefComponents = (image) => {
    if (image.includes('@')) {
      let components = image.split('@');
      return [components[0], '', components[1]];
    } else if (image.includes(':')) {
      let components = image.split(':');
      return [components[0], components[1], ''];
    }

    return [image, '', ''];
  };

  const handleCompare = () => {
    let [minuendRepo, minuendTag] = getImageRefComponents(minuend);
    let [subtrahendRepo, subtrahendTag] = getImageRefComponents(subtrahend);
    imageCVECompare({ repo: minuendRepo, tag: minuendTag }, { repo: subtrahendRepo, tag: subtrahendTag });
  };

  const renderCVEs = () => {
    return !isEmpty(cveData) ? (
      cveData.map((cve, index) => {
        return <VulnerabilitiyCard key={index} cve={cve} name={name} platform={platform} expand={true} />;
      })
    ) : (
      <></>
    );
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Compare
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack direction="column" className={classes.compareImagesPopup}>
          <Typography variant="h6" component="h2">
            Compare the vulnerabilities of 2 images
          </Typography>
          <Stack direction="row" spacing={2} className={classes.imagesInputBox}>
            <ImageSelector
              setSearchCurrentValue={handleMinuendInput}
              name={name}
              tag={tag}
              // digest={digest}
              // platform={platform}
            />
            <ImageSelector setSearchCurrentValue={handleSubtrahendInput} name={name} tag={tag} />
          </Stack>
          <Box className={classes.compareButton}>
            <Button variant="outlined" onClick={handleCompare}>
              Compare
            </Button>
          </Box>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
              overflow: 'hidden',
              overflowY: 'scroll'
              // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
            }}
          >
            {renderCVEs()}
          </Box>
        </Stack>
      </Modal>
    </div>
  );
}

export default CompareImages;
