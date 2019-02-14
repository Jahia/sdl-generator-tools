import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AddTypeDialog from './addModifyTypeDialog';

const TypeItem = ({name, isSelected, selectType}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({nodeTypes, addType}) => {
    const [addTypeDialogShown, showAddTypeDialog] = useState(false);
    const [selectedTypeName, selectType] = useState(null);

    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper>
                        <List subheader={<ListSubheader>Node type</ListSubheader>}>
                            <Button onClick={() => showAddTypeDialog(true)}>
                                Add new type
                                <Add/>
                            </Button>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selectedTypeName}
                                              selectType={selectType}/>
))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <List subheader={<ListSubheader>Properties</ListSubheader>}>
                            <Button>
                                Add a new property
                                <Add/>
                                {
                                    nodeTypes.filter(type => selectedTypeName === type.name)
                                }
                            </Button>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddTypeDialog open={addTypeDialogShown}
                           closeDialog={() => showAddTypeDialog(false)}
                           addType={addType}/>
        </React.Fragment>
    );
};

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired
};

export default CreateTypes;
