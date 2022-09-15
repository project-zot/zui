import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

// utility
import { api, endpoints } from '../api';
import mockData from '../utilities/mockData';

// components
import Collapse from '@mui/material/Collapse';
import { Box, Card, CardContent, CardMedia, Chip, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Tab, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';
import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";
import PestControlIcon from "@mui/icons-material/PestControl";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";


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
        color: "#828282", fontSize: "1rem", paddingRight: "0.5rem", paddingBottom: "0.5rem"
    },
    values: {
        color: "#000000", fontSize: "1rem", fontWeight: "600"
    }
}));

const vulnerabilityCheck = (status) => {
    const noneVulnerability = <Chip label="None" sx={{ backgroundColor: "#E8F5E9", color: "#388E3C", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlOutlinedIcon sx={{ color: "#388E3C!important" }} />} />;
    const unknownVulnerability = <Chip label="Unknown" sx={{ backgroundColor: "#ECEFF1", color: "#52637A", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlOutlinedIcon sx={{ color: "#52637A!important" }} />} />;
    const lowVulnerability = <Chip label="Low" sx={{ backgroundColor: "#FFF3E0", color: "#FB8C00", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlOutlinedIcon sx={{ color: "#FB8C00!important" }} />} />;
    const mediumVulnerability = <Chip label="Medium" sx={{ backgroundColor: "#FFF3E0", color: "#FB8C00", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlIcon sx={{ color: "#FB8C00!important" }} />} />;
    const highVulnerability = <Chip label="High" sx={{ backgroundColor: "#FEEBEE", color: "#E53935", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlOutlinedIcon sx={{ color: "#E53935!important" }} />} />;
    const criticalVulnerability = <Chip label="Critical" sx={{ backgroundColor: "#FEEBEE", color: "#E53935", fontSize: "0.8125rem", }} variant="filled" onDelete={() => { return; }} deleteIcon={<PestControlIcon sx={{ color: "#E53935!important" }} />} />;

    let result;
    switch (status) {
        case "NONE":
            result = noneVulnerability;
            break;
        case "LOW":
            result = lowVulnerability;
            break;
        case "MEDIUM":
            result =  mediumVulnerability;
            break;
        case "HIGH":
            result =  highVulnerability;
            break;
        case "CRITICAL":
            result =  criticalVulnerability;
            break;
        default:
            result =  unknownVulnerability;
    }

    return result;

    const arrVulnerability = [noneVulnerability, unknownVulnerability, lowVulnerability, mediumVulnerability, highVulnerability, criticalVulnerability]
};


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
                {vulnerabilityCheck(cve.Severity)}
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




function VulnerabilitiesDetails(props) {
    const [cveData, setCveData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { name } = props;


    useEffect(() => {
        api.get(`${host()}${endpoints.vulnerabilitiesForRepo(name)}`)
            .then(response => {
                if (response.data && response.data.data) {
                    let cveInfo = response.data.data.CVEListForImage;
                    let cveListData = {
                        cveList: cveInfo?.CVEList
                    }
                    setCveData(cveListData);
                    setIsLoading(false);
                }
            })
            .catch((e) => {
                console.error(e);
                setCveData({});
            });
    }, [])



    const renderCVEs = (cves) => {
        if (cves) {
            return (cves && cves.map((cve, index) => {
                return (
                    <VulnerabilitiyCard key={index} cve={cve} />
                );
            })
            );
        }
        else {
            return (<Typography> NO Vulnerabilities </Typography>)
        }
    }

    return (
        <div>
            {renderCVEs(cveData?.
                // @ts-ignore
                cveList)}
        </div>
    )
}

export default VulnerabilitiesDetails;
