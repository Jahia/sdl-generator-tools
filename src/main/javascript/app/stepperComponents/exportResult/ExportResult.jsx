import React from 'react';
import {Typography} from '@material-ui/core';
import {translate} from 'react-i18next';

const ExportResult = ({t}) => (
    <React.Fragment>
        <Typography color="inherit">{t('label.sdlGeneratorTools.exportResult.wellDoneText')}</Typography>
        <Typography color="inherit">{t('label.sdlGeneratorTools.exportResult.descriptionText')}</Typography>
    </React.Fragment>
);

export default translate()(ExportResult);
