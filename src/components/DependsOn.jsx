import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

// utility
import { api, endpoints } from '../api';
import mockData from '../utilities/mockData';

// components
import Collapse from '@mui/material/Collapse';
import { Box, Card, CardContent, Divider, Chip, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Tab, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        background: "#FFFFFF",
        boxShadow: "0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
        borderRadius: "1.875rem",
        flex: "none",
        alignSelf: "stretch",
        flexGrow: 0,
        order: 0,
        width: "100%",
        marginTop: "2rem",
        marginBottom: "2rem"
    },
    content: {
        textAlign: "left",
        color: "#606060",
        padding: "2% 3% 2% 3%",
        width: "100%"
    },
    title: {
        color: "#828282", 
        fontSize: "1rem", 
        paddingRight: "0.5rem", 
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem"

    },
    values: {
        color: "#000000", 
        fontSize: "1rem", 
        fontWeight: "600",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem"
    }
}));


function VulnerabilitiyCard(props) {
    const classes = useStyles();
    const { cve } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <Card className={classes.card} raised>
            <CardContent className={classes.content}>
                <Stack sx={{ flexDirection: "row" }}>
                    <Typography variant="body1" align="left" className={classes.title}>ID: </Typography>
                    <Typography variant="body1" align="left" className={classes.values}> {cve.Id}</Typography>
                </Stack>
                <Stack sx={{ flexDirection: "row" }}>
                    <Typography variant="body1" align="left" className={classes.title}>Title: </Typography>
                    <Typography variant="body1" align="left" className={classes.values}> {cve.Title}</Typography>
                </Stack>
                <Typography sx={{ color: "#1479FF", paddingTop: "1rem", fontSize: "0.8125rem", fontWeight: "600", cursor: 'pointer' }} onClick={() => setOpen(!open)}>{!open ? 'See description' : 'Hide description'}</Typography>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box>
                        <Typography variant="body2" align="left" sx={{ color: "#0F2139", fontSize: "1rem" }}> {cve.Description} </Typography>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    )

}




function DependsOn(props) {
    const [images, setImages] = useState([]);
    const { name } = props;


    useEffect(() => {
        api.get(`${host()}${endpoints.dependsOnForImage(name)}`)
            .then(response => {
                if (response.data && response.data.data) {
                    let images = response.data.data.BaseImageList;
                    // let cveListData = {
                    //     cveList: cveInfo?.CVEList
                    // }
                    setImages(images);
                }
            })
            .catch((e) => {
                console.error(e);
                setImages([]);
            });
    }, [])

    return (
        <div>
             <Typography variant="h4" gutterBottom component="div" align="left" style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "1.5rem", fontWeight: "600", paddingTop:"0.5rem" }}>Depends On</Typography>
             <Divider variant="fullWidth" sx={{ margin: "5% 0% 5% 0%", background: "rgba(0, 0, 0, 0.38)", height: "0.00625rem", width: "100%" }} />
        </div>
    )
}

export default DependsOn;
