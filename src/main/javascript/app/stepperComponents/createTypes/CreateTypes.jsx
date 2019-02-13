import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';

const TypeItem = ({name}) => (
    <ListItem>
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({nodeTypes, addType}) => (
    <Grid container>
        <Grid item>
            <Paper>
                <List subheader={<ListSubheader>Node type</ListSubheader>}>
                    <Button onClick={() => addType({typeName: 'SuperType', nodeType: 'jnt;something'})}>
                        Add new type
                        <Add/>
                    </Button>
                    {
                        nodeTypes.map(type => (<TypeItem key={type.name} {...type}/>))
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
                    </Button>
                </List>
            </Paper>
        </Grid>
    </Grid>
);

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired
};

export default CreateTypes;
