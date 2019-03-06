import React from 'react';
import {translate} from 'react-i18next';
import {
    withStyles,
    Grid
} from '@material-ui/core';
import {compose} from 'react-apollo';
import TypesList from './TypesList/TypesList';
import PropertiesList from './PropertiesList/PropertiesList';
import AddModifyPropertyDialog from './AddModifyPropertyDialog';
import AddModifyTypeDialog from './AddModifyTypeDialog';

const styles = () => ({
    paper: {
        width: '100%',
        minHeight: '50%',
        padding: '6px 0px'
    },
    root: {
        position: 'absolute',
        textAlign: 'right'
    }
});

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
    withStyles(styles),
    translate()
)(CreateTypes);
