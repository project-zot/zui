import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import transform from 'utilities/transform';

// utility
import { api, endpoints } from '../api';
import mockData from '../utilities/mockData';

// components
import Collapse from '@mui/material/Collapse';
import { List } from '@mui/material';
import { Box, Card, CardContent, Divider, Chip, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Tab, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';


const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#FFFFFF",
        boxShadow: "0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
        borderRadius: "1.875rem",
        flex: "none",
        alignSelf: "stretch",
        flexGrow: 0,
        order: 0,
        width: "100%",
        marginTop: "0rem",
        marginBottom: "0rem",
        padding: "1rem 1.5rem ",
    },
    content: {
        textAlign: "left",
        color: "#606060",
        width: "100%",
        flexDirection: "column",

    },
    title: {
        color: "#14191F",
        fontSize: "1rem",
        fontWeight: "400",
        paddingRight: "0.5rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem"
    },
    layer: {
        color: "#14191F",
        fontSize: "1rem",
        fontWeight: "400",
        paddingRight: "0.5rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
    },
    values: {
        color: "#52637A",
        fontSize: "1rem",
        fontWeight: "400",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem"
    }
}));


function LayerCard(props) {
    const classes = useStyles();
    const [size, setSize] = useState(0);
    const { index, layer, historyDescription, isSelected } = props;

    useEffect(() => {
        if (historyDescription.EmptyLayer) {
            let s = 0;
            setSize(s);
        } else {
            setSize(layer.Size)
        }
    }, [])

    return (
        <Grid sx={isSelected ? { backgroundColor: "#F7F7F7" } : null} container>
            <Grid item xs={10} container>
                <Grid item xs={1}>
                    <Typography variant="body1" align="left" className={classes.title}>{index}: </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" align="left" className={classes.layer}>
                        {historyDescription.CreatedBy}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="body1" align="left" className={classes.values}> {transform.formatBytes(size)} </Typography>
            </Grid>
        </Grid >
    )

}

function HistoryLayers(props) {
    const classes = useStyles();
    const [historyData, setHistoryData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [size, setSize] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const { name } = props;


    useEffect(() => {
        api.get(`${host()}${endpoints.layersDetailsForImage(name)}`)
            .then(response => {
                if (response.data && response.data.data) {
                    let layersHistory = response.data.data.Image;
                    setHistoryData(layersHistory?.History);
                    setIsLoaded(true);
                }
            })
            .catch((e) => {
                console.error(e);
                setHistoryData([]);
                setIsLoaded(false);
            });
    }, [name])

    return (
        <div>
            <Typography variant="h4" gutterBottom component="div" align="left" style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "1.5rem", fontWeight: "600", paddingTop: "0.5rem" }}>Layers</Typography>
            <Divider variant="fullWidth" sx={{ margin: "5% 0% 0% 0%", background: "rgba(0, 0, 0, 0.38)", height: "0.00625rem", width: "100%" }} />
            <Card className={classes.card} raised>
                <CardContent className={classes.content}>
                    {(historyData && historyData.map((layer, index) => {
                        return (
                            <div key={`${layer?.Layer?.Size}${index}`} onClick={() => setSelectedIndex(index)}>
                                <LayerCard key={`${layer?.Layer?.Size}${index}`} index={index + 1} isSelected={selectedIndex === index} layer={layer?.Layer} historyDescription={layer?.HistoryDescription} />
                            </div>
                        );
                    })
                    )}
                </CardContent>
            </Card>
            {isLoaded && historyData && (<Card className={classes.card} raised>
                <CardContent className={classes.content}>
                    <Grid item xs={11}>
                        <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Typography variant="body1" align="left" className={classes.title}> Command </Typography>
                           <Typography variant="body1" align="left" className={classes.values} > {transform.formatBytes(historyData[selectedIndex].Layer?.Size)} </Typography>
                        </Stack>
                    </Grid>
                    <Typography variant="body1" align="left" className={classes.title} sx={{ backgroundColor: "#F7F7F7" }}> {historyData[selectedIndex].HistoryDescription?.CreatedBy} </Typography>
                </CardContent>
            </Card>)}
        </div>
    )
}

export default HistoryLayers;
