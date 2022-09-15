// react global
import React from "react";
import { useNavigate } from "react-router-dom";

// utility
import { DateTime } from "luxon";
// components
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
} from "@mui/material";
import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";
import PestControlIcon from "@mui/icons-material/PestControl";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import makeStyles from "@mui/styles/makeStyles";

// placeholder images
import repocube1 from "../assets/repocube-1.png";
import repocube2 from "../assets/repocube-2.png";
import repocube3 from "../assets/repocube-3.png";
import repocube4 from "../assets/repocube-4.png";

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: "1.5rem",
    flex: "none",
    alignSelf: "stretch",
    flexGrow: 0,
    order: 0,
    width: "100%",
    maxWidth: "72rem",
  },
  avatar: {
    height: "1.4375rem",
    width: "1.4375rem",
  },
  cardBtn: {
    height: "100%",
    width: "100%",
  },
  media: {
    borderRadius: "3.125rem",
  },
  content: {
    textAlign: "left",
    color: "#606060",
    maxHeight: "9.25rem",
  },
  contentRight: {
    height: "100%",
  },
  signedBadge: {
    color: "#9ccc65",
    height: "1.375rem",
    width: "1.375rem",
    marginLeft: 10,
  },
  vendor: {
    color: "#14191F",
    fontSize: "1rem",
  },
  versionLast: {
    color: "#52637A",
    fontSize: "1rem",
  },
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name, vendor, platforms, description, lastUpdated, downloads, rating, version } =
    props;


  //function that returns a random element from an array
  function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const goToDetails = () => {
    navigate(`/image/${name}`);
  };

  const vulnerabilityCheck = () => {
    const noneVulnerability = <Chip label="None Vulnerability" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;
    const unknownVulnerability = <Chip label="Unknown Vulnerability" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
    const lowVulnerability = <Chip label="Low Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#FB8C00!important" }} />}/>;
    const mediumVulnerability = <Chip label="Medium Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#FB8C00!important" }} />}/>;
    const highVulnerability = <Chip label="High Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#E53935!important" }} />}/>;
    const criticalVulnerability = <Chip label="Critical Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#E53935!important" }} />}/>;

    const arrVulnerability = [noneVulnerability, unknownVulnerability, lowVulnerability, mediumVulnerability, highVulnerability, criticalVulnerability]
    return(getRandom(arrVulnerability));
  };

  const signatureCheck = () => {
    const unverifiedSignature = <Chip label="Unverified Signature" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppBadOutlinedIcon sx={{ color: "#E53935!important" }} />}/>; 
    const untrustedSignature = <Chip label="Untrusted Signature" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppMaybeOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
    const verifiedSignature = <Chip label="Verified Signature" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppGoodOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;

    const arrSignature = [unverifiedSignature, untrustedSignature, verifiedSignature]
    return(getRandom(arrSignature));
  }

  const platformChips = () => {
    // if platforms not received, mock data
    const platformsOsArch = platforms || [
      "Windows",
      "PowerPC64LE",
      "IBM Z",
      "Linux",
    ];
    return  (
      <>
      <Chip
        key={platforms?.Os}
        label={platforms?.Os}
        sx={{
          backgroundColor: "#E0E5EB",
          color: "#52637A",
          fontSize: "0.8125rem",
        }}
      />
      <Chip
        key={platforms?.Arch}
        label={platforms?.Arch}
        sx={{
          backgroundColor: "#E0E5EB",
          color: "#52637A",
          fontSize: "0.8125rem",
        }}
      />
      </>
    );
  };

  const getVendor = () => {
    return `${vendor || "N/A"} •`;
  };
  const getVersion = () => {
    const lastDate = lastUpdated
      ? DateTime.fromISO(lastUpdated)
      : DateTime.now().minus({ days: 1 });
    return `published ${version} •`;
  };
  const getLast = () => {
    const lastDate = lastUpdated
      ? DateTime.fromISO(lastUpdated)
      : DateTime.now().minus({ days: 1 });
    return `${lastDate.toRelative({ unit: "days" })}`;
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
        <CardContent className={classes.content}>
          <Grid container>
            <Grid item xs={10}>
              <Stack alignItems="center" direction="row" spacing={2}>
                <CardMedia
                  classes={{
                    root: classes.media,
                    img: classes.avatar,
                  }}
                  component="img"
                  image={randomImage()}
                  alt="icon"
                />
                <Typography variant="h5" component="div">
                  {name}
                </Typography>
                {/* {vulnerabilityCheck()}
                {signatureCheck()} */}
                {/* <Chip label="Verified licensee" sx={{ backgroundColor: "#E8F5E9", color: "#388E3C" }} variant="filled" onDelete={() => { return }} deleteIcon={vulnerabilityCheck()} /> */}
              </Stack>
              <Typography
                className={classes.versionLast}
                pt={1}
                sx={{ fontSize: 12 }}
                gutterBottom
              >
                {description ||
                  "The complete solution for node.js command-line programs"}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={2} pt={1}>
                {platformChips()}
              </Stack>
              <Stack alignItems="center" direction="row" spacing={1} pt={2}>
                <Typography className={classes.vendor} variant="body2">
                  {getVendor()}
                </Typography>
                <Typography className={classes.versionLast} variant="body2">
                  {getVersion()}
                </Typography>
                <Typography className={classes.versionLast} variant="body2">
                  {getLast()}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack
                alignItems="flex-end"
                justifyContent="space-between"
                direction="column"
                className={classes.contentRight}
              >
                <Stack direction="column" alignItems="flex-end">
                  {/* <Typography variant="body2">
                    Downloads • {downloads || "-"}
                  </Typography>
                  <Typography variant="body2">
                    Rating • {rating || "-"}
                  </Typography> */}
                </Stack>
                {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RepoCard;
