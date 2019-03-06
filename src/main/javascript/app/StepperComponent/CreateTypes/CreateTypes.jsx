import React from 'react';
import {translate} from 'react-i18next';
import {
    Grid
} from '@material-ui/core';
import {compose} from 'react-apollo';
import TypesList from './TypesList/TypesList';
import PropertiesList from './PropertiesList/PropertiesList';
import AddModifyPropertyDialog from './AddModifyPropertyDialog';
import AddModifyTypeDialog from './AddModifyTypeDialog';

const CreateTypes = () => {
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TypesList/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <PropertiesList/>
                </Grid>
            </Grid>
            <AddModifyPropertyDialog/>
            <AddModifyTypeDialog/>
        </React.Fragment>
    );
};

export default compose(
    translate()
)(CreateTypes);
