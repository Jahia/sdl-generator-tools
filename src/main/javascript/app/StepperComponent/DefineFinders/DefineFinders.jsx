import React from 'react';
import {Grid, withStyles} from '@material-ui/core';
import AddModifyFinderDialog from './AddModifyFinderDialog';
import C from '../../App.constants';
import TypesList from '../CreateTypes/TypesList';
import FindersList from './FindersList';

const DefineFindersCom = ({classes}) => {
    return (
        <React.Fragment>
            <Grid container classes={classes}>
                <Grid item xs={12} sm={6} classes={classes}>
                    <TypesList mode={C.TYPE_LIST_MODE_DISPLAY}/>
                </Grid>
                <Grid item xs={12} sm={6} classes={classes}>
                    <FindersList/>
                </Grid>
            </Grid>
            <AddModifyFinderDialog/>
        </React.Fragment>
    );
};

const DefineFinders = withStyles({
    container: {
    },
    item: {
        maxHeight: '100%'
    }
})(DefineFindersCom);

export default DefineFinders;
