import React from 'react';
import {Typography} from '@jahia/ds-mui-theme';
import {translate} from 'react-i18next';

const ExportResult = ({t}) => (
    <React.Fragment>
        <Typography color="alpha" variant="omega">{t('label.sdlGeneratorTools.exportResult.wellDoneText')}</Typography>
        <Typography color="alpha" variant="omega">{t('label.sdlGeneratorTools.exportResult.descriptionText')}</Typography>
    </React.Fragment>
);

export default translate()(ExportResult);
