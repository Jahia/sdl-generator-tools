import React from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {Typography, Paper} from '@jahia/ds-mui-theme';
import {ToolLayout, TwoColumnsContent} from '@jahia/layouts';
import StepperComponent from '../StepperComponent';
import GQLSchemaViewer from '../GQLSchemaViewer';


const MainLayout = ({classes, t, contextPath}) => {
    return (
        <React.Fragment>
            <ToolLayout contextPath={contextPath} label={t('label.sdlGeneratorTools.top.backToToolsButton')} title={t('label.sdlGeneratorTools.top.caption')}>
                <TwoColumnsContent
                rightCol={<Paper color="dark"><GQLSchemaViewer/></Paper>}>
                    <Paper color="light">
                        <Typography color="alpha" variant="epsilon">
                            {t('label.sdlGeneratorTools.mainCaption')}
                        </Typography>
                        <StepperComponent/>
                    </Paper>
                </TwoColumnsContent>
            </ToolLayout>
        </React.Fragment>
    );
};

export default compose(
    translate()
)(MainLayout);
