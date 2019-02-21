import React from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {withStyles, AppBar, Toolbar, Grid, Paper, Typography, Button} from '@material-ui/core';
import Stepper from '../stepperComponents/StepperComponentContainer';
import GQLSchemaViewer from '../gqlSchemaViewer/index';

let styles = theme => ({
    topBar: {
        background: '#3B3D40',
        color: '#fff'
    },
    topBarText: {
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '16px',
        color: '#FFFFFF'
    },
    topBarButton: {
        position: 'absolute',
        right: '1.67%',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '18px',
        fontSize: '14px',
        textAlign: 'right',
        color: '#fff'
    },
    mainPanel: {
        width: '100%',
        height: '91%',
        boxShadow: '0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)',
        borderRadius: '3px',
        overflow: 'auto'
    },
    mainText: {
        fontStyle: 'normal',
        fontWeight: 600,
        margin: '10px 16px',
        fontSize: '16px',
        color: '#373C42'
    },
    viewerPanel: {
        width: '100%',
        height: '91%',
        boxShadow: '0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)',
        borderRadius: '3px',
        backgroundColor: '#272822'
    }
});

const MainLayout = ({classes, t}) => {
    return (
        <Grid container spacing={24}>

            <AppBar position="static">
                <Toolbar className={classes.topBar}>
                    <Typography className={classes.topBarText}>
                        {t('label.sdlGeneratorTools.top.caption')}
                    </Typography>
                    <Button className={classes.topBarButton}
                            onClick={() => {
                                window.location = '/tools';
                            }}
                    >
                        {t('label.sdlGeneratorTools.top.backToToolsButton')}
                    </Button>
                </Toolbar>
            </AppBar>

            <Grid item xs={12} sm={7}>
                <Paper className={classes.mainPanel}>
                    <Typography className={classes.mainText}>
                        {t('label.sdlGeneratorTools.mainCaption')}
                    </Typography>
                    <Stepper/>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={5}>
                <Paper className={classes.viewerPanel}><GQLSchemaViewer/></Paper>
            </Grid>
        </Grid>
    );
};

export default compose(
    withStyles(styles),
    translate()
)(MainLayout);
