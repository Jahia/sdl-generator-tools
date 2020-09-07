import React from 'react';
import {Grid} from '@material-ui/core';
import AddModifyFinderDialog from './AddModifyFinderDialog/index';
import C from '../../../App.constants';
import TypesList from '../CreateTypes/TypesList/index';
import FindersList from './FindersList/index';

const DefineFinders = () => {
    return (
        <>
            <Grid container className="flexFluid">
                <Grid item xs={12} sm={6}>
                    <TypesList mode={C.TYPE_LIST_MODE_DISPLAY}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FindersList/>
                </Grid>
            </Grid>
            <AddModifyFinderDialog/>
        </>
    );
};

export default DefineFinders;
