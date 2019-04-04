import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles} from '@material-ui/core';
import AddModifyFinderDialog from './AddModifyFinderDialog/index';
import C from '../../../App.constants';
import TypesList from '../CreateTypes/TypesList/index';
import FindersList from './FindersList/index';

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

DefineFindersCom.propTypes = {
    classes: PropTypes.object.isRequired
};

const DefineFinders = withStyles({
    container: {
        height: '73%'
    },
    item: {
        maxHeight: '100%'
    }
})(DefineFindersCom);

export default DefineFinders;
