import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, List, ListItem, ListItemText, ListSubheader} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AddModifyFinderDialog from './addModifyFinderDialog/index';

const DefineFinders = ({addFinder, removeFinder, nodeTypes, selection, selectType}) => {
    const [isDialogOpen, setDialogState] = useState(false);
    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper>
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
                    <Paper>
                        <List subheader={<ListSubheader>Finders</ListSubheader>}>
                            <ListItem button onClick={() => setDialogState(true)}>
                                Add Finder <Add/>
                            </ListItem>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.queries.map(finder => {
                                        return (
                                            <ListItem>
                                                <ListItemText primary={finder.name}/>
                                            </ListItem>
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

DefineFinders.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addFinder: PropTypes.func.isRequired,
    removeFinder: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default DefineFinders;
