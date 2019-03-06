import React from 'react';
import {Grid} from '@material-ui/core';
import AddModifyFinderDialog from './AddModifyFinderDialog';
import C from '../../App.constants';
import TypesList from '../CreateTypes/TypesList';
import FindersList from './FindersList';

const DefineFinders = () => {
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TypesList mode={C.TYPE_LIST_MODE_DISPLAY}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FindersList/>
                </Grid>
            </Grid>
            <AddModifyFinderDialog/>
        </React.Fragment>
    );
};

export default DefineFinders;
