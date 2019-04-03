import React from 'react';
import {
    Grid, withStyles
} from '@material-ui/core';
import TypesList from './TypesList/TypesList';
import PropertiesList from './PropertiesList/PropertiesList';
import AddModifyPropertyDialog from './AddModifyPropertyDialog';
import AddModifyTypeDialog from './AddModifyTypeDialog';

const CreateTypesCom = ({classes}) => {
    return (
        <React.Fragment>
            <Grid container classes={classes}>
                <Grid item xs={12} sm={6} classes={classes}>
                    <TypesList/>
                </Grid>
                <Grid item xs={12} sm={6} classes={classes}>
                    <PropertiesList/>
                </Grid>
            </Grid>
            <AddModifyPropertyDialog/>
            <AddModifyTypeDialog/>
        </React.Fragment>
    );
};

const CreateTypes = withStyles({
    container: {
    },
    item: {
        maxHeight: '100%'
    }
})(CreateTypesCom);

export default CreateTypes;
