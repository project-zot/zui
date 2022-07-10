import { Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  card: {
    display:"flex",
    minWidth:'15%',
    alignItems:'flex-start',
    background:"#FFFFFF",
    boxShadow:"0px 5px 10px rgba(131, 131, 131, 0.08)",
    borderRadius: "24px"
  }
}));

function FilterCard(props) {
  const classes = useStyles();
  const {title, filters} = props;

  const getFilterRows = () => {
    const filterRows = filters ||  ["ARM", "ARM 64", "IBM POWER", "IBM Z", "PowerPC 64 LE", "x86", "x86-64"];
    return filterRows.map((filter, index) => {
      return (
        <FormControlLabel key={index} componentsProps={{typography:{variant:"body2"}}} control={<Checkbox />} label={filter}/>
      )
    })
  }

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent>
        <Typography variant="h6">{title || "Filter Title"}</Typography>
        <Stack direction="column">
          {getFilterRows()}
        </Stack>
      </CardContent>
    </Card>
  )

}

export default FilterCard;