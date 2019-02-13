import React from "react";
import {compose} from "react-apollo";
import {withStyles, Grid, Paper, Typography, Button} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ToolsSteps from "../tools/ToolsSteps"

let styles = theme => ({
    topBar: {
        position: "absolute",
        left: "0%",
        right: "0%",
        top: "0%",
        bottom: "94.22%",
        background: "#3B3D40",
        color: "#fff"
    },
    topBarText: {
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "20px",
        fontSize: "16px",
        color: "#FFFFFF"
    },
    topBarButton: {
        position: "absolute",
        right: "1.67%",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "18px",
        fontSize: "14px",
        textAlign: "right",
        color: "#fff"
    },
    mainPanel: {
        position: "absolute",
        width: "817px",
        height: "753px",
        left: "32px",
        top: "94px"
    },
    mainText: {
        position: "absolute",
        width: "300px",
        height: "20px",
        left: "32px",
        top: "32px",
        fontFamily: "Nunito Sans",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "20px",
        fontSize: "16px",
        color: "#373C42"
    },
    viewerPanel: {
        position: "absolute",
        width: "549px",
        height: "753px",
        left: "867px",
        top: "94px",
        background: "#1F262A",
        boxShadow: "0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)",
        borderRadius: "3px"
    },
    viewerText: {
        position: "absolute",
        width: "114px",
        height: "18px",
        left: "24px",
        top: "24px",
        fontFamily: "Nunito Sans",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "18px",
        fontSize: "14px",
        color: "#fff"
    }
});

const backToTools = () => {
    window.location = "/tools";
}

const MainLayout = ({classes, topBarProps, children}) => (
    <Grid container spacing={24}>

        <AppBar position="static">
            <Toolbar className={classes.topBar}>
                <Typography className={classes.topBarText}>
                    SDL Generator Tools
                </Typography>
                <Button className={classes.topBarButton} onClick={backToTools}>Back to tools</Button>
            </Toolbar>
        </AppBar>

        {/* SDL Definition Components*/}
        <Grid item xs={12} sm={7}>
            <Paper className={classes.mainPanel}>
                <Grid item>
                    <Typography className={classes.mainText}>
                        Build your GraphQL
                    </Typography>
                </Grid>
                <Grid item>
                    <ToolsSteps />
                </Grid>
            </Paper>
        </Grid>

        {/* SDL Viewer Component*/}
        <Grid item xs={12} sm={5}>
            <Paper className={classes.viewerPanel}>
                <Typography className={classes.viewerText}>
                    GraphQL Schema
                </Typography>
            </Paper>
        </Grid>

    </Grid>
);

export default compose(
    withStyles(styles)
)(MainLayout);
