import React from 'react';
import PropTypes from 'prop-types';
import {compose} from '../compose';
import {withTranslation} from 'react-i18next';
import {Paper, TwoColumnsContent, Typography} from '@jahia/design-system-kit';
import StepperComponent from './StepperComponent';
import GQLSchemaViewer from './GQLSchemaViewer';
import {withStyles} from '@material-ui/core/index';

const MainLayout = ({t, classes}) => {
    return (
        <>
            <TwoColumnsContent classes={classes}
                               rightCol={<Paper className="flexFluid" color="dark"><GQLSchemaViewer/></Paper>}
            >
                <Paper color="light" className="flexFluid flexCol">
                    <Typography color="alpha" variant="epsilon">
                        {t('label.sdlGeneratorTools.mainCaption')}
                    </Typography>
                    <StepperComponent/>
                </Paper>
            </TwoColumnsContent>
        </>
    );
};

MainLayout.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles({
        root: {
            padding: '32px',
            minHeight: 0
        }
    }),
    withTranslation('sdl-generator-tools')
)(MainLayout);
