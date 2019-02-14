import React from 'react';
import {Typography} from '@material-ui/core';

const ExportResult = ({t}) => (
    <React.Fragment>
        <Typography color="inherit">Well done!</Typography>
        <Typography color="inherit">All types have been correctly configured. You can now export your SDL file</Typography>
    </React.Fragment>
);

export default ExportResult;
