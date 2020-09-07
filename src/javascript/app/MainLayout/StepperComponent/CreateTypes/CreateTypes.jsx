import React from 'react';
import {Grid} from '@material-ui/core';
import TypesList from './TypesList/TypesList';
import PropertiesList from './PropertiesList/PropertiesList';
import AddModifyPropertyDialog from './AddModifyPropertyDialog/index';
import AddModifyTypeDialog from './AddModifyTypeDialog/index';

const CreateTypes = () => {
    return (
        <>
            <Grid container className="flexFluid">
                <Grid item xs={12} sm={6}>
                    <TypesList/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <PropertiesList/>
                </Grid>
            </Grid>
            <AddModifyPropertyDialog/>
            <AddModifyTypeDialog/>
        </>
    );
};

export default CreateTypes;
