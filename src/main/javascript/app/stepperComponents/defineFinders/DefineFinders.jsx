import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AddModifyFinderDialog from './addModifyFinderDialog/index';
import {compose} from 'react-apollo';

const styles = theme => ({
    paper: {
        width: 360,
        height: 400
    }
});

const DefineFinders = ({classes, addFinder, removeFinder, nodeTypes, selection, selectType}) => {
    const [isDialogOpen, setDialogState] = useState(false);
    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>Type</ListSubheader>}>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}/>
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>Finders</ListSubheader>}>
                            <Button onClick={() => setDialogState(true)}>
                                Add Finder
                                <Add/>
                            </Button>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.queries.map(finder => {
                                        return (
                                            <FinderItem key={finder.name}
                                                        name={finder.name}/>
                                        );
                                    }
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddModifyFinderDialog open={isDialogOpen} close={() => setDialogState(false)} addFinder={addFinder} selection={selection}/>
        </React.Fragment>
    );
};

const TypeItem = ({name, isSelected, selectType}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const FinderItem = ({name}) => (
    <ListItem button>
        <ListItemText primary={name}/>
    </ListItem>
);

DefineFinders.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addFinder: PropTypes.func.isRequired,
    removeFinder: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default compose(
    withStyles(styles)
)(DefineFinders);
