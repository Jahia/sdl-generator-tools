import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {withStyles, AppBar, Toolbar, Grid, Paper, Button} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import StepperComponent from './StepperComponent/index';
import GQLSchemaViewer from './GQLSchemaViewer/index';

let styles = () => ({
    topBar: {
        background: '#3B3D40',
        color: '#fff'
    },
    topBarText: {
        fontWeight: 600,
        fontSize: '16px'
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
    root: {
        margin: '0px',
        width: '100%',
        height: '87%'
    },
    item: {
        height: '100%'
    },
    mainPanel: {
        width: '100%',
        height: '100%',
        boxShadow: '0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)',
        borderRadius: '3px',
        overflow: 'auto'
    },
    mainText: {
        fontWeight: 600,
        margin: '10px 16px',
        fontSize: '16px'
    },
    viewerPanel: {
        width: '100%',
        height: '100%',
        boxShadow: '0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)',
        borderRadius: '3px',
        backgroundColor: '#272822'
    }
});

const MainLayout = ({classes, t, ctx}) => {
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar className={classes.topBar}>
                    <Typography color="invert" variant="epsilon" className={classes.topBarText}>
                        {t('label.sdlGeneratorTools.top.caption')}
                    </Typography>
                    <Button className={classes.topBarButton}
                            onClick={() => {
                                window.location.href = `${ctx}/tools`;
                            }}
                    >
                        <Typography color="invert" variant="zeta">
                            {t('label.sdlGeneratorTools.top.backToToolsButton')}
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>

            <Grid container spacing={24} className={classes.root}>
                <Grid item xs={12} sm={7} className={classes.item}>
                    <Paper className={classes.mainPanel}>
                        <Typography color="alpha" variant="epsilon" className={classes.mainText}>
                            {t('label.sdlGeneratorTools.mainCaption')}
                        </Typography>
                        <StepperComponent/>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={5} className={classes.item}>
                    <Paper className={classes.viewerPanel}><GQLSchemaViewer/></Paper>
                </Grid>
            </Grid>

        </React.Fragment>
    );
};

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    ctx: PropTypes.string.isRequired
};

export default compose(
    withStyles(styles),
    translate()
)(MainLayout);
