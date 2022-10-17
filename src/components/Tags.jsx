// react global
import * as React from 'react';

// components
import Typography from '@mui/material/Typography';
import { Card, CardContent, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TagCard from './TagCard';

const useStyles = makeStyles(() => ({
  tagCard: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: 'none!important',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  card: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  clickCursor: {
    cursor: 'pointer'
  }
}));

export default function Tags(props) {
  const classes = useStyles();
  const { tags } = props;
  const renderTags = (tags) => {
    const cmp =
      tags &&
      tags.map((tag) => {
        return (
          <TagCard
            key={tag.Tag}
            tag={tag.Tag}
            lastUpdated={tag.LastUpdated}
            digest={tag.Digest}
            vendor={tag.Vendor}
            size={tag.Size}
            platform={tag.Platform}
          />
        );
      });
    return cmp;
  };

  return (
    <Card className={classes.tagCard} data-testid="tags-container">
      <CardContent className={classes.content}>
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          align="left"
          style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '1.5rem', fontWeight: '600' }}
        >
          Tags History
        </Typography>
        <Divider
          variant="fullWidth"
          sx={{
            margin: '5% 0% 5% 0%',
            background: 'rgba(0, 0, 0, 0.38)',
            height: '0.00625rem',
            width: '100%'
          }}
        />
        {renderTags(tags)}
      </CardContent>
    </Card>
  );
}
