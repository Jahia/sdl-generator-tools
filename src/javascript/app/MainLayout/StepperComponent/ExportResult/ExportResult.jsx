import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/ds-mui-theme';
import {translate} from 'react-i18next';

const ExportResult = ({t}) => (
    <React.Fragment>
        <Typography color="alpha" variant="omega">{t('label.sdlGeneratorTools.exportResult.wellDoneText')}</Typography>
        <Typography color="alpha" variant="omega">{t('label.sdlGeneratorTools.exportResult.descriptionText')}</Typography>
    </React.Fragment>
);

ExportResult.propTypes = {
    t: PropTypes.object.isRequired
};

export default translate()(ExportResult);
